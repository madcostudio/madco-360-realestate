import Link from 'next/link';
import { Compass, Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-ink-950 text-text-hi flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brass-soft border border-brass/30 text-brass flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase font-mono text-brass font-bold tracking-widest">404 — Page Not Found</span>
          <h1 className="text-3xl font-serif font-bold text-text-hi">
            This home isn't on the market.
          </h1>
          <p className="text-text-lo text-sm">
            The page or property listing you are looking for may have been sold, unlisted, or moved. Let's find you one that is available.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto btn-primary text-xs shadow-none">
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/search"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ink-900 border border-line hover:border-brass text-text-lo hover:text-text-hi text-xs font-semibold transition flex items-center justify-center space-x-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Search Properties</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
