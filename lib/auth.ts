import { DEMO_USERS, UserProfile } from './mock-data';

export type AuthRole = 'visitor' | 'buyer' | 'owner' | 'admin';

export interface AuthState {
  user: UserProfile | null;
  role: AuthRole;
  isAuthenticated: boolean;
}

// In-memory auth session store for client state
let currentActiveRole: AuthRole = 'buyer'; // default active role for demo testing

export function getCurrentAuth(): AuthState {
  if (currentActiveRole === 'visitor') {
    return { user: null, role: 'visitor', isAuthenticated: false };
  }
  const user = DEMO_USERS[currentActiveRole] || DEMO_USERS['buyer'];
  return {
    user,
    role: currentActiveRole,
    isAuthenticated: true,
  };
}

export function setActiveRole(role: AuthRole) {
  currentActiveRole = role;
  if (typeof window !== 'undefined') {
    localStorage.setItem('madco_active_role', role);
    window.dispatchEvent(new Event('auth-role-changed'));
  }
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
