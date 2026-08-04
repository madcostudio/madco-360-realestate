'use client';

import { useState } from 'react';
import { getCurrentAuth } from '@/lib/auth';
import { Building2, Upload, Compass, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SubmitPropertyPage() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [bhk, setBhk] = useState('2');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [description, setDescription] = useState('');
  const [requestMadcoCapture, setRequestMadcoCapture] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
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
        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-fern mx-auto animate-bounce" />
            <h2 className="text-2xl font-serif font-bold text-white">Property Submitted for Admin Review!</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your property listing has been created in pending review state.
              {requestMadcoCapture && ' Our Mad.co 360° Capture team will contact you to confirm shoot details.'}
            </p>
            <div className="pt-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-sm transition"
              >
                Return to Owner Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="e.g. 45 Marine Drive"
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
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Property Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight key luxury specs, flooring, view, and features..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
              />
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
                    Our team will visit your property with HDR equirectangular camera gear to build your 360° virtual walkthrough.
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brass via-brass-dark to-brass text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 transition hover:scale-[1.01]"
            >
              {loading ? 'Submitting Property...' : 'Submit Property for Verification'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
