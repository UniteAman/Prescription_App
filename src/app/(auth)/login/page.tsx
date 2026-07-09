import React from 'react';
import LoginForm from '@/components/forms/login-form';

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div />}>
      <LoginForm />
    </React.Suspense>
  );
}
