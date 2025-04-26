'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { PropertyAmenities } from '@/types/property';

// Import icons
import {
  FaWifi,
  FaWater,
  FaThermometerHalf,
  FaParking,
  FaLock,
  FaSnowflake,
  FaFireExtinguisher,
  FaShieldAlt,
} from 'react-icons/fa';
import {
  MdLocalLaundryService,
  MdKitchen,
  MdPets,
  MdCleaningServices,
  MdOutlineChair,
  MdBalcony,
  MdElevator,
  MdOutlineCable,
} from 'react-icons/md';

// Dynamically import MapComponent with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-gray-100 flex items-center justify-center">Loading map...</div>,
});

// Property types available for selection
const propertyTypes = [
  'Apartment',
  'House',
  'Room',
  'Studio',
  'Flat',
  'Townhouse',
  'Duplex',
  'Penthouse',
];

// Default amenities structure matching PropertyAmenities interface
const defaultAmenities: PropertyAmenities = {
  wifi: false,
  laundry: false,
  kitchen: false,
  waterBills: false,
  petsAllowed: false,
  heating: false,
  parking: false,
  security: false,
  airConditioning: false,
  furnished: false,
  billsIncluded: false,
  studentFriendly: false,
  fireAlarm: false,
  balcony: false,
  elevator: false,
  cableTv: false,
  cleaning: false,
};

// Configuration for amenity display with label as string
const amenitiesConfig = [
  { key: 'wifi', icon: FaWifi, label: 'WiFi Included' },
  { key: 'laundry', icon: MdLocalLaundryService, label: 'Laundry Facilities' },
  { key: 'kitchen', icon: MdKitchen, label: 'Modern Kitchen' },
  { key: 'waterBills', icon: FaWater, label: 'Water Bills Included' },
  { key: 'petsAllowed', icon: MdPets, label: 'Pets Allowed' },
  { key: 'heating', icon: FaThermometerHalf, label: 'Central Heating' },
  { key: 'parking', icon: FaParking, label: 'Parking Available' },
  { key: 'security', icon: FaLock, label: '24/7 Security' },
  { key: 'airConditioning', icon: FaSnowflake, label: 'Air Conditioning' },
  { key: 'furnished', icon: MdOutlineChair, label: 'Fully Furnished' },
  { key: 'billsIncluded', icon: FaWater, label: 'Bills Included' },
  { key: 'studentFriendly', icon: FaShieldAlt, label: 'Student Friendly' },
  { key: 'fireAlarm', icon: FaFireExtinguisher, label: 'Fire Alarm' },
  { key: 'balcony', icon: MdBalcony, label: 'Balcony' },
  { key: 'elevator', icon: MdElevator, label: 'Elevator' },
  { key: 'cableTv', icon: MdOutlineCable, label: 'Cable TV' },
  { key: 'cleaning', icon: MdCleaningServices, label: 'Cleaning Service' },
];

// Database amenity interface
interface DbAmenity {
  id: string;
  name: string;
}

