#!/usr/bin/env bash

# Manual script to seed categories using Prisma Studio or direct SQL

echo "Seeding categories..."

# Create a temp SQL file
cat > /tmp/seed_categories.sql << 'EOF'
INSERT INTO "Category" (id, name, description, "createdAt") VALUES
  (gen_random_uuid(), 'Pain Relief', 'Medications for pain management', NOW()),
  (gen_random_uuid(), 'Antibiotic', 'Medications to fight bacterial infections', NOW()),
  (gen_random_uuid(), 'Vitamin', 'Vitamins and supplements', NOW()),
  (gen_random_uuid(), 'Heart', 'Cardiovascular medications', NOW()),
  (gen_random_uuid(), 'Diabetes', 'Diabetes management medications', NOW()),
  (gen_random_uuid(), 'Blood Pressure', 'Blood pressure medications', NOW()),
  (gen_random_uuid(), 'Cholesterol', 'Cholesterol management', NOW()),
  (gen_random_uuid(), 'Allergy', 'Allergy relief medications', NOW()),
  (gen_random_uuid(), 'Digestive', 'Digestive system medications', NOW()),
  (gen_random_uuid(), 'Mental Health', 'Mental health medications', NOW())
ON CONFLICT (name) DO NOTHING;
EOF

echo "SQL file created at /tmp/seed_categories.sql"
echo "You can run this with: psql \$DATABASE_URL < /tmp/seed_categories.sql"
echo "Or use Prisma Studio to manually create categories: npx prisma studio"
