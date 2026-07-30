'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  BedDouble, 
  Bath, 
  Maximize, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Copy,
  Check
} from 'lucide-react';
import PanoramaViewer from '../components/360/PanoramaViewer';
import EMICalculator from '../components/EMICalculator';
import LeadModal from '../components/LeadModal';
import { formatINR, formatArea, calculatePricePerSqFt } from '../utils/formatters';

export default function PropertyDetailPage({ property, areaUnit, onNavigateBack }) {
  if (!property) return null;

  const [activeMediaTab, setActiveMediaTab] = useState('360tour'); // '360tour' | 'photos' | 'floorplan'
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const priceDisplay = formatINR(property.price, property.listingType);
  const areaDisplay = formatArea(property.areaSqFt, areaUnit);
  const carpetAreaDisplay = formatArea(property.carpetAreaSqFt, areaUnit);
  const pricePerSqFt = calculatePricePerSqFt(property.price, property.areaSqFt, property.listingType);

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`Check out this 360° VR Walkthrough of "${property.title}" in ${property.locality}, Mangalore: ${window.location.href}`);
      window.open(`https://wa.me/?text=${text}`, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* NAVIGATION BAR BACK */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateBack}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 transition"
        >
          ← Back to 360° Listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShare}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Tour Link'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Share via WhatsApp</span>
          </button>
        </div>
      </div>

      {/* HERO SECTION WITH 360 VIEWER / PHOTOS TOGGLE */}
      <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveMediaTab('360tour')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                activeMediaTab === '360tour'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" /> 360° VR Spatial Tour
            </button>
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeMediaTab === 'photos'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HD Gallery ({property.photos?.length || 0})
            </button>
            <button
              onClick={() => setActiveMediaTab('floorplan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeMediaTab === 'floorplan'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Architectural Floorplan
            </button>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Verified Shoot Date: {property.madcoShootDate}
          </div>
        </div>

        {/* MEDIA DISPLAY */}
        {activeMediaTab === '360tour' && (
          <PanoramaViewer 
            tourData={property.tour360} 
            propertyTitle={property.title}
            locality={property.locality}
          />
        )}

        {activeMediaTab === 'photos' && (
          <div className="space-y-4">
            <div className="relative h-[480px] w-full rounded-2xl overflow-hidden bg-slate-950">
              <img 
                src={property.photos[selectedPhotoIndex] || property.heroImage} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt=""
                  onClick={() => setSelectedPhotoIndex(i)}
                  className={`w-24 h-16 rounded-xl object-cover cursor-pointer border-2 transition ${
                    selectedPhotoIndex === i ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {activeMediaTab === 'floorplan' && (
          <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-4">
            <h4 className="text-white font-bold text-base">Architectural Floorplan Layout</h4>
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
              <img src={property.floorPlanUrl || property.heroImage} alt="Floorplan" className="w-full h-auto object-cover" />
            </div>
          </div>
        )}

      </div>

      {/* MAIN DETAILS & SIDEBAR CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT 2 COLUMNS: SPECIFICATIONS & NEIGHBORHOOD */}
        <div className="lg:col-span-2 space-y-8">

          {/* TITLE & HEADER INFO */}
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin className="w-4 h-4" /> {property.address}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">{property.title}</h1>
                <p className="text-slate-400 text-sm mt-1">{property.tagline}</p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-3xl font-black text-amber-400 tracking-tight">{priceDisplay}</div>
                {pricePerSqFt && (
                  <div className="text-xs text-slate-400 font-semibold">{pricePerSqFt}</div>
                )}
              </div>
            </div>

            {/* KEY SPECS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800/80">
              <div className="p-3 text-center border-r border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Bedrooms</span>
                <span className="text-lg font-black text-white">{property.bedrooms || 'Plot'} BHK</span>
              </div>
              <div className="p-3 text-center border-r border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Bathrooms</span>
                <span className="text-lg font-black text-white">{property.bathrooms || 'N/A'}</span>
              </div>
              <div className="p-3 text-center border-r border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Built-up Area</span>
                <span className="text-sm font-extrabold text-slate-200">{areaDisplay}</span>
              </div>
              <div className="p-3 text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Carpet Area</span>
                <span className="text-sm font-extrabold text-slate-200">{carpetAreaDisplay}</span>
              </div>
            </div>

            {/* PROPERTY HIGHLIGHTS & DESCRIPTION */}
            <div className="space-y-3">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider">Property Overview</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{property.description}</p>
            </div>

            {/* DETAILED TECHNICAL METRICS TABLE */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block">Facing Direction</span>
                <span className="text-white font-bold">{property.facing}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Furnishing Status</span>
                <span className="text-white font-bold">{property.furnishing}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Possession Status</span>
                <span className="text-white font-bold">{property.possession}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Maintenance Fee</span>
                <span className="text-white font-bold">{property.maintenanceFee}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">RERA ID</span>
                <span className="text-amber-400 font-bold truncate block">{property.reraId}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Photographer</span>
                <span className="text-white font-bold">{property.photographer}</span>
              </div>
            </div>

          </div>

          {/* AMENITIES & FEATURES */}
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Key Amenities & Lifestyle Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((amenity, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MANGALORE NEIGHBORHOOD INSIGHTS */}
          {property.nearbyLandmarks && (
            <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-400" /> Locality & Distance Calculator
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.nearbyLandmarks.map((item, i) => (
                  <div key={i} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{item.name}</span>
                    <span className="text-amber-400 font-bold">{item.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EMI CALCULATOR WIDGET */}
          {property.listingType === 'sale' && (
            <EMICalculator initialPrice={property.price} />
          )}

        </div>

        {/* RIGHT COLUMN: BOOKING & MAD.CO VERIFICATION STAMP */}
        <div className="space-y-6">

          {/* MAD.CO VERIFICATION BADGE CARD */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 p-6 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-black text-base">Mad.co 360° Verified</h4>
                <p className="text-slate-400 text-xs">Physical inspection complete</p>
              </div>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed">
              This property was professionally scanned and stitched by Mad.co Studio using 8K spatial LiDAR cameras on <strong>{property.madcoShootDate}</strong>.
            </p>

            <div className="pt-3 border-t border-slate-800/80 text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Guaranteed 100% genuine spatial layout</span>
            </div>
          </div>

          {/* CONTACT & SITE VISIT ACTION CARD */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4 sticky top-24">
            <h4 className="text-white font-bold text-base">Interested in this property?</h4>
            <p className="text-slate-400 text-xs">
              Walk through 360° online first, then schedule your physical visit with our Mangalore team.
            </p>

            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <span>Book Physical Site Visit</span>
            </button>

            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="w-full py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs border border-slate-800 flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>Request Representative Callback</span>
            </button>
          </div>

        </div>

      </div>

      {/* LEAD MODAL */}
      <LeadModal
        property={property}
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
      />

    </div>
  );
}
