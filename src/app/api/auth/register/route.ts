import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/utils/validation';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user and profile in a transaction
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        profile: {
          create: {
            fullName: validatedData.fullName,
            email: validatedData.email,
            phoneNumber: validatedData.phoneNumber,
            age: validatedData.age,
            gender: validatedData.gender,
            address: validatedData.address,
            emergencyContact: validatedData.emergencyContact,
            medicalNotes: validatedData.medicalNotes || null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          profile: user.profile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
