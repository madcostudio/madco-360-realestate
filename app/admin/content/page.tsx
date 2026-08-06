'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, Megaphone, FileText, CheckCircle2, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { saveSiteContentAction, getSiteContentAction } from '@/app/actions/site-content';

export default function AdminContentEditorPage() {
  const [announcement, setAnnouncement] = useState('⚡ 360° Walkthrough Guarantee — Every listing room-to-room spatial scanned in HD.');
  const [heroHeading, setHeroHeading] = useState('Walk through your next home before you ever step inside it.');
  const [heroSubcopy, setHeroSubcopy] = useState('Explore 100% verified luxury apartments, villas, and independent homes with spherical room-to-room 360° virtual walkthroughs.');
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
            Configure dynamic promotional top banners, hero copy, and editorial highlights stored in live Supabase Postgres.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {saved && (
          <div className="p-4 bg-fern/20 border border-fern/40 text-fern rounded-2xl flex items-center space-x-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Site content configuration saved to Supabase successfully!</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl flex items-center space-x-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-brass" />
            <p className="text-xs">Fetching current site content from Supabase...</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Megaphone className="w-4 h-4 text-brass" />
                <span>Global Top Announcement Banner</span>
              </label>
              <input
                type="text"
                required
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
                required
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
                required
                value={heroSubcopy}
                onChange={(e) => setHeroSubcopy(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brass"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-xs shadow-lg shadow-brass/20 transition flex items-center space-x-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Saving to Supabase...' : 'Save Changes'}</span>
              </button>
            </div>
          </>
        )}
      </form>
    </main>
  );
}
