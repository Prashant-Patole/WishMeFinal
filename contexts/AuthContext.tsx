import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Plan = 'free' | 'silver' | 'gold' | 'platinum';
export type UserRole = 'user' | 'admin' | 'celebrity';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  address: string;
  plan: Plan;
  role: UserRole;
  walletBalance: number;
  referralCode: string;
  profilePhoto: string | null;
  completionPct: number;
}

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    phone?: string,
    referralCode?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateWallet: (amount: number) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = 'wishme_user';

function generateReferralCode(email: string): string {
  const base = email.split('@')[0].toUpperCase().slice(0, 5);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}${rand}`;
}

function calcCompletion(profile: Partial<UserProfile>): number {
  const fields = ['firstName', 'lastName', 'phone', 'dob', 'address', 'profilePhoto'] as const;
  const filled = fields.filter((f) => !!profile[f]).length;
  return Math.round((filled / fields.length) * 100);
}

function detectRole(email: string): UserRole {
  if (email.includes('admin')) return 'admin';
  if (email.includes('celebrity') || email.includes('star')) return 'celebrity';
  return 'user';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setUser(JSON.parse(data));
      setIsLoading(false);
    });
  }, []);

  const persist = useCallback(async (u: UserProfile) => {
    setUser(u);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const u = JSON.parse(stored) as UserProfile;
      if (u.email === email) {
        setUser(u);
        return;
      }
    }
    const newUser: UserProfile = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      email,
      firstName: '',
      lastName: '',
      phone: '',
      dob: '',
      address: '',
      plan: 'free',
      role: detectRole(email),
      walletBalance: 0,
      referralCode: generateReferralCode(email),
      profilePhoto: null,
      completionPct: 0,
    };
    await persist(newUser);
  }, []);

  const signup = useCallback(async (
    email: string,
    _password: string,
    firstName = '',
    lastName = '',
    phone = '',
    _referralCode?: string,
  ) => {
    const newUser: UserProfile = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
      email,
      firstName,
      lastName,
      phone,
      dob: '',
      address: '',
      plan: 'free',
      role: 'user',
      walletBalance: 500,
      referralCode: generateReferralCode(email),
      profilePhoto: null,
      completionPct: calcCompletion({ firstName, lastName, phone }),
    };
    await persist(newUser);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    updated.completionPct = calcCompletion(updated);
    await persist(updated);
  }, [user]);

  const updateWallet = useCallback((amount: number) => {
    if (!user) return;
    const updated = { ...user, walletBalance: Math.max(0, user.walletBalance + amount) };
    persist(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, signup, logout, updateProfile, updateWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
