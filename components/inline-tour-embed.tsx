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
    <section className="my-12 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-luxury-md relative overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-amber-600 animate-spin-slow" />
            <span>Interactive 360° Walkthrough</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Step Inside the Property
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Explore every room in full high-definition 360° before booking an in-person viewing.
          </p>
        </div>

        <Link
          href={`/property/${slug}/tour`}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20 hover:scale-[1.02] transition-all duration-200 group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span>Launch Fullscreen Walkthrough</span>
          <Maximize2 className="w-4 h-4 ml-1" />
        </Link>
      </div>

      {/* Embedded 360° Viewer Container */}
      <div className="relative rounded-2xl overflow-hidden shadow-luxury-sm bg-slate-950 border border-slate-200">
        {hasExternalTour ? (
          <div className="relative w-full h-[350px] sm:h-[500px] lg:h-[600px] bg-slate-950">
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
      </div>
    </section>
  );
}
