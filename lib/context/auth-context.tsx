'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserData, INITIAL_USERS } from '../mock-data';
import { clinicStore } from '../store';

interface AuthContextType {
  user: UserData | null;
  login: (email: string) => boolean;
  logout: () => void;
  switchUserRole: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default logged in as Clinic 1 Receptionist for rich immediate experience
  const [user, setUser] = useState<UserData | null>(INITIAL_USERS[2]);

  const login = (email: string) => {
    const found = clinicStore.getUserByEmail(email);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchUserRole = (userId: string) => {
    const found = INITIAL_USERS.find(u => u.id === userId);
    if (found) {
      setUser(found);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
