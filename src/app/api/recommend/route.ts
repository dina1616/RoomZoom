import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get('propertyId');
  const limit = parseInt(searchParams.get('limit') || '5', 10);

  if (!propertyId) {
    return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
  }

  // Fetch the base property
  const base = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!base) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const price = base.price;
  const minPrice = price * 0.75;
  const maxPrice = price * 1.25;

  try {
    const recs = await prisma.property.findMany({
      where: {
        id: { not: propertyId },
        borough: base.borough,
        propertyType: base.propertyType,
        price: { gte: minPrice, lte: maxPrice },
      },
      include: {
        media: { select: { id: true, url: true } },
        amenities: true,
        reviews: { select: { rating: true } }
      },
      take: limit,
      orderBy: { price: 'asc' }
    });

    // Compute average rating and review count
    const suggestions = recs.map(p => {
      const ratings = p.reviews.map(r => r.rating);
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
      return {
        ...p,
        rating: avgRating,
        reviewCount: ratings.length
      };
    });

    return NextResponse.json({ properties: suggestions });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
} 