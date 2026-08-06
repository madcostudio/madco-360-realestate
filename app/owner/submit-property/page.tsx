'use client';

import { useState } from 'react';
import { submitPropertyAction } from '@/app/actions/submit-property';
import { Building2, Upload, Compass, CheckCircle2, ArrowLeft, Camera, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SubmitPropertyPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [bhk, setBhk] = useState('2');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [locality, setLocality] = useState('');
  const [description, setDescription] = useState('');
  const [externalTourUrl, setExternalTourUrl] = useState('');
  const [requestMadcoCapture, setRequestMadcoCapture] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [panoFile, setPanoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedProperty, setSubmittedProperty] = useState<{ id: string; slug: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('bhk', bhk);
    formData.append('address', address);
    formData.append('city', city);
    formData.append('locality', locality || address.split(',')[0]);
    formData.append('description', description);
    formData.append('externalTourUrl', externalTourUrl);
    formData.append('requestMadcoCapture', requestMadcoCapture ? 'true' : 'false');

    if (coverFile) {
      formData.append('coverFile', coverFile);
    }
    if (panoFile) {
      formData.append('panoFile', panoFile);
    }

    try {
      const result = await submitPropertyAction(formData);
      if (result.success && result.propertyId && result.slug) {
        setSubmittedProperty({ id: result.propertyId, slug: result.slug });
      } else {
        setErrorMsg(result.error || 'Failed to submit property. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected connection error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 max-w-3xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="p-2.5 rounded-xl bg-estate-card border border-estate-border text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="text-xs uppercase tracking-wider text-brass font-bold">Owner Portal</span>
          <h1 className="text-3xl font-serif font-bold text-white">Submit New Property Listing</h1>
        </div>
      </div>

      <div className="bg-estate-card border border-estate-border rounded-3xl p-6 sm:p-8 shadow-2xl">
        {submittedProperty ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-fern mx-auto animate-bounce" />
            <h2 className="text-2xl font-serif font-bold text-white">Property Submitted to Database!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your property listing has been recorded in the database with status <span className="font-mono text-brass font-bold">pending review</span>.
              {requestMadcoCapture && ' Our Mad.co 360° Capture team will contact you to schedule your photoshoot.'}
            </p>
            <div className="pt-2 text-xs font-mono text-slate-400">
              Reference ID: <span className="text-white">{submittedProperty.id}</span>
            </div>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-sm transition"
              >
                Return to Dashboard
              </Link>
              <button
                onClick={() => {
                  setSubmittedProperty(null);
                  setTitle('');
                  setPrice('');
                  setAddress('');
                  setDescription('');
                  setCoverFile(null);
                  setPanoFile(null);
                }}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold text-sm transition"
              >
                Submit Another Listing
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Property Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Luxury 3BHK Penthouse in Worli"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Price (₹ INR)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 25000000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bedrooms (BHK)</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                >
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK Villa</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 45 Marine Drive, Bandra"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, Mangalore, Bengaluru"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Locality / Neighborhood</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                placeholder="e.g. Bandra West, Kadri, Indiranagar"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Property Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight key luxury specs, flooring, sea view, fittings, and amenities..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">360° Tour Link</label>
              <input
                type="url"
                value={externalTourUrl}
                onChange={(e) => setExternalTourUrl(e.target.value)}
                placeholder="https://pano.cool/@your-handle/project-id or Kuula / Matterport link"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass font-mono text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Paste the shareable/embed link to this property&apos;s 360° tour (Panocool, Kuula, Matterport, etc.). Leave blank if you&apos;re building the tour with panoramas instead.
              </p>
            </div>

            {/* Media Uploads Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
              {/* Cover Image Upload */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <ImageIcon className="w-4 h-4 text-brass" />
                  <span>Cover Photo (Property Media Bucket)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brass/20 file:text-brass hover:file:bg-brass/30 cursor-pointer"
                />
                {coverFile && (
                  <p className="text-[11px] text-brass font-mono">Selected: {coverFile.name} ({(coverFile.size / 1024).toFixed(1)} KB)</p>
                )}
              </div>

              {/* Optional 360 Panorama Raw Capture Upload */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-brass" />
                  <span>360° Equirectangular Panorama (Optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPanoFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brass/20 file:text-brass hover:file:bg-brass/30 cursor-pointer"
                />
                {panoFile && (
                  <p className="text-[11px] text-brass font-mono">Selected: {panoFile.name} ({(panoFile.size / 1024).toFixed(1)} KB)</p>
                )}
              </div>
            </div>

            {/* Mad.co Capture Visit Option */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestMadcoCapture}
                  onChange={(e) => setRequestMadcoCapture(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-brass focus:ring-brass"
                />
                <div>
                  <span className="font-bold text-sm text-white block">
                    Book a Mad.co 360° Professional Capture Visit
                  </span>
                  <span className="text-xs text-slate-400">
                    Our field capture team will visit your property with 8K HDR equirectangular camera rigs to produce the full multi-room walkthrough.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brass via-brass-dark to-brass text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 transition hover:scale-[1.01] flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading Assets & Submitting Listing...</span>
                </>
              ) : (
                <span>Submit Property Listing for Review</span>
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

