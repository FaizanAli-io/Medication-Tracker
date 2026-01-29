import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSchedule, combineDateTime } from '@/lib/schedule';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const medications = await prisma.medication.findMany({
      where: { userId },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        schedules: {
          orderBy: { scheduledAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(medications);
  } catch (error) {
    console.error('Failed to fetch medications:', error);
    return NextResponse.json({ error: 'Failed to fetch medications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, dosage, pattern, duration, startDate, timing, categoryIds } = body;

    if (!name || !dosage || !pattern || !duration || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + duration);

    const medication = await prisma.medication.create({
      data: {
        name,
        description,
        dosage,
        pattern,
        duration,
        startDate: start,
        endDate: end,
        timing: JSON.stringify(timing || {}),
        userId,
      },
    });

    // Create category associations
    if (categoryIds && categoryIds.length > 0) {
      await prisma.medicationCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({
          medicationId: medication.id,
          categoryId,
        })),
      });
    }

    // Generate schedule
    const schedule = generateSchedule(start, duration, pattern, timing);
    
    await prisma.doseSchedule.createMany({
      data: schedule.map((entry) => ({
        medicationId: medication.id,
        scheduledAt: combineDateTime(entry.date, entry.time),
        doseType: entry.doseType,
      })),
    });

    const fullMedication = await prisma.medication.findUnique({
      where: { id: medication.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        schedules: true,
      },
    });

    return NextResponse.json(fullMedication);
  } catch (error) {
    console.error('Failed to create medication:', error);
    return NextResponse.json({ error: 'Failed to create medication' }, { status: 500 });
  }
}
