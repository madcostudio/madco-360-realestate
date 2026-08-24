'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Animation preset */
  variant?: 'fade-up' | 'fade-scale' | 'slide-left' | 'slide-right' | 'blur-in';
  /** Stagger delay if multiple direct children */
  stagger?: number;
  /** Extra delay before animation starts */
  delay?: number;
}

/**
 * Wraps children in a GSAP ScrollTrigger reveal animation.
 * Dramatically animates elements into view as they scroll.
 */
export function ScrollReveal({
  children,
  className = '',
  variant = 'fade-up',
  stagger = 0.12,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Determine initial state based on variant
    const targets = el.children.length > 1 ? el.children : el;

    const fromVars: gsap.TweenVars = { opacity: 0 };
    const toVars: gsap.TweenVars = {
      opacity: 1,
      duration: 1,
      delay,
      ease: 'power3.out',
      stagger: el.children.length > 1 ? stagger : 0,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        end: 'top 30%',
        toggleActions: 'play none none none',
      },
    };

    switch (variant) {
      case 'fade-up':
        Object.assign(fromVars, { y: 60 });
        Object.assign(toVars, { y: 0 });
        break;
      case 'fade-scale':
        Object.assign(fromVars, { scale: 0.9, y: 40 });
        Object.assign(toVars, { scale: 1, y: 0 });
        break;
      case 'slide-left':
        Object.assign(fromVars, { x: -80 });
        Object.assign(toVars, { x: 0 });
        break;
      case 'slide-right':
        Object.assign(fromVars, { x: 80 });
        Object.assign(toVars, { x: 0 });
        break;
      case 'blur-in':
        Object.assign(fromVars, { y: 40, filter: 'blur(12px)' });
        Object.assign(toVars, { y: 0, filter: 'blur(0px)' });
        break;
    }

    gsap.fromTo(targets, fromVars, toVars);

    return () => {
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

/**
 * Horizontal parallax effect on scroll — elements drift at different rates.
 */
export function ScrollParallax({
  children,
  className = '',
  speed = 50,
  direction = 'up',
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const dist = direction === 'up' || direction === 'left' ? -speed : speed;

    gsap.to(el, {
      [axis]: dist,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [speed, direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
