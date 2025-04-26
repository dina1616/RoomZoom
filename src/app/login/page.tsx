'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
// Import only LoginForm for this page
import { LoginForm } from '@/components/AuthForms'; // Fix import to use named export

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for registered param and set success message
  useEffect(() => {
    const registered = searchParams.get('registered');
    if (registered === 'true') {
      setSuccessMessage('Registration successful! Please log in with your credentials.');
    }
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        
        {successMessage && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
            {successMessage}
          </div>
        )}
        
        <LoginForm />
      </div>
    </div>
  );
} 