'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export function ThreeRenderedBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const smoothScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // Parallax transforms based on scroll with high opacity
  const exteriorOpacity = useTransform(smoothScroll, [0, 0.45, 0.75], [0.92, 0.65, 0.2]);
  const interiorOpacity = useTransform(smoothScroll, [0.25, 0.6, 1], [0.15, 0.85, 0.95]);
  const scale = useTransform(smoothScroll, [0, 1], [1.02, 1.15]);
  const translateY = useTransform(smoothScroll, [0, 1], ['0%', '-12%']);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized from -1 to 1
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      {/* 3D Architectural Exterior Tower Render Layer - High Visibility */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: exteriorOpacity,
          scale,
          y: translateY,
          x: mousePos.x * -22,
          translateY: mousePos.y * -16,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Image
          src="/renders/tower-hero.jpg"
          alt="3D Architectural Render Tower"
          fill
          priority
          className="object-cover object-center filter saturate-[1.15] contrast-[1.05]"
        />
      </motion.div>

      {/* 3D Architectural Penthouse Interior Render Layer - High Visibility */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: interiorOpacity,
          scale,
          y: translateY,
          x: mousePos.x * -26,
          translateY: mousePos.y * -20,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Image
          src="/renders/penthouse-interior.jpg"
          alt="3D Architectural Penthouse Interior Render"
          fill
          className="object-cover object-center filter saturate-[1.15] contrast-[1.05]"
        />
      </motion.div>

      {/* Dark Atmospheric Scrim with Reduced Opacity so 3D Render is Vividly Seen */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/20 to-slate-950/50" />

      {/* Dynamic Cursor Light Spotlight */}
      <div
        className="absolute inset-0 opacity-60 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at calc(50% + ${mousePos.x * 25}%) calc(50% + ${mousePos.y * 25}%), rgba(14, 165, 233, 0.2), rgba(99, 102, 241, 0.08) 50%, transparent 80%)`,
        }}
      />

      {/* Fine Architectural Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
}
