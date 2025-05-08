import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getUserIdFromRequest, isAdminFromRequest } from '@/lib/authUtils';

// Schema for updating inquiry
const UpdateInquirySchema = z.object({
  status: z.enum(['PENDING', 'RESPONDED', 'CLOSED']),
  message: z.string().optional(),
});

/**
 * Get a specific inquiry by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get user ID from auth token
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminFromRequest();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Find the inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
            ownerId: true,
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }
    
    // Security check: only allow users to view their own inquiries or inquiries for their properties
    const isOwner = inquiry.userId === userId;
    const isPropertyOwner = inquiry.property.ownerId === userId;
    
    if (!isOwner && !isPropertyOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Not authorized to view this inquiry" },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ inquiry });
    
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry" },
      { status: 500 }
    );
  }
}

/**
 * Update an inquiry's status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get user ID from auth token
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminFromRequest();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateInquirySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid update data", 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { status } = validationResult.data;
    
    // Find the inquiry first to check permissions
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            ownerId: true,
          },
        },
      },
    });
    
    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }
    
    // Security check: only property owners or admins can update inquiry status
    const isPropertyOwner = inquiry.property.ownerId === userId;
    
    if (!isPropertyOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Not authorized to update this inquiry" },
        { status: 403 }
      );
    }
    
    // Update the inquiry
    const updatedInquiry = await prisma.inquiry.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date() 
      },
    });
    
    return NextResponse.json({ 
      success: true,
      inquiry: updatedInquiry 
    });
    
  } catch (error) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

/**
 * Delete an inquiry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get user ID from auth token
    const userId = await getUserIdFromRequest();
    const isAdmin = await isAdminFromRequest();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Find the inquiry first to check permissions
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: {
          select: {
            ownerId: true,
          },
        },
      },
    });
    
    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }
    
    // Security check: only inquirers, property owners, or admins can delete inquiries
    const isInquirer = inquiry.userId === userId;
    const isPropertyOwner = inquiry.property.ownerId === userId;
    
    if (!isInquirer && !isPropertyOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Not authorized to delete this inquiry" },
        { status: 403 }
      );
    }
    
    // Delete the inquiry
    await prisma.inquiry.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      success: true,
      message: "Inquiry deleted successfully" 
    });
    
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
} 