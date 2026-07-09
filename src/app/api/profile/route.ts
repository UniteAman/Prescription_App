import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { profileSchema } from '@/utils/validation';

// GET /api/profile - Fetch current user's profile
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { prisma } = await import('@/lib/prisma');
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const { prisma } = await import('@/lib/prisma');
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        fullName: validatedData.fullName,
        phoneNumber: validatedData.phoneNumber,
        age: validatedData.age,
        gender: validatedData.gender,
        address: validatedData.address,
        emergencyContact: validatedData.emergencyContact,
        medicalNotes: validatedData.medicalNotes || null,
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }

    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
