import { useState, useEffect } from 'react';
import { PropertyAmenities } from '@/types/property';

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  borough: string | null;
  latitude: number;
  longitude: number;
  tubeStation: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  available: string;
  images: string | string[];
  averageRating: number | null;
  amenities?: Partial<PropertyAmenities>;
  reviews?: Array<{
    id: string;
    rating: number;
    comment: string;
  }>;
}

interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  borough?: string;
  bedrooms?: number;
  propertyType?: string;
}

export function useProperties(filters: FilterParams = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        const response = await fetch(`/api/properties?${queryParams}`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        setProperties(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  return { properties, loading, error };
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property');
        }

        const data = await response.json();
        setProperty(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, loading, error };
}
