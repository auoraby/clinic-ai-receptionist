'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { processPatientMessage } from '@/lib/ai/ai-bot';
import { INITIAL_CLINICS } from '@/lib/mock-data';
import Logo from '@/components/Logo';
import {
  Bot, Sparkles, CalendarCheck, Users, ShieldCheck,
  Send, CheckCircle2, Play, Building, MessageSquareText,
  ArrowLeft
} from 'lucide-react';

export default function LandingPage() {
  const clinic = INITIAL_CLINICS[0];
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'PATIENT' | 'BOT'; text: string; isSafeguard?: boolean;
  }>>([{
    sender: 'BOT',
    text: `مرحباً بك! 👋\nأنا المستقبل الآلي لعيادة د. سارة (AiYADA).\n\nكيف يمكنني مساعدتك؟\n١. حجز موعد كشف\n٢. مواعيد العمل\n٣. موقع العيادة`,
  }]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = (text: string) => {
    if (isTyping || !text.trim()) return;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'PATIENT', text }]);
    setIsTyping(true);
    setTimeout(() => {
      const res = processPatientMessage(clinic, '+201000001111', 'زائر', text);
      setChatMessages(prev => [...prev, {
        sender: 'BOT', text: res.replyText, isSafeguard: res.isMedicalSafeguardRefusal,
      }]);
      setIsTyping(false);
    }, 700);
  };

  const features = [
    { icon: Bot,              title: 'رد آلي 24/7 عبر الواتساب',       desc: 'يرد على الاستفسارات ويحجز المواعيد تلقائياً بدون تدخل بشري.' },
    { icon: ShieldCheck,      title: 'فلتر الحماية الطبية الصارم',     desc: 'يرفض التشخيص والاستشارات الطبية آلياً ويحوّل للاستقبال فوراً.' },
    { icon: Users,            title: 'طابور انتظار وشاشة TV',          desc: 'أرقام دور تلقائية وتنبيه "دورك اقترب" وعرض على شاشة الانتظار.' },
    { icon: CalendarCheck,    title: 'مزامنة Google Calendar',         desc: 'ربط مباشر لمنع تعارض المواعيد وتحديث تقويم الطبيب فورياً.' },
    { icon: MessageSquareText,title: 'تدخل بشري (Human Takeover)',     desc: 'موظف الاستقبال يستلم المحادثة ويوقف البوت بنقرة واحدة.' },
    { icon: Building,         title: 'منصة Multi-Tenant للعيادات',     desc: 'أي عدد من العيادات بإعدادات مستقلة لكل دكتور.' },
  ];

  const plans = [
    { name: 'الباقة الأساسية', price: '500', per: 'جنيه/شهر', cta: 'ابدأ الآن', featured: false,
      features: ['رد آلي وحجز الواتساب', 'طابور انتظار ١٠٠ مريض', 'تذكيرات تلقائية'] },
    { name: 'الباقة المتقدمة', price: '1,200', per: 'جنيه/شهر', cta: 'ابدأ مجاناً', featured: true,
      features: ['كل مميزات الأساسية', 'شاشة انتظار TV', 'مزامنة Google Calendar', 'فلتر الحماية الطبية'] },
    { name: 'باقة المراكز',   price: '2,500', per: 'جنيه/شهر', cta: 'تواصل معنا', featured: false,
      features: ['أطباء وعيادات غير محدودة', 'دعم VIP ومسؤول حساب', 'ربط مخصص مع الـ EHR'] },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>

      {/* ── Navbar ─────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200" style={{ boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo size="md" showTagline={true} />

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#00A8B5] transition">المميزات</a>
            <a href="#demo"     className="hover:text-[#00A8B5] transition">التجربة التفاعلية</a>
            <a href="#pricing"  className="hover:text-[#00A8B5] transition">الأسعار</a>
            <Link href="/clinics" className="hover:text-[#00A8B5] transition">دليل العيادات</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link href="/dashboard" className="btn btn-ghost text-xs">دخول العيادات</Link>
            <Link href="/setup-wizard" className="btn btn-primary text-xs">
              <Sparkles className="w-3.5 h-3.5" /> ابدأ مجاناً
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────── */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-5 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left: Copy */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
            className="space-y-7 text-center lg:text-right">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00A8B5]/15 border border-[#00A8B5]/30 text-[#00A8B5] text-xs font-bold">
              <span className="dot-online" />
              AiYADA • استقبال ذكي . مواعيد اسهل
            </div>

            <h1 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight">
              حوّل عيادتك مع{' '}
              <span className="text-[#00A8B5]">AiYADA</span>
              <br />
              <span className="text-slate-300 text-3xl sm:text-4xl block mt-2 font-bold">
                استقبال ذكي . مواعيد اسهل
              </span>
            </h1>

            <p className="text-slate-300 text-base leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
              يرد آلياً على المرضى، يحجز المواعيد، يدير طابور الانتظار وشاشات التلفزيون، ويمزامن مع Google Calendar — كل ذلك بدون أي تدخل يدوي.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/setup-wizard" className="btn btn-primary btn-xl">
                <Sparkles className="w-4 h-4" /> تفعيل الواتساب الآلي مجاناً
              </Link>
              <a href="#demo" className="btn btn-ghost btn-xl border-slate-700 text-slate-300 hover:bg-slate-800">
                <Play className="w-4 h-4 text-emerald-400 fill-current" /> تجربة حية
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 pt-2 border-t border-slate-800">
              {[['24/7', 'رد تلقائي مستمر'], ['100%', 'حماية طبية صارمة'], ['٠ دقيقة', 'وقت الإعداد']].map(([v, l]) => (
                <div key={l} className="text-center">
                  <div className="text-xl font-black text-blue-400">{v}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: iPhone WhatsApp Simulator */}
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.5, delay:0.15 }}
            className="flex justify-center" id="demo">
            <div className="w-72 bg-slate-900 rounded-[2.5rem] p-2.5 border-2 border-slate-700 shadow-2xl">
              {/* Notch */}
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2" />

              <div className="rounded-[2rem] overflow-hidden bg-[#efeae2] flex flex-col h-[480px]">
                {/* Chat Header */}
                <div className="bg-slate-800 text-white px-3.5 py-2.5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">عيادة د. سارة (AI)</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="dot-online w-1.5 h-1.5 inline-block" /> متصل الآن
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
                  <AnimatePresence>
                    {chatMessages.map((m, i) => (
                      <motion.div key={i}
                        initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.25 }}
                        className={`flex ${m.sender === 'PATIENT' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[82%] px-3 py-2 rounded-xl text-[11px] leading-relaxed shadow-sm ${
                          m.sender === 'PATIENT' ? 'bg-white text-slate-900 rounded-tr-none'
                          : m.isSafeguard ? 'bg-amber-100 border border-amber-200 text-amber-900 rounded-tl-none'
                          : 'bg-[#d9fdd3] text-slate-900 rounded-tl-none'
                        }`}>
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="bg-[#d9fdd3] px-3 py-2 rounded-xl text-[10px] text-slate-500 animate-pulse">
                        يكتب... ✍️
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="bg-white border-t border-slate-200 p-2 space-y-1.5">
                  <div className="flex gap-1.5 overflow-x-auto">
                    {[
                      { label: '📅 أحجز موعد', text: 'عاوز أحجز موعد كشف' },
                      { label: '🩺 عندي ألم', text: 'عندي ألم شديد وعاوز علاج' },
                    ].map(p => (
                      <button key={p.label} onClick={() => sendMessage(p.text)}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition border border-slate-200">
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={e => { e.preventDefault(); sendMessage(chatInput); }} className="flex gap-1.5">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                      placeholder="اكتب رسالة..." className="flex-1 input text-[11px] py-1.5" />
                    <button type="submit" className="p-1.5 bg-blue-600 text-white rounded-lg">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── Features ──────────────────────────── */}
      <section id="features" className="py-20 bg-[#F7F8FA] border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="badge badge-blue text-xs">مميزات المنصة</span>
            <h2 className="text-3xl font-black text-slate-900">كل ما تحتاجه العيادة للعمل التلقائي</h2>
            <p className="text-slate-500 text-sm font-medium">صُمم خصيصاً للأطباء ومراكز التجميل بدون أي تعقيدات</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} whileHover={{ y:-3 }} className="card p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────── */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="badge badge-blue text-xs">خطط الاشتراكات</span>
            <h2 className="text-3xl font-black text-slate-900">اختر الباقة المناسبة لعيادتك</h2>
            <p className="text-slate-500 text-sm font-medium">استثمار بسيط يوفر عليك راتب موظف استقبال كامل</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map(plan => (
              <div key={plan.name} className={`card p-7 flex flex-col gap-6 relative ${
                plan.featured ? 'border-2 border-blue-600 shadow-xl' : ''
              }`}>
                {plan.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 badge badge-blue text-[10px] shadow">
                    🌟 الأكثر إقبالاً
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{plan.name}</h3>
                  <div className="text-3xl font-black text-slate-900 mt-2">
                    {plan.price}
                    <span className="text-sm font-medium text-slate-400 mr-1">{plan.per}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map(feat => (
                    <li key={feat} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.featured ? 'text-blue-600' : 'text-emerald-500'}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/setup-wizard"
                  className={`btn btn-lg w-full justify-center ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-slate-500 font-medium">
          <Logo size="sm" showTagline={true} />
          <div className="flex gap-6">
            <Link href="/clinics"  className="hover:text-[#00A8B5] transition">دليل العيادات</Link>
            <Link href="/status"   className="hover:text-[#00A8B5] transition">حالة النظام</Link>
            <Link href="/privacy"  className="hover:text-[#00A8B5] transition">الخصوصية</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
