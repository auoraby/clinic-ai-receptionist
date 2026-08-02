'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { FileText, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TemplatesPage() {
  const { activeClinic } = useClinic();
  const [tick, setTick] = useState(0);

  const templates = clinicStore.getTemplates(activeClinic.id);

  return (
    <div className="page-wrapper animate-fade-up">
      
      {/* Header */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            قوالب الرسائل المعتمدة من Meta WhatsApp
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            إدارة وتعديل قوالب التذكيرات والإشعارات التلقائية لـ {activeClinic.name}
          </p>
        </div>

        <button className="btn btn-primary">
          <Plus className="w-4 h-4" /> إنشاء قالب رسالة جديد
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(tmpl => (
          <motion.div whileHover={{ y: -2 }} key={tmpl.id} className="card p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">{tmpl.name}</h3>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">{tmpl.metaTemplateId}</span>
              </div>

              <span className="badge badge-green flex items-center gap-1 text-[10px] py-1 px-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> معتمد Meta
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-700 leading-relaxed font-mono flex-1">
              {tmpl.bodyPattern}
            </div>

            <div className="text-xs text-slate-500 flex items-center justify-between pt-2">
              <span className="flex items-center gap-1">الفئة: <strong className="text-slate-900">{tmpl.category}</strong></span>
              <span className="flex items-center gap-1">اللغة: <strong className="text-slate-900">{tmpl.language}</strong></span>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
