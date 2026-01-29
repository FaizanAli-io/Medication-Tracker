# Medication Tracker

A full-stack medication tracking application built with Next.js, PostgreSQL, and Prisma.

## Features

- 🔐 Simple authentication (name + optional email)
- 💊 Medication management with dosage patterns
- 📅 Schedule generation and tracking
- ✅ Mark doses as taken/missed/skipped
- 🔄 Reschedule doses
- 📧 Email reminders (when email is provided)
- 🏷️ Medication categories with many-to-many relationships
- 🌙 Dark, modern UI
- 📊 Upcoming doses view
- 📈 Medication history tracking

## Dosage Patterns

- **Once Daily**: Single dose per day
- **1+0+1**: Morning and evening
- **1+1+1**: Morning, afternoon, and evening
- **1+1+1+1**: Morning, afternoon, evening, and night

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Nodemailer (optional)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

This project uses Prisma Postgres. Start the database:

```bash
npx prisma dev
```

This will start a local PostgreSQL instance.

### 3. Run Migrations

```bash
npx prisma migrate dev
```

### 4. Seed the Database (Optional)

Create initial categories:

```bash
npx prisma db seed
```

Or manually create categories through the API once the app is running.

### 5. Configure Environment Variables

Update `.env` with your settings:

```env
# Database
DATABASE_URL="your-database-url"

# Email (Optional - for reminders)
EMAIL_FROM="noreply@medicationtracker.com"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 6. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Usage

### Login

1. Enter your name (required)
2. Optionally add your email for medication reminders
3. Click "Get Started"

### Add Medication

1. Click the "+ Add Medication" button
2. Fill in:
   - Medication name
   - Description (optional)
   - Dosage (e.g., "500mg", "2 tablets")
   - Pattern (once daily, 1+0+1, 1+1+1, 1+1+1+1)
   - Duration in days
   - Start date
   - Custom timing for each dose
   - Categories (optional)
3. Click "Add Medication"

### Track Doses

Navigate to:
- **Upcoming**: View upcoming doses
- **Schedule**: View today's schedule
- **Medications**: Manage your medications

For each dose, you can:
- ✅ Mark as taken
- ⏭️ Skip
- 🔄 Reschedule

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login/register user

### Medications
- `GET /api/medications` - List user's medications
- `POST /api/medications` - Create new medication
- `GET /api/medications/:id` - Get medication details
- `PUT /api/medications/:id` - Update medication
- `DELETE /api/medications/:id` - Delete medication

### Schedules
- `GET /api/schedules?filter=upcoming|today|missed` - Get schedules
- `PATCH /api/schedules/:id` - Update schedule (take/skip/reschedule)

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category

## Database Schema

### User
- id, name, email (optional), timestamps

### Medication
- id, name, description, dosage, pattern, duration, dates, timing, userId
- Relations: categories (many-to-many), schedules, logs

### Category
- id, name, description
- Relations: medications (many-to-many)

### DoseSchedule
- id, medicationId, scheduledAt, doseType, taken, takenAt, skipped, rescheduled

### MedicationLog
- id, medicationId, userId, action, scheduledAt, actualAt, notes

## Production Deployment

1. Set up a PostgreSQL database (Vercel Postgres, Supabase, etc.)
2. Update `DATABASE_URL` in environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Deploy to Vercel or your preferred hosting platform

## License

ISC
