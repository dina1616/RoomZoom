'use client'; // Needs to be client component to use hooks like useAuth

import React from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming useAuth provides user info

// This page is protected by middleware
export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading profile...</div>; // Or a spinner component
  }

  if (!user) {
    // This shouldn't happen if middleware is working, but good practice
    return <div>Please log in to view your profile.</div>; 
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="p-4 border rounded bg-white shadow-sm">
        <p><span className="font-semibold">Name:</span> {user.name || 'Not provided'}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
        {/* Add link to settings or edit profile */}
      </div>
      {/* TODO: Add sections for favorite properties, reviews, etc. */}
    </div>
  );
} 