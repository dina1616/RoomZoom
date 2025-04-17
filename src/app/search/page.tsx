'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import FilterBar from '@/components/FilterBar';
import type { FilterValues } from '@/components/FilterBar';

// --- Manual Type Definitions ---

interface FetchedProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  addressString: string;
  borough: string | null;
  latitude: number;
  longitude: number;
  tubeStation: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  available: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  externalId: string | null;
  addressId: string | null;
  media: { id: string; url: string; type: string; order: number | null }[];
  address: { id: string; street: string; city: string; state: string | null; postalCode: string; country: string } | null;
  amenities: { id: string; name: string }[];
  owner: { id: string; name: string | null };
  reviews: { rating: number }[];
}

// Manual type for University (matching schema)
interface University {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null; // Optional address
}

// Manual type for TransportNode (matching schema)
interface TransportNode {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  lines?: string | null; // Optional lines
}

// Type for Map Overlay Data using manual types
interface MapOverlayData {
  universities: University[];
  transportNodes: TransportNode[];
}

// Dynamically import MapPane
const DynamicMapPane = dynamic(() => import('@/components/MapPane'), {
  ssr: false,
  loading: () => (
    <div className="w-full md:w-3/4 h-[calc(100vh-theme(space.16))] bg-gray-200 flex items-center justify-center animate-pulse">
      <p className="text-gray-500">Loading Map...</p>
    </div>
  ),
});

export default function SearchPage() {
  const [properties, setProperties] = useState<FetchedProperty[]>([]);
  const [mapOverlays, setMapOverlays] = useState<MapOverlayData>({ universities: [], transportNodes: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({});

  const buildQueryString = (filterParams: FilterValues): string => {
    const params = new URLSearchParams();
    if (filterParams.minPrice !== undefined) params.append('minPrice', filterParams.minPrice.toString());
    if (filterParams.maxPrice !== undefined) params.append('maxPrice', filterParams.maxPrice.toString());
    if (filterParams.amenities) {
      filterParams.amenities.forEach((amenity: string) => params.append('amenity', amenity));
    }
    return params.toString();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      const propertyQueryString = buildQueryString(filters);
      try {
        const [propResponse, overlayResponse] = await Promise.all([
          fetch(`/api/properties?${propertyQueryString}`),
          fetch('/api/map-overlays')
        ]);

        if (!propResponse.ok) {
          throw new Error(`HTTP error fetching properties! status: ${propResponse.status}`);
        }
        if (!overlayResponse.ok) {
          console.error("Failed to fetch map overlays, proceeding without them.");
        }

        const propData: FetchedProperty[] = await propResponse.json(); 
        const overlayData: MapOverlayData = overlayResponse.ok ? await overlayResponse.json() : { universities: [], transportNodes: [] };
        
        setProperties(propData);
        setMapOverlays(overlayData);

      } catch (e: any) {
        console.error("Failed to fetch search data:", e);
        setError(e.message || 'Failed to load search data. Please try again later.');
        setProperties([]); 
        setMapOverlays({ universities: [], transportNodes: [] }); 
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [filters]); 

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <FilterBar onFilterChange={handleFilterChange} /> 
      
      {/* Map Area */}
      {loading && (
         <div className="w-full md:w-3/4 h-[calc(100vh-theme(space.16))] bg-gray-200 flex items-center justify-center animate-pulse">
           <p className="text-gray-500">Loading Map Data...</p>
         </div>
      )}
      {error && (
         <div className="w-full md:w-3/4 h-[calc(100vh-theme(space.16))] flex items-center justify-center bg-red-100 text-red-700">
          <p>Error loading map data: {error}</p>
        </div>
      )}
      {!loading && !error && (
          <DynamicMapPane 
            properties={properties} 
            universities={mapOverlays.universities} 
            transportNodes={mapOverlays.transportNodes}
          /> 
      )}
    </div>
  );
}
