'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { UserSquare2, Search, Phone, FileText, Calendar, ShieldCheck } from 'lucide-react';

export default function PatientsPage() {
  const { activeClinic } = useClinic();
  const [search, setSearch] = useState('');

  const patients = clinicStore.getPatients(activeClinic.id);
  const appointments = clinicStore.getAppointments(activeClinic.id);

  const filtered = patients.filter(p => p.name.includes(search) || p.phone.includes(search));

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <UserSquare2 className="w-6 h-6 text-teal-600" />
            سجل المرضى الإداري
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            الحد الأدنى من البيانات الإدارية المسجلة لـ {activeClinic.name}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المريض أو الهواتف..."
            className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Compliance Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-amber-900 text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
        تنويه حماية البيانات: يحتوي النظام على السجلات الإدارية والتواصل فقط دون تخزين أي ملفات أو تشخيصات أو روشتات طبية.
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
            <tr>
              <th className="p-3.5">اسم المريض</th>
              <th className="p-3.5">رقم الواتساب</th>
              <th className="p-3.5">سجل المواعيد السابق</th>
              <th className="p-3.5">تفضيل التواصل</th>
              <th className="p-3.5">ملاحظات إدارية</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-slate-400">
                  لا يوجد مرضى مسجلين بهاتين الكلمتين
                </td>
              </tr>
            ) : (
              filtered.map(pat => {
                const history = appointments.filter(a => a.patientId === pat.id);

                return (
                  <tr key={pat.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-900">{pat.name}</td>
                    <td className="p-3.5 font-mono text-slate-600 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-teal-600" /> {pat.phone}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded border border-teal-200">
                        {history.length} حجز مسجل
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {pat.communicationPref}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 text-[11px]">{pat.notes || 'لا يوجد'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
