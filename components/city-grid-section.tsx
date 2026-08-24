'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLocation } from '@/lib/location-context';
import { ArrowRight } from 'lucide-react';

interface CityTile {
  name: string;
  slug: string;
  count: number;
  image: string;
}

const CITIES: CityTile[] = [
  {
    name: 'Mumbai',
    slug: 'mumbai',
    count: 24,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bengaluru',
    slug: 'bengaluru',
    count: 18,
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Delhi NCR',
    slug: 'delhi',
    count: 15,
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hyderabad',
    slug: 'hyderabad',
    count: 12,
    image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?auto=format&fit=crop&w=800&q=80',
  },
];

export function CityGridSection() {
  const { setLocation } = useLocation();

  return (
    <section className="py-20 max-w-7xl mx-auto px-6 space-y-8 border-b border-sky-200/50">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-sky-700 font-mono font-bold">
          // BROWSE BY CITY
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CITIES.map((cityTile) => (
          <Link
            key={cityTile.slug}
            href={`/search?city=${encodeURIComponent(cityTile.name)}`}
            onClick={() => setLocation({ city: cityTile.name })}
            className="group relative h-64 rounded-2xl overflow-hidden border border-sky-200/80 hover:border-sky-500/80 transition duration-300 shadow-luxury-sm hover:shadow-luxury-hover flex flex-col justify-end p-6 hover:-translate-y-1.5"
          >
            <Image
              src={cityTile.image}
              alt={cityTile.name}
              fill
              className="object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <div className="relative z-10 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-sky-300 font-bold">
                {cityTile.count} 360° Verified Listings
              </span>
              <h4 className="font-serif font-bold text-2xl text-white flex items-center justify-between">
                <span>{cityTile.name}</span>
                <ArrowRight className="w-5 h-5 text-sky-300 group-hover:translate-x-1 transition-transform" />
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
