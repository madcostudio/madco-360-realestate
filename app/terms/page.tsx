import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FBFBF9] text-slate-900 py-20 px-6 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-700 font-bold block">Legal & Compliance</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">Terms of Service &amp; RERA Disclaimer</h1>
        <p className="text-slate-500 text-xs mt-2">Effective Date: August 3, 2026 • Governed under the Laws of India</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-3xl p-8 shadow-luxury-sm">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-slate-900">1. Platform Nature &amp; RERA Disclaimer</h2>
          <p>
            Mad.co Estates (operated by Mad.co Studio) functions strictly as an interactive visual media marketplace and advertising facilitator connecting property owners, builders, and prospective buyers. Mad.co Estates is <strong>not a real estate broker, agent, or developer</strong> under the Real Estate (Regulation and Development) Act, 2016 (RERA).
          </p>
          <p>
            All property information, pricing, carpet area measurements, and availability are provided by third-party property owners or verified via Mad.co 360° capture shoots. Users are advised to independently verify RERA registration numbers, title deeds, and legal approvals before entering financial transactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-slate-900">2. Intellectual Property &amp; 360° Panorama Rights</h2>
          <p>
            All 360° equirectangular panoramas, virtual tour builds, high-definition photography, and interactive media created by Mad.co Studio remain the exclusive intellectual property of Mad.co Studio under the Indian Copyright Act, 1957.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-slate-900">3. Information Technology Act, 2000 Compliance</h2>
          <p>
            As an intermediary under Section 79 of the Information Technology Act, 2000, Mad.co Estates enforces strict moderation standards. Any fraudulent, misleading, or unauthorized property listing will be removed within 24 hours of receiving a verified takedown notice at <code>legal@madco.in</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-slate-900">4. Governing Law &amp; Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this platform shall be subject to the exclusive jurisdiction of the competent courts in Karnataka, India.
          </p>
        </section>
      </div>
    </main>
  );
}
