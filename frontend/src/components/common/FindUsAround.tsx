'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SITE_CONTACT } from '@/config/siteContact';

interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  color: string;
  glowColor: string;
  borderColor: string;
  bgHoverTint: string;
  renderIcon: () => React.ReactNode;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@theattardepot',
    url: SITE_CONTACT.socials.instagram.url,
    color: '#E4405F',
    glowColor: 'rgba(228, 64, 95, 0.28)',
    borderColor: 'rgba(228, 64, 95, 0.45)',
    bgHoverTint: 'rgba(228, 64, 95, 0.04)',
    renderIcon: () => (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] sm:rounded-[26px] bg-gradient-to-tr from-[#FD1D1D] via-[#E4405F] to-[#833AB4] flex items-center justify-center shadow-[0_6px_20px_rgba(228,64,95,0.35)] transition-transform duration-300 group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          className="w-9 h-9 sm:w-11 sm:h-11 text-white fill-none stroke-current stroke-[2]"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
        </svg>
      </div>
    ),
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: '+91 98765 43210',
    url: SITE_CONTACT.whatsapp.url,
    color: '#25D366',
    glowColor: 'rgba(37, 211, 102, 0.30)',
    borderColor: 'rgba(37, 211, 102, 0.45)',
    bgHoverTint: 'rgba(37, 211, 102, 0.04)',
    renderIcon: () => (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition-transform duration-300 group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          className="w-10 h-10 sm:w-12 sm:h-12 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@theattardepot',
    url: SITE_CONTACT.socials.youtube.url,
    color: '#FF0000',
    glowColor: 'rgba(255, 0, 0, 0.28)',
    borderColor: 'rgba(255, 0, 0, 0.45)',
    bgHoverTint: 'rgba(255, 0, 0, 0.04)',
    renderIcon: () => (
      <div className="w-16 h-14 sm:w-22 sm:h-16 rounded-[18px] sm:rounded-[22px] bg-[#FF0000] flex items-center justify-center shadow-[0_6px_20px_rgba(255,0,0,0.35)] transition-transform duration-300 group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'The Attar Depot',
    url: SITE_CONTACT.socials.facebook.url,
    color: '#1877F2',
    glowColor: 'rgba(24, 119, 242, 0.28)',
    borderColor: 'rgba(24, 119, 242, 0.45)',
    bgHoverTint: 'rgba(24, 119, 242, 0.04)',
    renderIcon: () => (
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1877F2] flex items-center justify-center shadow-[0_6px_20px_rgba(24,119,242,0.35)] transition-transform duration-300 group-hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          className="w-10 h-10 sm:w-12 sm:h-12 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </div>
    ),
  },
];

interface FindUsAroundProps {
  className?: string;
  showTitle?: boolean;
}

export default function FindUsAround({ className = '', showTitle = true }: FindUsAroundProps) {
  return (
    <section className={`w-full ${className}`} aria-label="Find Us Around - Social Media Channels">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* ========================================================================= */}
        {/* HEADER: — FIND US AROUND                                                  */}
        {/* ========================================================================= */}
        {showTitle && (
          <div className="flex items-center gap-3 select-none">
            <span className="w-6 sm:w-8 h-[2px] bg-[#046A5A]/60 rounded-full" />
            <h2 className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.22em] text-[#046A5A] font-sans">
              FIND US AROUND
            </h2>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DESKTOP 4-COLUMN INTERACTIVE LUXURY GRID                                  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {SOCIAL_CHANNELS.map((channel, idx) => (
            <motion.a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Connect with Attar Depot on ${channel.name} (${channel.handle})`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative aspect-square w-full rounded-[24px] sm:rounded-[32px] bg-white border border-stone-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center p-5 sm:p-7 overflow-hidden transition-all duration-300 select-none cursor-pointer"
              style={{
                // Custom CSS properties for responsive dynamic hover tints
                willChange: 'transform, box-shadow',
              }}
            >
              {/* Subtle Ambient Hover Color Tint (Expands smoothly on card hover) */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[24px] sm:rounded-[32px]"
                style={{
                  background: `radial-gradient(circle at center, ${channel.bgHoverTint} 0%, transparent 75%)`,
                }}
              />

              {/* Dynamic Glow Shadow Border Effect */}
              <div
                className="absolute inset-0 rounded-[24px] sm:rounded-[32px] border-2 border-transparent group-hover:border-current opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                style={{
                  borderColor: channel.borderColor,
                  boxShadow: `0 16px 36px ${channel.glowColor}`,
                }}
              />

              {/* Light Sweeping Sheen Highlight on Hover */}
              <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

              {/* Center Channel Brand Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-3 sm:space-y-4">
                {channel.renderIcon()}

                {/* Micro Subtitle / Handle that gracefully fades in on hover */}
                <div className="flex flex-col items-center space-y-0.5 text-center">
                  <span className="text-xs sm:text-sm font-bold text-neutral-800 tracking-tight group-hover:text-neutral-950 transition-colors">
                    {channel.name}
                  </span>
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold opacity-65 group-hover:opacity-100 transition-all flex items-center gap-0.5"
                    style={{ color: channel.color }}
                  >
                    <span>{channel.handle}</span>
                    <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 -translate-y-0.5 transition-all" />
                  </span>
                </div>
              </div>

              {/* Subtle top-right link indicator badge */}
              <div
                className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-stone-50 border border-stone-200/60 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200 shadow-2xs"
                style={{ color: channel.color }}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
