'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Compass, Building2, User, LogIn, LogOut, ShieldCheck, MapPin, Camera, Sparkles } from 'lucide-react';
import { AuthModal } from '@/components/auth/auth-modal';
import { useLocation } from '@/lib/location-context';
import { LocationSheet } from '@/components/location-sheet';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { EstatesLogo } from '@/components/estates-logo';

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { city, locality, openLocationSheet } = useLocation();
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

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
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setProfile(data as UserProfile);
  }

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    router.refresh();
    router.push('/');
  };

  return (
    <>
      {/* ── Cinematic Dark Glassmorphic Navbar ── */}
      <header className="sticky top-0 z-50 w-full bg-[#060608]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand Logo for estates.madco.in */}
          <Link href="/" className="flex items-center group transition-transform duration-200 hover:scale-[1.02] shrink-0">
            <EstatesLogo />
          </Link>

          {/* Nav Actions */}
          <nav className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            {/* Location Selector Pill */}
            <button
              onClick={openLocationSheet}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 hover:text-white text-[11px] sm:text-xs font-semibold flex items-center space-x-1 sm:space-x-1.5 transition-all shadow-sm active:scale-95 group min-h-[36px]"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate max-w-[85px] sm:max-w-[160px]">
                {city ? `${locality ? `${locality}, ` : ''}${city}` : 'All Cities'}
              </span>
            </button>

            {/* 360 Listings Nav Link (desktop) */}
            <Link
              href="/search"
              className="text-xs font-semibold text-slate-300 hover:text-white transition flex items-center space-x-1.5 px-3 py-1.5 rounded-full hover:bg-white/[0.06] hidden md:flex"
            >
              <Compass className="w-4 h-4 text-sky-400 animate-spin-slow" />
              <span>360° Listings</span>
            </Link>

            {/* Shoot My Property CTA (tablet/desktop) */}
            <Link
              href="/owner/submit-property"
              className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 hover:text-amber-200 text-xs font-bold transition shadow-sm"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span>Shoot My Property</span>
            </Link>

            {/* Admin Panel Link */}
            {(profile?.role === 'admin' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project')) && (
              <Link
                href="/admin/dashboard"
                className="px-2.5 sm:px-3 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 hover:text-sky-200 text-[11px] sm:text-xs font-bold transition flex items-center space-x-1 shadow-sm min-h-[36px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            )}

            {/* Auth / Account Controls */}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-xs font-semibold text-slate-200 hover:text-white transition flex items-center space-x-1 px-2.5 py-1.5 rounded-full hover:bg-white/[0.06] min-h-[36px]"
                >
                  <User className="w-4 h-4 text-sky-400" />
                  <span className="capitalize hidden sm:inline">
                    {profile?.full_name?.split(' ')[0] || 'Account'}
                  </span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="btn-hero text-xs !py-1.5 !px-2.5 sm:!px-3 min-h-[36px]"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn-hero-accent text-[11px] sm:text-xs !py-1.5 !px-3 sm:!px-4 flex items-center space-x-1.5 shadow-glow-cyan min-h-[36px]"
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
