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
import { SITE_CONTACT } from '@/config/siteContact';
import FindUsAround from '@/components/common/FindUsAround';

// Frequently Asked Questions
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
        <div className="relative w-full h-[125px] sm:h-[165px] md:h-[205px] lg:h-[400px]">
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
        {/* 3. FIND US AROUND - OFFICIAL SOCIAL MEDIA CHANNELS                    */}
        {/* ===================================================================== */}
        <FindUsAround className="pt-2" />

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
                href={SITE_CONTACT.maps.directionsUrl}
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
              src={SITE_CONTACT.maps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>

        
      </div>
    </div>
  );
}
