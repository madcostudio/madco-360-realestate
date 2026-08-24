import Link from 'next/link';
import { DEMO_PROPERTY, DEMO_TOUR } from '@/lib/mock-data';
import { Compass, Plus, Sparkles, ArrowRight, Layers, ArrowLeft } from 'lucide-react';

export default function AdminTourBuilderDashboard() {
  return (
    <div className="min-h-screen bg-[#060608] text-slate-100 p-4 sm:p-8 lg:p-12 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs text-sky-400 hover:text-sky-300 font-mono mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Staff Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-widest mb-1.5">
            <Compass className="w-4 h-4 text-sky-400" />
            <span>ESTATES.MADCO.IN • 360° SPATIAL ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            360° Virtual Tour Builder
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Create, edit, and visually link high-resolution equirectangular walkthroughs and interactive hotspot pins.
          </p>
        </div>

        <Link
          href={`/admin/tour-builder/${DEMO_TOUR.id}`}
          className="btn-hero-accent text-xs !py-3 !px-6 flex items-center space-x-2 shadow-glow-cyan relative z-10 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Tour Builder</span>
        </Link>
      </div>

      {/* Property Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 hover:border-sky-400/40 transition group">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
              {DEMO_TOUR.status}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>{DEMO_TOUR.tour_scenes.length} Scenes Configured</span>
            </span>
          </div>

          <div>
            <h2 className="text-xl font-display font-bold text-white group-hover:text-sky-300 transition">
              {DEMO_PROPERTY.title}
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-mono">{DEMO_PROPERTY.address}</p>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
            <div className="text-xs text-slate-500 font-mono">
              Tour ID: {DEMO_TOUR.id.slice(0, 8)}...
            </div>

            <Link
              href={`/admin/tour-builder/${DEMO_TOUR.id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 group-hover:translate-x-0.5 transition"
            >
              <span>Open Visual Hotspot Editor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
