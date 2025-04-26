'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <AuthProvider>
        <Toaster position="top-center" />
        {children}
      </AuthProvider>
    </>
  );
} 