'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/context/clinic-context';
import { clinicStore } from '@/lib/store';
import { processPatientMessage } from '@/lib/ai/ai-bot';
import { Bot, Send, ShieldAlert, Sparkles, User, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const quickPrompts = [
    "عاوز أحجز كشف",
    "فين عنوان العيادة",
    "مواعيد العمل كام",
    "عندي ألم شديد وعاوز علاج"
  ];

  return (
    <div className="page-wrapper max-w-3xl mx-auto animate-fade-up">
      
      {/* Header */}
      <div className="card p-6 flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            محاكي الرد الآلي للواتساب (Interactive Test Playground)
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            اختبر ردود المساعد الآلي لـ {activeClinic.name} مباشرة في متصفحك
          </p>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="btn btn-ghost"
        >
          <RefreshCw className="w-4 h-4" /> إعادة بدء المحادثة
        </button>
      </div>

      {/* WhatsApp Chat Window Container */}
      <motion.div whileHover={{ y: -2 }} className="card overflow-hidden flex flex-col h-[600px] border-slate-200 shadow-lg">
        
        {/* Chat Topbar */}
        <div className="bg-slate-900 text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-sm">{activeClinic.name} (WhatsApp AI)</div>
            <div className="text-xs text-blue-200 mt-0.5">متصل الآن 🟢 (تجاوب فوري)</div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#f8f9fa] shadow-inner">
          {messages.map((m, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx}
              className={`flex flex-col ${m.sender === 'PATIENT' ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.sender === 'PATIENT'
                    ? 'bg-white text-slate-900 rounded-tr-none border border-slate-100'
                    : m.isSafeguard
                    ? 'bg-amber-100 border border-amber-300 text-amber-950 rounded-tl-none font-semibold'
                    : 'bg-blue-600 text-white rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.text}</p>

                {m.intent && (
                  <div className={`mt-2 text-[10px] font-mono border-t pt-1.5 flex items-center justify-between ${m.sender === 'BOT' && !m.isSafeguard ? 'text-blue-200 border-blue-500/30' : 'text-slate-500 border-black/10'}`}>
                    <span>النية المكتشفة: {m.intent}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => setInputMsg(prompt)}
              className="text-xs bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-full px-3 py-1.5 transition-colors font-medium shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Form Input */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="اكتب رسالة كأنك مريض (مثال: عاوز أحجز كشف اليوم)..."
            className="input flex-1 bg-slate-50"
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputMsg.trim()}
          >
            <Send className="w-4 h-4" /> إرسال
          </button>
        </form>

      </motion.div>

    </div>
  );
}
