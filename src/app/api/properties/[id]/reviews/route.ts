import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/authUtils';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for review input
const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5, { message: "Rating must be between 1 and 5" }),
  comment: z.string().min(1, { message: "Comment cannot be empty" }).max(1000, { message: "Comment too long" }), // Add max length
});

// POST /api/properties/[id]/reviews
export async function POST(
    request: NextRequest, 
    { params }: { params: { id: string } }
) {
    const id = params.id;
    if (!id) {
        return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // 1. Verify User Authentication
    const token = cookies().get('auth_token')?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    const userId = decoded.userId;

    try {
        const body = await request.json();

        // 2. Validate Input Data
        const validation = ReviewSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid input", details: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }
        const { rating, comment } = validation.data;

        // 3. Check if property exists (optional but good practice)
        const propertyExists = await prisma.property.findUnique({
            where: { id: id },
            select: { id: true } // Only select id for existence check
        });
        if (!propertyExists) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // 4. Optional: Check if user has already reviewed this property
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: userId,
                propertyId: id,
            }
        });
        if (existingReview) {
             return NextResponse.json({ error: 'You have already reviewed this property' }, { status: 409 }); // Conflict
        }

        // 5. Create the review
        const newReview = await prisma.review.create({
            data: {
                rating,
                comment,
                userId,
                propertyId: id,
            },
            include: { // Include user info for the response if needed
                user: {
                    select: { id: true, name: true }
                }
            }
        });

        return NextResponse.json({ review: newReview }, { status: 201 });

    } catch (error) {
        console.error(`Failed to create review for property ${id}:`, error);
        return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// GET /api/properties/[id]/reviews (Example: Fetch reviews for a property)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
     const id = params.id;
    if (!id) {
        return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Optional: Add pagination via search params (e.g., ?page=1&limit=10)
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    try {
        const reviews = await prisma.review.findMany({
            where: { propertyId: id },
            include: {
                user: { select: { id: true, name: true } } // Include reviewer's name
            },
            orderBy: {
                createdAt: 'desc' // Show newest reviews first
            },
            skip: skip,
            take: limit,
        });

        const totalReviews = await prisma.review.count({ where: { propertyId: id } });
        const totalPages = Math.ceil(totalReviews / limit);

        return NextResponse.json({ 
            reviews, 
            pagination: { 
                currentPage: page, 
                totalPages, 
                totalReviews 
            }
        });

    } catch (error) {
         console.error(`Failed to fetch reviews for property ${id}:`, error);
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
} 