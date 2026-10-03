'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ============================================================================
// Fine-line Icons for Quality, Personal Attention, Dependable Service
// ============================================================================

function DiamondIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="6,3 18,3 22,9 12,21 2,9" />
      <line x1="2" y1="9" x2="22" y2="9" />
      <line x1="12" y1="21" x2="7.5" y2="9" />
      <line x1="12" y1="21" x2="16.5" y2="9" />
      <line x1="6" y1="3" x2="7.5" y2="9" />
      <line x1="18" y1="3" x2="16.5" y2="9" />
    </svg>
  );
}

function AttentionIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="9" cy="7" r="3.5" />
      <path d="M2.5 19c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" />
      <circle cx="17.5" cy="9.5" r="2.2" opacity="0.8" />
      <path d="M16 15c2 .3 4 1.8 4 4" opacity="0.8" />
    </svg>
  );
}

function ServiceIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 11l-4.5 4.5a2 2 0 0 1-2.8 0L7 11.8a2 2 0 0 1 0-2.8l2.2-2.2a2 2 0 0 1 2.8 0L14 8.8" />
      <path d="M2 13l3.5 3.5a2 2 0 0 0 2.8 0L10 15" />
      <path d="M22 13l-3.5 3.5a2 2 0 0 1-2.8 0L14 15" />
      <path d="M6 9l2-2" />
      <path d="M18 9l-2-2" />
    </svg>
  );
}

// 5 Timeline Milestones matching the exact reference image
const timelineMilestones = [
  {
    period: '1972',
    title: 'The Beginning',
    description: 'A family business in Pondicherry',
    image: '/images/heritage-storefront.jpg',
    alt: '1972 Storefront in Pondicherry',
  },
  {
    period: '50+ Years',
    title: 'A Legacy of Trust',
    description: 'Generation after generation of customers',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=350',
    alt: '50+ Years of generational trust with beds and mattresses',
  },
  {
    period: 'A New Passion',
    title: 'Attars • Oud • Fine Fragrance',
    description: 'A growing fascination with the world of scents',
    image: '/images/ourvalues.png',
    alt: 'A New Passion - Aged Oud Wood Chips and Fine Perfumery',
  },
  {
    period: 'Today',
    title: 'The Attar Depot',
    description: 'Bringing our passion to life in Pondicherry',
    image: '/images/about-hero-banner.jpg',
    alt: 'Today - The Attar Depot in Pondicherry',
  },
  {
    period: 'Tomorrow',
    title: 'A Fragrance House',
    description: 'Beyond a single location, to new possibilities',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=350',
    alt: 'Tomorrow - Global Fragrance House',
  },
];

