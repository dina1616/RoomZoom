import React from 'react';

// This page is protected by middleware
export default function DashboardPage() {
  // TODO: Fetch landlord-specific data
  // TODO: Implement dashboard UI (F-09)
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
      <p>Welcome, Landlord! This page is protected.</p>
      {/* Placeholder for dashboard content */}
      <div className="mt-8 p-4 border rounded bg-gray-50">
        Dashboard content (e.g., property list, analytics) will go here.
      </div>
    </div>
  );
} 