import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { appointmentSchema } from '@/utils/validation';

// GET /api/appointments - List user's appointments with optional status filter
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = {
      userId: session.user.id,
      ...(status && { status: status as 'UPCOMING' | 'COMPLETED' | 'CANCELLED' }),
    };

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        prescriptions: true,
      },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Appointments fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/appointments - Create new appointment
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = appointmentSchema.parse(body);

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        date: new Date(validatedData.date),
        time: validatedData.time,
        doctorName: validatedData.doctorName,
        reason: validatedData.reason,
        notes: validatedData.notes || null,
        status: 'UPCOMING',
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }

    console.error('Appointment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
