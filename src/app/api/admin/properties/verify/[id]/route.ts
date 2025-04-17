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
    return !!decoded && typeof decoded === 'object' && decoded.role === 'ADMIN';
}

// PATCH /api/admin/properties/verify/[id]
export async function PATCH(
    request: Request, 
    { params }: { params: { id: string } }
) {
    // Protect route: Check if user is admin
    if (!(await isAdminUser(request))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const propertyId = params.id;

    if (!propertyId) {
        return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    try {
        const updatedProperty = await prisma.property.update({
            where: {
                id: propertyId,
            },
            data: {
                verified: true, // Set verified to true
            },
            select: { // Return minimal confirmation
                id: true,
                verified: true
            }
        });

        if (!updatedProperty) {
             return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        console.log(`Property ${propertyId} verified by admin.`);
        return NextResponse.json({ property: updatedProperty });

    } catch (error) {
        console.error(`Failed to verify property ${propertyId}:`, error);
        return NextResponse.json({ error: 'Failed to update property status' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 