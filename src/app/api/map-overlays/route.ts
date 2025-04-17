import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

// GET /api/map-overlays
export async function GET() {
    try {
        // Use Promise.allSettled to handle partial failures
        const [universitiesResult, transportNodesResult] = await Promise.allSettled([
            prisma.university.findMany(),
            prisma.transportNode.findMany()
        ]);

        // Extract data or handle errors for each promise
        const universities = universitiesResult.status === 'fulfilled' 
            ? universitiesResult.value 
            : [];
        
        const transportNodes = transportNodesResult.status === 'fulfilled'
            ? transportNodesResult.value
            : [];

        // Log errors for debugging
        if (universitiesResult.status === 'rejected') {
            console.error('Failed to fetch universities:', universitiesResult.reason);
        }
        if (transportNodesResult.status === 'rejected') {
            console.error('Failed to fetch transport nodes:', transportNodesResult.reason);
        }

        return NextResponse.json({ 
            universities, 
            transportNodes 
        });
    } catch (error) {
        console.error('Failed to fetch map overlay data:', error);
        // Return empty arrays instead of failing
        return NextResponse.json({ 
            universities: [], 
            transportNodes: [] 
        }, { status: 200 });
    }
} 