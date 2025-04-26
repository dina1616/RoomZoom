import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface FavoriteButtonProps {
  propertyId: string;
  initialIsFavorite?: boolean;
}

export default function FavoriteButton({ propertyId, initialIsFavorite = false }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState<boolean>(initialIsFavorite);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsFav(initialIsFavorite);
  }, [initialIsFavorite]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      // Optionally redirect to login or show message
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      const method = isFav ? 'DELETE' : 'POST';
      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });
      if (!res.ok) throw new Error('Failed to update favorite');
      setIsFav(!isFav);
    } catch (err) {
      console.error('Favorite toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full shadow ${isFav ? 'text-red-500' : 'text-gray-400'}`}
      aria-label={isFav ? 'Remove favorite' : 'Add to favorites'}
    >
      {isFav ? '❤️' : '🤍'}
    </button>
  );
} 