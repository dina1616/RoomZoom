import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const SALT_ROUNDS = 10;
// Use environment variables with fallbacks for better DX
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  console.error("❌ FATAL ERROR: JWT_SECRET is not defined in .env file");
  // In development, we'll continue with a warning
  // In production, we should throw an error
  if (process.env.NODE_ENV === 'production') {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined.");
  }
}

/**
 * Hashes a plain text password.
 * @param password - The plain text password.
 * @returns A promise that resolves to the hashed password.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares a plain text password with a hash.
 * @param password - The plain text password.
 * @param hash - The hashed password to compare against.
 * @returns A promise that resolves to true if the password matches the hash, false otherwise.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generates a JWT for a user.
 * @param userId - The user ID to include in the token payload.
 * @param email - The user email to include.
 * @param role - The user role.
 * @param expiresIn - Optional expiration time (e.g., '1h', '7d'). Defaults to environment variable or '7d'.
 * @returns The generated JWT string, or null if JWT_SECRET is not set.
 */
export const generateToken = (
  userId: string, 
  email: string, 
  role: string, 
  expiresIn: string = JWT_EXPIRES_IN
): string | null => {
  if (!JWT_SECRET) {
    console.error("Failed to generate token: JWT_SECRET is not defined");
    return null;
  }

  const payload = { userId, email, role };
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error("Token generation failed:", error);
    return null;
  }
};

/**
 * Verifies a JWT.
 * @param token - The JWT string to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export const verifyToken = (token: string): Record<string, any> | null => {
  if (!JWT_SECRET) {
    console.error("Failed to verify token: JWT_SECRET is not defined");
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, any>;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};

/**
 * Checks if the current user from the request token is an Admin.
 * @returns boolean
 */
export const isAdminFromRequest = async (): Promise<boolean> => {
    const token = cookies().get('auth_token')?.value;
    if (!token) return false;
    const decoded = verifyToken(token);
    return !!decoded && typeof decoded === 'object' && decoded.role === 'ADMIN';
};

/**
 * Gets the current user ID from the request token.
 * @returns userId string | null
 */
export const getUserIdFromRequest = async (): Promise<string | null> => {
    const token = cookies().get('auth_token')?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    return (decoded && typeof decoded === 'object' && decoded.userId) ? decoded.userId as string : null;
};

/**
 * Get the complete user data from the request token
 * @returns User object or null
 */
export const getUserFromRequest = async () => {
    const userId = await getUserIdFromRequest();
    if (!userId) return null;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                landlordProfile: {
                    select: {
                        companyName: true,
                        phoneNumber: true,
                        isVerified: true,
                    }
                }
            }
        });
        return user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
};

/**
 * Checks if the current user from the request token owns the property or is an Admin.
 * @param propertyId - The ID of the property to check ownership for.
 * @returns A promise resolving to true if authorized, false otherwise.
 */
export const checkPropertyOwnershipOrAdmin = async (propertyId: string): Promise<boolean> => {
    const token = cookies().get('auth_token')?.value;
    if (!token) return false;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return false;

    // Admins have access
    if (decoded.role === 'ADMIN') {
        return true;
    }

    // Check if the user owns the property
    try {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { ownerId: true }
        });
        
        return property?.ownerId === decoded.userId;
    } catch (error) {
        console.error("Error checking property ownership:", error);
        return false;
    }
};

// Ensure prisma client disconnects when utils are no longer needed if instantiated locally
// process.on('beforeExit', async () => { await prisma.$disconnect(); }); 