import Link from 'next/link';
import Image from 'next/image';
import { LiveDemoSpotlight } from '@/components/live-demo-spotlight';
import { WhyMadcoSection } from '@/components/why-madco-section';
import { MangaloreNeighborhoodsSection } from '@/components/mangalore-neighborhoods-section';
import { OwnerCtaBand } from '@/components/owner-cta-band';
import { getFeaturedProperties } from '@/lib/supabase/queries';
import { Compass, ArrowRight, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <main className="min-h-screen bg-ink-950 text-text-hi">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 sm:px-12 max-w-7xl mx-auto border-b border-line">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Gold Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MAD.CO ESTATES • 360° VERIFIED REAL ESTATE MARKETPLACE</span>
          </div>

          {/* Solid Color Headline (Approved Single Solid Color Fix) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-text-hi tracking-tight leading-[1.08]">
            Walk through your next home <em className="italic font-normal">before</em> you ever step inside it.
          </h1>

          {/* Sub-copy */}
          <p className="text-text-lo text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Explore 100% verified luxury apartments, villas, and independent homes with spherical room-to-room 360° virtual walkthroughs shot in-person by Mad.co Studio.
          </p>

          {/* Dual Action CTA Buttons (Purple Primary + Gold Outline) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/search"
              className="btn-primary text-sm !py-3.5 !px-8 shadow-xl shadow-primary/25 w-full sm:w-auto"
            >
              <span>Explore 360° Listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/owner/submit-property"
              className="btn-outline-gold text-sm !py-3.5 !px-7 w-full sm:w-auto"
            >
              <span>Shoot My Property in 360°</span>
            </Link>
          </div>

          {/* Trust Highlights Strip */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-text-lo font-mono">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-gold" />
              <span>100% Verified Listings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-primary" />
              <span>Spherical 360° Walkthroughs</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Zero Fake Photos</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE DEMO VIEWER SPOTLIGHT SECTION */}
      <LiveDemoSpotlight />

      {/* 3. FEATURED PROPERTIES GRID */}
      <section className="py-24 px-6 sm:px-12 max-w-7xl mx-auto border-b border-line space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Verified Portfolios</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-hi">
              Featured 360° Walkthrough Listings
            </h2>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-gold hover:underline flex items-center space-x-1"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} imageHeight="h-64 sm:h-72" />
          ))}
        </div>
      </section>

      {/* 4. WHY MAD.CO 360° WINS */}
      <WhyMadcoSection />

      {/* 5. PRIME LOCALITIES & NEIGHBORHOODS */}
      <MangaloreNeighborhoodsSection />

      {/* 6. OWNER CTA BAND */}
      <OwnerCtaBand />
    </main>
  );
}
