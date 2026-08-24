import { ShieldCheck, Compass, Camera } from 'lucide-react';

export function DifferenceSection() {
  return (
    <section className="py-16 border-t border-b border-sky-200/50 bg-sky-50/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-xs uppercase tracking-widest text-sky-700 font-mono mb-6 font-bold">
          // THE DIFFERENCE
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-sky-200/60">
          <div className="pt-4 md:pt-0 md:pr-6 space-y-2">
            <div className="flex items-center space-x-2 text-sky-700 text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span className="text-slate-900">100% Verified Listings</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Every property on this platform is captured in person and verified by Mad.co. No fake pictures. No surprises at the site visit.
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:px-6 space-y-2">
            <div className="flex items-center space-x-2 text-sky-700 text-sm font-bold">
              <Compass className="w-4 h-4 text-sky-600" />
              <span className="text-slate-900">Room-to-Room 360° Tours</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Walk through living rooms, kitchens, and master suites with full spherical freedom before booking an in-person visit.
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6 space-y-2">
            <div className="flex items-center space-x-2 text-sky-700 text-sm font-bold">
              <Camera className="w-4 h-4 text-sky-600" />
              <span className="text-slate-900">Shot Professionally In-Person</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Captured using high-dynamic-range equirectangular hardware. No fisheye phone distortion. Pure architectural clarity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
