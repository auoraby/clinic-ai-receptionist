'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/auth-context';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
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
  HeartPulse
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
    <div className="space-y-6 dir-rtl font-arabic">
      
      {/* Top Banner Header - Clean Royal Cobalt Blue Banner */}
      <div className="bg-gradient-to-r from-cobalt-900 via-cobalt-800 to-cobalt-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-cobalt-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-mint-500/20 text-mint-300 text-[11px] font-extrabold px-3 py-1 rounded-full border border-mint-500/40 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-mint-400" />
              {activeClinic.doctorName} - {activeClinic.specialty}
            </span>
            <span className="bg-white/10 text-white text-[11px] font-extrabold px-3 py-1 rounded-full border border-white/20">
              🤖 WhatsApp AI Webhook Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            لوحة تحكم {activeClinic.name}
          </h1>
          <p className="text-xs sm:text-sm text-cobalt-200 mt-1">
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
            className="w-full bg-white text-slate-900 border border-slate-200 rounded-2xl pr-10 pl-4 py-2.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cobalt-500 shadow-inner"
          />
        </div>
      </div>

      {/* Primary KPI Cards Grid - Clean White Cards with Cobalt Accents */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Confirmed */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مواعيد اليوم المؤكدة</span>
            <div className="w-10 h-10 rounded-2xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">{todayConfirmed.length}</div>
          <div className="text-[11px] text-cobalt-600 font-bold mt-1.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            متزامن مع Google Calendar
          </div>
        </div>

        {/* Card 2: Current Queue */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">طابور الانتظار الحالي</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">{waitingPatients.length} ينتظرون</div>
          <div className="text-[11px] text-amber-700 font-bold mt-1.5">
            متوسط وقت الكشف: {activeClinic.avgConsultationMins} دقيقة
          </div>
        </div>

        {/* Card 3: Unanswered / Human Intervention */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">رسائل تتطلب تدخلاً بشرياً</span>
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-red-600 mt-3">{humanInterventionRequired.length}</div>
          <div className="text-[11px] text-red-600 font-bold mt-1.5">
            تم إيقاف الرد الآلي حمايةً للمريض
          </div>
        </div>

        {/* Card 4: Reminder Delivery */}
        <div className="clinical-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">التذكيرات الآلية المجدولة</span>
            <div className="w-10 h-10 rounded-2xl bg-mint-50 text-mint-700 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-3">{reminders.length} مجدولة</div>
          <div className="text-[11px] text-mint-700 font-bold mt-1.5">
            تصل للمريض قبل الموعد تلقائياً
          </div>
        </div>

      </div>

      {/* Queue Controller Action Panel */}
      <div className="bg-gradient-to-r from-mint-950 via-cobalt-950 to-navy-950 rounded-3xl p-6 text-white shadow-xl border border-mint-800/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-mint-300 bg-mint-900/60 px-3 py-1 rounded-full border border-mint-500/40">
            🏥 غرفة الانتظار الحالية
          </span>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-300">المريض الحالي داخل غرفة الكشف:</div>
              <div className="text-xl font-black text-mint-300 mt-0.5">
                {activeInConsult ? `رقم ${activeInConsult.queueNumber} - ${activeInConsult.patientName}` : 'لا يوجد مريض داخل غرفة الكشف حالياً'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons for Staff */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCallNext}
            className="px-6 py-3 bg-mint-500 hover:bg-mint-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-mint-500/20 flex items-center gap-2 transition transform active:scale-95 whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current" />
            استدعاء المريض التالي
          </button>

          <Link
            href="/queue"
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-2xl border border-white/20 flex items-center gap-2 transition"
          >
            <Users className="w-4 h-4 text-mint-300" />
            إدارة الطابور بالكامل
          </Link>

          <Link
            href="/appointments"
            className="px-4 py-3 bg-cobalt-600 hover:bg-cobalt-500 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            حجز موعد جديد
          </Link>
        </div>
      </div>

      {/* Main Grid: Appointments & Live Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Today's Appointments List */}
        <div className="lg:col-span-2 clinical-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-cobalt-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">جدول حتوزات اليوم والمواعيد</h2>
            </div>
            <Link href="/appointments" className="text-xs font-bold text-cobalt-600 hover:underline">
              عرض الكل ({filteredAppointments.length})
            </Link>
          </div>

          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                لا توجد مواعيد مسجلة تطابق البحث اليوم
              </div>
            ) : (
              filteredAppointments.map(apt => (
                <div 
                  key={apt.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-cobalt-100 text-cobalt-800 font-black text-xs flex items-center justify-center shadow-sm">
                      {new Date(apt.startDateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{apt.appointmentTypeName} • {apt.patientPhone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${getStatusBadgeClass(apt.status)}`}>
                      {getStatusLabelAr(apt.status)}
                    </span>
                    <button 
                      onClick={() => {
                        clinicStore.markPatientArrived(activeClinic.id, apt.patientId, apt.patientName, apt.patientPhone, apt.id);
                        refreshData();
                      }}
                      className="px-3 py-1.5 bg-cobalt-600 hover:bg-cobalt-700 text-white text-[10px] font-bold rounded-xl transition shadow-sm"
                    >
                      وصل للعيادة
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Column: Unanswered Conversations & Medical Safeguard Alerts */}
        <div className="clinical-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cobalt-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">المحادثات والتدخل البشري</h2>
            </div>
            <Link href="/conversations" className="text-xs font-bold text-cobalt-600 hover:underline">
              عرض الردود
            </Link>
          </div>

          <div className="space-y-3">
            {conversations.slice(0, 4).map(conv => (
              <div 
                key={conv.id}
                className={`p-3.5 rounded-2xl border transition ${
                  conv.isHumanTakeover 
                    ? 'border-red-200 bg-red-50/50' 
                    : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{conv.patientName}</span>
                  {conv.isHumanTakeover ? (
                    <span className="text-[9px] font-black bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full border border-red-200">
                      ⚠️ تدخّل بشري
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold bg-mint-100 text-mint-800 px-2.5 py-0.5 rounded-full">
                      🤖 بوت نشط
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                  {conv.lastMessageText}
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{new Date(conv.lastMessageTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  <Link href="/conversations" className="text-cobalt-600 font-bold hover:underline">
                    فتح المحادثة ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'IN_CONSULTATION': return 'bg-mint-100 text-mint-800 border border-mint-300';
    case 'PATIENT_ARRIVED': return 'bg-amber-100 text-amber-800 border border-amber-300';
    case 'CONFIRMED': return 'bg-cobalt-100 text-cobalt-800';
    case 'CANCELLED': return 'bg-red-100 text-red-800';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function getStatusLabelAr(status: string) {
  switch (status) {
    case 'IN_CONSULTATION': return 'داخل الكشف حالياً';
    case 'PATIENT_ARRIVED': return 'وصل وتصعيد للطابور';
    case 'CONFIRMED': return 'مؤكد آلياً';
    case 'COMPLETED': return 'مكتمل';
    case 'CANCELLED': return 'ملغى';
    default: return status;
  }
}
