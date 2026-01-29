import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categories = [
    { name: 'Pain Relief', description: 'Medications for pain management' },
    { name: 'Antibiotic', description: 'Medications to fight bacterial infections' },
    { name: 'Vitamin', description: 'Vitamins and supplements' },
    { name: 'Heart', description: 'Cardiovascular medications' },
    { name: 'Diabetes', description: 'Diabetes management medications' },
    { name: 'Blood Pressure', description: 'Blood pressure medications' },
    { name: 'Cholesterol', description: 'Cholesterol management' },
    { name: 'Allergy', description: 'Allergy relief medications' },
    { name: 'Digestive', description: 'Digestive system medications' },
    { name: 'Mental Health', description: 'Mental health medications' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
