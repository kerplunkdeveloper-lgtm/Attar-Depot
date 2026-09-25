'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface WelcomePromoBannerProps {
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
}

const BRAND_FEATURES = [
  {
    title: 'Farm to Fragrance Brand',
    subtitle: 'Putting you in the center',
  },
  {
    title: 'Long Lasting Fragrances',
    subtitle: 'Honest from the inside out',
  },
  {
    title: 'Modernising Tradition',
    subtitle: 'Getting the absolute best for you',
  },
];

export default function WelcomePromoBanner({
  showCloseButton = false,
  onClose,
  className = '',
}: WelcomePromoBannerProps) {
  return (
    <div
      className={`relative w-full h-full min-h-[480px] bg-gradient-to-r from-[#012520]/95 via-[#023830]/95 to-[#012520]/95 backdrop-blur-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden select-none ${className}`}
    >

      {/* Optional Close Button (for Modal) */}
      {showCloseButton && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 bg-black/75 hover:bg-black text-white flex items-center justify-center transition-colors rounded-sm cursor-pointer shadow-md"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center my-auto py-2">
        {/* Website Logo */}
        <div className="mb-6 sm:mb-8 flex items-center justify-center">
          <Image
            src="/images/logonew.png"
            alt="The Attar Depot"
            width={240}
            height={70}
            priority
            className="h-12 sm:h-20 w-auto object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Welcome Headline */}
        <h2 className="text-2xl sm:text-2xl font-serif font-bold text-white tracking-tight leading-tight mb-8 sm:mb-9 drop-shadow-sm">
          Welcome to The Attar Depot!
        </h2>

        {/* 3 Golden Value Proposition Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 w-full">
          {BRAND_FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-[#FBF4E3] border border-amber-900/15 backdrop-blur-md rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-start text-center shadow-[0_4px_14px_rgba(0,0,0,0.08)] transition-all duration-300 group hover:-translate-y-0.5"
            >
              {/* Shiny 3D Golden Star with Highlight */}
              <div className="w-10 h-10 mb-3 rounded-full flex items-center justify-center">
                <svg
                  className="w-9 h-9 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id={`goldStar-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF5B8" />
                      <stop offset="30%" stopColor="#F7C43D" />
                      <stop offset="70%" stopColor="#D9971D" />
                      <stop offset="100%" stopColor="#9C6105" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 2.5l2.65 6.1 6.6.6-4.9 4.4 1.45 6.5L12 16.85l-5.8 3.25 1.45-6.5-4.9-4.4 6.6-.6L12 2.5z"
                    fill={`url(#goldStar-${idx})`}
                    stroke="#FFEC8A"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                  {/* Subtle top reflection / gleam */}
                  <circle cx="12" cy="7.2" r="1.3" fill="#FFFFFF" opacity="0.85" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xs sm:text-[13px] font-bold text-[#1C1408] leading-snug tracking-tight mb-2 min-h-[32px] sm:min-h-[36px] flex items-center justify-center">
                {feature.title}
              </h3>

              {/* Subtitle */}
              <p className="text-[10px] sm:text-[11px] text-[#33220A] leading-snug font-normal opacity-95">
                {feature.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
