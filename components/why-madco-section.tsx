'use client';

import { ShieldCheck, Compass, Camera, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function WhyMadcoSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 space-y-10 border-b border-sky-200/50">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 text-sky-900 text-xs font-bold uppercase tracking-widest font-mono bg-sky-100/90 px-3.5 py-1 rounded-full border border-sky-200/80 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>// WHY MAD.CO 360° WINS OVER GENERIC PORTALS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
          The Trust Standard in Real Estate
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Generic portals allow unverified listings, recycled photos, and misleading wide-angle tricks. Mad.co verifies and scans every property in person.
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div variants={cardVariants} className="spotlight-card rounded-3xl p-8 space-y-4 shadow-luxury-md hover:shadow-luxury-hover">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200 shadow-2xs">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900">100% In-Person Verified</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Every single property on our platform is inspected and photographed by the Mad.co media team. Zero spam, zero fake photos.
          </p>
          <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Physical site inspection by studio team</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Ownership & title documentation check</span>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={cardVariants} className="spotlight-card rounded-3xl p-8 space-y-4 shadow-luxury-md hover:shadow-luxury-hover">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center border border-indigo-200 shadow-2xs">
            <Compass className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900">Room-to-Room 360° Walkthroughs</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Walk freely through living rooms, kitchens, balconies, and bedrooms before traveling for a physical site inspection.
          </p>
          <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Spherical field-of-view in every room</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Accurate room proportions and spatial flow</span>
            </li>
          </ul>
        </motion.div>

        <motion.div variants={cardVariants} className="spotlight-card rounded-3xl p-8 space-y-4 shadow-luxury-md hover:shadow-luxury-hover">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200 shadow-2xs">
            <Camera className="w-6 h-6 text-amber-700" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900">Professional Architectural Capture</h3>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            High dynamic range capture preserves realistic lighting and views. No fish-eye phone distortion or edited fake views.
          </p>
          <ul className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Equirectangular HDR color accuracy</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Direct WhatsApp & phone connect</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
}
