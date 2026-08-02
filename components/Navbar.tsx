'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { useClinic } from '@/lib/context/clinic-context';
import { INITIAL_USERS } from '@/lib/mock-data';
import { 
  HeartPulse, Menu, LogOut, ChevronDown, CheckCircle2,
  Building2, UserCog, Bell, Stethoscope
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { user, switchUserRole, logout } = useAuth();
  const { activeClinic, clinics, selectClinic } = useClinic();
  const [showClinic, setShowClinic] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const clinicRef = useRef<HTMLDivElement>(null);
  const roleRef   = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (clinicRef.current && !clinicRef.current.contains(e.target as Node)) setShowClinic(false);
      if (roleRef.current   && !roleRef.current.contains(e.target as Node))   setShowRole(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleLabel = (r?: string) => (
    { SUPER_ADMIN: 'مدير النظام', DOCTOR: 'طبيب', RECEPTIONIST: 'استقبال' }[r ?? ''] ?? 'زائر'
  );

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
      <div className="max-w-full px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* ── Right: Hamburger + Brand ─────── */}
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
            aria-label="القائمة">
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <HeartPulse className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-sm text-slate-900 tracking-tight leading-none block">
                مستقبل العيادة
              </span>
              <span className="text-[10px] font-semibold text-slate-400 leading-none block mt-0.5">
                الذكي AI Receptionist
              </span>
            </div>
          </Link>
        </div>

        {/* ── Center: Clinic Switcher ──────── */}
        <div className="flex-1 flex justify-center" ref={clinicRef}>
          <div className="relative">
            <button onClick={() => setShowClinic(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200
                         bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition">
              <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="max-w-[180px] truncate">{activeClinic.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showClinic ? 'rotate-180' : ''}`} />
            </button>

            {showClinic && (
              <div className="absolute top-full mt-2 right-1/2 translate-x-1/2 w-72 bg-white
                              border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-fade-up">
                <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  اختيار العيادة
                </p>
                {clinics.map(c => (
                  <button key={c.id}
                    onClick={() => { selectClinic(c.id); setShowClinic(false); }}
                    className={`w-full text-right px-3 py-2.5 text-xs flex items-center gap-2.5
                                hover:bg-slate-50 transition font-medium
                                ${activeClinic.id === c.id ? 'text-blue-600' : 'text-slate-700'}`}>
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center
                                    justify-center text-[10px] font-black shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-bold">{c.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{c.doctorName}</div>
                    </div>
                    {activeClinic.id === c.id && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mr-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Left: Role + Logout ──────────── */}
        <div className="flex items-center gap-2 shrink-0" ref={roleRef}>

          {/* Notification placeholder */}
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition relative">
            <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button onClick={() => setShowRole(v => !v)}
              className="flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg border border-slate-200
                         bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center
                              text-[10px] font-black shrink-0">
                {user?.name?.charAt(0) ?? 'م'}
              </div>
              <span className="hidden sm:block max-w-[90px] truncate">{user?.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showRole ? 'rotate-180' : ''}`} />
            </button>

            {showRole && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-slate-200
                              rounded-xl shadow-lg py-1.5 z-50 animate-fade-up">
                <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  تجربة أدوار النظام
                </p>
                {INITIAL_USERS.map(u => (
                  <button key={u.id}
                    onClick={() => { switchUserRole(u.id); setShowRole(false); }}
                    className={`w-full text-right px-3 py-2.5 text-xs flex items-center gap-2.5
                                hover:bg-slate-50 transition
                                ${user?.id === u.id ? 'text-blue-600 font-bold' : 'text-slate-700 font-medium'}`}>
                    <UserCog className="w-3.5 h-3.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="truncate font-bold">{u.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{u.email}</div>
                    </div>
                    <span className="mr-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full
                                     bg-slate-100 text-slate-600 shrink-0">
                      {roleLabel(u.role)}
                    </span>
                  </button>
                ))}
                <div className="my-1 border-t border-slate-100" />
                <Link href="/login" onClick={logout}
                  className="w-full text-right px-3 py-2 text-xs flex items-center gap-2 text-red-600
                             hover:bg-red-50 font-bold transition rounded-b-xl">
                  <LogOut className="w-3.5 h-3.5" />
                  تسجيل الخروج
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
