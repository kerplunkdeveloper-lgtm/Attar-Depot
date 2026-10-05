'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

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
      aria-label="About Attar Depot - A Fragrance Discovery House"
      className="relative w-full bg-[#F7F3EE] text-[#142A20] overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* DESKTOP & WIDE SCREEN PANORAMIC LAYOUT (Exact Reference Match)           */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative w-full min-h-[460px] xl:min-h-[520px] 2xl:min-h-[580px]">
        {/* Full-bleed Photography Canvas */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/images/about-hero-clean.jpg"
            alt="The Attar Depot - A Fragrance Discovery House"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-right xl:object-center w-full h-full brightness-[1.01] contrast-[1.02]"
          />

          {/* Natural luxury cream shade across left content area */}
          <div className="absolute inset-y-0 left-0 w-full sm:w-[75%] md:w-[68%] lg:w-[64%] xl:w-[58%] bg-gradient-to-r from-[#F7F3EE] via-[#F7F3EE] via-45% to-transparent pointer-events-none z-[1]" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto h-full min-h-[460px] xl:min-h-[520px] 2xl:min-h-[580px] px-8 md:px-12 lg:px-16 flex items-center">
          <div className="w-full grid grid-cols-12 items-center">
            
            {/* Left Column: Brand Manifesto & Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative col-span-7 xl:col-span-6 flex flex-col items-start space-y-5 lg:space-y-6 max-w-xl py-10 lg:py-12"
            >
              {/* Soft ambient blur backing directly under text for guaranteed crisp contrast */}
              <div className="absolute -inset-6 -left-8 bg-gradient-to-r from-[#F7F3EE] via-[#F7F3EE]/90 to-transparent backdrop-blur-[2px] rounded-3xl -z-10 pointer-events-none" />

              {/* Eyebrow Label: OUR BRAND */}
              <div className="inline-flex items-center gap-2">
                <span className="text-[#98722B] text-[11px] xl:text-[12px] font-semibold tracking-[0.28em] uppercase font-sans">
                  OUR BRAND
                </span>
              </div>

              {/* Main Headline: A Fragrance Discovery House */}
              <h1 className="font-serif text-[42px] xl:text-[50px] 2xl:text-[56px] font-normal tracking-[-0.015em] text-[#0E281C] leading-[1.12]">
                A Fragrance <br />
                Discovery House
              </h1>

              {/* Description Paragraph */}
              <p className="font-serif text-[15px] xl:text-[17px] text-[#2E3F36] font-normal leading-[1.65] max-w-[430px]">
                Fragrance can bring back a memory, remind you of someone, or simply feel right before you know why.
              </p>

              {/* Primary Call to Action Button */}
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="group inline-flex items-center gap-2.5 px-6 xl:px-7 py-3 rounded-[6px] bg-[#0E281C] text-[#F7F4EE] hover:bg-[#163828] border border-[#0E281C] hover:border-[#98722B]/60 shadow-[0_4px_14px_rgba(14,40,28,0.25)] hover:shadow-[0_8px_24px_rgba(14,40,28,0.35)] transition-all duration-300 font-sans text-xs sm:text-[13px] font-medium tracking-wide"
                >
                  <span>Explore Our Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F7F4EE] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Visual room for the perfume bottles, citrus & figs */}
            <div className="col-span-5 xl:col-span-6 pointer-events-none" />

          </div>
        </div>

        {/* Scroll down indicator to heritage section */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <a
            href="#heritage"
            onClick={scrollToHeritage}
            aria-label="Scroll to our heritage"
            className="group flex flex-col items-center gap-1 text-[#3D4F46]/60 hover:text-[#122E22] transition-colors duration-300"
          >
            <div className="w-7 h-7 rounded-full border border-[#122E22]/20 group-hover:border-[#122E22]/60 flex items-center justify-center bg-white/70 backdrop-blur-sm shadow-sm group-hover:scale-105 transition-all duration-300">
              <ChevronDown className="w-3.5 h-3.5 text-[#122E22] animate-bounce" />
            </div>
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE & TABLET RESPONSIVE LAYOUT (Optimized for Small & Medium Screens)  */}
      {/* ========================================================================= */}
      <div className="block lg:hidden w-full px-5 sm:px-8 py-8 sm:py-12 bg-gradient-to-b from-[#F7F3EE] via-[#F4EFE6] to-[#ECE5D8]">
        <div className="max-w-xl mx-auto flex flex-col space-y-6 sm:space-y-8">
          
          {/* Visual Showcase Card with Responsive Crop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative w-full h-[240px] sm:h-[320px] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(20,40,30,0.12)] border border-[#E4DCCE]/80"
          >
            <Image
              src="/images/about-hero-clean.jpg"
              alt="The Attar Depot Luxury Fragrances"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[80%_center] w-full h-full brightness-[1.01]"
            />
            {/* Soft border inner sheen */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col items-start space-y-4"
          >
            {/* Eyebrow Label */}
            <span className="text-[#A2823D] text-[11px] font-semibold tracking-[0.25em] uppercase font-sans">
              OUR BRAND
            </span>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#122E22] leading-[1.15]">
              A Fragrance <br />
              Discovery House
            </h1>

            {/* Description */}
            <p className="font-serif text-[15px] sm:text-base text-[#3D4F46] leading-relaxed">
              Fragrance can bring back a memory, remind you of someone, or simply feel right before you know why.
            </p>

            {/* CTA Button */}
            <div className="pt-2 w-full sm:w-auto">
              <Link
                href="/shop"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[6px] bg-[#122B20] text-[#F5F2EA] hover:bg-[#183B2C] border border-[#122B20] shadow-[0_4px_14px_rgba(18,43,32,0.22)] transition-all duration-300 font-sans text-xs sm:text-sm font-medium tracking-wide active:scale-[0.98]"
              >
                <span>Explore Our Collection</span>
                <ArrowRight className="w-4 h-4 text-[#F5F2EA] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
