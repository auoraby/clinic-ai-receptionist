'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/context/auth-context';
import { clinicStore } from '@/lib/store';
import Logo from '@/components/Logo';
import {
  Building2, Users, CalendarCheck, MessageSquareText, TrendingUp,
  Plus, Settings, LogOut, ShieldCheck, Activity, CheckCircle2,
  Globe, Zap, Clock, DollarSign, ToggleRight
} from 'lucide-react';

export default function SuperAdminPortal() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const clinics  = clinicStore.getClinics();
  const allUsers = clinicStore.getAllUsers?.() ?? [];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Platform stats
  const totalAppointments = clinics.reduce((sum, c) =>
    sum + clinicStore.getAppointments(c.id).length, 0);
  const totalPatients = clinics.reduce((sum, c) =>
    sum + clinicStore.getPatients(c.id).length, 0);
  const activeClinics = clinics.filter(c => c.isActive).length;

  const platformStats = [
    { label: 'عيادات مفعّلة',        value: activeClinics,        icon: Building2,         color: 'text-[#00A8B5]',    bg: 'bg-[#E6F6F7]' },
    { label: 'إجمالي المرضى',        value: totalPatients,        icon: Users,             color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'إجمالي المواعيد',      value: totalAppointments,    icon: CalendarCheck,     color: 'text-purple-600',  bg: 'bg-purple-50' },
    { label: 'اشتراكات نشطة',        value: clinics.length,       icon: DollarSign,        color: 'text-amber-600',   bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>

      {/* ── Top Bar ──────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="sm" showTagline={true} />

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200">
              <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">
                {user?.name?.charAt(0) ?? 'م'}
              </div>
              <span className="text-xs font-bold text-purple-800">{user?.name}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Super Admin
              </span>
            </div>

            <Link href="/" className="btn btn-ghost text-xs">
              الموقع العام
            </Link>

            <button onClick={handleLogout}
              className="btn btn-ghost text-xs text-red-600 border-red-200 hover:bg-red-50">
              <LogOut className="w-3.5 h-3.5" />
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Welcome Header ──────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              لوحة إدارة المنصة 👑
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1">
              مرحباً {user?.name}! متابعة كاملة لكل العيادات والاشتراكات.
            </p>
          </div>
          <Link href="/setup-wizard"
            className="btn btn-primary btn-lg">
            <Plus className="w-4 h-4" />
            إضافة عيادة جديدة
          </Link>
        </div>

        {/* ── Platform KPI Stats ──────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {platformStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} whileHover={{ y: -2 }} className="stat-card">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">{stat.label}</span>
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="stat-value">{stat.value}</div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Clinics Management Grid ──────────────────── */}
        <div>
          <div className="section-header">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              العيادات المسجلة في المنصة
            </h2>
            <Link href="/setup-wizard" className="btn btn-ghost text-xs">
              <Plus className="w-3.5 h-3.5" /> إضافة عيادة
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {clinics.map(clinic => {
              const clinicAppts    = clinicStore.getAppointments(clinic.id);
              const clinicPatients = clinicStore.getPatients(clinic.id);
              const clinicQueue    = clinicStore.getQueue(clinic.id);
              const waitingNow     = clinicQueue.filter(q => q.status === 'WAITING').length;

              return (
                <motion.div key={clinic.id} whileHover={{ y: -2 }} className="card p-6 space-y-4">
                  {/* Clinic Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shrink-0">
                        {clinic.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{clinic.name}</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">{clinic.doctorName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{clinic.specialty}</p>
                      </div>
                    </div>
                    <span className={`badge ${clinic.isActive ? 'badge-green' : 'badge-red'} shrink-0`}>
                      {clinic.isActive ? '● نشطة' : '○ موقوفة'}
                    </span>
                  </div>

                  {/* Clinic Stats Row */}
                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100">
                    <div className="text-center">
                      <div className="text-lg font-black text-slate-900">{clinicAppts.length}</div>
                      <div className="text-[10px] text-slate-500 font-medium">موعد</div>
                    </div>
                    <div className="text-center border-x border-slate-100">
                      <div className="text-lg font-black text-slate-900">{clinicPatients.length}</div>
                      <div className="text-[10px] text-slate-500 font-medium">مريض</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-black ${waitingNow > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                        {waitingNow}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">ينتظر</div>
                    </div>
                  </div>

                  {/* Clinic Info */}
                  <div className="space-y-1.5 text-[11px] text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">الرابط:</span>
                      <Link href={`/c/${clinic.slug}`} target="_blank"
                        className="text-blue-600 hover:underline font-bold truncate">
                        /c/{clinic.slug}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">WhatsApp ID:</span>
                      <code className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                        {clinic.whatsappPhoneId}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-700">مواعيد العمل:</span>
                      <span>{clinic.workingHoursStart} — {clinic.workingHoursEnd}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Link href={`/c/${clinic.slug}`} target="_blank"
                      className="btn btn-ghost text-xs flex-1 justify-center">
                      صفحة المريض ↗
                    </Link>
                    <button
                      className={`btn text-xs flex-1 justify-center ${
                        clinic.isActive
                          ? 'btn-danger'
                          : 'btn-success'
                      }`}
                    >
                      <ToggleRight className="w-3.5 h-3.5" />
                      {clinic.isActive ? 'إيقاف مؤقت' : 'تفعيل'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Subscription Plans Overview ──────────────── */}
        <div>
          <div className="section-header">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              خطط الاشتراكات النشطة
            </h2>
          </div>

          <div className="card overflow-hidden">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>العيادة</th>
                  <th>الباقة</th>
                  <th>تاريخ التجديد</th>
                  <th>الحالة</th>
                  <th>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map(clinic => (
                  <tr key={clinic.id}>
                    <td>
                      <div className="font-bold text-slate-900 text-xs">{clinic.name}</div>
                      <div className="text-[10px] text-slate-400">{clinic.doctorName}</div>
                    </td>
                    <td>
                      <span className="badge badge-blue">الباقة المتقدمة</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 font-medium">2026-09-01</span>
                    </td>
                    <td>
                      <span className="badge badge-green">
                        <CheckCircle2 className="w-3 h-3" /> نشط
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost text-xs">إدارة</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Quick Links ──────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'معالج إضافة عيادة', href: '/setup-wizard', icon: Plus,         color: 'text-blue-600',    bg: 'bg-blue-50' },
            { label: 'سجل عمليات المنصة', href: '/audit-logs',   icon: ShieldCheck,  color: 'text-purple-600',  bg: 'bg-purple-50' },
            { label: 'حالة النظام',        href: '/status',       icon: Activity,     color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'الموقع الرئيسي',     href: '/',             icon: Globe,        color: 'text-slate-600',   bg: 'bg-slate-100' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}
                className="card p-4 flex flex-col items-center gap-2.5 text-center hover:shadow-md transition">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="text-xs font-bold text-slate-700">{item.label}</span>
              </Link>
            );
          })}
        </div>

      </main>
    </div>
  );
}
