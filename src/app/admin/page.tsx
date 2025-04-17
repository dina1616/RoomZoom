import React from 'react';

// Placeholder for the main admin page (e.g., admin dashboard)
export default function AdminHomePage() {
  return (
    <div>
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>
      <p>Welcome, Admin! This area is protected.</p>
      {/* Placeholder for main admin content/links */}
      <div className="mt-4 p-4 border rounded bg-gray-50">
         Admin actions (like property verification) will be accessible from here.
         {/* Link to verification page: <Link href="/admin/verify">Verify Properties</Link> */}
      </div>
    </div>
  );
} 