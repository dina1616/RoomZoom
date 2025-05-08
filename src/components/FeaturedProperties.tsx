'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { FaSpinner } from 'react-icons/fa';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  order?: number;
}

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  tubeStation?: string;
  bedrooms: number;
  bathrooms: number;
  images?: string;
  media?: MediaItem[];
  rating?: number;
  reviewCount?: number;
  available: string | Date; // Can be string or Date
  propertyType: string;
  addressString?: string;
  amenities?: any;
  reviews?: any[];
}

// Cache key for storing fetched properties
const CACHE_KEY = 'featuredPropertiesCache';
// Cache timeout in milliseconds (5 minutes)
const CACHE_TIMEOUT = 5 * 60 * 1000;

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetchAttemptedRef = useRef(false);

  // Store data in cache
  const updateCache = useCallback((data: Property[]) => {
    try {
      if (typeof window !== 'undefined') {
        const cacheData = {
          data,
          timestamp: Date.now()
        };
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }
    } catch (err) {
      console.error('Cache write error:', err);
    }
  }, []);

  // Check cache and handle cached data
  const checkAndLoadCache = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        const cachedData = sessionStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Check if cache is still valid (not expired)
          if (Date.now() - timestamp < CACHE_TIMEOUT && Array.isArray(data) && data.length > 0) {
            setProperties(data);
            setLoading(false);
            return true; // Cache was valid and loaded
          } else {
            // Clear expired cache
            sessionStorage.removeItem(CACHE_KEY);
          }
        }
      }
    } catch (err) {
      console.error('Cache read error:', err);
    }
    return false; // No valid cache found
  }, []);

  const fetchFeaturedProperties = useCallback(async () => {
    // Return if already fetching or if fetch was already attempted in this session
    if (fetchAttemptedRef.current) return;
    
    try {
      setLoading(true);
      fetchAttemptedRef.current = true;
      
      const response = await fetch('/api/properties?featured=true', {
        // Add cache control headers
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle both response formats: array or {properties: array}
      let propertiesData = data;
      if (!Array.isArray(data) && data.properties && Array.isArray(data.properties)) {
        propertiesData = data.properties;
      }
      
      if (!Array.isArray(propertiesData)) {
        console.error('Invalid API response format:', data);
        setError('Invalid data format received from server');
        return;
      }
      
      const featuredProperties = propertiesData.slice(0, 3); // Take only 3 featured properties
      setProperties(featuredProperties);
      updateCache(featuredProperties); // Store in cache
      setError('');
    } catch (err) {
      console.error('Error fetching featured properties:', err);
      setError('Failed to load featured properties');
    } finally {
      setLoading(false);
    }
  }, [updateCache]);

  useEffect(() => {
    // First check if we have valid cached data
    const hasCachedData = checkAndLoadCache();
    
    // If no cached data, fetch from API
    if (!hasCachedData) {
      fetchFeaturedProperties();
    }
    
  }, [checkAndLoadCache, fetchFeaturedProperties]);

  // Safe date parsing function
  const parseDate = (dateValue: string | Date): Date => {
    if (dateValue instanceof Date) return dateValue;
    try {
      const parsedDate = new Date(dateValue);
      return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
    } catch (err) {
      console.error('Error parsing date:', dateValue, err);
      return new Date(); // Return current date as a fallback
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error && properties.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => {
            fetchAttemptedRef.current = false;
            // Also clear the cache to force a fresh fetch
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem(CACHE_KEY);
            }
            fetchFeaturedProperties();
          }} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center text-gray-500 p-10">
        No featured properties available at the moment.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {properties.map((property, index) => (
        <motion.div
          key={property.id || index} // Fallback to index if id is missing
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
        >
          <PropertyCard
            id={property.id}
            title={property.title}
            price={property.price}
            address={property.addressString || property.address || ''}
            tubeStation={property.tubeStation}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            media={property.media}
            imageUrl={
              typeof property.images === 'string' 
                ? [property.images] 
                : undefined
            }
            amenities={property.amenities || {}}
            rating={property.rating}
            reviewCount={property.reviews?.length || 0}
            availableFrom={parseDate(property.available)}
            propertyType={property.propertyType}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
