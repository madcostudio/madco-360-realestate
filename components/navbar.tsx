'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Building2, User, LogIn, ShieldCheck, MapPin, Camera } from 'lucide-react';
import { getCurrentAuth, AuthState } from '@/lib/auth';
import { AuthModal } from '@/components/auth/auth-modal';
import { useLocation } from '@/lib/location-context';
import { LocationSheet } from '@/components/location-sheet';
import { IpGeoToast } from '@/components/ip-geo-toast';

export function Navbar() {
  const [auth, setAuth] = useState<AuthState>({ user: null, role: 'buyer', isAuthenticated: true });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { city, locality, openLocationSheet } = useLocation();

  useEffect(() => {
    setAuth(getCurrentAuth());
    const handleRoleChanged = () => setAuth(getCurrentAuth());
    window.addEventListener('auth-role-changed', handleRoleChanged);
    return () => window.removeEventListener('auth-role-changed', handleRoleChanged);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-ink-950/90 backdrop-blur-xl border-b border-line">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Lockup */}
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="font-bold text-2xl text-text-hi tracking-tight font-sans group-hover:text-primary transition">
              Mad.co
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold/15 text-gold border border-gold/30">
              360° SPATIAL
            </span>
          </Link>

          {/* Nav Actions */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            {/* Persistent Header Location Chip */}
            <button
              onClick={openLocationSheet}
              className="px-3.5 py-1.5 rounded-full bg-ink-900 border border-line hover:border-gold/40 text-text-lo hover:text-text-hi text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span className="truncate max-w-[120px] sm:max-w-[160px]">
                {city ? `${locality ? `${locality}, ` : ''}${city}` : 'All Cities'}
              </span>
            </button>

            <Link
              href="/search"
              className="text-xs font-semibold text-text-lo hover:text-gold transition flex items-center space-x-1 hidden md:flex"
            >
              <Compass className="w-4 h-4 text-gold" />
              <span>360° Listings</span>
            </Link>

            {/* Shoot My Property Outline Button */}
            <Link
              href="/owner/submit-property"
              className="btn-outline-gold text-xs hidden sm:flex items-center space-x-1.5 !py-1.5 !px-3 !rounded-lg"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Shoot My Property</span>
            </Link>

            {auth.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 rounded-xl bg-ink-900 border border-brass/40 text-brass text-xs font-bold transition flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}

            <Link
              href="/dashboard"
              className="text-xs font-semibold text-text-lo hover:text-text-hi transition flex items-center space-x-1"
            >
              <User className="w-4 h-4 text-text-lo" />
              <span className="capitalize hidden lg:inline">{auth.user ? auth.user.full_name.split(' ')[0] : 'Guest'}</span>
            </Link>

            <button
              onClick={() => setAuthModalOpen(true)}
              className="btn-primary text-xs shadow-none"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{auth.isAuthenticated ? 'Account' : 'Sign In'}</span>
            </button>
          </nav>
        </div>
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <LocationSheet />
      <IpGeoToast />
    </>
  );
}
