'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { clinicStore } from '@/lib/store';
import { 
  Stethoscope, 
  MapPin, 
  Clock, 
  Phone, 
  CalendarDays, 
  CheckCircle2, 
  Bot, 
  ArrowLeft,
  Sparkles,
  HeartPulse
} from 'lucide-react';

export default function PublicClinicBookingPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const clinics = clinicStore.getClinics();
  const clinic = clinics.find(c => c.slug === slug) || clinics[0];

  const types = clinicStore.getAppointmentTypes(clinic.id);
  
  // Booking Form State
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedType, setSelectedType] = useState(types[0]?.id || '');
  const [selectedSlot, setSelectedSlot] = useState('02:30');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableSlots = ['02:30', '03:30', '04:30', '06:00', '07:30'];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;

    let pat = clinicStore.getPatients(clinic.id).find(p => p.phone === patientPhone);
    if (!pat) {
      pat = clinicStore.addPatient(clinic.id, patientName, patientPhone);
    }

    const typeObj = types.find(t => t.id === selectedType) || types[0];
    const todayStr = new Date().toISOString().split('T')[0];

    clinicStore.addAppointment({
      clinicId: clinic.id,
      patientId: pat.id,
      patientName: pat.name,
      patientPhone: pat.phone,
      appointmentTypeId: typeObj?.id || 't1',
      appointmentTypeName: typeObj?.name || 'كشف وتأهيل',
      startDateTime: `${todayStr}T${selectedSlot}:00Z`,
      endDateTime: `${todayStr}T${selectedSlot}:30Z`,
      status: 'CONFIRMED',
      notes: 'حجز مباشر عبر صفحة العيادة بالويب',
    });

    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dir-rtl font-arabic flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="bg-navy-900 text-white py-4 border-b border-navy-800">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center text-navy-950">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">{clinic.name}</span>
          </div>

          <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-full font-bold border border-teal-500/40">
            حجز مباشر ومزامنة واتساب 📲
          </span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-3xl mx-auto px-4 py-8 w-full space-y-6">
        
        {/* Doctor Hero Card */}
        <div className="bg-gradient-to-r from-teal-900 via-navy-900 to-navy-950 rounded-3xl p-6 text-white shadow-2xl border border-teal-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="bg-teal-500/20 text-teal-300 text-xs font-extrabold px-3 py-1 rounded-full border border-teal-500/40">
                {clinic.specialty}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2 text-white">
                {clinic.doctorName}
              </h1>
            </div>

            <a
              href={`https://wa.me/${clinic.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
            >
              <Bot className="w-4 h-4" /> المحادثة المباشرة على الواتساب
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-navy-800 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span className="truncate">{clinic.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400 shrink-0" />
              <span>مواعيد العمل: من {clinic.workingHoursStart} إلى {clinic.workingHoursEnd}</span>
            </div>
          </div>
        </div>

        {/* Success Modal / Card */}
        {isSuccess ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">تم تأكيد حجزك بنجاح! 🎉</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              أهلاً بك يا <strong>{patientName}</strong>! تم تسجيل موعدك في {clinic.name} اليوم الساعة <strong>{selectedSlot} ظهراً</strong>.
              تم إرسال تفاصيل التذكير والموقع الفعلي على رقم واتسابك <strong>{patientPhone}</strong>.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow"
            >
              حجز موعد آخر
            </button>
          </div>
        ) : (
          /* Booking Form Card */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-teal-600" />
                اختر نوع الكشف والموعد المناسب
              </h2>
              <p className="text-xs text-slate-500 mt-1">تأكيد آلي فوري ومزامنة مع التقويم والواتساب</p>
            </div>

            <form onSubmit={handleBook} className="space-y-5">
              
              {/* Patient Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الاسم الكامل</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="مثال: سارة أحمد محمود"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
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
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الكشف / الخدمة المطلوبة</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {types.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id)}
                      className={`p-3 rounded-xl border text-right transition ${
                        selectedType === t.id
                          ? 'border-teal-600 bg-teal-50 text-teal-900 font-bold shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs">{t.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">{t.durationMinutes} دقيقة</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Slot Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اختر التوقيت المتاح اليوم</label>
                <div className="flex flex-wrap gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition ${
                        selectedSlot === slot
                          ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {slot} ظهراً
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-2xl shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2 transition transform active:scale-98"
              >
                <Sparkles className="w-4 h-4" /> تأكيد الحجز الفوري وإرسال تذكير الواتساب
              </button>

            </form>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200">
        مشغل بواسطة مستقبل العيادة الذكي • Meta WhatsApp AI Receptionist Engine
      </footer>

    </div>
  );
}
