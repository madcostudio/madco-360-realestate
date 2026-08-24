'use client';

import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function HowItWorksSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 space-y-10 border-b border-sky-200/50">
      <div className="text-xs uppercase tracking-widest text-sky-700 font-mono font-bold">
        // HOW IT WORKS
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Buyers Column */}
        <div className="space-y-8 spotlight-card rounded-3xl p-8 shadow-luxury-md">
          <motion.h3 variants={itemVariants} className="font-serif font-bold text-2xl text-slate-900 border-b border-slate-100 pb-4">
            For Home Buyers &amp; Tenants
          </motion.h3>
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex space-x-4 border-b border-slate-100 pb-6 hover:translate-x-1.5 transition-transform duration-200">
              <span className="font-mono font-bold text-xl text-sky-600">01</span>
              <div>
                <h4 className="font-bold text-base text-slate-900 mb-1">Search &amp; Filter by Location</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Choose your target city or use current GPS coordinates to view verified homes within your preferred radius.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 border-b border-slate-100 pb-6 hover:translate-x-1.5 transition-transform duration-200">
              <span className="font-mono font-bold text-xl text-sky-600">02</span>
              <div>
                <h4 className="font-bold text-base text-slate-900 mb-1">Step Inside 360° Walkthroughs</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Experience room-to-room virtual tours, inspect high-definition materials, and check accurate spatial layouts.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 hover:translate-x-1.5 transition-transform duration-200">
              <span className="font-mono font-bold text-xl text-sky-600">03</span>
              <div>
                <h4 className="font-bold text-base text-slate-900 mb-1">Contact Seller Directly</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Send enquiries directly from inside the tour to schedule private in-person site visits.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Owners Column */}
        <div className="space-y-8 spotlight-card rounded-3xl p-8 shadow-luxury-md">
          <motion.h3 variants={itemVariants} className="font-serif font-bold text-2xl text-slate-900 border-b border-slate-100 pb-4">
            For Property Owners &amp; Listers
          </motion.h3>
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="flex space-x-4 border-b border-slate-100 pb-6 hover:translate-x-1.5 transition-transform duration-200">
              <span className="font-mono font-bold text-xl text-sky-600">01</span>
              <div>
                <h4 className="font-bold text-base text-slate-900 mb-1">Submit Property Details</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Provide property specs, pricing, and address in under 2 minutes.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 border-b border-slate-100 pb-6 hover:translate-x-1.5 transition-transform duration-200">
              <span className="font-mono font-bold text-xl text-sky-600">02</span>
              <div>
                <h4 className="font-bold text-base text-slate-900 mb-1">Book Mad.co 360° Capture Visit</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Our professional media team visits your property with HDR equirectangular hardware to shoot 360° panoramas.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex space-x-4 hover:translate-x-1.5 transition-transform duration-200">
              <span className="font-mono font-bold text-xl text-sky-600">03</span>
              <div>
                <h4 className="font-bold text-base text-slate-900 mb-1">Receive Qualified Leads</h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Your listing goes live with an interactive 360° walkthrough, attracting serious buyers who have already explored every room.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
