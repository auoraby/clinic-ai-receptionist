'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { useClinic } from '@/lib/context/clinic-context';
import { INITIAL_USERS } from '@/lib/mock-data';
import { 
  Building2, 
  UserCheck, 
  Bot, 
  ShieldAlert, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, switchUserRole, logout } = useAuth();
  const { activeClinic, clinics, selectClinic } = useClinic();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-navy-900 text-white shadow-md border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Right Section: Mobile Toggle & Brand Logo */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 lg:hidden focus:outline-none"
            aria-label="القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/dashboard" className="flex items-center space-x-2.5 space-x-reverse group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-navy-900" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                مستقبل العيادة <span className="text-teal-400 font-bold text-sm">الذكي</span>
              </span>
              <span className="text-[10px] text-teal-300 font-medium block">Meta WhatsApp AI Receptionist</span>
            </div>
          </Link>
        </div>

        {/* Center Section: Multi-Tenant Clinic Switcher */}
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <button
              onClick={() => setShowClinicDropdown(!showClinicDropdown)}
              className="flex items-center space-x-2 space-x-reverse bg-navy-800 border border-navy-700 hover:border-teal-500/50 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 transition"
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span className="max-w-[200px] truncate">{activeClinic.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showClinicDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-teal-400 border-b border-navy-700">
                  اختيار العيادة / المركز الطبي
                </div>
                {clinics.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      selectClinic(c.id);
                      setShowClinicDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-navy-700 ${
                      activeClinic.id === c.id ? 'text-teal-300 font-bold bg-navy-700/50' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="truncate">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.doctorName}</div>
                    </div>
                    {activeClinic.id === c.id && <CheckCircle2 className="w-4 h-4 text-teal-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Left Section: Role Demo Switcher & User Profile */}
        <div className="flex items-center space-x-3 space-x-reverse">
          {/* Quick Role Switcher for Testing */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center space-x-1.5 space-x-reverse bg-teal-900/60 border border-teal-500/40 px-3 py-1.5 rounded-lg text-xs font-bold text-teal-200 hover:bg-teal-900 transition"
            >
              <UserCheck className="w-4 h-4 text-teal-300" />
              <span>{user?.name} ({getRoleBadgeAr(user?.role)})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showRoleDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-[11px] font-bold text-teal-400 border-b border-navy-700">
                  تجربة أدوار المستخدمين
                </div>
                {INITIAL_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUserRole(u.id);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-xs hover:bg-navy-700 flex items-center justify-between ${
                      user?.id === u.id ? 'text-teal-300 font-bold bg-navy-700' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div>{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-900 border border-navy-700">
                      {getRoleBadgeAr(u.role)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/login"
            onClick={logout}
            className="p-2 rounded-lg text-slate-300 hover:text-red-400 hover:bg-navy-800 transition"
            title="تسجيل الخروج"
          >
            <LogOut className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </header>
  );
}

function getRoleBadgeAr(role?: string) {
  switch (role) {
    case 'SUPER_ADMIN': return 'مدير النظام';
    case 'DOCTOR': return 'طبيب العيادة';
    case 'RECEPTIONIST': return 'استقبال';
    default: return 'زائر';
  }
}
