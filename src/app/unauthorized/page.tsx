import React from 'react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-xl text-gray-700 mb-8">You do not have permission to access the requested page.</p>
      <Link href="/" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
} 