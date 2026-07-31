'use client';

import React, { useState } from 'react';
import './globals.css';
import { AuthProvider } from '@/lib/context/auth-context';
import { ClinicProvider } from '@/lib/context/clinic-context';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Pages that don't need sidebar (Public TV display, status, login)
  const isBareLayout = ['/login', '/queue/display', '/status', '/privacy'].includes(pathname) || pathname.startsWith('/c/');

  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>مستقبل العيادة الذكي | Clinic AI Receptionist</title>
        <meta name="description" content="نظام مستقبل العيادة الذكي المعتمد على الذكاء الاصطناعي وواتساب لمراكز التجميل والعيادات الطبية" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#0d9488" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <AuthProvider>
          <ClinicProvider>
            {isBareLayout ? (
              <main>{children}</main>
            ) : (
              <div className="min-h-screen flex flex-col">
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="flex-1 flex">
                  <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                  <main className="flex-1 lg:mr-64 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto transition-all">
                    {children}
                  </main>
                </div>
              </div>
            )}
            <PwaInstallPrompt />
          </ClinicProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
