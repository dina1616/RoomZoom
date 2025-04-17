'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BiArea, BiBed, BiBath, BiMap } from 'react-icons/bi';
import { FaUniversity } from 'react-icons/fa';
import { MdChair } from 'react-icons/md';
import { BsCalendarDate, BsHouse } from 'react-icons/bs';
import dynamic from 'next/dynamic';

// Define Property type
type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  isAvailable: boolean;
  availableFrom: string;
  sqMeters: number;
  isFurnished: boolean;
  nearestUniversity: string;
  distanceToUniversity: number;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  latitude: number;
  longitude: number;
  userId: string;
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch property');
        }
        
        const data = await res.json();
        setProperty(data);
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

  const nextImage = () => {
    if (property?.imageUrls && property.imageUrls.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === property.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.imageUrls && property.imageUrls.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? property.imageUrls.length - 1 : prevIndex - 1
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

  const formattedDate = new Date(property.availableFrom).toLocaleDateString('en-GB', {
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
            {property.imageUrls && property.imageUrls.length > 0 ? (
              <>
                <Image 
                  src={property.imageUrls[currentImageIndex] || "/placeholder-property.jpg"} 
                  alt={property.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
                {property.imageUrls.length > 1 && (
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
                      {property.imageUrls.map((_, index) => (
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
              <BiArea className="text-blue-500 mr-2 text-xl" />
              <span>{property.sqMeters} m²</span>
            </div>
            <div className="flex items-center">
              <BsHouse className="text-blue-500 mr-2 text-xl" />
              <span>{property.propertyType}</span>
            </div>
            <div className="flex items-center">
              <MdChair className="text-blue-500 mr-2 text-xl" />
              <span>{property.isFurnished ? 'Furnished' : 'Unfurnished'}</span>
            </div>
            <div className="flex items-center">
              <BsCalendarDate className="text-blue-500 mr-2 text-xl" />
              <span>Available from {formattedDate}</span>
            </div>
          </div>
          
          {property.nearestUniversity && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center text-blue-800">
                <FaUniversity className="mr-2 text-xl" />
                <span className="font-semibold">Near {property.nearestUniversity}</span>
              </div>
              {property.distanceToUniversity && (
                <p className="text-blue-700 mt-1">
                  {property.distanceToUniversity < 1 
                    ? `${Math.round(property.distanceToUniversity * 1000)} meters away` 
                    : `${property.distanceToUniversity.toFixed(1)} km away`}
                </p>
              )}
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>
          
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