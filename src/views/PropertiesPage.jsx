'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Grid, 
  Map, 
  Sparkles, 
  MapPin, 
  Building2 
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilter from '../components/PropertyFilter';
import { formatINR } from '../utils/formatters';

export default function PropertiesPage({ 
  properties = [], 
  areaUnit, 
  onViewDetails, 
  onLaunch360 
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [filters, setFilters] = useState({
    listingType: 'sale',
    locality: 'All Localities',
    type: 'all',
    maxPrice: 30000000,
    bedrooms: 0,
    verified360Only: false
  });

  const resetFilters = () => {
    setFilters({
      listingType: 'sale',
      locality: 'All Localities',
      type: 'all',
      maxPrice: 30000000,
      bedrooms: 0,
      verified360Only: false
    });
    setSearchQuery('');
  };

  // Filter Logic
  const filteredProperties = properties.filter(prop => {
    // 1. Purpose (Sale/Rent)
    if (prop.listingType !== filters.listingType) return false;

    // 2. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = prop.title.toLowerCase().includes(q);
      const matchLocality = prop.locality.toLowerCase().includes(q);
      const matchAddress = prop.address.toLowerCase().includes(q);
      if (!matchTitle && !matchLocality && !matchAddress) return false;
    }

    // 3. Locality Filter
    if (filters.locality !== 'All Localities' && prop.locality !== filters.locality) return false;

    // 4. Property Type
    if (filters.type !== 'all' && prop.type !== filters.type) return false;

    // 5. Max Price
    if (prop.price > filters.maxPrice) return false;

    // 6. Bedrooms
    if (filters.bedrooms > 0 && prop.bedrooms !== filters.bedrooms && prop.bedrooms < filters.bedrooms) return false;

    // 7. Verified 360 Only
    if (filters.verified360Only && !prop.verified360) return false;

    return true;
  });

  // Sort Logic
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0; // default newest
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

      {/* HEADER & SEARCH BAR */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Explore 360° Real Estate in Mangalore
            </h1>
            <p className="text-slate-400 text-xs mt-0.5">
              Walk through every bedroom, balcony & kitchen in 360° VR before visiting physically.
            </p>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Bejai, Kadri, Surathkal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs font-semibold pl-10 pr-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* CONTROLS BAR: VIEW MODE & SORT */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 flex-wrap gap-3">
          <div className="text-xs text-slate-400 font-bold">
            Showing <strong className="text-amber-400">{sortedProperties.length}</strong> 360° Verified Listings
          </div>

          <div className="flex items-center gap-3">
            {/* SORT DROPDOWN */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-950 text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-800 focus:outline-none"
            >
              <option value="newest">Sort by: Newest 360 Shoots</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>

            {/* VIEW MODE TOGGLE */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'map' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                title="Interactive Map View"
              >
                <Map className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID (FILTER SIDEBAR + LISTINGS) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* SIDEBAR FILTERS */}
        <div className="lg:col-span-1">
          <PropertyFilter
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
          />
        </div>

        {/* LISTINGS CONTAINER */}
        <div className="lg:col-span-3">

          {viewMode === 'map' ? (
            /* MAP VIEW PLACEHOLDER WITH PINS */
            <div className="relative w-full h-[600px] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden p-6 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 max-w-sm">
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" /> Interactive Mangalore Map View
                </h4>
                <p className="text-slate-400 text-xs mt-1">Click pins to trigger instant 360° VR preview.</p>
              </div>

              {/* MAP PINS FOR MANGALORE LOCALITIES */}
              <div className="relative w-full h-full flex items-center justify-center">
                {sortedProperties.map((p, idx) => (
                  <div
                    key={p.id}
                    style={{
                      left: `${20 + (idx * 16)}%`,
                      top: `${25 + ((idx % 3) * 20)}%`
                    }}
                    onClick={() => onViewDetails(p.id)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/pin"
                  >
                    <div className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-xl border border-amber-300 flex items-center gap-1 transition transform hover:scale-110">
                      <Sparkles className="w-3 h-3" />
                      <span>{formatINR(p.price, p.listingType)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* GRID VIEW */
            sortedProperties.length === 0 ? (
              <div className="bg-slate-900/90 rounded-3xl p-12 border border-slate-800 text-center space-y-4">
                <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="text-white font-bold text-lg">No 360° properties match your selected criteria</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto">
                  Try adjusting your budget slider, selecting a different Mangalore locality, or resetting filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedProperties.map(prop => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    areaUnit={areaUnit}
                    onViewDetails={onViewDetails}
                    onLaunch360={onLaunch360}
                  />
                ))}
              </div>
            )
          )}

        </div>

      </div>

    </div>
  );
}
