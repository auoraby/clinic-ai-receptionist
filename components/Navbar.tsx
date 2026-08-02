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
  Menu, 
  LogOut, 
  CheckCircle2,
  ChevronDown,
  Sparkles,
  HeartPulse
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, switchUserRole, logout } = useAuth();
  const { activeClinic, clinics, selectClinic } = useClinic();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cobalt-950 text-white shadow-lg border-b border-cobalt-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Right Section: Mobile Toggle & Brand Logo */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-cobalt-900 lg:hidden focus:outline-none"
            aria-label="القائمة"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/dashboard" className="flex items-center space-x-2.5 space-x-reverse group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cobalt-500 to-mint-400 flex items-center justify-center shadow-lg shadow-cobalt-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-tight">
                مستقبل العيادة <span className="text-mint-300 font-bold text-sm">الذكي</span>
              </span>
              <span className="text-[10px] text-cobalt-200 font-medium block">Meta WhatsApp AI Receptionist</span>
            </div>
          </Link>
        </div>

        {/* Center Section: Multi-Tenant Clinic Switcher */}
        <div className="hidden md:flex items-center space-x-4 space-x-reverse">
          <div className="relative">
            <button
              onClick={() => setShowClinicDropdown(!showClinicDropdown)}
              className="flex items-center space-x-2 space-x-reverse bg-cobalt-900 border border-cobalt-800 hover:border-mint-400/50 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-100 transition shadow-sm"
            >
              <Building2 className="w-4 h-4 text-mint-400" />
              <span className="max-w-[200px] truncate">{activeClinic.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {showClinicDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 text-slate-900">
                <div className="px-3.5 py-2 text-[11px] font-extrabold text-cobalt-700 bg-slate-50 border-b border-slate-100">
                  اختيار العيادة / المركز الطبي
                </div>
                {clinics.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      selectClinic(c.id);
                      setShowClinicDropdown(false);
                    }}
                    className={`w-full text-right px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition ${
                      activeClinic.id === c.id ? 'text-cobalt-700 font-bold bg-cobalt-50/80' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="truncate font-bold">{c.name}</div>
                      <div className="text-[10px] text-slate-400">{c.doctorName}</div>
                    </div>
                    {activeClinic.id === c.id && <CheckCircle2 className="w-4 h-4 text-cobalt-600" />}
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
              className="flex items-center space-x-1.5 space-x-reverse bg-mint-950/80 border border-mint-500/40 px-3 py-1.5 rounded-xl text-xs font-bold text-mint-200 hover:bg-mint-900 transition shadow-sm"
            >
              <UserCheck className="w-4 h-4 text-mint-300" />
              <span>{user?.name} ({getRoleBadgeAr(user?.role)})</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showRoleDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 text-slate-900">
                <div className="px-3.5 py-2 text-[11px] font-extrabold text-cobalt-700 bg-slate-50 border-b border-slate-100">
                  تجربة أدوار المستخدمين
                </div>
                {INITIAL_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUserRole(u.id);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-right px-3.5 py-2 text-xs hover:bg-slate-50 flex items-center justify-between transition ${
                      user?.id === u.id ? 'text-cobalt-700 font-bold bg-cobalt-50' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
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
            className="p-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-cobalt-900 transition"
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
