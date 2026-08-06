'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalTourFrame } from './external-tour-frame';
import { TourViewer } from './tour-viewer';
import { getPropertyBySlug, getTourById } from '@/lib/supabase/queries';
import { DEMO_PROPERTY, DEMO_TOUR, TourData, PropertyData } from '@/lib/mock-data';
import { Compass, Sparkles, Maximize2, Layers, Eye, MapPin, Building2 } from 'lucide-react';

interface LiveDemoSpotlightProps {
  property?: PropertyData;
}

export function LiveDemoSpotlight({ property: initialProperty }: LiveDemoSpotlightProps) {
  const [property, setProperty] = useState<PropertyData>(initialProperty || DEMO_PROPERTY);
  const [tour, setTour] = useState<TourData>(DEMO_TOUR);
  const [activeSceneId, setActiveSceneId] = useState<string>(DEMO_TOUR.start_scene_id);
  const [bearing, setBearing] = useState<number>(45);

  useEffect(() => {
    async function loadData() {
      // Fetch latest property with tour URL from Supabase
      try {
        const prop = await getPropertyBySlug('luxury-2bhk-penthouse');
        if (prop) {
          setProperty(prop);
        }
      } catch (err) {
        console.warn('Could not load live property for spotlight:', err);
      }

      try {
        const data = await getTourById('22222222-2222-2222-2222-222222222222');
        if (data && data.tour_scenes && data.tour_scenes.length > 0) {
          setTour(data);
          setActiveSceneId(data.start_scene_id || data.tour_scenes[0].id);
        }
      } catch (err) {
        console.warn('Could not load tour scenes for spotlight:', err);
      }
    }
    loadData();
  }, []);

  const currentScene = tour.tour_scenes.find((s) => s.id === activeSceneId) || tour.tour_scenes[0];
  const hasExternalTour = Boolean(property.external_tour_url);

  return (
    <section className="py-16 max-w-7xl mx-auto px-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-gold text-xs font-bold uppercase tracking-widest font-mono mb-2 bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
            <Compass className="w-3.5 h-3.5 animate-pulse" />
            <span>LIVE INTERACTIVE DEMO SPOTLIGHT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-hi">
            Experience Spatial Walkthroughs Live
          </h2>
          <p className="text-text-lo text-sm mt-1 max-w-2xl">
            Interact directly with our verified spherical capture. Pan 360°, explore every angle, and see why physical visits become mere formalities.
          </p>
        </div>

        <Link
          href={`/property/${property.slug}/tour`}
          className="btn-primary text-xs !py-3 !px-5 self-start md:self-auto flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Fullscreen 360° Tour</span>
          <Maximize2 className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Main Showcase Card */}
      <div className="bg-ink-900 border border-line rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Top Bar Navigation / Metadata */}
        <div className="bg-ink-950/90 backdrop-blur-xl border-b border-line px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-white">
              {property.title}
            </span>
            <span className="text-xs font-mono text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-md border border-gold/30">
              ₹{(property.price / 10000000).toFixed(2)} Cr
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-text-lo font-mono">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              <span>{property.bhk} BHK Suite</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>{property.locality || property.city}</span>
            </span>
          </div>
        </div>

        {/* Embedded 360° Surface */}
        <div className="relative h-[520px] w-full bg-slate-950">
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
              onSceneChange={(sceneId) => {
                setActiveSceneId(sceneId);
                setBearing((prev) => (prev + 90) % 360);
              }}
            />
          )}

          {/* Bottom HUD Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
            <div className="pointer-events-auto flex items-center space-x-2">
              <span className="badge-tour-verified text-xs">
                <Compass className="w-3.5 h-3.5 text-gold" />
                <span>360° VERIFIED BY MAD.CO STUDIO</span>
              </span>
              <span className="hidden sm:inline-flex text-xs text-text-lo bg-ink-950/90 backdrop-blur-md px-3 py-1 rounded-full border border-line">
                📍 {property.address}, {property.city}
              </span>
            </div>

            <div className="pointer-events-auto flex items-center space-x-2">
              <Link
                href={`/property/${property.slug}`}
                className="text-xs font-bold text-gold hover:text-white underline bg-ink-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-gold/30 hover:border-gold transition shadow-md"
              >
                View Property Details &amp; Floorplan →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
