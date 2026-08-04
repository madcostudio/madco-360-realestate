'use client';

import { useState } from 'react';
import { MessageSquare, PhoneCall, CheckCircle, Send } from 'lucide-react';
import { trackEvent } from '@/lib/events';

interface TourContactCtaProps {
  propertyId: string;
  propertyTitle: string;
}

export function TourContactCta({ propertyId, propertyTitle }: TourContactCtaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('I just completed the 360° virtual tour and would like to schedule a private viewing.');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await trackEvent('tour_enquiry_from_tour', propertyId, { name, phone, message });
    setSubmitted(true);
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
          className="w-full py-3.5 px-6 rounded-2xl bg-estate-card/90 backdrop-blur-xl border border-brass/40 text-white font-bold flex items-center justify-center space-x-3 shadow-2xl hover:bg-estate-card hover:border-brass transition-all duration-300 group"
        >
          <span className="w-3 h-3 rounded-full bg-fern animate-ping" />
          <MessageSquare className="w-5 h-5 text-brass group-hover:scale-110 transition-transform" />
          <span className="text-sm">Contact Owner / Agent from Inside</span>
        </button>
      </div>

      {/* Contact Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-estate-card border border-estate-border text-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              ✕
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle className="w-16 h-16 text-fern mx-auto animate-bounce" />
                <h3 className="text-2xl font-serif font-bold text-white">Enquiry Sent!</h3>
                <p className="text-slate-300 text-sm">
                  The property manager has received your virtual tour enquiry and will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-800 pb-4 mb-2">
                  <span className="text-xs uppercase tracking-wider text-brass font-semibold">Instant Tour Enquiry</span>
                  <h3 className="text-xl font-serif font-bold text-white mt-1">{propertyTitle}</h3>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brass via-brass-dark to-brass text-slate-950 font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brass/20 hover:scale-[1.01] transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Enquiry From Inside Tour</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
