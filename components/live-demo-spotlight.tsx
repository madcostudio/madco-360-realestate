'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TourViewer } from './tour-viewer';
import { DEMO_PROPERTY, DEMO_TOUR } from '@/lib/mock-data';
import { Compass, Sparkles, Maximize2, Layers, Eye } from 'lucide-react';

export function LiveDemoSpotlight() {
  const [activeSceneId, setActiveSceneId] = useState<string>(DEMO_TOUR.start_scene_id);
  const [bearing, setBearing] = useState<number>(45);

  const currentScene = DEMO_TOUR.tour_scenes.find((s) => s.id === activeSceneId) || DEMO_TOUR.tour_scenes[0];

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
            Interact directly with our verified spherical capture. Switch rooms, pan 360°, and see why physical visits become mere formalities.
          </p>
        </div>

        <Link
          href={`/property/${DEMO_PROPERTY.slug}/tour`}
          className="btn-primary text-xs !py-3 !px-5 self-start md:self-auto flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Fullscreen 360° Tour</span>
          <Maximize2 className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Main Showcase Card */}
      <div className="bg-ink-900 border border-line rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Room Switcher Navigation Bar */}
        <div className="bg-ink-950/80 backdrop-blur-xl border-b border-line px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-text-lo font-mono mr-2 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-gold" />
              <span>Rooms:</span>
            </span>
            {DEMO_TOUR.tour_scenes.map((scene) => {
              const isActive = scene.id === activeSceneId;
              return (
                <button
                  key={scene.id}
                  onClick={() => setActiveSceneId(scene.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-primary text-white shadow-md shadow-primary/20'
                      : 'bg-ink-900 text-text-lo hover:text-text-hi hover:bg-ink-800 border border-line'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>{scene.name}</span>
                </button>
              );
            })}
          </div>

          {/* Radar Orientation Minimap Pill */}
          <div className="flex items-center space-x-3 bg-ink-950 px-4 py-1.5 rounded-xl border border-line text-xs">
            <div className="relative w-6 h-6 flex items-center justify-center">
              {/* Radar Circle */}
              <div className="w-6 h-6 rounded-full border border-gold/40 bg-gold/5 flex items-center justify-center">
                {/* Radar Cone */}
                <div
                  className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-gold/70 transition-transform duration-300"
                  style={{ transform: `rotate(${bearing}deg)` }}
                />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-text-lo block font-mono">Radar FOV:</span>
              <span className="font-bold text-text-hi">{currentScene.name}</span>
            </div>
          </div>
        </div>

        {/* Embedded 360° Viewer */}
        <div className="relative h-[480px] w-full">
          <TourViewer
            tourData={{
              scenes: DEMO_TOUR.tour_scenes,
              startSceneId: activeSceneId,
              hotspots: DEMO_TOUR.tour_hotspots,
            }}
            fullscreen={false}
            onSceneChange={(sceneId) => {
              setActiveSceneId(sceneId);
              setBearing((prev) => (prev + 90) % 360);
            }}
          />

          {/* Bottom HUD Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto flex items-center space-x-2">
              <span className="badge-tour-verified text-xs">
                <Compass className="w-3.5 h-3.5" />
                <span>360° VERIFIED BY MAD.CO STUDIO</span>
              </span>
              <span className="hidden sm:inline-flex text-xs text-text-lo bg-ink-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-line">
                📍 {DEMO_PROPERTY.address}, {DEMO_PROPERTY.city}
              </span>
            </div>

            <Link
              href={`/property/${DEMO_PROPERTY.slug}`}
              className="pointer-events-auto text-xs font-bold text-gold hover:text-white underline bg-ink-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gold/30 transition"
            >
              View Property Details & Floorplan →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
