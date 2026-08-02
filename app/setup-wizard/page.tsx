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
import { motion } from 'framer-motion';

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
    <div className="page-wrapper min-h-screen bg-[#F7F8FA] flex flex-col justify-center p-4 sm:p-8 animate-fade-up">
      
      <div className="max-w-2xl mx-auto w-full space-y-8">
        
        {/* Wizard Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-600/20">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            أداة تهيئة الواتساب الآلي للعيادة في 3 خطوات
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            أدخل بيانات الدكتور والعيادة وقم بتفعيل ردود الواتساب التلقائية فوراً
          </p>
        </div>

        {/* Step Stepper Progress */}
        <div className="flex items-center justify-between max-w-md mx-auto px-4 text-xs font-bold relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2 rounded-full" />
          <div className="absolute top-1/2 right-0 h-0.5 bg-blue-600 -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />

          <div className={`flex flex-col items-center gap-2 bg-[#F7F8FA] px-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm transition-colors ${step >= 1 ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-200 text-slate-500'}`}>1</span>
            <span className="text-[10px] sm:text-xs">بيانات العيادة</span>
          </div>
          <div className={`flex flex-col items-center gap-2 bg-[#F7F8FA] px-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm transition-colors ${step >= 2 ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-200 text-slate-500'}`}>2</span>
            <span className="text-[10px] sm:text-xs">المواعيد والخدمات</span>
          </div>
          <div className={`flex flex-col items-center gap-2 bg-[#F7F8FA] px-2 ${step === 3 ? 'text-blue-600' : 'text-slate-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm transition-colors ${step === 3 ? 'bg-blue-600 text-white shadow-blue-600/30' : 'bg-slate-200 text-slate-500'}`}>3</span>
            <span className="text-[10px] sm:text-xs">تفعيل الواتساب</span>
          </div>
        </div>

        {/* Step 1 Form */}
        {step === 1 && (
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleNextStep1} className="card p-6 sm:p-8 space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              الخطوة 1: بيانات الطبيب والعيادة
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العيادة / المركز الطبي</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="مثال: عيادة د. حسام الطبي للأسنان والتجميل"
                  className="input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الدكتور المعتمد</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="أ.د. حسام الدين"
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">التخصص الدقيق</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="استشاري جراحة وتجميل الأسنان"
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم هاتف الواتساب للعيادة</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+201099887766"
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان العيادة</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="القاهرة المعادي - شارع النصر"
                  className="input w-full"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary px-8"
              >
                التالي: ضبط المواعيد والخدمات <ArrowLeft className="w-4 h-4 mr-2" />
              </button>
            </div>
          </motion.form>
        )}

        {/* Step 2 Form */}
        {step === 2 && (
          <motion.form initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleFinishSetup} className="card p-6 sm:p-8 space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              الخطوة 2: أوقات العمل ومدة الموعد
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">وقت بدء العمل اليومي</label>
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="input w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">وقت انتهاء العمل اليومي</label>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">مدة الكشف الافتراضية (بالدقائق)</label>
                <input
                  type="number"
                  value={slotDuration}
                  onChange={(e) => setSlotDuration(e.target.value)}
                  className="input w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الخدمة الرئيسية للحجز</label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="كشف واستشارة تجميلية"
                  className="input w-full"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn btn-ghost"
              >
                السابق
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                <Sparkles className="w-4 h-4 ml-2" /> إنشاء وتفعيل الواتساب الآلي فوراً
              </button>
            </div>
          </motion.form>
        )}

        {/* Step 3: Success & Ready */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 space-y-6 text-center border-emerald-200 border-2">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">تم تفعيل مستقبل الواتساب الآلي لـ {clinicName}! 🎉</h2>
              <p className="text-sm text-slate-500 mt-2 font-medium">العيادة جاهزة الآن لاستقبال الحجوزات والرد الآلي 24 ساعة</p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-right text-sm space-y-3">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                بيانات الـ Webhook المخصصة للعيادة:
              </div>
              
              <div>
                <span className="text-xs text-slate-500 block mb-1 font-medium">Webhook Callback URL:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="input flex-1 font-mono dir-ltr text-left text-xs"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="btn bg-slate-200 hover:bg-slate-300 text-slate-800"
                  >
                    <Copy className="w-4 h-4 ml-1" /> {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-primary flex-1 py-3"
              >
                الانتقال للوحة تحكم العيادة ←
              </button>

              <button
                onClick={() => router.push('/test-bot')}
                className="btn bg-slate-900 hover:bg-slate-800 text-white flex-1 py-3"
              >
                تجربة الرد الآلي في المحاكي 🤖
              </button>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
}
