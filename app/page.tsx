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
  ChevronDown,
  Lock,
  MessageSquareText
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
    <div className="min-h-screen bg-navy-950 text-white dir-rtl font-arabic overflow-x-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-lime-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 border-b border-navy-800/80 bg-navy-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-limeAccent-500 flex items-center justify-center text-navy-950 shadow-xl shadow-teal-500/20 group-hover:scale-105 transition transform">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">
                مستقبل العيادة <span className="text-teal-400 font-black">الذكي</span>
              </span>
              <span className="text-[10px] text-teal-300 font-bold block">Clinic AI Receptionist SaaS</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#features" className="hover:text-teal-400 transition">المميزات</a>
            <a href="#demo" className="hover:text-teal-400 transition">التجربة التفاعلية</a>
            <a href="#pricing" className="hover:text-teal-400 transition">الاشتراكات</a>
            <Link href="/clinics" className="hover:text-teal-400 transition">دليل العيادات</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2.5 bg-navy-800 hover:bg-navy-700 text-teal-300 text-xs font-bold rounded-xl border border-navy-700 transition"
            >
              دخول العيادات
            </Link>

            <Link
              href="/setup-wizard"
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-navy-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center gap-1.5 transition transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" /> ابدأ مجاناً
            </Link>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content Left Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-right"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>منصة أتمتة استقبال العيادات وحجز الواتساب بالذكاء الاصطناعي</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              حوّل واتساب عيادتك إلى <br />
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-limeAccent-400 bg-clip-text text-transparent">
                مستقبل استقبال يعمل 24 ساعة
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              نظام شامل مخصص للأطباء والعيادات: يرد آلياً على استفسارات المرضى، يعرض المواعيد المتاحة، يحجز ويؤكد فوراً، يدير طابور الانتظار وشاشات التلفزيون العامة، ويمزامن مع Google Calendar تلقائياً.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/setup-wizard"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-navy-950 font-black text-sm rounded-2xl shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-2.5 transition transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 text-navy-950" />
                تفعيل الواتساب الآلي لعيادتك مجاناً
              </Link>

              <a
                href="#demo"
                className="w-full sm:w-auto px-6 py-4 bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm rounded-2xl border border-navy-700 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 text-teal-400 fill-current" />
                تجربة المحاكي الحي
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-navy-800/80 max-w-xl mx-auto lg:mx-0 text-right">
              <div>
                <div className="text-xl sm:text-2xl font-black text-teal-400">100%</div>
                <div className="text-[11px] text-slate-400">حماية ورفض الاستشارات الطبية آلياً</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-limeAccent-400">24/7</div>
                <div className="text-[11px] text-slate-400">رد آلي وحجز فوري بدون انقطاع</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-teal-300">0 دقيقة</div>
                <div className="text-[11px] text-slate-400">إعداد وتفعيل بدون تكلفة تسويق</div>
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
            <div className="w-full max-w-sm bg-navy-900 rounded-[40px] p-3 border-4 border-navy-700 shadow-2xl shadow-teal-500/10 relative">
              
              {/* iPhone Dynamic Island / Notch */}
              <div className="w-32 h-5 bg-navy-950 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-navy-800 mr-2" />
              </div>

              {/* Chat Container */}
              <div className="bg-[#efeae2] rounded-[30px] overflow-hidden text-slate-900 h-[480px] flex flex-col justify-between shadow-inner">
                
                {/* Header */}
                <div className="bg-teal-800 text-white p-3 flex items-center justify-between border-b border-teal-900">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center font-bold text-xs">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs">عيادة د. سارة (AI)</div>
                      <div className="text-[9px] text-teal-200">متصل الآن 🟢</div>
                    </div>
                  </div>
                  <span className="text-[9px] bg-teal-900 px-2 py-0.5 rounded font-bold">Meta WhatsApp</span>
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
                      className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 text-[10px] font-bold rounded-full whitespace-nowrap border border-teal-200"
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
                      className="flex-1 p-2 bg-slate-100 rounded-xl text-xs focus:ring-1 focus:ring-teal-500 outline-none"
                    />
                    <button type="submit" className="p-2 bg-teal-600 text-white rounded-xl">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-navy-900/60 border-y border-navy-800 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
            مميزات المنصة الفائقة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            كل ما تحتاجه العيادة للعمل التلقائي الفعال
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
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
                className="bg-navy-900 border border-navy-800 hover:border-teal-500/40 rounded-3xl p-6 shadow-xl space-y-3 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500/20 to-teal-500/10 text-teal-400 flex items-center justify-center border border-teal-500/30">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-base text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            );
          })}

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
            خطط الاشتراكات المرنة
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            اختر الباقة المناسبة لعيادتك
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            استثمار بسيط يوفر عليك راتب موظف استقبال كامل ويمنع ضياع المواعيد
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Plan 1 */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-white">الباقة الأساسية</h3>
              <p className="text-xs text-slate-400">مناسبة للعيادات الفردية الصغيرة</p>
              <div className="text-3xl font-black text-teal-400">
                500 <span className="text-xs text-slate-400 font-normal">جنيه / شهرياً</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-navy-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> رد آلي وحجز الواتساب 24/7</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> طابور انتظار حتى 100 مريض</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> تذكيرات المواعيد المجدولة</li>
              </ul>
            </div>

            <Link href="/setup-wizard" className="w-full py-3 bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs rounded-xl text-center transition">
              اشترك في الباقة الأساسية
            </Link>
          </div>

          {/* Plan 2 Popular */}
          <div className="bg-gradient-to-b from-navy-900 via-navy-900 to-teal-950 border-2 border-teal-500 rounded-3xl p-6 space-y-6 flex flex-col justify-between shadow-2xl relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-teal-500 text-navy-950 font-black text-[10px] px-3 py-1 rounded-full shadow">
              🌟 الأكثر إقبالاً للعيادات
            </span>

            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-white">الباقة المتقدمة</h3>
              <p className="text-xs text-teal-300">لعيادات التجميل والمراكز النشطة</p>
              <div className="text-3xl font-black text-teal-300">
                1,200 <span className="text-xs text-slate-400 font-normal">جنيه / شهرياً</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-navy-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> كل مميزات الباقة الأساسية</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> طابور انتظار وشاشة تلفزيون عامة</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> مزامنة تقويم Google Calendar</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> فلتر الحماية الطبية الصارم</li>
              </ul>
            </div>

            <Link href="/setup-wizard" className="w-full py-3.5 bg-teal-400 hover:bg-teal-300 text-navy-950 font-black text-xs rounded-xl text-center shadow-lg transition">
              ابدأ الباقة المتقدمة مجاناً
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="bg-navy-900 border border-navy-800 rounded-3xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-white">باقة المراكز والجمعات</h3>
              <p className="text-xs text-slate-400">للمستشفيات والمراكز الطبية الكبيرة</p>
              <div className="text-3xl font-black text-teal-400">
                2,500 <span className="text-xs text-slate-400 font-normal">جنيه / شهرياً</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-navy-800">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> أطباء وعيادات غير محدودة</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> دعم متقدم ومسؤول حساب خاص</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400" /> ربط مخصص مع أنظمة الـ EHR</li>
              </ul>
            </div>

            <Link href="/setup-wizard" className="w-full py-3 bg-navy-800 hover:bg-navy-700 text-white font-bold text-xs rounded-xl text-center transition">
              تواصل مع المبيعات
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-900 bg-navy-950 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-navy-950 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-bold text-white">مستقبل العيادة الذكي • Clinic AI Receptionist</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/clinics" className="hover:text-white">دليل العيادات</Link>
            <Link href="/status" className="hover:text-white">حالة النظام</Link>
            <Link href="/privacy" className="hover:text-white">الخصوصية والأمان</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
