'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Import types but not the component (which requires window)
import type { Property } from '@/components/MapComponent';

// Dynamically load the map component with no SSR to avoid window not defined errors
const MapWithNoSSR = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-64px)] bg-gray-100 flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading map...</div>
    </div>
  )
});

export default function MapPage() {
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 5000]);
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      {/* Filter bar */}
      <div className="bg-white p-4 shadow-md z-10 flex flex-wrap items-center gap-4">
        <h2 className="font-semibold text-blue-600">Filters:</h2>
        
        <div className="flex items-center gap-2">
          <label htmlFor="price-min" className="text-sm text-gray-600">Price:</label>
          <div className="flex items-center gap-1">
            <span className="text-sm">£</span>
            <input
              id="price-min"
              type="number"
              className="w-24 p-1 border rounded text-sm"
              placeholder="Min"
              value={priceFilter[0]}
              onChange={(e) => setPriceFilter([parseInt(e.target.value) || 0, priceFilter[1]])}
            />
            <span className="text-sm mx-1">-</span>
            <span className="text-sm">£</span>
            <input
              id="price-max"
              type="number" 
              className="w-24 p-1 border rounded text-sm"
              placeholder="Max"
              value={priceFilter[1]}
              onChange={(e) => setPriceFilter([priceFilter[0], parseInt(e.target.value) || 5000])}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="bedrooms" className="text-sm text-gray-600">Bedrooms:</label>
          <select
            id="bedrooms"
            className="p-1 border rounded text-sm"
            value={bedroomFilter || ''}
            onChange={(e) => setBedroomFilter(e.target.value ? parseInt(e.target.value) : null)}
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </select>
        </div>

        <button 
          className="ml-auto px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          onClick={() => {
            setPriceFilter([0, 5000]);
            setBedroomFilter(null);
          }}
        >
          Reset
        </button>
      </div>

      {/* Map container */}
      <div className="flex-grow">
        <MapWithNoSSR />
      </div>
    </div>
  );
} 