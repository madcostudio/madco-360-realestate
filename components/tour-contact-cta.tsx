'use client';

import { useState } from 'react';
import { MessageSquare, PhoneCall, CheckCircle, Send, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/events';
import { submitEnquiryAction } from '@/app/actions/submit-enquiry';

interface TourContactCtaProps {
  propertyId: string;
  propertyTitle: string;
  contactPhone?: string;
}

export function TourContactCta({ propertyId, propertyTitle, contactPhone }: TourContactCtaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [message, setMessage] = useState('I just completed the 360° virtual tour and would like to schedule a private viewing.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await submitEnquiryAction({
      propertyId,
      visitorName: name,
      visitorPhone: phone,
      message,
    });

    await trackEvent('tour_enquiry_from_tour', propertyId, { name, phone, message });
    setLoading(false);
    setSubmitted(true);
    
    if (contactPhone) {
      const whatsappText = `Hi, my name is ${name}. I am interested in "${propertyTitle}".\n\n${message}`;
      const waUrl = `https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappText)}`;
      window.open(waUrl, '_blank');
    }

    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 2500);
  };

  return (
    <>
      {/* Floating Bottom Bar CTA Button */}
      <div className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3.5 px-6 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 text-slate-900 font-bold flex items-center justify-center space-x-3 shadow-2xl hover:border-amber-600 transition-all duration-300 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <MessageSquare className="w-5 h-5 text-amber-700 group-hover:scale-110 transition-transform" />
          <span className="text-sm">Contact Owner / Agent from Inside</span>
        </button>
      </div>

      {/* Contact Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 text-slate-900 max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-2xl font-serif font-bold text-slate-900">Enquiry Sent!</h3>
                <p className="text-slate-600 text-sm">
                  The property manager has received your virtual tour enquiry and will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-4 mb-2">
                  <span className="text-xs uppercase tracking-wider text-amber-800 font-semibold">Instant Tour Enquiry</span>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mt-1">{propertyTitle}</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center justify-center space-x-2 shadow-md shadow-amber-600/20 hover:scale-[1.01] transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Enquiry From Inside Tour</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
