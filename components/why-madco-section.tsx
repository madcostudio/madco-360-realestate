import { ShieldCheck, Compass, Camera, Sparkles, CheckCircle2 } from 'lucide-react';

export function WhyMadcoSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 space-y-10 border-b border-line">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 text-gold text-xs font-bold uppercase tracking-widest font-mono bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>// WHY MAD.CO 360° WINS OVER GENERIC PORTALS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-hi">
          The Trust Standard in Real Estate
        </h2>
        <p className="text-text-lo text-sm leading-relaxed">
          Generic portals allow unverified listings, recycled photos, and misleading wide-angle tricks. Mad.co verifies and scans every property in person.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-ink-900 border border-line hover:border-gold/40 rounded-3xl p-8 space-y-4 shadow-xl transition">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-text-hi">100% In-Person Verified</h3>
          <p className="text-text-lo text-xs sm:text-sm leading-relaxed">
            Every single property on our platform is inspected and photographed by the Mad.co media team. Zero spam, zero fake photos.
          </p>
          <ul className="space-y-2 pt-2 border-t border-line text-xs text-text-lo">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Physical site inspection by studio team</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Ownership & title documentation check</span>
            </li>
          </ul>
        </div>

        <div className="bg-ink-900 border border-line hover:border-primary/40 rounded-3xl p-8 space-y-4 shadow-xl transition">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center border border-primary/30">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-text-hi">Room-to-Room 360° Walkthroughs</h3>
          <p className="text-text-lo text-xs sm:text-sm leading-relaxed">
            Walk freely through living rooms, kitchens, balconies, and bedrooms before traveling for a physical site inspection.
          </p>
          <ul className="space-y-2 pt-2 border-t border-line text-xs text-text-lo">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Spherical field-of-view in every room</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Accurate room proportions and spatial flow</span>
            </li>
          </ul>
        </div>

        <div className="bg-ink-900 border border-line hover:border-tour/40 rounded-3xl p-8 space-y-4 shadow-xl transition">
          <div className="w-12 h-12 rounded-2xl bg-tour/15 text-tour flex items-center justify-center border border-tour/30">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-text-hi">Professional Architectural Capture</h3>
          <p className="text-text-lo text-xs sm:text-sm leading-relaxed">
            High dynamic range capture preserves realistic lighting and views. No fish-eye phone distortion or edited fake views.
          </p>
          <ul className="space-y-2 pt-2 border-t border-line text-xs text-text-lo">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-tour shrink-0" />
              <span>Equirectangular HDR color accuracy</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-tour shrink-0" />
              <span>Direct WhatsApp & phone connect</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
