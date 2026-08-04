'use client';

import { useState } from 'react';
import { useLocation } from '@/lib/location-context';
import { useRouter } from 'next/navigation';
import { MapPin, Search } from 'lucide-react';

export function HeroSearchForm() {
  const { city, openLocationSheet } = useLocation();
  const [type, setType] = useState<'buy' | 'rent'>('buy');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cityParam = city ? encodeURIComponent(city) : '';
    router.push(`/search?city=${cityParam}&type=${type}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-glass backdrop-blur-glass border border-line rounded-2xl p-2.5 flex flex-col sm:flex-row items-center gap-2 shadow-2xl"
    >
      {/* Location Field */}
      <button
        type="button"
        onClick={openLocationSheet}
        className="w-full sm:w-auto flex-1 bg-ink-900 border border-line hover:border-brass/40 px-4 py-2.5 rounded-xl text-left text-xs flex items-center space-x-2 transition"
      >
        <MapPin className="w-4 h-4 text-brass shrink-0" />
        <div className="truncate">
          <span className="text-[10px] text-text-lo block font-mono">Location</span>
          <span className="font-bold text-text-hi truncate">
            {city ? `📍 ${city}` : '📍 Set location'}
          </span>
        </div>
      </button>

      {/* Buy / Rent Segmented Toggle */}
      <div className="flex bg-ink-950 p-1 rounded-xl border border-line w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setType('buy')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            type === 'buy' ? 'bg-brass text-ink-950' : 'text-text-lo hover:text-text-hi'
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setType('rent')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
            type === 'rent' ? 'bg-brass text-ink-950' : 'text-text-lo hover:text-text-hi'
          }`}
        >
          Rent
        </button>
      </div>

      {/* Search Submit Button */}
      <button type="submit" className="w-full sm:w-auto btn-primary text-xs shadow-none">
        <Search className="w-4 h-4" />
        <span>Search Homes</span>
      </button>
    </form>
  );
}
