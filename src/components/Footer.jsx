import React from 'react';
import { MADCO_AGENCY_URL, MADCO_WHATSAPP_URL } from '../utils/url';
import { MessageSquare, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-white font-extrabold text-lg">Mad.co 360° Real Estate</span>
          <span className="text-slate-600">•</span>
          <span className="text-amber-400 text-xs font-bold">Mangalore, KA</span>
          <span className="text-slate-600">•</span>
          {/* Explicit agency backlink */}
          <a
            href={MADCO_AGENCY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 text-xs font-bold inline-flex items-center gap-1 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30 transition"
          >
            <span>A Mad.co Studio product</span>
            <ExternalLink className="w-3 h-3 text-indigo-400" />
          </a>
        </div>

        <p className="text-slate-400 text-xs max-w-lg mx-auto leading-relaxed">
          "Walk through your next home before you ever step inside it." Spatial 360° virtual walkthroughs professionally shot, stitched, and verified by Mad.co Studio (<a href={MADCO_AGENCY_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-400 underline">madco.in</a>).
        </p>

        <div className="flex items-center justify-center gap-4 text-xs">
          <a
            href={MADCO_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Chat on WhatsApp (+91 87626 40420)</span>
          </a>
        </div>

        <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-900/80">
          © 2026 Mad.co Spatial Marketing Studio. All rights reserved. Curated for Mangalore, Karnataka.
        </p>
      </div>
    </footer>
  );
}
