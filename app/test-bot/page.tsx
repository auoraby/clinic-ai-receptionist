'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { processPatientMessage } from '@/lib/ai/ai-bot';
import { Bot, Send, ShieldAlert, Sparkles, User, RefreshCw } from 'lucide-react';

export default function TestBotPage() {
  const { activeClinic } = useClinic();

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'PATIENT' | 'BOT'; text: string; isSafeguard?: boolean; intent?: string }>>([
    {
      sender: 'BOT',
      text: `مرحباً بك في محاكي الواتساب الذكي لـ (${activeClinic.name})! 🤖\nجرب إرسال رسائل مثل:\n• "عاوز أحجز كشف"\n• "فين عنوان العيادة"\n• "مواعيد العمل كام"\n• "عندي ألم شديد وعاوز علاج" (تجربة الرفض الطبي الصارم)`,
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const patientText = inputMsg.trim();
    setInputMsg('');

    const newMsgs = [...messages, { sender: 'PATIENT' as const, text: patientText }];
    setMessages(newMsgs);

    // Process via AI Bot engine
    setTimeout(() => {
      const botRes = processPatientMessage(activeClinic, '+201000009999', 'مريض تجريبي', patientText);
      setMessages(prev => [
        ...prev,
        {
          sender: 'BOT',
          text: botRes.replyText,
          isSafeguard: botRes.isMedicalSafeguardRefusal,
          intent: botRes.intent,
        }
      ]);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 dir-rtl">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-teal-600" />
            محاكي الرد الآلي للواتساب (Interactive Test Playground)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            اختبر ردود المساعد الآلي لـ {activeClinic.name} مباشرة في متصفحك
          </p>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> إعادة بدء المحادثة
        </button>
      </div>

      {/* WhatsApp Chat Window Container */}
      <div className="bg-slate-100 rounded-3xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col h-[500px]">
        
        {/* Chat Topbar */}
        <div className="bg-teal-800 text-white p-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center font-bold">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-xs">{activeClinic.name} (WhatsApp AI)</div>
            <div className="text-[10px] text-teal-200">متصل الآن 🟢 (تجاوب فوري)</div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#efeae2]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'PATIENT' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-sm p-3 rounded-2xl text-xs leading-relaxed shadow ${
                  m.sender === 'PATIENT'
                    ? 'bg-white text-slate-900 rounded-tr-none'
                    : m.isSafeguard
                    ? 'bg-amber-100 border border-amber-300 text-amber-950 rounded-tl-none font-semibold'
                    : 'bg-[#d9fdd3] text-slate-900 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {m.intent && (
                  <div className="mt-1 text-[9px] font-mono text-slate-500 border-t border-black/10 pt-1 flex items-center justify-between">
                    <span>النية المكتشفة: {m.intent}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="اكتب رسالة كأنك مريض (مثال: عاوز أحجز كشف اليوم)..."
            className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow"
          >
            <Send className="w-4 h-4" /> إرسال
          </button>
        </form>

      </div>

    </div>
  );
}
