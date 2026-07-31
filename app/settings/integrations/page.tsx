'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { Share2, CheckCircle2, Copy, Key, ShieldCheck, Calendar, ExternalLink } from 'lucide-react';

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
    <div className="space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-teal-600" />
            الربط مع Meta WhatsApp API و Google Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إعداد وتفعيل روابط الويب هوك والتراخيص لـ {activeClinic.name}
          </p>
        </div>
      </div>

      {/* Meta WhatsApp Integration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              WA
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Meta WhatsApp Cloud API Connection</h3>
              <p className="text-[11px] text-slate-500">حالة الربط: متصل ويعمل بنجاح (Online)</p>
            </div>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300">
            🟢 Webhook Active
          </span>
        </div>

        <form onSubmit={handleSaveMeta} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number ID</label>
            <input
              type="text"
              value={phoneId}
              onChange={(e) => setPhoneId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-500 dir-ltr text-left"
              required
            />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="text-xs font-bold text-slate-800">بيانات Webhook Callback المخصصة للتأكيد في Meta Dashboard:</div>
            
            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-slate-500 block mb-0.5">Webhook Callback URL:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono dir-ltr text-left"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(webhookUrl)}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" /> {copied ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-500 block mb-0.5">Verify Token:</span>
                <input
                  type="text"
                  readOnly
                  value={verifyToken}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono dir-ltr text-left"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow"
            >
              حفظ بيانات WhatsApp Phone ID
            </button>
          </div>
        </form>
      </div>

      {/* Google Calendar Integration Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Google Calendar Integration</h3>
              <p className="text-[11px] text-slate-500">التقويم المرتبط: {activeClinic.googleCalendarId}</p>
            </div>
          </div>

          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-300">
            🟢 Synced
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          يتم مزامنة أي حجز مؤكد عبر مستقبل العيادة الذكي فوراً وإنشاء حدث تقويم جديد على Google Calendar لمنع التعارض والمواعيد المزدوجة.
        </p>
      </div>

    </div>
  );
}
