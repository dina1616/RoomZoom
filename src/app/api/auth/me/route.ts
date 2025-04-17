import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/authUtils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) { // Use NextRequest if needed for more details
  // For development purposes, always return a mock user when in development
  if (process.env.NODE_ENV === 'development') {
    // Return a mock admin user for development
    const mockUser = {
      id: 'mock-user-id',
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({ user: mockUser });
  }
  
  try {
    const token = cookies().get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      // Token is invalid or expired, clear the cookie potentially
      const response = NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
      return response;
    }

    // Fetch user data based on decoded userId (excluding password)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        // Include other necessary fields like landlordProfile if needed
      },
    });

    if (!user) {
        // User specified in token not found in DB (should not happen ideally)
         const response = NextResponse.json({ error: 'User not found' }, { status: 404 });
         response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
         return response;
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("/api/auth/me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  } finally {
     await prisma.$disconnect();
  }
} 