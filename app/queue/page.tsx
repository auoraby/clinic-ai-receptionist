'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Play, 
  ArrowUp, 
  ArrowDown, 
  BellRing, 
  UserCheck, 
  Monitor, 
  Clock,
  CheckCircle2,
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
    <div className="page-wrapper animate-fade-up dir-rtl">
      
      {/* Header */}
      <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            إدارة طابور الانتظار وغرفة الكشف
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            متابعة الدور الحي، احتساب زمن الانتظار، وإرسال تنبيهات الواتساب التلقائية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/queue/display"
            target="_blank"
            className="btn btn-ghost text-slate-700 bg-slate-100 hover:bg-slate-200"
          >
            <Monitor className="w-4 h-4 text-blue-600" />
            فتح شاشة TV
          </Link>

          <button
            onClick={() => setShowCheckInModal(true)}
            className="btn btn-primary"
          >
            <UserCheck className="w-4 h-4" />
            تسجيل وصول
          </button>
        </div>
      </div>

      {/* Active Consultation Hero Card */}
      <div className="card p-6 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 border-none">
        <div className="space-y-3">
          <span className="badge badge-emerald border-none bg-emerald-500/20 text-emerald-300">
            🟢 المريض الجاري كشفه الآن
          </span>

          {currentInConsult ? (
            <div>
              <div className="text-3xl font-black text-emerald-400 mt-2">
                رقم {currentInConsult.queueNumber} - {currentInConsult.patientName}
              </div>
              <div className="text-sm text-slate-300 mt-2 font-medium">
                رقم الواتساب: {currentInConsult.patientPhone} • دخل الساعة: {new Date(currentInConsult.checkInTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ) : (
            <div className="text-lg font-bold text-slate-400 mt-2">
              لا يوجد مريض داخل غرفة الكشف حالياً
            </div>
          )}
        </div>

        <button
          onClick={handleCallNext}
          className="btn btn-success btn-lg"
        >
          <Play className="w-5 h-5 fill-current" />
          إنهاء الكشف واستدعاء المريض التالي
        </button>
      </div>

      {/* Waiting List Section */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-slate-900 text-sm">
              قائمة المنتظرين في الاستقبال ({waitingList.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            متوسط زمن الكشف الفعلي: <strong className="text-blue-700">{activeClinic.avgConsultationMins} دقيقة</strong>
          </span>
        </div>

        <div className="p-5 space-y-3 bg-white">
          <AnimatePresence>
            {waitingList.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-slate-400 text-sm font-medium"
              >
                غرفة الانتظار خالية حالياً 🎉
              </motion.div>
            ) : (
              waitingList.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm bg-white transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-black text-xl flex items-center justify-center border border-blue-100">
                      {item.queueNumber}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900">{item.patientName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                        <span>{item.patientPhone}</span>
                        <span className="text-slate-300">•</span>
                        <span>وقت الانتظار المتوقع: <strong className="text-slate-700">{index * activeClinic.avgConsultationMins} دقيقة</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {item.notifiedApproaching ? (
                      <span className="badge badge-emerald py-1.5 px-3">
                        <BellRing className="w-3.5 h-3.5 text-emerald-600" />
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
                        className="btn btn-ghost text-amber-600 bg-amber-50 hover:bg-amber-100 border-amber-200 text-xs py-1.5 px-3 min-h-0 h-auto"
                      >
                        إرسال "دورك اقترب" 📲
                      </button>
                    )}

                    {/* Manual Queue Reordering Buttons */}
                    <div className="flex items-center gap-0.5 bg-slate-50 border border-slate-200 rounded-lg p-1">
                      <button
                        onClick={() => handleReorder(item.id, 'UP')}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition text-slate-600"
                        title="تقديم الترتيب"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReorder(item.id, 'DOWN')}
                        disabled={index === waitingList.length - 1}
                        className="p-1.5 hover:bg-white hover:shadow-sm rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition text-slate-600"
                        title="تأخير الترتيب"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Check-In Modal */}
      <AnimatePresence>
        {showCheckInModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card p-6 max-w-md w-full shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">
                تسجيل وصول مريض
              </h3>

              <form onSubmit={handleCheckInNew} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">اسم المريض</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: أسماء رجب"
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">رقم الهاتف (الواتساب)</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+201200001122"
                    className="input w-full"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCheckInModal(false)}
                    className="btn btn-ghost"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    إصدار رقم الطابور
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
