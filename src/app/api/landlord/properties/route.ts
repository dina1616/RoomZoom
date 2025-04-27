import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/authUtils';
import { Prisma } from '@prisma/client';

// Force dynamic route to prevent caching
export const dynamic = 'force-dynamic';

// Define interfaces for our data structures
interface PropertyWithRelations extends Prisma.PropertyGetPayload<{
  include: {
    media: true;
    amenities: true;
  }
}> {}

interface PropertyStat {
  id: string;
  propertyId: string;
  viewCount: number;
  inquiryCount: number;
  favoriteCount: number;
  lastViewed: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface PropertyInquiry {
  id: string;
  propertyId: string;
  status: string;
  createdAt: Date | string;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get('take') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    // First fetch properties with media and amenities
    const properties = await prisma.property.findMany({
      where: { ownerId: userId },
      include: { 
        media: true, 
        amenities: true
      },
      take,
      skip,
      orderBy: { createdAt: 'desc' },
    });

    // Check if properties exist before proceeding
    if (!properties || properties.length === 0) {
      return NextResponse.json({ 
        properties: [], 
        viewsCount: 0,
        inquiriesCount: 0
      });
    }

    const propertyIds = properties.map(prop => prop.id);
    
    // Get property stats using the Prisma model directly instead of raw SQL
    const propertyStats = await prisma.propertyStat.findMany({
      where: {
        propertyId: {
          in: propertyIds
        }
      }
    });
    
    // Fetch inquiries with Prisma model instead of raw SQL
    const inquiries = await prisma.inquiry.findMany({
      where: {
        propertyId: {
          in: propertyIds
        }
      },
      select: {
        id: true,
        propertyId: true,
        status: true,
        createdAt: true
      }
    });
    
    // Group inquiries by property ID
    const inquiriesByProperty: Record<string, PropertyInquiry[]> = {};
    inquiries.forEach(inquiry => {
      if (!inquiriesByProperty[inquiry.propertyId]) {
        inquiriesByProperty[inquiry.propertyId] = [];
      }
      inquiriesByProperty[inquiry.propertyId].push(inquiry);
    });
    
    // Group stats by property ID
    const statsByProperty: Record<string, PropertyStat> = {};
    propertyStats.forEach(stat => {
      statsByProperty[stat.propertyId] = stat as PropertyStat;
    });
    
    // Combine the data
    const enrichedProperties = properties.map(property => ({
      ...property,
      stats: statsByProperty[property.id] || null,
      inquiries: inquiriesByProperty[property.id] || []
    }));
    
    // Calculate totals
    let totalViews = 0;
    let totalInquiries = 0;
    
    propertyStats.forEach(stat => {
      totalViews += stat.viewCount || 0;
    });
    
    totalInquiries = inquiries.length;
    
    return NextResponse.json({ 
      properties: enrichedProperties, 
      viewsCount: totalViews,
      inquiriesCount: totalInquiries
    });
  } catch (error) {
    console.error('Error fetching landlord properties:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Add a POST method to create a new property
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get property data from request body
    const propertyData = await request.json();
    
    // Extract amenities data
    const { amenities, media, ...propertyValues } = propertyData;
    
    // Create the property with a transaction to ensure all related data is created
    const result = await prisma.$transaction(async (tx) => {
      // Create the main property
      const property = await tx.property.create({
        data: {
          ...propertyValues,
          ownerId: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          // Create the stats for this property in the same operation 
          stats: {
            create: {
              viewCount: 0,
              inquiryCount: 0,
              favoriteCount: 0,
              lastViewed: new Date()
            }
          }
        }
      });
      
      // If amenities are provided, connect them to the property
      if (amenities && amenities.length > 0) {
        // Connect each amenity to the property
        for (const amenityId of amenities) {
          await tx.property.update({
            where: { id: property.id },
            data: {
              amenities: {
                connect: { id: amenityId }
              }
            }
          });
        }
      }
      
      // If media items are provided, create them
      if (media && media.length > 0) {
        for (let i = 0; i < media.length; i++) {
          await tx.media.create({
            data: {
              url: media[i].url,
              type: media[i].type || 'IMAGE',
              order: i + 1,
              propertyId: property.id
            }
          });
        }
      }
      
      // Return the created property with relations
      return await tx.property.findUnique({
        where: { id: property.id },
        include: {
          media: true,
          amenities: true
        }
      });
    });
    
    return NextResponse.json({ 
      success: true, 
      property: result 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ 
      error: 'Failed to create property', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 