'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/lib/location-context';
import { MapPin, Navigation, Search, X, Clock, Check } from 'lucide-react';

export function LocationSheet() {
  const {
    city,
    locality,
    radiusKm,
    recentLocations,
    setLocation,
    setRadius,
    isLocationSheetOpen,
    closeLocationSheet,
  } = useLocation();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ display_name: string; name: string; lat: string; lon: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Debounced OpenStreetMap Nominatim search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query + ', India'
          )}&limit=5&addressdetails=1`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.warn('Nominatim location search error:', err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isLocationSheetOpen) return null;

  const handleSelectCity = (cityName: string, latStr?: string, lonStr?: string) => {
    const lat = latStr ? parseFloat(latStr) : undefined;
    const lng = lonStr ? parseFloat(lonStr) : undefined;
    setLocation({ city: cityName, lat, lng });
    closeLocationSheet();
  };

  const handleUseCurrentLocation = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          if (res.ok) {
            const data = await res.json();
            const detectedCity =
              data.address?.city ||
              data.address?.town ||
              data.address?.suburb ||
              data.address?.state_district ||
              'Your Location';

            setLocation({
              city: detectedCity,
              locality: data.address?.suburb || data.address?.neighbourhood,
              lat,
              lng,
            });
            closeLocationSheet();
          }
        } catch (err) {
          setLocation({ city: 'Current Location', lat, lng });
          closeLocationSheet();
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission denied. Please search your city manually.');
        } else {
          setGeoError('Unable to detect location. Please try searching.');
        }
      }
    );
  };

  const popularCities = [
    { name: 'All India', lat: null, lng: null },
    { name: 'Mangalore', lat: 12.9141, lng: 74.8560 },
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { name: 'Goa', lat: 15.2993, lng: 74.1240 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Delhi NCR', lat: 28.6139, lng: 77.2090 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-ink-900 border border-line text-text-hi max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={closeLocationSheet}
          className="absolute top-4 right-4 text-text-lo hover:text-text-hi p-2 rounded-xl hover:bg-ink-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase tracking-wider text-brass font-semibold">Search Location</span>
          <h2 className="text-2xl font-serif font-bold text-text-hi mt-1">Select Your Preferred City</h2>
          <p className="text-text-lo text-xs mt-1">
            Properties, 360° virtual tours, and local distance calculations will update automatically.
          </p>
        </div>

        {/* Browser Geolocation Button */}
        <button
          onClick={handleUseCurrentLocation}
          className="w-full py-3 px-4 mb-4 rounded-2xl bg-brass-soft border border-brass/30 text-brass hover:bg-brass hover:text-ink-950 font-bold text-xs flex items-center justify-center space-x-2 transition duration-200"
        >
          <Navigation className="w-4 h-4 fill-current" />
          <span>Use My Current Location</span>
        </button>

        {geoError && (
          <p className="text-amber-400 text-xs mb-4 text-center">{geoError}</p>
        )}

        {/* Nominatim Search Input */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-text-lo absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, locality, or landmark in India..."
            className="w-full bg-ink-950 border border-line rounded-2xl pl-11 pr-4 py-3 text-sm text-text-hi focus:outline-none focus:ring-2 focus:ring-brass"
          />
          {searching && (
            <span className="text-xs text-brass absolute right-4 top-3.5 animate-pulse">Searching...</span>
          )}
        </div>

        {/* Live Search Results */}
        {results.length > 0 && (
          <div className="mb-6 border border-line bg-ink-950 rounded-2xl p-2 space-y-1 max-h-48 overflow-y-auto">
            {results.map((r, idx) => {
              const mainName = r.display_name.split(',')[0];
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectCity(mainName, r.lat, r.lon)}
                  className="p-2.5 rounded-xl hover:bg-ink-800 cursor-pointer flex items-center space-x-3 transition"
                >
                  <MapPin className="w-4 h-4 text-brass shrink-0" />
                  <span className="text-xs text-text-hi truncate">{r.display_name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Radius Selector */}
        <div className="mb-6 border-t border-line pt-4">
          <label className="block text-xs font-bold text-text-lo uppercase tracking-wider mb-2">
            Search Radius Distance
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[2, 5, 10, 25, 50].map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  radiusKm === r
                    ? 'bg-brass text-ink-950 border-brass shadow-md'
                    : 'bg-ink-950 text-text-lo border-line hover:border-text-lo'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Popular & Recent Cities */}
        <div>
          <h4 className="text-xs font-bold text-text-lo uppercase tracking-wider mb-2">Popular Cities</h4>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((pop) => (
              <button
                key={pop.name}
                onClick={() => handleSelectCity(pop.name, pop.lat?.toString(), pop.lng?.toString())}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  city?.toLowerCase() === pop.name.toLowerCase()
                    ? 'bg-brass text-ink-950 border-brass'
                    : 'bg-ink-950 text-text-hi border-line hover:border-brass'
                }`}
              >
                {pop.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
