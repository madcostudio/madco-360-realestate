'use client';

import React from 'react';
import { Camera, Sparkles, ShieldCheck, CheckCircle2, Eye, MessageSquare } from 'lucide-react';
import { MADCO_WHATSAPP_URL } from '../utils/url';

export default function ShootServicePage({ onRequestShoot }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">

      {/* HERO BANNER */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" /> MAD.CO STUDIO SPATIAL TECHNOLOGY
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Turn Your Mangalore Property into an Immersive 360° Virtual Experience
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Mad.co Studio brings 8K spatial LiDAR scanning and drone panoramas to Mangalore real estate. We handle the entire shoot, stitching, room hotspot mapping, and instant verified publishing.
          </p>

          <div className="pt-2 flex items-center gap-4 flex-wrap">
            <button
              onClick={onRequestShoot}
              className="py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Camera className="w-5 h-5 text-slate-950" />
              <span>Book Mad.co Spatial Shoot</span>
            </button>

            {/* Official WhatsApp Booking Button */}
            <a
              href={MADCO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-8 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 font-bold text-sm shadow-lg flex items-center gap-2 transition"
            >
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              <span>WhatsApp Studio (+91 87626 40420)</span>
            </a>
          </div>
        </div>
      </div>

      {/* WHY 360 MATTERS FOR MANGALORE OWNERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-xl">5x Higher Engagement</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Buyers spend 4x longer exploring 360° spatial walkthroughs than scrolling flat photos on conventional listing portals.
          </p>
        </div>

        <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-xl">Verified Trust Badge</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Eliminate buyer doubt. Every property shot by Mad.co receives our physical audit stamp and verified spatial walkthrough badge.
          </p>
        </div>

        <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-white font-bold text-xl">Zero Wasted Visits</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Only receive physical site visits from serious buyers who have already walked room-to-room through your home online.
          </p>
        </div>
      </div>

    </div>
  );
}
