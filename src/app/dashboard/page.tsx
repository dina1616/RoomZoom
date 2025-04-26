import React from 'react';
import PropertyCard from '@/components/PropertyCard';

// This page is protected by middleware
export default async function DashboardPage() {
  // TODO: Fetch landlord-specific data
  const res = await fetch('/api/landlord/properties?take=10&skip=0', { cache: 'no-store' });
  const { properties } = await res.json();
  const totalProps = properties.length;
  const avgPrice = properties.reduce((sum: number, p: any) => sum + p.price, 0) / (totalProps || 1);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
      <div className="mt-4 flex space-x-8">
        <div>
          <h2 className="text-lg font-semibold">Total Properties</h2>
          <p className="text-2xl">{totalProps}</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Avg. Rent</h2>
          <p className="text-2xl">£{avgPrice.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop: any) => (
          <PropertyCard
            key={prop.id}
            id={prop.id}
            title={prop.title}
            price={prop.price}
            address={prop.addressString || ''}
            tubeStation={prop.tubeStation || undefined}
            bedrooms={prop.bedrooms}
            bathrooms={prop.bathrooms}
            media={prop.media}
            amenities={prop.amenities}
            availableFrom={new Date(prop.available)}
            propertyType={prop.propertyType}
          />
        ))}
      </div>
    </div>
  );
} 