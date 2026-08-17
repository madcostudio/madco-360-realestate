'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Compass } from 'lucide-react';

interface AnimatedHeroContentProps {
  heroHeading: string;
  heroSubcopy: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function AnimatedHeroContent({ heroHeading, heroSubcopy }: AnimatedHeroContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
    >
      {/* Gold Pill Badge */}
      <motion.div variants={itemVariants} className="inline-flex flex-wrap justify-center text-center items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-[9px] sm:text-xs font-bold font-mono uppercase tracking-wider max-w-[90vw] mx-auto">
        <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
        <span className="break-words text-center">MAD.CO ESTATES • 360° VERIFIED REAL ESTATE MARKETPLACE</span>
      </motion.div>

      {/* Solid Color Headline */}
      <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-text-hi tracking-tight leading-[1.08] px-2 sm:px-0">
        {heroHeading}
      </motion.h1>

      {/* Sub-copy */}
      <motion.p variants={itemVariants} className="text-text-lo text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
        {heroSubcopy}
      </motion.p>

      {/* Dual Action CTA Buttons (Purple Primary + Gold Outline) */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          href="/search"
          className="btn-primary text-sm !py-3.5 !px-8 shadow-xl shadow-primary/25 w-full sm:w-auto hover:scale-105 transition-transform duration-300"
        >
          <span>Explore 360° Listings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/owner/submit-property"
          className="btn-outline-gold text-sm !py-3.5 !px-7 w-full sm:w-auto hover:scale-105 transition-transform duration-300"
        >
          <span>Shoot My Property in 360°</span>
        </Link>
      </motion.div>

      {/* Trust Highlights Strip */}
      <motion.div variants={itemVariants} className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-text-lo font-mono">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>100% Verified Listings</span>
        </div>
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-primary" />
          <span>Spherical 360° Walkthroughs</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Zero Fake Photos</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
