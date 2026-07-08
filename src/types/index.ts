export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  address: string;
  emergencyContact: string;
  medicalNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  userId: string;
  date: Date;
  time: string;
  doctorName: string;
  reason: string;
  notes?: string | null;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  createdAt: Date;
}
