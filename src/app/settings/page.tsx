import React from 'react';

// This page is protected by middleware
export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Settings</h1>
      <p>This page is protected.</p>
      {/* Placeholder for settings content */}
      <div className="mt-8 p-4 border rounded bg-gray-50">
        User settings (e.g., change password, manage notifications) will go here.
      </div>
    </div>
  );
} 