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
  const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project');

  if (!isOpen) return null;

  const supabase = createClient();

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    startTransition(async () => {
      if (isMockMode) {
        setSuccessMsg(tab === 'signup' ? 'Account created (Demo Mode)!' : 'Signed in as Demo Administrator!');
        setTimeout(() => {
          onClose();
          router.refresh();
          if (redirectTo) router.push(redirectTo);
          else router.push('/admin/dashboard');
        }, 500);
        return;
      }

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
          if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
            setErrorMsg('Unable to reach Supabase server. Please verify keys in .env.local or continue in Demo Mode below.');
          } else {
            setErrorMsg(error.message);
          }
          return;
        }
        setSuccessMsg('Account created! Check your email to confirm, then sign in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
            setErrorMsg('Unable to reach Supabase backend. Please verify keys in .env.local or continue in Demo Mode below.');
          } else {
            setErrorMsg(error.message);
          }
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
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
          setErrorMsg('Unable to reach the backend server. Please configure a valid NEXT_PUBLIC_SUPABASE_URL in .env.local.');
        } else {
          setErrorMsg(error.message);
        }
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
        if (error.message.includes('Failed to fetch') || error.message.includes('fetch failed')) {
          setErrorMsg('Unable to reach the backend server. Please configure a valid NEXT_PUBLIC_SUPABASE_URL in .env.local.');
        } else {
          setErrorMsg(error.message);
        }
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/80 text-slate-900 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Access saved favourites, enquiry history, and 360° virtual tour features.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs space-y-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push(redirectTo || '/admin/dashboard');
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition"
            >
              🚀 Continue in Demo Mode
            </button>
          </div>
        )}

        {isMockMode && !errorMsg && (
          <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200/80 text-amber-800 rounded-xl text-[11px] flex items-center justify-between">
            <span>Running in Demo / Local Mode</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push(redirectTo || '/admin/dashboard');
              }}
              className="font-bold underline hover:text-amber-950"
            >
              Enter Admin &rarr;
            </button>
          </div>
        )}

        {/* Auth Method Tabs */}
        <div className="flex border-b border-slate-200 mb-6 text-xs font-semibold">
          <button
            onClick={() => setAuthMethod('email')}
            className={`pb-3 px-4 border-b-2 transition ${
              authMethod === 'email'
                ? 'border-amber-600 text-amber-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Email &amp; Password
          </button>
          {phoneOtpActive && (
            <button
              onClick={() => setAuthMethod('phone')}
              className={`pb-3 px-4 border-b-2 transition ${
                authMethod === 'phone'
                  ? 'border-amber-600 text-amber-800 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>

            {tab === 'signup' && (
              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isOwnerRole}
                  onChange={(e) => setIsOwnerRole(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span>I am a Property Owner / Lister</span>
              </label>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{isPending ? 'Processing...' : tab === 'login' ? 'Sign In' : 'Create Account'}</span>
            </button>
          </form>
        )}

        {/* Phone OTP Form */}
        {authMethod === 'phone' && phoneOtpActive && (
          <div className="space-y-4">
            {!otpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
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
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition disabled:opacity-60"
                >
                  {isPending ? 'Sending...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enter OTP Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-center font-mono text-lg tracking-widest text-amber-700 focus:outline-none focus:border-amber-600"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition disabled:opacity-60"
                >
                  {isPending ? 'Verifying...' : 'Verify OTP & Sign In'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab Toggle Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {tab === 'login' ? "Don't have an account?" : 'Already registered?'}
          </span>
          <button
            onClick={() => {
              setTab(tab === 'login' ? 'signup' : 'login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="font-bold text-amber-700 hover:underline"
          >
            {tab === 'login' ? 'Create an account' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
