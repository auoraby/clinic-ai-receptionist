'use client';

import React from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { ShieldCheck, User, Clock } from 'lucide-react';

export default function AuditLogsPage() {
  const { activeClinic } = useClinic();
  const logs = clinicStore.getAuditLogs(activeClinic.id);

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            سجل التدقيق والعمليات الأمني (Audit Log)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            سجل غير قابل للتعديل لجميع تغييرات وإجراءات طاقم العيادة لـ {activeClinic.name}
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-3">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
            <tr>
              <th className="p-3">المستخدم / الموظف</th>
              <th className="p-3">نوع الإجراء (Action)</th>
              <th className="p-3">التفاصيل والتغيير</th>
              <th className="p-3">التاريخ والوقت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>{l.userName} ({l.userRole})</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-800">
                    {l.action}
                  </span>
                </td>
                <td className="p-3 text-slate-600">{l.details}</td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">
                  {new Date(l.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
