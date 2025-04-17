import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { action, email, password, name, role } = await request.json();

    switch (action) {
      case 'register': {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          return NextResponse.json(
            { error: 'User already exists' },
            { status: 400 }
          );
        }

        // Hash password and create user
        const hashedPassword = await hash(password, 12);
        const user = await prisma.user.create({
          data: {
            email,
            name,
            password: hashedPassword,
            role: role || 'STUDENT', // Default to STUDENT if no role provided
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          },
        });

        return NextResponse.json(user);
      }

      case 'login': {
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Verify password
        const isValid = await compare(password, user.password);
        if (!isValid) {
          return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        }

        // Return user data without password
        const { password: _, ...userData } = user;
        return NextResponse.json(userData);
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
