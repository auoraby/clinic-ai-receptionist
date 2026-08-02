'use client';

import React from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { BellRing, Clock, Send, CheckCheck, AlertTriangle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RemindersPage() {
  const { activeClinic } = useClinic();
  const reminders = clinicStore.getReminders(activeClinic.id);

  return (
    <div className="page-wrapper animate-fade-up">
      
      {/* Header */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-blue-600" />
            التذكيرات التلقائية وجدولة المواعيد
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            إعداد أوقات التذكيرات وتتبع حالة التوصيل عبر الواتساب لـ {activeClinic.name}
          </p>
        </div>
      </div>

      {/* Rules Config Panel */}
      <div className="card p-6 mb-6">
        <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-4">
          قواعد التذكير الآلي المفعلة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-900">تذكير قبل الموعد بـ 24 ساعة</span>
              <span className="badge badge-blue px-2.5 py-1">مفعل 🟢</span>
            </div>
            <p className="text-xs text-blue-800/80 font-medium leading-relaxed">
              يحتوي على أزرار التفاعل المباشرة (تأكيد الحضور ، التأجيل ، الإلغاء).
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} className="p-5 rounded-2xl border border-blue-100 bg-blue-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-blue-900">تذكير قبل الموعد بـ 2 ساعة</span>
              <span className="badge badge-blue px-2.5 py-1">مفعل 🟢</span>
            </div>
            <p className="text-xs text-blue-800/80 font-medium leading-relaxed">
              يتضمن رابط الموقع الخرائط والرقم التعريفي للاستقبال.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Reminders Jobs Status Table */}
      <div className="card overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h3 className="font-extrabold text-sm text-slate-900">سجل التذكيرات المجدولة والمرسلة</h3>
        </div>

        <table className="table-clean w-full">
          <thead>
            <tr>
              <th>اسم المريض</th>
              <th>نوع التذكير</th>
              <th>الموعد المجدول للإرسال</th>
              <th>حالة التوصيل (Status)</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map(r => (
              <tr key={r.id}>
                <td className="font-bold text-slate-900">{r.patientName}</td>
                <td className="text-slate-600 text-sm font-medium">{r.reminderType === 'HOURS_24' ? 'قبل 24 ساعة' : 'قبل ساعتين'}</td>
                <td className="text-slate-500 font-mono text-sm">
                  {new Date(r.scheduledTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>
                  <span className="badge badge-green flex items-center gap-1.5 w-fit py-1 px-2.5">
                    <CheckCheck className="w-3.5 h-3.5" /> {r.status}
                  </span>
                </td>
              </tr>
            ))}
            {reminders.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-slate-500">لا يوجد تذكيرات مسجلة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
