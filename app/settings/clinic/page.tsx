'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { Settings, Save, MapPin, Clock, Stethoscope, Phone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="page-wrapper animate-fade-up">
      
      {/* Header */}
      <div className="card p-6 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            إعدادات العيادة والمعلومات الموثقة
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            إدخال وتحديث البيانات المعتمدة لـ {activeClinic.name} التي يتم الاعتماد عليها في الرد الآلي
          </p>
        </div>

        {savedSuccess && (
          <span className="badge badge-green px-3.5 py-1.5 flex items-center gap-1.5 animate-pulse text-xs">
            <CheckCircle2 className="w-4 h-4" /> تم حفظ التغييرات بنجاح
          </span>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="card p-6 sm:p-8 space-y-8">
        
        {/* Section 1: Doctor Profile */}
        <div className="space-y-5 border-b border-slate-100 pb-8">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-blue-600" />
            </div>
            بيانات الطبيب والتخصص
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم الطبيب المعتمد</label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">التخصص الطبي الدقيق</label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="input w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Address & Location */}
        <div className="space-y-5 border-b border-slate-100 pb-8">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            العنوان ورابط الخرائط (Google Maps)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان العيادة التفصيلي</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">رابط Google Maps التفاعلي</label>
              <input
                type="url"
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                className="input w-full dir-ltr text-left"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Working Hours & Slots */}
        <div className="space-y-5 border-b border-slate-100 pb-8">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            ساعات العمل وطول مدة الموعد
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">بداية العمل اليومي</label>
              <input
                type="time"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">نهاية العمل اليومي</label>
              <input
                type="time"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">مدة الكشف الافتراضية (بالدقائق)</label>
              <input
                type="number"
                value={slotDuration}
                onChange={(e) => setSlotDuration(Number(e.target.value))}
                className="input w-full"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="btn btn-primary px-8"
          >
            <Save className="w-4 h-4 ml-2" /> حفظ التغييرات وتحديث المساعد الآلي
          </button>
        </div>

      </form>

    </div>
  );
}
