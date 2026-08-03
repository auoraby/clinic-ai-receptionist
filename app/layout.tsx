'use client';

import React, { useState, useEffect } from 'react';
import './globals.css';
import { AuthProvider, useAuth } from '@/lib/context/auth-context';
import { ClinicProvider } from '@/lib/context/clinic-context';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import { usePathname, useRouter } from 'next/navigation';

// Public pages that don't need authentication or sidebar
const PUBLIC_PATHS = ['/', '/login', '/clinics', '/status', '/privacy', '/queue/display'];
const isPublicPath = (p: string) =>
  PUBLIC_PATHS.includes(p) || p.startsWith('/c/');

// Super Admin only paths
const ADMIN_PATHS = ['/admin'];
const isAdminPath = (p: string) => ADMIN_PATHS.some(a => p.startsWith(a));

function LayoutInner({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const isPublic = isPublicPath(pathname);
  const isBare   = ['/login', '/queue/display', '/privacy'].includes(pathname) || pathname.startsWith('/c/');

  // ── Route Guard ────────────────────────────────────────
  useEffect(() => {
    if (isPublic) return;

    // Not logged in → go to login
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Non-admin trying to access /admin → redirect to dashboard
    if (isAdminPath(pathname) && user?.role !== 'SUPER_ADMIN') {
      router.replace('/dashboard');
      return;
    }

    // Super Admin going to /dashboard → redirect to /admin
    if (pathname === '/dashboard' && user?.role === 'SUPER_ADMIN') {
      router.replace('/admin');
      return;
    }
  }, [isAuthenticated, pathname, user, router, isPublic]);

  // Bare layout: no navbar/sidebar (login page, patient booking, TV screen)
  if (isBare) {
    return <main>{children}</main>;
  }

  // Public layout: just landing page / clinics directory (with their own navbar)
  if (isPublic) {
    return <>{children}</>;
  }

  // Protected layout: full sidebar + navbar
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(o => !o)} />
      <div className="flex flex-1 min-h-0">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 lg:mr-60 p-5 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>مستقبل العيادة الذكي | Clinic AI Receptionist</title>
        <meta name="description" content="نظام مستقبل العيادة الذكي المعتمد على الذكاء الاصطناعي وواتساب لمراكز التجميل والعيادات الطبية" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#2563EB" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ClinicProvider>
            <LayoutInner>{children}</LayoutInner>
            <PwaInstallPrompt />
          </ClinicProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
