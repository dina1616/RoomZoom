'use client'; // Needs to be client component to use hooks like useAuth

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming useAuth provides user info
import PropertyCard from '@/components/PropertyCard';

// This page is protected by middleware
export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && user) {
      // Fetch favorites
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => setFavorites(data.properties || []))
        .catch(console.error);
      // Fetch user reviews
      fetch('/api/user/reviews')
        .then(res => res.json())
        .then(data => setReviews(data.reviews || []))
        .catch(console.error);
    }
  }, [isLoading, user]);

  if (isLoading) {
    return <div>Loading profile...</div>; // Or a spinner component
  }

  if (!user) {
    // This shouldn't happen if middleware is working, but good practice
    return <div>Please log in to view your profile.</div>; 
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold">My Profile</h1>

      {/* Favorites Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Favorites</h2>
        {favorites.length === 0 ? (
          <p className="text-gray-600">You have no favorite properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(prop => (
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
                isFavorited={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">My Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600">You haven't submitted any reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map(r => (
              <li key={r.id} className="p-4 border rounded bg-white shadow-sm">
                <h3 className="font-semibold">Review for: {r.property.title}</h3>
                <p className="text-yellow-400">Rating: {r.rating} / 5</p>
                <p className="text-gray-700">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* TODO: Bookings Section */}
    </div>
  );
} 