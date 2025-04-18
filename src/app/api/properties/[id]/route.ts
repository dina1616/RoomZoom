import { NextResponse, NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
// Import PrismaClientKnownRequestError directly from Prisma
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { z } from 'zod';
// Import ownership check helper
import { checkPropertyOwnershipOrAdmin } from '@/lib/authUtils'; 
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
                }
            },
        });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Calculate average rating
        const totalRating = property.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
        const averageRating = property.reviews.length > 0 ? totalRating / property.reviews.length : 0;

        // Add average rating to the response object
        const propertyWithAvgRating = { 
            ...property, 
            averageRating: parseFloat(averageRating.toFixed(1)) // Format to 1 decimal place
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
  title: z.string().min(5).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  propertyType: z.string().min(1).optional(), 
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(1).optional(),
  available: z.string().datetime().optional(), 
  borough: z.string().optional().nullable(), // Allow null to clear optional string fields
  tubeStation: z.string().optional().nullable(),
  images: z.string().optional(),
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
