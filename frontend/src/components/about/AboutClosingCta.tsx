'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AboutClosingCta() {
  return (
    <section className="relative w-full bg-[#0C0B0A] text-[#F5F2EB] py-20 sm:py-24 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Background Golden Halo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#C9A227]/20 via-[#8A5A1B]/15 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Luxury Perfume Flacon Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[4/5] rounded-3xl overflow-hidden border border-[#C9A227]/30 shadow-2xl shadow-black group">
              <Image
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=1000"
                alt="Attar Depot luxury bespoke fragrance flacon"
                fill
                sizes="(max-width: 1024px) 80vw, 400px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Gold Label Plaque */}
              <div className="absolute bottom-6 inset-x-6 text-center">
                <div className="backdrop-blur-md bg-black/60 border border-[#C9A227]/40 px-4 py-2 rounded-xl inline-block">
                  <p className="font-serif text-sm tracking-[0.2em] font-semibold text-[#F7F4EE] uppercase">
                    ATTAR DEPOT
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative, CTA & Brand Mark */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-7"
          >
            {/* Headline */}
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-[#F7F4EE] leading-[1.08]">
              Your Story. <br />
              <span className="text-[#C9A227] italic font-normal">Your Scent.</span>
            </h2>

            {/* Narrative text */}
            <div className="space-y-1 font-sans text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-md">
              <p>Every fragrance carries a story.</p>
              <p className="text-neutral-400">Perhaps your next one starts here.</p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 px-8 sm:px-9 py-4 rounded-full bg-[#C9A227] hover:bg-[#E3B95B] text-[#0C0B0A] transition-all duration-300 font-sans text-xs sm:text-sm font-bold tracking-wider uppercase shadow-xl hover:shadow-2xl hover:scale-[1.02]"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Heritage Signature Emblem */}
            <div className="pt-6 sm:pt-8 flex flex-col items-center lg:items-start space-y-2">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#C9A227]/40" />
                <span className="font-serif text-base tracking-[0.25em] text-[#C9A227] uppercase font-semibold">
                  ATTAR DEPOT
                </span>
                <span className="w-8 h-[1px] bg-[#C9A227]/40" />
              </div>
              <p className="text-[11px] font-sans tracking-[0.25em] text-neutral-400 uppercase">
                Since 1972 • Pondicherry
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
