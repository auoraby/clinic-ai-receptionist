'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'light' | 'dark';
  href?: string;
}

export default function Logo({
  size = 'md',
  showTagline = false,
  variant = 'dark',
  href = '/',
}: LogoProps) {
  // Scaling classes
  const sizeMap = {
    sm: { text: 'text-xl', icon: 'w-6 h-6', tagline: 'text-[9px]' },
    md: { text: 'text-2xl', icon: 'w-8 h-8', tagline: 'text-[11px]' },
    lg: { text: 'text-3xl', icon: 'w-10 h-10', tagline: 'text-xs' },
    xl: { text: 'text-4xl sm:text-5xl', icon: 'w-14 h-14', tagline: 'text-sm sm:text-base' },
  };

  const currentSize = sizeMap[size];
  const isLight = variant === 'light';

  const logoContent = (
    <div className="flex flex-col items-start select-none">
      {/* Brand Text: AiYADA */}
      <div className={`font-black tracking-tight flex items-baseline leading-none ${currentSize.text}`}>
        <span className="text-[#00A8B5] flex items-center">
          A
          <span className="relative inline-block">
            i
            {/* Custom person dot on top of 'i' */}
            <span className="absolute -top-[0.22em] left-1/2 -translate-x-1/2 w-[0.28em] h-[0.28em] rounded-full bg-[#00A8B5]" />
          </span>
        </span>
        <span className={isLight ? 'text-slate-300' : 'text-[#9CA3AF]'}>
          YADA
        </span>
      </div>

      {/* Slogan / Tagline */}
      {showTagline && (
        <span className={`font-bold tracking-normal mt-1 block ${currentSize.tagline} ${
          isLight ? 'text-slate-300' : 'text-slate-800'
        }`}>
          استقبال ذكي . مواعيد اسهل
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block group focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
