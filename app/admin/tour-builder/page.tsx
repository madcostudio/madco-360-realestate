import Link from 'next/link';
import { DEMO_PROPERTY, DEMO_TOUR } from '@/lib/mock-data';
import { Compass, Plus, Sparkles, ArrowRight } from 'lucide-react';

export default function AdminTourBuilderDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-brass text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Madco Estates Admin Control</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">360° Virtual Tour Builder</h1>
          <p className="text-slate-400 text-sm mt-1">
            Create, edit, and visually link high-resolution equirectangular walkthroughs for property listings.
          </p>
        </div>

        <Link
          href={`/admin/tour-builder/${DEMO_TOUR.id}`}
          className="px-6 py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold flex items-center space-x-2 shadow-lg shadow-brass/20 transition"
        >
          <Plus className="w-5 h-5" />
          <span>Launch Tour Builder</span>
        </Link>
      </div>

      {/* Property Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-estate-card border border-estate-border rounded-3xl p-6 shadow-2xl space-y-4 hover:border-brass/40 transition group">
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-fern/20 text-fern border border-fern/40 uppercase tracking-wider">
              {DEMO_TOUR.status}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {DEMO_TOUR.tour_scenes.length} Scenes Configured
            </span>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-white group-hover:text-brass transition">
              {DEMO_PROPERTY.title}
            </h2>
            <p className="text-slate-400 text-xs mt-1">{DEMO_PROPERTY.address}</p>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <div className="text-xs text-slate-300 font-mono">
              Tour ID: {DEMO_TOUR.id.slice(0, 8)}...
            </div>

            <Link
              href={`/admin/tour-builder/${DEMO_TOUR.id}`}
              className="inline-flex items-center space-x-2 text-xs font-bold text-brass hover:underline"
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
