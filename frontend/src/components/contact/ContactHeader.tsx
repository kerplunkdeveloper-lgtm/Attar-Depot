'use client';

import React from 'react';
import { ShieldCheck, Clock, Crown } from 'lucide-react';
import { SITE_CONTACT } from '@/config/siteContact';

export default function ContactHeader() {
  return (
    <section className="relative text-center space-y-4 pt-2">
      {/* Verified Royal Perfumery Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-xs font-bold text-[#012520]">
        <Crown className="w-3.5 h-3.5 text-[#C9A227]" />
        <span className="uppercase tracking-wider">Official Royal Perfumery Concierge</span>
      </div>

      {/* Main Page Title */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-neutral-900 tracking-tight uppercase">
          Connect With Our Master Perfumers
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl mx-auto font-sans leading-relaxed">
          Whether you seek bespoke olfactory layering guidance, corporate gifting sets, or wish to visit our Puducherry flagship boutique, our specialist concierge team is at your royal service.
        </p>
      </div>

      {/* Live Operating Status Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 shadow-2xs text-xs font-bold text-neutral-700">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-emerald-800">{SITE_CONTACT.operatingHours.statusPill}</span>
        <span className="text-neutral-300">•</span>
        <span className="text-neutral-500 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#C9A227]" />
          <span>{SITE_CONTACT.operatingHours.display}</span>
        </span>
      </div>
    </section>
  );
}
