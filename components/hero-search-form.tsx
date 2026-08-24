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
      className="bg-white/95 backdrop-blur-2xl border border-sky-200/80 hover:border-sky-400/80 rounded-2xl p-2 sm:p-2.5 flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 shadow-luxury-lg transition-all duration-300 max-w-2xl mx-auto w-full"
    >
      {/* Location Field */}
      <button
        type="button"
        onClick={openLocationSheet}
        className="w-full sm:w-auto flex-1 bg-sky-50/80 hover:bg-sky-100/80 border border-sky-200 px-3.5 sm:px-4 py-2.5 rounded-xl text-left text-xs flex items-center space-x-2.5 transition shadow-2xs group min-h-[44px]"
      >
        <MapPin className="w-4 h-4 text-sky-600 shrink-0 group-hover:scale-110 transition-transform" />
        <div className="truncate min-w-0">
          <span className="text-[10px] text-sky-700 block font-mono font-medium leading-none mb-0.5">Target Location</span>
          <span className="font-bold text-slate-900 truncate block text-xs sm:text-sm">
            {city ? `📍 ${city}` : '📍 All India (Set Location)'}
          </span>
        </div>
      </button>

      {/* Buy / Rent Segmented Toggle */}
      <div className="flex bg-sky-100/70 p-1 rounded-xl border border-sky-200/70 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => setType('buy')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition text-center min-h-[38px] flex items-center justify-center ${
            type === 'buy' ? 'bg-white text-sky-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setType('rent')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition text-center min-h-[38px] flex items-center justify-center ${
            type === 'rent' ? 'bg-white text-sky-950 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rent
        </button>
      </div>

      {/* Search Submit Button */}
      <button
        type="submit"
        className="w-full sm:w-auto btn-primary text-xs shadow-md shadow-sky-600/30 !py-3 !px-5 justify-center min-h-[44px]"
      >
        <Search className="w-4 h-4" />
        <span>Search Homes</span>
      </button>
    </form>
  );
}
