# Troubleshooting

## Database Connection Issues

If you encounter `Connection terminated unexpectedly` errors:

### Option 1: Restart Prisma Postgres

```bash
# Kill existing process
ps aux | grep "prisma dev" | grep -v grep | awk '{print $2}' | xargs kill

# Start fresh
npx prisma dev
```

### Option 2: Use a Different Database

Instead of Prisma Postgres, you can use any PostgreSQL database:

1. **Local PostgreSQL**:
   ```bash
   # Install PostgreSQL locally
   # Then update .env:
   DATABASE_URL="postgresql://user:password@localhost:5432/medication_tracker"
   ```

2. **Vercel Postgres** (Recommended for production):
   - Create a Vercel Postgres database
   - Copy the connection string to `.env`

3. **Supabase**:
   - Create a Supabase project
   - Get the connection string from Settings > Database
   - Update `.env`

After changing the database URL:
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Common Issues

### 1. Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### 2. Prisma Client Not Generated
```bash
npx prisma generate
```

### 3. Migrations Not Applied
```bash
npx prisma migrate dev
```

### 4. Cannot Seed Database
Use Prisma Studio to manually add categories:
```bash
npx prisma studio
```

Or create them via the API once the app is running:
```bash
node scripts/seed-manual.js
```

## Environment Setup Checklist

- [ ] Database is running
- [ ] `.env` file is configured
- [ ] Dependencies are installed (`npm install`)
- [ ] Prisma client is generated (`npx prisma generate`)
- [ ] Migrations are applied (`npx prisma migrate dev`)
- [ ] Categories are seeded (optional)
- [ ] Dev server is running (`npm run dev`)

## Testing the Application

Even if the database connection is having issues, you can:
1. Check the UI is rendering correctly
2. Verify the component structure
3. Test the frontend logic
4. Review the API routes code

Once the database connection is stable, all features will work as designed.
