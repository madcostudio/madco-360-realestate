'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { getCurrentAuth } from '@/lib/auth';

interface FavouriteButtonProps {
  propertyId: string;
  onRequireAuth?: () => void;
}

const userFavouritesSet = new Set<string>(['11111111-1111-1111-1111-111111111111']);

export function FavouriteButton({ propertyId, onRequireAuth }: FavouriteButtonProps) {
  const [isFav, setIsFav] = useState(userFavouritesSet.has(propertyId));

  const toggleFavourite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const auth = getCurrentAuth();
    if (!auth.isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    if (isFav) {
      userFavouritesSet.delete(propertyId);
      setIsFav(false);
    } else {
      userFavouritesSet.add(propertyId);
      setIsFav(true);
    }
  };

  return (
    <button
      onClick={toggleFavourite}
      className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg ${
        isFav
          ? 'bg-rose-500/20 text-rose-500 border-rose-500/50 scale-105'
          : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white hover:border-brass'
      }`}
      title={isFav ? 'Remove from Favourites' : 'Save to Favourites'}
    >
      <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500' : ''}`} />
    </button>
  );
}
