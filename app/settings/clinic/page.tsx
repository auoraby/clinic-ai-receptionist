'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { Settings, Save, MapPin, Clock, Stethoscope, Phone, CheckCircle2 } from 'lucide-react';

export default function ClinicSettingsPage() {
  const { activeClinic, refreshClinics } = useClinic();

  const [doctorName, setDoctorName] = useState(activeClinic.doctorName);
  const [specialty, setSpecialty] = useState(activeClinic.specialty);
  const [address, setAddress] = useState(activeClinic.address);
  const [mapsUrl, setMapsUrl] = useState(activeClinic.mapsUrl || '');
  const [phone, setPhone] = useState(activeClinic.phone);
  const [workStart, setWorkStart] = useState(activeClinic.workingHoursStart);
  const [workEnd, setWorkEnd] = useState(activeClinic.workingHoursEnd);
  const [slotDuration, setSlotDuration] = useState(activeClinic.slotDurationMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    clinicStore.updateClinic(activeClinic.id, {
      doctorName,
      specialty,
      address,
      mapsUrl,
      phone,
      workingHoursStart: workStart,
      workingHoursEnd: workEnd,
      slotDurationMinutes: Number(slotDuration),
    });
    refreshClinics();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600" />
            إعدادات العيادة والمعلومات الموثقة
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدخال وتحديث البيانات المعتمدة لـ {activeClinic.name} التي يتم الاعتماد عليها في الرد الآلي
          </p>
        </div>

        {savedSuccess && (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3.5 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1.5 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> تم حفظ التغييرات بنجاح
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        
        {/* Section 1: Doctor Profile */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            بيانات الطبيب والتخصص
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم الطبيب المعتمد</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">التخصص الطبي الدقيق</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address & Location */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            العنوان ورابط الخرائط (Google Maps)
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">عنوان العيادة التفصيلي</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">رابط Google Maps التفاعلي</label>
              <input
                type="url"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 dir-ltr text-left"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Working Hours & Slots */}
        <div className="space-y-4 border-b border-slate-100 pb-5">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            ساعات العمل وطول مدة الموعد
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">بداية العمل اليومي</label>
              <input
                type="time"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">نهاية العمل اليومي</label>
              <input
                type="time"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">مدة الكشف الافتراضية (بالدقائق)</label>
              <input
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" /> حفظ التغييرات وتحديث المساعد الآلي
          </button>
        </div>

      </form>

    </div>
  );
}
