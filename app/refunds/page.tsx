import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-ink-950 text-text-hi py-20 px-6 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-line pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-brass block">Legal & Compliance</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-text-hi mt-1">Refund & Cancellation Policy</h1>
        <p className="text-text-lo text-xs mt-2">
          Effective Date: August 3, 2026 • Consumer Protection (E-Commerce) Rules, 2020 Compliant
        </p>
      </div>

      <div className="space-y-6 text-sm text-text-lo leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">1. 360° Capture Shoot Services</h2>
          <p>
            Mad.co Estates provides high-fidelity on-site 360° LiDAR scanning and HDR panorama capture services for residential and commercial real estate properties.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Cancellation before shoot dispatch:</strong> If a capture booking is cancelled at least 24 hours prior to the scheduled technician arrival time, a 100% full refund will be credited to the original payment method within 5–7 business days.
            </li>
            <li>
              <strong>Rescheduling:</strong> Bookings can be rescheduled up to 4 hours before the appointment at zero additional charge.
            </li>
            <li>
              <strong>Post-Shoot Processing:</strong> Once the on-site capture has been completed and raw equirectangular files have entered our cloud stitching and processing pipeline, fees are non-refundable as customized digital processing costs have been incurred.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">2. Quality Guarantee & Re-shoots</h2>
          <p>
            If any 360° scene exhibits optical defects, stitching stitching misalignment, or resolution issues attributable to our equipment, Mad.co Studio will dispatch a technician for a complimentary corrective re-shoot at no additional cost.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif font-bold text-lg text-text-hi">3. Contact for Inquiries & Grievances</h2>
          <p>
            For refund status, billing inquiries, or grievance redressal, please reach out to our accounts team at <code>billing@madco.in</code> or call our helpline.
          </p>
        </section>
      </div>
    </main>
  );
}
