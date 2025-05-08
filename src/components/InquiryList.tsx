'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistance } from 'date-fns';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type InquiryStatus = 'PENDING' | 'RESPONDED' | 'CLOSED';

interface InquiryProperty {
  id: string;
  title: string;
  price: number;
  images?: string[];
  owner?: {
    id: string;
    name: string;
    email: string;
    landlordProfile?: {
      companyName: string | null;
      phoneNumber: string;
    };
  };
}

interface InquiryUser {
  id: string;
  name: string;
  email: string;
}

interface Inquiry {
  id: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  phone?: string;
  email: string;
  moveInDate?: string;
  property: InquiryProperty;
  user?: InquiryUser;
}

interface InquiryListProps {
  role: 'student' | 'landlord';
  className?: string;
}

export default function InquiryList({ role, className = '' }: InquiryListProps) {
  const t = useTranslations('Inquiries');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const router = useRouter();

  // Toggle expanded state for inquiry details
  const toggleExpanded = (id: string) => {
    setExpandedInquiry(prev => prev === id ? null : id);
  };

  // Fetch inquiries based on role
  useEffect(() => {
    const fetchInquiries = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/inquiries?role=${role === 'landlord' ? 'landlord' : 'user'}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch inquiries: ${response.status}`);
        }
        
        const data = await response.json();
        setInquiries(data.inquiries);
      } catch (err) {
        console.error('Error fetching inquiries:', err);
        setError(err instanceof Error ? err.message : 'Failed to load inquiries');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiries();
  }, [role]);

  // Update inquiry status
  const updateInquiryStatus = async (id: string, status: InquiryStatus) => {
    setStatusUpdating(id);
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      // Update local state
      setInquiries(prevInquiries => 
        prevInquiries.map(inquiry => 
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );

      toast.success(t('statusUpdateSuccess'));
    } catch (err) {
      console.error('Error updating inquiry status:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setStatusUpdating(null);
    }
  };

  // Delete inquiry with confirmation
  const deleteInquiry = async (id: string) => {
    if (!confirm(t('confirmDelete'))) {
      return;
    }

    setStatusUpdating(id);
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete inquiry: ${response.status}`);
      }

      // Remove from local state with animation
      setInquiries(prevInquiries => 
        prevInquiries.filter(inquiry => inquiry.id !== id)
      );

      toast.success(t('deleteSuccess'));
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to delete inquiry');
    } finally {
      setStatusUpdating(null);
    }
  };

  // Get status badge color
  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'RESPONDED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={`${className} p-6 rounded-lg bg-white shadow-md`}>
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="w-2/3">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
              <div className="flex justify-end gap-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`${className} p-6 rounded-lg bg-white shadow-md`}>
        <div className="text-center py-8">
          <div className="text-red-500 text-4xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button 
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No inquiries
  if (inquiries.length === 0) {
    return (
      <div className={`${className} p-6 rounded-lg bg-white shadow-md text-center`}>
        <div className="py-12">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {role === 'landlord' ? t('noInquiries') : t('noInquiriesSent')}
          </h3>
          {role === 'student' && (
            <p className="text-gray-600 mb-6">{t('startInquiring')}</p>
          )}
          <Link
            href="/properties"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  // Render inquiries
  return (
    <div className={`${className} bg-white shadow-md rounded-lg p-6`}>
      <h3 className="text-xl font-semibold mb-6">
        {role === 'landlord' ? 'Incoming Inquiries' : 'My Inquiries'}
      </h3>
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {inquiries.map(inquiry => (
            <motion.div 
              key={inquiry.id} 
              className={`border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md ${getStatusColor(inquiry.status)}`}
              variants={itemVariants}
              layout
              exit="exit"
            >
              <div 
                className="p-4 cursor-pointer" 
                onClick={() => toggleExpanded(inquiry.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium mb-1">
                      {role === 'landlord' 
                        ? `${t('inquiryFrom')} ${inquiry.user?.name}` 
                        : `${t('inquiryAbout')} ${inquiry.property.title}`}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatDistance(new Date(inquiry.createdAt), new Date(), { addSuffix: true })}
                    </p>
                    <p className="text-gray-600 line-clamp-2">{inquiry.message}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full border ${
                        inquiry.status === 'PENDING' ? 'bg-blue-100 text-blue-800 border-blue-200' : 
                        inquiry.status === 'RESPONDED' ? 'bg-green-100 text-green-800 border-green-200' : 
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}
                    >
                      {inquiry.status === 'PENDING' ? t('pending') : 
                       inquiry.status === 'RESPONDED' ? t('responded') : t('closed')}
                    </span>
                    <button 
                      className="mt-2 text-gray-500 hover:text-gray-700"
                      aria-label={expandedInquiry === inquiry.id ? "Collapse details" : "Expand details"}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform duration-300 ${expandedInquiry === inquiry.id ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Expandable details section */}
              <AnimatePresence>
                {expandedInquiry === inquiry.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t"
                  >
                    <div className="p-4">
                      {/* Full message */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">{t('message')}</h5>
                        <p className="text-gray-600 whitespace-pre-line">{inquiry.message}</p>
                      </div>
                      
                      {/* Contact info for landlords only */}
                      {role === 'landlord' && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">{t('contact')}</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <p className="text-gray-600">{t('email')}: {inquiry.email}</p>
                            {inquiry.phone && <p className="text-gray-600">{t('phone')}: {inquiry.phone}</p>}
                            {inquiry.moveInDate && (
                              <p className="text-gray-600">{t('moveInDate')}: {new Date(inquiry.moveInDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Property link */}
                      <div className="flex mb-4">
                        <div className="w-20 h-14 relative rounded-md overflow-hidden bg-gray-100 mr-3">
                          <Image 
                            src={inquiry.property.images?.[0] || '/images/placeholder.jpg'} 
                            alt={inquiry.property.title}
                            fill
                            sizes="80px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{inquiry.property.title}</p>
                          <p className="text-sm text-gray-600">£{inquiry.property.price}/mo</p>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-wrap justify-end gap-2 mt-4">
                        <Link
                          href={`/property/${inquiry.property.id}`}
                          className="text-sm px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {t('viewProperty')}
                        </Link>
                        
                        {/* Different actions for landlord vs student */}
                        {role === 'landlord' ? (
                          <>
                            {inquiry.status === 'PENDING' && (
                              <button
                                onClick={() => updateInquiryStatus(inquiry.id, 'RESPONDED')}
                                disabled={statusUpdating === inquiry.id}
                                className="text-sm px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {statusUpdating === inquiry.id ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                  </span>
                                ) : t('markAsResponded')}
                              </button>
                            )}
                            {inquiry.status !== 'CLOSED' && (
                              <button
                                onClick={() => updateInquiryStatus(inquiry.id, 'CLOSED')}
                                disabled={statusUpdating === inquiry.id}
                                className="text-sm px-3 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {statusUpdating === inquiry.id ? (
                                  <span className="flex items-center">
                                    <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                  </span>
                                ) : t('markAsClosed')}
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => deleteInquiry(inquiry.id)}
                              disabled={statusUpdating === inquiry.id}
                              className="text-sm px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {statusUpdating === inquiry.id ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Deleting...
                                </span>
                              ) : t('delete')}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 