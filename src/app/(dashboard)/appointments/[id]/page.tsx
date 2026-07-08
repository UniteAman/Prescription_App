import AppointmentDetailClient from '@/components/appointments/appointment-detail-client';

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto p-6">
      <AppointmentDetailClient appointmentId={id} />
    </div>
  );
}
