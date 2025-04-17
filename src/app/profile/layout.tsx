import React from 'react';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 border-b pb-2">User Profile</h1>
        {children}
      </div>
    </div>
  );
} 