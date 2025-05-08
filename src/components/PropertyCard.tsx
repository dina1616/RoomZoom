'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaBed, FaBath, FaSubway, FaWifi, FaWater } from 'react-icons/fa';
import { MdLocalLaundryService, MdKitchen, MdPets } from 'react-icons/md';
import ImageComponent from './ImageComponent';
import { useParams } from 'next/navigation';

interface Amenity {
  icon: JSX.Element;
  label: string;
  available: boolean;
}

interface MediaItem {
  id: string;
  url: string;
  type: string;
  order?: number;
}

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  address: string;
  tubeStation?: string;
  bedrooms: number;
  bathrooms: number;
  imageUrl?: string[];
  media?: MediaItem[];
  squareFootage?: number;
  amenities?: any;
  rating?: number;
  reviewCount?: number;
  availableFrom: Date;
  propertyType: string;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  isLandlordView?: boolean;
  property?: any;
}

export default function PropertyCard({
  id,
  title,
  price,
  address,
  tubeStation,
  bedrooms,
  bathrooms,
  imageUrl,
  media,
  squareFootage,
  amenities = {},
  rating,
  reviewCount,
  availableFrom,
  propertyType,
  isFavorited = false,
  onFavoriteToggle,
  isLandlordView = false,
  property,
}: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const params = useParams();
  const locale = params.locale || 'en';
  
  // Process images from media array or fallback to imageUrl
  const processedImages = useMemo(() => {
    // Remove debug console.logs
    
    if (media && Array.isArray(media) && media.length > 0) {
      return media.map(item => item.url).filter(Boolean);
    } 
    
    if (imageUrl && Array.isArray(imageUrl) && imageUrl.length > 0) {
      return imageUrl.filter(url => typeof url === 'string');
    } 
    
    if (property?.images) {
      // Handle the case where images is a string field (comma-separated or single URL)
      const imagesField = property.images;
      if (typeof imagesField === 'string') {
        if (imagesField.includes(',')) {
          return imagesField.split(',').map(url => url.trim()).filter(Boolean);
        }
        return [imagesField];
      }
      
      // If it's an array
      if (Array.isArray(imagesField) && imagesField.length > 0) {
        return imagesField.filter(Boolean);
      }
    }
    
    // Use a valid placeholder image path
    return ['/images/placeholder-property.jpg'];
  }, [media, imageUrl, property?.images]);

  const hasAmenity = (name: string): boolean => {
    if (!amenities || typeof amenities !== 'object') return false;
    if (Array.isArray(amenities)) {
      return amenities.some(a => a?.name === name);
    }
    return !!amenities[name];
  };

  const amenitiesList: Amenity[] = [
    { icon: <FaWifi className="w-4 h-4" />, label: 'WiFi', available: hasAmenity('WiFi') },
    { icon: <MdLocalLaundryService className="w-4 h-4" />, label: 'Laundry', available: hasAmenity('Laundry') },
    { icon: <MdKitchen className="w-4 h-4" />, label: 'Kitchen', available: hasAmenity('Kitchen') },
    { icon: <FaWater className="w-4 h-4" />, label: 'Bills Included', available: hasAmenity('Bills Included') },
    { icon: <MdPets className="w-4 h-4" />, label: 'Pets Allowed', available: hasAmenity('Pet Friendly') || hasAmenity('Pets Allowed') },
  ];

  // Memoize the available amenities to prevent unnecessary recalculations
  const availableAmenitiesList = useMemo(() => {
    return amenitiesList.filter(amenity => amenity.available);
  }, [amenitiesList]);

  // Memoize the navigation functions
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % processedImages.length);
  }, [processedImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length);
  }, [processedImages.length]);

  // Reset image index when images change
  useEffect(() => {
    setCurrentImageIndex(0);
    setImgError(false);
  }, [processedImages]);

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Image Carousel */}
        <div className="relative h-64 w-full">
          <ImageComponent
            src={processedImages[currentImageIndex]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            onError={() => setImgError(true)}
            priority
          />
          {isHovered && processedImages.length > 1 && !imgError && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                ←
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavoriteToggle?.(id)}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
        >
          {isFavorited ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FaRegHeart className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {propertyType}
        </div>
      </div>

      <Link href={`/${locale}/properties/${id}`}>
        <div className="p-5">
          {/* Title and Price */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-2xl font-bold text-blue-600">£{price.toLocaleString()} /month</p>
          </div>

          {/* Location Info */}
          <div className="mb-4 text-gray-600">
            <p className="mb-1">{address}</p>
            {tubeStation && (
              <div className="flex items-center text-sm text-blue-500">
                <FaSubway className="mr-1" />
                <span>{tubeStation} Station</span>
              </div>
            )}
          </div>

          {/* Landlord Actions (conditionally rendered) */}
          {isLandlordView && (
            <div className="flex items-center gap-2 mb-4">
              <Link 
                href={`/dashboard/edit-property/${id}`}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </Link>
            </div>
          )}

          {/* Key Features */}
          <div className="flex items-center gap-4 mb-4 text-gray-600">
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span>{bathrooms}</span>
            </div>
            {squareFootage && (
              <div className="text-sm">
                {squareFootage} sq ft
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {availableAmenitiesList.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600"
                title={amenity.label}
              >
                {amenity.icon}
                <span className="ml-1 hidden sm:inline">{amenity.label}</span>
              </div>
            ))}
          </div>

          {/* Rating and Reviews */}
          {rating && (
            <div className="flex items-center text-sm text-gray-600">
              <div className="flex items-center">
                {'★'.repeat(Math.round(rating))}
                {'☆'.repeat(5 - Math.round(rating))}
              </div>
              <span className="ml-2">
                {rating.toFixed(1)} ({reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Available From */}
          <div className="mt-3 text-sm text-gray-500">
            Available from {availableFrom.toLocaleDateString()}
          </div>
        </div>
      </Link>
    </div>
  );
}
