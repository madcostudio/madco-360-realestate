'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthModal } from '@/components/auth/auth-modal';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-amber-500/5 pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Compass className="w-6 h-6 text-amber-600 animate-spin-slow" />
          <span className="text-xl font-bold font-sans text-slate-900">Mad.co Estates</span>
        </div>
      </div>

      {/* Auth modal rendered inline — always open on this page */}
      <AuthModal
        isOpen={true}
        onClose={() => router.push('/')}
        defaultTab="login"
        redirectTo={next}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
