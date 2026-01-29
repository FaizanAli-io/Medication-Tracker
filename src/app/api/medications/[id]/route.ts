import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const medication = await prisma.medication.findFirst({
      where: {
        id: params.id,
        userId,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        schedules: {
          orderBy: { scheduledAt: 'asc' },
        },
      },
    });

    if (!medication) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    return NextResponse.json(medication);
  } catch (error) {
    console.error('Failed to fetch medication:', error);
    return NextResponse.json({ error: 'Failed to fetch medication' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, dosage } = body;

    const medication = await prisma.medication.updateMany({
      where: {
        id: params.id,
        userId,
      },
      data: {
        name,
        description,
        dosage,
      },
    });

    if (medication.count === 0) {
      return NextResponse.json({ error: 'Medication not found' }, { status: 404 });
    }

    const updated = await prisma.medication.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update medication:', error);
    return NextResponse.json({ error: 'Failed to update medication' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.medication.deleteMany({
      where: {
        id: params.id,
        userId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete medication:', error);
    return NextResponse.json({ error: 'Failed to delete medication' }, { status: 500 });
  }
}
