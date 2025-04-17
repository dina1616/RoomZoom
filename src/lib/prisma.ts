import { PrismaClient } from '@prisma/client';

// Use a global variable to prevent multiple instances during development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create and export a singleton Prisma client
const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    // Log queries in development
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Function to test database connection
export async function testDatabaseConnection() {
  try {
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1+1 AS result`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export default prisma;
