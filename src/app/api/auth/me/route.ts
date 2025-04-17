import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the token from the cookie
    const token = cookies().get('authToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { user: null, isAuthenticated: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the token
    const secret = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production';
    const decoded = verify(token, secret) as { id: string };
    
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, isAuthenticated: false, message: 'User not found' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user, isAuthenticated: true });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { user: null, isAuthenticated: false, message: 'Authentication failed' },
      { status: 401 }
    );
  }
} 