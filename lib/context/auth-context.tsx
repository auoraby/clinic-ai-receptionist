'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserData, INITIAL_USERS } from '../mock-data';
import { clinicStore } from '../store';

// ─── Permission Matrix ──────────────────────────────────
// SUPER_ADMIN  → /admin (platform portal) + all
// DOCTOR       → /dashboard + all clinic pages + settings
// RECEPTIONIST → /dashboard + appointments/queue/conversations (no settings)
// ────────────────────────────────────────────────────────

export type UserRole = 'SUPER_ADMIN' | 'DOCTOR' | 'RECEPTIONIST';

export interface Permission {
  canAccessSettings: boolean;
  canAccessAdmin: boolean;
  canViewAuditLogs: boolean;
  canDeleteAppointments: boolean;
  canManageClinics: boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, Permission> = {
  SUPER_ADMIN: {
    canAccessSettings:    true,
    canAccessAdmin:       true,
    canViewAuditLogs:     true,
    canDeleteAppointments:true,
    canManageClinics:     true,
  },
  DOCTOR: {
    canAccessSettings:    true,
    canAccessAdmin:       false,
    canViewAuditLogs:     true,
    canDeleteAppointments:true,
    canManageClinics:     false,
  },
  RECEPTIONIST: {
    canAccessSettings:    false,
    canAccessAdmin:       false,
    canViewAuditLogs:     false,
    canDeleteAppointments:false,
    canManageClinics:     false,
  },
};

// Mock passwords for demo
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@clinicai.com':    'admin2026',
  'dr.sara@clinicai.com':  'sara2026',
  'rec.mona@clinicai.com': 'mona2026',
  'dr.kareem@clinicai.com':'kareem2026',
};

interface AuthContextType {
  user: UserData | null;
  permissions: Permission;
  login: (email: string, password: string) => { success: boolean; redirectTo: string; error?: string };
  logout: () => void;
  switchUserRole: (userId: string) => void;
  isAuthenticated: boolean;
}

const DEFAULT_PERMISSIONS: Permission = {
  canAccessSettings:    false,
  canAccessAdmin:       false,
  canViewAuditLogs:     false,
  canDeleteAppointments:false,
  canManageClinics:     false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  const permissions: Permission = user
    ? ROLE_PERMISSIONS[user.role as UserRole] ?? DEFAULT_PERMISSIONS
    : DEFAULT_PERMISSIONS;

  const login = (email: string, password: string) => {
    const found = clinicStore.getUserByEmail(email);

    if (!found) {
      return { success: false, redirectTo: '/login', error: 'البريد الإلكتروني غير مسجل في النظام' };
    }

    const correctPass = MOCK_PASSWORDS[email];
    if (correctPass && password !== correctPass) {
      return { success: false, redirectTo: '/login', error: 'كلمة المرور غير صحيحة' };
    }

    setUser(found);

    // Role-based redirect after login
    let redirectTo = '/dashboard';
    if (found.role === 'SUPER_ADMIN') redirectTo = '/admin';

    return { success: true, redirectTo };
  };

  const logout = () => setUser(null);

  const switchUserRole = (userId: string) => {
    const found = INITIAL_USERS.find(u => u.id === userId);
    if (found) setUser(found);
  };

  return (
    <AuthContext.Provider value={{
      user,
      permissions,
      login,
      logout,
      switchUserRole,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
