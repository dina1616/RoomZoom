'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaEye, FaMapMarkerAlt, FaUserAlt, FaCalendarAlt, FaBuilding } from 'react-icons/fa';

// TODO: Define a type for Property including owner info, matching API response
interface UnverifiedProperty { 
    id: string;
    title: string;
    addressString: string;
    owner: { name: string | null, email: string };
    createdAt: string;
    images?: string[];
    type?: string;
    rent?: number;
}

export default function VerifyPropertiesPage() {
  const [properties, setProperties] = useState<UnverifiedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<{[key: string]: boolean}>({});
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for demo purposes
  const mockProperties: UnverifiedProperty[] = [
    {
      id: '1',
      title: 'Modern Studio Apartment',
      addressString: '123 University Ave, College Town',
      owner: { name: 'Jane Smith', email: 'jane@example.com' },
      createdAt: '2023-10-12T10:30:00Z',
      images: ['/images/property1.jpg'],
      type: 'Studio',
      rent: 850
    },
    {
      id: '2',
      title: 'Spacious 2-Bedroom near Campus',
      addressString: '456 College Blvd, Student Village',
      owner: { name: 'John Doe', email: 'john@example.com' },
      createdAt: '2023-10-14T14:15:00Z',
      images: ['/images/property2.jpg'],
      type: '2-Bedroom',
      rent: 1200
    },
    {
      id: '3',
      title: 'Luxury Loft with City View',
      addressString: '789 Downtown St, Metro Center',
      owner: { name: 'Alex Johnson', email: 'alex@example.com' },
      createdAt: '2023-10-15T09:45:00Z',
      images: ['/images/property3.jpg'],
      type: 'Loft',
      rent: 1500
    },
  ];

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Fetch unverified properties
  useEffect(() => {
    const fetchUnverified = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Create this API endpoint - should be admin-protected
        // Mock implementation for demo purposes
        setTimeout(() => {
          setProperties(mockProperties);
          setLoading(false);
        }, 1000);
        
        // Uncomment for actual implementation
        // const res = await fetch('/api/admin/properties/unverified'); 
        // if (!res.ok) {
        //   const data = await res.json();
        //   throw new Error(data.error || 'Failed to fetch properties');
        // }
        // const data = await res.json();
        // setProperties(data.properties);
        // setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUnverified();
  }, []);

  const handleVerify = async (id: string) => {
    setActionInProgress(prev => ({ ...prev, [id]: true }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Create this API endpoint - should be admin-protected
      // const res = await fetch(`/api/admin/properties/verify/${id}`, {
      //   method: 'PATCH', // Or PUT/POST
      // });
      // if (!res.ok) {
      //    const data = await res.json();
      //    throw new Error(data.error || 'Verification failed');
      // }
      
      // Success - property removed from list via state update
      setProperties(prev => prev.filter(p => p.id !== id));
      console.log(`Property ${id} verified.`);
    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(`Failed to verify property ${id}: ${err.message}`);
    } finally {
      setActionInProgress(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: string) => {
    setActionInProgress(prev => ({ ...prev, [id]: true }));
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // TODO: Implement reject API endpoint
      
      // Success - property removed from list via state update
      setProperties(prev => prev.filter(p => p.id !== id));
      console.log(`Property ${id} rejected.`);
    } catch (err: any) {
      console.error("Rejection failed:", err);
      setError(`Failed to reject property ${id}: ${err.message}`);
    } finally {
      setActionInProgress(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
      >
        <FaTimesCircle className="mr-2" />
        <span>Error: {error}</span>
      </motion.div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FaCheckCircle className="mr-2 text-blue-500" /> 
          <span>Verify Property Listings</span>
        </h2>
        <div className="text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
          {properties.length} properties awaiting verification
        </div>
      </motion.div>

      {properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg text-center"
        >
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-2" />
          <p className="text-lg font-medium">All caught up!</p>
          <p className="text-sm">No properties currently awaiting verification.</p>
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-2"
          >
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterStatus === 'all' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setFilterStatus('recent')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterStatus === 'recent' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recently Added
            </button>
          </motion.div>

          <motion.ul
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {properties.map(prop => (
              <motion.li
                key={prop.id}
                variants={itemVariants}
                className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 ${
                  selectedProperty === prop.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedProperty(selectedProperty === prop.id ? null : prop.id)}
              >
                <div className="md:flex">
                  <div className="md:flex-shrink-0 bg-gray-100 md:w-48 h-40 flex items-center justify-center">
                    {prop.images && prop.images[0] ? (
                      <div className="w-full h-full bg-gray-200 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <FaBuilding size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-gray-400">
                        <FaBuilding size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex flex-wrap items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{prop.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 flex items-center">
                          <FaMapMarkerAlt className="text-gray-400 mr-1" /> 
                          {prop.addressString}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500 gap-x-4">
                          <span className="flex items-center">
                            <FaUserAlt className="mr-1" />
                            {prop.owner.name} ({prop.owner.email})
                          </span>
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" />
                            {new Date(prop.createdAt).toLocaleDateString()}
                          </span>
                          {prop.type && (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {prop.type}
                            </span>
                          )}
                          {prop.rent && (
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">
                              ${prop.rent}/month
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-2 md:mt-0">
                        <button 
                          className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                        >
                          <FaEye className="mr-1" /> View
                        </button>
                        <button 
                          className={`flex items-center px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm ${
                            actionInProgress[prop.id] ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!actionInProgress[prop.id]) handleVerify(prop.id);
                          }}
                          disabled={actionInProgress[prop.id]}
                        >
                          {actionInProgress[prop.id] ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          ) : (
                            <FaCheckCircle className="mr-1" />
                          )}
                          Verify
                        </button>
                        <button 
                          className={`flex items-center px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm ${
                            actionInProgress[prop.id] ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!actionInProgress[prop.id]) handleReject(prop.id);
                          }}
                          disabled={actionInProgress[prop.id]}
                        >
                          <FaTimesCircle className="mr-1" /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </>
      )}
    </div>
  );
} 