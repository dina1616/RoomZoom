'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import PropertyCardSkeleton from '@/components/PropertyCardSkeleton';
import SearchFilters from '@/components/SearchFilters';
import { FaMapMarkerAlt, FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

// Define the Property interface based on PropertyCard props
interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  tubeStation?: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl?: string[];
  squareFootage?: number;
  amenities?: any;
  rating?: number;
  reviewCount?: number;
  availableFrom: Date;
  propertyType: string;
  // Add any other properties from PropertyCard interface
}

export default function PropertiesPage() {
  const t = useTranslations('search');
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const PROPERTIES_PER_PAGE = 30; // Increase to show more properties initially

  const fetchProperties = async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      // Build the URL with all search parameters
      const queryParams = new URLSearchParams();
      
      // Add all existing search params to the query
      for (const [key, value] of searchParams.entries()) {
        queryParams.append(key, value);
      }
      
      // Add pagination parameters
      queryParams.append('take', PROPERTIES_PER_PAGE.toString());
      if (isLoadMore) {
        queryParams.append('skip', ((page - 1) * PROPERTIES_PER_PAGE).toString());
      }
      
      const response = await fetch(`/api/properties?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      
      const data = await response.json();
      
      // Check if data is an array
      const propertiesArray = Array.isArray(data) ? data : 
                             (data.properties && Array.isArray(data.properties)) ? data.properties : [];
      
      // Convert availableFrom strings to Date objects
      const propertiesWithDates = propertiesArray.map((property: any) => ({
        ...property,
        availableFrom: property.availableFrom ? new Date(property.availableFrom) : new Date()
      }));
      
      if (isLoadMore) {
        setProperties(prev => [...prev, ...propertiesWithDates]);
        // If we got fewer properties than requested, there are no more
        setHasMore(propertiesWithDates.length === PROPERTIES_PER_PAGE);
      } else {
        setProperties(propertiesWithDates);
        // Reset hasMore when doing a fresh load
        setHasMore(propertiesWithDates.length === PROPERTIES_PER_PAGE);
      }
    } catch (err: any) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      } else {
        setIsLoading(false);
      }
    }
  };

  // Load more properties
  const loadMoreProperties = () => {
    setPage(prev => prev + 1);
  };

  // Initial load
  useEffect(() => {
    setPage(1); // Reset page when search params change
    fetchProperties();
  }, [searchParams]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchProperties(true);
    }
  }, [page]);

  // Prepare initial filters from URL search params
  const initialFilters = {
    propertyType: searchParams.get('propertyType') || '',
    minBedrooms: searchParams.get('minBedrooms') || '',
    maxBedrooms: searchParams.get('maxBedrooms') || '',
    minBathrooms: searchParams.get('minBathrooms') || '',
    maxBathrooms: searchParams.get('maxBathrooms') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    amenities: searchParams.getAll('amenities') || [],
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-800 bg-clip-text text-transparent">
            {t('properties')}
          </h1>
          <p className="text-gray-600 mb-4">
            {properties.length > 0 
              ? t('foundProperties', { count: properties.length }) 
              : isLoading 
                ? t('searchingProperties') 
                : t('noPropertiesFound')}
          </p>
        </div>
        
        <Link
          href="/map"
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
        >
          <FaMapMarkerAlt className="mr-2" />
          {t('viewOnMap')}
        </Link>
      </div>
      
      <SearchFilters initialFilters={initialFilters} className="mb-8" />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">{t('noPropertiesFound')}</h3>
          <p className="text-blue-600 mb-4">{t('tryAdjustingFilters')}</p>
        </div>
      ) : (
        <div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property) => (
              <motion.div key={property.id} variants={itemVariants}>
                <PropertyCard {...property} />
              </motion.div>
            ))}
          </motion.div>
          
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMoreProperties}
                disabled={isLoadingMore}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
              >
                {isLoadingMore ? (
                  <>
                    <span className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full" />
                    Loading...
                  </>
                ) : (
                  <>
                    <FaArrowDown className="mr-2" />
                    Load More Properties
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 