'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ExternalTourFrame } from './external-tour-frame';
import { TourViewer } from './tour-viewer';
import { getPropertyBySlug, getTourById } from '@/lib/supabase/queries';
import { DEMO_PROPERTY, DEMO_TOUR, TourData, PropertyData } from '@/lib/mock-data';
import { Compass, Sparkles, Maximize2, Layers, Eye, MapPin, Building2 } from 'lucide-react';
import { ScrollingMarquee } from './scrolling-marquee';

/** Word reveal triggered when in viewport */
function ScrollWordReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={inView ? { y: '0%', opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.04,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function ShowreelDemoSection() {
  const [property, setProperty] = useState<PropertyData>(DEMO_PROPERTY);
  const [tour, setTour] = useState<TourData>(DEMO_TOUR);
  const [activeSceneId, setActiveSceneId] = useState<string>(DEMO_TOUR.start_scene_id);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const frameY = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);
  const frameScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.94, 1.0, 1.0, 0.96]);
  const frameRotateX = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [4, 0, 0, -2]);

  useEffect(() => {
    async function load() {
      try {
        const prop = await getPropertyBySlug('luxury-2bhk-penthouse');
        if (prop) setProperty(prop);
      } catch {}
      try {
        const data = await getTourById('22222222-2222-2222-2222-222222222222');
        if (data?.tour_scenes?.length) {
          setTour(data);
          setActiveSceneId(data.start_scene_id || data.tour_scenes[0].id);
        }
      } catch {}
    }
    load();
  }, []);

  const hasExternalTour = Boolean(property.external_tour_url);

  return (
    <section ref={sectionRef} className="relative py-16 sm:py-32 overflow-hidden">
      {/* Subtle atmospheric gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-[#0A0E1A]/80 to-ink-950 pointer-events-none" />

      {/* Ambient center cyan glow halo */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[700px] h-[300px] sm:h-[500px] pointer-events-none opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 75%)',
        }}
      />

      {/* ── Top Giant Horizontal Scrolling Marquee (Outline + Crisp White Stroke) ── */}
      <div className="relative z-10 mb-6 sm:mb-12">
        <ScrollingMarquee
          text="360° WALKTHROUGHS"
          speed={0.8}
          direction="left"
          outline={true}
          className="text-[12vw] sm:text-[7vw] font-display font-black tracking-tight leading-none opacity-80 hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
        {/* Section headline */}
        <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-xl border border-sky-400/30 text-[9px] sm:text-xs font-mono font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-sky-300 shadow-glow-cyan"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 animate-pulse shrink-0" />
            <span>Live Interactive Demo Spotlight</span>
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight leading-[1.15] sm:leading-[1.1] drop-shadow-md px-2">
            <ScrollWordReveal text="Most properties show photos." />
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-sky-400 via-cyan-200 to-indigo-300 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
              <ScrollWordReveal text="We let you walk through." />
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-slate-200/70 text-xs sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light px-2"
          >
            Interact directly with a verified spherical capture. Pan 360°, explore every angle, and feel the space in authentic dimensions.
          </motion.p>
        </div>

        {/* Cinematic tour frame with 3D perspective parallax */}
        <motion.div
          style={{
            y: frameY,
            scale: frameScale,
            rotateX: frameRotateX,
            perspective: '1200px',
            transformStyle: 'preserve-3d',
          }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-sky-400/25 shadow-glow-hero bg-slate-950 mx-1 sm:mx-0"
        >
          {/* Top chrome bar */}
          <div className="bg-slate-900/95 backdrop-blur-2xl border-b border-white/10 px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[150px] sm:max-w-[240px]">
                {property.title}
              </span>
              {property.price === 0 ? (
                <span className="text-[10px] sm:text-[11px] font-mono text-sky-200 bg-sky-500/20 px-2 sm:px-2.5 py-0.5 rounded-full border border-sky-400/30 font-semibold shrink-0">
                  Price on Req
                </span>
              ) : (
                <span className="text-[10px] sm:text-[11px] font-mono text-sky-200 bg-sky-500/20 px-2 sm:px-2.5 py-0.5 rounded-full border border-sky-400/30 font-semibold shrink-0">
                  ₹{(property.price / 10000000).toFixed(2)} Cr
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-300 font-mono shrink-0">
              <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                <Building2 className="w-3 h-3 text-indigo-400 shrink-0" />
                {property.bhk} BHK
              </span>
              <span className="hidden sm:flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                {property.locality || property.city}
              </span>
            </div>
          </div>

          {/* 360° Viewer */}
          <div className="relative h-[340px] sm:h-[500px] md:h-[600px] w-full bg-[#060608]">
            {hasExternalTour ? (
              <ExternalTourFrame
                src={property.external_tour_url!}
                title={`${property.title} 360° Virtual Tour`}
                className="w-full h-full"
              />
            ) : (
              <TourViewer
                tourData={{
                  scenes: tour.tour_scenes,
                  startSceneId: activeSceneId,
                  hotspots: tour.tour_hotspots,
                }}
                fullscreen={false}
                onSceneChange={(sceneId) => setActiveSceneId(sceneId)}
              />
            )}

            {/* Verified badge */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
              <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-sky-400/40 text-[9px] sm:text-[11px] font-bold text-sky-300 shadow-xl">
                <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400 animate-spin-slow" />
                360° VERIFIED
              </span>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="bg-slate-900/95 backdrop-blur-2xl border-t border-white/10 px-3.5 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] sm:text-xs text-slate-300 font-mono truncate">
              📍 {property.address}, {property.city}
            </span>
            <Link
              href={`/property/${property.slug}`}
              className="btn-primary text-xs !py-2.5 !px-4 sm:!px-5 w-full sm:w-auto text-center justify-center shadow-glow-cyan"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>View Property Details & Floorplan</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Bottom Reverse Direction Marquee (Solid Luminous Fill) ── */}
        <div className="pt-2 sm:pt-4">
          <ScrollingMarquee
            text="VERIFIED PORTFOLIOS · SPATIAL REAL ESTATE · DIRECT CONNECT"
            speed={0.65}
            direction="right"
            className="text-[8vw] sm:text-[4vw] font-display font-extrabold text-white/35 leading-none py-2"
          />
        </div>

        {/* Launch fullscreen CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center pt-2 px-2"
        >
          <Link
            href={`/property/${property.slug}/tour`}
            className="btn-hero text-xs sm:text-sm group border-sky-400/30 hover:border-sky-400/60 shadow-lg w-full sm:w-auto justify-center py-3"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 group-hover:text-sky-300 transition-colors shrink-0" />
            <span>Launch Fullscreen 360° Walkthrough</span>
            <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/50 group-hover:text-white/80 transition-colors shrink-0" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
