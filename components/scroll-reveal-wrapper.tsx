'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: 'fade-up' | 'fade-scale' | 'slide-left' | 'slide-right' | 'blur-in';
  stagger?: number;
  delay?: number;
}

/**
 * Client-side scroll reveal wrapper using GSAP ScrollTrigger.
 * Dramatically animates child content into view on scroll.
 */
export function ScrollRevealWrapper({
  children,
  className = '',
  variant = 'fade-up',
  stagger = 0.12,
  delay = 0,
}: ScrollRevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: 1.2,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    };

    switch (variant) {
      case 'fade-up':
        Object.assign(fromVars, { y: 80 });
        Object.assign(toVars, { y: 0 });
        break;
      case 'fade-scale':
        Object.assign(fromVars, { scale: 0.88, y: 50 });
        Object.assign(toVars, { scale: 1, y: 0 });
        break;
      case 'slide-left':
        Object.assign(fromVars, { x: -100 });
        Object.assign(toVars, { x: 0 });
        break;
      case 'slide-right':
        Object.assign(fromVars, { x: 100 });
        Object.assign(toVars, { x: 0 });
        break;
      case 'blur-in':
        Object.assign(fromVars, { y: 60, filter: 'blur(16px)' });
        Object.assign(toVars, { y: 0, filter: 'blur(0px)' });
        break;
    }

    const tween = gsap.fromTo(el, fromVars, toVars);

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [variant, stagger, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
