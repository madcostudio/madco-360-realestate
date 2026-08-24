'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Giant horizontal scrolling text marquee that moves with scroll velocity.
 * Features crisp typography with outline / fill options for ultra-high visual impact.
 */
export function ScrollingMarquee({
  text,
  className = '',
  speed = 1,
  direction = 'left',
  outline = false,
}: {
  text: string;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  outline?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Base continuous movement
    const xPercent = direction === 'left' ? -50 : 0;
    const xTo = direction === 'left' ? 0 : -50;

    gsap.set(track, { xPercent });

    // Scroll-driven speed boost
    const tl = gsap.to(track, {
      xPercent: xTo,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2 * speed,
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === wrapper) t.kill();
      });
    };
  }, [text, speed, direction]);

  const repeated = `${text} · ${text} · ${text} · ${text} · `;

  const outlineStyle: React.CSSProperties = outline
    ? {
        WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.45)',
        color: 'transparent',
      }
    : {};

  return (
    <div
      ref={wrapperRef}
      className={`overflow-hidden whitespace-nowrap select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div ref={trackRef} className="inline-block whitespace-nowrap" style={outlineStyle}>
        <span className="inline-block">
          {repeated}
        </span>
        <span className="inline-block">
          {repeated}
        </span>
      </div>
    </div>
  );
}
