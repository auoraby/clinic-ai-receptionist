'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { clinicStore } from '@/lib/store';
import { Building, Search, Stethoscope, MapPin, Phone, Bot, ArrowLeft, HeartPulse } from 'lucide-react';

export default function PublicClinicsDirectoryPage() {
  const clinics = clinicStore.getClinics();
  const [search, setSearch] = useState('');

  const filtered = clinics.filter(c => 
    c.name.includes(search) || 
    c.doctorName.includes(search) || 
    c.specialty.includes(search) ||
    c.address.includes(search)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dir-rtl font-arabic flex flex-col justify-between">
      
      {/* Header */}
      <header className="bg-navy-950 text-white py-8 border-b border-navy-800">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center text-navy-950 font-bold">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="font-black text-lg">مستقبل العيادة الذكي</span>
            </Link>

            <Link href="/login" className="px-3.5 py-1.5 bg-navy-800 hover:bg-navy-700 text-xs font-bold rounded-xl text-teal-300 border border-navy-700">
              دخول العيادة / الطبيب ←
            </Link>
          </div>

          <div className="pt-2 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-black text-white">دليل العيادات والمراكز الطبية المعتمدة</h1>
            <p className="text-xs text-slate-400 mt-1">حجز مباشر وتواصل آلي فوري عبر مستقبل الواتساب الذكي 24 ساعة</p>
          </div>

          <div className="relative max-w-md pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث باسم الدكتور، التخصص، أو المدينة..."
              className="w-full pr-9 pl-3 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </header>

      {/* Directory Grid */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="bg-teal-50 text-teal-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-teal-200">
                      {c.specialty}
                    </span>
                    <h3 className="font-black text-lg text-slate-900 mt-1">{c.doctorName}</h3>
                    <p className="text-xs text-slate-500 font-bold">{c.name}</p>
                  </div>

                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" title="استقبال آلي نشط 24 ساعة" />
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">{c.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>ساعات العمل: {c.workingHoursStart} - {c.workingHoursEnd}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link
                  href={`/c/${c.slug}`}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl text-center shadow transition"
                >
                  حجز موعد عبر الويب ←
                </Link>

                <a
                  href={`https://wa.me/${c.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 transition"
                >
                  <Bot className="w-4 h-4 text-emerald-600" /> واتساب
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-200">
        مشغل بواسطة مستقبل العيادة الذكي • Multi-Tenant SaaS Platform
      </footer>

    </div>
  );
}
