import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

// GET /api/transport-nodes
export async function GET() {
    try {
        // Fetch transport nodes from the database
        const transportNodes = await prisma.transportNode.findMany();
        
        return NextResponse.json({ 
            transportNodes 
        });
    } catch (error) {
        console.error('Failed to fetch transport nodes:', error);
        // Return empty array instead of failing
        return NextResponse.json({ 
            transportNodes: [] 
        }, { status: 200 });
    }
} 