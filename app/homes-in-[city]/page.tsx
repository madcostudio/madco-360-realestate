import { getPublishedProperties } from '@/lib/supabase/queries';
import { PropertyData } from '@/lib/mock-data';
import Link from 'next/link';
import { MapPin, Compass, ArrowLeft } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';

export async function generateStaticParams() {
  return [
    { city: 'mumbai' },
    { city: 'bengaluru' },
    { city: 'mangalore' },
    { city: 'delhi' },
    { city: 'hyderabad' },
    { city: 'goa' },
  ];
}

interface CityPageProps {
  params: Promise<{ city: string }>;
}

export default async function CityLandingPage({ params }: CityPageProps) {
  const resolvedParams = await params;
  const cityParam = resolvedParams?.city || 'mumbai';
  const rawCityName = cityParam.replace(/^homes-in-/, '').replace(/-/g, ' ');
  const capitalizedCity = rawCityName.charAt(0).toUpperCase() + rawCityName.slice(1);

  const allPublished = await getPublishedProperties();
  const cityListings = allPublished.filter(
    (p) => p.city?.toLowerCase().trim() === rawCityName.toLowerCase().trim()
  );

  // If no city-specific listing exists yet, show all published verified listings
  const displayListings = cityListings.length > 0 ? cityListings : allPublished;

  return (
    <main className="min-h-screen bg-[#FBFBF9] text-slate-900 pb-20">
      {/* City Hero Banner */}
      <section className="relative py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-amber-800 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Verified City Hub</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-slate-900">
            360° Luxury Homes in {capitalizedCity}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
            Explore verified residential penthouses and architectural villas in {capitalizedCity} with full 360° virtual walkthroughs.
          </p>
        </div>
      </section>

      {/* Listing Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">
            Showing {displayListings.length} {cityListings.length > 0 ? 'homes in ' + capitalizedCity : 'featured homes across India'}
          </span>
          <Link
            href="/search"
            className="text-xs text-amber-700 hover:text-amber-800 hover:underline font-semibold flex items-center space-x-1"
          >
            <span>Filter All Listings</span>
            <Compass className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayListings.map((property) => (
            <PropertyCard key={property.id} property={property} imageHeight="h-64" />
          ))}
        </div>
      </section>
    </main>
  );
}
