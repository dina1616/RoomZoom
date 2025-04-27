import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { getUserIdFromRequest } from '@/lib/authUtils'; // Import helper

// Create a single PrismaClient instance and try to handle connection errors
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
  // For SQLite, create a connection immediately to verify it works
  prisma.$connect();
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  // We'll handle this in the route handlers
}

const mockProperties = [
  {
    id: '1',
    title: 'Modern Studio in Camden',
    price: 1200,
    address: '123 Camden High Street',
    tubeStation: 'Camden Town',
    bedrooms: 1,
    bathrooms: 1,
    images: ['/images/properties/rz1.avif', '/images/properties/property1-2.jpg'],
    amenities: {
      wifi: true,
      laundry: true,
      kitchen: true,
      waterBills: true,
      petsAllowed: false,
    },
    rating: 4.5,
    reviewCount: 12,
    availableFrom: new Date('2024-01-15'),
    propertyType: 'Studio',
  },
  {
    id: '2',
    title: 'Spacious 2-Bed in Greenwich',
    price: 1800,
    address: '45 Greenwich High Road',
    tubeStation: 'Greenwich',
    bedrooms: 2,
    bathrooms: 1,
    images: ['/images/properties/rz2.avif', '/images/properties/property2-2.jpg'],
    amenities: {
      wifi: true,
      laundry: true,
      kitchen: true,
      waterBills: false,
      petsAllowed: true,
    },
    rating: 4.8,
    reviewCount: 8,
    availableFrom: new Date('2024-02-01'),
    propertyType: 'Apartment',
  },
  {
    id: '3',
    title: 'Cozy Room in Shared House',
    price: 800,
    address: '78 Islington Park Street',
    tubeStation: 'Angel',
    bedrooms: 1,
    bathrooms: 1,
    images: ['/images/properties/rz3.avif', '/images/properties/property3-2.jpg'],
    amenities: {
      wifi: true,
      laundry: true,
      kitchen: true,
      waterBills: true,
      petsAllowed: false,
    },
    rating: 4.2,
    reviewCount: 15,
    availableFrom: new Date('2024-01-10'),
    propertyType: 'Room',
  },
];

// Zod schema for property creation (expand as needed)
const CreatePropertySchema = z.object({
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
  // Optional fields - Add validation if they become required
  borough: z.string().optional(),
  tubeStation: z.string().optional(),
  // TODO: Add structured address, amenities, media validation later
});