interface PropertyFormProps {
  onSuccess?: () => void;
  propertyId?: string; // For editing existing properties
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onSuccess, propertyId }) => {
  const router = useRouter();
  const isEditing = !!propertyId;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [addressString, setAddressString] = useState('');
  const [borough, setBorough] = useState('');
  const [tubeStation, setTubeStation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [availableDate, setAvailableDate] = useState('');
  const [latitude, setLatitude] = useState('51.5074'); // Default London coordinates
  const [longitude, setLongitude] = useState('-0.1278');
  const [amenities, setAmenities] = useState<PropertyAmenities>(defaultAmenities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for database amenities
  const [availableDbAmenities, setAvailableDbAmenities] = useState<DbAmenity[]>([]);
  const [isDbAmenitiesLoading, setIsDbAmenitiesLoading] = useState(true);

  // Fetch property data if editing
  useEffect(() => {
    if (propertyId) {
      const fetchProperty = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/properties/${propertyId}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch property');
          }
          
          const data = await response.json();
          
          // Populate form with existing data
          setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price.toString());
          setAddressString(data.address);
          setBorough(data.borough || '');
          setTubeStation(data.tubeStation || '');
          setPropertyType(data.propertyType);
          setBedrooms(data.bedrooms.toString());
          setBathrooms(data.bathrooms.toString());
          
          // Format date for input field (YYYY-MM-DD)
          if (data.available) {
            const date = new Date(data.available);
            setAvailableDate(date.toISOString().split('T')[0]);
          }
          
          setLatitude(data.latitude?.toString() || '51.5074');
          setLongitude(data.longitude?.toString() || '-0.1278');
          
          // Merge existing amenities with defaults
          if (data.amenities) {
            setAmenities({
              ...defaultAmenities,
              ...data.amenities
            });
          }
          
        } catch (err) {
          console.error('Error fetching property:', err);
          setError('Failed to load property data');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProperty();
    }
  }, [propertyId]);
  
  // Fetch available amenities from database
  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setIsDbAmenitiesLoading(true);
        const response = await fetch('/api/properties?amenitiesOnly=true');
        
        if (!response.ok) {
          throw new Error('Failed to fetch amenities');
        }
        
        const data = await response.json();
        setAvailableDbAmenities(data.amenities || []);
      } catch (err) {
        console.error('Error fetching amenities:', err);
        toast.error('Failed to load amenities');
      } finally {
        setIsDbAmenitiesLoading(false);
      }
    };
    
    fetchAmenities();
  }, []);

  // Handle map marker change
  const handleMarkerChange = (lat: number, lng: number) => {
    setLatitude(lat.toString());
    setLongitude(lng.toString());
  };

  // Toggle amenity
  const toggleAmenity = (key: string) => {
    setAmenities(prev => ({
      ...prev,
      [key]: !prev[key as keyof PropertyAmenities]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Prepare data for API
      const propertyData = {
        title,
        description,
        price: parseFloat(price),
        addressString,
        borough: borough || null,
        tubeStation: tubeStation || null,
        propertyType,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        available: new Date(availableDate).toISOString(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        amenities
      };
      
      // Validate required fields
      if (!title || !description || !price || !addressString || !propertyType || !availableDate) {
        setError('Please fill in all required fields');
        return;
      }
      
      // API endpoint and method based on create/edit mode
      const endpoint = isEditing 
        ? `/api/properties/${propertyId}` 
        : '/api/properties';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // Submit to API
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save property');
      }
      
      // Show success message
      toast.success(isEditing ? 'Property updated successfully!' : 'Property created successfully!');
      
      // Execute success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        // Redirect to property page or dashboard
        router.push(isEditing ? `/properties/${propertyId}` : '/dashboard');
      }
      
    } catch (err: any) {
      console.error('Error saving property:', err);
      setError(err.message || 'An error occurred. Please try again.');
      toast.error(err.message || 'Failed to save property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Property' : 'Add New Property'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Basic Details Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Spacious 2-Bedroom Apartment in Central London"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Describe your property in detail..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rent (£)*
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="1200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type*
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select property type</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms*
            </label>
            <input
              type="number"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms*
            </label>
            <input
              type="number"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Available From*
            </label>
            <input
              type="date"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Images Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Property Images</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-500">
                  Drag and drop image files, or <span className="text-blue-600">browse</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <button
                  type="button"
                  className="mt-4 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Select Files
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Image upload will be implemented in a future update. Please provide the property address and we will contact you to collect images.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Location Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Location</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address*
            </label>
            <input
              type="text"
              value={addressString}
              onChange={(e) => setAddressString(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 London Street, London"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Borough
            </label>
            <input
              type="text"
              value={borough}
              onChange={(e) => setBorough(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Westminster"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nearest Tube/Train Station
            </label>
            <input
              type="text"
              value={tubeStation}
              onChange={(e) => setTubeStation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Baker Street"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude*
            </label>
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="51.5074"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude*
            </label>
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="-0.1278"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pin Location on Map
            </label>
            <div className="h-[400px] border border-gray-300 rounded-md overflow-hidden">
              <MapComponent
                center={[parseFloat(latitude) || 51.5074, parseFloat(longitude) || -0.1278]}
                zoom={13}
                markerPosition={[parseFloat(latitude) || 51.5074, parseFloat(longitude) || -0.1278]}
                onMarkerChange={handleMarkerChange}
                showControls={true}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click on the map to set the exact location of your property.
            </p>
          </div>
        </div>
      </div>
      
      {/* Amenities Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Amenities</h3>
        
        {isDbAmenitiesLoading ? (
          <div className="flex justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenitiesConfig.map((amenity) => {
              // Check if this amenity exists in our database
              const dbAmenityExists = availableDbAmenities.some(
                dbAmenity => dbAmenity.name.toLowerCase() === amenity.key.toLowerCase()
              );
              
              return (
                <div
                  key={amenity.key}
                  onClick={() => toggleAmenity(amenity.key)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    !dbAmenityExists 
                      ? 'opacity-50 bg-gray-100' 
                      : amenities[amenity.key as keyof PropertyAmenities]
                        ? 'bg-blue-50 border-blue-200 border'
                        : 'bg-gray-50 border-gray-200 border'
                  }`}
                >
                  <div className="mr-3">
                    <amenity.icon
                      className={`w-5 h-5 ${
                        !dbAmenityExists
                          ? 'text-gray-400'
                          : amenities[amenity.key as keyof PropertyAmenities]
                            ? 'text-blue-600'
                            : 'text-gray-400'
                      }`}
                    />
                  </div>
                  <div
                    className={
                      !dbAmenityExists
                        ? 'text-gray-400'
                        : amenities[amenity.key as keyof PropertyAmenities]
                          ? 'text-gray-800 font-medium'
                          : 'text-gray-500'
                    }
                  >
                    <span>{amenity.label}</span>
                    {!dbAmenityExists && <span className="text-xs ml-1">(Not Available)</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading
            ? 'Saving...'
            : isEditing
            ? 'Update Property'
            : 'Add Property'}
        </button>
      </div>
    </form>
  );
};

export default PropertyForm; 