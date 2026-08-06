// lib/auth.ts
// Real auth type helpers. DEMO_USERS and the mock role switcher have been removed.
// Auth state is now managed by Supabase Auth via @supabase/ssr.

export type AuthRole = 'buyer' | 'owner' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: AuthRole;
  is_owner: boolean;
}

export function isAdmin(user: UserProfile | null): boolean {
  return user?.role === 'admin';
}

export function isOwner(user: UserProfile | null): boolean {
  return user?.role === 'owner' || user?.role === 'admin' || user?.is_owner === true;
}

export function isPhoneOtpEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PHONE_OTP === 'true';
}
