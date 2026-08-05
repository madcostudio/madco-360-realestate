'use client';

import { useState, useEffect } from 'react';
import { useLocation } from '@/lib/location-context';
import { MapPin, X, Check } from 'lucide-react';

export function LocationIpToast() {
  const { city, setLocation } = useLocation();
  const [suggestedCity, setSuggestedCity] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // If user already picked a city or dismissed, do not prompt
    if (city || dismissed) return;

    // Check if dismissed previously in session
    const hasDismissed = sessionStorage.getItem('dismissed_location_prompt');
    if (hasDismissed) return;

    // Fast timezone/locale heuristic for Indian metros fallback
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('Asia/Colombo')) {
        // Suggest Mumbai / Bengaluru / Mangalore
        setSuggestedCity('Mumbai');
      }
    } catch {
      // Ignore heuristic failures
    }
  }, [city, dismissed]);

  if (!suggestedCity || city || dismissed) return null;

  const handleAccept = () => {
    setLocation({ city: suggestedCity });
    setDismissed(true);
    sessionStorage.setItem('dismissed_location_prompt', 'true');
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('dismissed_location_prompt', 'true');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900/95 backdrop-blur-md border border-brass/40 rounded-2xl p-4 shadow-2xl text-white animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between space-x-3">
        <div className="flex items-center space-x-2 text-brass text-xs font-bold font-mono uppercase tracking-wider">
          <MapPin className="w-4 h-4 text-brass" />
          <span>Location Detection</span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-white transition p-1"
          aria-label="Dismiss location suggestion"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
        Are you browsing 360° verified luxury spaces in <strong className="text-white">{suggestedCity}</strong>?
      </p>

      <div className="flex items-center space-x-2 mt-3.5">
        <button
          onClick={handleAccept}
          className="px-3.5 py-1.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 text-xs font-bold transition flex items-center space-x-1"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Yes, set {suggestedCity}</span>
        </button>
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
        >
          Browse All Cities
        </button>
      </div>
    </div>
  );
}
