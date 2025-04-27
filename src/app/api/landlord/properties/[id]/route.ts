import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/authUtils';

interface Inquiry {
  id: string;
  status: string;
  createdAt: Date;
  message: string;
  email: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const propertyId = params.id;
  
  if (!propertyId) {
    return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
  }
  
  try {
    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Check if the property exists and belongs to the user
    const property = await prisma.property.findFirst({
      where: { 
        id: propertyId,
        ownerId: userId 
      },
      include: {
        media: true,
        amenities: true
      }
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found or not owned by you' }, { status: 404 });
    }
    
    // Get property stats separately
    let stats = null;
    try {
      // Manually construct the stats query using a findUnique operation instead of a raw query
      const propertyStats = await prisma.propertyStat.findUnique({
        where: { propertyId }
      });
      
      if (propertyStats) {
        stats = propertyStats;
      }
    } catch (error) {
      console.error('Error fetching property stats:', error);
      // Continue execution even if stats fetch fails
    }
    
    // Get inquiries for this property
    let inquiries: Inquiry[] = [];
    try {
      inquiries = await prisma.inquiry.findMany({
        where: { propertyId },
        select: {
          id: true,
          status: true,
          createdAt: true,
          message: true,
          email: true
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      // Continue execution even if inquiries fetch fails
    }
    
    // Return the property with stats and inquiries
    return NextResponse.json({ 
      property: {
        ...property,
        stats,
        inquiries
      }
    });
    
  } catch (error) {
    console.error('Error fetching property statistics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 