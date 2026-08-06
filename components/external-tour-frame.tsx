'use client';

import { useState, useEffect, useRef } from 'react';
import { Compass, ExternalLink, Loader2, RefreshCw, AlertCircle } from 'lucide-react';

interface ExternalTourFrameProps {
  src: string;
  title?: string;
  className?: string;
  isFullscreen?: boolean;
}

// Known hosts that strictly prohibit framing via X-Frame-Options: SAMEORIGIN / DENY
const KNOWN_BLOCKING_HOSTS = [
  'google.com',
  'www.google.com',
  'maps.google.com',
  'facebook.com',
  'twitter.com',
  'x.com',
  'github.com',
  'instagram.com',
];

function isKnownBlockingHost(url: string): boolean {
  try {
    const parsed = new URL(url);
    return KNOWN_BLOCKING_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
  } catch {
    return false;
  }
}

export function ExternalTourFrame({
  src,
  title = '360° Virtual Tour',
  className = 'w-full h-full',
  isFullscreen = false,
}: ExternalTourFrameProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBlocked, setIsBlocked] = useState<boolean>(() => isKnownBlockingHost(src));
  const [loadAttempts, setLoadAttempts] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If it's a known blocking host, immediately mark as blocked
    if (isKnownBlockingHost(src)) {
      setIsBlocked(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsBlocked(false);

    // 8-second timeout detection
    timeoutRef.current = setTimeout(() => {
      // If still not marked loaded after 8 seconds, transition to fallback panel
      setIsBlocked(true);
      setIsLoading(false);
    }, 8000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [src, loadAttempts]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Successful load event
    setIsLoading(false);
  };

  const handleIframeError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsBlocked(true);
    setIsLoading(false);
  };

  const handleRetry = () => {
    setIsBlocked(false);
    setIsLoading(true);
    setLoadAttempts((prev) => prev + 1);
  };

  return (
    <div className={`relative bg-slate-950 flex items-center justify-center overflow-hidden ${className}`}>
      {/* 1. Loading Skeleton */}
      {isLoading && !isBlocked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-sm space-y-4 p-6 text-center animate-pulse">
          <div className="relative w-14 h-14 rounded-2xl bg-brass/10 border border-brass/30 flex items-center justify-center shadow-lg shadow-brass/10">
            <Compass className="w-8 h-8 text-brass animate-spin-slow" />
            <Loader2 className="w-5 h-5 text-brass absolute animate-spin" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-serif font-bold text-white tracking-wide">
              Connecting to 360° Walkthrough
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Loading spherical viewports &amp; spatial textures...
            </p>
          </div>
        </div>
      )}

      {/* 2. Embed-Blocked / Timeout Fallback Panel (Existing Luxury Glass Style) */}
      {isBlocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-xl">
          <div className="max-w-md w-full bg-estate-card/90 border border-estate-border/80 rounded-3xl p-8 text-center shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            {/* Ambient gold glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-brass/20 rounded-full blur-2xl pointer-events-none" />

            <div className="w-14 h-14 mx-auto rounded-2xl bg-brass/15 border border-brass/40 flex items-center justify-center text-brass shadow-lg shadow-brass/20">
              <ExternalLink className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                This tour opens in a new window.
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                The virtual tour host requires direct viewing or was unable to load in embedded mode on this device.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brass via-brass-dark to-brass hover:from-brass-hover hover:to-brass text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-lg shadow-brass/25 hover:scale-[1.02]"
              >
                <span>Open 360° Tour</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={handleRetry}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition"
                title="Retry embedding in current page"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. The Iframe itself */}
      {!isBlocked && (
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking; fullscreen"
          loading="lazy"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}
    </div>
  );
}