export default function AboutHeritage() {
  return (
    <section 
      id="heritage" 
      aria-label="Our Heritage - It Began With Trust"
      className="relative w-full bg-[#FAF7F0] text-[#1E1B18] pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-24 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-16 overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* Vintage Deckle-Edge Parchment Canvas Background                           */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <Image
          src="/images/heritage-parchment-bg.jpg"
          alt="Vintage Parchment Texture"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center w-full h-full mix-blend-multiply"
        />
        {/* Soft edge watercolor vignetting */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F0]/80 via-transparent to-[#FAF7F0]/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Top Breadcrumb Navigation */}
        <div className="pb-8 sm:pb-12">
          <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest font-sans">
            <Link href="/" className="hover:text-[#8C7355] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#8C7355] font-bold">Our Story</span>
          </nav>
        </div>

        {/* ======================================================================= */}
        {/* PART 1: Top Hero Story Grid (Photo on Left, Story on Right)             */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Vintage 1972 Storefront with Torn Deckle Edges */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative flex justify-center"
          >
            {/* Vintage Archival Photo with Torn Paper Shadow & Border */}
            <div className="relative w-full max-w-[540px] group">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[#D9CDB8]/80 bg-[#EFE9DF]">
                <Image
                  src="/images/heritage-storefront.jpg"
                  alt="Attar Depot Heritage 1972 - Pondicherry storefront with founders"
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                {/* Subtle Sepia & Grain Vignette */}
                <div className="absolute inset-0 bg-[#8C7355]/8 mix-blend-color pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                {/* Archival Badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-[#1F1C18]/85 backdrop-blur-md text-[#FAF7F0] px-3.5 py-1.5 rounded-lg border border-[#C9A227]/30 text-[11px] sm:text-xs font-sans tracking-wide">
                  <span className="font-medium text-[#C9A227]">Pondicherry Storefront</span> • Circa 1972
                </div>
              </div>

              {/* Decorative Vintage Stamp Accent */}
              <div className="hidden sm:flex absolute -bottom-4 -right-3 bg-[#FAF7F0] text-[#1E1B18] px-4 py-2.5 rounded-xl shadow-lg border border-[#D9CDB8] flex-col items-center">
                <span className="font-serif text-xl font-bold text-[#8C7355] leading-none">Since 1972</span>
                <span className="text-[9px] tracking-widest uppercase text-neutral-500 font-sans mt-0.5">Pondicherry</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative Typography & 3 Values Icons */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col space-y-5 sm:space-y-6"
          >
            {/* Tag */}
            <div className="text-[#8C7355] text-xs font-semibold tracking-[0.28em] uppercase font-sans">
              OUR HERITAGE
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[54px] font-normal tracking-tight text-[#161412] leading-[1.08]">
              It Began <br className="hidden sm:inline" />
              With Trust.
            </h2>

            {/* Belief Quote Block */}
            <div className="space-y-1.5 pt-1">
              <p className="text-neutral-500 font-sans text-xs sm:text-sm font-medium tracking-wide">
                For generations, we have believed in something simple:
              </p>
              <p className="font-serif text-base sm:text-lg md:text-xl italic text-[#1A1816] leading-relaxed font-light">
                &ldquo;When you give people quality, stand behind what you sell, and genuinely care about your customers, trust follows.&rdquo;
              </p>
            </div>

            {/* Prose Story */}
            <div className="space-y-3 font-sans text-sm sm:text-[15px] text-neutral-700 leading-relaxed font-light">
              <p>
                Our family&apos;s journey in Pondicherry began in 1972. For more than five decades, we served generations of families through mattresses, beds and pillows — products chosen for something deeply personal: comfort and well-being.
              </p>
              <p>
                But what people remembered wasn&apos;t simply what was on our shelves.
              </p>
              <p className="font-serif text-base sm:text-lg italic text-[#161412] font-normal pt-0.5">
                It was the way we did business.
              </p>
            </div>

            {/* 3 Values Icons Matching Exact Reference Image */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-[#D9CDB8]/80">
              {/* Quality */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group cursor-pointer">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70 border border-[#D9CDB8] group-hover:border-[#8C7355] group-hover:bg-[#8C7355] text-[#161412] group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm">
                  <DiamondIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#161412] tracking-wide">
                  Quality
                </span>
              </div>

              {/* Personal Attention */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group cursor-pointer">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70 border border-[#D9CDB8] group-hover:border-[#8C7355] group-hover:bg-[#8C7355] text-[#161412] group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm">
                  <AttentionIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#161412] tracking-wide">
                  Personal Attention
                </span>
              </div>

              {/* Dependable Service */}
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2 group cursor-pointer">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/70 border border-[#D9CDB8] group-hover:border-[#8C7355] group-hover:bg-[#8C7355] text-[#161412] group-hover:text-white transition-all duration-300 flex items-center justify-center shadow-sm">
                  <ServiceIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="font-sans text-xs sm:text-[13px] font-semibold text-[#161412] tracking-wide">
                  Dependable Service
                </span>
              </div>
            </div>

          </motion.div>

        </div>

        {/* ======================================================================= */}
        {/* PART 2: Bottom Timeline Section (A Journey Through Time)                */}
        {/* ======================================================================= */}
        <div className="mt-20 sm:mt-24 md:mt-28 pt-12 sm:pt-14 border-t border-[#D9CDB8]/60">
          
          {/* Subtitle Header */}
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[#8C7355] text-xs font-semibold tracking-[0.3em] uppercase font-sans">
              A JOURNEY THROUGH TIME
            </p>
          </div>

          {/* Desktop Horizontal Connected Timeline */}
          <div className="hidden md:block relative">
            {/* Golden Horizontal Connecting Line */}
            <div className="absolute top-[48px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-[#D9CDB8]/40 via-[#8C7355] to-[#D9CDB8]/40 z-0" />

            {/* 5 Milestone Circular Nodes */}
            <div className="grid grid-cols-5 gap-3 lg:gap-4 relative z-10">
              {timelineMilestones.map((item, idx) => (
                <motion.div
                  key={item.period}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Circular Node Image with Pin Dot */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full p-1 bg-white/70 border border-[#D9CDB8] group-hover:border-[#8C7355] shadow-md group-hover:shadow-xl transition-all duration-300">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-200">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          unoptimized
                          sizes="100px"
                          className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-[#8C7355]/10 group-hover:opacity-0 transition-opacity duration-300" />
                      </div>
                    </div>

                    {/* Small Golden Pinpoint Dot on Line */}
                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8C7355] border border-white shadow-sm" />
                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8C7355] border border-white shadow-sm" />
                  </div>

                  {/* Year / Period */}
                  <span className="font-serif text-lg lg:text-xl font-bold text-[#161412] tracking-tight mb-0.5">
                    {item.period}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-xs lg:text-[13px] font-medium text-[#8C7355] tracking-wide mb-1">
                    {item.title}
                  </h3>

                  {/* Subtitle / Description */}
                  <p className="font-sans text-[11px] lg:text-xs text-neutral-600 font-light leading-relaxed max-w-[170px]">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Vertical Flow */}
          <div className="md:hidden relative">
            {/* Vertical Golden Connecting Line */}
            <div className="absolute top-6 bottom-6 left-12 w-[1px] bg-gradient-to-b from-[#8C7355] via-[#D9CDB8] to-[#8C7355] z-0" />

            <div className="space-y-7 relative z-10">
              {timelineMilestones.map((item, idx) => (
                <motion.div
                  key={item.period}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="flex items-center gap-5 group"
                >
                  {/* Circular Node Image */}
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-full p-1 bg-white/70 border border-[#D9CDB8] shadow-md transition-all duration-300">
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-200">
                        <Image
                          src={item.image}
                          alt={item.alt}
                          fill
                          unoptimized
                          sizes="96px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    {/* Golden Dot */}
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#8C7355] border-2 border-white shadow-sm" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pr-2">
                    <span className="font-serif text-lg font-bold text-[#161412] block">
                      {item.period}
                    </span>
                    <h3 className="font-serif text-xs font-medium text-[#8C7355] tracking-wide mt-0.5">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-neutral-600 font-light mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
