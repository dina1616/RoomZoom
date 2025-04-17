import React from 'react';

// Force dynamic rendering for profile route
export const dynamic = 'force-dynamic';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 