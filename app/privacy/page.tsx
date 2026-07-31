'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 sm:p-12 dir-rtl font-arabic flex flex-col justify-between">
      
      <div className="max-w-3xl mx-auto w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">سياسة الخصوصية وحماية بيانات المرضى</h1>
              <p className="text-xs text-slate-500">Privacy Policy & Meta Business Directive Compliance</p>
            </div>
          </div>

          <Link href="/dashboard" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> العودة
          </Link>
        </div>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900">1. طبيعة البيانات المسجلة بالنظام</h3>
            <p>
              يجمع النظام البيانات الإدارية الأساسية فقط اللازمة لتنظيم وحجز المواعيد (الاسم الكامل، رقم هاتف الواتساب، نوع الكشف المطلوب، والموعد المفضل).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900">2. الحماية والسلامة الطبية الحازمة (Medical Safety Disclaimer)</h3>
            <p className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-semibold">
              المساعد الآلي مصمم حصرياً للتواصل الإداري والتنظيمي للمواعيد. يُحظر على المساعد تقديم تشخيصات طبية، التوصية بأدوية، أو قطع وعود بنتائج العلاج. يتم تحويل الرسائل الحساسة فوراً للطاقم البشري.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900">3. حماية الهوية على شاشات الانتظار العامة</h3>
            <p>
              يتم تشفير أسماء وأرقام المنتظرين على شاشات التلفزيون العامة فوراً لحماية الخصوصية طبقاً للمعايير العالمية.
            </p>
          </section>
        </div>

      </div>

      <div className="text-center text-xs text-slate-400 pt-8">
        حقوق الطبع والنشر © 2026 مستقبل العيادة الذكي • جميع الحقوق محفوظة
      </div>

    </div>
  );
}
