import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest } from '@/lib/authUtils';

// Validation schema for incoming inquiry data
const InquirySchema = z.object({
  propertyId: z.string().min(1, { message: "Property ID is required" }),
  message: z.string().min(5, { message: "Message must be at least 5 characters" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Valid email is required" }),
  moveInDate: z.string().datetime().optional(),
});

/**
 * Create a new inquiry
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from auth token (if logged in)
    const userId = await getUserIdFromRequest();
    
    // For inquiries, users should be logged in
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate inquiry data
    const validationResult = InquirySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid inquiry data", 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { propertyId, message, phone, email, moveInDate } = validationResult.data;
    
    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    
    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }
    
    // Create the inquiry
    const inquiry = await prisma.inquiry.create({
      data: {
        property: { connect: { id: propertyId } },
        user: { connect: { id: userId } },
        message,
        phone,
        email,
        moveInDate: moveInDate ? new Date(moveInDate) : undefined,
        status: "PENDING"
      },
    });
    
    // Update property statistics
    await prisma.propertystat.upsert({
      where: { propertyId },
      update: {
        inquiryCount: { increment: 1 },
      },
      create: {
        propertyId,
        inquiryCount: 1,
        viewCount: 0,
        favoriteCount: 0,
      },
    });
    
    return NextResponse.json({ 
      success: true,
      inquiry: {
        id: inquiry.id,
        status: inquiry.status,
        createdAt: inquiry.createdAt
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500 }
    );
  }
}

/**
 * Get inquiries for the logged-in user
 */
export async function GET(request: NextRequest) {
  try {
    // Get user ID from auth token
    const userId = await getUserIdFromRequest();
    
    // For fetching inquiries, users should be logged in
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'user'; // 'user' or 'landlord'
    
    // Build query based on role
    let inquiries;
    
    if (role === 'landlord') {
      // For landlords, get inquiries for their properties
      inquiries = await prisma.inquiry.findMany({
        where: {
          property: {
            ownerId: userId,
          },
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // For regular users, get their own inquiries
      inquiries = await prisma.inquiry.findMany({
        where: {
          userId,
        },
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              images: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  landlordProfile: {
                    select: {
                      companyName: true,
                      phoneNumber: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
    
    return NextResponse.json({ inquiries });
    
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
} 