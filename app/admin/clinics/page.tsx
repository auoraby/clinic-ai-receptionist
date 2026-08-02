'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { useAuth } from '@/lib/context/auth-context';
import { clinicStore } from '@/lib/store';
import { Building, Plus, CheckCircle2, ShieldCheck, Stethoscope, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuperAdminClinicsPage() {
  const { clinics, selectClinic, refreshClinics } = useClinic();
  const { user } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappPhoneId, setWhatsappPhoneId] = useState('');
  const [address, setAddress] = useState('');

  const handleCreateClinic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !doctorName) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + `-${Date.now()}`;

    clinicStore.addClinic({
      name,
      slug,
      doctorName,
      specialty,
      phone,
      whatsappPhoneId: whatsappPhoneId || `109876543210${clinics.length + 1}`,
      whatsappVerifyToken: 'clinic_ai_secret_verify_token_2026',
      googleCalendarId: `${slug}@gmail.com`,
      address: address || 'القاهرة - مصر',
      mapsUrl: 'https://maps.google.com',
      workingDays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      workingHoursStart: '12:00',
      workingHoursEnd: '20:00',
      slotDurationMinutes: 30,
      bufferTimeMinutes: 10,
      avgConsultationMins: 20,
      isActive: true,
    });

    refreshClinics();
    setShowAddModal(false);
    setName('');
    setDoctorName('');
  };

  return (
    <div className="page-wrapper animate-fade-up">
      
      {/* Header */}
      <div className="card p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="badge bg-blue-500/20 text-blue-200 border border-blue-500/30 mb-2 inline-flex">
            بوابة المدير العام (Super Admin Multi-Tenant Portal)
          </span>
          <h1 className="text-xl font-black tracking-tight mt-1">
            إضافة وإدارة العيادات والمراكز الطبية
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            يمكنك تسجيل أي عيادة أو طبيب جديد في النظام فوراً وتخصيص المساعد الآلي وواتساب لكل منهم
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn bg-blue-500 hover:bg-blue-400 text-white font-bold"
        >
          <Plus className="w-4 h-4 ml-1" /> إضافة عيادة / دكتور جديد
        </button>
      </div>

      {/* Registered Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinics.map(c => (
          <motion.div whileHover={{ y: -2 }} key={c.id} className="card p-5 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{c.name}</h3>
                <p className="text-xs text-blue-600 font-bold mt-1">{c.doctorName} - {c.specialty}</p>
              </div>

              <span className="badge badge-green px-2 py-1">
                نشط 🟢
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 mb-6 flex-1 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="truncate">{c.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{c.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-auto">
              <button
                onClick={() => selectClinic(c.id)}
                className="btn btn-ghost w-full justify-center group"
              >
                الدخول كـ لوحة تحكم هذه العيادة <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Clinic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card max-w-lg w-full p-6 sm:p-8 shadow-2xl border-0">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-4 mb-5">
              تسجيل عيادة / طبيب جديد في النظام
            </h3>

            <form onSubmit={handleCreateClinic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العيادة / المركز الطبي</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: عيادة د. محمد نور لطب الأسنان"
                  className="input w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الطبيب المعالج</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="أ.د. محمد نور"
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
                    placeholder="استشاري جراحة الأسنان والزرع"
                    className="input w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف وشبكة الواتساب</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+201099998888"
                  className="input w-full dir-ltr text-left"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان العيادة</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="القاهرة مدينة نصر - شارع الطيران"
                  className="input w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  إنشاء وتفعيل العيادة فوراً
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
