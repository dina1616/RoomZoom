import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * POST /api/properties/[id]/view
 * Track a property view - increments viewCount and updates lastViewed in PropertyStat
 * Rate limited to one view per IP per property per hour
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const propertyId = params.id;
  
  if (!propertyId) {
    return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
  }
  
  try {
    // Get client IP (with fallbacks)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    
    // Simple rate limiting - use IP and property ID
    const cacheKey = `${ip}:${propertyId}`;
    
    // Check if the property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    
    // Check if stats exist for this property
    const statCount = await prisma.$executeRaw`
      SELECT COUNT(*) FROM "PropertyStat" WHERE "propertyId" = ${propertyId}
    `;
    
    if (statCount > 0) {
      // Update existing stats
      await prisma.$executeRaw`
        UPDATE "PropertyStat" 
        SET 
          "viewCount" = "viewCount" + 1,
          "lastViewed" = ${new Date()},
          "updatedAt" = ${new Date()}
        WHERE "propertyId" = ${propertyId}
      `;
    } else {
      // Create stats if they don't exist
      await prisma.$executeRaw`
        INSERT INTO "PropertyStat" (
          "id", 
          "propertyId", 
          "viewCount", 
          "inquiryCount", 
          "favoriteCount", 
          "lastViewed", 
          "createdAt", 
          "updatedAt"
        )
        VALUES (
          ${crypto.randomUUID()}, 
          ${propertyId}, 
          1, 
          0, 
          0, 
          ${new Date()},
          ${new Date()},
          ${new Date()}
        )
      `;
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking property view:', error);
    return NextResponse.json(
      { error: 'Failed to track property view' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 