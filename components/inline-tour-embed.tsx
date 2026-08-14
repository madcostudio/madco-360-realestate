'use client';

import Link from 'next/link';
import { TourViewer } from './tour-viewer';
import { TourData } from '@/lib/mock-data';
import { Sparkles, Maximize2, Compass } from 'lucide-react';

import { ExternalTourFrame } from './external-tour-frame';

interface InlineTourEmbedProps {
  slug: string;
  title?: string;
  externalTourUrl?: string;
  tourData?: any;
}

export function InlineTourEmbed({ slug, title, externalTourUrl, tourData }: InlineTourEmbedProps) {
  const hasExternalTour = Boolean(externalTourUrl && externalTourUrl.trim().length > 0);
  const hasRealLocalScenes = Boolean(
    tourData &&
    tourData.tour_scenes &&
    tourData.tour_scenes.length > 0 &&
    tourData.tour_scenes.some((s: any) => s.pano_levels?.high && !s.pano_levels.high.includes('/demo-panoramas/'))
  );

  if (!hasExternalTour && !hasRealLocalScenes) {
    return null;
  }

  return (
    <section className="my-12 bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brass/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-brass text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 animate-spin-slow text-brass" />
            <span>Interactive 360° Walkthrough</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Step Inside the Property
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Explore every room in full high-definition 360° before booking an in-person viewing.
          </p>
        </div>

        <Link
          href={`/property/${slug}/tour`}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brass via-brass-dark to-brass text-slate-950 font-bold hover:shadow-lg hover:shadow-brass/30 hover:scale-[1.02] transition-all duration-300 group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Launch Fullscreen Walkthrough</span>
          <Maximize2 className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Embedded 360° Viewer Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800">
        {hasExternalTour ? (
          <div className="relative w-full h-[500px] sm:h-[600px] bg-slate-950">
            <ExternalTourFrame
              src={externalTourUrl!}
              title={`${title || 'Property'} 360° Virtual Tour`}
              className="w-full h-full"
            />
          </div>
        ) : (
          <TourViewer
            tourData={{
              scenes: tourData.tour_scenes,
              startSceneId: tourData.start_scene_id,
              hotspots: tourData.tour_hotspots,
            }}
            fullscreen={false}
          />
        )}

        {/* Quick Launch Card Overlay */}
        <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-slate-950 via-slate-950/70 to-transparent flex items-start justify-between pointer-events-none z-20">
          <div className="pointer-events-auto flex items-center space-x-3 mt-2">
            <span className="text-[10px] sm:text-xs text-slate-300 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 shadow-md">
              💡 Interactive 360° Tour: Click &amp; drag to look around, or use on-screen hotspots to explore
            </span>
          </div>

          <Link
            href={`/property/${slug}/tour`}
            className="pointer-events-auto mt-2 text-[10px] sm:text-xs font-bold text-brass hover:text-white bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-brass/40 hover:border-brass transition shadow-md"
          >
            Launch Fullscreen ↗
          </Link>
        </div>
      </div>
    </section>
  );
}
