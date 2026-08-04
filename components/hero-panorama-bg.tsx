'use client';

import { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import { Compass } from 'lucide-react';

interface HeroPanoramaBgProps {
  panoUrl?: string;
  sceneName?: string;
  locationName?: string;
}

export function HeroPanoramaBg({
  panoUrl = '/demo-panoramas/living-room.jpg',
  sceneName = 'Grand Living Room',
  locationName = 'Bandra West, Mumbai',
}: HeroPanoramaBgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [bearing, setBearing] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Reduced motion & low speed connection check
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSlowConnection =
      typeof navigator !== 'undefined' &&
      'connection' in navigator &&
      ((navigator as any).connection?.effectiveType === '2g' ||
        (navigator as any).connection?.saveData);

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: panoUrl,
      defaultYaw: 0,
      defaultPitch: 0,
      defaultZoomLvl: 0,
      navbar: false,
      ...(!prefersReducedMotion && !isSlowConnection
        ? ({ autorotateSpeed: '0.3rpm', autorotateDelay: 0, autorotateIdle: true } as any)
        : {}),
    });

    viewerRef.current = viewer;

    viewer.addEventListener('position-updated', ({ position }: any) => {
      if (position.yaw !== undefined) {
        // Convert yaw radians to degrees 0-360
        const degrees = Math.round(((position.yaw % (2 * Math.PI)) * 180) / Math.PI);
        const normalized = (degrees + 360) % 360;
        setBearing(normalized);
      }
    });

    return () => {
      viewer.destroy();
    };
  }, [panoUrl]);

  return (
    <div className="absolute inset-0 w-full h-[100svh] overflow-hidden pointer-events-none">
      {/* 360 Sphere Container */}
      <div ref={containerRef} className="w-full h-full bg-ink-950 opacity-50 scale-105" />

      {/* Dark Bottom-up Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />

      {/* Top-Right Glass Compass Chip (Signature Feature) */}
      <div className="absolute top-28 right-6 z-20 pointer-events-auto">
        <div className="bg-glass backdrop-blur-glass border border-line text-text-hi px-4 py-2 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs">
          <Compass className="w-4 h-4 text-brass animate-pulse" />
          <div>
            <span className="text-[10px] text-text-lo block font-mono">You're standing in:</span>
            <span className="font-bold text-text-hi">
              {sceneName} • <span className="text-brass">{bearing}° N</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
