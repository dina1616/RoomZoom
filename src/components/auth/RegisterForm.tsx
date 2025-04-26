'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RegisterForm as BaseRegisterForm } from '@/components/AuthForms';
import Link from 'next/link';

const RegisterForm = () => {
  const t = useTranslations('Auth');
  const params = useParams();
  const locale = params.locale as string;

  // Wrap the original RegisterForm component
  return (
    <div className="auth-form-container">
      <BaseRegisterForm />
      
      {/* Override the login link with internationalized version */}
      <p className="text-sm text-center text-gray-600 mt-4">
        {t('haveAccount')} <Link href={`/${locale}/login`} className="font-medium text-indigo-600 hover:text-indigo-500">{t('loginHere')}</Link>
      </p>
    </div>
  );
};

export default RegisterForm; 