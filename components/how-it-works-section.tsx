export function HowItWorksSection() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 space-y-10 border-b border-line">
      <div className="text-xs uppercase tracking-widest text-text-lo font-mono">
        // HOW IT WORKS
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Buyers Column */}
        <div className="space-y-8">
          <h3 className="font-serif font-bold text-2xl text-text-hi border-b border-line pb-4">
            For Home Buyers & Tenants
          </h3>
          <div className="space-y-6">
            <div className="flex space-x-4 border-b border-line pb-6">
              <span className="font-mono font-bold text-xl text-brass">01</span>
              <div>
                <h4 className="font-bold text-base text-text-hi mb-1">Search & Filter by Location</h4>
                <p className="text-text-lo text-xs leading-relaxed">
                  Choose your target city or use current GPS coordinates to view verified homes within your preferred radius.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 border-b border-line pb-6">
              <span className="font-mono font-bold text-xl text-brass">02</span>
              <div>
                <h4 className="font-bold text-base text-text-hi mb-1">Step Inside 360° Walkthroughs</h4>
                <p className="text-text-lo text-xs leading-relaxed">
                  Experience room-to-room virtual tours, inspect high-definition materials, and check accurate spatial layouts.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <span className="font-mono font-bold text-xl text-brass">03</span>
              <div>
                <h4 className="font-bold text-base text-text-hi mb-1">Contact Seller Directly</h4>
                <p className="text-text-lo text-xs leading-relaxed">
                  Send enquiries directly from inside the tour to schedule private in-person site visits.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Owners Column */}
        <div className="space-y-8">
          <h3 className="font-serif font-bold text-2xl text-text-hi border-b border-line pb-4">
            For Property Owners & Listers
          </h3>
          <div className="space-y-6">
            <div className="flex space-x-4 border-b border-line pb-6">
              <span className="font-mono font-bold text-xl text-brass">01</span>
              <div>
                <h4 className="font-bold text-base text-text-hi mb-1">Submit Property Details</h4>
                <p className="text-text-lo text-xs leading-relaxed">
                  Provide property specs, pricing, and address in under 2 minutes.
                </p>
              </div>
            </div>

            <div className="flex space-x-4 border-b border-line pb-6">
              <span className="font-mono font-bold text-xl text-brass">02</span>
              <div>
                <h4 className="font-bold text-base text-text-hi mb-1">Book Mad.co 360° Capture Visit</h4>
                <p className="text-text-lo text-xs leading-relaxed">
                  Our professional media team visits your property with HDR equirectangular hardware to shoot 360° panoramas.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <span className="font-mono font-bold text-xl text-brass">03</span>
              <div>
                <h4 className="font-bold text-base text-text-hi mb-1">Receive Qualified Leads</h4>
                <p className="text-text-lo text-xs leading-relaxed">
                  Your listing goes live with an interactive 360° walkthrough, attracting serious buyers who have already explored every room.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
