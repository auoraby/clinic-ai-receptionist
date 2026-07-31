'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Calendar, 
  Users, 
  UserSquare2, 
  MessageSquareText, 
  FileText, 
  BellRing, 
  Settings, 
  Share2, 
  ShieldCheck, 
  Activity, 
  Monitor, 
  Lock,
  Building,
  HelpCircle,
  Bot,
  ExternalLink,
  Globe,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const navItems = [
    { label: 'الرئيسية (Dashboard)', href: '/dashboard', icon: LayoutDashboard },
    { label: 'حجز اليوم', href: '/appointments', icon: CalendarDays },
    { label: 'جدول المواعيد', href: '/calendar', icon: Calendar },
    { label: 'طابور الانتظار', href: '/queue', icon: Users },
    { label: 'شاشة الانتظار العامة (TV)', href: '/queue/display', icon: Monitor, isPublic: true },
    { label: 'المحادثات والتدخل البشري', href: '/conversations', icon: MessageSquareText },
    { label: 'أداة إضافة عيادة جديدة', href: '/setup-wizard', icon: Sparkles, isNew: true },
    { label: 'سجل المرضى الإداري', href: '/patients', icon: UserSquare2 },
    { label: 'قوالب الواتساب', href: '/templates', icon: FileText },
    { label: 'التذكيرات الآلية', href: '/reminders', icon: BellRing },
    { label: 'محاكي تجربة الواتساب', href: '/test-bot', icon: Bot, isNew: true },
    { label: 'دليل العيادات العام (Public)', href: '/clinics', icon: Globe, isPublic: true },
    { label: 'إعدادات العيادة والمعلومات', href: '/settings/clinic', icon: Settings },
    { label: 'ربط Meta & Google', href: '/settings/integrations', icon: Share2 },
    ...(isSuperAdmin ? [{ label: 'إدارة العيادات (Super Admin)', href: '/admin/clinics', icon: Building }] : []),
    { label: 'سجل العمليات والأمان', href: '/audit-logs', icon: ShieldCheck },
    { label: 'حالة النظام التشغيلية', href: '/status', icon: Activity },
    { label: 'الخصوصية والموافقة', href: '/privacy', icon: Lock },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-16 right-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-l border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
        } overflow-y-auto flex flex-col justify-between`}
      >
        <div className="p-4 space-y-1">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            قائمة النظام الرئيسية
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 space-x-reverse px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 font-bold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-teal-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
                {item.isPublic && (
                  <span className="mr-auto text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                    عامة
                  </span>
                )}
                {item.isNew && (
                  <span className="mr-auto text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">
                    جديد
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer Medical Disclaimer Banner */}
        <div className="p-4 m-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
          <div className="font-bold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700 inline" />
            تنبيه السلامة الطبية
          </div>
          <p className="leading-snug text-[10px] text-amber-800">
            النظام مخصص للتواصل الإداري وحجز المواعيد فقط. يُمنع التشخيص أو الاستشارة الطبية آلياً.
          </p>
        </div>
      </aside>
    </>
  );
}
