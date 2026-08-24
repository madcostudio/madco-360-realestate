'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Globe, ChevronDown } from 'lucide-react';
import { HeroSearchForm } from '@/components/hero-search-form';

interface AnimatedHeroContentProps {
  heroHeading: string;
  heroSubcopy: string;
}

export function AnimatedHeroContent({ heroHeading, heroSubcopy }: AnimatedHeroContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unrollPercent, setUnrollPercent] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track live 360 unroll progress
  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Unroll from 0% to 100%
      const unroll = Math.min(Math.round((latest / 0.85) * 100), 100);
      setUnrollPercent(unroll);
    });
  }, [scrollYProgress]);

  return (
    // ── Outer Pinned Scroll Track Container (Responsive height) ──
    <div ref={containerRef} className="relative h-[180vh] sm:h-[220vh] w-full">
      {/* ── Sticky Viewport (Keeps content centered over 360 background during unroll) ── */}
      <div className="sticky top-0 min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden px-4 sm:px-8 py-8 sm:py-0">
        
        {/* ── Center Content Hero Container (Smooth Entrance on Reveal) ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto w-full"
        >
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-slate-950/80 backdrop-blur-2xl border border-sky-400/35 text-[9px] sm:text-xs font-mono font-bold uppercase tracking-[0.12em] sm:tracking-[0.2em] text-sky-300 mb-3 sm:mb-6 shadow-xl shadow-sky-500/10 max-w-full truncate">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 animate-pulse shrink-0" />
            <span className="truncate">ESTATES.MADCO.IN • 360° SPATIAL REAL ESTATE</span>
          </div>

          {/* Headline (Responsive clamp sizing, 100% same text) */}
          <h1 className="text-2xl min-[400px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-white tracking-tight leading-[1.12] sm:leading-[1.05] max-w-5xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.98)] px-1 sm:px-0">
            {heroHeading || 'Walk through your next home before you ever step inside.'}
          </h1>

          {/* Sub-copy (Responsive sizing, 100% same text) */}
          <p className="mt-3 sm:mt-6 text-white/95 text-xs sm:text-base md:text-lg leading-relaxed max-w-2xl font-normal drop-shadow-[0_2px_16px_rgba(0,0,0,0.98)] px-2 sm:px-0">
            {heroSubcopy || 'Explore 100% verified luxury apartments, villas, and independent homes with spherical room-to-room 360° virtual walkthroughs shot in-person by Mad.co Studio.'}
          </p>

          {/* Search Form Card */}
          <div className="mt-5 sm:mt-8 w-full max-w-xl shadow-2xl">
            <HeroSearchForm />
          </div>

          {/* Action Buttons */}
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/search" className="btn-hero-accent text-xs sm:text-sm w-full sm:w-auto shadow-glow-cyan justify-center py-3 min-h-[44px]">
              <span>Browse 360° Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/owner/submit-property" className="btn-hero text-xs sm:text-sm w-full sm:w-auto border-amber-400/40 text-amber-200 hover:text-white justify-center py-3 min-h-[44px]">
              <span>List Your Property</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Live Scroll 360 Indicator ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="absolute bottom-3 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none w-max max-w-[90vw]"
        >
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-slate-950/85 backdrop-blur-xl border border-sky-400/30 text-[10px] sm:text-[11px] font-mono text-sky-200 shadow-xl">
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 animate-spin-slow shrink-0" />
            <span className="truncate">
              {unrollPercent < 100
                ? `Scroll to unroll 360° (${unrollPercent}%)`
                : '360° Unrolled — Scroll down'}
            </span>
          </div>

          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400/80" />
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
