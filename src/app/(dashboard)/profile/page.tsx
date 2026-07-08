import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ProfileFormClient from '@/components/profile/profile-form-client';
import { ProfileInput } from '@/utils/validation';

async function getProfile(userId: string) {
  return prisma.profile.findUnique({
    where: { userId },
  });
}

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  const profile = await getProfile(session.user.id);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileFormClient 
        initialData={profile || undefined}
      />
    </div>
  );
}
