'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Camera, 
  Menu, 
  X, 
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { MADCO_WHATSAPP_URL } from '../utils/url';

export default function Navbar({ 
  areaUnit, 
  setAreaUnit, 
  currentPage, 
  setCurrentPage, 
  onRequestShoot 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* LOGO & BRANDING */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-indigo-400 font-black text-xl tracking-tighter">
                    MAD
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-extrabold text-lg tracking-tight">Mad.co</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> 360° SPATIAL
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium">Mangalore Real Estate</p>
            </div>
          </div>

          {/* NAVIGATION LINKS (DESKTOP) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'home'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentPage('properties')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'properties'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              360° Listings
            </button>

            <button
              onClick={() => setCurrentPage('shoot-service')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'shoot-service'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Book 360° Shoot
            </button>

            <a
              href={MADCO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Us</span>
            </a>

            <button
              onClick={() => setCurrentPage('submit-listing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'submit-listing'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Submit 360° Tour
            </button>

            <button
              onClick={() => setCurrentPage('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentPage === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Admin
            </button>
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="hidden lg:flex items-center gap-3">
            {/* AREA UNIT TOGGLE */}
            <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setAreaUnit('sqft')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  areaUnit === 'sqft' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                sq ft
              </button>
              <button
                onClick={() => setAreaUnit('sqm')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${
                  areaUnit === 'sqm' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                sq m
              </button>
            </div>

            {/* CURRENCY BADGE */}
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 text-amber-400 text-xs font-bold flex items-center gap-1.5">
              <span>₹ INR</span>
            </div>

            {/* PRIMARY CTA */}
            <button
              onClick={onRequestShoot}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition transform hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              <span>Shoot My Property</span>
            </button>
          </div>

          {/* MOBILE MENU TRIGGER */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
            >
              Home
            </button>
            <button
              onClick={() => { setCurrentPage('properties'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
            >
              360° Listings
            </button>
            <button
              onClick={() => { setCurrentPage('shoot-service'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
            >
              Book Mad.co 360° Shoot
            </button>
            <a
              href={MADCO_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-4 py-3 rounded-xl bg-emerald-950/40 text-emerald-400 font-bold text-sm flex items-center justify-between border border-emerald-500/30"
            >
              <span>WhatsApp Direct Inquiry</span>
              <MessageSquare className="w-4 h-4" />
            </a>
            <button
              onClick={() => { setCurrentPage('submit-listing'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
            >
              Submit Equirectangular 360
            </button>
            <button
              onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm"
            >
              Admin Panel
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Area Unit:</span>
              <button
                onClick={() => setAreaUnit('sqft')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${areaUnit === 'sqft' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                sq ft
              </button>
              <button
                onClick={() => setAreaUnit('sqm')}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${areaUnit === 'sqm' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                sq m
              </button>
            </div>

            <button
              onClick={() => { onRequestShoot(); setMobileMenuOpen(false); }}
              className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
            >
              Book Shoot
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