export async function GET(request: NextRequest) {
  // Check if we're requesting amenities
  const { searchParams } = new URL(request.url);
  const amenitiesOnly = searchParams.get('amenitiesOnly');
  
  if (amenitiesOnly === 'true') {
    try {
      const amenities = await prisma.amenity.findMany({
        orderBy: { name: 'asc' }
      });
      
      return NextResponse.json({ amenities });
    } catch (error) {
      console.error('Error fetching amenities:', error);
      return NextResponse.json(
        { error: 'Failed to fetch amenities' },
        { status: 500 }
      );
    }
  }
  
  // If prisma is not properly initialized, return mock data or error
  if (!prisma) {
    console.error("Database connection not available. Check DATABASE_URL environment variable.");
    // For development, return mock data so UI can still function
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(mockProperties);
    } else {
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 } // Service Unavailable
      );
    }
  }

  // Check if we're requesting featured properties
  const featuredParam = searchParams.get('featured');
  if (featuredParam === 'true') {
    try {
      // Return a small subset of properties as featured
      const properties = await prisma.property.findMany({
        take: 6,
        include: {
          owner: { select: { name: true } }
        },
        orderBy: { 
          createdAt: 'desc' // Newest first for featured items
        }
      });
      
      return NextResponse.json(properties);
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(mockProperties.slice(0, 3));
      }
      return NextResponse.json(
        { error: "Failed to fetch featured properties" },
        { status: 500 }
      );
    } finally {
      // No need to disconnect on each request, will be handled at app shutdown
    }
  }

  // Extract filter parameters
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const amenitiesParams = searchParams.getAll('amenity');
  // Add other potential filters here (bedrooms, propertyType, etc.)
  // const bedroomsParam = searchParams.get('bedrooms');

  // Build Prisma where clause dynamically
  const where: any = {
    // Don't filter by verified status to show all properties
  };

  if (minPriceParam) {
    const minPrice = parseInt(minPriceParam, 10);
    if (!isNaN(minPrice)) {
      where['price'] = { ...(where['price'] || {}), gte: minPrice };
    }
  }

  if (maxPriceParam) {
    const maxPrice = parseInt(maxPriceParam, 10);
    if (!isNaN(maxPrice)) {
      where['price'] = { ...(where['price'] || {}), lte: maxPrice };
    }
  }

  if (amenitiesParams && amenitiesParams.length > 0) {
    // SQLite-compatible query for amenities
    where['amenities'] = {
      some: {
        name: {
          in: amenitiesParams,
        },
      },
    };
    
    // PostgreSQL approach (kept for reference)
    /*
    where['amenities'] = {
      every: {
        name: {
          in: amenitiesParams,
        },
      },
    };
    */
  }

  // Add logic for other filters (bedrooms, etc.)
  // if (bedroomsParam) { ... }

  // Pagination and sorting params
  const take = parseInt(searchParams.get('take') || '10', 10);
  const skip = parseInt(searchParams.get('skip') || '0', 10);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  try {
    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true } },
        reviews: { select: { rating: true } },
        media: { select: { id: true, url: true, type: true, order: true }, orderBy: { order: 'asc' } },
        amenities: true
      },
      take,
      skip,
      orderBy: { [sortBy]: sortOrder }
    });

    // Calculate average rating
    const propertiesWithRating = properties.map((property: any) => {
      const ratings = property.reviews.map((review: any) => review.rating);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
        : null;
      
      // Process and transform media for easier consumption in the frontend
      const processedMedia = property.media && property.media.length > 0
        ? property.media
        : [];
      
      // Generate an image array from media for backwards compatibility
      const images = processedMedia.length > 0
        ? processedMedia.map((item: any) => item.url)
        : ['/images/placeholder-property.jpg'];
      
      return {
        ...property,
        rating: avgRating,
        reviewCount: ratings.length,
        images: images
      };
    });

    return NextResponse.json({ properties: propertiesWithRating });
  } catch (error) {
    console.error("Error fetching properties:", error);
    // Log the failing where clause for debugging
    console.error("Failing where clause:", JSON.stringify(where, null, 2)); 
    
    // Fallback to mock data in development
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(mockProperties);
    }
    
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  } finally {
    // Don't disconnect on each request
    // await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ error: 'Unauthorized: Must be logged in to create property' }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 2. Validate Input
    const validation = CreatePropertySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const validatedData = validation.data;
    
    // Extract amenities from the request body
    const { amenities, ...propertyData } = body;
    
    // 3. Create Property with properly linked amenities
    const newProperty = await prisma.property.create({
      data: {
        ...propertyData,
        available: new Date(validatedData.available), // Convert date string to Date object
        ownerId: userId, // Link to the authenticated user
        verified: false, // New properties start as unverified
        
        // Connect amenities if they exist in the database
        // This will create connections for amenities that were toggled to true
        amenities: amenities ? {
          connect: await getAmenityConnectionsFromObject(amenities)
        } : undefined,
      },
      // Include necessary data in the response
      include: {
        owner: { select: { id: true, name: true }},
        amenities: true,
      }
    });

    return NextResponse.json({ property: newProperty }, { status: 201 });

  } catch (error: unknown) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  } finally {
    // Don't disconnect on each request
    // await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
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
    const body = await request.json();
    
    // Extract property ID from the URL path
    const url = new URL(request.url);
    const paths = url.pathname.split('/');
    const propertyId = paths[paths.length - 1];
    
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }
    
    // Check if the property exists and belongs to the user
    const existingProperty = await prisma.property.findUnique({
      where: { 
        id: propertyId,
      },
      select: { ownerId: true }
    });
    
    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    if (existingProperty.ownerId !== userId) {
      return NextResponse.json({ error: 'You are not authorized to update this property' }, { status: 403 });
    }

    // 2. Validate Input
    const validation = CreatePropertySchema.safeParse(body);
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
      where: { id: propertyId },
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
