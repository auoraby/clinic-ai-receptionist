'use client';

import React from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { BellRing, Clock, Send, CheckCheck, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RemindersPage() {
  const { activeClinic } = useClinic();
  const reminders = clinicStore.getReminders(activeClinic.id);

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <BellRing className="w-6 h-6 text-teal-600" />
            التذكيرات التلقائية وجدولة المواعيد
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إعداد أوقات التذكيرات وتتبع حالة التوصيل عبر الواتساب لـ {activeClinic.name}
          </p>
        </div>
      </div>

      {/* Rules Config Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
          قواعد التذكير الآلي المفعلة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-teal-900">تذكير قبل الموعد بـ 24 ساعة</span>
              <span className="text-[10px] bg-teal-600 text-white font-extrabold px-2 py-0.5 rounded">مفعل 🟢</span>
            </div>
            <p className="text-[11px] text-teal-800">
              يحتوي على أزرار التفاعل المباشرة (تأكيد الحضور ، التأجيل ، الإلغاء).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-teal-900">تذكير قبل الموعد بـ 2 ساعة</span>
              <span className="text-[10px] bg-teal-600 text-white font-extrabold px-2 py-0.5 rounded">مفعل 🟢</span>
            </div>
            <p className="text-[11px] text-teal-800">
              يتضمن رابط الموقع الخرائط والرقم التعريفي للاستقبال.
            </p>
          </div>
        </div>
      </div>

      {/* Reminders Jobs Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900">سجل التذكيرات المجدولة والمرسلة</h3>

        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
            <tr>
              <th className="p-3">اسم المريض</th>
              <th className="p-3">نوع التذكير</th>
              <th className="p-3">الموعد المجدول للإرسال</th>
              <th className="p-3">حالة التوصيل (Status)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {reminders.map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{r.patientName}</td>
                <td className="p-3">{r.reminderType === 'HOURS_24' ? 'قبل 24 ساعة' : 'قبل ساعتين'}</td>
                <td className="p-3 text-slate-600 font-mono">
                  {new Date(r.scheduledTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-3">
                  <span className="bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full text-[10px] flex items-center gap-1 w-fit">
                    <CheckCheck className="w-3 h-3 text-teal-600" /> {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
