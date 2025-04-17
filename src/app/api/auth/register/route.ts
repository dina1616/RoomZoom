import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/authUtils';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define validation schema using Zod
const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  name: z.string().optional(), // Name is optional
  // role: z.enum(['STUDENT', 'LANDLORD']).optional().default('STUDENT') // Default role is STUDENT
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 } // Conflict
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name,
        role: 'STUDENT', // Default to STUDENT upon registration for now
      },
      // Select only necessary fields to return (exclude password)
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(user, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 