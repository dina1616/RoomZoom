'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFilter, FaBed, FaBath, FaHome, FaPoundSign } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { IoWifiSharp } from 'react-icons/io5';
import { GiWashingMachine, GiCctvCamera } from 'react-icons/gi';
import { TbAirConditioning } from 'react-icons/tb';
import { BsFillDoorOpenFill } from 'react-icons/bs';
import { useRouter, usePathname, useParams } from 'next/navigation';

interface AmenityOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PropertyTypeOption {
  value: string;
  label: string;
}

interface SearchFiltersProps {
  initialFilters?: {
    propertyType?: string;
    minBedrooms?: string;
    maxBedrooms?: string;
    minBathrooms?: string;
    maxBathrooms?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string[];
  };
  className?: string;
}

export default function SearchFilters({ initialFilters = {}, className = '' }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  // Filter states
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType || '');
  const [minBedrooms, setMinBedrooms] = useState(initialFilters.minBedrooms || '');
  const [maxBedrooms, setMaxBedrooms] = useState(initialFilters.maxBedrooms || '');
  const [minBathrooms, setMinBathrooms] = useState(initialFilters.minBathrooms || '');
  const [maxBathrooms, setMaxBathrooms] = useState(initialFilters.maxBathrooms || '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialFilters.amenities || []);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Property type options
  const propertyTypes: PropertyTypeOption[] = [
    { value: '', label: 'Any Type' },
    { value: 'APARTMENT', label: 'Apartment' },
    { value: 'HOUSE', label: 'House' },
    { value: 'CONDO', label: 'Condo' },
    { value: 'STUDIO', label: 'Studio' },
    { value: 'DORM', label: 'Dorm' }
  ];

  // Amenity options
  const amenityOptions: AmenityOption[] = [
    { id: 'wifi', label: 'WiFi', icon: <IoWifiSharp className="text-blue-500" /> },
    { id: 'laundry', label: 'Laundry', icon: <GiWashingMachine className="text-green-500" /> },
    { id: 'airConditioning', label: 'AC', icon: <TbAirConditioning className="text-sky-500" /> },
    { id: 'security', label: 'Security', icon: <GiCctvCamera className="text-red-500" /> },
    { id: 'privateEntrance', label: 'Private Entrance', icon: <BsFillDoorOpenFill className="text-purple-500" /> }
  ];

  // Bedroom options
  const bedroomOptions = ['', '1', '2', '3', '4', '5+'];

  // Bathroom options
  const bathroomOptions = ['', '1', '2', '3+'];

  // Price range options
  const priceOptions = ['', '500', '1000', '1500', '2000', '2500', '3000+'];

  // Toggle amenity selection
  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId) 
        : [...prev, amenityId]
    );
  };

  // Apply filters
  const applyFilters = () => {
    const searchParams = new URLSearchParams();
    
    if (propertyType) searchParams.append('propertyType', propertyType);
    if (minBedrooms) searchParams.append('minBedrooms', minBedrooms);
    if (maxBedrooms) searchParams.append('maxBedrooms', maxBedrooms);
    if (minBathrooms) searchParams.append('minBathrooms', minBathrooms);
    if (maxBathrooms) searchParams.append('maxBathrooms', maxBathrooms);
    if (minPrice) searchParams.append('minPrice', minPrice);
    if (maxPrice) searchParams.append('maxPrice', maxPrice);
    
    if (selectedAmenities.length > 0) {
      selectedAmenities.forEach(amenity => {
        searchParams.append('amenities', amenity);
      });
    }
    
    // Keep the current pathname but append the search parameters
    const locale = params.locale || 'en';
    const basePath = `/${locale}/properties`;
    router.push(`${basePath}?${searchParams.toString()}`);
    setIsFilterVisible(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setPropertyType('');
    setMinBedrooms('');
    setMaxBedrooms('');
    setMinBathrooms('');
    setMaxBathrooms('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedAmenities([]);
    
    // Keep the current pathname without any search parameters
    const locale = params.locale || 'en';
    router.push(`/${locale}/properties`);
    setIsFilterVisible(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (propertyType) count++;
    if (minBedrooms || maxBedrooms) count++;
    if (minBathrooms || maxBathrooms) count++;
    if (minPrice || maxPrice) count++;
    count += selectedAmenities.length;
    return count;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <FaFilter className={getActiveFilterCount() > 0 ? "text-blue-600" : "text-gray-500"} />
          <span className="font-medium">Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
        
        {getActiveFilterCount() > 0 && (
          <button 
            onClick={clearFilters} 
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      
      {isFilterVisible && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-lg rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filter Properties</h3>
            <button 
              onClick={() => setIsFilterVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Property Type Filter */}
            <motion.div variants={itemVariants} className="mb-4">
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <FaHome className="mr-2 text-indigo-600" />
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </motion.div>
            
            {/* Bedroom Filter */}
            <motion.div variants={itemVariants} className="mb-4">
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <FaBed className="mr-2 text-blue-600" />
                Bedrooms
              </label>
              <div className="flex space-x-2">
                <select
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {bedroomOptions.map(num => (
                    <option key={`min-${num}`} value={num}>
                      {num ? `Min ${num}` : 'Min'}
                    </option>
                  ))}
                </select>
                <select
                  value={maxBedrooms}
                  onChange={(e) => setMaxBedrooms(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {bedroomOptions.map(num => (
                    <option key={`max-${num}`} value={num}>
                      {num ? `Max ${num}` : 'Max'}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            
            {/* Bathroom Filter */}
            <motion.div variants={itemVariants} className="mb-4">
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <FaBath className="mr-2 text-green-600" />
                Bathrooms
              </label>
              <div className="flex space-x-2">
                <select
                  value={minBathrooms}
                  onChange={(e) => setMinBathrooms(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  {bathroomOptions.map(num => (
                    <option key={`min-${num}`} value={num}>
                      {num ? `Min ${num}` : 'Min'}
                    </option>
                  ))}
                </select>
                <select
                  value={maxBathrooms}
                  onChange={(e) => setMaxBathrooms(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  {bathroomOptions.map(num => (
                    <option key={`max-${num}`} value={num}>
                      {num ? `Max ${num}` : 'Max'}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
            
            {/* Price Range Filter */}
            <motion.div variants={itemVariants} className="mb-4">
              <label className="flex items-center mb-2 text-sm font-medium text-gray-700">
                <FaPoundSign className="mr-2 text-yellow-600" />
                Price Range (£)
              </label>
              <div className="flex space-x-2">
                <select
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {priceOptions.map(price => (
                    <option key={`min-${price}`} value={price}>
                      {price ? `£${price}` : 'Min'}
                    </option>
                  ))}
                </select>
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                >
                  {priceOptions.map(price => (
                    <option key={`max-${price}`} value={price}>
                      {price ? `£${price}` : 'Max'}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </div>
          
          {/* Amenities Filter */}
          <motion.div variants={itemVariants} className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map(amenity => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm transition-colors ${
                    selectedAmenities.includes(amenity.id)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-1">{amenity.icon}</span>
                  <span>{amenity.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-6 flex justify-end space-x-3"
          >
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md hover:from-blue-700 hover:to-indigo-800 transition-colors"
            >
              Apply Filters
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} 