'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  CheckCircle, 
  Filter,
  Phone,
  X
} from 'lucide-react';

export default function AppointmentsPage() {
  const { activeClinic } = useClinic();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [tick, setTick] = useState(0);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [typeId, setTypeId] = useState('');
  const [timeSlot, setTimeSlot] = useState('14:00');

  const refresh = () => setTick(t => t + 1);

  const appointments = clinicStore.getAppointments(activeClinic.id);
  const types = clinicStore.getAppointmentTypes(activeClinic.id);

  const filtered = appointments.filter(a => {
    const matchesSearch = a.patientName.includes(search) || a.patientPhone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    let pat = clinicStore.getPatients(activeClinic.id).find(p => p.phone === patientPhone);
    if (!pat) {
      pat = clinicStore.addPatient(activeClinic.id, patientName, patientPhone);
    }

    const selectedType = types.find(t => t.id === typeId) || types[0];

    const todayStr = new Date().toISOString().split('T')[0];
    const startIso = `${todayStr}T${timeSlot}:00Z`;
    const endIso = `${todayStr}T${timeSlot}:30Z`;

    clinicStore.addAppointment({
      clinicId: activeClinic.id,
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      appointmentTypeId: selectedType.id,
      appointmentTypeName: selectedType.name,
      startDateTime: startIso,
      endDateTime: endIso,
      status: 'CONFIRMED',
      notes: 'تم الإنشاء يدوياً بواسطة الموظف',
    });

    setShowAddModal(false);
    setPatientName('');
    setPatientPhone('');
    refresh();
  };

  const updateStatus = (id: string, newStatus: any) => {
    clinicStore.updateAppointmentStatus(id, newStatus);
    refresh();
  };

  return (
    <div className="page-wrapper space-y-6 animate-fade-up">
      
      {/* Page Header */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            إدارة المواعيد
          </h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            إضافة، تعديل، ومتابعة المواعيد لـ {activeClinic.name}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          حجز موعد جديد
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المريض أو رقم الهاتف..."
            className="input pr-9 w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          <Filter className="w-4 h-4 text-slate-400 ml-2" />
          {[
            { id: 'ALL', label: 'الكل' },
            { id: 'CONFIRMED', label: 'مؤكد' },
            { id: 'PATIENT_ARRIVED', label: 'وصل' },
            { id: 'IN_CONSULTATION', label: 'في الكشف' },
            { id: 'COMPLETED', label: 'مكتمل' },
            { id: 'CANCELLED', label: 'ملغى' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                statusFilter === f.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List Table */}
      <div className="card overflow-hidden">
        <div className="section-header px-6 py-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">جدول المواعيد</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table-clean w-full text-right">
            <thead>
              <tr>
                <th>اسم المريض</th>
                <th>نوع الخدمة</th>
                <th>الوقت</th>
                <th>الحالة</th>
                <th>Calendar</th>
                <th className="text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-medium">
                    لا توجد مواعيد مسجلة بهذه الفلاتر
                  </td>
                </tr>
              ) : (
                filtered.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1 font-medium">
                        <Phone className="w-3 h-3" /> <span className="dir-ltr inline-block">{apt.patientPhone}</span>
                      </div>
                    </td>
                    <td className="font-medium text-slate-700">{apt.appointmentTypeName}</td>
                    <td className="font-bold text-blue-600">
                      {new Date(apt.startDateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td>
                      <span className={`badge ${getBadgeStyle(apt.status)}`}>
                        {getBadgeLabel(apt.status)}
                      </span>
                    </td>
                    <td>
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg w-fit">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> متزامن
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            clinicStore.markPatientArrived(activeClinic.id, apt.patientId, apt.patientName, apt.patientPhone, apt.id);
                            refresh();
                          }}
                          className="btn btn-ghost bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 text-[11px]"
                        >
                          وصل
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'COMPLETED')}
                          className="btn btn-ghost bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 text-[11px]"
                        >
                          اكتمل
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'CANCELLED')}
                          className="btn btn-ghost bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-[11px]"
                        >
                          إلغاء
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-md w-full p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-base font-black text-slate-900">
                حجز موعد جديد
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المريض الكامل</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="مثال: ياسمين عبد العزيز"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف (الواتساب)</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+201012345678"
                  className="input w-full dir-ltr text-left"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الخدمة</label>
                <select
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                  className="input w-full bg-white"
                >
                  {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.durationMinutes} دقيقة)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">وقت الموعد اليوم</label>
                <input
                  type="time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-ghost px-5"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-6"
                >
                  تأكيد الحجز
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}

function getBadgeStyle(status: string) {
  switch (status) {
    case 'CONFIRMED': return 'badge-blue';
    case 'PATIENT_ARRIVED': return 'badge-amber';
    case 'IN_CONSULTATION': return 'badge-green';
    case 'COMPLETED': return 'badge-slate';
    case 'CANCELLED': return 'badge-red';
    default: return 'badge-slate';
  }
}

function getBadgeLabel(status: string) {
  switch (status) {
    case 'CONFIRMED': return 'مؤكد';
    case 'PATIENT_ARRIVED': return 'وصل العيادة';
    case 'IN_CONSULTATION': return 'في الكشف';
    case 'COMPLETED': return 'مكتمل';
    case 'CANCELLED': return 'ملغى';
    default: return status;
  }
}
