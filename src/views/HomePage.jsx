'use client';

import React from 'react';
import { 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Camera, 
  ArrowRight, 
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import PanoramaViewer from '../components/360/PanoramaViewer';
import PropertyCard from '../components/PropertyCard';
import { MANGALORE_LOCALITIES } from '../data/propertiesData';

export default function HomePage({ 
  properties = [], 
  areaUnit, 
  onViewDetails, 
  onLaunch360, 
  onNavigateProperties, 
  onRequestShoot 
}) {
  const featuredProperties = properties.filter(p => p.verified360).slice(0, 3);
  const spotlightProperty = properties[0];

  return (
    <div className="space-y-16 pb-16">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16">

        {/* Ambient Gradient Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/30 to-amber-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">

          {/* HERO TEXT HEADLINE */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-slate-900/90 text-amber-300 text-xs font-extrabold px-4 py-2 rounded-full border border-amber-500/30 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>MAD.CO STUDIO • MANGALORE 360° REAL ESTATE MARKETPLACE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
              Walk through your next home <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-400">
                before you ever step inside it.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Every property listing comes with a verified 360° virtual walkthrough — move room to room the way you would in Street View.
            </p>

            <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
              <button
                onClick={onNavigateProperties}
                className="py-4 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition transform hover:scale-[1.02]"
              >
                <Eye className="w-5 h-5 text-indigo-200" />
                <span>Explore 360° Listings</span>
              </button>

              <button
                onClick={onRequestShoot}
                className="py-4 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold text-sm shadow-lg flex items-center gap-2 transition"
              >
                <Camera className="w-5 h-5 text-amber-400" />
                <span>Shoot My Property in 360°</span>
              </button>
            </div>
          </div>

          {/* LIVE 360 SPOTLIGHT VIEWER EMBEDDED ON HERO */}
          {spotlightProperty && (
            <div className="space-y-3 max-w-5xl mx-auto">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> LIVE INTERACTIVE DEMO SPOTLIGHT
                </span>
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                  Drag to rotate • Click hotspots to change rooms
                </span>
              </div>
              <PanoramaViewer 
                tourData={spotlightProperty.tour360}
                propertyTitle={spotlightProperty.title}
                locality={spotlightProperty.locality}
              />
            </div>
          )}

        </div>
      </section>

      {/* MANGALORE LOCALITY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-400" /> Prime Mangalore Neighborhoods
            </h3>
            <button
              onClick={onNavigateProperties}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {MANGALORE_LOCALITIES.filter(l => l !== 'All Localities').slice(0, 6).map(loc => (
              <button
                key={loc}
                onClick={onNavigateProperties}
                className="p-3.5 rounded-2xl bg-slate-950 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition group"
              >
                <span className="text-xs font-bold text-white group-hover:text-amber-400 block truncate">{loc}</span>
                <span className="text-[10px] text-slate-400 font-medium">360° Verified</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* THE MAD.CO TRUST DIFFERENTIATOR vs OTHER PORTALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl space-y-8">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Why Mad.co 360° Wins Over Generic Portals
            </h2>
            <p className="text-slate-400 text-sm">
              We don't accept unverified photos. Every published listing is professionally captured by Mad.co Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* UNVERIFIED PORTALS */}
            <div className="p-6 bg-slate-950/60 rounded-3xl border border-rose-500/20 space-y-4">
              <div className="flex items-center gap-3 text-rose-400">
                <XCircle className="w-6 h-6" />
                <h3 className="font-bold text-lg text-white">Generic Listing Sites (99acres / Facebook)</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Unverified flat photos that hide dark or damaged room corners</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>No spatial context — you can't tell where rooms connect</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">✕</span>
                  <span>Wasted physical visits to properties that look completely different in real life</span>
                </li>
              </ul>
            </div>

            {/* MAD.CO VERIFIED */}
            <div className="p-6 bg-indigo-950/40 rounded-3xl border border-emerald-500/30 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <h3 className="font-bold text-lg text-white">Mad.co Verified 360° Platform</h3>
              </div>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Full 360° spatial walkthrough of every single room and balcony</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Interactive radar floor plan tracking exact camera position and direction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Professionally captured by Mad.co Studio LiDAR cameras for zero surprises</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURED PROPERTIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Featured 360° Walkthrough Listings
            </h2>
            <p className="text-slate-400 text-xs mt-1">Curated residential properties in Mangalore</p>
          </div>

          <button
            onClick={onNavigateProperties}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Explore All Listings</span> <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProperties.map(prop => (
            <PropertyCard
              key={prop.id}
              property={prop}
              areaUnit={areaUnit}
              onViewDetails={onViewDetails}
              onLaunch360={onLaunch360}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
