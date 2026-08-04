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
  const { setLocation } = useLocation();

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 space-y-8 border-b border-line">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-gold font-mono mb-1">
            // PRIME MANGALORE NEIGHBORHOODS
          </div>
          <h2 className="text-3xl font-serif font-bold text-text-hi">
            Explore Verified Homes in Mangalore
          </h2>
          <p className="text-text-lo text-xs sm:text-sm mt-1">
            Browse hand-curated localities photographed and spatial-scanned by Mad.co Studio.
          </p>
        </div>
        <Link
          href="/search"
          onClick={() => setLocation({ city: 'Mangalore' })}
          className="text-xs font-bold text-gold hover:underline flex items-center space-x-1"
        >
          <span>View All Mangalore Listings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {NEIGHBORHOODS.map((hood) => (
          <Link
            key={hood.slug}
            href={`/search?city=Mangalore&locality=${encodeURIComponent(hood.name)}`}
            onClick={() => setLocation({ city: 'Mangalore', locality: hood.name })}
            className="group relative h-72 rounded-2xl overflow-hidden border border-line hover:border-gold/50 transition duration-300 shadow-xl flex flex-col justify-end p-6"
          >
            <Image
              src={hood.image}
              alt={hood.name}
              fill
              className="object-cover brightness-65 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />

            <div className="relative z-10 space-y-1">
              <div className="inline-flex items-center space-x-1 text-[10px] uppercase font-mono tracking-wider text-gold">
                <MapPin className="w-3 h-3" />
                <span>{hood.count} 360° Tours</span>
              </div>
              <h4 className="font-serif font-bold text-xl text-text-hi flex items-center justify-between">
                <span>{hood.name}</span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-[11px] text-text-lo line-clamp-1">{hood.highlight}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
