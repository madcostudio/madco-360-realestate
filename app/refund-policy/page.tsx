import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-text-hi py-20 px-6 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-line pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-brass block">Legal & Compliance</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-hi mt-1">Refund & Capture Visit Policy</h1>
        <p className="text-text-lo text-xs mt-2">Effective Date: August 3, 2026 • Consumer Protection Act 2019 Compliant</p>
      </div>

      <div className="space-y-6 text-sm text-text-lo leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">1. Free Capture Visit Guarantee</h2>
          <p>
            Mad.co Studio provides initial 360° capture visit bookings for property owners with zero upfront fee. Property owners are under no financial obligation when booking a capture visit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">2. Paid Premium Services & Cancellation</h2>
          <p>
            If a property owner subscribes to paid premium listing features or expedited 360° tour production, cancellation requests made at least 24 hours prior to the scheduled shoot will receive a 100% refund.
          </p>
          <p>
            Refunds will be processed via the original payment method within 5–7 business days in compliance with the Consumer Protection (E-Commerce) Rules, 2020.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">3. Contact Studio Support</h2>
          <p>
            For shoot rescheduling or billing queries, contact our support team at <code>support@madco.in</code> or WhatsApp us at +91 99999 00000.
          </p>
        </section>
      </div>
    </main>
  );
}
