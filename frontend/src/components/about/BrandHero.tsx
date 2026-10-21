'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const sideLinks = ['TRADITION', 'PEOPLE', 'FRAGRANCE', 'A BRIGHTER TOMORROW'];

export default function BrandHero() {
  const [imgSrc, setImgSrc] = React.useState('/images/brand-hero-attar.png');
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  /* Subtle parallax — image moves slightly slower than scroll */
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

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
          BACKGROUND: High-Definition Heritage Luxury Attar Bottle
          Showcasing the razor-sharp crystal flacon, oud wood, and flowers
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
          quality={95}
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-[68%_center]"
        />
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          COLOUR OVERLAYS — Clean gradient for readability without blurring
      ═══════════════════════════════════════════════════════════ */}

      {/* 1a. Desktop left-to-right gradient — text crisp, bottle glowing */}
      <div
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, #0C0906 0%, #0C0906 20%, rgba(12,9,6,0.85) 38%, rgba(12,9,6,0.35) 58%, transparent 75%)',
        }}
      />

      {/* 1b. Mobile gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12,9,6,0.85) 0%, rgba(12,9,6,0.4) 45%, rgba(12,9,6,0.9) 100%)',
        }}
      />

      {/* 2. Top edge vignette — blends seamlessly with navbar */}
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #0C0906 0%, transparent 100%)' }}
      />

      {/* 3. Bottom edge vignette — blends into timeline section */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #0C0906 0%, transparent 100%)' }}
      />

      {/* ═══════════════════════════════════════════════════════════
          CONTENT LAYER
      ═══════════════════════════════════════════════════════════ */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center"
        style={{ minHeight: 'clamp(460px, 72vh, 740px)' }}
      >
        <div className="w-full grid grid-cols-12 items-center gap-6 py-14 sm:py-20 lg:py-24">

          {/* ── LEFT TEXT BLOCK ── */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7 flex flex-col gap-5 lg:gap-6">

            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-px bg-[#C9A227]" />
              <span
                className="font-sans font-bold uppercase text-[#C9A227]"
                style={{ fontSize: '10.5px', letterSpacing: '0.38em' }}
              >
                OUR BRAND
              </span>
            </motion.div>

            {/* Main Headline — exact reference layout */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif font-normal leading-[1.08] tracking-[-0.022em] text-[#EDE8E0]"
              style={{ fontSize: 'clamp(34px, 4.2vw, 62px)' }}
            >
              A Legacy of Trust.
              <br />
              A New World{' '}
              <span>
                of{' '}
                <span
                  className="text-[#C9A227] font-serif italic"
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
              className="font-sans font-light leading-[1.85] text-[#B8B3A9]/85 max-w-lg"
              style={{ fontSize: 'clamp(13.5px, 1.25vw, 15.5px)' }}
            >
              The same values that earned generations of trust in Pondicherry now find a new expression in an artisanal world of fragrance.
            </motion.p>

            {/* CTA Button — outlined pill */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.58 }}
              className="pt-1"
            >
              <button
                onClick={scrollToJourney}
                className="group relative inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 rounded-full border border-[#C9A227]/50 hover:border-[#C9A227] hover:bg-[#C9A227]/12 transition-all duration-300 active:scale-[0.97] shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
              >
                <span
                  className="font-sans font-semibold uppercase tracking-[0.2em] text-[#E8E2D8] group-hover:text-white transition-colors"
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

          {/* ── RIGHT: Vertical navigation (desktop, clean right gutter alignment) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="hidden lg:flex col-span-4 xl:col-span-5 flex-col items-end justify-center gap-4.5"
          >
            {[
              { label: 'TRADITION', id: 'brand-journey' },
              { label: 'PEOPLE', id: 'brand-values' },
              { label: 'FRAGRANCE', id: 'brand-today' },
              { label: 'A BRIGHTER TOMORROW', id: 'brand-tomorrow' },
            ].map((item, i) => (
              <motion.button
                key={item.label}
                type="button"
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 1.0 + i * 0.09 }}
                className="group flex items-center gap-2.5 text-right font-sans font-semibold uppercase text-[#C4BC9E]/60 hover:text-[#C9A227] transition-all duration-300 cursor-pointer"
                style={{ fontSize: '9.5px', letterSpacing: '0.32em' }}
              >
                <span>{item.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#C9A227] transition-all duration-300" />
              </motion.button>
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
