import Link from 'next/link';
import { Camera, MessageCircle, ArrowRight } from 'lucide-react';

export function OwnerCtaBand() {
  return (
    <section className="bg-gradient-to-r from-sky-50/90 via-sky-100/50 to-indigo-50/70 border-t border-sky-200/60 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-sky-900 text-xs font-bold uppercase tracking-widest font-mono bg-sky-100 px-3.5 py-1 rounded-full border border-sky-200 shadow-2xs">
            <Camera className="w-4 h-4 text-sky-700" />
            <span>Mad.co Studio 360° Capture Service</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-slate-900">
            Selling or renting out? We'll shoot your property in 360°.
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Our media team visits your property in-person with HDR equirectangular camera hardware to capture room-to-room 360° panoramas. Zero upfront fee.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
          <Link
            href="/owner/submit-property"
            className="w-full sm:w-auto btn-primary text-sm shadow-md shadow-sky-600/25 hover:scale-105 transition-transform"
          >
            <span>Book a Free Capture Visit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://wa.me/918762640420?text=Hi%20Mad.co%20Studio,%20I'd%20like%20to%20book%20a%20360%20capture%20visit%20for%20my%20property."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-sky-200 hover:border-sky-500 text-slate-900 font-bold text-sm transition flex items-center justify-center space-x-2 shadow-2xs hover:scale-105"
          >
            <MessageCircle className="w-4 h-4 text-sky-600" />
            <span>WhatsApp Studio</span>
          </a>
        </div>
      </div>
    </section>
  );
}
