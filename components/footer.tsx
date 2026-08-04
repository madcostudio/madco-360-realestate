import Link from 'next/link';
import { Building2, Compass, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-line text-text-lo text-xs py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand & Studio Lockup */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-2xl text-text-hi font-sans">Mad.co</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
              360° SPATIAL
            </span>
          </div>
          <p className="text-text-lo text-xs leading-relaxed">
            India's premiere 360° virtual walkthrough marketplace. Every listing is photographed room-to-room and verified in person by Mad.co Studio.
          </p>
          <div className="pt-2">
            <a
              href="https://madco.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-gold hover:underline font-semibold"
            >
              <span>A Mad.co Studio product (madco.in)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-text-hi uppercase tracking-wider text-xs">Explore Marketplace</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/property/luxury-2bhk-penthouse/tour" className="hover:text-text-hi transition">
                360° Virtual Walkthroughs
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-text-hi transition">
                Search Properties Nearby
              </Link>
            </li>
            <li>
              <Link href="/owner/submit-property" className="hover:text-text-hi transition">
                Book a 360° Capture Visit
              </Link>
            </li>
            <li>
              <Link href="/admin/tour-builder/22222222-2222-2222-2222-222222222222" className="hover:text-text-hi transition">
                Visual Tour Builder
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Localities */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-text-hi uppercase tracking-wider text-xs">Mangalore Localities</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/search?city=Mangalore&locality=Bejai" className="hover:text-text-hi transition">
                Homes in Bejai
              </Link>
            </li>
            <li>
              <Link href="/search?city=Mangalore&locality=Kadri" className="hover:text-text-hi transition">
                Homes in Kadri
              </Link>
            </li>
            <li>
              <Link href="/search?city=Mangalore&locality=Urwa" className="hover:text-text-hi transition">
                Homes in Urwa & Ladyhill
              </Link>
            </li>
            <li>
              <Link href="/search?city=Mangalore&locality=Falnir" className="hover:text-text-hi transition">
                Homes in Falnir
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Legal & Compliance */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-text-hi uppercase tracking-wider text-xs">Legal & Compliance</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/terms" className="hover:text-text-hi transition">
                Terms of Service & RERA Disclaimer
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-text-hi transition">
                Privacy Policy & DPDP Act 2023
              </Link>
            </li>
            <li>
              <Link href="/refund-policy" className="hover:text-text-hi transition">
                Capture Shoot Refund Policy
              </Link>
            </li>
          </ul>
          <p className="text-[10px] text-slate-500 pt-2">
            © 2026 Mad.co Estates. All rights reserved. Platform is a listing/marketing service (RERA Compliant).
          </p>
        </div>
      </div>
    </footer>
  );
}
