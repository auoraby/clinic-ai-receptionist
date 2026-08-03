'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { INITIAL_USERS } from '@/lib/mock-data';
import { HeartPulse, Mail, Lock, ArrowLeft, Zap, ShieldCheck, Eye, EyeOff } from 'lucide-react';

// Demo role presets with passwords shown
const DEMO_ROLES = [
  {
    id:    'usr-admin',
    label: 'صاحب النظام',
    desc:  'إدارة كل العيادات والمنصة',
    email: 'admin@clinicai.com',
    pass:  'admin2026',
    badge: 'Super Admin',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    dot:   'bg-purple-500',
    redirectHint: '← /admin',
  },
  {
    id:    'usr-doc1',
    label: 'د. سارة الشريف',
    desc:  'طبيبة عيادة التجميل الدقيق',
    email: 'dr.sara@clinicai.com',
    pass:  'sara2026',
    badge: 'دكتور',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    dot:   'bg-blue-500',
    redirectHint: '← /dashboard',
  },
  {
    id:    'usr-rec1',
    label: 'منى أحمد',
    desc:  'موظفة الاستقبال - عيادة د. سارة',
    email: 'rec.mona@clinicai.com',
    pass:  'mona2026',
    badge: 'استقبال',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    dot:   'bg-emerald-500',
    redirectHint: '← /dashboard',
  },
];

export default function LoginPage() {
  const { login, switchUserRole } = useAuth();
  const router = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 400)); // fake latency

    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      router.push(result.redirectTo);
    } else {
      setError(result.error || 'حدث خطأ');
    }
  };

  const handleQuickLogin = (role: typeof DEMO_ROLES[0]) => {
    switchUserRole(role.id);
    router.push(role.id === 'usr-admin' ? '/admin' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>

      {/* ── Left Panel: Branding ─────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-950 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-base tracking-tight">مستقبل العيادة الذكي</span>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              منصة أتمتة استقبال العيادات بالذكاء الاصطناعي
            </div>
            <h1 className="text-3xl font-black leading-tight text-white">
              مرحباً بك في<br />
              <span className="text-blue-400">لوحة التحكم</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              سجّل دخولك للوصول لعيادتك وإدارة الواتساب الآلي، الحجوزات، وطابور الانتظار.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: '🤖', text: 'رد آلي على الواتساب 24/7' },
              { icon: '📅', text: 'حجز مواعيد بدون تدخل يدوي' },
              { icon: '🏥', text: 'طابور انتظار وشاشة TV' },
              { icon: '🛡️', text: 'فلتر حماية طبية صارم' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <span className="text-base">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-600 font-medium">
          © 2026 مستقبل العيادة الذكي • مشفر بمعايير Meta WhatsApp Security
        </div>
      </div>

      {/* ── Right Panel: Login Form ──────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="max-w-md w-full mx-auto space-y-8">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-slate-900">مستقبل العيادة الذكي</span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900">تسجيل الدخول</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">ادخل بريدك الإلكتروني وكلمة المرور</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني المهني
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="doctor@clinic.com"
                  className="input pr-9"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="input pr-9 pl-9"
                  required
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary btn-lg w-full justify-center mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الدخول...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  الدخول للوحة التحكم
                  <ArrowLeft className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs font-bold text-slate-400 bg-[#F7F8FA] px-3">
              <span className="bg-[#F7F8FA] px-3">أو جرّب Demo سريع</span>
            </div>
          </div>

          {/* Demo Role Buttons */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              دخول سريع للتجربة (بدون كلمة مرور)
            </div>

            {DEMO_ROLES.map(role => (
              <button key={role.id} onClick={() => handleQuickLogin(role)}
                className={`w-full p-3.5 rounded-xl border text-right transition hover:shadow-sm flex items-center gap-3 ${role.color}`}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${role.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{role.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/60 opacity-80">
                      {role.badge}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-70 mt-0.5 font-medium">{role.desc}</div>
                </div>
                <span className="text-[10px] font-bold opacity-60 shrink-0">{role.redirectHint}</span>
              </button>
            ))}
          </div>

          {/* Patient hint */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-bold text-amber-900 mb-1">🙋 هل أنت مريض وتريد الحجز؟</p>
            <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
              المريض لا يحتاج لتسجيل دخول هنا. يمكنك الحجز مباشرة عبر{' '}
              <Link href="/clinics" className="underline font-bold hover:text-amber-900">دليل العيادات</Link>
              {' '}أو عبر رابط عيادتك المخصص.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
