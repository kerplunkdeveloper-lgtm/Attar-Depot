'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gem, Users, Handshake, Sparkles } from 'lucide-react';

const values = [
  {
    num: '01',
    icon: Gem,
    title: 'Uncompromising Quality',
    desc: 'Never settling for less than the purest botanical oils and finest agarwood.',
  },
  {
    num: '02',
    icon: Users,
    title: 'Personal Attention',
    desc: 'Bespoke recommendations tailored to every individual scent preference.',
  },
  {
    num: '03',
    icon: Handshake,
    title: 'Service You Can Trust',
    desc: 'Five decades of dependability and integrity passed down through generations.',
  },
];

export default function BrandValues() {
  return (
    <section
      id="brand-values"
      aria-label="The Values Remain"
      className="relative w-full overflow-hidden bg-[#0C0906] select-none"
      style={{ minHeight: 'clamp(360px, 44vh, 440px)' }}
    >
      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND: Artisanal Oud Wood, Incense Smoke & Jasmine
          Widescreen panoramic image framed with optimal height
      ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="/images/ourvalues.png"
          alt="Artisanal agarwood and smoking incense censer"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover object-[82%_50%]"
          style={{
            /* Preserve golden warm highlights while keeping text area dark */
            filter: 'brightness(0.72) contrast(1.1) saturate(1.05)',
          }}
        />

        {/* 1. Desktop gradient: pitch-dark on left for typography, open on right for smoke & oud */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              'linear-gradient(to right, #0C0906 0%, #0C0906 28%, rgba(12,9,6,0.92) 48%, rgba(12,9,6,0.55) 66%, rgba(12,9,6,0.12) 82%, transparent 100%)',
          }}
        />

        {/* 1b. Mobile gradient: ensures crisp legibility across all screen sizes */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              'linear-gradient(to bottom, rgba(12,9,6,0.92) 0%, rgba(12,9,6,0.72) 45%, rgba(12,9,6,0.95) 100%)',
          }}
        />

        {/* 2. Top & bottom smooth vignettes */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0C0906] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0C0906] to-transparent" />

        {/* 3. Subtle warm golden aura behind cards */}
        <div className="absolute left-[18%] top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#C9A227]/8 blur-[90px]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CONTENT: Compact Height, Premium Glassmorphism Cards
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-8xl mx-auto px-6 sm:px-10 py-10 sm:py-12 lg:py-14 w-full flex flex-col justify-center min-h-[clamp(360px,44vh,440px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* ── LEFT & CENTER: Header & 3 Value Cards (~62% width on desktop) ── */}
          <div className="lg:col-span-8 xl:col-span-7 space-y-6">

            {/* Section Header */}
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3"
              >
                <div className="w-8 h-px bg-[#C9A227]" />
                <span className="font-sans text-[10px] font-bold tracking-[0.4em] uppercase text-[#C9A227]">
                  OUR CORE PILLARS
                </span>
              </motion.div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-serif font-normal text-[#EDE8DF] leading-[1.08] tracking-[-0.02em]"
                  style={{ fontSize: 'clamp(28px, 3.2vw, 42px)' }}
                >
                  The Values <span className="italic text-[#C9A227]">Remain</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.18 }}
                  className="font-sans text-[12.5px] sm:text-[13.5px] text-[#B8B3A8]/75 font-light leading-relaxed max-w-[420px]"
                >
                  Across five decades, our foundation has remained steadfast — never compromise on quality, never compromise on trust.
                </motion.p>
              </div>
            </div>

            {/* 3 Value Cards: Glassmorphic, compact, high-touch UI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.1 }}
                    className="group relative rounded-xl border border-[#C9A227]/20 bg-[#14100B]/80 hover:bg-[#1A140E]/95 hover:border-[#C9A227]/60 backdrop-blur-md p-4 sm:p-4.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(201,162,39,0.14)] flex flex-col justify-between"
                  >
                    {/* Top row: Icon container + Number */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg border border-[#C9A227]/30 bg-[#C9A227]/10 flex items-center justify-center text-[#E5C158] group-hover:scale-105 group-hover:bg-[#C9A227]/20 transition-all duration-300 shadow-[0_2px_10px_rgba(201,162,39,0.1)]">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <span className="font-mono text-[10px] font-semibold tracking-widest text-[#C9A227]/45 group-hover:text-[#C9A227] transition-colors">
                        {v.num}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-serif text-[15px] sm:text-[16px] text-[#EDE8DF] font-medium leading-snug group-hover:text-[#F3EFEA] transition-colors">
                        {v.title}
                      </h3>
                      <p className="font-sans text-[11.5px] sm:text-[12px] text-[#B8B3A8]/75 font-light mt-1.5 leading-relaxed">
                        {v.desc}
                      </p>
                    </div>

                    {/* Bottom subtle gold accent bar on hover */}
                    <div className="absolute inset-x-3 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A227]/0 to-transparent group-hover:via-[#C9A227]/80 transition-all duration-500 rounded-full" />
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* ── RIGHT: Visual space showcasing the smoking censer & agarwood ── */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-5 flex-col items-end justify-end self-end pb-1">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C9A227]/25 bg-[#0C0906]/70 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
              <span className="font-sans text-[10px] tracking-[0.24em] uppercase text-[#E5C158] font-medium">
                Pondicherry Heritage · Since 1972
              </span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
