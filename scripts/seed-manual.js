// Simple script to manually seed categories
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

async function seedCategories() {
  console.log('Use Prisma Studio to manually create these categories:');
  console.log('\nRun: npx prisma studio');
  console.log('\nThen navigate to the Category model and add these:');
  console.log(JSON.stringify(categories, null, 2));
  
  console.log('\n\nOr use the API to create them after starting the server:');
  categories.forEach(cat => {
    console.log(`\ncurl -X POST http://localhost:3000/api/categories \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(cat)}'`);
  });
}

seedCategories();
