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
    <main className="min-h-screen bg-ink-950 text-text-hi flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-ink-900 border border-line p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-bold text-text-hi">Something Went Wrong</h1>
          <p className="text-text-lo text-xs leading-relaxed">
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
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ink-950 border border-line hover:border-brass text-text-lo hover:text-text-hi text-xs font-semibold transition flex items-center justify-center space-x-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
