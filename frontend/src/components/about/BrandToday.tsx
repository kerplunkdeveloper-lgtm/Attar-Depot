'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function BrandToday() {
  return (
    <section
      id="brand-today"
      aria-label="Today — The Attar Depot"
      className="relative w-full bg-[#FAF7F2] overflow-hidden select-none border-y border-[#EAE3D5]"
    >
      {/* Subtle fine paper texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px] xl:min-h-[480px]">

          {/* ═══════════════════════════════════════════════════════════
              LEFT COLUMN: Eyebrow + Title + Rule + Text + Button
          ═══════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center px-6 sm:px-10 lg:pl-12 lg:pr-6 py-12 sm:py-16 lg:py-12 space-y-5"
          >
            {/* Eyebrow: TODAY */}
            <span
              className="font-sans font-semibold uppercase tracking-[0.38em] text-[#C29F55]"
              style={{ fontSize: '11px' }}
            >
              TODAY
            </span>

            {/* Headline: The Attar Depot */}
            <h2
              className="font-serif font-normal text-[#1A1815] leading-[1.08] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 3.2vw, 46px)' }}
            >
              The Attar Depot
            </h2>

            {/* Gold Divider Rule */}
            <div className="w-10 h-[2px] bg-[#C29F55]" />

            {/* Description */}
            <p
              className="font-sans font-light text-[#555048] leading-[1.8]"
              style={{ fontSize: 'clamp(13px, 1.15vw, 14.5px)', maxWidth: '380px' }}
            >
              Those same values now find a new expression in fragrance — through quality, curation, personal attention and the joy of discovery.
            </p>

            {/* Button: EXPLORE OUR COLLECTIONS → */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#C29F55] hover:bg-[#B59145] text-[#1A160C] transition-all duration-300 font-sans text-[11px] font-bold tracking-[0.16em] uppercase shadow-[0_4px_16px_rgba(194,159,85,0.28)] hover:shadow-[0_6px_22px_rgba(194,159,85,0.4)] hover:-translate-y-0.5 active:translate-y-0 w-fit"
              >
                <span>EXPLORE OUR COLLECTIONS</span>
                <ArrowRight
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </Link>
            </div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════
              CENTER COLUMN: Pondicherry Street & "THE ATTAR DEPOT" Sign
              Uses original high-definition heritage photo
          ═══════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 xl:col-span-5 relative w-full h-[340px] sm:h-[420px] lg:h-auto overflow-hidden">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src="/images/pondicherry-heritage-hd.jpg"
                alt="The Attar Depot — Heritage Pondicherry French Quarter"
                fill
                unoptimized
                priority
                className="object-cover object-[25%_center] hover:scale-105 transition-transform duration-700"
              />



              {/* Left soft feather fade into ivory background */}
              <div
                className="absolute inset-y-0 left-0 w-20 sm:w-28 pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(to right, #FAF7F2 0%, rgba(250,247,242,0.85) 35%, transparent 100%)',
                }}
              />

              {/* Right subtle fade into ivory background */}
              <div
                className="absolute inset-y-0 right-0 w-12 sm:w-16 pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(to left, #FAF7F2 0%, rgba(250,247,242,0.7) 40%, transparent 100%)',
                }}
              />
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              RIGHT COLUMN: Pull Quote with Top & Bottom Gold Rules
          ═══════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 xl:col-span-3 flex flex-col justify-center px-6 sm:px-10 lg:pl-6 lg:pr-10 py-10 sm:py-14 lg:py-12 space-y-4"
          >
            {/* Top gold dash */}
            <div className="w-8 h-[2px] bg-[#C29F55]" />

            {/* Quote */}
            <blockquote
              className="font-serif italic text-[#343029] leading-[1.82] font-normal"
              style={{ fontSize: 'clamp(14.5px, 1.25vw, 17.5px)', maxWidth: '300px' }}
            >
              “A familiar fragrance can bring back a memory, remind us of a place, or someone we love. Fragrance has a way of becoming part of who we are.”
            </blockquote>

            {/* Bottom gold dash */}
            <div className="w-8 h-[2px] bg-[#C29F55]" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
