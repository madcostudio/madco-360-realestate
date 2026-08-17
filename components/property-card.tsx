'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PropertyData } from '@/lib/mock-data';
import { Compass, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: PropertyData;
  className?: string;
  imageHeight?: string;
}

export function PropertyCard({ property, className = '', imageHeight = 'h-56' }: PropertyCardProps) {
  const isPriceOnRequest = property.price === 0;

  const formattedPrice = isPriceOnRequest
    ? 'Price on Request'
    : property.price >= 10000000
    ? `₹${(property.price / 10000000).toFixed(2)} Cr`
    : property.price >= 100000
    ? `₹${(property.price / 100000).toFixed(2)} L`
    : new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(property.price);

  const estimatedSqft = property.bhk === 1 ? 850 : property.bhk === 2 ? 1450 : property.bhk === 3 ? 2100 : 3450;
  const rateNum = isPriceOnRequest ? 0 : Math.round(property.price / estimatedSqft);
  const ratePerSqft = isPriceOnRequest ? null : `₹${new Intl.NumberFormat('en-IN').format(rateNum)}/sq.ft`;

  // Locality: e.g. "URWA, MANGALORE" or "BANDRA WEST, MUMBAI"
  const addressParts = (property.address || '').split(',').map((s) => s.trim()).filter(Boolean);
  const locality = addressParts.length > 1
    ? `${addressParts[addressParts.length - 1]}, ${property.city}`.toUpperCase()
    : `${property.address || ''}, ${property.city}`.toUpperCase();

  const propertyType = property.title.toLowerCase().includes('penthouse')
    ? 'Penthouse'
    : property.title.toLowerCase().includes('villa')
    ? 'Villa'
    : property.title.toLowerCase().includes('duplex')
    ? 'Duplex'
    : `${property.bhk} BHK Flat`;

  const subtitle = property.description
    ? property.description
    : `${property.bhk} BHK Suite · ${estimatedSqft} sq.ft. · Ready to Move`;

  const safeCover = property.cover_image && property.cover_image.startsWith('http') && !property.cover_image.endsWith('.txt')
    ? property.cover_image
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const hasTour = Boolean(property.external_tour_url && property.external_tour_url.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`relative bg-ink-900 border border-line rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-brass/20 group hover:border-brass/40 transition-all duration-500 flex flex-col justify-between hover:-translate-y-1.5 ${className}`}
    >
      {/* Full-bleed link to make the entire card clickable */}
      <Link href={`/property/${property.slug}`} className="absolute inset-0 z-0" aria-label={`View ${property.title}`} prefetch={true} />

      {/* Card Image & Badges Overlay */}
      <div className={`relative ${imageHeight} w-full overflow-hidden z-10 pointer-events-none`}>
        <Image
          src={safeCover}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient shadow overlay for price legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10">
          <span className="badge-for-sale">FOR SALE</span>
        </div>
        {hasTour && (
          <div className="absolute top-3 right-3 z-10">
            <span className="badge-tour-verified">
              <Compass className="w-3 h-3 text-gold" />
              <span>360° TOUR VERIFIED</span>
            </span>
          </div>
        )}

        {/* Bottom Left: Large White Price + Gold Rate Pill */}
        <div className="absolute bottom-3 left-3 z-20 flex flex-col items-start pointer-events-auto">
          {isPriceOnRequest ? (
            <Link
              href={property.contact_phone ? `https://wa.me/${property.contact_phone.replace(/[^0-9]/g, '')}` : `#`}
              target="_blank"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold font-sans text-slate-950 bg-gold hover:bg-gold/90 px-3 py-1.5 rounded-lg border border-gold/50 shadow-lg shadow-gold/20 transition-transform hover:scale-105"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{formattedPrice}</span>
            </Link>
          ) : (
            <div className="text-xl sm:text-2xl font-bold font-mono text-white leading-tight drop-shadow-md">
              {formattedPrice}
            </div>
          )}
          {ratePerSqft && (
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gold/20 backdrop-blur-md border border-gold/40 text-gold mt-1 shadow-sm">
              {ratePerSqft}
            </div>
          )}
        </div>

        {/* Bottom Right: Orange/Amber Gradient Walk 360° Button (Only if hasTour) */}
        {hasTour && (
          <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
            <Link
              href={`/property/${property.slug}/tour`}
              className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-ink-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-md shadow-amber-500/20 hover:scale-[1.02]"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Walk 360°</span>
            </Link>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-3 relative z-10 pointer-events-none">
        {/* Locality line: Purple MapPin + Uppercase Locality + · + Property Type */}
        <div className="flex items-center space-x-1.5 text-xs truncate">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="text-primary font-bold uppercase tracking-wide truncate">
            {locality}
          </span>
          <span className="text-text-lo">·</span>
          <span className="text-text-lo shrink-0">{propertyType}</span>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-lg font-serif font-bold text-text-hi line-clamp-1 group-hover:text-gold transition">
            {property.title}
          </h3>
          <p className="text-text-lo text-xs mt-1 line-clamp-1">
            {subtitle}
          </p>
        </div>

        {/* Verified line row at bottom with hairline divider */}
        <div className="pt-3 border-t border-line flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-1.5 text-xs text-text-lo font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified Mad.co Tour</span>
          </div>
          <span
            className="text-primary group-hover:text-gold text-xs font-semibold flex items-center space-x-1 transition"
          >
            <span>Full Specs</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
