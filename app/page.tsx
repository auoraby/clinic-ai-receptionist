'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { processPatientMessage } from '@/lib/ai/ai-bot';
import { INITIAL_CLINICS } from '@/lib/mock-data';
import { 
  Bot, 
  Sparkles, 
  CalendarCheck, 
  Users, 
  ShieldCheck, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowLeft, 
  Play, 
  Smartphone, 
  Globe, 
  Zap, 
  Building, 
  Lock,
  MessageSquareText,
  HeartPulse
} from 'lucide-react';

export default function SaaSMainLandingPage() {
  const clinic = INITIAL_CLINICS[0];

  // Interactive Live WhatsApp Chatbot Demo State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'PATIENT' | 'BOT'; text: string; isSafeguard?: boolean; intent?: string }>>([
    {
      sender: 'BOT',
      text: `مرحباً بك في عيادة التجميل الدقيق - د. سارة الشريف! 👋\nكيف يمكنني مساعدتك اليوم؟\n1. حجز موعد كشف\n2. الاستفسار عن مواعيد العمل\n3. موقع العيادة`,
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendPrompt = (promptText: string) => {
    if (isTyping) return;
    const textToSend = promptText || chatInput.trim();
    if (!textToSend) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'PATIENT', text: textToSend }]);
    setIsTyping(true);

    setTimeout(() => {
      const res = processPatientMessage(clinic, '+201000001111', 'مريض تجريبي', textToSend);
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'BOT',
          text: res.replyText,
          isSafeguard: res.isMedicalSafeguardRefusal,
          intent: res.intent,
        }
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dir-rtl font-arabic overflow-x-hidden">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-cobalt-950 text-white shadow-lg border-b border-cobalt-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cobalt-500 to-mint-400 flex items-center justify-center text-white shadow-lg shadow-cobalt-500/20 group-hover:scale-105 transition transform">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">
                مستقبل العيادة <span className="text-mint-300 font-black">الذكي</span>
              </span>
              <span className="text-[10px] text-cobalt-200 font-medium block">Meta WhatsApp AI Receptionist SaaS</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-200">
            <a href="#features" className="hover:text-mint-300 transition">المميزات</a>
            <a href="#demo" className="hover:text-mint-300 transition">التجربة التفاعلية</a>
            <a href="#pricing" className="hover:text-mint-300 transition">الاشتراكات</a>
            <Link href="/clinics" className="hover:text-mint-300 transition">دليل العيادات</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-cobalt-900 hover:bg-cobalt-800 text-mint-300 text-xs font-bold rounded-xl border border-cobalt-800 transition"
            >
              دخول العيادات
            </Link>

            <Link
              href="/setup-wizard"
              className="px-5 py-2.5 bg-mint-500 hover:bg-mint-600 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-mint-500/20 flex items-center gap-1.5 transition transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" /> ابدأ مجاناً
            </Link>
          </div>

        </div>
      </header>

      {/* Clean Clinical Hero Section */}
      <section className="bg-gradient-to-b from-cobalt-950 via-cobalt-900 to-navy-950 text-white pt-12 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mint-500/10 border border-mint-500/30 text-mint-300 text-xs font-extrabold">
              <Sparkles className="w-4 h-4 text-mint-400" />
              <span>منصة أتمتة استقبال العيادات وحجز الواتساب بالذكاء الاصطناعي</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              حوّل واتساب عيادتك إلى <br />
              <span className="bg-gradient-to-r from-mint-300 via-mint-400 to-cobalt-300 bg-clip-text text-transparent">
                مستقبل استقبال يعمل 24 ساعة
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              نظام شامل مخصص للأطباء والعيادات: يرد آلياً على استفسارات المرضى، يعرض المواعيد المتاحة، يحجز ويؤكد فوراً، يدير طابور الانتظار وشاشات التلفزيون العامة، ويمزامن مع Google Calendar تلقائياً.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/setup-wizard"
                className="w-full sm:w-auto px-8 py-4 bg-mint-500 hover:bg-mint-600 text-slate-950 font-black text-sm rounded-2xl shadow-2xl shadow-mint-500/30 flex items-center justify-center gap-2.5 transition transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                تفعيل الواتساب الآلي لعيادتك مجاناً
              </Link>

              <a
                href="#demo"
                className="w-full sm:w-auto px-6 py-4 bg-cobalt-900 hover:bg-cobalt-800 text-white font-bold text-sm rounded-2xl border border-cobalt-800 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 text-mint-300 fill-current" />
                تجربة المحاكي الحي
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-cobalt-800/80 max-w-xl mx-auto lg:mx-0 text-right">
              <div>
                <div className="text-xl sm:text-2xl font-black text-mint-400">100%</div>
                <div className="text-[11px] text-slate-300">حماية ورفض الاستشارات الطبية آلياً</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-mint-300">24/7</div>
                <div className="text-[11px] text-slate-300">رد آلي وحجز فوري بدون انقطاع</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-cobalt-300">0 دقيقة</div>
                <div className="text-[11px] text-slate-300">إعداد وتفعيل بدون تكلفة تسويق</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Interactive iPhone Simulator Right Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center"
            id="demo"
          >
            <div className="w-full max-w-sm bg-cobalt-950 rounded-[40px] p-3 border-4 border-cobalt-800 shadow-2xl relative">
              
              {/* iPhone Dynamic Island / Notch */}
              <div className="w-32 h-5 bg-cobalt-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-cobalt-800 mr-2" />
              </div>

              {/* Chat Container */}
              <div className="bg-[#efeae2] rounded-[30px] overflow-hidden text-slate-900 h-[480px] flex flex-col justify-between shadow-inner">
                
                {/* Header */}
                <div className="bg-cobalt-800 text-white p-3 flex items-center justify-between border-b border-cobalt-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cobalt-600 flex items-center justify-center font-bold text-xs">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">عيادة د. سارة (AI)</div>
                      <div className="text-[9px] text-mint-300">متصل الآن 🟢</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-cobalt-900 px-2 py-0.5 rounded font-bold">Meta WhatsApp</span>
                </div>

                {/* Messages Feed */}
                <div className="p-3 overflow-y-auto space-y-2.5 flex-1">
                  <AnimatePresence>
                    {chatMessages.map((m, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex flex-col ${m.sender === 'PATIENT' ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[85%] p-2.5 rounded-xl text-[11px] leading-relaxed shadow-sm ${
                            m.sender === 'PATIENT'
                              ? 'bg-white text-slate-900 rounded-tr-none'
                              : m.isSafeguard
                              ? 'bg-amber-100 border border-amber-300 text-amber-950 rounded-tl-none font-semibold'
                              : 'bg-[#d9fdd3] text-slate-900 rounded-tl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="bg-[#d9fdd3] p-2 rounded-xl text-[10px] text-slate-500 animate-pulse">
                        يكتب الآن... ✍️
                      </div>
                    </div>
                  )}
                </div>

                {/* Prompt Buttons & Input */}
                <div className="p-2 bg-white border-t border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <button
                      onClick={() => handleSendPrompt('عاوز أحجز موعد كشف')}
                      className="px-2.5 py-1 bg-cobalt-50 hover:bg-cobalt-100 text-cobalt-800 text-[10px] font-bold rounded-full whitespace-nowrap border border-cobalt-200"
                    >
                      📅 عاوز أحجز موعد
                    </button>
                    <button
                      onClick={() => handleSendPrompt('عندي ألم شديد وعاوز علاج')}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 text-[10px] font-bold rounded-full whitespace-nowrap border border-red-200"
                    >
                      🩺 ألم شديد (رفض طبي)
                    </button>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSendPrompt(chatInput); }} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="اكتب رسالة تجريبية..."
                      className="flex-1 p-2 bg-slate-100 rounded-xl text-xs focus:ring-1 focus:ring-cobalt-500 outline-none"
                    />
                    <button type="submit" className="p-2 bg-cobalt-600 text-white rounded-xl">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Features Grid Section - Clean White Background */}
      <section id="features" className="py-20 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-cobalt-700 bg-cobalt-50 px-3 py-1 rounded-full border border-cobalt-200">
            مميزات المنصة الفائقة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            كل ما تحتاجه العيادة للعمل التلقائي الفعال
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            صُمم خصيصاً ليناسب طبيعة عمل الأطباء ومراكز التجميل بدون تعقيدات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {[
            {
              icon: Bot,
              title: 'الرد الآلي وحجز الواتساب 24/7',
              desc: 'الرد التلقائي الفوري على استفسارات المواعيد، الأسعار، وعنوان العيادة عبر Meta WhatsApp Cloud API.',
            },
            {
              icon: ShieldCheck,
              title: 'فلتر الحماية والسلامة الطبية الصارم',
              desc: 'حظر ورفض تقديم أي استشارات طبية أو تشخيص آلياً، والتحويل الفوري لموظف الاستقبال حفاظاً على المرضى.',
            },
            {
              icon: Users,
              title: 'طابور الانتظار وشاشة التلفزيون العامة',
              desc: 'إصدار أرقام الدور، إرسال تنبيه "دورك اقترب" على الواتساب، وعرض الطابور على شاشة التلفزيون مع تشفير البيانات.',
            },
            {
              icon: CalendarCheck,
              title: 'مزامنة تقويم Google Calendar',
              desc: 'ربط مباشر لمنع الحجز المزدوج والتعارضات وتحديث جدول الطبيب فورياً.',
            },
            {
              icon: MessageSquareText,
              title: 'التدخل البشري اليدوي (Human Takeover)',
              desc: 'تمكين موظف الاستقبال من استلام المحادثة وإيقاف البوت فورياً عند الحاجة.',
            },
            {
              icon: Building,
              title: 'منصة متعددة العيادات (Multi-Tenant SaaS)',
              desc: 'إضافة وإدارة أي عدد من العيادات والأطباء بملفات وإعدادات مستقلة لكل منهم.',
            },
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="clinical-card p-6 space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-cobalt-50 text-cobalt-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            );
          })}

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold text-cobalt-700 bg-cobalt-50 px-3 py-1 rounded-full border border-cobalt-200">
            خطط الاشتراكات المرنة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            اختر الباقة المناسبة لعيادتك
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            استثمار بسيط يوفر عليك راتب موظف استقبال كامل ويمنع ضياع المواعيد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Plan 1 */}
          <div className="clinical-card p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">الباقة الأساسية</h3>
              <p className="text-xs text-slate-500">مناسبة للعيادات الفردية الصغيرة</p>
              <div className="text-3xl font-black text-cobalt-600">
                500 <span className="text-xs text-slate-400 font-normal">جنيه / شهرياً</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600" /> رد آلي وحجز الواتساب 24/7</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600" /> طابور انتظار حتى 100 مريض</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600" /> تذكيرات المواعيد المجدولة</li>
              </ul>
            </div>

            <Link href="/setup-wizard" className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center transition">
              اشترك في الباقة الأساسية
            </Link>
          </div>

          {/* Plan 2 Popular */}
          <div className="clinical-card p-6 space-y-6 flex flex-col justify-between border-2 border-cobalt-600 relative shadow-xl">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-cobalt-600 text-white font-black text-[10px] px-3 py-1 rounded-full shadow">
              🌟 الأكثر إقبالاً للعيادات
            </span>

            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">الباقة المتقدمة</h3>
              <p className="text-xs text-cobalt-600 font-bold">لعيادات التجميل والمراكز النشطة</p>
              <div className="text-3xl font-black text-cobalt-700">
                1,200 <span className="text-xs text-slate-400 font-normal">جنيه / شهرياً</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 pt-4 border-t border-slate-100 font-bold">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cobalt-600" /> كل مميزات الباقة الأساسية</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cobalt-600" /> طابور انتظار وشاشة تلفزيون عامة</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cobalt-600" /> مزامنة تقويم Google Calendar</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-cobalt-600" /> فلتر الحماية الطبية الصارم</li>
              </ul>
            </div>

            <Link href="/setup-wizard" className="w-full py-3.5 bg-cobalt-600 hover:bg-cobalt-700 text-white font-black text-xs rounded-xl text-center shadow-lg transition">
              ابدأ الباقة المتقدمة مجاناً
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="clinical-card p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-slate-900">باقة المراكز والمستشفيات</h3>
              <p className="text-xs text-slate-500">للمراكز الطبية الكبيرة</p>
              <div className="text-3xl font-black text-cobalt-600">
                2,500 <span className="text-xs text-slate-400 font-normal">جنيه / شهرياً</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-100 font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600" /> أطباء وعيادات غير محدودة</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600" /> دعم متقدم ومسؤول حساب خاص</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-mint-600" /> ربط مخصص مع أنظمة الـ EHR</li>
              </ul>
            </div>

            <Link href="/setup-wizard" className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl text-center transition">
              تواصل مع المبيعات
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cobalt-600 text-white flex items-center justify-center font-bold">
              <HeartPulse className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900">مستقبل العيادة الذكي • Clinic AI Receptionist</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/clinics" className="hover:text-cobalt-600">دليل العيادات</Link>
            <Link href="/status" className="hover:text-cobalt-600">حالة النظام</Link>
            <Link href="/privacy" className="hover:text-cobalt-600">الخصوصية والأمان</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
