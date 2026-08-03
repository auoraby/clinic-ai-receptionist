'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clinicStore } from '@/lib/store';
import {
  HeartPulse, MapPin, Clock, Phone, CalendarDays,
  CheckCircle2, Bot, Sparkles, MessageCircle, ChevronLeft,
  User, Hash, Star, Shield
} from 'lucide-react';

export default function PublicClinicBookingPage() {
  const params   = useParams();
  const slug     = params?.slug as string;
  const clinics  = clinicStore.getClinics();
  const clinic   = clinics.find(c => c.slug === slug) ?? clinics[0];
  const types    = clinicStore.getAppointmentTypes(clinic.id);

  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [patientName, setName]    = useState('');
  const [patientPhone, setPhone]  = useState('');
  const [selectedType, setType]   = useState(types[0]?.id ?? '');
  const [selectedSlot, setSlot]   = useState('14:00');
  const [isBooked, setBooked]     = useState(false);

  const slots = ['10:00', '11:00', '12:00', '14:00', '15:30', '17:00', '18:30'];

  const selectedTypeObj = types.find(t => t.id === selectedType) ?? types[0];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    let pat = clinicStore.getPatients(clinic.id).find(p => p.phone === patientPhone);
    if (!pat) pat = clinicStore.addPatient(clinic.id, patientName, patientPhone);

    const today = new Date().toISOString().split('T')[0];
    clinicStore.addAppointment({
      clinicId:            clinic.id,
      patientId:           pat.id,
      patientName:         pat.name,
      patientPhone:        pat.phone,
      appointmentTypeId:   selectedTypeObj?.id ?? 't1',
      appointmentTypeName: selectedTypeObj?.name ?? 'كشف',
      startDateTime:       `${today}T${selectedSlot}:00Z`,
      endDateTime:         `${today}T${selectedSlot}:30Z`,
      status:              'CONFIRMED',
      notes:               'حجز مباشر عبر رابط العيادة',
    });

    setBooked(true);
  };

  const workingDaysAr: Record<string, string> = {
    Sunday: 'الأحد', Monday: 'الاثنين', Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء', Thursday: 'الخميس', Friday: 'الجمعة', Saturday: 'السبت',
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>

      {/* ── Minimal Header ─────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/clinics" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition">
            <ChevronLeft className="w-4 h-4" />
            دليل العيادات
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-slate-900 text-sm hidden sm:block">مستقبل العيادة الذكي</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* ── Clinic Hero Card ───────────────────────── */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-xl shrink-0">
                {clinic.doctorName.charAt(0)}
              </div>
              <div>
                <div className="text-[10px] font-bold text-blue-300 mb-0.5">{clinic.specialty}</div>
                <h1 className="text-lg font-black text-white leading-snug">{clinic.doctorName}</h1>
                <div className="text-xs text-slate-400 font-medium mt-0.5">{clinic.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-900/40 px-2.5 py-1 rounded-full border border-emerald-800 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              متاح للحجز
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs text-slate-300 font-medium">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{clinic.address}</span>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div>{clinic.workingHoursStart} — {clinic.workingHoursEnd}</div>
                <div className="text-slate-500 text-[10px] mt-0.5">
                  {clinic.workingDays.map(d => workingDaysAr[d]).join(' • ')}
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct CTA */}
          <a href={`https://wa.me/${clinic.phone.replace(/[^0-9]/g, '')}?text=السلام عليكم، عاوز أحجز موعد`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition">
            <MessageCircle className="w-4 h-4" />
            أو احجز مباشرة عبر الواتساب
          </a>
        </div>

        {/* ── Booking Success ──────────────────────────── */}
        <AnimatePresence mode="wait">
          {isBooked ? (
            <motion.div key="success"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="card p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">تم الحجز بنجاح! 🎉</h2>
                <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">
                  أهلاً بك يا <strong className="text-slate-900">{patientName}</strong>!<br />
                  موعدك مع {clinic.doctorName} اليوم الساعة <strong className="text-blue-600">{selectedSlot}</strong>.<br />
                  سيصلك تأكيد وتذكير على واتسابك رقم <strong dir="ltr">{patientPhone}</strong>.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 font-medium">
                <Shield className="w-4 h-4 text-blue-600 shrink-0" />
                لا تحتاج لأي حساب أو تسجيل — الحجز مؤكد عبر واتسابك فقط
              </div>

              <button onClick={() => { setBooked(false); setStep(1); }}
                className="btn btn-ghost w-full justify-center">
                حجز موعد آخر
              </button>
            </motion.div>

          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* ── No registration notice ──────────────── */}
              <div className="flex items-center gap-2.5 p-3.5 bg-blue-50 border border-blue-200 rounded-xl mb-5 text-xs text-blue-800 font-medium">
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <span>لا تحتاج لأي تسجيل — فقط اكتب اسمك ورقمك وسيصلك التأكيد على الواتساب</span>
              </div>

              <form onSubmit={handleBook} className="space-y-4">

                {/* Step 1: Patient Info */}
                <div className="card p-5 space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">١</span>
                    بياناتك الشخصية
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل</label>
                      <input type="text" value={patientName} onChange={e => setName(e.target.value)}
                        placeholder="مثال: سارة أحمد محمود"
                        className="input" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        رقم الواتساب
                        <span className="text-slate-400 font-normal mr-1">(سيصلك التأكيد عليه)</span>
                      </label>
                      <input type="tel" value={patientPhone} onChange={e => setPhone(e.target.value)}
                        placeholder="+201012345678" dir="ltr"
                        className="input text-left" required />
                    </div>
                  </div>
                </div>

                {/* Step 2: Service */}
                <div className="card p-5 space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">٢</span>
                    نوع الكشف أو الخدمة
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {types.map(t => (
                      <button key={t.id} type="button" onClick={() => setType(t.id)}
                        className={`p-3.5 rounded-xl border text-right transition ${
                          selectedType === t.id
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}>
                        <div className="text-xs font-bold">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          ⏱ {t.durationMinutes} دقيقة • {t.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Time Slot */}
                <div className="card p-5 space-y-4">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">٣</span>
                    اختر التوقيت المناسب
                  </h2>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map(slot => (
                      <button key={slot} type="button" onClick={() => setSlot(slot)}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                          selectedSlot === slot
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}>
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary + Submit */}
                <div className="card p-5 space-y-4 border-2 border-blue-100">
                  <h2 className="text-xs font-bold text-slate-700">ملخص الحجز</h2>
                  <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">الطبيب</span>
                      <span className="font-bold text-slate-900">{clinic.doctorName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">الخدمة</span>
                      <span className="font-bold text-slate-900">{selectedTypeObj?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">التوقيت</span>
                      <span className="font-bold text-blue-600">{selectedSlot} اليوم</span>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-xl w-full justify-center">
                    <Sparkles className="w-5 h-5" />
                    تأكيد الحجز — يصلك واتساب فوراً
                  </button>

                  <p className="text-center text-[10px] text-slate-400 font-medium">
                    🔒 بياناتك محمية ولن تُستخدم إلا للتواصل بشأن موعدك
                  </p>
                </div>

              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <footer className="text-center text-[11px] text-slate-400 py-6 border-t border-slate-200 font-medium">
        مشغّل بواسطة مستقبل العيادة الذكي • Meta WhatsApp AI Receptionist
      </footer>
    </div>
  );
}
