'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { UserSquare2, Search, Phone, FileText, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientsPage() {
  const { activeClinic } = useClinic();
  const [search, setSearch] = useState('');

  const patients = clinicStore.getPatients(activeClinic.id);
  const appointments = clinicStore.getAppointments(activeClinic.id);

  const filtered = patients.filter(p => p.name.includes(search) || p.phone.includes(search));

  return (
    <div className="page-wrapper animate-fade-up">
      {/* Header */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UserSquare2 className="w-5 h-5 text-blue-600" />
            سجل المرضى الإداري
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
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
            className="input w-full pr-9"
          />
        </div>
      </div>

      {/* Compliance Note */}
      <motion.div whileHover={{ y: -2 }} className="badge badge-amber p-4 mb-6 w-full text-xs font-medium flex items-center gap-2 rounded-xl text-amber-900 bg-amber-50 border border-amber-200">
        <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
        تنويه حماية البيانات: يحتوي النظام على السجلات الإدارية والتواصل فقط دون تخزين أي ملفات أو تشخيصات أو روشتات طبية.
      </motion.div>

      {/* Patients Table */}
      <div className="card overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-sm font-bold text-slate-900">سجل المرضى</h2>
        </div>
        <table className="table-clean w-full text-right">
          <thead>
            <tr>
              <th>المريض</th>
              <th>رقم الواتساب</th>
              <th>سجل المواعيد</th>
              <th>التواصل</th>
              <th>ملاحظات</th>
            </tr>
          </thead>
          <tbody>
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
                  <tr key={pat.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {pat.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{pat.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-slate-600 font-mono text-xs">
                        <Phone className="w-3.5 h-3.5 text-blue-600" /> {pat.phone}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-blue">
                        {history.length} حجز مسجل
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-green">
                        {pat.communicationPref}
                      </span>
                    </td>
                    <td className="text-slate-500 text-xs">{pat.notes || 'لا يوجد'}</td>
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
