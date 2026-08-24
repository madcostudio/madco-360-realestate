import Link from 'next/link';
import { Compass, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FBFBF9] text-slate-900 flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6 bg-white border border-slate-200 p-8 rounded-3xl shadow-luxury-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto shadow-2xs">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono text-amber-800 font-bold tracking-widest">404 — Page Not Found</span>
          <h1 className="text-3xl font-serif font-bold text-slate-900">
            This home isn&apos;t on the market.
          </h1>
          <p className="text-slate-600 text-sm">
            The page or property listing you are looking for may have been sold, unlisted, or moved. Let&apos;s find you one that is available.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto btn-primary text-xs shadow-none">
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-600 text-slate-700 hover:text-slate-900 text-xs font-semibold transition flex items-center justify-center space-x-1.5 shadow-2xs"
          >
            <Search className="w-4 h-4" />
            <span>Search Properties</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
