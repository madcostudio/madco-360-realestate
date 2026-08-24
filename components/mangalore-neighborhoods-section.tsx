'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocation } from '@/lib/location-context';
import { ArrowRight, MapPin } from 'lucide-react';

interface Neighborhood {
  name: string;
  slug: string;
  count: number;
  highlight: string;
  image: string;
}

const NEIGHBORHOODS: Neighborhood[] = [
  {
    name: 'Bejai',
    slug: 'bejai',
    count: 12,
    highlight: 'Central connectivity & luxury high-rises',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kadri',
    slug: 'kadri',
    count: 10,
    highlight: 'Lush greenery & premium residential villas',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Urwa & Ladyhill',
    slug: 'urwa',
    count: 8,
    highlight: 'Coastal sea views & modern lifestyle towers',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Falnir',
    slug: 'falnir',
    count: 6,
    highlight: 'Heritage residences & elite gated enclaves',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
];

export function MangaloreNeighborhoodsSection() {
  const { city, setLocation } = useLocation();

  const titleText = city ? `Explore Verified Homes in ${city}` : 'Explore Verified Homes by Locality';
  const buttonText = city ? `View All ${city} Listings` : 'View All Listings';

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 space-y-8 border-b border-sky-200/50">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-sky-700 font-mono mb-1 font-bold">
            // PRIME LOCALITIES &amp; NEIGHBORHOODS
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            {titleText}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Browse hand-curated localities photographed and spatial-scanned by Mad.co Studio.
          </p>
        </div>
        <Link
          href={city ? `/search?city=${encodeURIComponent(city)}` : '/search'}
          className="text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center space-x-1"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NEIGHBORHOODS.map((hood) => {
          const targetUrl = city
            ? `/search?city=${encodeURIComponent(city)}&locality=${encodeURIComponent(hood.name)}`
            : `/search?locality=${encodeURIComponent(hood.name)}`;

          return (
            <Link
              key={hood.slug}
              href={targetUrl}
              onClick={() => setLocation({ city: city || 'All Cities', locality: hood.name })}
              className="group relative h-72 rounded-2xl overflow-hidden border border-sky-200/80 hover:border-sky-500/80 transition duration-300 shadow-luxury-sm hover:shadow-luxury-hover flex flex-col justify-end p-6 hover:-translate-y-1.5"
            >
              <Image
                src={hood.image}
                alt={hood.name}
                fill
                className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />

              <div className="relative z-10 space-y-1">
                <div className="inline-flex items-center space-x-1 text-[10px] uppercase font-mono tracking-wider text-sky-300 font-bold">
                  <MapPin className="w-3 h-3" />
                  <span>{hood.count} 360° Tours</span>
                </div>
                <h4 className="font-serif font-bold text-xl text-white flex items-center justify-between">
                  <span>{hood.name}</span>
                  <ArrowRight className="w-4 h-4 text-sky-300 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-[11px] text-slate-200 line-clamp-1">{hood.highlight}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
