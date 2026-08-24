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
    <main className="min-h-screen bg-[#FBFBF9] text-slate-900 p-6 sm:p-12 max-w-7xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-luxury-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-900 font-bold text-2xl flex items-center justify-center shrink-0">
            {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <h1 className="text-2xl font-serif font-bold text-slate-900">{profile.full_name || 'Verified Explorer'}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300 font-mono">
                {profile.role}
              </span>
            </div>
            <p className="text-slate-500 text-xs mt-0.5">{profile.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/search"
            className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 text-slate-800 text-xs font-semibold flex items-center space-x-1.5 transition shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>Search 360° Tours</span>
          </Link>
          <Link
            href="/owner/submit-property"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-amber-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>List New Property</span>
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-6 border-b border-slate-200 text-sm font-semibold overflow-x-auto pb-0">
        <button
          onClick={() => setActiveTab('favourites')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'favourites' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Favourites ({favourites.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'enquiries' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Enquiries ({enquiries.length})</span>
        </button>

        {(profile.role === 'owner' || profile.role === 'admin') && (
          <button
            onClick={() => setActiveTab('my-listings')}
            className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
              activeTab === 'my-listings' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>My Listings ({myListings.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('capture-bookings')}
          className={`pb-4 flex items-center space-x-2 transition border-b-2 whitespace-nowrap ${
            activeTab === 'capture-bookings' ? 'border-amber-600 text-amber-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>360° Capture Visits ({captureBookings.length})</span>
        </button>
      </div>

      {/* Favourites Tab */}
      {activeTab === 'favourites' && (
        favourites.length === 0 ? (
          <div className="text-center py-20 text-slate-500 space-y-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-luxury-sm">
            <Heart className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm">No saved favourites yet.</p>
            <Link href="/search" className="text-amber-700 font-semibold text-xs underline">Browse 360° listings →</Link>
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
          <div className="text-center py-20 text-slate-500 space-y-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-luxury-sm">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm">No enquiries sent yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry: any) => {
              const propTitle = enquiry.properties?.title || 'Property Enquiry';
              const propSlug = enquiry.properties?.slug;
              return (
                <div key={enquiry.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-luxury-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-amber-800 uppercase font-mono">{enquiry.status}</span>
                      <span className="text-slate-400 text-xs">• {new Date(enquiry.created_at).toLocaleDateString()}</span>
                    </div>
                    <h4 className="font-serif font-bold text-lg text-slate-900">{propTitle}</h4>
                    <p className="text-slate-600 text-xs">&quot;{enquiry.message}&quot;</p>
                  </div>
                  {propSlug && (
                    <Link
                      href={`/property/${propSlug}`}
                      className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 text-slate-800 text-xs font-bold transition self-start md:self-auto shadow-2xs"
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
          <div className="text-center py-20 text-slate-500 space-y-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-luxury-sm">
            <Building2 className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm">No properties submitted yet.</p>
            <Link href="/owner/submit-property" className="text-amber-700 font-semibold text-xs underline">Submit your first property →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myListings.map((prop: any) => (
              <div key={prop.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-luxury-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prop.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {prop.status}
                    </span>
                    <span className="text-xs text-amber-800 font-bold font-mono">₹{(prop.price / 10000000).toFixed(2)} Cr</span>
                  </div>
                  <h4 className="font-serif font-bold text-lg text-slate-900 mt-1">{prop.title}</h4>
                  <p className="text-xs text-slate-500">{prop.address}, {prop.city}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/property/${prop.slug}`}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-2xs"
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
          <div className="text-center py-20 text-slate-500 space-y-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-luxury-sm">
            <Compass className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm">No 360° capture visit requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {captureBookings.map((booking: any) => (
              <div key={booking.id} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-luxury-sm flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {booking.status}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-slate-900 mt-1">{booking.property_title}</h4>
                  <p className="text-xs text-slate-500">Scheduled Date: {booking.preferred_date} | Address: {booking.address}</p>
                  {booking.notes && <p className="text-xs text-amber-700 mt-1">Note: {booking.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </main>
  );
}
