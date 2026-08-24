import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FBFBF9] text-slate-900 py-20 px-6 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-700 font-bold block">Legal & Compliance</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-1">Privacy Policy &amp; DPDP Act 2023</h1>
        <p className="text-slate-500 text-xs mt-2">Effective Date: August 3, 2026 • Digital Personal Data Protection Act Compliant</p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 leading-relaxed bg-white border border-slate-200 rounded-3xl p-8 shadow-luxury-sm">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-slate-900">1. Data Collection &amp; Purpose</h2>
          <p>
            In compliance with India&apos;s Digital Personal Data Protection (DPDP) Act, 2023, Mad.co Estates collects personal data solely for specified, explicit, and legitimate purposes:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Lead Enquiries:</strong> Full Name, Mobile Phone Number, and Message transmitted to property sellers upon your explicit request.</li>
            <li><strong>Location Data:</strong> Selected City, Latitude, Longitude, and Search Radius stored locally in your browser (<code>localStorage</code>) to customize property distances and results.</li>
            <li><strong>Authentication:</strong> Email Address and Profile metadata managed securely via Supabase Auth.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-slate-900">2. Your Data Rights &amp; Deletion Requests</h2>
          <p>
            Under the DPDP Act 2023, you have the right to access, correct, or request complete erasure of your personal data at any time. To request data deletion or withdraw consent, email our Data Protection Officer at <code>privacy@madco.in</code>. All user records will be scrubbed within 7 business days.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-slate-900">3. Cookies &amp; Local Storage Disclosure</h2>
          <p>
            Mad.co Estates uses functional cookies and browser local storage to preserve your location preferences, active filters, and session tokens. No third-party tracking cookies or advertising scripts are deployed on this platform.
          </p>
        </section>
      </div>
    </main>
  );
}
