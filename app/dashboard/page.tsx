'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { 
  Users, 
  CalendarCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Play, 
  Bot, 
  BellRing, 
  PlusCircle,
  Stethoscope,
  LayoutDashboard
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeClinic } = useClinic();
  const [searchQuery, setSearchQuery] = useState('');
  const [tick, setTick] = useState(0);

  const refreshData = () => setTick(t => t + 1);

  // Fetch real-time store metrics for active clinic
  const allAppointments = clinicStore.getAppointments(activeClinic.id);
  const queue = clinicStore.getQueue(activeClinic.id);
  const conversations = clinicStore.getConversations(activeClinic.id);
  const reminders = clinicStore.getReminders(activeClinic.id);

  // Filtered lists
  const todayConfirmed = allAppointments.filter(a => a.status === 'CONFIRMED' || a.status === 'IN_CONSULTATION' || a.status === 'PATIENT_ARRIVED');
  const activeInConsult = queue.find(q => q.status === 'IN_CONSULTATION');
  const waitingPatients = queue.filter(q => q.status === 'WAITING');
  const humanInterventionRequired = conversations.filter(c => c.isHumanTakeover);

  // Search filter
  const filteredAppointments = allAppointments.filter(a => 
    a.patientName.includes(searchQuery) || 
    a.patientPhone.includes(searchQuery) || 
    a.appointmentTypeName.includes(searchQuery)
  );

  const handleCallNext = () => {
    clinicStore.callNextPatient(activeClinic.id);
    refreshData();
  };

  return (
    <div className="page-wrapper animate-fade-up dir-rtl">
      
      {/* Page Header */}
      <div className="card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-emerald flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              {activeClinic.doctorName} - {activeClinic.specialty}
            </span>
            <span className="badge badge-blue">
              🤖 WhatsApp AI Webhook Active
            </span>
          </div>

          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            لوحة تحكم {activeClinic.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            مرحباً {user?.name}! متابعة فورية لحجوزات الواتساب، طابور الانتظار، وتقويم الكشوفات.
          </p>
        </div>

        {/* Global Quick Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم المريض أو رقم الهاتف..."
            className="input pr-10"
          />
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Confirmed */}
        <motion.div whileHover={{ y: -2 }} className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مواعيد اليوم</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarCheck className="w-4.5 h-4.5 text-blue-600" />
            </div>
          </div>
          <div className="stat-value">{todayConfirmed.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            متزامن مع Google Calendar
          </div>
        </motion.div>

        {/* Card 2: Current Queue */}
        <motion.div whileHover={{ y: -2 }} className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">طابور الانتظار</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5 text-amber-600" />
            </div>
          </div>
          <div className="stat-value">{waitingPatients.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1.5">
            متوسط وقت الكشف: {activeClinic.avgConsultationMins} دقيقة
          </div>
        </motion.div>

        {/* Card 3: Unanswered / Human Intervention */}
        <motion.div whileHover={{ y: -2 }} className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">رسائل تدخل بشري</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4.5 h-4.5 text-red-600" />
            </div>
          </div>
          <div className="stat-value text-red-600">{humanInterventionRequired.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1.5">
            تم إيقاف الرد الآلي حمايةً للمريض
          </div>
        </motion.div>

        {/* Card 4: Reminder Delivery */}
        <motion.div whileHover={{ y: -2 }} className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">تذكيرات مجدولة</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <BellRing className="w-4.5 h-4.5 text-emerald-600" />
            </div>
          </div>
          <div className="stat-value">{reminders.length}</div>
          <div className="text-xs text-slate-500 font-medium mt-1.5">
            تصل للمريض قبل الموعد تلقائياً
          </div>
        </motion.div>

      </div>

      {/* Active Consultation Hero Card */}
      <div className="card p-6 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-none">
        <div className="space-y-2">
          <span className="badge badge-emerald border-none bg-emerald-500/20 text-emerald-300">
            🏥 غرفة الانتظار الحالية
          </span>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-400">المريض الحالي داخل غرفة الكشف:</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">
                {activeInConsult ? `رقم ${activeInConsult.queueNumber} - ${activeInConsult.patientName}` : 'لا يوجد مريض داخل غرفة الكشف حالياً'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCallNext}
            className="btn btn-success"
          >
            <Play className="w-4 h-4 fill-current" />
            استدعاء المريض التالي
          </button>

          <Link
            href="/queue"
            className="btn btn-ghost text-white border-slate-700 hover:bg-slate-800"
          >
            <Users className="w-4 h-4 text-blue-400" />
            إدارة الطابور بالكامل
          </Link>

          <Link
            href="/appointments"
            className="btn btn-primary"
          >
            <PlusCircle className="w-4 h-4" />
            حجز موعد جديد
          </Link>
        </div>
      </div>

      {/* Main Grid: Appointments & Live Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Today's Appointments List */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col h-full">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm">جدول حجوزات اليوم والمواعيد</h2>
            </div>
            <Link href="/appointments" className="text-xs font-bold text-blue-600 hover:underline">
              عرض الكل ({filteredAppointments.length})
            </Link>
          </div>

          <div className="flex-1">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                لا توجد مواعيد مسجلة تطابق البحث اليوم
              </div>
            ) : (
              <table className="table-clean w-full">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="text-right py-3 px-5 font-semibold text-xs">الوقت</th>
                    <th className="text-right py-3 px-5 font-semibold text-xs">المريض</th>
                    <th className="text-right py-3 px-5 font-semibold text-xs">الحالة</th>
                    <th className="text-right py-3 px-5 font-semibold text-xs">إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                      <td className="py-3 px-5">
                        <div className="badge badge-blue">
                          {new Date(apt.startDateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="text-sm font-bold text-slate-900">{apt.patientName}</div>
                        <div className="text-xs text-slate-500">{apt.appointmentTypeName} • {apt.patientPhone}</div>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`badge ${getStatusBadgeClass(apt.status)}`}>
                          {getStatusLabelAr(apt.status)}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <button 
                          onClick={() => {
                            clinicStore.markPatientArrived(activeClinic.id, apt.patientId, apt.patientName, apt.patientPhone, apt.id);
                            refreshData();
                          }}
                          className="btn btn-primary text-[10px] py-1.5 px-3 min-h-0 h-auto"
                        >
                          وصل للعيادة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right 1 Column: Unanswered Conversations & Medical Safeguard Alerts */}
        <div className="card overflow-hidden flex flex-col h-full">
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-slate-900 text-sm">تدخل بشري ومحادثات</h2>
            </div>
            <Link href="/conversations" className="text-xs font-bold text-blue-600 hover:underline">
              عرض الردود
            </Link>
          </div>

          <div className="p-5 space-y-3 flex-1 overflow-y-auto">
            {conversations.slice(0, 4).map(conv => (
              <motion.div 
                whileHover={{ y: -2 }}
                key={conv.id}
                className={`p-3.5 rounded-xl border transition ${
                  conv.isHumanTakeover 
                    ? 'border-red-200 bg-red-50/50' 
                    : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-slate-900">{conv.patientName}</span>
                  {conv.isHumanTakeover ? (
                    <span className="badge badge-red text-[10px]">
                      ⚠️ تدخّل بشري
                    </span>
                  ) : (
                    <span className="badge badge-emerald text-[10px]">
                      🤖 بوت نشط
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {conv.lastMessageText}
                </p>
                <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{new Date(conv.lastMessageTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  <Link href="/conversations" className="text-blue-600 font-bold hover:underline">
                    فتح المحادثة ←
                  </Link>
                </div>
              </motion.div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-10 text-slate-400 text-xs">
                لا توجد محادثات تتطلب انتباهاً
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'IN_CONSULTATION': return 'badge-emerald';
    case 'PATIENT_ARRIVED': return 'badge-amber';
    case 'CONFIRMED': return 'badge-blue';
    case 'CANCELLED': return 'badge-red';
    default: return 'badge-slate';
  }
}

function getStatusLabelAr(status: string) {
  switch (status) {
    case 'IN_CONSULTATION': return 'داخل الكشف حالياً';
    case 'PATIENT_ARRIVED': return 'وصل للعيادة';
    case 'CONFIRMED': return 'مؤكد آلياً';
    case 'COMPLETED': return 'مكتمل';
    case 'CANCELLED': return 'ملغى';
    default: return status;
  }
}
