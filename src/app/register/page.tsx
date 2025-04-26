import React from 'react';
import { RegisterForm } from '@/components/AuthForms';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join RoomZoom to find your perfect student accommodation
          </p>
        </div>
        
        <RegisterForm />
        
        <div className="mt-6 text-xs text-center text-gray-500">
          By registering, you agree to RoomZoom's Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
} 