'use client';

import React from 'react';

/**
 * PropertyCardSkeleton component for displaying loading state
 * Mirrors the structure of PropertyCard but with animated placeholders
 */
export default function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative">
        {/* Image Placeholder */}
        <div className="relative h-64 w-full bg-gray-200 animate-pulse"></div>
        
        {/* Property Type Badge Placeholder */}
        <div className="absolute top-4 left-4 bg-gray-300 animate-pulse h-6 w-20 rounded-full"></div>
      </div>

      <div className="p-5">
        {/* Title and Price Placeholders */}
        <div className="mb-3">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>

        {/* Location Info Placeholder */}
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>

        {/* Key Features Placeholder */}
        <div className="flex items-center gap-4 mb-4">
          <div className="h-5 bg-gray-200 rounded w-10 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-10 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>

        {/* Amenities Placeholder */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"
            ></div>
          ))}
        </div>

        {/* Available From Placeholder */}
        <div className="mt-3">
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 