'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { Share2, CheckCircle2, Copy, Key, ShieldCheck, Calendar, ExternalLink, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IntegrationsPage() {
  const { activeClinic, refreshClinics } = useClinic();

  const [phoneId, setPhoneId] = useState(activeClinic.whatsappPhoneId || '1098765432101');
  const [copied, setCopied] = useState(false);

  const webhookUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://clinicai.com'}/api/webhooks/whatsapp`;
  const verifyToken = activeClinic.whatsappVerifyToken || 'clinic_ai_secret_verify_token_2026';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    clinicStore.updateClinic(activeClinic.id, { whatsappPhoneId: phoneId });
    refreshClinics();
  };

  return (
    <div className="page-wrapper animate-fade-up">
      
      {/* Header */}
      <div className="card p-6 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-blue-600" />
            الربط مع Meta WhatsApp API و Google Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            إعداد وتفعيل روابط الويب هوك والتراخيص لـ {activeClinic.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meta WhatsApp Integration Card */}
        <motion.div whileHover={{ y: -2 }} className="card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Meta WhatsApp Cloud API</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">حالة الربط: متصل ويعمل بنجاح</p>
              </div>
            </div>

            <span className="badge badge-green px-3 py-1">
              🟢 Active
            </span>
          </div>

          <form onSubmit={handleSaveMeta} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Phone Number ID</label>
              <input
                type="text"
                value={phoneId}
                onChange={(e) => setPhoneId(e.target.value)}
                className="input w-full font-mono dir-ltr text-left"
                required
              />
            </div>

            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl space-y-4">
              <div className="text-xs font-bold text-slate-800">بيانات Webhook Callback المخصصة للتأكيد:</div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Webhook Callback URL:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="input flex-1 font-mono dir-ltr text-left text-xs bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(webhookUrl)}
                      className="btn bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs px-3"
                    >
                      <Copy className="w-3.5 h-3.5 ml-1" /> {copied ? 'تم النسخ' : 'نسخ'}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1 font-medium">Verify Token:</span>
                  <input
                    type="text"
                    readOnly
                    value={verifyToken}
                    className="input w-full font-mono dir-ltr text-left text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="btn btn-primary"
              >
                حفظ بيانات WhatsApp
              </button>
            </div>
          </form>
        </motion.div>

        {/* Google Calendar Integration Card */}
        <motion.div whileHover={{ y: -2 }} className="card p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Google Calendar</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">التقويم المرتبط: <span className="font-mono">{activeClinic.googleCalendarId}</span></p>
              </div>
            </div>

            <span className="badge badge-blue px-3 py-1">
              🟢 Synced
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium">
            يتم مزامنة أي حجز مؤكد عبر مستقبل العيادة الذكي فوراً وإنشاء حدث تقويم جديد على Google Calendar لمنع التعارض والمواعيد المزدوجة.
          </p>

          <div className="pt-2">
             <button className="btn btn-ghost w-full justify-center">
               إدارة إعدادات التقويم <ExternalLink className="w-4 h-4 mr-2" />
             </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
