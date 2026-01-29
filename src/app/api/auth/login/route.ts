import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    let user = await prisma.user.findFirst({
      where: { name },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email: email || null,
        },
      });
    } else if (email && user.email !== email) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { email },
      });
    }

    return NextResponse.json({
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
