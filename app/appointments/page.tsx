'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  Filter,
  Calendar as CalendarIcon,
  Phone,
  FileText
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
    <div className="space-y-6 dir-rtl">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-teal-600" />
            إدارة المواعيد والمتابعات
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إضافة، تعديل، تأكيد، ومزامنة المواعيد مع Google Calendar لـ {activeClinic.name}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          حجز موعد جديد
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث باسم المريض أو رقم الهاتف..."
            className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 ml-1" />
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
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                statusFilter === f.id
                  ? 'bg-teal-600 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
              <tr>
                <th className="p-3.5">اسم المريض</th>
                <th className="p-3.5">نوع الكشف / الخدمة</th>
                <th className="p-3.5">توقيت الموعد</th>
                <th className="p-3.5">الحالة</th>
                <th className="p-3.5">تزامن Google Calendar</th>
                <th className="p-3.5 text-center">إجراءات سريعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    لا توجد مواعيد مسجلة بهذه الفلاتر
                  </td>
                </tr>
              ) : (
                filtered.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 inline" /> {apt.patientPhone}
                      </div>
                    </td>
                    <td className="p-3.5">{apt.appointmentTypeName}</td>
                    <td className="p-3.5 font-bold text-teal-700">
                      {new Date(apt.startDateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getBadgeStyle(apt.status)}`}>
                        {getBadgeLabel(apt.status)}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-500">
                      <span className="text-teal-600 font-bold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> متزامن ({apt.googleEventId || 'goog_sync'})
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            clinicStore.markPatientArrived(activeClinic.id, apt.patientId, apt.patientName, apt.patientPhone, apt.id);
                            refresh();
                          }}
                          className="px-2 py-1 bg-teal-600 text-white rounded text-[10px] font-bold hover:bg-teal-700"
                        >
                          وصل
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'COMPLETED')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold hover:bg-emerald-700"
                        >
                          اكتمل
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'CANCELLED')}
                          className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold hover:bg-red-200"
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
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              حجز موعد جديد بالعيادة
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المريض الكامل</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="مثال: ياسمين عبد العزيز"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف (الواتساب)</label>
                <input
                  type="text"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+201012345678"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الكشف / الإجراء</label>
                <select
                  value={typeId}
                  onChange={(e) => setTypeId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.durationMinutes} دقيقة)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وقت الموعد اليوم</label>
                <input
                  type="time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20"
                >
                  تأكيد الحجز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function getBadgeStyle(status: string) {
  switch (status) {
    case 'CONFIRMED': return 'bg-teal-100 text-teal-800';
    case 'PATIENT_ARRIVED': return 'bg-amber-100 text-amber-800';
    case 'IN_CONSULTATION': return 'bg-lime-100 text-lime-800';
    case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getBadgeLabel(status: string) {
  switch (status) {
    case 'CONFIRMED': return 'مؤكد';
    case 'PATIENT_ARRIVED': return 'وصل العيادة';
    case 'IN_CONSULTATION': return 'داخل الكشف';
    case 'COMPLETED': return 'مكتمل';
    case 'CANCELLED': return 'ملغى';
    default: return status;
  }
}
