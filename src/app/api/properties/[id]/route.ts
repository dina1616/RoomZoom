import { NextResponse, NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
// Import PrismaClientKnownRequestError directly from Prisma
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z } from 'zod';
// Import ownership check helper
import { checkPropertyOwnershipOrAdmin, getUserIdFromRequest } from '@/lib/authUtils'; 
// Use the singleton Prisma client
import prisma from '@/lib/prisma';

// GET /api/properties/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const propertyId = params.id;
    if (!propertyId) {
        return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: {
                // Include only valid relation fields
                owner: {
                    select: { 
                        id: true, 
                        name: true, 
                        email: true,
                        landlordProfile: true
                    }
                },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                },
                media: {
                    select: {
                        id: true,
                        url: true,
                        type: true,
                        order: true
                    },
                    orderBy: {
                        order: 'asc'
                    }
                },
                amenities: true
            },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Get property stats using Prisma client instead of raw SQL
        let stats = null;
        try {
            const propertyStats = await prisma.propertyStat.findUnique({
                where: { propertyId }
            });
            
            if (propertyStats) {
                stats = propertyStats;
            }
        } catch (error) {
            console.error(`Error fetching stats for property ${propertyId}:`, error);
            // Continue execution even if stats fetch fails
        }

        // Calculate average rating
        const totalRating = property.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
        const averageRating = property.reviews.length > 0 ? totalRating / property.reviews.length : 0;

        // Add average rating and stats to the response object
        const propertyWithAvgRating = { 
            ...property, 
            averageRating: parseFloat(averageRating.toFixed(1)), // Format to 1 decimal place
            stats: stats
        };

        return NextResponse.json({ property: propertyWithAvgRating });

    } catch (error) {
        console.error(`Failed to fetch property ${propertyId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch property details' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// --- PATCH Handler for Property Update ---

// Define Zod schema for updatable fields (make all optional for PATCH)
const UpdatePropertySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.number().positive({ message: "Price must be a positive number" }),
  addressString: z.string().min(5, { message: "Address is required" }), 
  latitude: z.number(),
  longitude: z.number(),
  propertyType: z.string().min(1, { message: "Property type is required" }), 
  bedrooms: z.number().int().min(0, { message: "Bedrooms cannot be negative" }),
  bathrooms: z.number().int().min(1, { message: "Must have at least 1 bathroom" }),
  available: z.string().datetime({ message: "Invalid availability date format" }), // Expect ISO string
  // Optional fields
  borough: z.string().optional(),
  tubeStation: z.string().optional(),
});

export async function PATCH(
    request: NextRequest, 
    { params }: { params: { id: string } }
) {
    const propertyId = params.id;
    if (!propertyId) {
        return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // 1. Check Authorization (Owner or Admin)
    const isAuthorized = await checkPropertyOwnershipOrAdmin(propertyId);
    if (!isAuthorized) {
         return NextResponse.json({ error: 'Unauthorized: You do not own this property or are not an admin.' }, { status: 403 });
    }

    try {
        const body = await request.json();

        // 2. Validate Input Data
        const validation = UpdatePropertySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        
        // Prepare data for update (handle date conversion)
        const updateData = { ...validation.data };
        if (updateData.available) {
            updateData.available = new Date(updateData.available) as any; // Convert string to Date
        }

        // 3. Update the property - handle only direct property fields, not relations
        const updatedProperty = await prisma.property.update({
            where: { id: propertyId },
            data: updateData,
            include: {
                owner: { select: { id: true, name: true } },
                reviews: true
            },
        });

        return NextResponse.json({ property: updatedProperty });

    } catch (error) {
        console.error(`Failed to update property ${propertyId}:`, error);
        
        // Handle specific Prisma errors
        if (error instanceof PrismaClientKnownRequestError) {
            // Handle record not found
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Property not found' }, { status: 404 });
            }
            // Handle foreign key constraint failures
            if (error.code === 'P2003') {
                return NextResponse.json({ error: 'Invalid reference in update data' }, { status: 400 });
            }
        }
        
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// --- DELETE Handler (Placeholder - Needs Implementation) ---

export async function DELETE(
    request: NextRequest, 
    { params }: { params: { id: string } }
) {
    const propertyId = params.id;
    if (!propertyId) {
        return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // 1. Check Authorization (Owner or Admin)
    const isAuthorized = await checkPropertyOwnershipOrAdmin(propertyId);
    if (!isAuthorized) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        // 2. Delete the property
        await prisma.property.delete({
            where: { id: propertyId },
        });

        return new NextResponse(null, { status: 204 }); // No Content

    } catch (error) {
        console.error(`Failed to delete property ${propertyId}:`, error);
        
        // Handle specific Prisma errors
        if (error instanceof PrismaClientKnownRequestError) {
            // Handle record not found
            if (error.code === 'P2025') {
                return NextResponse.json({ error: 'Property not found' }, { status: 404 });
            }
            // Handle foreign key constraint failures
            if (error.code === 'P2003') {
                return NextResponse.json({ error: 'Cannot delete property with associated records' }, { status: 400 });
            }
        }
        
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// NOTE: Consider adding PUT/DELETE handlers here later for property editing/deletion
// Needs appropriate authorization checks (e.g., isOwner or isAdmin)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // If prisma is not properly initialized, return error
  if (!prisma) {
    console.error("Database connection not available. Check DATABASE_URL environment variable.");
    return NextResponse.json(
      { error: "Database connection error. Please try again later." },
      { status: 503 } // Service Unavailable
    );
  }

  // 1. Check Authentication
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: Must be logged in to update property' }, { status: 401 });
  }

  try {
    // Check if the property exists and belongs to the user
    const existingProperty = await prisma.property.findUnique({
      where: { 
        id,
      },
      select: { ownerId: true }
    });
    
    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    if (existingProperty.ownerId !== userId) {
      return NextResponse.json({ error: 'You are not authorized to update this property' }, { status: 403 });
    }

    const body = await request.json();

    // 2. Validate Input
    const validation = UpdatePropertySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const validatedData = validation.data;
    
    // Extract amenities from the request body
    const { amenities, ...propertyData } = body;
    
    // 3. Update Property with properly linked amenities
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        ...propertyData,
        available: new Date(validatedData.available), // Convert date string to Date object
        
        // Update amenities connections
        amenities: amenities ? {
          // Disconnect all existing connections
          set: [],
          // Connect newly selected amenities
          connect: await getAmenityConnectionsFromObject(amenities)
        } : undefined,
      },
      // Include necessary data in the response
      include: {
        owner: { select: { id: true, name: true }},
        amenities: true,
      }
    });

    return NextResponse.json({ property: updatedProperty }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// Helper function to transform amenities object to database connections
async function getAmenityConnectionsFromObject(amenities: Record<string, boolean>) {
  // Get all available amenities from the database
  const dbAmenities = await prisma.amenity.findMany();
  
  // Create a map of name to id for easy lookup
  const amenityMap = dbAmenities.reduce((acc, amenity) => {
    acc[amenity.name.toLowerCase()] = amenity.id;
    return acc;
  }, {} as Record<string, string>);
  
  // Get the IDs of the amenities that are set to true
  const connections = Object.entries(amenities)
    .filter(([_, value]) => value === true)
    .map(([key]) => {
      // Convert amenity key to match database naming (e.g., 'WiFi' to 'wifi')
      const normalizedKey = key.toLowerCase();
      
      // Try to find the matching amenity ID
      const amenityId = amenityMap[normalizedKey];
      
      // Return the ID if found, or log an error if not
      if (amenityId) {
        return { id: amenityId };
      } else {
        console.warn(`Amenity '${key}' not found in database`);
        return null;
      }
    })
    .filter(connection => connection !== null) as { id: string }[];
  
  return connections;
}
