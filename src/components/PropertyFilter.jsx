import React from 'react';
import { Search, Filter, Sparkles, RefreshCw, Check } from 'lucide-react';
import { MANGALORE_LOCALITIES } from '../data/propertiesData';
import { formatINR } from '../utils/formatters';

export default function PropertyFilter({ filters, setFilters, onReset }) {
  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">

      {/* HEADER & RESET */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-amber-400" />
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Search Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 font-semibold transition"
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* 1. PURPOSE TAB (BUY VS RENT) */}
      <div>
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Purpose</label>
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setFilters(prev => ({ ...prev, listingType: 'sale' }))}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              filters.listingType === 'sale'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Buy (For Sale)
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, listingType: 'rent' }))}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              filters.listingType === 'rent'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rent (Tenants)
          </button>
        </div>
      </div>

      {/* 2. LOCALITY SELECTOR */}
      <div>
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Mangalore Locality</label>
        <select
          value={filters.locality}
          onChange={(e) => setFilters(prev => ({ ...prev, locality: e.target.value }))}
          className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
        >
          {MANGALORE_LOCALITIES.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* 3. PROPERTY TYPE */}
      <div>
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Property Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'flat', label: 'Flats & Apartments' },
            { id: 'villa', label: 'Independent Villa' },
            { id: 'plot', label: 'Residential Plot' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilters(prev => ({ ...prev, type: t.id }))}
              className={`p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                filters.type === t.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. BUDGET SLIDER */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Max Budget</label>
          <span className="text-xs font-extrabold text-amber-400">
            {formatINR(filters.maxPrice, filters.listingType)}
          </span>
        </div>
        <input
          type="range"
          min={filters.listingType === 'rent' ? 10000 : 2000000}
          max={filters.listingType === 'rent' ? 100000 : 30000000}
          step={filters.listingType === 'rent' ? 2000 : 1000000}
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full accent-amber-400 bg-slate-950 rounded-lg cursor-pointer"
        />
      </div>

      {/* 5. BEDROOMS */}
      <div>
        <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-2">Bedrooms (BHK)</label>
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => setFilters(prev => ({ ...prev, bedrooms: num }))}
              className={`flex-1 py-2 rounded-xl text-xs font-extrabold border transition ${
                filters.bedrooms === num
                  ? 'bg-indigo-600 border-indigo-400 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {num === 0 ? 'Any' : `${num}${num === 4 ? '+' : ''}`}
            </button>
          ))}
        </div>
      </div>

      {/* 6. VERIFIED 360 TOUR TOGGLE */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-slate-200 font-bold">Verified 360° Walkthrough Only</span>
        </div>
        <button
          onClick={() => setFilters(prev => ({ ...prev, verified360Only: !prev.verified360Only }))}
          className={`w-11 h-6 rounded-full transition-colors p-1 ${
            filters.verified360Only ? 'bg-amber-400' : 'bg-slate-800'
          }`}
        >
          <div className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
            filters.verified360Only ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
      </div>

    </div>
  );
}
