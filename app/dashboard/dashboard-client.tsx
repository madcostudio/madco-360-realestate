'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Heart, MessageSquare, Search, Building2, Compass, Plus } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import type { UserProfile } from '@/lib/auth';

interface DashboardClientProps {
  profile: UserProfile;
  favourites: any[];
  enquiries: any[];
  captureBookings: any[];
  myListings: any[];
}

export function DashboardClient({ profile, favourites, enquiries, captureBookings, myListings }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'favourites' | 'enquiries' | 'my-listings' | 'capture-bookings'>('favourites');

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 max-w-7xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-brass/20 border border-brass/40 text-brass font-bold text-2xl flex items-center justify-center shrink-0">
            {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <h1 className="text-2xl font-serif font-bold text-white">{profile.full_name || 'Verified Explorer'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brass/20 text-brass border border-brass/40 font-mono">
                {profile.role}
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">{profile.email}</p>
          </div>
        </div>

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
      <div className="flex items-center space-x-6 border-b border-estate-border text-sm font-semibold overflow-x-auto pb-0">
        <button
          onClick={() => setActiveTab('favourites')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'favourites' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favourites ({favourites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'enquiries' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Enquiries ({enquiries.length})</span>
        </button>

        {(profile.role === 'owner' || profile.role === 'admin') && (
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
              activeTab === 'my-listings' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('capture-bookings')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'capture-bookings' ? 'border-brass text-brass font-bold' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>360° Capture Visits ({captureBookings.length})</span>
        </button>
      </div>

      {/* Favourites Tab */}
      {activeTab === 'favourites' && (
        favourites.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <Heart className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-sm">No saved favourites yet.</p>
            <Link href="/search" className="text-brass text-xs underline">Browse 360° listings →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favourites.map((property: any) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )
      )}

      {/* Enquiries Tab */}
      {activeTab === 'enquiries' && (
        enquiries.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-sm">No enquiries sent yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry: any) => {
              const propTitle = enquiry.properties?.title || 'Property Enquiry';
              const propSlug = enquiry.properties?.slug;
              return (
                <div key={enquiry.id} className="bg-estate-card border border-estate-border rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-brass uppercase font-mono">{enquiry.status}</span>
                      <span className="text-slate-500 text-xs">• {new Date(enquiry.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-white">{propTitle}</h4>
                    <p className="text-slate-300 text-xs">"{enquiry.message}"</p>
                  </div>
                  {propSlug && (
                    <Link
                      href={`/property/${propSlug}`}
                      className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-brass text-white text-xs font-bold transition self-start md:self-auto"
                    >
                      View Property
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* My Listings Tab (Owner/Admin only) */}
      {activeTab === 'my-listings' && (
        myListings.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <Building2 className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-sm">No properties submitted yet.</p>
            <Link href="/owner/submit-property" className="text-brass text-xs underline">Submit your first property →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myListings.map((prop: any) => (
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
                  <p className="text-xs text-slate-400">{prop.address}, {prop.city}</p>
                </div>
                <div className="flex items-center space-x-2">
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
        )
      )}

      {/* Capture Bookings Tab */}
      {activeTab === 'capture-bookings' && (
        captureBookings.length === 0 ? (
          <div className="text-center py-20 text-slate-400 space-y-2">
            <Compass className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-sm">No 360° capture visit requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {captureBookings.map((booking: any) => (
              <div key={booking.id} className="bg-estate-card border border-estate-border rounded-2xl p-6 shadow-xl flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-fern/20 text-fern border border-fern/40">
                    {booking.status}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-white mt-1">{booking.property_title}</h4>
                  <p className="text-xs text-slate-400">Scheduled Date: {booking.preferred_date} | Address: {booking.address}</p>
                  {booking.notes && <p className="text-xs text-brass mt-1">Note: {booking.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </main>
  );
}
