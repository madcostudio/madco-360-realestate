'use client';

interface EstatesLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

/**
 * Dedicated Brand Logo for estates.madco.in
 * Clean, modern typographic branding lockup.
 */
export function EstatesLogo({
  className = '',
  variant = 'auto',
  showSubtitle = true,
}: EstatesLogoProps) {
  return (
    <div className={`flex flex-col text-left leading-none group select-none ${className}`}>
      <div className="flex items-center gap-2">
        <span className="font-display font-black text-lg sm:text-xl md:text-2xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
          MADCO
        </span>
        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent px-2 py-0.5 rounded-md bg-sky-400/10 border border-sky-400/25 shadow-sm shadow-sky-500/10">
          ESTATES
        </span>
      </div>
      {showSubtitle && (
        <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors mt-1">
          estates.madco.in · 360° SPATIAL
        </span>
      )}
    </div>
  );
}
