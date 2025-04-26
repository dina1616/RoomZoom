import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminFromRequest } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  // Only admins can fetch unverified properties
  const isAdmin = await isAdminFromRequest();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const properties = await prisma.property.findMany({
      where: { verified: false },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        media: { select: { url: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' }
    });
    // Map to minimal shape
    const data = properties.map(p => ({
      id: p.id,
      title: p.title,
      addressString: p.addressString,
      owner: p.owner,
      createdAt: p.createdAt,
      image: p.media.length ? p.media[0].url : null,
    }));
    return NextResponse.json({ properties: data });
  } catch (error) {
    console.error('Error fetching unverified properties:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 