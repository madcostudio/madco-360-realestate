import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-text-hi py-20 px-6 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-line pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-brass block">Legal & Compliance</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-hi mt-1">Terms of Service & RERA Disclaimer</h1>
        <p className="text-text-lo text-xs mt-2">Effective Date: August 3, 2026 • Governed under the Laws of India</p>
      </div>

      <div className="space-y-6 text-sm text-text-lo leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">1. Platform Nature & RERA Disclaimer</h2>
          <p>
            Mad.co Estates (operated by Mad.co Studio) functions strictly as an interactive visual media marketplace and advertising facilitator connecting property owners, builders, and prospective buyers. Mad.co Estates is <strong>not a real estate broker, agent, or developer</strong> under the Real Estate (Regulation and Development) Act, 2016 (RERA).
          </p>
          <p>
            All property information, pricing, carpet area measurements, and availability are provided by third-party property owners or verified via Mad.co 360° capture shoots. Users are advised to independently verify RERA registration numbers, title deeds, and legal approvals before entering financial transactions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">2. Intellectual Property & 360° Panorama Rights</h2>
          <p>
            All 360° equirectangular panoramas, virtual tour builds, high-definition photography, and interactive media created by Mad.co Studio remain the exclusive intellectual property of Mad.co Studio under the Indian Copyright Act, 1957.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">3. Information Technology Act, 2000 Compliance</h2>
          <p>
            As an intermediary under Section 79 of the Information Technology Act, 2000, Mad.co Estates enforces strict moderation standards. Any fraudulent, misleading, or unauthorized property listing will be removed within 24 hours of receiving a verified takedown notice at <code>legal@madco.in</code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">4. Governing Law & Jurisdiction</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with this platform shall be subject to the exclusive jurisdiction of the competent courts in Karnataka, India.
          </p>
        </section>
      </div>
    </main>
  );
}
