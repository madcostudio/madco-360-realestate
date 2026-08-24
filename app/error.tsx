'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error caught:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#FBFBF9] text-slate-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-luxury-md space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto shadow-2xs">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-slate-900">Something Went Wrong</h1>
          <p className="text-slate-600 text-xs leading-relaxed">
            An unexpected error occurred while loading this view. Please try reloading or return to the homepage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto btn-primary text-xs shadow-none"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 text-slate-700 hover:text-slate-900 text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-2xs"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
