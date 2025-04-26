'use client';

import RegisterForm from '@/components/auth/RegisterForm';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Auth');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t('register')}</h1>
          <p className="mt-2 text-gray-600">
            {t('registerDescription')}
          </p>
        </div>
        
        <RegisterForm />
      </div>
    </div>
  );
} 