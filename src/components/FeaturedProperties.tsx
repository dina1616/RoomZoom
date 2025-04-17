'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import { FaSpinner } from 'react-icons/fa';

interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  tubeStation?: string;
  bedrooms: number;
  bathrooms: number;
  images: string;
  rating?: number;
  reviewCount?: number;
  available: Date;
  propertyType: string;
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties?featured=true');
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        setProperties(data.slice(0, 3)); // Show only 3 featured properties
      } catch (err) {
        setError('Failed to load featured properties');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
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
          key={property.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
        >
          <PropertyCard
            id={property.id}
            title={property.title}
            price={property.price}
            address={property.address}
            tubeStation={property.tubeStation}
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            imageUrl={[property.images]}
            amenities={{}}
            rating={property.rating}
            reviewCount={property.reviewCount}
            availableFrom={new Date(property.available)}
            propertyType={property.propertyType}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
