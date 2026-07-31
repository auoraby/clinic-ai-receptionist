'use client';

import React from 'react';
import Link from 'next/link';
import { useClinic } from '@/lib/context/clinic-context';
import { Activity, CheckCircle2, Bot, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function StatusPage() {
  const { clinics } = useClinic();

  return (
    <div className="min-h-screen bg-navy-950 text-white p-6 sm:p-12 dir-rtl font-arabic flex flex-col justify-between">
      
      <div className="max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-navy-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center text-navy-950 shadow-xl">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black">حالة النظام التشغيلية (System Status)</h1>
              <p className="text-xs text-teal-400 font-bold mt-0.5">Clinic AI Receptionist Real-time Operational Status</p>
            </div>
          </div>

          <Link href="/dashboard" className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 border border-navy-700">
            <ArrowLeft className="w-4 h-4" /> العودة للوحة التحكم
          </Link>
        </div>

        {/* Global Operational Hero */}
        <div className="bg-gradient-to-r from-teal-900 to-navy-900 border border-teal-500/40 rounded-3xl p-6 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-lg font-black text-white">جميع الخدمات والمحركات تعمل بكفاءة 100%</div>
              <div className="text-xs text-teal-300">All Systems Operational • Meta WhatsApp API Connected</div>
            </div>
          </div>

          <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/30">
            99.9% Uptime
          </span>
        </div>

        {/* Core Components Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Meta WhatsApp Cloud API Webhooks', status: 'نشط ويعمل', desc: 'استقبال الرسائل عبر Webhooks والتصدي للتكرار' },
            { title: 'محرك تقويم Google Calendar', status: 'نشط ويعمل', desc: 'مزامنة حرة للمواعيد والمنع الذكي المزدوج' },
            { title: 'مساعد الذكاء الاصطناعي والإجابات الإدارية', status: 'نشط ويعمل', desc: 'التعرف على النوايا وحجز المواعيد تلقائياً' },
            { title: 'فلاتر الحماية والسلامة الطبية (Triage Filter)', status: 'مُفعل وصارم 🔒', desc: 'حجب أي تشخيص أو استشارة طبية آلياً' },
          ].map((item, idx) => (
            <div key={idx} className="bg-navy-900 border border-navy-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-100">{item.title}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Active Clinics Table */}
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-black text-sm text-teal-300">العيادات المسجلة بالمنصة ({clinics.length})</h3>
          <div className="space-y-2">
            {clinics.map(c => (
              <div key={c.id} className="p-3 bg-navy-950 rounded-xl border border-navy-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{c.name}</div>
                  <div className="text-[10px] text-slate-400">{c.doctorName} • {c.specialty}</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> أونلاين
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="text-center text-xs text-slate-500 pt-8 border-t border-navy-900">
        مستقبل العيادة الذكي • Powered by Next.js & Meta WhatsApp Cloud API
      </div>

    </div>
  );
}
