import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/auth/OnboardingForm';
import { getSessionProfile, isProfileComplete } from '@/lib/auth/session';

export default async function OnboardingPage() {
  const { user, profile } = await getSessionProfile();
  if (!user) redirect('/login');
  if (isProfileComplete(profile)) redirect('/');

  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <OnboardingForm />
    </Suspense>
  );
}
