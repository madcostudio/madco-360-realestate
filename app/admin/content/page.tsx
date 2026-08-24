'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Megaphone, FileText, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { saveSiteContentAction, getSiteContentAction } from '@/app/actions/site-content';

export default function AdminContentEditorPage() {
  const [announcement, setAnnouncement] = useState('⚡ 360° Walkthrough Guarantee — Every listing room-to-room spatial scanned in HD.');
  const [heroHeading, setHeroHeading] = useState('Walk through your next home before you ever step inside.');
  const [heroSubcopy, setHeroSubcopy] = useState('Explore 100% verified luxury apartments, villas, and independent homes with spherical room-to-room 360° virtual walkthroughs shot in-person by Mad.co Studio.');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        const ann = await getSiteContentAction('announcement_banner');
        if (ann && ann.text) setAnnouncement(ann.text);

        const hero = await getSiteContentAction('hero_section');
        if (hero) {
          if (hero.heading) setHeroHeading(hero.heading);
          if (hero.subcopy) setHeroSubcopy(hero.subcopy);
        }
      } catch (err) {
        console.error('Error loading site content:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res1 = await saveSiteContentAction('announcement_banner', { enabled: true, text: announcement });
      const res2 = await saveSiteContentAction('hero_section', { heading: heroHeading, subcopy: heroSubcopy });

      if (res1.success && res2.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 4000);
      } else {
        setError(res1.error || res2.error || 'Failed to save site content to Supabase.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error saving site content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#060608] text-slate-100 p-4 sm:p-8 lg:p-12 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs text-sky-400 hover:text-sky-300 font-mono mb-2 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Staff Dashboard</span>
          </Link>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-mono font-bold uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>ESTATES.MADCO.IN • CONTENT MANAGEMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Homepage &amp; Announcement Editor
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Configure dynamic promotional top banners, hero copy, and editorial highlights stored in live Supabase Postgres.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900/70 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {saved && (
          <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center space-x-2.5 text-xs font-bold font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Site content configuration saved to Supabase successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-400 rounded-2xl flex items-center space-x-2.5 text-xs font-bold font-mono">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
            <span className="text-xs font-mono">Loading current database copy...</span>
          </div>
        ) : (
          <>
            {/* Top Announcement Banner */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
                <Megaphone className="w-4 h-4 text-sky-400" />
                <span>Top Ticker / Announcement Banner</span>
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. ⚡ 360° Walkthrough Guarantee — Every listing room-to-room spatial scanned in HD."
                className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-400 font-mono transition"
              />
              <p className="text-[11px] text-slate-400">
                Displayed in the glowing header banner on all pages. Leave empty to hide banner.
              </p>
            </div>

            <div className="border-t border-white/[0.08] my-6" />

            {/* Hero Main Heading */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Hero Main Heading</span>
              </label>
              <input
                type="text"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                placeholder="Walk through your next home before you ever step inside."
                className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-sky-400 transition"
              />
            </div>

            {/* Hero Subcopy */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Hero Sub-copy / Description</span>
              </label>
              <textarea
                rows={3}
                value={heroSubcopy}
                onChange={(e) => setHeroSubcopy(e.target.value)}
                placeholder="Explore 100% verified luxury apartments, villas, and independent homes with spherical room-to-room 360° virtual walkthroughs shot in-person by Mad.co Studio."
                className="w-full bg-black/50 border border-white/15 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-sky-400 resize-none transition"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn-hero-accent text-xs !py-3 !px-8 shadow-glow-cyan flex items-center space-x-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Supabase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Site Content</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </form>
    </main>
  );
}
