'use client';

import { useEffect, useState } from 'react';
import PropertyCard from './PropertyCard';

interface SimilarPropertiesProps {
  currentPropertyId: string;
  borough: string | null;
  propertyType: string;
  priceRange: [number, number];
}

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  tubeStation?: string;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  amenities: {
    wifi: boolean;
    laundry: boolean;
    kitchen: boolean;
    waterBills: boolean;
    petsAllowed: boolean;
  };
  rating?: number;
  reviewCount?: number;
  availableFrom: Date;
  propertyType: string;
}

export default function SimilarProperties({
  currentPropertyId,
  borough,
  propertyType,
  priceRange,
}: SimilarPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarProperties = async () => {
      try {
        const queryParams = new URLSearchParams({
          borough: borough || '',
          propertyType,
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
          exclude: currentPropertyId,
        });

        const response = await fetch(`/api/properties?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch similar properties');

        const data = await response.json();
        setProperties(data.slice(0, 3)); // Show only 3 similar properties
      } catch (error) {
        console.error('Error fetching similar properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProperties();
  }, [currentPropertyId, borough, propertyType, priceRange]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse rounded-lg h-[400px]"
          ></div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No similar properties found in this area.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title}
          price={property.price}
          address={property.address}
          tubeStation={property.tubeStation}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          imageUrl={property.images}
          amenities={property.amenities}
          rating={property.rating}
          reviewCount={property.reviewCount}
          availableFrom={new Date(property.availableFrom)}
          propertyType={property.propertyType}
        />
      ))}
    </div>
  );
}
