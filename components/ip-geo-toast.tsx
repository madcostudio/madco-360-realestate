'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/lib/location-context';
import { MapPin, X, Compass } from 'lucide-react';

export function IpGeoToast() {
  const { city, setLocation, openLocationSheet } = useLocation();
  const [toastCity, setToastCity] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only check if user hasn't explicitly set a city
    if (city) return;

    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('madco_geo_toast_dismissed');
      if (dismissed) return;

      // Simulated IP geo detection or Vercel header check
      const detectedIpCity = 'Mumbai'; // Default simulated guess for India marketplace demo
      setToastCity(detectedIpCity);
      setVisible(true);
    }
  }, [city]);

  if (!visible || !toastCity || city) return null;

  const handleAccept = () => {
    setLocation({ city: toastCity });
    setVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('madco_geo_toast_dismissed', 'true');
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('madco_geo_toast_dismissed', 'true');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full bg-ink-900 border border-line p-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 text-brass text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-brass" />
          <span>Location Auto-Detect</span>
        </div>
        <button onClick={handleDismiss} className="text-text-lo hover:text-text-hi p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-text-hi mt-2 font-medium">
        Looks like you're in <span className="text-brass font-bold">{toastCity}</span> — show homes nearby?
      </p>

      <div className="mt-3 flex items-center space-x-2">
        <button
          onClick={handleAccept}
          className="flex-1 py-2 px-3 rounded-xl bg-brass hover:bg-brass-hover text-ink-950 font-bold text-xs transition"
        >
          Show Homes in {toastCity}
        </button>
        <button
          onClick={() => {
            handleDismiss();
            openLocationSheet();
          }}
          className="py-2 px-3 rounded-xl bg-ink-800 border border-line hover:border-brass text-text-lo hover:text-text-hi font-semibold text-xs transition"
        >
          Choose City
        </button>
      </div>
    </div>
  );
}
