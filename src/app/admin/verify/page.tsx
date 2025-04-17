'use client';

import React, { useState, useEffect } from 'react';

// TODO: Define a type for Property including owner info, matching API response
interface UnverifiedProperty { 
    id: string;
    title: string;
    addressString: string;
    owner: { name: string | null, email: string };
    createdAt: string;
}

export default function VerifyPropertiesPage() {
  const [properties, setProperties] = useState<UnverifiedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch unverified properties
  useEffect(() => {
    const fetchUnverified = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Create this API endpoint - should be admin-protected
        const res = await fetch('/api/admin/properties/unverified'); 
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch properties');
        }
        const data = await res.json();
        setProperties(data.properties);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUnverified();
  }, []);

  const handleVerify = async (id: string) => {
    // Optimistic UI update or disable button
    setProperties(prev => prev.filter(p => p.id !== id)); 

    try {
      // TODO: Create this API endpoint - should be admin-protected
      const res = await fetch(`/api/admin/properties/verify/${id}`, {
        method: 'PATCH', // Or PUT/POST
      });
      if (!res.ok) {
         const data = await res.json();
         throw new Error(data.error || 'Verification failed');
         // TODO: Revert optimistic update on error
         // Need to refetch or add property back to list
      }
      // Success - property removed from list via state update
      console.log(`Property ${id} verified.`);
    } catch (err: any) {
      console.error("Verification failed:", err);
      setError(`Failed to verify property ${id}: ${err.message}`);
      // TODO: Revert optimistic update
    }
  };

  if (loading) return <div>Loading properties for verification...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Verify Property Listings</h2>
      {properties.length === 0 ? (
        <p>No properties currently awaiting verification.</p>
      ) : (
        <ul className="space-y-4">
          {properties.map(prop => (
            <li key={prop.id} className="p-4 border rounded shadow-sm bg-white flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{prop.title}</h3>
                <p className="text-sm text-gray-600">{prop.addressString}</p>
                <p className="text-sm text-gray-500">Owner: {prop.owner.name} ({prop.owner.email})</p>
                <p className="text-sm text-gray-500">Submitted: {new Date(prop.createdAt).toLocaleDateString()}</p>
                 {/* TODO: Add link to view property details */} 
              </div>
              <button 
                onClick={() => handleVerify(prop.id)}
                className="ml-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Verify
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 