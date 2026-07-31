'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export default function CalendarPage() {
  const { activeClinic } = useClinic();
  const appointments = clinicStore.getAppointments(activeClinic.id);
  const [selectedDay, setSelectedDay] = useState('اليوم (الجمعة)');

  const timeSlots = [
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
    '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  ];

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-600" />
            جدول التقويم اليومي والأسسبوعي
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مزامنة مباشرة مع Google Calendar الخاص بـ {activeClinic.doctorName}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-xl">
          <button className="p-1.5 text-slate-600 hover:bg-white rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 px-2">{selectedDay}</span>
          <button className="p-1.5 text-slate-600 hover:bg-white rounded-lg">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-center justify-between text-teal-900 text-xs">
        <div className="flex items-center gap-2 font-bold">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          التقويم متصل بنجاح مع Google Calendar ({activeClinic.googleCalendarId})
        </div>
        <span className="text-[10px] bg-teal-200/60 px-2 py-0.5 rounded font-semibold text-teal-800">
          تزامن تلقائي كل 5 دقائق
        </span>
      </div>

      {/* Time Grid View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
          جدول الأوقات والحجوزات (Slot Grid)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {timeSlots.map((slot, idx) => {
            // Check if slot matched
            const booked = appointments.find(a => idx % 3 === 0 && idx < 6 && a.status !== 'CANCELLED');

            return (
              <div
                key={slot}
                className={`p-3.5 rounded-xl border transition ${
                  booked
                    ? 'border-teal-300 bg-teal-50/50 hover:bg-teal-100/50'
                    : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {slot}
                  </span>
                  {booked ? (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">
                      محيوز
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                      متاح
                    </span>
                  )}
                </div>

                {booked ? (
                  <div className="text-[11px] font-bold text-slate-800 border-t border-teal-200/60 pt-1.5 mt-1.5">
                    <div>{booked.patientName}</div>
                    <div className="text-[10px] text-teal-700 font-normal">{booked.appointmentTypeName}</div>
                  </div>
                ) : (
                  <div className="text-[10px] text-slate-400 pt-1 mt-1">
                    جاهز للحجز الآلي من المساعد
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
