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

  const { searchParams } = new URL(request.url);

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

  try {
    const properties = await prisma.property.findMany({
      where,
      include: {
        owner: {
          select: { 
            id: true,
            name: true,
          }
        },
        reviews: {
          select: { 
            rating: true 
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
      // TODO: Add pagination (take, skip)
      // TODO: Add sorting
    });

    // Calculate average rating
    const propertiesWithRating = properties.map((property: any) => {
      const ratings = property.reviews.map((review: any) => review.rating);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
        : null;
      
      return {
        ...property,
        rating: avgRating,
        reviewCount: ratings.length
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

  // Check if user is a landlord (or admin?) - Optional based on desired logic
  // const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true }});
  // if (user?.role !== 'LANDLORD' && user?.role !== 'ADMIN') { ... return 403 ... }

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

    // 3. Create Property
    const newProperty = await prisma.property.create({
      data: {
        ...validatedData,
        available: new Date(validatedData.available), // Convert date string to Date object
        ownerId: userId, // Link to the authenticated user
        verified: false, // New properties start as unverified (F-03)
        // --- Simplified Address/Amenity/Media Handling (for now) ---
        // Address: Assuming only addressString is provided for now.
        //          A more robust solution would create/link an Address record.
        // Amenities: Assuming no amenities passed initially. Landlord adds later?
        //            Or expect array of amenity names/ids to connect.
        // Media: Assuming no media passed initially. Landlord adds later?
        //        Or expect array of URLs (placeholder until proper upload).
      },
      // Include necessary data in the response
      include: {
          owner: { select: { id: true, name: true }},
          // include other relations if needed
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
