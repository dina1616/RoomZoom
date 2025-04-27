'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BiArea, BiBed, BiBath, BiMap } from 'react-icons/bi';
import { FaUniversity } from 'react-icons/fa';
import { MdChair } from 'react-icons/md';
import { BsCalendarDate, BsHouse } from 'react-icons/bs';
import dynamic from 'next/dynamic';
import ImageComponent from '../../../../components/ImageComponent';

// Media item interface
interface MediaItem {
  id: string;
  url: string;
  type: string;
  order?: number | null;
}

// Updated Property type to match the actual API response
type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  borough?: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  available: Date | string;
  images?: string;
  media?: MediaItem[];
  latitude: number;
  longitude: number;
  tubeStation?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  owner?: {
    id: string;
    name: string;
    email?: string;
  };
  reviews?: any[];
};

// Dynamically load PropertyMap component to avoid SSR issues
const PropertyMapWithNoSSR = dynamic(() => import('../../../../components/PropertyMap'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
});

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Process property images
  const imageUrls = useMemo(() => {
    if (!property) return [];
    
    // Use media array if available
    if (property.media && property.media.length > 0) {
      return property.media.map(item => item.url);
    }
    
    // Fallback to images string field if available
    if (property.images) {
      return [property.images];
    }
    
    // Default fallback
    return ['/images/placeholder-property.jpg'];
  }, [property]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch property');
        }
        
        const data = await res.json();
        
        // Extract the property object from the response
        const propertyData = data.property;
        setProperty(propertyData);

        // Track the property view
        trackPropertyView(propertyData.id);
      } catch (err) {
        setError('Error loading property details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProperty();
    }
  }, [id]);

  // Function to track property view
  const trackPropertyView = async (propertyId: string) => {
    try {
      // Call the view tracking API
      await fetch(`/api/properties/${propertyId}/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // No need to handle the response as this is a background operation
    } catch (error) {
      // Just log the error, don't affect the user experience
      console.error('Failed to track property view:', error);
    }
  };

  const nextImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (imageUrls.length > 1) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
        <div className="w-full h-8 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="w-full h-64 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
          </div>
          <div>
            <div className="w-full h-10 bg-gray-200 animate-pulse rounded mb-4"></div>
            <div className="w-full h-40 bg-gray-200 animate-pulse rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error || 'Property not found'}</span>
        </div>
        <Link href="/properties" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to properties
        </Link>
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(property.available).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/properties" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to properties
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        {/* Left column - Image gallery */}
        <div>
          <div className="relative rounded-lg overflow-hidden h-[400px] bg-gray-100">
            {imageUrls.length > 0 ? (
              <>
                <ImageComponent 
                  src={imageUrls[currentImageIndex]} 
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  priority
                />
                {imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={prevImage} 
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-70"
                    >
                      &lt;
                    </button>
                    <button 
                      onClick={nextImage} 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-opacity-70"
                    >
                      &gt;
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {imageUrls.map((_, index) => (
                        <span 
                          key={index} 
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p className="flex items-center text-gray-600 mb-4">
              <BiMap className="mr-2" /> {property.address}
            </p>
            
            {/* Property Map */}
            {property.latitude && property.longitude && (
              <div className="mt-4 h-64 rounded-lg overflow-hidden border border-gray-200">
                <PropertyMapWithNoSSR 
                  latitude={property.latitude} 
                  longitude={property.longitude}
                  title={property.title}
                  price={property.price}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right column - Property details */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-4">£{property.price.toLocaleString()} / month</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <BiBed className="text-blue-500 mr-2 text-xl" />
              <span>{property.bedrooms} Bedroom{property.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <BiBath className="text-blue-500 mr-2 text-xl" />
              <span>{property.bathrooms} Bathroom{property.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center">
              <BsHouse className="text-blue-500 mr-2 text-xl" />
              <span>{property.propertyType}</span>
            </div>
            <div className="flex items-center">
              <BsCalendarDate className="text-blue-500 mr-2 text-xl" />
              <span>Available from {formattedDate}</span>
            </div>
            {property.tubeStation && (
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">🚇</span>
                <span>Near {property.tubeStation} Station</span>
              </div>
            )}
            {property.borough && (
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">📍</span>
                <span>{property.borough}</span>
              </div>
            )}
          </div>
          
          {property.averageRating && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-800">
                <span className="font-semibold mr-2">Rating:</span>
                <span className="text-yellow-500">
                  {'★'.repeat(Math.round(property.averageRating))}
                  {'☆'.repeat(5 - Math.round(property.averageRating))}
                </span>
                <span className="ml-2">{property.averageRating.toFixed(1)}/5</span>
              </div>
              <p className="text-blue-700 mt-1">
                Based on {property.reviews?.length || 0} reviews
              </p>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>
          
          {property.owner && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Contact Landlord</h3>
              <p className="text-gray-600">
                {property.owner.name}
                {property.owner.email && <span className="block mt-1">{property.owner.email}</span>}
              </p>
            </div>
          )}
          
          <div className="mt-8">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
              Contact Landlord
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 