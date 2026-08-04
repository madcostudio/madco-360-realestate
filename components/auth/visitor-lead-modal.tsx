'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/events';
import { MessageSquare, Phone, User, Send, CheckCircle2, UserPlus } from 'lucide-react';

interface VisitorLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onOpenFullAuth: () => void;
}

export function VisitorLeadModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  onOpenFullAuth,
}: VisitorLeadModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('I am interested in this property and would like to receive details.');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await trackEvent('tour_enquiry_from_tour', propertyId, {
      visitor_name: name,
      visitor_phone: phone,
      message,
    });

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-estate-card border border-estate-border text-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-fern mx-auto animate-bounce" />
            <h3 className="text-2xl font-serif font-bold text-white">Lead Captured!</h3>
            <p className="text-slate-300 text-sm">
              Thank you {name}. The owner/agent has been notified and will reach out to your phone number ({phone}).
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brass/20 text-brass flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white">Contact Seller</h3>
              <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{propertyTitle}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Verma"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brass via-brass-dark to-brass text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 flex items-center justify-center space-x-2 hover:scale-[1.01] transition"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending Lead...' : 'Continue with Name + Phone'}</span>
            </button>

            <div className="pt-3 border-t border-slate-800 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullAuth();
                }}
                className="text-xs text-slate-400 hover:text-brass flex items-center justify-center space-x-1.5 mx-auto"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Or Sign Up for full account features (save favourites, history)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
