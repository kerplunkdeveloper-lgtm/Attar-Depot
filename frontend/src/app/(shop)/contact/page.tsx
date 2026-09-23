'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

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
      'Our Kannauj heritage works and Mumbai boutique welcome fragrance connoisseurs by appointment. Please call or message our concierge desk in advance so we can prepare an exclusive scent discovery tray for your visit.',
  },
];

export default function ContactPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-neutral-900 font-sans selection:bg-[#046A5A] selection:text-white pb-24">
      {/* ===================================================================== */}
      {/* 1. HERO BANNER SECTION WITH OFFICIAL CONTACT BANNER                   */}
      {/* ===================================================================== */}
      <section className="relative w-full overflow-hidden bg-[#012520]">
        <div className="relative w-full">
          <Image
            src="/images/contactbanner.png"
            alt="Contact Attar Depot - Pure Essence of Royalty"
            width={1920}
            height={800}
            priority
            quality={95}
            sizes="100vw"
            className="w-full h-auto object-cover block"
          />
          {/* Subtle royal emerald tint overlay */}
          <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />
          {/* Elegant bottom gradient fade to page background */}
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-14 md:h-20 bg-gradient-to-t from-[#FAF8F2] via-[#FAF8F2]/40 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#C9A227] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C9A227] font-bold">Contact Us</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 relative z-20 space-y-12 sm:space-y-16">
        {/* ===================================================================== */}
        {/* 2. FOUR VIP CONCIERGE CARDS GRID                                      */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Direct Phone Desk */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] hover:shadow-[0_15px_35px_rgba(245,180,24,0.18)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#012520] to-[#046A5A] text-[#F5B418] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900/70">
                Direct Hotline
              </p>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Concierge Desk
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Speak directly with our fragrance specialists for orders, blending, and product advice.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-emerald-50">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-[#C9A227] transition-colors"
              >
                <span>+91 98765 43210</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp Chat */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.18)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900/70">
                  Instant Messaging
                </p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Avg. 10m
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                WhatsApp Perfumer
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Fast scent suggestions, real bottle photos, personalized notes, and quick reorders.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-emerald-50">
              <a
                href="https://wa.me/919876543210?text=Salam%20%26%20Greetings!%20I%20am%20inquiring%20about%20Attar%20Depot%20pure%20perfume%20oils%20and%20bespoke%20royal%20fragrances."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#20bd5a] hover:text-[#189b48] transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 3: VIP Email */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] hover:shadow-[0_15px_35px_rgba(245,180,24,0.18)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#012520] to-[#046A5A] text-[#F5B418] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900/70">
                Written Inquiries
              </p>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                VIP Correspondence
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                For corporate bulk gifts, exports, bridal orders, and formal vendor proposals.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-emerald-50">
              <a
                href="mailto:concierge@attardepot.com"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-[#C9A227] transition-colors truncate max-w-full"
              >
                <span className="truncate">concierge@attardepot.com</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Card 4: Heritage Boutique */}
          <div className="rounded-2xl p-5 sm:p-6 bg-white/95 backdrop-blur-md border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] hover:shadow-[0_15px_35px_rgba(245,180,24,0.18)] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#012520] to-[#046A5A] text-[#F5B418] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900/70">
                Flagship Works
              </p>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Kannauj & Mumbai
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Heritage Perfume Lane, Near Jama Masjid, Kannauj & Fort, Mumbai.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-emerald-50">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kannauj+Perfume+Market+India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-[#C9A227] transition-colors"
              >
                <span>View Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. ATELIER LOCATION & MAP SECTION                                     */}
        {/* ===================================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-50 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Physical Flagship Works</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
                Kannauj & Mumbai Works
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600">
                Heritage Perfume Lane, Near Jama Masjid, Kannauj Distillers Quarter & Fort, South Mumbai, India - 209725.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden md:flex items-center gap-2 text-xs text-neutral-600 bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>Mon–Sat: 10:00 AM – 9:00 PM IST</span>
              </div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kannauj+Perfume+Market+India"
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
              title="Attar Depot Flagship Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113945.7483788294!2d79.8519183!3d27.0549422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399e0df39a3f29b7%3A0xe2128713d2f2c83b!2sKannauj%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 4. CONCIERGE FAQ ACCORDION SECTION                                    */}
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
                  className="rounded-2xl bg-white border border-emerald-100 shadow-2xs overflow-hidden transition-all duration-200"
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
