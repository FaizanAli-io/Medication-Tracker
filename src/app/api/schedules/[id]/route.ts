import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, scheduledAt } = body; // action: 'take', 'skip', 'reschedule'

    const schedule = await prisma.doseSchedule.findFirst({
      where: {
        id: params.id,
        medication: {
          userId,
        },
      },
      include: {
        medication: true,
      },
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    let updateData: any = {};
    let logAction = action;

    if (action === 'take') {
      updateData = {
        taken: true,
        takenAt: new Date(),
      };
    } else if (action === 'skip') {
      updateData = {
        skipped: true,
      };
    } else if (action === 'reschedule' && scheduledAt) {
      updateData = {
        scheduledAt: new Date(scheduledAt),
        rescheduled: true,
      };
    }

    const updated = await prisma.doseSchedule.update({
      where: { id: params.id },
      data: updateData,
    });

    // Create log
    await prisma.medicationLog.create({
      data: {
        medicationId: schedule.medicationId,
        userId,
        action: logAction,
        scheduledAt: schedule.scheduledAt,
        actualAt: action === 'take' ? new Date() : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update schedule:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
