'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Droplets,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { luxuryEase } from '@/lib/animations';
import { SITE_CONTACT } from '@/config/siteContact';
import { toast } from '@/lib/toast';

export default function HomeStoreMapSection() {
  const [copied, setCopied] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(SITE_CONTACT.address.puducherry.fullAddress);
    setCopied(true);
    toast.success('Store address copied to clipboard!', { title: 'Address Copied' });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <motion.section
      className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 my-4 sm:my-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.75, ease: luxuryEase }}
    >
      {/* Outer Card with Luxury Emerald & Gold Styling */}
      <div className="relative overflow-hidden rounded-3xl lg:rounded-[36px] bg-gradient-to-br from-[#02332A] via-[#012520] to-[#011B17] text-white border border-[#C9A227]/30 shadow-[0_20px_60px_rgba(2,51,42,0.35)]">
        {/* Decorative Golden Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#046A5A]/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 p-6 sm:p-10 lg:p-12 items-center">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Store Details, Highlights & Quick Action Buttons              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Header / Eyebrow */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 text-[#F5B418] text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visit Our Flagship Store</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FAF8F2] tracking-tight leading-tight">
                Experience Pure Attars in Person
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-sans">
                Immerse your senses in our live olfactory tasting bar. Sample 40+ pure alcohol-free Kannauj attars, blend custom bespoke accords, and choose hand-carved crystal flacons.
              </p>
            </div>

            {/* Address & Hours Highlight Card */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 backdrop-blur-md space-y-3.5">
              {/* Address Row */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center shrink-0 mt-0.5 text-[#F5B418]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#F5B418]">
                    Flagship Boutique
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white leading-snug mt-0.5">
                    {SITE_CONTACT.address.puducherry.name}
                  </p>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    {SITE_CONTACT.address.puducherry.street}, {SITE_CONTACT.address.puducherry.city} - {SITE_CONTACT.address.puducherry.pincode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className={`p-2 rounded-lg border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    copied
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-stone-300 hover:text-white'
                  }`}
                  title="Copy store address"
                  aria-label="Copy store address"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Working Hours & Live Status */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{SITE_CONTACT.operatingHours.display}</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Open Today</span>
                </span>
              </div>
            </div>

            {/* Experience Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-stone-300">
                <Droplets className="w-3 h-3 text-[#F5B418]" />
                <span>Scent Tasting Bar</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-stone-300">
                <Compass className="w-3 h-3 text-[#F5B418]" />
                <span>Bespoke Blends</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-stone-300">
                <ShieldCheck className="w-3 h-3 text-[#F5B418]" />
                <span>100% Alcohol-Free</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {/* Primary: Get Driving Directions */}
              <a
                href={SITE_CONTACT.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#C9A227] hover:bg-[#D4AF37] text-neutral-950 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-xl group"
              >
                <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>

              {/* Secondary Buttons Row */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* WhatsApp Concierge */}
                <a
                  href={SITE_CONTACT.whatsapp.getCustomUrl(
                    'Salam! I am planning to visit the Attar Depot flagship store in Puducherry. Can you share timings and store location details?'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-[#25D366]/20 border border-white/15 hover:border-[#25D366]/40 text-stone-200 hover:text-white text-xs font-semibold transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Store WhatsApp</span>
                </a>

                {/* Call Desk */}
                <a
                  href={SITE_CONTACT.phone.telUrl}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 text-stone-200 hover:text-white text-xs font-semibold transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F5B418]" />
                  <span>Call Store Desk</span>
                </a>
              </div>
            </div>

            {/* Direct Link to full Connect / Social Hub */}
            <div className="pt-2 text-center lg:text-left">
              <Link
                href="/social"
                className="inline-flex items-center gap-1.5 text-xs text-[#F5B418] hover:text-[#FAF8F2] font-semibold transition-colors group"
              >
                <span>View all locations, social handles & VIP contacts</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Interactive Responsive Google Map Embed                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full rounded-2xl lg:rounded-3xl overflow-hidden border border-[#C9A227]/30 shadow-2xl bg-neutral-900 group aspect-[4/3] sm:aspect-[16/10] lg:h-[480px]">
              {/* Map Loading Skeleton Overlay */}
              {!isMapLoaded && (
                <div className="absolute inset-0 bg-[#011B17] flex flex-col items-center justify-center gap-3 z-10 animate-pulse">
                  <MapPin className="w-8 h-8 text-[#C9A227] animate-bounce" />
                  <p className="text-xs text-stone-400 font-sans tracking-wide">
                    Loading interactive flagship map...
                  </p>
                </div>
              )}

              {/* Top Floating Info Pill */}
              <div className="absolute top-3 left-3 right-3 sm:right-auto z-20 flex items-center justify-between sm:justify-start gap-2 bg-[#012520]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C9A227]/40 shadow-lg text-[11px]">
                <div className="flex items-center gap-2 text-stone-200 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span className="font-bold text-white">Attar Depot</span>
                  <span className="text-[#F5B418]">• Bharathi St, Puducherry</span>
                </div>
                <a
                  href={SITE_CONTACT.maps.queryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:hidden text-[10px] text-[#F5B418] font-bold underline"
                >
                  Full Map
                </a>
              </div>

              {/* Bottom Quick Action Floating on Map */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 bg-[#012520]/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 shadow-xl text-xs">
                <span className="text-stone-300 text-[11px] truncate hidden sm:inline">
                  Interactive Map • Pinch / Scroll to explore surroundings
                </span>
                <span className="text-stone-300 text-[11px] truncate sm:hidden">
                  Puducherry Flagship Store
                </span>
                <a
                  href={SITE_CONTACT.maps.queryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F5B418] hover:text-white shrink-0 transition-colors"
                >
                  <span>Open Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Google Map Iframe */}
              <iframe
                title="Attar Depot Flagship Store Google Map"
                src={SITE_CONTACT.maps.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.02) saturate(1.08)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => setIsMapLoaded(true)}
                className="w-full h-full relative z-0 transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
