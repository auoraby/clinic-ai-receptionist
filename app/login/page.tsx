'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { INITIAL_USERS } from '@/lib/mock-data';
import { Bot, Lock, Mail, ShieldCheck, User, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('rec.mona@clinicai.com');
  const [password, setPassword] = useState('staff123');
  const [error, setError] = useState('');
  const { login, switchUserRole } = useAuth();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('البريد الإلكتروني غير مسجل بالعيادة');
    }
  };

  const handleQuickDemoRole = (userId: string) => {
    switchUserRole(userId);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-teal-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 dir-rtl">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center shadow-xl shadow-teal-500/20 mb-4">
          <Bot className="w-10 h-10 text-navy-900" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          مستقبل العيادة الذكي
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-teal-300 font-medium">
          نظام الاستقبال المعتمد وحجز المواعيد الآلي عبر WhatsApp Meta
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-navy-900/80 backdrop-blur-xl border border-navy-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          
          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                البريد الإلكتروني المهني
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="doctor@clinic.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                كلمة المرور
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-navy-900 bg-teal-400 hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition shadow-lg shadow-teal-400/20"
            >
              الدخول لعيادتك
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* Preset Roles Demo Panel */}
          <div className="mt-6 pt-6 border-t border-navy-800">
            <p className="text-[11px] font-bold text-teal-400 mb-3 text-center">
              ⚡ الدخول السريع لأدوار العرض (Demo Preset Roles)
            </p>

            <div className="space-y-2">
              {INITIAL_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickDemoRole(u.id)}
                  className="w-full text-right p-2.5 rounded-xl bg-navy-800/80 hover:bg-navy-700 border border-navy-700/60 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-navy-950 text-teal-300 border border-navy-700">
                    {u.role === 'SUPER_ADMIN' ? 'مدير النظام' : u.role === 'DOCTOR' ? 'الطبيب' : 'الاستقبال'}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        <p className="mt-4 text-center text-[10px] text-slate-400">
          مشفر بموجب معايير Meta WhatsApp Security & Privacy Directives 🔒
        </p>
      </div>

    </div>
  );
}
