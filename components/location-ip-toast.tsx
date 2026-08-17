'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/lib/location-context';
import { MapPin, X, Navigation, Loader2 } from 'lucide-react';

export function LocationIpToast() {
  const { city, setLocation } = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    // If user already picked a city, do not prompt
    if (city) return;

    // Check if dismissed previously in session
    const hasDismissed = sessionStorage.getItem('dismissed_location_prompt');
    if (hasDismissed) return;

    // Wait a brief moment before showing the prompt so it feels intentional
    const timer = setTimeout(() => setShowPrompt(true), 2500);
    return () => clearTimeout(timer);
  }, [city]);

  if (!showPrompt || city) return null;

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('dismissed_location_prompt', 'true');
  };

  const handleDetectLocation = () => {
    setGeoError(null);
    setDetecting(true);

    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      setDetecting(false);
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
            setShowPrompt(false);
          }
        } catch (err) {
          setLocation({ city: 'Current Location', lat, lng });
          setShowPrompt(false);
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        setDetecting(false);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission denied.');
        } else {
          setGeoError('Unable to detect location.');
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
      <div className="bg-estate-card border border-brass/40 text-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="w-12 h-12 rounded-2xl bg-brass/10 border border-brass/20 flex items-center justify-center mb-4 text-brass">
          <MapPin className="w-6 h-6" />
        </div>
        
        <h3 className="font-serif font-bold text-xl mb-2">Explore Nearby Spaces</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Allow location access to instantly discover verified 360° virtual tours of luxury properties in your current city.
        </p>

        {geoError && (
          <p className="text-red-400 text-xs mb-4">{geoError}</p>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleDetectLocation}
            disabled={detecting}
            className="w-full py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold transition flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {detecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{detecting ? 'Detecting...' : 'Detect My Location'}</span>
          </button>
          
          <button
            onClick={handleDismiss}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            Browse All Cities
          </button>
        </div>
      </div>
    </div>
  );
}
