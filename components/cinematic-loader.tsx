'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CinematicLoader() {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isCompletelyDone, setIsCompletelyDone] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    // Check sessionStorage — only play once per session
    try {
      if (sessionStorage.getItem('madco:loader-played') === '1') {
        setIsCompletelyDone(true);
        setHasPlayed(true);
        return;
      }
    } catch {}

    const duration = 2000; // 2.0s loader count
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const pct = Math.min(elapsed / duration, 1);
      // Eased progress (cubic ease-out)
      const eased = 1 - Math.pow(1 - pct, 3);
      setProgress(Math.round(eased * 100));

      if (pct < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Counter reached 100% — initiate smooth exit transition
        setTimeout(() => {
          setIsFinished(true);
          try {
            sessionStorage.setItem('madco:loader-played', '1');
          } catch {}
          // Remove from DOM after curtain reveal animation completes (1.1s)
          setTimeout(() => {
            setIsCompletelyDone(true);
          }, 1100);
        }, 300);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (hasPlayed || isCompletelyDone) return null;

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden select-none">
      <AnimatePresence>
        {!isFinished && (
          /* Center Content: Brand mark, counter, and progress line */
          <motion.div
            key="loader-content"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24, filter: 'blur(10px)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-8"
          >
            {/* Brand mark */}
            <motion.div
              initial={{ scale: 1.2, filter: 'blur(16px)', opacity: 0 }}
              animate={{
                scale: 1,
                filter: 'blur(0px)',
                opacity: 1,
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-white font-display font-bold text-3xl sm:text-4xl tracking-tight text-center"
            >
              <span className="bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-transparent">
                MADCO
              </span>
              <span className="text-sky-400/80 ml-2 text-sm sm:text-base font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-md bg-sky-400/10 border border-sky-400/25">
                ESTATES
              </span>
            </motion.div>

            {/* Progress counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="font-mono text-5xl sm:text-7xl tabular-nums text-white/40 font-light tracking-widest drop-shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              {String(progress).padStart(3, '0')}
            </motion.div>

            {/* Progress line */}
            <div className="w-52 sm:w-64 h-[1.5px] bg-white/10 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 shadow-glow-cyan"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dual Split Curtain Shutter Panels (Smooth vertical luxury wipe) ── */}
      <motion.div
        initial={{ y: '0%' }}
        animate={isFinished ? { y: '-100%' } : { y: '0%' }}
        transition={{ duration: 0.85, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-[#060608] z-10 border-b border-sky-500/20"
      />
      <motion.div
        initial={{ y: '0%' }}
        animate={isFinished ? { y: '100%' } : { y: '0%' }}
        transition={{ duration: 0.85, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#060608] z-10 border-t border-sky-500/20"
      />
    </div>
  );
}
