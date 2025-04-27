'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import StatisticsCard from '@/components/StatisticsCard';
import { PropertyStat } from '@/types/property';
import { formatDate } from '@/lib/utils';

// Interface for the returned data from the API
interface PropertyWithStatsAndInquiries {
  id: string;
  title: string;
  description: string;
  price: number;
  addressString: string;
  borough: string | null;
  latitude: number;
  longitude: number;
  tubeStation: string | null;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  available: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ownerId: string;
  stats: PropertyStat | null;
  inquiries: Array<{
    id: string;
    status: string;
    createdAt: string;
  }>;
}

export default function PropertyStatsPage() {
  const { id } = useParams();
  const t = useTranslations('Dashboard');
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [property, setProperty] = useState<PropertyWithStatsAndInquiries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not a landlord
    if (!authLoading && (!user || user.role !== 'LANDLORD')) {
      router.push('/');
      return;
    }

    const fetchPropertyStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/landlord/properties/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch property statistics');
        }
        
        const data = await response.json();
        
        if (data.property) {
          setProperty(data.property);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load property statistics');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && !authLoading && user) {
      fetchPropertyStats();
    }
  }, [id, user, authLoading, router]);

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40 bg-gray-200 rounded col-span-1"></div>
                  <div className="h-40 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-60 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error || 'Failed to load property statistics'}</span>
          </div>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Calculate percentage of inquiries by status
  const inquiryStats = {
    pending: 0,
    responded: 0,
    closed: 0,
    total: property.inquiries.length
  };

  property.inquiries.forEach(inquiry => {
    if (inquiry.status === 'PENDING') inquiryStats.pending++;
    else if (inquiry.status === 'RESPONDED') inquiryStats.responded++;
    else if (inquiry.status === 'CLOSED') inquiryStats.closed++;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Back to Dashboard
        </Link>
        
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-gray-600">{property.addressString}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                href={`/properties/${property.id}`}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition"
              >
                View Property Listing
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatisticsCard
            title="View Count"
            value={property.stats?.viewCount || 0}
            icon="view"
            color="blue"
          />
          <StatisticsCard
            title="Inquiry Count"
            value={inquiryStats.total}
            icon="inquiry"
            color="green"
          />
          <StatisticsCard
            title="Favorite Count" 
            value={property.stats?.favoriteCount || 0}
            icon="favorite"
            color="red"
          />
          <StatisticsCard
            title="Last Viewed"
            value={property.stats?.lastViewed ? formatDate(property.stats.lastViewed) : 'Never'}
            icon="date"
            color="purple"
          />
        </div>
        
        {inquiryStats.total > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Inquiry Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-700">Pending</h3>
                <p className="text-2xl font-bold mt-1">{inquiryStats.pending}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  {inquiryStats.total > 0 
                    ? `${Math.round((inquiryStats.pending / inquiryStats.total) * 100)}%` 
                    : '0%'} of total
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700">Responded</h3>
                <p className="text-2xl font-bold mt-1">{inquiryStats.responded}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {inquiryStats.total > 0 
                    ? `${Math.round((inquiryStats.responded / inquiryStats.total) * 100)}%` 
                    : '0%'} of total
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-700">Closed</h3>
                <p className="text-2xl font-bold mt-1">{inquiryStats.closed}</p>
                <p className="text-sm text-green-600 mt-1">
                  {inquiryStats.total > 0 
                    ? `${Math.round((inquiryStats.closed / inquiryStats.total) * 100)}%` 
                    : '0%'} of total
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Recent Activity Timeline */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          
          {property.inquiries.length > 0 ? (
            <div className="flow-root">
              <ul className="-mb-8">
                {property.inquiries.slice(0, 5).map((inquiry, i) => (
                  <li key={inquiry.id}>
                    <div className="relative pb-8">
                      {i < property.inquiries.length - 1 && (
                        <span 
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" 
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            inquiry.status === 'PENDING' ? 'bg-yellow-500' : 
                            inquiry.status === 'RESPONDED' ? 'bg-blue-500' : 'bg-green-500'
                          }`}>
                            <span className="text-white text-xs">🔔</span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-800">
                              New inquiry received with status {' '}
                              <span className="font-medium">
                                {inquiry.status === 'PENDING' ? 'Pending' : 
                                 inquiry.status === 'RESPONDED' ? 'Responded' : 'Closed'}
                              </span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            <time dateTime={inquiry.createdAt}>
                              {formatDate(inquiry.createdAt)}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              
              {property.inquiries.length > 5 && (
                <div className="mt-6 text-center">
                  <Link 
                    href="/dashboard/inquiries" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all inquiries →
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No recent activity for this property.</p>
          )}
        </div>
      </div>
    </div>
  );
} 