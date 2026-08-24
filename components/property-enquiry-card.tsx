'use client';

import { useState } from 'react';
import { submitEnquiryAction } from '@/app/actions/submit-enquiry';
import { MessageSquare, Phone, User, Mail, Send, CheckCircle2, Calendar, ShieldCheck, Loader2 } from 'lucide-react';

interface PropertyEnquiryCardProps {
  propertyId: string;
  propertyTitle: string;
  price: number;
  contactPhone?: string;
}

export function PropertyEnquiryCard({ propertyId, propertyTitle, price, contactPhone }: PropertyEnquiryCardProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`Hi, I am interested in "${propertyTitle}" and would like to arrange a private walkthrough.`);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await submitEnquiryAction({
        propertyId,
        visitorName: name,
        visitorPhone: phone,
        visitorEmail: email,
        message,
      });

      if (result.success) {
        setSubmitted(true);
        if (contactPhone) {
          const textMsg = `*New Lead Enquiry: ${propertyTitle}*\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage: ${message}`;
          const waUrl = `https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(textMsg)}`;
          window.open(waUrl, '_blank');
        }
      } else {
        setError(result.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Network error submitting enquiry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-luxury-md space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs uppercase tracking-wider text-amber-800 font-bold flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Direct Owner / Agent Inquiry</span>
        </span>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">Request Verified Site Visit</h3>
        <p className="text-xs text-slate-500 mt-1">
          Receive property documents, floorplans, and private inspection slots directly.
        </p>
      </div>

      {submitted ? (
        <div className="py-8 text-center space-y-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
          <h4 className="text-xl font-serif font-bold text-slate-900">Enquiry Received!</h4>
          <p className="text-slate-600 text-xs max-w-sm mx-auto">
            Thank you <strong className="text-slate-900">{name}</strong>. The listing manager has been alerted and will reach out to <strong className="text-amber-800">{phone}</strong> shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName('');
              setPhone('');
              setEmail('');
            }}
            className="text-xs text-amber-700 hover:underline pt-2 inline-block font-semibold"
          >
            Submit another query
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</p>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Message / Questions</label>
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
            className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 flex items-center justify-center space-x-2 hover:scale-[1.01] transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Submitting Enquiry to Listing Manager...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Direct Lead Enquiry</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
