'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const tagLines = ['SAME', 'VALUES.', 'A BRIGHTER', 'TOMORROW.'];

export default function BrandTomorrow() {
  const [imgSrc, setImgSrc] = React.useState('/api/tomorrow-image');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  const scrollToJourney = () =>
    document.getElementById('brand-journey')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      ref={ref}
      id="brand-tomorrow"
      aria-label="Tomorrow — A Fragrance House"
      className="relative w-full overflow-hidden bg-[#090705] select-none"
      style={{ minHeight: 'clamp(480px, 65vh, 660px)' }}
    >
      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND: Majestic Sunset Archway Over Ocean Terrace
          Parallax movement with warm golden evening light
      ═══════════════════════════════════════════════════════════ */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 w-full h-[112%] -top-[6%]">
        <Image
          src={imgSrc}
          alt="A Fragrance House — Pondicherry Sunset Archway Over Sea"
          fill
          unoptimized
          priority
          sizes="100vw"
          /* Position archway center-right matching reference */
          className="object-cover object-[62%_center] lg:object-[66%_center]"
          onError={() => {
            if (imgSrc !== '/images/brand-tomorrow-arch.png') {
              setImgSrc('/images/brand-tomorrow-arch.png');
            }
          }}
          style={{
            filter: 'brightness(0.92) contrast(1.05) saturate(1.05)',
          }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          LAYERED CINEMATIC OVERLAYS
      ═══════════════════════════════════════════════════════════ */}

      {/* 1a. Left-to-right gradient for razor-sharp typography contrast */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, #090705 0%, #090705 28%, rgba(9,7,5,0.94) 46%, rgba(9,7,5,0.6) 60%, rgba(9,7,5,0.15) 75%, transparent 100%)',
        }}
      />

      {/* 1b. Mobile gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(9,7,5,0.92) 0%, rgba(9,7,5,0.7) 48%, rgba(9,7,5,0.95) 100%)',
        }}
      />

      {/* 2. Top & bottom smooth vignettes */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #090705 0%, transparent 100%)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #090705 0%, transparent 100%)' }}
      />

      {/* 3. Subtle warm golden sunset glow */}
      <div
        className="absolute left-[65%] top-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.12) 0%, transparent 70%)' }}
      />

      {/* 4. Film-grain tactile noise */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          CONTENT LAYER: Exact Reference Alignment & Typography
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 max-w-8xl mx-auto px-6 sm:px-10 lg:px-14 xl:px-18 py-16 sm:py-20 lg:py-24 flex items-center"
        style={{ minHeight: 'clamp(480px, 65vh, 660px)' }}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-8">

          {/* ── LEFT: Narrative Text & Outlined Pill Button ── */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-5 sm:space-y-6">

            {/* Eyebrow: TOMORROW */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span
                className="font-sans font-semibold uppercase text-[#C4A052]"
                style={{ fontSize: '11px', letterSpacing: '0.36em' }}
              >
                TOMORROW
              </span>
            </motion.div>

            {/* Headline: A Fragrance House */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-normal text-[#FFFFFF] leading-[1.06] tracking-[-0.02em]"
              style={{ fontSize: 'clamp(32px, 3.8vw, 54px)' }}
            >
              A Fragrance House
            </motion.h2>

            {/* Gold Divider Rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-10 h-[2px] bg-[#C4A052] origin-left"
            />

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.22 }}
              className="font-serif text-[16px] sm:text-[18px] text-[#EDE8DF] font-normal leading-relaxed"
            >
              Growing from Pondicherry into a wider world of fragrance.
            </motion.p>

            {/* Body Copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.28 }}
              className="space-y-2.5 font-sans text-[13px] sm:text-[14px] text-[#B8B3A8] font-light leading-[1.85] max-w-[500px]"
            >
              <p>
                Pondicherry is where we begin, not where we intend to stop.
              </p>
              <p>
                Our ambition is to build a fragrance house that can grow beyond a single location, through our stores, digital experience, gifting, personalised fragrance discovery and eventually our own signature creations.
              </p>
            </motion.div>

            {/* Button: EXPLORE OUR JOURNEY → */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.35 }}
              className="pt-2"
            >
              <button
                onClick={scrollToJourney}
                className="group inline-flex items-center gap-3 px-7 py-3 rounded-full border border-[#C4A052]/60 hover:border-[#C4A052] hover:bg-[#C4A052]/10 transition-all duration-300 font-sans text-[11px] font-bold tracking-[0.18em] uppercase text-[#FFFFFF] shadow-[0_4px_16px_rgba(0,0,0,0.3)] active:scale-[0.98]"
              >
                <span>EXPLORE OUR JOURNEY</span>
                <ArrowRight
                  className="w-3.5 h-3.5 text-[#C4A052] group-hover:translate-x-1 transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT: Vertical Accent Rule & Stacked Motto (Matches Reference) ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="hidden xl:flex lg:col-span-5 xl:col-span-5 items-center justify-end gap-5"
          >
            {/* Vertical Rule with Central Diamond */}
            <div className="flex flex-col items-center gap-1.5 opacity-80">
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C4A052]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#C4A052]" />
              <div className="w-px h-12 bg-gradient-to-t from-transparent to-[#C4A052]" />
            </div>

            {/* Stacked Motto Words */}
            <div className="flex flex-col gap-1.5 text-left">
              {tagLines.map((line) => (
                <p
                  key={line}
                  className="font-sans font-bold uppercase text-[#C4A052]"
                  style={{ fontSize: '10.5px', letterSpacing: '0.28em' }}
                >
                  {line}
                </p>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BOTTOM CENTER DECORATIVE DIVIDER (Matches Reference Image)
          Horizontal line with centered diamond ornament
      ═══════════════════════════════════════════════════════════ */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 pointer-events-none z-10 opacity-70">
        <div className="w-16 sm:w-28 h-px bg-gradient-to-r from-transparent to-[#C4A052]" />
        <div className="w-1.5 h-1.5 rotate-45 bg-[#C4A052]" />
        <div className="w-16 sm:w-28 h-px bg-gradient-to-l from-transparent to-[#C4A052]" />
      </div>
    </section>
  );
}
