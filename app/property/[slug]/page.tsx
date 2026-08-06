import { getPropertyBySlug, getTourById, getPublishedProperties } from '@/lib/supabase/queries';
import { PropertyData, TourData } from '@/lib/mock-data';
import { InlineTourEmbed } from '@/components/inline-tour-embed';
import { FavouriteButton } from '@/components/favourite-button';
import { PropertyCompareDrawer } from '@/components/property-compare-drawer';
import { PropertyCard } from '@/components/property-card';
import { PropertyEnquiryCard } from '@/components/property-enquiry-card';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square, Sparkles, Phone, Compass, ShieldCheck } from 'lucide-react';

interface PropertyDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyDetailPage({ params }: PropertyDetailProps) {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const activeProperty: PropertyData = property;
  const tour = activeProperty.tour_id ? await getTourById(activeProperty.tour_id) : null;
  const hasRealLocalScenes = Boolean(
    tour &&
    tour.tour_scenes &&
    tour.tour_scenes.length > 0 &&
    tour.tour_scenes.some((s) => s.pano_levels?.high && !s.pano_levels.high.includes('/demo-panoramas/'))
  );
  const hasTour = Boolean(
    (activeProperty.external_tour_url && activeProperty.external_tour_url.trim().length > 0) ||
    hasRealLocalScenes
  );
  const allPublished = await getPublishedProperties();
  const safeCover = activeProperty.cover_image && activeProperty.cover_image.startsWith('http') && !activeProperty.cover_image.endsWith('.txt')
    ? activeProperty.cover_image
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  return (
    <main className="min-h-screen bg-slate-950 text-white pb-20">
      {/* SECTION 6.1: HERO BANNER */}
      <div className="relative h-[480px] w-full">
        <Image
          src={safeCover}
          alt={activeProperty.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        <div className="absolute bottom-0 inset-x-0 max-w-7xl mx-auto p-6 sm:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="badge-for-sale">FOR SALE</span>
              {hasTour && (
                <span className="badge-tour-verified">
                  <Compass className="w-3.5 h-3.5 text-gold" />
                  <span>360° TOUR VERIFIED</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              {activeProperty.title}
            </h1>

            <p className="text-slate-300 text-sm flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{activeProperty.address}, {activeProperty.city}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end space-y-3">
            <div className="text-left md:text-right">
              <span className="text-3xl sm:text-4xl font-bold font-mono text-brass">
                ₹{(activeProperty.price / 10000000).toFixed(2)} Cr
              </span>
              <span className="text-xs text-slate-400 block font-mono">
                ₹{Math.round(activeProperty.price / 1680).toLocaleString('en-IN')}/sq.ft
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <FavouriteButton propertyId={activeProperty.id} />
              {hasTour && (
                <Link
                  href={`/property/${activeProperty.slug}/tour`}
                  className="py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition hover:scale-[1.02]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Launch Fullscreen 360° Walkthrough</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6.2: HIGHLIGHTS SPECS BAR */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-estate-card border border-estate-border rounded-2xl shadow-xl">
          <div className="flex items-center space-x-3 border-r border-slate-800 pr-4">
            <BedDouble className="w-7 h-7 text-brass shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block uppercase">Bedrooms</span>
              <span className="text-lg font-bold text-white">{activeProperty.bhk} BHK Suite</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 border-r border-slate-800 pr-4">
            <Bath className="w-7 h-7 text-brass shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block uppercase">Bathrooms</span>
              <span className="text-lg font-bold text-white">2 En-suite</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 border-r border-slate-800 pr-4">
            <Square className="w-7 h-7 text-brass shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block uppercase">Carpet Area</span>
              <span className="text-lg font-bold text-white">1,680 sq.ft.</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-7 h-7 text-fern shrink-0" />
            <div>
              <span className="text-xs text-slate-400 block uppercase">Occupancy</span>
              <span className="text-lg font-bold text-white">Ready to Move</span>
            </div>
          </div>
        </div>

        {/* Section: Overview & Description */}
        <section className="bg-estate-card border border-estate-border rounded-3xl p-8 shadow-xl space-y-4">
          <h2 className="text-2xl font-serif font-bold text-white">Property Description</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {activeProperty.description}
          </p>
        </section>

        {/* SECTION 6.3: INLINE 360° TOUR EMBED WIDGET */}
        {hasTour && (
          <InlineTourEmbed
            slug={activeProperty.slug}
            title={activeProperty.title}
            externalTourUrl={activeProperty.external_tour_url}
            tourData={tour}
          />
        )}

        {/* Section: Direct Lead Enquiry & Site Visit Request */}
        <section>
          <PropertyEnquiryCard
            propertyId={activeProperty.id}
            propertyTitle={activeProperty.title}
            price={activeProperty.price}
          />
        </section>

        {/* Section: Similar Verified Properties */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold font-mono text-gold uppercase tracking-wider">
                Explore More Spaces
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mt-1">
                Similar 360° Verified Properties
              </h2>
            </div>
            <Link
              href="/search"
              className="text-xs font-bold text-gold hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allPublished
              .filter((p) => p.id !== activeProperty.id && p.status === 'published')
              .slice(0, 2)
              .map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
          </div>
        </section>
      </div>

      {/* Property Compare Drawer */}
      <PropertyCompareDrawer properties={allPublished} />
    </main>
  );
}
