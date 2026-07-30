'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Eye, 
  Camera, 
  Sparkles, 
  Building, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export default function AdminDashboardPage({ 
  properties = [], 
  onApproveProperty, 
  onRejectProperty, 
  onViewProperty 
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'published' | 'shoots'

  const pendingListings = properties.filter(p => p.status === 'pending_approval' || !p.verified360);
  const publishedListings = properties.filter(p => p.verified360 && p.status !== 'pending_approval');

  // Sample Shoot Bookings
  const shootBookings = [
    {
      id: 'shoot-101',
      owner: 'Dr. Vikram Shetty',
      phone: '+91 98450 12345',
      locality: 'Kadri Hills',
      type: '3BHK Flat',
      package: '8K Spatial LiDAR Scan (₹14,999)',
      date: 'July 31, 2026',
      status: 'Crew Dispatched'
    },
    {
      id: 'shoot-102',
      owner: 'Ananya Rai',
      phone: '+91 97412 88990',
      locality: 'Surathkal Beach',
      type: 'Independent Villa',
      package: 'Ultra Villa & Sunset Drone (₹24,999)',
      date: 'Aug 02, 2026',
      status: 'Confirmed'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">

      {/* HEADER */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Mad.co Studio Admin Console</h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Live Spatial Admin
              </span>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">
              Review 360° tour submissions, issue Mad.co Verification Badges, and manage spatial shoot dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Published 360 Listings</span>
            <div className="text-2xl font-black text-white">{publishedListings.length}</div>
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Pending Approvals</span>
            <div className="text-2xl font-black text-amber-400">{pendingListings.length}</div>
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">Mad.co Shoots Booked</span>
            <div className="text-2xl font-black text-emerald-400">{shootBookings.length + 3}</div>
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 font-bold uppercase">360 Tour Plays</span>
            <div className="text-2xl font-black text-white">4,820</div>
          </div>
        </div>
      </div>

      {/* ADMIN TABS & CONTENT */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">

        {/* TAB SWITCHER */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'pending' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending 360 Approvals ({pendingListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('published')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'published' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Active Published Listings ({publishedListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shoots')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'shoots' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Mad.co Studio Shoot Orders ({shootBookings.length})</span>
          </button>
        </div>

        {/* TAB 1: PENDING APPROVALS */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingListings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-80" />
                <p className="font-bold text-white">All submitted 360° tours have been audited and approved!</p>
              </div>
            ) : (
              pendingListings.map(p => (
                <div key={p.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img src={p.heroImage} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          {p.photographer || 'Self Submission'}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{p.locality}, Mangalore</span>
                      </div>
                      <h4 className="text-white font-bold text-base line-clamp-1">{p.title}</h4>
                      <p className="text-slate-400 text-xs">{formatINR(p.price, p.listingType)} • {p.tour360?.rooms?.length || 0} Spatial Rooms</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onViewProperty(p.id)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4 text-indigo-400" /> Preview 360
                    </button>

                    <button
                      onClick={() => onApproveProperty(p.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Issue 360° Verified Badge & Publish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ACTIVE PUBLISHED LISTINGS */}
        {activeTab === 'published' && (
          <div className="space-y-4">
            {publishedListings.map(p => (
              <div key={p.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={p.heroImage} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> VERIFIED 360 TOUR
                      </span>
                      <span className="text-xs text-slate-400">{p.locality}</span>
                    </div>
                    <h4 className="text-white font-bold text-base line-clamp-1">{p.title}</h4>
                    <p className="text-slate-400 text-xs">{formatINR(p.price, p.listingType)} • {p.madcoShootDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewProperty(p.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> View Live Listing
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: MAD.CO SHOOT ORDERS */}
        {activeTab === 'shoots' && (
          <div className="space-y-4">
            {shootBookings.map(b => (
              <div key={b.id} className="p-5 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-400">{b.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-300 font-semibold">{b.locality}</span>
                  </div>
                  <h4 className="text-white font-bold text-base">{b.owner} ({b.phone})</h4>
                  <p className="text-slate-400 text-xs">{b.type} • {b.package}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                    {b.status}
                  </span>
                  <button className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs">
                    Dispatch Crew
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
