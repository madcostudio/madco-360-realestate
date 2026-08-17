import Link from 'next/link';
import Image from 'next/image';
import { LiveDemoSpotlight } from '@/components/live-demo-spotlight';
import { WhyMadcoSection } from '@/components/why-madco-section';
import { MangaloreNeighborhoodsSection } from '@/components/mangalore-neighborhoods-section';
import { OwnerCtaBand } from '@/components/owner-cta-band';
import { getFeaturedProperties } from '@/lib/supabase/queries';
import { Compass, ArrowRight, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import { AnimatedHeroContent } from '@/components/animated-hero-content';

import { createClient as createBrowserClient } from '@/lib/supabase/client';

export const revalidate = 0;

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();
  const supabase = createBrowserClient();

  let heroHeading = 'Walk through your next home before you ever step inside it.';
  let heroSubcopy = 'Explore 100% verified luxury apartments, villas, and independent homes with spherical room-to-room 360° virtual walkthroughs shot in-person by Mad.co Studio.';

  try {
    const { data: heroContent } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'hero_section')
      .single();

    if (heroContent?.value?.heading) heroHeading = heroContent.value.heading;
    if (heroContent?.value?.subcopy) heroSubcopy = heroContent.value.subcopy;
  } catch (err) {
    console.warn('Could not fetch hero_section from site_content:', err);
  }

  return (
    <main className="min-h-screen bg-ink-950 text-text-hi">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-28 px-6 sm:px-12 max-w-7xl mx-auto border-b border-line">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <AnimatedHeroContent heroHeading={heroHeading} heroSubcopy={heroSubcopy} />
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
