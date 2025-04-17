import React from 'react';

// This page group is protected by middleware for ADMIN role
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Can add admin-specific layout elements here if needed
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4 border-b pb-2">Admin Area</h1>
      {/* Could add admin sidebar navigation here */} 
      <div>{children}</div>
    </div>
  );
}
