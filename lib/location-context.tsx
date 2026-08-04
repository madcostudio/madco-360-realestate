'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationState {
  city: string | null;
  locality?: string | null;
  lat: number | null;
  lng: number | null;
  radiusKm: number;
  recentLocations: Array<{ city: string; lat?: number; lng?: number }>;
}

interface LocationContextType extends LocationState {
  setLocation: (data: { city: string; locality?: string; lat?: number; lng?: number; radiusKm?: number }) => void;
  setRadius: (radiusKm: number) => void;
  clearLocation: () => void;
  isLocationSheetOpen: boolean;
  openLocationSheet: () => void;
  closeLocationSheet: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LocationState>({
    city: null,
    locality: null,
    lat: null,
    lng: null,
    radiusKm: 10,
    recentLocations: [],
  });

  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedCity = localStorage.getItem('madco_user_city');
      const savedLocality = localStorage.getItem('madco_user_locality');
      const savedLat = localStorage.getItem('madco_user_lat');
      const savedLng = localStorage.getItem('madco_user_lng');
      const savedRadius = localStorage.getItem('madco_user_radius');
      const savedRecent = localStorage.getItem('madco_recent_locations');

      setState({
        city: savedCity || null,
        locality: savedLocality || null,
        lat: savedLat ? parseFloat(savedLat) : null,
        lng: savedLng ? parseFloat(savedLng) : null,
        radiusKm: savedRadius ? parseInt(savedRadius, 10) : 10,
        recentLocations: savedRecent ? JSON.parse(savedRecent) : [],
      });
    } catch (err) {
      console.warn('Failed to load saved location state:', err);
    }
  }, []);

  const setLocation = (data: { city: string; locality?: string; lat?: number; lng?: number; radiusKm?: number }) => {
    setState((prev) => {
      const newRadius = data.radiusKm || prev.radiusKm;
      const newRecent = [
        { city: data.city, lat: data.lat, lng: data.lng },
        ...prev.recentLocations.filter((item) => item.city.toLowerCase() !== data.city.toLowerCase()),
      ].slice(0, 5);

      if (typeof window !== 'undefined') {
        localStorage.setItem('madco_user_city', data.city);
        if (data.locality) localStorage.setItem('madco_user_locality', data.locality);
        if (data.lat) localStorage.setItem('madco_user_lat', data.lat.toString());
        if (data.lng) localStorage.setItem('madco_user_lng', data.lng.toString());
        localStorage.setItem('madco_user_radius', newRadius.toString());
        localStorage.setItem('madco_recent_locations', JSON.stringify(newRecent));

        // Sync with cookies for server components
        document.cookie = `madco_user_city=${encodeURIComponent(data.city)}; path=/; max-age=31536000`;
      }

      return {
        ...prev,
        city: data.city,
        locality: data.locality || null,
        lat: data.lat || null,
        lng: data.lng || null,
        radiusKm: newRadius,
        recentLocations: newRecent,
      };
    });
  };

  const setRadius = (radiusKm: number) => {
    setState((prev) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('madco_user_radius', radiusKm.toString());
      }
      return { ...prev, radiusKm };
    });
  };

  const clearLocation = () => {
    setState((prev) => ({
      ...prev,
      city: null,
      locality: null,
      lat: null,
      lng: null,
    }));
    if (typeof window !== 'undefined') {
      localStorage.removeItem('madco_user_city');
      localStorage.removeItem('madco_user_locality');
      localStorage.removeItem('madco_user_lat');
      localStorage.removeItem('madco_user_lng');
    }
  };

  return (
    <LocationContext.Provider
      value={{
        ...state,
        setLocation,
        setRadius,
        clearLocation,
        isLocationSheetOpen,
        openLocationSheet: () => setIsLocationSheetOpen(true),
        closeLocationSheet: () => setIsLocationSheetOpen(false),
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
