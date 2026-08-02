'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import {
  LayoutDashboard, CalendarDays, Calendar, Users, UserSquare2,
  MessageSquareText, FileText, BellRing, Settings, Share2,
  ShieldCheck, Activity, Monitor, Lock, Building, Bot,
  Globe, Sparkles, ChevronRight, HelpCircle
} from 'lucide-react';

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'amber';
  superAdminOnly?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: 'العمليات اليومية',
    items: [
      { label: 'لوحة التحكم',        href: '/dashboard',    icon: LayoutDashboard },
      { label: 'المواعيد والحجوزات', href: '/appointments',  icon: CalendarDays },
      { label: 'التقويم الأسبوعي',   href: '/calendar',     icon: Calendar },
      { label: 'طابور الانتظار',      href: '/queue',        icon: Users },
      { label: 'شاشة الانتظار (TV)', href: '/queue/display', icon: Monitor,
        badge: 'عامة', badgeColor: 'amber' },
    ],
  },
  {
    title: 'الواتساب والمرضى',
    items: [
      { label: 'المحادثات الحية',    href: '/conversations',  icon: MessageSquareText },
      { label: 'سجل المرضى',         href: '/patients',       icon: UserSquare2 },
      { label: 'قوالب الرسائل',      href: '/templates',      icon: FileText },
      { label: 'التذكيرات الآلية',   href: '/reminders',      icon: BellRing },
      { label: 'محاكي الواتساب',     href: '/test-bot',       icon: Bot,
        badge: 'جديد', badgeColor: 'green' },
    ],
  },
  {
    title: 'الإعداد والإدارة',
    items: [
      { label: 'معالج إضافة عيادة',  href: '/setup-wizard',          icon: Sparkles,
        badge: 'جديد', badgeColor: 'blue' },
      { label: 'دليل العيادات',      href: '/clinics',               icon: Globe,
        badge: 'عامة', badgeColor: 'amber' },
      { label: 'إعدادات العيادة',    href: '/settings/clinic',       icon: Settings },
      { label: 'ربط Meta & Google',  href: '/settings/integrations', icon: Share2 },
      { label: 'لوحة مدير النظام',   href: '/admin/clinics',         icon: Building,
        superAdminOnly: true },
    ],
  },
  {
    title: 'الأمان والنظام',
    items: [
      { label: 'سجل العمليات',      href: '/audit-logs', icon: ShieldCheck },
      { label: 'حالة النظام',       href: '/status',     icon: Activity },
      { label: 'الخصوصية والبيانات', href: '/privacy',    icon: Lock },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const badgeClasses = {
    blue:  'bg-blue-50 text-blue-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden" />
      )}

      <aside className={`
        fixed top-14 right-0 z-30 w-60
        h-[calc(100vh-3.5rem)] bg-white border-l border-slate-200
        overflow-y-auto flex flex-col transition-transform duration-250 ease-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-xl' : 'translate-x-full'}
      `}>

        {/* Nav Groups */}
        <nav className="flex-1 p-3 space-y-5">
          {navGroups.map(group => {
            const visibleItems = group.items.filter(
              item => !item.superAdminOnly || isSuperAdmin
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title}>
                <p className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map(item => {
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`
                          flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold
                          transition-all duration-150 group
                          ${active
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                        `}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                        <span className="truncate flex-1">{item.label}</span>
                        {item.badge && !active && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                            badgeClasses[item.badgeColor ?? 'blue']
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer: Medical Disclaimer */}
        <div className="p-3 border-t border-slate-100">
          <div className="flex gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-amber-900 mb-0.5">تنبيه طبي مهم</p>
              <p className="text-[10px] text-amber-700 leading-relaxed">
                النظام للحجز الإداري فقط. لا يُقدّم أي استشارات أو تشخيصات طبية.
              </p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
}
