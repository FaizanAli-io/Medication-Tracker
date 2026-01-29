# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)

## Setup Steps

### 1. Clone and Install

```bash
git clone <repository-url>
cd Medication-Tracker
npm install
```

### 2. Choose Your Database

#### Option A: Prisma Postgres (Local Development)

```bash
npx prisma dev
```

Keep this running in a separate terminal.

#### Option B: Local PostgreSQL

```bash
# Install PostgreSQL locally
brew install postgresql  # macOS
# or
sudo apt-get install postgresql  # Linux

# Start PostgreSQL
brew services start postgresql  # macOS
# or
sudo service postgresql start  # Linux

# Create database
createdb medication_tracker

# Update .env
DATABASE_URL="postgresql://localhost/medication_tracker"
```

#### Option C: Cloud Database (Recommended for Production)

**Vercel Postgres:**
1. Go to vercel.com and create a Postgres database
2. Copy the connection string
3. Update `.env`

**Supabase:**
1. Go to supabase.com and create a project
2. Navigate to Settings > Database
3. Copy the connection string
4. Update `.env`

### 3. Configure Environment

Copy and update `.env`:

```env
DATABASE_URL="your-database-connection-string"

# Optional: Email configuration
EMAIL_FROM="noreply@medicationtracker.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Setup Database Schema

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed categories (optional)
npx prisma db seed
```

### 5. Start the Application

```bash
npm run dev
```

Visit http://localhost:3000

## First Steps

1. **Create Your Account**
   - Enter your name
   - (Optional) Add email for reminders
   - Click "Get Started"

2. **Add Your First Medication**
   - Click "+ Add Medication"
   - Fill in medication details
   - Choose dosage pattern
   - Set duration and timing
   - Click "Add Medication"

3. **Track Your Doses**
   - View upcoming doses in the dashboard
   - Mark doses as taken, skipped, or reschedule them
   - Check your medication history

## Features at a Glance

### Dosage Patterns
- **Once Daily**: e.g., vitamins (1x/day)
- **1+0+1**: e.g., antibiotics (morning & evening)
- **1+1+1**: e.g., pain relief (morning, afternoon, evening)
- **1+1+1+1**: e.g., diabetes medication (4x/day)

### Views
- **Upcoming**: Next doses across all medications
- **Schedule**: Today's complete schedule
- **Medications**: Manage all your medications

### Actions
- ✅ Mark as taken (with timestamp)
- ⏭️ Skip a dose
- 🔄 Reschedule to a different time
- 📧 Get email reminders (if configured)

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add Vercel Postgres database
4. Set environment variables
5. Deploy!

```bash
# After deployment, run migrations
npx prisma migrate deploy
```

## Need Help?

- Check `README.md` for detailed documentation
- See `TROUBLESHOOTING.md` for common issues
- Review API endpoints in `README.md`

## Architecture Overview

```
medication-tracker/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard page
│   │   └── page.tsx          # Login page
│   ├── components/           # React components
│   └── lib/                  # Utilities & Prisma
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
└── scripts/                  # Utility scripts
```

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL + Prisma ORM
- **API**: Next.js API Routes
- **Email**: Nodemailer (optional)
