'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * Premium interactive cursor inspired by noth.in:
 * - Outer ambient glow halo with mix-blend-mode: difference
 * - Inner crisp ring that morphs on hover
 * - Magnetic pull toward interactive elements
 * - "Explore" label appears on card hover
 */
export function InteractiveCursor() {
  const [mounted, setMounted] = useState(false);
  const [hoverType, setHoverType] = useState<'none' | 'button' | 'card' | 'link'>('none');
  const [isVisible, setIsVisible] = useState(false);
  const [hoverLabel, setHoverLabel] = useState('');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 22, stiffness: 280, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Slower spring for outer halo (trailing effect)
  const haloConfig = { damping: 30, stiffness: 150, mass: 0.8 };
  const haloX = useSpring(cursorX, haloConfig);
  const haloY = useSpring(cursorY, haloConfig);

  const magneticRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    let finalX = e.clientX;
    let finalY = e.clientY;

    // Magnetic pull: check if near an interactive element
    const target = e.target as HTMLElement;
    const magnetic = target?.closest('[data-magnetic]') || target?.closest('button') || target?.closest('a');

    if (magnetic) {
      const rect = magnetic.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const maxDist = 100;

      if (dist < maxDist) {
        const pull = (1 - dist / maxDist) * 0.3;
        finalX = e.clientX - distX * pull;
        finalY = e.clientY - distY * pull;
        magneticRef.current = { x: centerX, y: centerY, active: true };
      } else {
        magneticRef.current.active = false;
      }
    } else {
      magneticRef.current.active = false;
    }

    cursorX.set(finalX);
    cursorY.set(finalY);
    setIsVisible(true);

    // Update CSS variables for spotlight cards
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
  }, [cursorX, cursorY]);

  useEffect(() => {
    setMounted(true);

    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) { setHoverType('none'); return; }

      if (target.closest('.spotlight-card') || target.closest('[data-cursor="explore"]')) {
        setHoverType('card');
        setHoverLabel('Explore');
      } else if (target.closest('button') || target.getAttribute('role') === 'button') {
        setHoverType('button');
        setHoverLabel('');
      } else if (target.closest('a') || target.closest('input') || target.closest('select')) {
        setHoverType('link');
        setHoverLabel('');
      } else {
        setHoverType('none');
        setHoverLabel('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleElementHover, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove]);

  if (!mounted) return null;

  const isHovered = hoverType !== 'none';
  const isCard = hoverType === 'card';

  const outerSize = isCard ? 90 : isHovered ? 60 : 180;
  const innerSize = isCard ? 80 : isHovered ? 44 : 18;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
      {/* Outer ambient glow halo — trails behind cursor */}
      <motion.div
        className="fixed rounded-full transition-[width,height] duration-300"
        style={{
          x: haloX,
          y: haloY,
          translateX: '-50%',
          translateY: '-50%',
          width: outerSize,
          height: outerSize,
          background: isHovered
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)',
          filter: 'blur(20px)',
          opacity: isVisible ? 1 : 0,
          mixBlendMode: 'screen',
        }}
      />

      {/* Inner crisp cursor ring — with label on card hover */}
      <motion.div
        className="fixed rounded-full flex items-center justify-center transition-[width,height,background-color,border-color] duration-200"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: innerSize,
          height: innerSize,
          backgroundColor: isCard
            ? 'rgba(14, 165, 233, 0.15)'
            : isHovered
            ? 'rgba(14, 165, 233, 0.06)'
            : 'transparent',
          border: isCard
            ? '1px solid rgba(14, 165, 233, 0.4)'
            : `1px solid rgba(148, 163, 184, ${isHovered ? 0.3 : 0.2})`,
          backdropFilter: isCard ? 'blur(8px)' : 'none',
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* "Explore" label on card hover */}
        {isCard && hoverLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="text-[10px] font-bold text-white uppercase tracking-widest whitespace-nowrap"
          >
            {hoverLabel}
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}
