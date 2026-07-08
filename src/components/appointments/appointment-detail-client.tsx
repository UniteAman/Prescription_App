'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Appointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  reason: string;
  notes?: string | null;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  prescriptions: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
  }>;
}

interface AppointmentDetailClientProps {
  appointmentId: string;
}

export default function AppointmentDetailClient({ appointmentId }: AppointmentDetailClientProps) {
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchAppointment = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch appointment');
      }
      const data = await response.json();
      setAppointment(data);
    } catch (err) {
      setError('Failed to load appointment');
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchAppointment();
  }, [fetchAppointment]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      router.push('/appointments');
    } catch (err) {
      setError('Failed to delete appointment');
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error || 'Appointment not found'}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Appointments
        </button>
        <h1 className="text-2xl font-bold">Appointment Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{appointment.doctorName}</CardTitle>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">
              {format(new Date(appointment.date), 'MMMM d, yyyy')} at {appointment.time}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Reason for Visit</p>
            <p className="font-medium">{appointment.reason}</p>
          </div>

          {appointment.notes && (
            <div>
              <p className="text-sm text-gray-500">Notes</p>
              <p className="font-medium">{appointment.notes}</p>
            </div>
          )}

          {appointment.prescriptions.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Prescriptions</p>
              <div className="space-y-2">
                {appointment.prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{prescription.fileName}</span>
                    <a
                      href={prescription.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            {appointment.status === 'UPCOMING' && (
              <>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? <LoadingSpinner size="sm" /> : 'Cancel Appointment'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
