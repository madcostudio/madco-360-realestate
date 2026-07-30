import React, { useState } from 'react';
import { Calendar, Phone, MessageSquare, CheckCircle2, X, Sparkles, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LeadModal({ property, isOpen, onClose }) {
  if (!isOpen || !property) return null;

  const [activeTab, setActiveTab] = useState('visit'); // 'visit' | 'whatsapp' | 'callback'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      `Hi Mad.co Team, I'm interested in viewing "${property.title}" in ${property.locality}, Mangalore. Please share visit slots!`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-in zoom-in-95 duration-150">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-white font-extrabold text-2xl">Site Visit Confirmed!</h3>
            <p className="text-slate-300 text-sm max-w-sm mx-auto">
              Our Mad.co Mangalore representative will contact you at <strong className="text-amber-400">{phone}</strong> to confirm your slot for {property.title}.
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-1 text-slate-400">
              <p><strong className="text-slate-200">Date:</strong> {visitDate || 'As scheduled'}</p>
              <p><strong className="text-slate-200">Time:</strong> {visitTime}</p>
              <p><strong className="text-slate-200">Meeting Point:</strong> {property.address}</p>
            </div>

            <button
              onClick={() => { setSubmitted(false); onClose(); }}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition"
            >
              Back to Property
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Physical Visit & Consultation
              </div>
              <h3 className="text-white font-black text-xl line-clamp-1">{property.title}</h3>
              <p className="text-slate-400 text-xs">{property.locality}, Mangalore</p>
            </div>

            {/* ACTION TYPE TABS */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('visit')}
                className={`py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'visit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Schedule Visit
              </button>
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="py-2 rounded-xl text-xs font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5 hover:bg-emerald-600/30 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Chat
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Phone Number (+91)</label>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-3 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Time Slot</label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-3 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="05:30 PM">05:30 PM (Sunset)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20"
              >
                Confirm Physical Site Visit
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
