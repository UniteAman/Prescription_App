'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { appointmentSchema, AppointmentInput } from '@/utils/validation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewAppointmentForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentInput) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        setError(result.error || 'Failed to create appointment');
        return;
      }

      router.push('/appointments');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Back to Appointments
        </button>
        <h1 className="text-2xl font-bold">New Appointment</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Input
              label="Date"
              type="date"
              error={errors.date?.message}
              {...register('date')}
            />

            <Input
              label="Time"
              type="time"
              error={errors.time?.message}
              {...register('time')}
            />

            <Input
              label="Doctor Name"
              type="text"
              placeholder="Dr. John Smith"
              error={errors.doctorName?.message}
              {...register('doctorName')}
            />

            <Input
              label="Reason for Visit"
              type="text"
              placeholder="Annual checkup, follow-up, etc."
              error={errors.reason?.message}
              {...register('reason')}
            />

            <Textarea
              label="Notes (Optional)"
              rows={4}
              placeholder="Any additional information..."
              error={errors.notes?.message}
              {...register('notes')}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : 'Create Appointment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
