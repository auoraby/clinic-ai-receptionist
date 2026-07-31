'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { 
  Users, 
  Play, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  Clock, 
  BellRing, 
  UserCheck, 
  Monitor,
  AlertCircle
} from 'lucide-react';

export default function QueuePage() {
  const { activeClinic } = useClinic();
  const [tick, setTick] = useState(0);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  // Check-in form
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');

  const refresh = () => setTick(t => t + 1);

  const queue = clinicStore.getQueue(activeClinic.id);
  const currentInConsult = queue.find(q => q.status === 'IN_CONSULTATION');
  const waitingList = queue.filter(q => q.status === 'WAITING');
  const completedToday = queue.filter(q => q.status === 'COMPLETED');

  const handleCallNext = () => {
    clinicStore.callNextPatient(activeClinic.id);
    refresh();
  };

  const handleCheckInNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    const pat = clinicStore.addPatient(activeClinic.id, patientName, patientPhone);
    clinicStore.markPatientArrived(activeClinic.id, pat.id, pat.name, pat.phone);

    setShowCheckInModal(false);
    setPatientName('');
    setPatientPhone('');
    refresh();
  };

  const handleReorder = (id: string, direction: 'UP' | 'DOWN') => {
    clinicStore.reorderQueue(activeClinic.id, id, direction);
    refresh();
  };

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            إدارة طابور الانتظار وغرفة الكشف
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة الدور الحي، احتساب زمن الانتظار، وإرسال تنبيهات الواتساب التلقائية
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/queue/display"
            target="_blank"
            className="px-4 py-2.5 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition"
          >
            <Monitor className="w-4 h-4 text-teal-400" />
            فتح شاشة الانتظار (Public TV)
          </Link>

          <button
            onClick={() => setShowCheckInModal(true)}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition"
          >
            <UserCheck className="w-4 h-4" />
            تسجيل وصول مريض جديد
          </button>
        </div>
      </div>

      {/* Active Consultation Hero Card */}
      <div className="bg-gradient-to-r from-teal-900 via-navy-900 to-navy-950 rounded-2xl p-6 text-white shadow-xl border border-teal-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-teal-300 bg-teal-800/50 px-3 py-1 rounded-full border border-teal-600/40">
            🟢 المريض الجاري كشفه الآن داخل العيادة
          </span>

          {currentInConsult ? (
            <div>
              <div className="text-3xl font-black text-limeAccent-400 mt-1">
                رقم {currentInConsult.queueNumber} - {currentInConsult.patientName}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                رقم الواتساب: {currentInConsult.patientPhone} • دخل الساعة: {new Date(currentInConsult.checkInTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold text-slate-400">
              لا يوجد مريض داخل غرفة الكشف حالياً
            </div>
          )}
        </div>

        <button
          onClick={handleCallNext}
          className="px-6 py-3 bg-limeAccent-500 hover:bg-limeAccent-600 text-navy-950 font-black text-sm rounded-xl shadow-xl shadow-limeAccent-500/20 flex items-center gap-2.5 transition transform active:scale-95 whitespace-nowrap"
        >
          <Play className="w-5 h-5 fill-current" />
          إنهاء الكشف واستدعاء المريض التالي
        </button>
      </div>

      {/* Waiting List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <h2 className="font-extrabold text-slate-900 text-sm">
              قائمة المنتظرين في الاستقبال ({waitingList.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            متوسط زمن الكشف الفعلي: <strong className="text-teal-700">{activeClinic.avgConsultationMins} دقيقة</strong>
          </span>
        </div>

        <div className="space-y-3">
          {waitingList.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              غرفة الانتظار خالية حالياً 🎉
            </div>
          ) : (
            waitingList.map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 transition flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white font-black text-base flex items-center justify-center shadow-md">
                    {item.queueNumber}
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-slate-900">{item.patientName}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{item.patientPhone}</span>
                      <span>•</span>
                      <span>وقت التقديري المتوقع: <strong>{index * activeClinic.avgConsultationMins} دقيقة</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.notifiedApproaching ? (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                      <BellRing className="w-3 h-3 text-emerald-600" />
                      تم تنبيهه "دورك اقترب"
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        clinicStore.addBotMessage(
                          activeClinic.id,
                          item.patientId,
                          `دورك اقترب (رقم ${item.queueNumber})، من فضلك توجّه إلى العيادة الآن.`
                        );
                        item.notifiedApproaching = true;
                        refresh();
                      }}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-[10px] font-bold rounded-lg border border-amber-300 transition"
                    >
                      إرسال "دورك اقترب" 📲
                    </button>
                  )}

                  {/* Manual Queue Reordering Buttons */}
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      onClick={() => handleReorder(item.id, 'UP')}
                      disabled={index === 0}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                      title="تقديم الترتيب"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                    <button
                      onClick={() => handleReorder(item.id, 'DOWN')}
                      disabled={index === waitingList.length - 1}
                      className="p-1 hover:bg-slate-100 rounded disabled:opacity-30"
                      title="تأخير الترتيب"
                    >
                      <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              تسجيل وصول مريض للاستقبال
            </h3>

            <form onSubmit={handleCheckInNew} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المريض</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="مثال: أسماء رجب"
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
                  placeholder="+201200001122"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20"
                >
                  إصدار رقم الطابور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
