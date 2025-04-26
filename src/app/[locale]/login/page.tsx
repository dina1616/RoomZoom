'use client';

import LoginForm from '@/components/auth/LoginForm';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const registrationSuccess = searchParams.get('registered') === 'true';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t('login')}</h1>
          <p className="mt-2 text-gray-600">
            {t('loginDescription')}
          </p>
        </div>
        
        {registrationSuccess && (
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="text-sm text-green-700">
              {t('registrationSuccess')}
            </div>
          </div>
        )}
        
        <LoginForm />
      </div>
    </div>
  );
} 