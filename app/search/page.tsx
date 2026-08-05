'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/lib/location-context';
import { searchNearbyProperties } from '@/lib/supabase/queries';
import { PropertyData } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Compass, Search, Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';

export default function SearchPage() {
  const { city, locality, lat, lng, radiusKm, setRadius, openLocationSheet } = useLocation();
  const [bhkFilter, setBhkFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isCancelled = false;
    async function loadProperties() {
      setIsLoading(true);
      const data = await searchNearbyProperties({
        lat,
        lng,
        radiusKm,
        bhk: bhkFilter,
        city,
        query: searchQuery,
      });
      if (!isCancelled) {
        setProperties(data);
        setIsLoading(false);
      }
    }
    loadProperties();
    return () => {
      isCancelled = true;
    };
  }, [lat, lng, radiusKm, bhkFilter, city, searchQuery]);

  return (
    <main className="min-h-screen bg-ink-950 text-text-hi pb-20">
      {/* Search Header Banner */}
      <section className="py-12 bg-ink-900 border-b border-line">
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold font-mono text-gold uppercase tracking-wider">
                Explore Spatial Marketplace
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-hi mt-1">
                Featured 360° Walkthrough Listings
              </h1>
            </div>

            {/* Location Selector Bar */}
            <button
              onClick={openLocationSheet}
              className="px-4 py-2.5 rounded-xl bg-ink-950 border border-line hover:border-gold/50 text-text-hi text-xs font-semibold flex items-center space-x-2 transition self-start md:self-auto"
            >
              <MapPin className="w-4 h-4 text-gold" />
              <span>Location: <strong className="text-gold">{locality ? `${locality}, ` : ''}{city || 'All Cities'}</strong> {lat && lng ? `(${radiusKm}km radius)` : ''}</span>
            </button>
          </div>

          {/* Search Bar & BHK Filter Chips */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-lo" />
              <input
                type="text"
                placeholder="Search by building, locality, or landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-ink-950 border border-line text-xs text-text-hi placeholder:text-text-lo focus:outline-none focus:border-gold transition"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              {['all', '1', '2', '3', '4'].map((bhk) => (
                <button
                  key={bhk}
                  onClick={() => setBhkFilter(bhk)}
                  className={`px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    bhkFilter === bhk
                      ? 'btn-primary'
                      : 'bg-ink-950 text-text-lo border border-line hover:border-gold/40 hover:text-text-hi'
                  }`}
                >
                  {bhk === 'all' ? 'All Configurations' : `${bhk} BHK`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-xs text-text-lo font-mono">Searching live spatial listings...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-ink-900 border border-line rounded-3xl p-8 space-y-3">
            <p className="text-base font-semibold text-text-hi">No matching 360° verified listings found</p>
            <p className="text-xs text-text-lo max-w-md mx-auto">
              Try adjusting your search radius, configuration filters, or select a different city.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
