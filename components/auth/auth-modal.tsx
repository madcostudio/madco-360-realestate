'use client';

import { useState } from 'react';
import { getCurrentAuth, setActiveRole, isPhoneOtpEnabled, AuthRole } from '@/lib/auth';
import { Mail, Lock, Smartphone, LogIn, Sparkles, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isOwnerRole, setIsOwnerRole] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const phoneOtpActive = isPhoneOtpEnabled();

  if (!isOpen) return null;

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const roleToSet: AuthRole = isOwnerRole ? 'owner' : 'buyer';
      setActiveRole(roleToSet);
      setSuccessMsg(`Successfully ${tab === 'login' ? 'logged in' : 'signed up'}!`);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 600);
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveRole('buyer');
      setSuccessMsg('Successfully authenticated with Google!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 800);
  };

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveRole('buyer');
      setSuccessMsg('Phone number verified! Welcome to Madco Estates.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    }, 600);
  };

  const handleRoleQuickSwitch = (role: AuthRole) => {
    setActiveRole(role);
    onClose();
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

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brass/20 border border-brass/40 text-brass flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-xs mt-1">
            Access saved favourites, enquiry history, and 360° virtual tour features.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-fern/20 border border-fern/40 text-fern rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Method Selector */}
        <div className="flex border-b border-slate-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setAuthMethod('email')}
            className={`pb-3 px-4 border-b-2 transition ${
              authMethod === 'email'
                ? 'border-brass text-brass font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Email & Password
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`pb-3 px-4 border-b-2 transition ${
              authMethod === 'phone'
                ? 'border-brass text-brass font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {/* Method 1: Email Auth Form */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                />
              </div>
            </div>

            {tab === 'signup' && (
              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isOwnerRole}
                  onChange={(e) => setIsOwnerRole(e.target.checked)}
                  className="rounded border-slate-700 text-brass focus:ring-brass"
                />
                <span>I am a Property Owner / Lister</span>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs transition flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 22.3 12 22.3z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>
        )}

        {/* Method 2: Phone OTP Form */}
        {authMethod === 'phone' && (
          <div className="space-y-4">
            {!phoneOtpActive && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-1 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Phone OTP Feature Flag Status</span>
                </div>
                <p className="text-[11px] text-amber-200/80">
                  SMS provider key is pending configuration. Entering your mobile number will simulate OTP verification cleanly.
                </p>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 transition"
                >
                  {loading ? 'Sending Code...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Enter 4-Digit OTP Code</label>
                  <input
                    type="text"
                    maxLength={4}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="1234"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-brass focus:outline-none focus:border-brass"
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    Enter any 4 digits (e.g. 1234) for verification testing
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-fern hover:bg-fern-dark text-slate-950 font-bold text-sm shadow-lg shadow-fern/20 transition"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab Toggle Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {tab === 'login' ? "Don't have an account?" : 'Already registered?'}
          </span>
          <button
            onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}
            className="font-bold text-brass hover:underline"
          >
            {tab === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </div>

        {/* Demo Quick Role Selector */}
        <div className="mt-6 p-3 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block text-center">
            ⚡ Demo Testing Role Switcher
          </span>
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleRoleQuickSwitch('buyer')}
              className="py-1.5 bg-slate-800 hover:bg-brass hover:text-slate-950 font-bold text-slate-300 rounded-lg transition"
            >
              Buyer Role
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSwitch('owner')}
              className="py-1.5 bg-slate-800 hover:bg-brass hover:text-slate-950 font-bold text-slate-300 rounded-lg transition"
            >
              Owner Role
            </button>
            <button
              type="button"
              onClick={() => handleRoleQuickSwitch('admin')}
              className="py-1.5 bg-slate-800 hover:bg-brass hover:text-slate-950 font-bold text-slate-300 rounded-lg transition"
            >
              Admin Role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
