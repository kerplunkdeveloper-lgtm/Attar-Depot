'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from '@/lib/toast';

const FAQS = [
  {
    question: 'How can I request a private olfactory blending consultation?',
    answer:
      'You can schedule a virtual or in-person consultation with our Master Perfumers directly via our WhatsApp Concierge (+91 98765 43210) or by calling our hotline. We will guide you through fragrance note layering and custom accord selection.',
  },
  {
    question: 'Are all Attar Depot perfumes 100% alcohol-free and pure?',
    answer:
      'Yes, without exception. Every single drop we offer is 100% pure, concentrated perfume oil (Ittar) formulated without ethyl alcohol, phthalates, synthetic binders, or aerosol propellants. Our oils are safe for sensitive skin and adhere to traditional Kannauj Deg-Bhapka distillation standards.',
  },
  {
    question: 'Do you create bespoke personalized wedding favors and gifting sets?',
    answer:
      'Yes! We specialize in royal wedding trousseaus, corporate milestones, and bespoke gifting. We offer custom crystal flacons, brass-inlaid teakwood chests, and wax-sealed certificates of distillation tailored to your desired notes.',
  },
  {
    question: 'How fast are orders processed and delivered across India?',
    answer:
      'Domestic orders are processed within 24–48 hours from our Mumbai & Kannauj vaults. Express air shipping delivers within 2–4 business days to major metros (Delhi, Bangalore, Chennai, Hyderabad, Kolkata) and 4–6 business days to all other pin codes.',
  },
  {
    question: 'Can I visit your flagship atelier in person?',
    answer:
      'Our Kannauj heritage works, Mumbai boutique, and Puducherry store welcome fragrance connoisseurs by appointment. Please call or message our concierge desk in advance so we can prepare an exclusive scent discovery tray for your visit.',
  },
];

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, key: string, label: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 2200);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-neutral-900 font-sans selection:bg-[#046A5A] selection:text-white pb-24">
      {/* ===================================================================== */}
      {/* 1. SLEEK LUXURY HERO BANNER (REDUCED HEIGHT & PANORAMIC VIEW)         */}
      {/* ===================================================================== */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full h-[125px] sm:h-[165px] md:h-[205px] lg:h-[240px]">
          <Image
            src="/images/contactbanner.png"
            alt="Contact Attar Depot - Pure Essence of Royalty"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-[center_38%]"
          />
          {/* Subtle gradient overlays for seamless integration */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#FAF8F2]/60 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-12 bg-gradient-to-t from-[#FAF8F2] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#C9A227] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C9A227] font-bold">Contact Us</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 sm:mt-7 relative z-20 space-y-12 sm:space-y-16">
        {/* ===================================================================== */}
        {/* 2. FOUR VIP CONCIERGE CARDS (PREMIUM LUXURY UI / UX REDESIGN)         */}
        {/* ===================================================================== */}
        <div className="space-y-6">
          {/* Section Introduction */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#C9A227]/30 text-[11px] font-extrabold uppercase tracking-widest text-[#02332A] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>Royal Concierge Service</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              Direct Access to Our Fragrance House
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              Connect directly with our master perfumers for personal order blending, royal gifting sets, and Deg-Bhapka scent advisory.
            </p>
          </div>

          {/* Responsive Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {/* ------------------------------------------------------------- */}
            {/* Card 1: Direct Hotline / Concierge Desk                       */}
            {/* ------------------------------------------------------------- */}
            <div className="relative group rounded-3xl bg-white/85 backdrop-blur-md border border-[#02332A]/10 hover:border-[#C9A227]/60 shadow-[0_4px_24px_rgba(2,51,42,0.04)] hover:shadow-[0_20px_40px_rgba(2,51,42,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 overflow-hidden">
              {/* Top Accent Gold Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#C9A227]/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header: Jewel Icon + Status Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#02332A] via-[#034A3D] to-[#046A5A] text-[#F5B418] flex items-center justify-center shadow-md border border-[#C9A227]/30 group-hover:scale-105 transition-transform duration-300">
                    <Phone className="w-5 h-5 text-[#F5B418] stroke-[2.2]" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Mon–Sat • Active</span>
                  </span>
                </div>

                {/* Eyebrow & Titles */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#065A4B]">
                    DIRECT HOTLINE
                  </p>
                  <h3 className="font-serif text-[22px] sm:text-[23px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#02332A] transition-colors mt-0.5">
                    Concierge Desk
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-sans">
                  Speak directly with our fragrance specialists for orders, bespoke accord blending, and vintage oudh advice.
                </p>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Voice Advisory
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Custom Blends
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Kannauj Degs
                  </span>
                </div>
              </div>

              {/* Action Zone */}
              <div className="relative z-10 pt-4 mt-5 border-t border-neutral-200/60 space-y-3">
                {/* Value row with 1-click Copy */}
                <div className="flex items-center justify-between gap-2 bg-[#FAF8F2] px-3 py-2 rounded-xl border border-neutral-200/80">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-600 block">
                      Hotline Number
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#02332A] truncate block font-sans">
                      +91 98765 43210
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, '+919876543210', 'hotline', 'Phone number')}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                      copiedKey === 'hotline'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-2xs'
                    }`}
                    title="Copy phone number"
                  >
                    {copiedKey === 'hotline' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400 group-hover:text-[#C9A227]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary CTA */}
                <a
                  href="tel:+919876543210"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#02332A] hover:bg-[#034A3D] text-[#FAF8F2] hover:text-[#F5B418] text-xs sm:text-[13px] font-bold transition-all shadow-sm hover:shadow-md group/btn"
                >
                  <Phone className="w-3.5 h-3.5 text-[#F5B418]" />
                  <span>Call Concierge Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Card 2: Instant Messaging / WhatsApp Perfumer                 */}
            {/* ------------------------------------------------------------- */}
            <div className="relative group rounded-3xl bg-white/85 backdrop-blur-md border border-[#02332A]/10 hover:border-[#25D366]/60 shadow-[0_4px_24px_rgba(2,51,42,0.04)] hover:shadow-[0_20px_40px_rgba(37,211,102,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 overflow-hidden">
              {/* Top Accent WhatsApp Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#25D366] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#25D366]/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header: Jewel Icon + Status Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#128C7E] via-[#25D366] to-[#20ba5a] text-white flex items-center justify-center shadow-md border border-emerald-300/40 group-hover:scale-105 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
                    </svg>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/70 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                    <span>Avg. 10m Reply</span>
                  </span>
                </div>

                {/* Eyebrow & Titles */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#15803D]">
                    INSTANT MESSAGING
                  </p>
                  <h3 className="font-serif text-[22px] sm:text-[23px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#15803D] transition-colors mt-0.5">
                    WhatsApp Perfumer
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-sans">
                  Fast scent suggestions, real bottle photos, personalized notes, and quick reorders.
                </p>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50/80 text-emerald-800 border border-emerald-200/50">
                    Live Photo Clips
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50/80 text-emerald-800 border border-emerald-200/50">
                    Audio Consults
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50/80 text-emerald-800 border border-emerald-200/50">
                    Quick Reorders
                  </span>
                </div>
              </div>

              {/* Action Zone */}
              <div className="relative z-10 pt-4 mt-5 border-t border-neutral-200/60 space-y-3">
                {/* Value row with 1-click Copy */}
                <div className="flex items-center justify-between gap-2 bg-[#FAF8F2] px-3 py-2 rounded-xl border border-neutral-200/80">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-600 block">
                      WhatsApp Desk
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#15803D] truncate block font-sans">
                      +91 98765 43210
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, '+919876543210', 'whatsapp', 'WhatsApp number')}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                      copiedKey === 'whatsapp'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-2xs'
                    }`}
                    title="Copy WhatsApp number"
                  >
                    {copiedKey === 'whatsapp' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400 group-hover:text-[#25D366]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary CTA */}
                <a
                  href="https://wa.me/919876543210?text=Salam%20%26%20Greetings!%20I%20am%20inquiring%20about%20Attar%20Depot%20pure%20perfume%20oils%20and%20bespoke%20royal%20fragrances."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs sm:text-[13px] font-bold transition-all shadow-sm hover:shadow-md group/btn"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Card 3: Written Inquiries / VIP Correspondence               */}
            {/* ------------------------------------------------------------- */}
            <div className="relative group rounded-3xl bg-white/85 backdrop-blur-md border border-[#02332A]/10 hover:border-[#C9A227]/60 shadow-[0_4px_24px_rgba(2,51,42,0.04)] hover:shadow-[0_20px_40px_rgba(2,51,42,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 overflow-hidden">
              {/* Top Accent Gold Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#C9A227]/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header: Jewel Icon + Status Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#02332A] via-[#034A3D] to-[#046A5A] text-[#F5B418] flex items-center justify-center shadow-md border border-[#C9A227]/30 group-hover:scale-105 transition-transform duration-300">
                    <Mail className="w-5 h-5 text-[#F5B418] stroke-[2.2]" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200/70 shadow-2xs">
                    <Clock className="w-3 h-3 text-[#C9A227]" />
                    <span>2–4h Response</span>
                  </span>
                </div>

                {/* Eyebrow & Titles */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#065A4B]">
                    WRITTEN INQUIRIES
                  </p>
                  <h3 className="font-serif text-[22px] sm:text-[23px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#02332A] transition-colors mt-0.5">
                    VIP Correspondence
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-sans">
                  For corporate bulk gifts, exports, bridal orders, and formal vendor proposals.
                </p>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Bridal Trousseau
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Corporate Gifts
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Global Export
                  </span>
                </div>
              </div>

              {/* Action Zone */}
              <div className="relative z-10 pt-4 mt-5 border-t border-neutral-200/60 space-y-3">
                {/* Value row with 1-click Copy */}
                <div className="flex items-center justify-between gap-2 bg-[#FAF8F2] px-3 py-2 rounded-xl border border-neutral-200/80">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-600 block">
                      Email Address
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#02332A] truncate block font-sans" title="concierge@attardepot.com">
                      concierge@attardepot.com
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, 'concierge@attardepot.com', 'email', 'Email address')}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                      copiedKey === 'email'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-2xs'
                    }`}
                    title="Copy email address"
                  >
                    {copiedKey === 'email' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400 group-hover:text-[#C9A227]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary CTA */}
                <a
                  href="mailto:concierge@attardepot.com"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#02332A] hover:bg-[#034A3D] text-[#FAF8F2] hover:text-[#F5B418] text-xs sm:text-[13px] font-bold transition-all shadow-sm hover:shadow-md group/btn"
                >
                  <Mail className="w-3.5 h-3.5 text-[#F5B418]" />
                  <span>Send VIP Inquiries</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* Card 4: Attar Depot Shop / Puducherry Atelier                 */}
            {/* ------------------------------------------------------------- */}
            <div className="relative group rounded-3xl bg-white/85 backdrop-blur-md border border-[#02332A]/10 hover:border-[#C9A227]/60 shadow-[0_4px_24px_rgba(2,51,42,0.04)] hover:shadow-[0_20px_40px_rgba(2,51,42,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 overflow-hidden">
              {/* Top Accent Gold Bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#C9A227]/10 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                {/* Header: Jewel Icon + Status Pill */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#02332A] via-[#034A3D] to-[#046A5A] text-[#F5B418] flex items-center justify-center shadow-md border border-[#C9A227]/30 group-hover:scale-105 transition-transform duration-300">
                    <MapPin className="w-5 h-5 text-[#F5B418] stroke-[2.2]" />
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#02332A]/5 text-[#02332A] border border-[#02332A]/15 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-[#C9A227]" />
                    <span>Flagship Atelier</span>
                  </span>
                </div>

                {/* Eyebrow & Titles */}
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#065A4B]">
                    ATTAR DEPOT SHOP
                  </p>
                  <h3 className="font-serif text-[22px] sm:text-[23px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#02332A] transition-colors mt-0.5">
                    Puducherry Atelier
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-sans">
                  Bharathi street , MGROAD, Puducherry. Experience our live olfactory scent bar and flacons.
                </p>

                {/* Capability Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Scent Tasting Bar
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Pure Sandalwood
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/60">
                    Walk-ins Welcome
                  </span>
                </div>
              </div>

              {/* Action Zone */}
              <div className="relative z-10 pt-4 mt-5 border-t border-neutral-200/60 space-y-3">
                {/* Value row with 1-click Copy */}
                <div className="flex items-center justify-between gap-2 bg-[#FAF8F2] px-3 py-2 rounded-xl border border-neutral-200/80">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-600 block">
                      Shop Address
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#02332A] truncate block font-sans" title="Bharathi street, MGROAD, Puducherry">
                      Bharathi St, MG Road
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(e, 'Bharathi street, MGROAD, Puducherry', 'puducherry', 'Address')}
                    className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                      copiedKey === 'puducherry'
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-600 hover:text-neutral-900 shadow-2xs'
                    }`}
                    title="Copy store address"
                  >
                    {copiedKey === 'puducherry' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-neutral-400 group-hover:text-[#C9A227]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary CTA */}
                <a
                  href="https://www.google.com/maps/place/The+Attar+Depot+(Opening+Soon)/@11.9352508,79.8272356,17z/data=!4m15!1m8!3m7!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!2sThe+Attar+Depot+(Opening+Soon)!8m2!3d11.9352508!4d79.8272356!10e1!16s%2Fg%2F11nk011rzr!3m5!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!8m2!3d11.9352508!4d79.8272356!16s%2Fg%2F11nk011rzr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#02332A] hover:bg-[#034A3D] text-[#FAF8F2] hover:text-[#F5B418] text-xs sm:text-[13px] font-bold transition-all shadow-sm hover:shadow-md group/btn"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#F5B418]" />
                  <span>View Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. OFFICIAL SOCIAL MEDIA CHANNELS HUB (PREMIUM UI/UX)                 */}
        {/* ===================================================================== */}
        <div className="space-y-6 pt-2">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-emerald-100/80 pb-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Official Social Media</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Connect With Our Olfactory Community
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-2xl">
                Explore behind-the-scenes Deg-Bhapka distillation, daily scent layering reels, rare flacon unveils, and live community reviews.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-100 text-xs font-medium text-emerald-900 shadow-2xs self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Official Handles • 7 Days Support</span>
            </div>
          </div>

          {/* Social Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Social Card 1: Instagram */}
            <div className="rounded-[26px] p-6 sm:p-7 bg-white/50 backdrop-blur-md border border-neutral-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(228,64,95,0.12)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E4405F] to-[#833AB4] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Instagram className="w-6 h-6 text-white stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E4405F] border border-rose-200/60">
                    Daily Reels
                  </span>
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#E4405F]">
                  INSTAGRAM
                </p>
                <h3 className="font-serif text-[21px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#E4405F] transition-colors">
                  @theattardepot
                </h3>
                <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-sans">
                  Watch traditional extraction reels, flacon aesthetics, customer unboxings, and scent layering tips.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-neutral-100">
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#E4405F] hover:text-[#b01e40] transition-colors"
                >
                  <span>Follow on Instagram</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Social Card 2: WhatsApp VIP */}
            <div className="rounded-[26px] p-6 sm:p-7 bg-white/50 backdrop-blur-md border border-neutral-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(37,211,102,0.14)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#15803D] border border-emerald-200/60">
                    Active Desk
                  </span>
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#15803D]">
                  WHATSAPP CHANNEL
                </p>
                <h3 className="font-serif text-[21px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#25D366] transition-colors">
                  WhatsApp Concierge
                </h3>
                <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-sans">
                  Direct personal fragrance advice, live bottle preview clips, bespoke trousseau orders & instant queries.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-neutral-100">
                <a
                  href="https://wa.me/919876543210?text=Salam%20%26%20Greetings!%20I%20am%20inquiring%20about%20Attar%20Depot%20pure%20perfume%20oils."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#25D366] hover:text-[#189b48] transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Social Card 3: YouTube */}
            <div className="rounded-[26px] p-6 sm:p-7 bg-white/50 backdrop-blur-md border border-neutral-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(255,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-[#FF0000] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Youtube className="w-6 h-6 text-white stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#FF0000] border border-red-200/60">
                    4K Films
                  </span>
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF0000]">
                  YOUTUBE
                </p>
                <h3 className="font-serif text-[21px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#FF0000] transition-colors">
                  Attar Depot
                </h3>
                <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-sans">
                  Deep dive into Deg-Bhapka hydro-distillation, pure sandalwood maturation, and notes breakdown tutorials.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-neutral-100">
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#FF0000] hover:text-[#b80000] transition-colors"
                >
                  <span>Subscribe on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Social Card 4: Facebook */}
            <div className="rounded-[26px] p-6 sm:p-7 bg-white/50 backdrop-blur-md border border-neutral-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(24,119,242,0.12)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <Facebook className="w-6 h-6 text-white stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1877F2] border border-blue-200/60">
                    Official Page
                  </span>
                </div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#1877F2]">
                  FACEBOOK
                </p>
                <h3 className="font-serif text-[21px] font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-[#1877F2] transition-colors">
                  Attar Depot Official
                </h3>
                <p className="text-xs sm:text-[13px] text-neutral-500 leading-relaxed font-sans">
                  Join our community of over 30,000 attar aficionados, festive release updates, and verified reviews.
                </p>
              </div>
              <div className="pt-4 mt-6 border-t border-neutral-100">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-[#1877F2] hover:text-[#0f5ac2] transition-colors"
                >
                  <span>Connect on Facebook</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. ATELIER LOCATION & MAP SECTION                                     */}
        {/* ===================================================================== */}
        <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-50 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Puducherry</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                Attar Depot Shop
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                Bharathi street , MGROAD, Puducherry.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Mon–Sat: 10:00 AM – 9:00 PM IST</span>
              </div>
              <a
                href="https://www.google.com/maps/place/The+Attar+Depot+(Opening+Soon)/@11.9352508,79.8272356,17z/data=!4m15!1m8!3m7!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!2sThe+Attar+Depot+(Opening+Soon)!8m2!3d11.9352508!4d79.8272356!10e1!16s%2Fg%2F11nk011rzr!3m5!1s0x3a5361321e7067c7:0x21cfed5a9498e2a5!8m2!3d11.9352508!4d79.8272356!16s%2Fg%2F11nk011rzr?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors border border-emerald-200 shadow-2xs"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C9A227]" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-emerald-100 relative shadow-inner">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3903.5661658908084!2d79.8272356!3d11.935250799999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5361321e7067c7%3A0x21cfed5a9498e2a5!2sThe%20Attar%20Depot%20(Opening%20Soon)!5e0!3m2!1sen!2sin!4v1790573624309!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 5. CONCIERGE FAQ ACCORDION SECTION                                    */}
        {/* ===================================================================== */}
        <div className="max-w-4xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <HelpCircle className="w-4 h-4 text-[#C9A227]" />
              <span>Common Inquiries</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Instant answers regarding our distillation craftsmanship, custom flacons, and global delivery.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/70 backdrop-blur-md border border-emerald-100 shadow-2xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif text-sm sm:text-base font-bold text-neutral-900 hover:text-emerald-900 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#C9A227] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-emerald-50 font-sans animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
