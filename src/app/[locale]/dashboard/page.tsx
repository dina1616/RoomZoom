'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import InquiryList from '@/components/InquiryList';
import PropertyCard from '@/components/PropertyCard';
import { motion } from 'framer-motion';
import { FiHome, FiEye, FiMessageSquare, FiDollarSign } from 'react-icons/fi';

// Dashboard Stats Type
interface DashboardStats {
  totalProperties: number;
  averageRent: number;
  viewsCount: number;
  inquiriesCount: number;
  propertyTypes: Record<string, number>;
  recentActivity: Array<{ id: string; type: string; message: string; date: string }>;
}

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const { user, isLoading } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    averageRent: 0,
    viewsCount: 0,
    inquiriesCount: 0,
    propertyTypes: {},
    recentActivity: []
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'inquiries'>('overview');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && user) {
      const fetchDashboardData = async () => {
        try {
          setIsDataLoading(true);
          const res = await fetch('/api/landlord/properties');
          
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
            
          // Extract property types for chart data
          const propertyTypeCount: Record<string, number> = {};
          propertiesArray.forEach((p: any) => {
            const type = p.propertyType || 'Other';
            propertyTypeCount[type] = (propertyTypeCount[type] || 0) + 1;
          });
            
          // Mock recent activity (replace with real data when available)
          const mockRecentActivity = [
            { id: '1', type: 'inquiry', message: 'New inquiry for London Apartment', date: new Date().toISOString() },
            { id: '2', type: 'view', message: 'Studio Flat has 10 new views', date: new Date(Date.now() - 86400000).toISOString() }
          ];
            
          setStats({
            totalProperties: totalProps,
            averageRent: avgPrice,
            viewsCount: data.viewsCount || 0,
            inquiriesCount: data.inquiriesCount || 0,
            propertyTypes: propertyTypeCount,
            recentActivity: mockRecentActivity
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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">Unauthorized</h1>
        <p className="mt-2">Please log in to access your dashboard.</p>
      </div>
    );
  }

  // Stat Card Component
  const StatCard = ({ 
    title, 
    value, 
    icon,
    color = 'blue'
  }: { 
    title: string; 
    value: string | number;
    icon: React.ReactNode;
    color?: 'blue' | 'green' | 'purple' | 'orange';
  }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-500',
      green: 'bg-green-50 text-green-500',
      purple: 'bg-purple-50 text-purple-500',
      orange: 'bg-orange-50 text-orange-500'
    };
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-sm font-medium text-gray-600">{title}</h2>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{t('landlordDashboard')}</h1>
          <p className="text-gray-600 mt-2">{t('welcomeMessage', { name: user.name || user.email })}</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="flex border-b mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'properties'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'inquiries'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            Inquiries
          </button>
        </div>

        {isDataLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title={t('totalProperties')}
                    value={stats.totalProperties}
                    icon={<FiHome className="w-5 h-5" />}
                    color="blue"
                  />
                  <StatCard
                    title={t('averageRent')}
                    value={`£${stats.averageRent.toFixed(0)}`}
                    icon={<FiDollarSign className="w-5 h-5" />}
                    color="green"
                  />
                  <StatCard
                    title={t('viewsCount')}
                    value={stats.viewsCount}
                    icon={<FiEye className="w-5 h-5" />}
                    color="purple"
                  />
                  <StatCard
                    title={t('inquiriesCount')}
                    value={stats.inquiriesCount}
                    icon={<FiMessageSquare className="w-5 h-5" />}
                    color="orange"
                  />
                </div>

                {/* Property Types & Recent Activity Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Property Types */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Property Types</h3>
                    <div className="space-y-4">
                      {Object.entries(stats.propertyTypes || {}).map(([name, value], index) => {
                        // Calculate width as percentage of total
                        const total = Object.values(stats.propertyTypes || {}).reduce((a, b) => a + b, 0);
                        const widthPercent = (value / total) * 100;
                        
                        // Define colors
                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];
                        
                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-sm">{name}</span>
                              <span className="text-sm font-semibold">{value} ({widthPercent.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${colors[index % colors.length]}`}
                                style={{ width: `${widthPercent}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {stats.recentActivity?.map((activity) => (
                        <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <p className="font-medium">{activity.message}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.date).toLocaleDateString()} · {activity.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link 
                      href="/dashboard/add-property"
                      className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 p-4 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Property
                    </Link>
                    <Link 
                      href="/profile"
                      className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 p-4 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Edit Profile
                    </Link>
                    <Link 
                      href="/messages"
                      className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Messages
                    </Link>
                  </div>
                </div>
              </>
            )}

            {/* Properties Tab Content */}
            {activeTab === 'properties' && (
              <section className="mb-12">
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
                      <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <PropertyCard
                          id={property.id}
                          title={property.title}
                          price={property.price}
                          address={property.addressString || ''}
                          tubeStation={property.tubeStation || undefined}
                          bedrooms={property.bedrooms}
                          bathrooms={property.bathrooms}
                          media={property.media}
                          amenities={property.amenities}
                          availableFrom={new Date(property.available)}
                          propertyType={property.propertyType}
                          isLandlordView={true}
                          property={property}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Inquiries Tab Content */}
            {activeTab === 'inquiries' && (
              <section className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">{t('myInquiries')}</h2>
                </div>
                <InquiryList role="landlord" className="mb-8" />
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
} 