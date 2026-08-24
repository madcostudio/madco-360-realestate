import Link from 'next/link';
import Image from 'next/image';
import { ShowreelDemoSection } from '@/components/showreel-demo-section';
import { WhyMadcoSection } from '@/components/why-madco-section';
import { MangaloreNeighborhoodsSection } from '@/components/mangalore-neighborhoods-section';
import { OwnerCtaBand } from '@/components/owner-cta-band';
import { getFeaturedProperties } from '@/lib/supabase/queries';
import { Compass, ArrowRight, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { PropertyCard } from '@/components/property-card';
import { AnimatedHeroContent } from '@/components/animated-hero-content';
import { InteractiveMeshBackground } from '@/components/interactive-mesh-background';
import { ScrollRevealWrapper } from '@/components/scroll-reveal-wrapper';

import { createClient as createBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';

export const revalidate = 0;

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  let heroHeading = 'Walk through your next home before you ever step inside.';
  let heroSubcopy = 'Explore 100% verified luxury apartments, villas, and independent homes with spherical room-to-room 360° virtual walkthroughs shot in-person by Mad.co Studio.';

  if (isSupabaseConfigured()) {
    try {
      const supabase = createBrowserClient();
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
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* ── Spectacular WebGL 360 Aurora Background ── */}
      <InteractiveMeshBackground />

      {/* ── 1. HERO — Full-screen dark cinematic with pinned unroll track ── */}
      <section className="relative z-10">
        <AnimatedHeroContent heroHeading={heroHeading} heroSubcopy={heroSubcopy} />
      </section>

      {/* ── 2. SHOWREEL / 360° DEMO — Dark-to-light transition ── */}
      <ShowreelDemoSection />

      {/* ── 3. FEATURED PROPERTIES GRID — Light section with scroll reveals ── */}
      <section className="relative z-10 bg-ink-950 py-16 sm:py-24 px-4 sm:px-12">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
          <ScrollRevealWrapper variant="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white/80 backdrop-blur-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-sky-200/60 shadow-luxury-md">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-100/90 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3 shadow-2xs">
                  <Compass className="w-3.5 h-3.5 text-sky-600 animate-spin-slow" />
                  <span>Verified Portfolios</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
                  Featured 360° Walkthrough Listings
                </h2>
              </div>
              <Link
                href="/search"
                className="text-xs font-bold text-sky-700 hover:text-sky-900 hover:underline flex items-center space-x-1 self-start sm:self-auto"
              >
                <span>Explore All Properties</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollRevealWrapper>

          <ScrollRevealWrapper variant="fade-scale" stagger={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} imageHeight="h-56 sm:h-72" />
              ))}
            </div>
          </ScrollRevealWrapper>
        </div>
      </section>

      {/* ── 4. WHY MAD.CO 360° WINS ── */}
      <div className="relative z-10 bg-ink-950">
        <ScrollRevealWrapper variant="blur-in">
          <WhyMadcoSection />
        </ScrollRevealWrapper>
      </div>

      {/* ── 5. PRIME LOCALITIES & NEIGHBORHOODS ── */}
      <div className="relative z-10 bg-ink-950">
        <ScrollRevealWrapper variant="fade-up">
          <MangaloreNeighborhoodsSection />
        </ScrollRevealWrapper>
      </div>

      {/* ── 6. OWNER CTA BAND ── */}
      <div className="relative z-10 bg-ink-950">
        <ScrollRevealWrapper variant="fade-scale">
          <OwnerCtaBand />
        </ScrollRevealWrapper>
      </div>
    </main>
  );
}
