'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StatisticsCard from '@/components/StatisticsCard';

// Dashboard stats interface
interface DashboardStats {
  totalProperties: number;
  averageRent: number;
  viewsCount: number;
  inquiriesCount: number;
}

// Dashboard page component with user-specific data
export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { user, isLoading } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    averageRent: 0,
    viewsCount: 0,
    inquiriesCount: 0
  });
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch landlord-specific data
  useEffect(() => {
    if (!isLoading && user) {
      const fetchDashboardData = async () => {
        try {
          setIsDataLoading(true);
          // Fetch properties owned by the landlord
          const res = await fetch('/api/landlord/properties?take=10&skip=0');
          
          if (!res.ok) {
            throw new Error(`Failed to fetch properties: ${res.status}`);
          }
          
          const data = await res.json();
          
          // Ensure properties is always an array
          const propertiesArray = Array.isArray(data.properties) ? data.properties : [];
          setProperties(propertiesArray);
          
          // Calculate stats
          const totalProps = propertiesArray.length;
          const avgPrice = totalProps > 0 
            ? propertiesArray.reduce((sum: number, p: any) => sum + (p.price || 0), 0) / totalProps 
            : 0;
            
          // Set statistics from API response or default to 0
          setStats({
            totalProperties: totalProps,
            averageRent: avgPrice,
            viewsCount: data.viewsCount || 0,
            inquiriesCount: data.inquiriesCount || 0
          });
          
          setError(null);
        } catch (err: any) {
          console.error('Error fetching dashboard data:', err);
          setError(err.message || 'Failed to load dashboard data');
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchDashboardData();
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
        <p className="mt-2">Please log in to access your dashboard.</p>
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
          <h1 className="text-3xl font-bold">{t('landlordDashboard')}</h1>
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
            {/* Stats Overview */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <StatisticsCard
                title={t('totalProperties')}
                value={stats.totalProperties}
                icon="property"
                color="blue"
                isLoading={isDataLoading}
              />
              <StatisticsCard
                title={t('averageRent')}
                value={`£${stats.averageRent.toFixed(0)}`}
                icon="price"
                color="green"
                isLoading={isDataLoading}
              />
              <StatisticsCard
                title={t('viewsCount')}
                value={stats.viewsCount}
                icon="view"
                color="purple"
                isLoading={isDataLoading}
              />
              <StatisticsCard
                title={t('inquiriesCount')}
                value={stats.inquiriesCount}
                icon="inquiry"
                color="orange"
                isLoading={isDataLoading}
              />
            </motion.div>

            {/* Properties List */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">{t('yourProperties')}</h2>
                <Link 
                  href="/dashboard/add-property"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                >
                  {t('addProperty')}
                </Link>
              </div>
              
              {properties.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('noProperties')}</h3>
                  <p className="text-gray-600 mb-4">{t('startAddingProperties')}</p>
                  <Link 
                    href="/dashboard/add-property" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                  >
                    {t('addFirstProperty')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <motion.div 
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <PropertyCard
                        id={property.id}
                        title={property.title}
                        price={property.price}
                        address={property.addressString || ''}
                        tubeStation={property.tubeStation || ''}
                        bedrooms={property.bedrooms}
                        bathrooms={property.bathrooms}
                        media={property.media}
                        amenities={property.amenities || []}
                        rating={0}
                        reviewCount={0}
                        availableFrom={new Date(property.available)}
                        propertyType={property.propertyType}
                        isLandlordView={true}
                      />
                      {/* Add Stats button */}
                      <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                        <Link 
                          href={`/dashboard/property-stats/${property.id}`} 
                          className="text-indigo-600 hover:text-indigo-800 flex items-center"
                        >
                          <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          View Statistics
                        </Link>
                        <span className="text-sm text-gray-500">
                          {property.stats ? `${property.stats.viewCount} views` : 'No stats'}
                        </span>
                      </div>
                    </motion.div>
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