import React from 'react';
import type { Metadata } from 'next';
import FAQsection from '@/components/home/FAQsection';
import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ – Frequently Asked Questions | Attar Depot',
  description:
    'Find answers to common questions about our pure oil attars, alcohol-free fragrances, application tips, gifting services, and our boutique in Pondicherry.',
  keywords:
    'Attar Depot FAQ, attar questions, alcohol free perfume, how to apply attar, fragrance gifting, Pondicherry perfume store, pure attar oil',
  openGraph: {
    title: 'FAQ – Frequently Asked Questions | Attar Depot',
    description:
      'Find answers to common questions about our pure oil attars, alcohol-free fragrances, application tips, gifting services, and our boutique in Pondicherry.',
    url: 'https://attardepot.com/faq',
    siteName: 'Attar Depot',
  },
};

export default function FAQPage() {
  return (
    <main className="w-full min-h-screen bg-[#FAF8F5] text-neutral-900 overflow-x-hidden selection:bg-[#C9A227] selection:text-black">
      {/* Page Hero Header */}
      <section className="w-full bg-gradient-to-b from-[#012520] via-[#023830] to-[#012520] relative overflow-hidden">
        {/* Decorative ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 60% at 50% 110%, rgba(201,162,39,0.18) 0%, transparent 70%)',
          }}
        />
        {/* Top gold hairline */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418]/60 to-transparent pointer-events-none" />
        {/* Bottom gold hairline */}
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418]/60 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-20 text-center relative z-10">
          {/* Back breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#F5B418]/80 hover:text-[#F5B418] uppercase tracking-widest mb-6 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>

          {/* Icon badge */}
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F5B418]/15 border border-[#F5B418]/35 flex items-center justify-center shadow-[0_0_30px_rgba(245,180,24,0.2)]">
              <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[#F5B418]" />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.15em] text-[#FAF8F2] uppercase font-sans">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#FAF8F2]/65 max-w-xl mx-auto leading-relaxed tracking-wide">
            Everything you need to know about our pure oil attars, fragrance rituals, gifting
            services and our Pondicherry boutique.
          </p>

          {/* Decorative divider */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#F5B418]/60" />
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#F5B418] opacity-80"
            >
              <path
                d="M12 2L22 12L12 22L2 12L12 2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="rgba(245,180,24,0.2)"
              />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
            <span className="w-12 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#F5B418]/60" />
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <FAQsection />
    </main>
  );
}
