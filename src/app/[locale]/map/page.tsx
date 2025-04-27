'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// Import PropertyWithDetails type from the correct location
import type { PropertyWithDetails as Property } from '@/types/property';

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
  const t = useTranslations('filters');
  const mapT = useTranslations('Map');
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 5000]);
  const [bedroomFilter, setBedroomFilter] = useState<number | null>(null);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<{id: string, name: string}[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [transportNodes, setTransportNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // London coordinates as default center
  const londonCoordinates: [number, number] = [51.5074, -0.1278];
  
  // Fetch available amenities and transport nodes on load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch amenities
        const amenitiesResponse = await fetch('/api/properties?amenitiesOnly=true');
        if (amenitiesResponse.ok) {
          const data = await amenitiesResponse.json();
          if (data.amenities && Array.isArray(data.amenities)) {
            setAvailableAmenities(data.amenities);
          }
        }
        
        // Fetch transport nodes
        const transportResponse = await fetch('/api/transport-nodes');
        if (transportResponse.ok) {
          const data = await transportResponse.json();
          if (data.transportNodes && Array.isArray(data.transportNodes)) {
            setTransportNodes(data.transportNodes);
          }
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  const handleAmenityToggle = (amenityId: string) => {
    setAmenityFilters(prev => {
      if (prev.includes(amenityId)) {
        return prev.filter(id => id !== amenityId);
      } else {
        return [...prev, amenityId];
      }
    });
  };

  const handleResetFilters = () => {
    setPriceFilter([0, 5000]);
    setBedroomFilter(null);
    setAmenityFilters([]);
  };

  // Build filter object for map component
  const mapFilters = {
    minPrice: priceFilter[0],
    maxPrice: priceFilter[1],
    bedrooms: bedroomFilter || undefined,
    amenities: amenityFilters
  };

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
      {/* Enhanced Filter bar */}
      <div className="bg-white p-4 shadow-md z-10">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="font-semibold text-blue-600">{t('filters')}:</h2>
            
            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="price-min" className="text-sm text-gray-600">{t('price')}:</label>
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

            {/* Bedrooms Filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="bedrooms" className="text-sm text-gray-600">{t('bedrooms')}:</label>
              <select
                id="bedrooms"
                className="p-1 border rounded text-sm"
                value={bedroomFilter || ''}
                onChange={(e) => setBedroomFilter(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">{t('any')}</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            {/* Reset Button */}
            <button 
              className="ml-auto px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              onClick={handleResetFilters}
            >
              {t('reset')}
            </button>
          </div>
          
          {/* Amenities Filter */}
          <div className="flex flex-wrap mt-3 gap-2">
            <span className="text-sm text-gray-600 flex items-center">{t('amenities')}:</span>
            {availableAmenities.map(amenity => (
              <button
                key={amenity.id}
                className={`text-xs px-2 py-1 rounded-full border ${
                  amenityFilters.includes(amenity.id) 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => handleAmenityToggle(amenity.id)}
              >
                {amenity.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map container with improved component */}
      <div className="flex-grow">
        <MapWithNoSSR 
          center={londonCoordinates} 
          zoom={12}
          filters={mapFilters}
          transportNodes={transportNodes}
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
} 