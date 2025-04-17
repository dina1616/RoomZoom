import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/authUtils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to check admin role (can be moved to a shared lib)
async function isAdminUser(request: Request): Promise<boolean> {
    const token = cookies().get('auth_token')?.value;
    if (!token) return false;
    const decoded = verifyToken(token);
    // Check if decoded exists, is an object, and has role property
    return !!decoded && typeof decoded === 'object' && decoded.role === 'ADMIN';
}

// GET /api/admin/properties/unverified
export async function GET(request: Request) {
    // Protect route: Check if user is admin
    if (!(await isAdminUser(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const properties = await prisma.property.findMany({
            where: {
                verified: false, // Fetch only unverified
            },
            include: {
                owner: { // Include owner info needed for display
                    select: { name: true, email: true }
                }
            },
            orderBy: {
                createdAt: 'asc', // Show oldest first
            }
        });
        return NextResponse.json({ properties });
    } catch (error) {
        console.error("Failed to fetch unverified properties:", error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 