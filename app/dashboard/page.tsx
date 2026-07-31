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
  MessageSquare, 
  AlertTriangle, 
  UserPlus, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Play, 
  Bot, 
  Phone,
  RefreshCw,
  BellRing,
  ShieldCheck,
  PlusCircle,
  Building
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
  const cancelledAppointments = allAppointments.filter(a => a.status === 'CANCELLED');
  const humanInterventionRequired = conversations.filter(c => c.isHumanTakeover);
  const unansweredChats = conversations.filter(c => c.unreadCount > 0);

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

  const isDoctor = user?.role === 'DOCTOR' || user?.role === 'SUPER_ADMIN';

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-900 rounded-2xl p-6 text-white shadow-xl border border-navy-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-teal-500/20 text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-teal-500/40">
              {activeClinic.doctorName} - {activeClinic.specialty}
            </span>
            <span className="bg-lime-500/20 text-limeAccent-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-lime-500/30">
              🤖 WhatsApp AI Webhook Active
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            لوحة تحكم {activeClinic.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            مرحباً {user?.name}! تتبع المواعيد، طابور الانتظار، واستفسارات الواتساب في مكان واحد.
          </p>
        </div>

        {/* Global Quick Search */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم المريض أو الموعد..."
            className="w-full bg-navy-950/80 border border-navy-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Confirmed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مواعيد اليوم المؤكدة</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{todayConfirmed.length}</div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تحديث مباشر مع Google Calendar
          </div>
        </div>

        {/* Card 2: Current Queue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">الطابور والمقيدين</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{waitingPatients.length} ينتظرون</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            متوسط وقت الكشف: {activeClinic.avgConsultationMins} دقيقة
          </div>
        </div>

        {/* Card 3: Unanswered / Human Intervention */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">رسائل تتطلب تدخلاً بشرياً</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-red-600 mt-2">{humanInterventionRequired.length}</div>
          <div className="text-[11px] text-red-500 font-semibold mt-1">
            تم إيقاف الرد الآلي حمايةً للمريض
          </div>
        </div>

        {/* Card 4: Reminder Delivery */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">حالة التذكيرات الآلية</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{reminders.length} مجدولة</div>
          <div className="text-[11px] text-purple-600 font-semibold mt-1">
            24 ساعة و 2 ساعة قبل الموعد
          </div>
        </div>

      </div>

      {/* Queue Controller Action Panel */}
      <div className="bg-gradient-to-r from-teal-900 to-navy-900 rounded-2xl p-6 text-white shadow-lg border border-teal-800/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-teal-300 uppercase tracking-wide">
            غرفة الانتظار الحالية 🏥
          </span>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-[11px] text-slate-300">المريض الحالي داخل العيادة:</div>
              <div className="text-lg font-black text-limeAccent-400">
                {activeInConsult ? `رقم ${activeInConsult.queueNumber} - ${activeInConsult.patientName}` : 'لا يوجد مريض كشف حالياً'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons for Staff */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCallNext}
            className="px-5 py-2.5 bg-limeAccent-500 hover:bg-limeAccent-600 text-navy-950 font-black text-xs rounded-xl shadow-lg shadow-limeAccent-500/20 flex items-center gap-2 transition transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            استدعاء المريض التالي
          </button>

          <Link
            href="/queue"
            className="px-4 py-2.5 bg-navy-800 hover:bg-navy-700 border border-navy-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
          >
            <Users className="w-4 h-4 text-teal-400" />
            إدارة الطابور بالكامل
          </Link>

          <Link
            href="/appointments"
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4" />
            حجز موعد جديد
          </Link>
        </div>
      </div>

      {/* Main Grid: Appointments & Live Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Today's Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-teal-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">جدول حتوزات اليوم والمواعيد</h2>
            </div>
            <Link href="/appointments" className="text-xs font-bold text-teal-600 hover:underline">
              عرض الكل ({filteredAppointments.length})
            </Link>
          </div>

          <div className="space-y-3">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                لا توجد مواعيد مسجلة تطابق البحث اليوم
              </div>
            ) : (
              filteredAppointments.map(apt => (
                <div 
                  key={apt.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100/80 transition flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-black text-xs flex items-center justify-center">
                      {new Date(apt.startDateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-500">{apt.appointmentTypeName} • {apt.patientPhone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${getStatusBadgeClass(apt.status)}`}>
                      {getStatusLabelAr(apt.status)}
                    </span>
                    <button 
                      onClick={() => {
                        clinicStore.markPatientArrived(activeClinic.id, apt.patientId, apt.patientName, apt.patientPhone, apt.id);
                        refreshData();
                      }}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold rounded-lg transition"
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
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-600" />
              <h2 className="font-extrabold text-slate-900 text-sm">المحادثات والتدخل البشري</h2>
            </div>
            <Link href="/conversations" className="text-xs font-bold text-teal-600 hover:underline">
              عرض الردود
            </Link>
          </div>

          <div className="space-y-3">
            {conversations.slice(0, 4).map(conv => (
              <div 
                key={conv.id}
                className={`p-3 rounded-xl border transition ${
                  conv.isHumanTakeover 
                    ? 'border-red-200 bg-red-50/40' 
                    : 'border-slate-100 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">{conv.patientName}</span>
                  {conv.isHumanTakeover ? (
                    <span className="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                      ⚠️ تدخّل بشري
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                      🤖 بوت نشط
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {conv.lastMessageText}
                </p>
                <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{new Date(conv.lastMessageTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                  <Link href="/conversations" className="text-teal-600 font-bold hover:underline">
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
    case 'IN_CONSULTATION': return 'bg-lime-100 text-lime-800 border border-lime-300';
    case 'PATIENT_ARRIVED': return 'bg-teal-100 text-teal-800 border border-teal-300';
    case 'CONFIRMED': return 'bg-emerald-100 text-emerald-800';
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
