import { ShieldCheck, Compass, Camera } from 'lucide-react';

export function DifferenceSection() {
  return (
    <section className="py-16 border-t border-b border-line bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-xs uppercase tracking-widest text-text-lo font-mono mb-6">
          // THE DIFFERENCE
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-line">
          <div className="pt-4 md:pt-0 md:pr-6 space-y-2">
            <div className="flex items-center space-x-2 text-brass text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-brass" />
              <span className="text-text-hi">100% Verified Listings</span>
            </div>
            <p className="text-text-lo text-xs leading-relaxed">
              Every property on this platform is captured in person and verified by Mad.co. No fake pictures. No surprises at the site visit.
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:px-6 space-y-2">
            <div className="flex items-center space-x-2 text-brass text-sm font-bold">
              <Compass className="w-4 h-4 text-brass" />
              <span className="text-text-hi">Room-to-Room 360° Tours</span>
            </div>
            <p className="text-text-lo text-xs leading-relaxed">
              Walk through living rooms, kitchens, and master suites with full spherical freedom before booking an in-person visit.
            </p>
          </div>

          <div className="pt-4 md:pt-0 md:pl-6 space-y-2">
            <div className="flex items-center space-x-2 text-brass text-sm font-bold">
              <Camera className="w-4 h-4 text-brass" />
              <span className="text-text-hi">Shot Professionally In-Person</span>
            </div>
            <p className="text-text-lo text-xs leading-relaxed">
              Captured using high-dynamic-range equirectangular hardware. No fisheye phone distortion. Pure architectural clarity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
