import React, { useState } from 'react';
import { Camera, Sparkles, CheckCircle2, X, MapPin, Building, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MANGALORE_LOCALITIES } from '../../data/propertiesData';

export default function ShootRequestModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1); // 1: form, 2: package select, 3: success
  const [propertyType, setPropertyType] = useState('flat');
  const [locality, setLocality] = useState('Kadri');
  const [address, setAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('pro');

  const packages = [
    {
      id: 'essential',
      name: 'Essential 360° Tour',
      price: '₹7,999',
      features: ['Up to 5 Room Nodes', 'Interactive Hotspots', 'Radar Floor Plan', 'Hosted on Mad.co for 1 Year']
    },
    {
      id: 'pro',
      name: '8K Spatial LiDAR Scan (Recommended)',
      price: '₹14,999',
      popular: true,
      features: ['Up to 12 Room Nodes', '8K Matterport LiDAR Accuracy', 'Aerial Drone 360 Panorama', 'Verified Mad.co Badge', '2D Floor Plan CAD Export']
    },
    {
      id: 'luxury',
      name: 'Ultra Villa & Sunset Drone Package',
      price: '₹24,999',
      features: ['Unlimited Nodes', 'Golden Hour Sunset Drone 360', 'Cinematic Video Teaser 4K', 'Priority Admin Publishing in 24 Hours']
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 3 ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>

            <h3 className="text-white font-black text-2xl">360° Shoot Booking Confirmed!</h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Mad.co Spatial Studio team will arrive at <strong className="text-amber-400">{address}, {locality}</strong> to shoot your property.
            </p>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Owner Name:</span>
                <span className="font-bold">{ownerName} ({ownerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Package:</span>
                <span className="font-bold text-amber-400">
                  {packages.find(p => p.id === selectedPackage)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">Scheduled • Dispatching Crew</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-black text-xl">Book Mad.co 360° Shoot</h3>
                <p className="text-slate-400 text-xs">Professional 360° spatial capture & tour creation in Mangalore</p>
              </div>
            </div>

            {/* PACKAGE SELECTOR */}
            <div className="space-y-3">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Choose Shoot Package</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packages.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPackage(p.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition relative ${
                      selectedPackage === p.id
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/30'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2 right-2 bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    )}
                    <h4 className="text-white font-bold text-xs line-clamp-1">{p.name}</h4>
                    <div className="text-amber-400 font-black text-sm my-1">{p.price}</div>
                    <ul className="text-[10px] text-slate-400 space-y-1">
                      {p.features.slice(0, 2).map((f, i) => (
                        <li key={i}>• {f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* OWNER DETAILS FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Property Owner"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Phone Number (+91)</label>
                  <input
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Locality</label>
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-3 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    {MANGALORE_LOCALITIES.filter(l => l !== 'All Localities').map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-slate-950 text-white text-xs font-semibold px-3 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="flat">Flat / Apartment</option>
                    <option value="villa">Independent Villa</option>
                    <option value="house">Independent House</option>
                    <option value="plot">Residential Plot</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Property Address</label>
                <input
                  type="text"
                  required
                  placeholder="Building name, landmark, street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950 text-white text-xs font-semibold px-4 py-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Book Mad.co Spatial Shoot</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
