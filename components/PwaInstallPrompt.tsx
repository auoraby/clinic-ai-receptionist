'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW reg error:', err));
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setShowPrompt(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-navy-900 text-white p-4 rounded-2xl border border-teal-500/40 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500 text-navy-950 flex items-center justify-center font-bold shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <div className="font-extrabold text-xs">تثبيت تطبيق العيادة الذكية</div>
          <div className="text-[10px] text-teal-300">أضف التطبيق لشاشة الهاتف لسرعة الاستخدام 📱</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-teal-400 hover:bg-teal-300 text-navy-950 text-xs font-black rounded-xl flex items-center gap-1 shadow"
        >
          <Download className="w-3.5 h-3.5" /> تثبيت
        </button>
        <button
          onClick={() => setShowPrompt(false)}
          className="p-1 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
