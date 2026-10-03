'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

export default function AboutHero() {
  const scrollToHeritage = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('heritage');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      aria-label="About Attar Depot - A Legacy of Trust, A New World of Fragrance"
      className="relative w-full min-h-[380px] sm:min-h-[420px] md:min-h-[450px] lg:min-h-[480px] xl:min-h-[520px] flex items-center bg-[#070A08] text-[#FAF6F0] overflow-hidden select-none"
    >
      {/* Background Photography Layer: Luxury Perfume Flacon, Jasmine & Oud Wood */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <Image
          src="/images/about-hero-banner.jpg"
          alt="Attar Depot - A Legacy of Trust, A New World of Fragrance"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[76%_center] sm:object-[72%_center] md:object-[68%_center] lg:object-[64%_center] xl:object-center w-full h-full brightness-[0.92] contrast-[1.03]"
        />

        {/* Ambient Dark Gradient Overlays for Guaranteed Text Readability */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#070A08]/95 via-[#070A08]/75 to-transparent" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-b from-[#070A08]/30 via-transparent to-[#070A08]/80" />

        <div className="block lg:hidden absolute inset-0 bg-gradient-to-r from-[#070A08]/95 via-[#070A08]/85 to-[#070A08]/50" />
        <div className="block lg:hidden absolute inset-0 bg-gradient-to-b from-[#070A08]/70 via-transparent to-[#070A08]/90" />
      </div>

      {/* Content Container (Grid layout: Text on Left, Visual space on Right) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Heading, Subtitle & Interactive Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 xl:col-span-6 flex flex-col space-y-4 sm:space-y-5 max-w-2xl"
          >
            {/* Top Eyebrow Tagline */}
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
              <span>SINCE 1972 • PONDICHERRY</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-normal tracking-tight text-[#F7F4EE] leading-[1.1] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              A Legacy <br className="hidden sm:inline" />
              Of Trust. <br />
              <span className="italic text-[#EAD8B1] font-light">A New World</span> <br className="hidden sm:inline" />
              Of Fragrance.
            </h1>

            {/* Narrative Subtitle */}
            <div className="space-y-1 font-sans text-xs sm:text-sm md:text-base text-neutral-300 font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] max-w-xl">
              <p>Five decades of generational trust from Pondicherry.</p>
              <p className="text-[#C9A227]/90 font-normal">A new chapter written in fragrance.</p>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3.5">
              {/* Primary CTA: Discover Our Story */}
              <a
                href="#heritage"
                onClick={scrollToHeritage}
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#D4AF37] text-[#0C0B0A] hover:bg-[#F3E5AB] font-sans text-xs sm:text-xs font-semibold tracking-wider uppercase shadow-[0_8px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_28px_rgba(212,175,55,0.45)] hover:scale-[1.02] active:scale-95 transition-all duration-300 group"
              >
                <span>DISCOVER OUR STORY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              {/* Secondary CTA: Explore Collection */}
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6F0] border border-white/20 hover:border-[#D4AF37]/60 backdrop-blur-md font-sans text-xs sm:text-xs font-medium tracking-wider uppercase transition-all duration-300"
              >
                <span>EXPLORE COLLECTION</span>
              </Link>
            </div>

          </motion.div>

          {/* Right Column: Natural visual space for the glowing perfume flacon */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 pointer-events-none" />

        </div>
      </div>

      {/* Bottom Center Circular Scroll Down Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 inset-x-0 flex justify-center z-20 pointer-events-auto">
        <a
          href="#heritage"
          onClick={scrollToHeritage}
          aria-label="Scroll down to heritage story"
          title="Scroll down"
          className="group flex flex-col items-center gap-1 text-neutral-400 hover:text-[#D4AF37] transition-colors duration-300 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full border border-white/30 group-hover:border-[#D4AF37] flex items-center justify-center bg-black/40 backdrop-blur-md shadow-md group-hover:scale-110 transition-all duration-300">
            <ChevronDown className="w-3.5 h-3.5 text-white/80 group-hover:text-[#D4AF37] animate-bounce" />
          </div>
        </a>
      </div>

    </section>
  );
}
