'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import PropertyForm from '@/components/PropertyForm';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AddPropertyPage() {
  const t = useTranslations('dashboard');
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();
  
  // Handle successful property creation
  const handleSuccess = () => {
    router.push('/dashboard');
  };
  
  // Check loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  // Check if not authenticated or not a landlord
  if (!isAuthenticated || (user && user.role !== 'LANDLORD')) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </button>
      </div>
      
      <PropertyForm onSuccess={handleSuccess} />
    </div>
  );
} 