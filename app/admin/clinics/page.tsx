'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { useAuth } from '@/lib/context/auth-context';
import { clinicStore } from '@/lib/store';
import { Building, Plus, CheckCircle2, ShieldCheck, Stethoscope, Phone, MapPin } from 'lucide-react';

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
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-950 p-6 rounded-2xl text-white shadow-xl flex items-center justify-between border border-navy-700">
        <div>
          <span className="bg-teal-500/20 text-teal-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-teal-500/40">
            بوابة المدير العام (Super Admin Multi-Tenant Portal)
          </span>
          <h1 className="text-xl font-extrabold tracking-tight mt-1">
            إضافة وإدارة العيادات والمراكز الطبية
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            يمكنك تسجيل أي عيادة أو طبيب جديد في النظام فوراً وتخصيص المساعد الآلي وواتساب لكل منهم
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-teal-400 hover:bg-teal-300 text-navy-950 font-black text-xs rounded-xl shadow-lg shadow-teal-400/20 flex items-center gap-2 transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" /> إضافة عيادة / دكتور جديد
        </button>
      </div>

      {/* Registered Clinics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clinics.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{c.name}</h3>
                <p className="text-xs text-teal-700 font-bold">{c.doctorName} - {c.specialty}</p>
              </div>

              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                نشط 🟢
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span className="truncate">{c.address}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-teal-600" />
                <span>{c.phone} (WhatsApp Phone ID: {c.whatsappPhoneId})</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => selectClinic(c.id)}
                className="px-4 py-2 bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs rounded-xl transition"
              >
                الدخول كـ لوحة تحكم هذه العيادة ←
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Clinic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 dir-rtl">
            <h3 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              تسجيل عيادة / طبيب جديد في النظام
            </h3>

            <form onSubmit={handleCreateClinic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم العيادة / المركز الطبي</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: عيادة د. محمد نور لطب الأسنان"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطبيب المعالج</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="أ.د. محمد نور"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التخصص الدقيق</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="استشاري جراحة الأسنان والزرع"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف وشبكة الواتساب</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+201099998888"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان العيادة</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="القاهرة مدينة نصر - شارع الطيران"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-teal-600/20"
                >
                  إنشاء وتفعيل العيادة فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
