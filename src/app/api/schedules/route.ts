import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { filterUpcoming } from '@/lib/schedule';

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter'); // 'upcoming', 'today', 'missed'
    const medicationId = searchParams.get('medicationId');

    let where: any = {
      medication: {
        userId,
      },
    };

    if (medicationId) {
      where.medicationId = medicationId;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    if (filter === 'today') {
      where.scheduledAt = {
        gte: todayStart,
        lt: todayEnd,
      };
    } else if (filter === 'missed') {
      where.scheduledAt = { lt: now };
      where.taken = false;
      where.skipped = false;
    }

    let schedules = await prisma.doseSchedule.findMany({
      where,
      include: {
        medication: {
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: filter === 'upcoming' ? 50 : undefined,
    });

    if (filter === 'upcoming') {
      schedules = filterUpcoming(schedules, 50);
    }

    return NextResponse.json(schedules);
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return NextResponse.json({ error: 'Failed to fetch schedules' }, { status: 500 });
  }
}
