'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, Share2 } from 'lucide-react';

interface TourHeaderOverlayProps {
  title: string;
  price: number;
  address?: string;
  slug: string;
  contactPhone?: string;
}

export function TourHeaderOverlay({ title, price, address, slug, contactPhone }: TourHeaderOverlayProps) {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${title} - 360 Virtual Tour`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert('Tour link copied to clipboard!');
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 bg-estate-card/85 backdrop-blur-xl border border-estate-border/80 rounded-2xl p-4 shadow-2xl pointer-events-auto">
        <div className="flex items-center space-x-4 min-w-0">
          <Link
            href={`/property/${slug}`}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-brass transition shrink-0"
            title="Exit Tour"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-serif font-bold text-white truncate">
              {title}
            </h1>
            {address && (
              <p className="text-xs text-slate-400 flex items-center space-x-1 truncate mt-0.5">
                <MapPin className="w-3 h-3 text-brass shrink-0" />
                <span className="truncate">{address}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block uppercase tracking-wider">Listing Price</span>
            {price === 0 ? (
              <a
                href={contactPhone ? `https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-bold font-sans text-gold hover:underline"
              >
                Price on Request
              </a>
            ) : (
              <span className="text-xl font-bold text-brass font-mono">{formattedPrice}</span>
            )}
          </div>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 hover:text-white hover:border-brass transition"
            title="Share Tour"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <Link
            href={`/property/${slug}`}
            className="px-4 py-2 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-brass/20"
          >
            Exit Tour
          </Link>
        </div>
      </div>
    </div>
  );
}
