'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { FileText, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function TemplatesPage() {
  const { activeClinic } = useClinic();
  const [tick, setTick] = useState(0);

  const templates = clinicStore.getTemplates(activeClinic.id);

  return (
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            قوالب الرسائل المعتمدة من Meta WhatsApp
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة وتعديل قوالب التذكيرات والإشعارات التلقائية لـ {activeClinic.name}
          </p>
        </div>

        <button className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2">
          <Plus className="w-4 h-4" /> إنشاء قالب رسالة جديد
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map(tmpl => (
          <div key={tmpl.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{tmpl.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono">{tmpl.metaTemplateId}</span>
              </div>

              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> معتمد Meta
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-mono">
              {tmpl.bodyPattern}
            </div>

            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
              <span>الفئة: <strong>{tmpl.category}</strong></span>
              <span>اللغة: <strong>{tmpl.language}</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
