import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/map-overlays
export async function GET(request: Request) {
    try {
        // Fetch all universities and transport nodes in parallel
        const [universities, transportNodes] = await Promise.all([
            prisma.university.findMany(),
            prisma.transportNode.findMany()
        ]);

        return NextResponse.json({ universities, transportNodes });

    } catch (error) {
        console.error("Failed to fetch map overlay data:", error);
        // Return empty arrays on error so the map can still load properties
        return NextResponse.json(
            { 
                error: 'Failed to fetch overlay data', 
                universities: [], 
                transportNodes: [] 
            }, 
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
} 