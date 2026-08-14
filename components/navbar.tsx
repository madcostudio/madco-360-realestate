'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Building2, User, LogIn, LogOut, ShieldCheck, MapPin, Camera } from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { useLocation } from '@/lib/location-context';
import { LocationSheet } from '@/components/location-sheet';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { city, locality, openLocationSheet } = useLocation();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user ?? null);
      if (user) loadProfile(user.id);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        loadProfile(u.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as UserProfile);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.refresh();
    router.push('/');
  };

  const [announcementText, setAnnouncementText] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('site_content')
      .select('value')
      .eq('key', 'announcement_banner')
      .single()
      .then(({ data }) => {
        if (data?.value?.enabled && data?.value?.text) {
          setAnnouncementText(data.value.text);
        }
      });
  }, []);

  return (
    <>
      {announcementText && (
        <div className="bg-gradient-to-r from-brass/20 via-primary/20 to-gold/20 border-b border-brass/30 text-white text-xs font-semibold py-2 px-4 text-center backdrop-blur-md flex items-center justify-center space-x-2">
          <span>{announcementText}</span>
        </div>
      )}
      <header className="sticky top-0 z-40 w-full bg-ink-950/90 backdrop-blur-xl border-b border-line">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Lockup */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image 
              src="/madco-logo.png" 
              alt="Mad.co Estates 360 Spatial" 
              width={200} 
              height={60} 
              className="w-auto h-8 sm:h-10 object-contain drop-shadow-md transition-transform group-hover:scale-105"
              priority 
            />
          </Link>

          {/* Nav Actions */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            {/* Location Chip */}
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

            <Link
              href="/owner/submit-property"
              className="btn-outline-gold text-xs hidden sm:flex items-center space-x-1.5 !py-1.5 !px-3 !rounded-lg"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Shoot My Property</span>
            </Link>

            {profile?.role === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="px-3 py-1.5 rounded-xl bg-ink-900 border border-brass/40 text-brass text-xs font-bold transition flex items-center space-x-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-text-lo hover:text-text-hi transition flex items-center space-x-1"
                >
                  <User className="w-4 h-4 text-text-lo" />
                  <span className="capitalize hidden lg:inline">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-primary text-xs shadow-none"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-primary text-xs shadow-none"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <LocationSheet />
    </>
  );
}
