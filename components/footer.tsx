import Link from 'next/link';
import { Building2, Compass, ExternalLink } from 'lucide-react';
import { EstatesLogo } from '@/components/estates-logo';

export function Footer() {
  return (
    <footer className="bg-[#0A0D14] border-t border-white/[0.08] text-slate-400 text-xs py-16 relative z-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Studio Lockup */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <EstatesLogo />
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            India's premiere 360° virtual walkthrough marketplace. Every listing is photographed room-to-room and verified in person by Mad.co Studio.
          </p>
          <div className="pt-2">
            <a
              href="https://madco.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-sky-400 hover:text-sky-300 hover:underline font-semibold transition"
            >
              <span>A Mad.co Studio product (madco.in)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs">Explore Marketplace</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/property/luxury-2bhk-penthouse/tour" className="hover:text-sky-400 transition">
                360° Virtual Walkthroughs
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-sky-400 transition">
                Search Properties Nearby
              </Link>
            </li>
            <li>
              <Link href="/owner/submit-property" className="hover:text-sky-400 transition">
                Book a 360° Capture Visit
              </Link>
            </li>
            <li>
              <Link href="/admin/tour-builder/22222222-2222-2222-2222-222222222222" className="hover:text-sky-400 transition">
                Visual Tour Builder
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Cities */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs">Top Verified Localities</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/search?city=Mangalore" className="hover:text-sky-400 transition">
                Mangalore Prime Penthouses
              </Link>
            </li>
            <li>
              <Link href="/search?city=Bangalore" className="hover:text-sky-400 transition">
                Bangalore Luxury Villas
              </Link>
            </li>
            <li>
              <Link href="/search?city=Mumbai" className="hover:text-sky-400 transition">
                Mumbai Sea-View Suites
              </Link>
            </li>
            <li>
              <Link href="/search?city=Goa" className="hover:text-sky-400 transition">
                Goa Coastal Estates
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Trust & Policies */}
        <div className="space-y-3">
          <h4 className="font-display font-bold text-white uppercase tracking-wider text-xs">Trust & Standards</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-sky-400 transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-sky-400 transition">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-sky-400 transition">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-4">
        <p>© {new Date().getFullYear()} Madco Estates (estates.madco.in) — All Rights Reserved.</p>
        <p className="font-mono">Spatial Real Estate Marketplace · Shot by Mad.co Studio</p>
      </div>
    </footer>
  );
}
