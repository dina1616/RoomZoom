import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { getUserIdFromRequest } from '@/lib/authUtils'; // Import helper

// Create a single PrismaClient instance and try to handle connection errors
let prisma: PrismaClient | null = null;

try {
  prisma = new PrismaClient();
  // For SQLite, create a connection immediately to verify it works
  prisma.$connect();
} catch (error) {
  console.error("Failed to initialize Prisma client:", error);
  prisma = null; // Make sure it's set to null if connection fails
  // We'll handle this in the route handlers
}

// Enhanced mock properties for fallback
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
    availableFrom: new Date('2024-01-15').toISOString(),
    propertyType: 'Studio',
    ownerId: 'mock-owner-id',
    description: 'A beautiful studio apartment in Camden',
    borough: 'Camden',
    latitude: 51.5390,
    longitude: -0.1426,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    availableFrom: new Date('2024-02-01').toISOString(),
    propertyType: 'Apartment',
    ownerId: 'mock-owner-id',
    description: 'A spacious 2-bedroom apartment in Greenwich',
    borough: 'Greenwich',
    latitude: 51.4777,
    longitude: -0.0165,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
    availableFrom: new Date('2024-01-10').toISOString(),
    propertyType: 'Room',
    ownerId: 'mock-owner-id',
    description: 'A cozy room in a shared house in Islington',
    borough: 'Islington',
    latitude: 51.5480,
    longitude: -0.1037,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

// Create more mock properties programmatically for better testing
for (let i = 4; i <= 30; i++) {
  const boroughs = ['Westminster', 'Camden', 'Hackney', 'Kensington', 'Newham'];
  const propertyTypes = ['Apartment', 'Studio', 'Room', 'House', 'Flat'];
  
  mockProperties.push({
    id: i.toString(),
    title: `Property ${i} in ${boroughs[i % boroughs.length]}`,
    price: 800 + (i * 50),
    address: `${i} ${boroughs[i % boroughs.length]} Street`,
    tubeStation: `${boroughs[i % boroughs.length]} Station`,
    bedrooms: (i % 4) + 1,
    bathrooms: (i % 3) + 1,
    images: ['/images/properties/rz1.avif', '/images/properties/property1-2.jpg'],
    amenities: {
      wifi: i % 2 === 0,
      laundry: i % 3 === 0,
      kitchen: true,
      waterBills: i % 4 === 0,
      petsAllowed: i % 5 === 0,
    },
    rating: 3 + Math.random() * 2,
    reviewCount: Math.floor(Math.random() * 20),
    availableFrom: new Date(Date.now() + i * 86400000).toISOString(),
    propertyType: propertyTypes[i % propertyTypes.length],
    ownerId: 'mock-owner-id',
    description: `Property ${i} description`,
    borough: boroughs[i % boroughs.length],
    latitude: 51.5 + (Math.random() * 0.1 - 0.05),
    longitude: -0.1 + (Math.random() * 0.1 - 0.05),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

// Mock amenities for fallback
const mockAmenities = [
  { id: '1', name: 'wifi' },
  { id: '2', name: 'laundry' },
  { id: '3', name: 'kitchen' },
  { id: '4', name: 'waterBills' },
  { id: '5', name: 'petsAllowed' },
  { id: '6', name: 'heating' },
  { id: '7', name: 'parking' },
  { id: '8', name: 'security' },
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
  // Create a copy of the searchParams
  const searchParams = new URL(request.url).searchParams;
  
  try {
    if (searchParams.get('amenitiesOnly') === 'true') {
      if (!prisma) {
        console.error("Prisma client is null. Using mock data.");
        return NextResponse.json({ amenities: mockAmenities });
      }
      const amenities = await prisma.amenity.findMany();
      return NextResponse.json({ amenities });
    }

    // If prisma is null, use mock data
    if (!prisma) {
      console.error("Prisma client is null. Using mock data.");
      return NextResponse.json({ 
        properties: mockProperties, 
        totalCount: mockProperties.length 
      });
    }

    // get the filter parameters from the query string
    const take = searchParams.get('take');
    const skip = searchParams.get('skip');
    const featuredParam = searchParams.get('featured');
    
    // Filtering parameters
    const location = searchParams.get('location');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice') as string) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice') as string) : undefined;
    const beds = searchParams.get('beds') ? parseInt(searchParams.get('beds') as string, 10) : undefined;
    
    // Build query filters
    const where: any = {};
    
    if (location) {
      where.OR = [
        { city: { contains: location, mode: 'insensitive' } },
        { borough: { contains: location, mode: 'insensitive' } },
        { postcode: { contains: location, mode: 'insensitive' } },
      ];
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    if (beds !== undefined) {
      if (beds === 4) {
        // 4+ bedrooms
        where.beds = { gte: 4 };
      } else {
        where.beds = beds;
      }
    }
    
    // Fetch properties with the given filters
    const properties = await prisma!.property.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true } },
        reviews: { select: { id: true, rating: true } },
        media: { select: { url: true } },
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
    });
    
    // Process properties for client consumption
    const processedProperties = properties.map(property => {
      // Calculate average rating
      const averageRating = property.reviews.length > 0
        ? property.reviews.reduce((sum, review) => sum + review.rating, 0) / property.reviews.length
        : null;

      // Format images array
      const images = property.media?.length > 0
        ? property.media.map(m => m.url)
        : (property.images ? 
            (typeof property.images === 'string' ? [property.images] : property.images) 
            : []);

      return {
        ...property,
        averageRating,
        reviewCount: property.reviews.length,
        images
      };
    });
    
    // Count total properties for pagination
    const totalCount = await prisma!.property.count({ where });

    if (featuredParam === 'true') {
      return NextResponse.json(processedProperties.slice(0, 6));
    }

    return NextResponse.json({
      properties: processedProperties,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    // Fallback to mock data in all environments when there's an error
    const take = parseInt(searchParams.get('take') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    return NextResponse.json(mockProperties.slice(skip, skip + take));
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
  if (!prisma) {
    throw new Error("Database connection not available");
  }

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
    .filter((connection): connection is { id: string } => connection !== null);
  
  return connections;
}
