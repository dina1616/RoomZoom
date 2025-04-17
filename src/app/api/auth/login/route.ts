import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { comparePassword, generateToken } from '@/lib/authUtils';
import { z } from 'zod';
import { cookies } from 'next/headers'; // Import cookies

const prisma = new PrismaClient();

// Define validation schema using Zod
const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password cannot be empty" }), // Basic check for login
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" }, 
        { status: 401 } // Unauthorized
      );
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 } // Unauthorized
      );
    }

    // Generate JWT
    const token = generateToken(user.id, user.email, user.role);

    if (!token) {
        // This should only happen if JWT_SECRET is missing, which is checked in authUtils
        console.error("Failed to generate token, JWT_SECRET might be missing.")
        return NextResponse.json({ error: "Failed to process login" }, { status: 500 });
    }

    // Set JWT in an httpOnly cookie
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax', // Lax is generally recommended
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days expiry (adjust as needed)
    });

    // Return user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 