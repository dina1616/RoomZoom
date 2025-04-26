import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/globals.css";
import { ClientProviders } from '@/providers/ClientProviders';
import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { locales } from '@/config';
import { getMessages } from '@/utils/i18n';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RoomZoom - Student Housing",
  description: "Find your perfect student accommodation with RoomZoom",
};

// Wrap all pages with ClientProviders to provide AuthContext and other client providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
          <ClientProviders>
            {children}
          </ClientProviders>
        </AuthProvider>
      </body>
    </html>
  );
} 