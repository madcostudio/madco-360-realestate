'use client';

import { useState, useEffect } from 'react';
import { getCurrentAuth, AuthState } from '@/lib/auth';
import { DEMO_PROPERTIES_LIST, DEMO_ENQUIRIES, DEMO_CAPTURE_BOOKINGS, PropertyData } from '@/lib/mock-data';
import Link from 'next/link';
import { User, Heart, MessageSquare, Search, Building2, Compass, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';

export default function UserDashboardPage() {
  const [auth, setAuth] = useState<AuthState>({ user: null, role: 'buyer', isAuthenticated: false });
  const [activeTab, setActiveTab] = useState<'favourites' | 'enquiries' | 'my-listings' | 'capture-bookings'>('favourites');

  useEffect(() => {
    setAuth(getCurrentAuth());

    const handleRoleChanged = () => {
      setAuth(getCurrentAuth());
    };
    window.addEventListener('auth-role-changed', handleRoleChanged);
    return () => window.removeEventListener('auth-role-changed', handleRoleChanged);
  }, []);

  const user = auth.user;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 max-w-7xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-brass/20 border border-brass/40 text-brass font-bold text-2xl flex items-center justify-center shrink-0">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-serif font-bold text-white">{user?.full_name || 'Verified Explorer'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brass/20 text-brass border border-brass/40 font-mono">
                {auth.role}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">{user?.email || 'Logged in user'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-3">
          <Link
            href="/search"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brass text-white text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Search className="w-3.5 h-3.5 text-brass" />
            <span>Search 360° Tours</span>
          </Link>
          <Link
            href="/owner/submit-property"
            className="px-4 py-2.5 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 text-xs font-bold flex items-center space-x-1.5 transition shadow-lg shadow-brass/20"
          >
            <Plus className="w-4 h-4" />
            <span>List New Property</span>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-6 border-b border-estate-border text-sm font-semibold">
        <button
          onClick={() => setActiveTab('favourites')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 ${
            activeTab === 'favourites' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favourites (2)</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 ${
            activeTab === 'enquiries' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Enquiries ({DEMO_ENQUIRIES.length})</span>
        </button>

        {(auth.role === 'owner' || auth.role === 'admin') && (
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`pb-4 flex items-center space-x-2 transition border-b-2 ${
              activeTab === 'my-listings' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Submitted Listings ({DEMO_PROPERTIES_LIST.length})</span>
          </button>
        )}

        {(auth.role === 'owner' || auth.role === 'admin') && (
          <button
            onClick={() => setActiveTab('capture-bookings')}
            className={`pb-4 flex items-center space-x-2 transition border-b-2 ${
              activeTab === 'capture-bookings' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Mad.co 360° Capture Visits ({DEMO_CAPTURE_BOOKINGS.length})</span>
          </button>
        )}
      </div>

      {/* Tab 1: Favourites */}
      {activeTab === 'favourites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_PROPERTIES_LIST.slice(0, 2).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}

      {/* Tab 2: Enquiries */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {DEMO_ENQUIRIES.map((enquiry) => (
            <div key={enquiry.id} className="bg-estate-card border border-estate-border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-brass uppercase font-mono">{enquiry.status}</span>
                  <span className="text-slate-500 text-xs">• {new Date(enquiry.created_at).toLocaleDateString()}</span>
                </div>
                <h4 className="font-serif font-bold text-lg text-white">{enquiry.property_title}</h4>
                <p className="text-slate-300 text-xs">"{enquiry.message}"</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-mono">Contact: {enquiry.visitor_phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: My Listings (Owner) */}
      {activeTab === 'my-listings' && (
        <div className="space-y-4">
          {DEMO_PROPERTIES_LIST.map((prop) => (
            <div key={prop.id} className="bg-estate-card border border-estate-border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    prop.status === 'published' ? 'bg-fern/20 text-fern border border-fern/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {prop.status}
                  </span>
                  <span className="text-xs text-brass font-bold font-mono">₹{(prop.price / 10000000).toFixed(2)} Cr</span>
                </div>
                <h4 className="font-serif font-bold text-lg text-white mt-1">{prop.title}</h4>
                <p className="text-xs text-slate-400">{prop.address}</p>
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={`/admin/tour-builder/${prop.tour_id}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-brass text-white text-xs font-bold transition"
                >
                  Edit 360° Tour
                </Link>
                <Link
                  href={`/property/${prop.slug}`}
                  className="px-4 py-2 rounded-xl bg-brass text-slate-950 font-bold text-xs transition"
                >
                  View Live Page
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Capture Bookings */}
      {activeTab === 'capture-bookings' && (
        <div className="space-y-4">
          {DEMO_CAPTURE_BOOKINGS.map((booking) => (
            <div key={booking.id} className="bg-estate-card border border-estate-border rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-fern/20 text-fern border border-fern/40">
                  {booking.status}
                </span>
                <h4 className="font-serif font-bold text-lg text-white mt-1">{booking.property_title}</h4>
                <p className="text-xs text-slate-400">Scheduled Date: {booking.preferred_date} | Address: {booking.address}</p>
                <p className="text-xs text-brass mt-1">Note: {booking.notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
