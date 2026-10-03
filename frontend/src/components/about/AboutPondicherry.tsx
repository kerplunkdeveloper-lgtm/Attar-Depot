'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutPondicherry() {
  return (
    <section className="w-full bg-[#08221D] text-[#F5F2EB] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px] lg:min-h-[580px] items-stretch">
        {/* Left Column: Teal / Emerald Heritage Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-20 py-16 sm:py-20 space-y-6 sm:space-y-7 relative"
        >
          {/* Subtle background radial lighting */}
          <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-[#046A5A]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6 max-w-lg">
            {/* Tag */}
            <div className="text-[#C9A227] text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              OUR HOME
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-[#F7F4EE] leading-[1.08]">
                Born in <br />
                Pondicherry.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#C9A227] tracking-wider uppercase font-medium">
                Where heritage meets modernity.
              </p>
            </div>

            {/* Narrative text */}
            <p className="font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Pondicherry brings together Indian heritage, French influence, travel and contemporary culture. It is a city that inspires curiosity, creativity and a love for the finer things in life.
            </p>

            {/* Italic statement */}
            <div className="pt-2 border-l-2 border-[#C9A227]/70 pl-4 space-y-1">
              <p className="font-serif text-lg sm:text-xl italic text-[#F7F4EE] font-light">
                Pondicherry is where we begin.
              </p>
              <p className="font-serif text-lg sm:text-xl italic text-[#C9A227] font-light">
                Not where we intend to stop.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Authentic Pondicherry French Quarter View */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative min-h-[360px] sm:min-h-[440px] lg:min-h-full w-full group overflow-hidden"
        >
          <Image
            src="/images/pondy.png"
            alt="Pondicherry French Quarter colonial yellow street with vintage bicycle"
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 lg:bg-gradient-to-r lg:from-[#08221D] lg:via-transparent lg:to-black/20 pointer-events-none" />

          {/* Location Caption Badge */}
          <div className="absolute bottom-5 right-5 sm:bottom-6 sm:right-6 bg-black/65 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[#F5F2EB] text-xs font-sans tracking-wide">
            <span className="text-[#C9A227] font-medium">White Town</span> • Pondicherry
          </div>
        </motion.div>
      </div>
    </section>
  );
}
