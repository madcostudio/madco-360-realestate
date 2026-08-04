import { DEMO_PROPERTIES_LIST, PropertyData } from '@/lib/mock-data';
import { InlineTourEmbed } from '@/components/inline-tour-embed';
import { DEMO_TOUR } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Compass, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import { PropertyCard } from '@/components/property-card';

export async function generateStaticParams() {
  return [
    { city: 'mumbai' },
    { city: 'bengaluru' },
    { city: 'delhi' },
    { city: 'hyderabad' },
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

  const cityListings = DEMO_PROPERTIES_LIST.filter(
    (p) => p.status === 'published'
  );

  return (
    <main className="min-h-screen bg-ink-950 text-text-hi pb-20">
      {/* City Hero Banner */}
      <section className="relative py-20 bg-ink-900 border-b border-line">
        <div className="max-w-7xl mx-auto px-6 space-y-4 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs text-text-lo hover:text-brass transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brass-soft border border-brass/30 text-brass text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Verified City Hub</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-text-hi">
            360° Luxury Homes in {capitalizedCity}
          </h1>
          <p className="text-text-lo text-sm max-w-2xl leading-relaxed">
            Explore verified residential penthouses and architectural villas in {capitalizedCity} with full 360° virtual walkthroughs.
          </p>
        </div>
      </section>

      {/* Listing Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cityListings.map((property) => (
            <PropertyCard key={property.id} property={property} imageHeight="h-64" />
          ))}
        </div>
      </section>
    </main>
  );
}
