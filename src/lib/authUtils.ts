import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

const SALT_ROUNDS = 10;
// Ensure JWT_SECRET is set in your .env file!
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined in .env file");
  // In production, you might want to throw an error or exit
  // throw new Error("FATAL ERROR: JWT_SECRET is not defined."); 
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
 * @param expiresIn - Optional expiration time (e.g., '1h', '7d'). Defaults to '1d'.
 * @returns The generated JWT string, or null if JWT_SECRET is not set.
 */
export const generateToken = (userId: string, email: string, role: string, expiresIn: string = '1d'): string | null => {
  if (!JWT_SECRET) return null; // Should not happen if check at top works

  const payload = { userId, email, role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verifies a JWT.
 * @param token - The JWT string to verify.
 * @returns The decoded payload if the token is valid, otherwise null.
 */
export const verifyToken = (token: string): Record<string, any> | null => {
  if (!JWT_SECRET) return null;

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
    // Note: Consider disconnecting prisma client if instantiated here
};

// Ensure prisma client disconnects when utils are no longer needed if instantiated locally
// process.on('beforeExit', async () => { await prisma.$disconnect(); }); 