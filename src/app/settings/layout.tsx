import React from 'react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 border-b pb-2">Settings</h1>
        {children}
      </div>
    </div>
  );
} 