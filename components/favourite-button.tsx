'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface FavouriteButtonProps {
  propertyId: string;
  onRequireAuth?: () => void;
}

export function FavouriteButton({ propertyId, onRequireAuth }: FavouriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        supabase
          .from('favourites')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', propertyId)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setIsFav(true);
          });
      }
    });
  }, [propertyId]);

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      onRequireAuth?.();
      return;
    }

    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    if (isFav) {
      setIsFav(false);
      await supabase
        .from('favourites')
        .delete()
        .eq('user_id', userId)
        .eq('property_id', propertyId);
    } else {
      setIsFav(true);
      await supabase
        .from('favourites')
        .insert({ user_id: userId, property_id: propertyId });
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
