import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    { username: 'alice', password: 'password123' },
    { username: 'bob', password: 'password123' },
    { username: 'suma', password: 'password123' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { username: user.username },
      update: {},
      create: { username: user.username, password: hashedPassword },
    });
  }

  console.log('Sample users added!');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
