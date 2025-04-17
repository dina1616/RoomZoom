import React from 'react';

// Force dynamic rendering for login route
export const dynamic = 'force-dynamic';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 