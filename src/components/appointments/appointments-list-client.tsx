'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

export default function AppointmentsListClient() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter((apt) => apt.status === filter));
    }
  }, [filter, appointments]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments');
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      const data = await response.json();
      setAppointments(data);
      setFilteredAppointments(data);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setIsLoading(false);
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Link href="/appointments/new">
          <Button>New Appointment</Button>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex gap-2">
          {(['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No appointments found. Create your first appointment to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{appointment.reason}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(appointment.date), 'MMMM d, yyyy')} at {appointment.time}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2">Notes: {appointment.notes}</p>
                    )}
                    {appointment.prescriptions.length > 0 && (
                      <p className="text-sm text-primary-600 mt-2">
                        {appointment.prescriptions.length} prescription(s) attached
                      </p>
                    )}
                  </div>
                  <Link href={`/appointments/${appointment.id}`}>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
