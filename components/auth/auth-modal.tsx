'use client';

import { useState, useTransition } from 'react';
import { Mail, Lock, LogIn, Sparkles, AlertCircle, CheckCircle2, Smartphone, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isPhoneOtpEnabled } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
  redirectTo?: string;
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login', redirectTo }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'signup'>(defaultTab);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isOwnerRole, setIsOwnerRole] = useState(false);
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const phoneOtpActive = isPhoneOtpEnabled();

  if (!isOpen) return null;

  const supabase = createClient();

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    startTransition(async () => {
      if (tab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: isOwnerRole ? 'owner' : 'buyer',
              is_owner: isOwnerRole,
            },
          },
        });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        setSuccessMsg('Account created! Check your email to confirm, then sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setErrorMsg(error.message);
          return;
        }
        setSuccessMsg('Signed in!');
        setTimeout(() => {
          onClose();
          router.refresh();
          if (redirectTo) router.push(redirectTo);
        }, 600);
      }
    });
  };

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    startTransition(async () => {
      const { error } = await supabase.auth.signInWithOtp({ phone });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      setOtpSent(true);
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    startTransition(async () => {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otpCode,
        type: 'sms',
      });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      setSuccessMsg('Phone verified! Welcome to Madco Estates.');
      setTimeout(() => {
        onClose();
        router.refresh();
        if (redirectTo) router.push(redirectTo);
      }, 800);
    });
  };

  const handleSignOut = () => {
    startTransition(async () => {
      await supabase.auth.signOut();
      onClose();
      router.refresh();
      router.push('/');
    });
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

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Auth Method Tabs */}
        <div className="flex border-b border-slate-800 mb-6 text-xs font-semibold">
          <button
            onClick={() => setAuthMethod('email')}
            className={`pb-3 px-4 border-b-2 transition ${
              authMethod === 'email'
                ? 'border-brass text-brass font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Email &amp; Password
          </button>
          {phoneOtpActive && (
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
          )}
        </div>

        {/* Email Auth Form */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brass"
                  />
                </div>
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
                  minLength={6}
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
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 transition flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{isPending ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>
        )}

        {/* Phone OTP Form (only shown if NEXT_PUBLIC_ENABLE_PHONE_OTP=true) */}
        {authMethod === 'phone' && phoneOtpActive && (
          <div className="space-y-4">
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
                  disabled={isPending}
                  className="w-full py-3 rounded-xl bg-brass hover:bg-brass-hover text-slate-950 font-bold text-sm shadow-lg shadow-brass/20 transition disabled:opacity-60"
                >
                  {isPending ? 'Sending...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Enter OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-brass focus:outline-none focus:border-brass"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-xl bg-fern hover:bg-fern-dark text-slate-950 font-bold text-sm shadow-lg shadow-fern/20 transition disabled:opacity-60"
                >
                  {isPending ? 'Verifying...' : 'Verify OTP & Sign In'}
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
            onClick={() => {
              setTab(tab === 'login' ? 'signup' : 'login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="font-bold text-brass hover:underline"
          >
            {tab === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
