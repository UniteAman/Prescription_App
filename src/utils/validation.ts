import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  age: z.number().min(1).max(120, 'Age must be between 1 and 120'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().min(5, 'Address is required'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
  medicalNotes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  age: z.number().min(1).max(120, 'Age must be between 1 and 120'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().min(5, 'Address is required'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
  medicalNotes: z.string().optional(),
});

export const appointmentSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  doctorName: z.string().min(2, 'Doctor name is required'),
  reason: z.string().min(5, 'Reason for visit is required'),
  notes: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
