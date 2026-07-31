'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { Monitor, Clock, ShieldCheck, HeartPulse } from 'lucide-react';

export default function PublicQueueDisplayPage() {
  const { activeClinic } = useClinic();
  const [tick, setTick] = useState(0);

  // Auto refresh every 5 seconds for TV screen
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);

  const queue = clinicStore.getQueue(activeClinic.id);
  const currentInConsult = queue.find(q => q.status === 'IN_CONSULTATION');
  const waitingList = queue.filter(q => q.status === 'WAITING');

  return (
    <div className="min-h-screen bg-navy-950 text-white p-6 sm:p-10 flex flex-col justify-between dir-rtl font-arabic">
      
      {/* Top TV Header */}
      <div className="flex items-center justify-between border-b border-navy-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center text-navy-950 shadow-xl">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {activeClinic.name}
            </h1>
            <p className="text-sm text-teal-400 font-bold mt-1">
              شاشة الانتظار العامة • {activeClinic.doctorName} ({activeClinic.specialty})
            </p>
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-700 px-4 py-2 rounded-xl text-left">
          <div className="text-2xl font-black text-limeAccent-400">
            {new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">تحديث تلقائي متاح</div>
        </div>
      </div>

      {/* Main Grid: In Consultation Hero & Next Waiting List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-8 flex-1">
        
        {/* Left 2 Columns: Patient Currently Inside */}
        <div className="lg:col-span-2 bg-gradient-to-br from-navy-900 via-navy-900 to-teal-950 rounded-3xl p-8 border-2 border-teal-500/40 shadow-2xl flex flex-col justify-center items-center text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-limeAccent-500/20 text-limeAccent-400 text-xs font-extrabold px-4 py-1.5 rounded-full border border-limeAccent-500/40 animate-pulse">
            🟢 الجاري كشفه الآن بالداخل
          </div>

          {currentInConsult ? (
            <div className="space-y-4">
              <span className="text-sm font-bold text-slate-300">تفضل بالدخول لغرفة الكشف:</span>
              <div className="text-7xl sm:text-9xl font-black text-limeAccent-400 tracking-wider">
                Q-{currentInConsult.queueNumber}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                المريض: {maskPatientName(currentInConsult.patientName)}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-5xl font-extrabold text-slate-400">
                غرفة الكشف جاهزة
              </div>
              <p className="text-sm text-slate-400">يرجى الانتظار لحين استدعاء الرقم التالي</p>
            </div>
          )}
        </div>

        {/* Right 1 Column: Next Patients Waiting List */}
        <div className="bg-navy-900/90 border border-navy-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <h2 className="text-lg font-extrabold text-teal-300 border-b border-navy-800 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-400" />
              الأدوار التالية المنتظرة
            </h2>

            <div className="space-y-3 mt-4">
              {waitingList.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  لا يوجد منتظرين حالياً
                </div>
              ) : (
                waitingList.slice(0, 5).map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border flex items-center justify-between transition ${
                      idx === 0
                        ? 'bg-teal-950/70 border-teal-500/50 text-white'
                        : 'bg-navy-950 border-navy-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-teal-500 text-navy-950 font-black text-sm flex items-center justify-center shadow">
                        {item.queueNumber}
                      </span>
                      <span className="font-extrabold text-sm">
                        {maskPatientName(item.patientName)}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-bold">
                      {idx === 0 ? 'التالي مباشرة' : `بعد ${idx * activeClinic.avgConsultationMins} دقيقة`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-navy-950 p-3.5 rounded-2xl border border-navy-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            تنبيه الخصوصية: يتم تشفير أسماء وأرقام المرضى على الشاشة العامة طبقاً للقانون 🔒
          </div>
        </div>

      </div>

      {/* Footer Banner */}
      <div className="text-center text-xs text-slate-500 border-t border-navy-800 pt-4">
        نظام مستقبل العيادة الذكي • Meta WhatsApp AI Receptionist & Appointment Engine
      </div>

    </div>
  );
}

/**
 * Privacy Masking Helper function to hide sensitive patient names on public TV screens
 * Example: "نورهان صبري" -> "ن*** ص***"
 */
function maskPatientName(name: string): string {
  if (!name) return 'مريض';
  const parts = name.split(' ');
  return parts.map(p => p.charAt(0) + '***').join(' ');
}
