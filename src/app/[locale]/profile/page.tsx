'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  propertyId: string;
  property: {
    id: string;
    title: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const { user, isLoading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      const fetchUserData = async () => {
        try {
          setIsDataLoading(true);
          
          // Fetch favorites
          const favoritesRes = await fetch('/api/favorites');
          if (!favoritesRes.ok) {
            throw new Error(`Failed to fetch favorites: ${favoritesRes.status}`);
          }
          const favoritesData = await favoritesRes.json();
          
          // Fetch user reviews
          const reviewsRes = await fetch('/api/user/reviews');
          if (!reviewsRes.ok) {
            throw new Error(`Failed to fetch reviews: ${reviewsRes.status}`);
          }
          const reviewsData = await reviewsRes.json();
          
          setFavorites(favoritesData.properties || []);
          setReviews(reviewsData.reviews || []);
          setError(null);
        } catch (err: any) {
          console.error('Error fetching user data:', err);
          setError(err.message || 'Failed to load user data');
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchUserData();
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Unauthorized</h1>
        <p className="mt-2">{t('pleaseLogin')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{t('myProfile')}</h1>
          <p className="text-gray-600 mt-2">{t('welcomeMessage', { name: user.name || user.email })}</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {isDataLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* User Information */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 mb-8"
            >
              <h2 className="text-xl font-semibold mb-4">{t('personalInformation')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">{t('email')}</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('name')}</p>
                  <p className="font-medium">{user.name || t('notProvided')}</p>
                </div>
                <div>
                  <p className="text-gray-500">{t('role')}</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                  {t('editProfile')}
                </button>
              </div>
            </motion.section>

            {/* Favorites Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-semibold mb-6">{t('myFavorites')}</h2>
              
              {favorites.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('noFavorites')}</h3>
                  <p className="text-gray-600 mb-4">{t('startBrowsing')}</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                    {t('browseProperties')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((prop: any) => (
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
            </motion.section>

            {/* Reviews Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold mb-6">{t('myReviews')}</h2>
              
              {reviews.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('noReviews')}</h3>
                  <p className="text-gray-600">{t('shareExperience')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{review.property.title}</h3>
                        <div className="flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span>{review.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          </>
        )}
      </motion.div>
    </div>
  );
} 