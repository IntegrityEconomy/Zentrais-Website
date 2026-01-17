const { PrismaClient } = require('@prisma/client');

// Create a single Prisma client instance for the application
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle connection shutdown gracefully
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
