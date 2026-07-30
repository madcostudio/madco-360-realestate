import React from 'react';
import { 
  Eye, 
  BedDouble, 
  Bath, 
  Maximize, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { formatINR, formatArea, calculatePricePerSqFt } from '../utils/formatters';

export default function PropertyCard({ property, areaUnit, onViewDetails, onLaunch360 }) {
  const priceDisplay = formatINR(property.price, property.listingType);
  const areaDisplay = formatArea(property.areaSqFt, areaUnit);
  const pricePerSqFt = calculatePricePerSqFt(property.price, property.areaSqFt, property.listingType);

  return (
    <div className="group bg-slate-900/90 rounded-3xl border border-slate-800/90 hover:border-indigo-500/50 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full">

      {/* HERO IMAGE CONTAINER WITH 360 OVERLAY BADGES */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-950">
        <img
          src={property.heroImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* TOP BADGES */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Listing Type Tag (For Sale / For Rent) */}
          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider backdrop-blur-md shadow-md ${
            property.listingType === 'sale'
              ? 'bg-indigo-600/90 text-white border border-indigo-400/40'
              : 'bg-emerald-600/90 text-white border border-emerald-400/40'
          }`}>
            FOR {property.listingType.toUpperCase()}
          </span>

          {/* 360 VR Verified Badge */}
          {property.verified360 && (
            <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-xl border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>360° TOUR VERIFIED</span>
            </div>
          )}
        </div>

        {/* BOTTOM HERO OVERLAY (PRICE & SPATIAL SHOOT INFO) */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <div className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {priceDisplay}
            </div>
            {pricePerSqFt && (
              <span className="text-[11px] text-amber-300 font-semibold bg-slate-950/70 px-2 py-0.5 rounded-lg backdrop-blur-md border border-slate-800">
                {pricePerSqFt}
              </span>
            )}
          </div>

          <button
            onClick={() => onLaunch360(property.id)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transition transform active:scale-95"
          >
            <Eye className="w-4 h-4 text-slate-950" />
            <span>Walk 360°</span>
          </button>
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* LOCALITY & TYPE */}
          <div className="flex items-center gap-2 mb-1.5 text-xs text-indigo-400 font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{property.locality}, Mangalore</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 capitalize">{property.type}</span>
          </div>

          {/* TITLE & TAGLINE */}
          <h3 
            onClick={() => onViewDetails(property.id)}
            className="text-white font-bold text-lg leading-snug group-hover:text-amber-400 transition cursor-pointer line-clamp-1"
          >
            {property.title}
          </h3>
          <p className="text-slate-400 text-xs line-clamp-1 mt-0.5">
            {property.tagline || property.address}
          </p>
        </div>

        {/* SPECS BAR (BEDROOMS, BATHROOMS, AREA) */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <BedDouble className="w-3 h-3 text-indigo-400" /> Bed
            </span>
            <span className="text-sm font-black text-white">{property.bedrooms || 'Plot'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Bath className="w-3 h-3 text-indigo-400" /> Bath
            </span>
            <span className="text-sm font-black text-white">{property.bathrooms || 'N/A'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-center gap-1">
              <Maximize className="w-3 h-3 text-indigo-400" /> Area
            </span>
            <span className="text-xs font-bold text-slate-200">{areaDisplay}</span>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Mad.co Tour</span>
          </div>

          <button
            onClick={() => onViewDetails(property.id)}
            className="text-indigo-400 hover:text-indigo-300 font-bold text-xs flex items-center gap-1 group/btn"
          >
            <span>Full Specs</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition" />
          </button>
        </div>

      </div>
    </div>
  );
}
