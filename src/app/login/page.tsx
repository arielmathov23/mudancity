import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-neutral-500">
          Cargando...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
