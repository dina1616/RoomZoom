'use client';

import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LoginForm as BaseLoginForm } from '@/components/AuthForms';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const LoginForm = () => {
  const t = useTranslations('Auth');
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string || 'en';
  const [isClient, setIsClient] = useState(false);
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  
  // Check for registration success message
  useEffect(() => {
    if (searchParams && searchParams.get('registered') === 'true') {
      setShowRegisteredMessage(true);
    }
  }, [searchParams]);
  
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

  // Handle user login success with proper role-based routing
  const handleLoginSuccess = (user: any) => {
    const basePath = `/${locale}`;
    
    if (user.role === 'LANDLORD') {
      router.push(`${basePath}/dashboard`);
    } else if (user.role === 'ADMIN') {
      router.push(`${basePath}/admin`);
    } else {
      router.push(`${basePath}/profile`);
    }
  };

  return (
    <div className="auth-form-container">
      {showRegisteredMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md">
          {t('registerSuccess')}
        </div>
      )}
      
      <BaseLoginForm 
        customLabels={{
          email: t('emailLabel'),
          password: t('passwordLabel'),
          login: t('loginButton'),
          loggingIn: t('loggingInButton'),
          errorMessage: t('errorMessage')
        }}
        onSuccess={handleLoginSuccess}
      />
      
      {/* Localized register link */}
      <p className="text-sm text-center text-gray-600 mt-4">
        {t('noAccount')} <Link href={`/${locale}/register`} className="font-medium text-indigo-600 hover:text-indigo-500">{t('registerHere')}</Link>
      </p>
    </div>
  );
};

export default LoginForm; 