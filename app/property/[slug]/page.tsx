import { Metadata } from 'next';
import { getPropertyBySlug, getTourById, getPublishedProperties } from '@/lib/supabase/queries';
import { PropertyData, TourData } from '@/lib/mock-data';
import { InlineTourEmbed } from '@/components/inline-tour-embed';
import { FavouriteButton } from '@/components/favourite-button';
import { PropertyCard } from '@/components/property-card';
import { PropertyEnquiryCard } from '@/components/property-enquiry-card';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square, Sparkles, Phone, Compass, ShieldCheck, Share2, MessageCircle } from 'lucide-react';
import { AnimatedSection } from '@/components/animated-section';

export const revalidate = 0;

interface PropertyDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found - Mad.co Estates',
    };
  }

  const safeCover = property.cover_image && property.cover_image.startsWith('http') && !property.cover_image.endsWith('.txt')
    ? property.cover_image
    : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  return {
    title: `${property.title} | Mad.co Estates`,
    description: property.description || `Explore this stunning ${property.bhk} BHK property in ${property.locality || property.city}.`,
    openGraph: {
      title: property.title,
      description: property.description || `Explore this stunning ${property.bhk} BHK property in ${property.locality || property.city}.`,
      images: [
        {
          url: safeCover,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: property.description || `Explore this stunning ${property.bhk} BHK property in ${property.locality || property.city}.`,
      images: [safeCover],
    },
  };
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
    <main className="min-h-screen bg-[#EDF3F8] text-slate-900 pb-20">
      <AnimatedSection delay={0} className="relative h-[60vh] min-h-[450px] w-full">
        <Image
          src={safeCover}
          alt={activeProperty.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EDF3F8] via-transparent to-slate-950/20" />
      </AnimatedSection>

      {/* SECTION 1: HEADER & PRICING */}
      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-6 flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10 -mt-10">
        <div className="space-y-3 bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-sky-200/70 shadow-luxury-md flex-1">
          <div className="flex items-center space-x-2">
            <span className="badge-for-sale">FOR SALE</span>
            {hasTour && (
              <span className="badge-tour-verified">
                <Compass className="w-3.5 h-3.5 text-sky-600 animate-spin-slow" />
                <span>360° TOUR VERIFIED</span>
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
            {activeProperty.title}
          </h1>

          <div className="flex flex-col space-y-1">
            <a 
              href={activeProperty.map_url || `https://maps.google.com/?q=${encodeURIComponent(activeProperty.address + ', ' + activeProperty.city)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-sky-700 hover:underline text-xs sm:text-sm flex items-center space-x-1.5 transition w-fit"
              title="View on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>{activeProperty.address}, {activeProperty.city}</span>
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end space-y-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-sky-200/70 shadow-luxury-md md:min-w-[280px]">
          <div className="text-left md:text-right w-full">
            {activeProperty.price === 0 ? (
                <a
                  href={activeProperty.contact_phone ? `https://wa.me/${activeProperty.contact_phone.replace(/[^0-9]/g, '')}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-5 py-3 bg-sky-400 hover:bg-sky-300 text-slate-950 rounded-xl font-bold font-sans text-sm sm:text-base transition-transform hover:scale-[1.02] shadow-md shadow-sky-400/25 space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Price on Request</span>
                </a>
            ) : (
              <span className="text-xl sm:text-2xl font-bold font-mono text-sky-900 block">
                ₹{(activeProperty.price / 10000000).toFixed(2)} Cr
              </span>
            )}
            {activeProperty.price > 0 && (
              <span className="text-xs text-slate-500 block font-mono mt-1">
                ₹{Math.round(activeProperty.price / 1680).toLocaleString('en-IN')}/sq.ft
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:justify-end">
            <a 
              href={`https://wa.me/?text=${encodeURIComponent(`Hey! Check out this 360° verified property I found on Mad.co Estates:\n\n*${activeProperty.title}*\n📍 ${activeProperty.address}, ${activeProperty.city}\n\nTap the link below to step inside and walk through every room in 360° before visiting!\n\nhttps://estates.madco.in/property/${activeProperty.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 hover:border-sky-500 transition flex items-center justify-center text-slate-600 hover:text-sky-800 shadow-2xs"
              title="Share on WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <FavouriteButton propertyId={activeProperty.id} />
            {hasTour && (
              <Link
                href={`/property/${activeProperty.slug}/tour`}
                className="flex-1 md:flex-none py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-sky-600/25 transition hover:scale-[1.02]"
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Launch 360° Walkthrough</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 6.2: HIGHLIGHTS SPECS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-12 py-8 sm:py-10 space-y-10">
        <AnimatedSection delay={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 bg-white border border-sky-200/70 rounded-3xl shadow-luxury-sm hover:shadow-luxury-hover transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:border-r border-slate-100 sm:pr-4">
            <BedDouble className="w-6 h-6 sm:w-7 sm:h-7 text-sky-700 shrink-0" />
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block uppercase">Bedrooms</span>
              <span className="text-sm sm:text-lg font-bold text-slate-900">{activeProperty.bhk} BHK Suite</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:border-r border-slate-100 sm:pr-4">
            <Bath className="w-6 h-6 sm:w-7 sm:h-7 text-sky-700 shrink-0" />
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block uppercase">Bathrooms</span>
              <span className="text-sm sm:text-lg font-bold text-slate-900">2 En-suite</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:border-r border-slate-100 sm:pr-4">
            <Square className="w-6 h-6 sm:w-7 sm:h-7 text-sky-700 shrink-0" />
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block uppercase">Carpet Area</span>
              <span className="text-sm sm:text-lg font-bold text-slate-900">{activeProperty.carpet_area || 'N/A'}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block uppercase">Occupancy</span>
              <span className="text-sm sm:text-lg font-bold text-slate-900">Ready to Move</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Section: Short Description */}
        {activeProperty.description && (
          <AnimatedSection delay={0.15}>
            <p className="text-slate-600 text-sm leading-relaxed max-w-4xl mx-auto text-center px-4">
              {activeProperty.description.split('\n')[0].substring(0, 150)}...
            </p>
          </AnimatedSection>
        )}

        {/* SECTION 6.3: INLINE 360° TOUR EMBED WIDGET */}
        {hasTour && (
          <AnimatedSection delay={0.3}>
            <InlineTourEmbed
              slug={activeProperty.slug}
              title={activeProperty.title}
              externalTourUrl={activeProperty.external_tour_url}
              tourData={tour}
            />
          </AnimatedSection>
        )}

        {/* Section: Full Description */}
        {activeProperty.description && (
          <AnimatedSection delay={0.35} className="bg-white border border-sky-200/70 rounded-3xl p-6 sm:p-8 shadow-luxury-sm space-y-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-serif font-bold text-slate-900 border-b border-slate-100 pb-3">Detailed Property Description</h2>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
              {activeProperty.description}
            </div>
          </AnimatedSection>
        )}

        {/* Section: Direct Lead Enquiry & Site Visit Request */}
        <AnimatedSection delay={0.4} className="hover:-translate-y-1 transition-transform duration-300 max-w-4xl mx-auto">
          <PropertyEnquiryCard
            propertyId={activeProperty.id}
            propertyTitle={activeProperty.title}
            price={activeProperty.price}
            contactPhone={activeProperty.contact_phone}
          />
        </AnimatedSection>

        {/* Section: Similar Verified Properties */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold font-mono text-sky-700 uppercase tracking-wider">
                Explore More Spaces
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                Similar 360° Verified Properties
              </h2>
            </div>
            <Link
              href="/search"
              className="text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center space-x-1"
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

      <div className="h-10"></div>
    </main>
  );
}
