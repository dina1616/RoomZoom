import React from 'react';
// Import only LoginForm for this page
import { LoginForm } from '@/components/AuthForms'; // Adjust path if needed

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        {/* Add message for successful registration if redirected */}
        {/* TODO: Read 'registered' query param and display message */}
        <LoginForm />
      </div>
    </div>
  );
} 