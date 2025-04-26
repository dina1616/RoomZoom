'use client';

import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LoginForm as BaseLoginForm } from '@/components/AuthForms';
import Link from 'next/link';

const LoginForm = () => {
  const t = useTranslations('Auth');
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  // Wrap the original LoginForm component
  return (
    <div className="auth-form-container">
      <BaseLoginForm />
      
      {/* Override the register link with internationalized version */}
      <p className="text-sm text-center text-gray-600 mt-4">
        {t('noAccount')} <Link href={`/${locale}/register`} className="font-medium text-indigo-600 hover:text-indigo-500">{t('registerHere')}</Link>
      </p>
    </div>
  );
};

export default LoginForm; 