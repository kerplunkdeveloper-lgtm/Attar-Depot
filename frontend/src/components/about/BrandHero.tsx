'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const sideLinks = ['TRADITION', 'PEOPLE', 'FRAGRANCE', 'A BRIGHTER TOMORROW'];

export default function BrandHero() {
  const [imgSrc, setImgSrc] = React.useState('/api/hero-image');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  /* Subtle parallax — image moves slightly slower than scroll */
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  const scrollToJourney = () =>
    document.getElementById('brand-journey')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      ref={ref}
      id="brand-hero"
      aria-label="Our Brand — A Legacy of Trust"
      className="relative w-full overflow-hidden bg-[#0C0906] select-none"
      /* Banner height: ~75vh on desktop, ~90vw on mobile */
      style={{ minHeight: 'clamp(380px, 75vh, 720px)' }}
    >
      {/* ═══════════════════════════════════════════════════════════
          BACKGROUND: User-Provided Heritage Luxury Attar Bottle
          Positioned to showcase the glowing bottle, oud wood, and flowers
      ═══════════════════════════════════════════════════════════ */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 w-full h-[112%] -top-[6%] pointer-events-none"
      >
        <Image
          src={imgSrc}
          alt="The Attar Depot — Heritage Luxury Attar Bottle on Dark Oud"
          fill
          priority
          unoptimized
          sizes="100vw"
          /* Position bottle center-right with arch and flowers */
          className="object-cover object-[70%_52%] sm:object-[68%_50%]"
          onError={() => {
            if (imgSrc !== '/images/brand-hero-attar.png') {
              setImgSrc('/images/brand-hero-attar.png');
            }
          }}
          style={{
            /* Rich contrast and vibrant golden hues */
            filter: 'brightness(0.92) contrast(1.04) saturate(1.05)',
          }}
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          COLOUR OVERLAYS — layered for cinematic depth & readability
      ═══════════════════════════════════════════════════════════ */}

      {/* 1a. Desktop left-to-right gradient — text crisp, bottle glowing */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, #0C0906 0%, #0C0906 24%, rgba(12,9,6,0.92) 42%, rgba(12,9,6,0.55) 60%, rgba(12,9,6,0.15) 76%, transparent 100%)',
        }}
      />

      {/* 1b. Mobile gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12,9,6,0.88) 0%, rgba(12,9,6,0.65) 45%, rgba(12,9,6,0.94) 100%)',
        }}
      />

      {/* 2. Warm amber aura around bottle center-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 68% 52%, rgba(200,130,30,0.16) 0%, transparent 70%)',
        }}
      />

      {/* 3. Top edge vignette — blends seamlessly with navbar */}
      <div
        className="absolute inset-x-0 top-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #0C0906 0%, transparent 100%)' }}
      />

      {/* 4. Bottom edge vignette — blends into timeline section */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0C0906 0%, transparent 100%)' }}
      />

      {/* 5. Film-grain texture overlay for premium tactile feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.038,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
        }}
      />

      {/* ═══════════════════════════════════════════════════════════
          CONTENT LAYER
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full h-full max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-18 flex items-center"
        style={{ minHeight: 'clamp(380px, 65vh, 720px)' }}
      >
        <div className="w-full grid grid-cols-12 items-center gap-0 py-20 lg:py-0">

          {/* ── LEFT TEXT BLOCK ── */}
          <div className="col-span-12 mt-10 lg:col-span-7 xl:col-span-6 2xl:col-span-5 flex flex-col gap-5 lg:gap-6">

            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-px bg-[#C9A227]" />
              <span
                className="font-sans  font-bold uppercase text-[#C9A227]"
                style={{ fontSize: '10px', letterSpacing: '0.38em' }}
              >
                OUR BRAND
              </span>
            </motion.div>

            {/* Main Headline — exact reference layout */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-normal leading-[1.05] tracking-[-0.022em] text-[#EDE8E0]"
              style={{ fontSize: 'clamp(32px, 4.4vw, 62px)' }}
            >
              A Legacy of Trust.
              <br />
              A New World
              <br />
              <span>
                of{' '}
                {/* Gold italic "Fragrance." — exact reference match */}
                <span
                  className="text-[#C9A227] font-serif"
                  style={{ fontStyle: 'italic' }}
                >
                  Fragrance.
                </span>
              </span>
            </motion.h1>

            {/* Gold rule */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="origin-left"
              style={{
                width: '52px',
                height: '1.5px',
                background: 'linear-gradient(to right, #C9A227, rgba(201,162,39,0.25))',
              }}
            />

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.44 }}
              className="font-sans font-light leading-[1.85] text-[#B8B3A9]/80"
              style={{ fontSize: 'clamp(13px, 1.3vw, 15.5px)', maxWidth: '380px' }}
            >
              The same values that earned generations of trust
              <br className="hidden sm:block" />
              in Pondicherry now find a new expression
              <br className="hidden sm:block" />
              in a world of fragrance.
            </motion.p>

            {/* CTA Button — outlined pill, matches reference */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.58 }}
            >
              <button
                onClick={scrollToJourney}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#C9A227]/45 hover:border-[#C9A227]/85 hover:bg-[#C9A227]/8 transition-all duration-350 active:scale-[0.97]"
              >
                <span
                  className="font-sans font-semibold uppercase tracking-[0.2em] text-[#E8E2D8]"
                  style={{ fontSize: '11px' }}
                >
                  OUR JOURNEY
                </span>
                <ChevronDown
                  className="w-3.5 h-3.5 text-[#C9A227] group-hover:translate-y-[3px] transition-transform duration-300"
                  strokeWidth={2.5}
                />
              </button>
            </motion.div>
          </div>

          {/* ── RIGHT: Vertical navigation (desktop-only, far right) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="hidden xl:flex col-span-5 xl:col-span-6 2xl:col-span-7 flex-col items-end justify-center gap-[18px]"
          >
            {sideLinks.map((label, i) => (
              <motion.p
                key={label}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 1.0 + i * 0.09 }}
                className="font-sans font-semibold uppercase text-[#C4BC9E]/55 hover:text-[#C9A227]/80 cursor-pointer transition-colors duration-300"
                style={{ fontSize: '9.5px', letterSpacing: '0.32em' }}
              >
                {label}
              </motion.p>
            ))}
          </motion.div>

        </div>
      </div>

      {/* ═══ Animated liquid scroll cue ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-px overflow-hidden" style={{ height: '44px' }}>
          <motion.div
            className="w-full"
            style={{
              height: '100%',
              background: 'linear-gradient(to bottom, transparent, #C9A227, transparent)',
            }}
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
