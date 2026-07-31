'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clinicStore } from '@/lib/store';
import { useClinic } from '@/lib/context/clinic-context';
import { 
  Bot, 
  Stethoscope, 
  Clock, 
  Share2, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Copy,
  Building,
  ShieldCheck
} from 'lucide-react';

export default function ClinicOnboardingWizardPage() {
  const router = useRouter();
  const { selectClinic, refreshClinics } = useClinic();

  const [step, setStep] = useState(1);

  // Step 1: Doctor & Clinic Details
  const [clinicName, setClinicName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Step 2: Hours & Slot Setup
  const [workStart, setWorkStart] = useState('12:00');
  const [workEnd, setWorkEnd] = useState('20:00');
  const [slotDuration, setSlotDuration] = useState('30');
  const [serviceName, setServiceName] = useState('كشف واستشارة طبية');

  // Created Clinic Result
  const [createdClinicId, setCreatedClinicId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName || !doctorName || !phone) return;
    setStep(2);
  };

  const handleFinishSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = clinicName.toLowerCase().replace(/[^a-z0-9]/g, '-') + `-${Date.now().toString().slice(-4)}`;

    const newClinic = clinicStore.addClinic({
      name: clinicName,
      slug,
      doctorName,
      specialty: specialty || 'استشاري طبي',
      phone,
      whatsappPhoneId: `109876543210${Math.floor(Math.random() * 90 + 10)}`,
      whatsappVerifyToken: 'clinic_ai_secret_verify_token_2026',
      googleCalendarId: `${slug}@gmail.com`,
      address: address || 'القاهرة - مصر',
      mapsUrl: 'https://maps.google.com',
      workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      workingHoursStart: workStart,
      workingHoursEnd: workEnd,
      slotDurationMinutes: Number(slotDuration),
      bufferTimeMinutes: 10,
      avgConsultationMins: 20,
      isActive: true,
    });

    refreshClinics();
    selectClinic(newClinic.id);
    setCreatedClinicId(newClinic.id);
    setStep(3);
  };

  const webhookUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://myclinic.com'}/api/webhooks/whatsapp`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dir-rtl font-arabic flex flex-col justify-between p-4 sm:p-8">
      
      <div className="max-w-2xl mx-auto w-full space-y-6">
        
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center text-navy-950 mx-auto shadow-xl">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            أداة تهيئة الواتساب الآلي للعيادة في 3 خطوات
          </h1>
          <p className="text-xs text-slate-500">
            أدخل بيانات الدكتور والعيادة وقم بتفعيل ردود الواتساب التلقائية فوراً
          </p>
        </div>

        {/* Step Stepper Progress */}
        <div className="flex items-center justify-between max-w-md mx-auto px-4 text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-teal-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>1</span>
            <span>بيانات العيادة</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-teal-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>2</span>
            <span>المواعيد والخدمات</span>
          </div>
          <div className="h-0.5 flex-1 mx-2 bg-slate-200" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-teal-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200'}`}>3</span>
            <span>تفعيل الواتساب</span>
          </div>
        </div>

        {/* Step 1 Form */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              الخطوة 1: بيانات الطبيب والعيادة
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم العيادة / المركز الطبي</label>
              <input
                type="text"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="مثال: عيادة د. حسام الطبي للأسنان والتجميل"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الدكتور المعتمد</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="أ.د. حسام الدين"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التخصص الدقيق</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="استشاري جراحة وتجميل الأسنان"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رقم هاتف الواتساب للعيادة</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+201099887766"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان العيادة</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="القاهرة المعادي - شارع النصر"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                التالي: ضبط المواعيد والخدمات <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2 Form */}
        {step === 2 && (
          <form onSubmit={handleFinishSetup} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              الخطوة 2: أوقات العمل ومدة الموعد
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وقت بدء العمل اليومي</label>
                <input
                  type="time"
                  value={workStart}
                  onChange={(e) => setWorkStart(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وقت انتهاء العمل اليومي</label>
                <input
                  type="time"
                  value={workEnd}
                  onChange={(e) => setWorkEnd(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">مدة الكشف الافتراضية (بالدقائق)</label>
              <input
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الخدمة الرئيسية للحجز</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="كشف واستشارة تجميلية"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                السابق
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> إنشاء وتفعيل الواتساب الآلي فوراً
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Success & Ready */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">تم تفعيل مستقبل الواتساب الآلي لـ {clinicName}! 🎉</h2>
              <p className="text-xs text-slate-500 mt-1">العيادة جاهزة الآن لاستقبال الحجوزات والرد الآلي 24 ساعة</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-right text-xs space-y-3">
              <div className="font-bold text-slate-800">بيانات الـ Webhook المخصصة للعيادة:</div>
              
              <div>
                <span className="text-[11px] text-slate-500 block mb-0.5">Webhook Callback URL:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono dir-ltr text-left"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow"
              >
                الانتقال للوحة تحكم العيادة ←
              </button>

              <button
                onClick={() => router.push('/test-bot')}
                className="flex-1 py-3 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl shadow"
              >
                تجربة الرد الآلي في المحاكي 🤖
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
