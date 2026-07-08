import AppointmentDetailClient from '@/components/appointments/appointment-detail-client';

export default function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto p-6">
      <AppointmentDetailClient appointmentId={params.id} />
    </div>
  );
}
