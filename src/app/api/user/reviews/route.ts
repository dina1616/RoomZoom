import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromRequest();
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        property: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 