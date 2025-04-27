'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { RegisterForm as BaseRegisterForm } from '@/components/AuthForms';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const RegisterForm = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string || 'en';
  const [isClient, setIsClient] = useState(false);
  
  // Make sure we're on the client side before rendering locale-specific content
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div className="auth-form-container">
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Wrap the original RegisterForm component with localization enhancements
  return (
    <div className="auth-form-container">
      <BaseRegisterForm 
        customLabels={{
          name: t('nameLabel'),
          email: t('emailLabel'),
          password: t('passwordLabel'),
          confirmPassword: t('confirmPasswordLabel'),
          student: t('studentRole'),
          landlord: t('landlordRole'),
          studentDescription: t('studentRoleDescription'),
          landlordDescription: t('landlordRoleDescription'),
          register: t('registerButton'),
          registering: t('registeringButton')
        }}
        onSuccess={() => {
          // Redirect to login with locale if available
          const loginPath = `/${locale}/login?registered=true`;
          router.push(loginPath);
        }}
      />
      
      {/* Localized login link */}
      <p className="text-sm text-center text-gray-600 mt-4">
        {t('haveAccount')} <Link href={`/${locale}/login`} className="font-medium text-indigo-600 hover:text-indigo-500">{t('loginHere')}</Link>
      </p>
    </div>
  );
};

export default RegisterForm; 