import React from 'react';

// Force dynamic rendering for the search route
export const dynamic = 'force-dynamic';

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 