'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Megaphone, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminContentEditorPage() {
  const [announcement, setAnnouncement] = useState('🔥 New 360° LiDAR Scans published weekly across South Mumbai & Bengaluru');
  const [heroHeading, setHeroHeading] = useState('Walk through your next home before you ever step inside it.');
  const [heroSubcopy, setHeroSubcopy] = useState('Explore verified luxury penthouses and architectural residences with high-fidelity spherical 360° virtual walkthroughs.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs text-brass hover:underline mb-2 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Staff Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2 text-brass text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-brass" />
            <span>Madco Estates Content Management</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white">Homepage &amp; Announcement Editor</h1>
          <p className="text-slate-400 text-xs mt-1">
            Configure dynamic promotional top banners, hero copy, and editorial highlights.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {saved && (
          <div className="p-4 bg-fern/20 border border-fern/40 text-fern rounded-2xl flex items-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Site content configuration updated successfully!</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Megaphone className="w-4 h-4 text-brass" />
            <span>Global Top Announcement Banner</span>
          </label>
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brass font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Homepage Hero Headline</span>
          </label>
          <input
            type="text"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brass font-serif"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Hero Supporting Paragraph</span>
          </label>
          <textarea
            rows={3}
            value={heroSubcopy}
            onChange={(e) => setHeroSubcopy(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brass"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-xs shadow-lg shadow-brass/20 transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </main>
  );
}
