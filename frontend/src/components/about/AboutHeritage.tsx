'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function AboutHeritage() {
  return (
    <section
      id="heritage"
      aria-label="Our Heritage - A Family Legacy of Trust"
      className="relative w-full  text-[#142A20] overflow-hidden select-none "
    >
      <div className="">
        
        {/* ========================================================================= */}
        {/* DESKTOP PANORAMIC SPLIT LAYOUT (HD Image Left, Rich Typography Right)     */}
        {/* ========================================================================= */}
        <div className="hidden lg:block relative w-full  overflow-hidden shadow-[0_20px_50px_rgba(20,40,30,0.08)] border border-[#E8DEC9]/90 bg-[#FAF7F2]">
          <div className="relative w-full min-h-[460px] xl:min-h-[500px] grid grid-cols-12 items-stretch">
            
            {/* Left 58%: Pure HD Pondicherry Colonial Street Photography */}
            <div className="col-span-7 xl:col-span-7 relative min-h-[460px] xl:min-h-[500px] overflow-hidden">
              <Image
                src="/images/pondicherry-heritage-hd.jpg"
                alt="Attar Depot Heritage 1972 - Pondicherry French Quarter Street"
                fill
                priority
                unoptimized
                sizes="(max-width: 1200px) 60vw, 800px"
                className="object-cover object-[20%_center] w-full h-full brightness-[1.01] contrast-[1.02]"
              />
            </div>

            {/* Right 42%: Editorial Typography on Warm Cream Canvas */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-5 xl:col-span-5 relative z-10 flex flex-col items-start justify-center px-8 xl:px-12 py-10 space-y-5 bg-[#FAF7F2]"
            >
              {/* Eyebrow Label: PONDICHERRY • SINCE 1972 */}
              <div className="inline-flex items-center gap-2">
                <span className="text-[#98722B] text-xs font-semibold tracking-[0.28em] uppercase font-sans">
                  PONDICHERRY • SINCE 1972
                </span>
              </div>

              {/* Main Headline: A Family Legacy of Trust */}
              <h2 className="font-serif text-[40px] xl:text-[46px] 2xl:text-[50px] font-normal tracking-[-0.015em] text-[#0E281C] leading-[1.12]">
                A Family Legacy <br />
                of Trust
              </h2>

              {/* Story Narrative Paragraph 1 */}
              <p className="font-serif text-[15px] xl:text-[16px] text-[#2F4037] font-normal leading-[1.7] max-w-[460px]">
                Our family&apos;s journey in Pondicherry began in 1972, with a store dedicated to beds, mattresses and pillows. For more than five decades, customers came to know us for quality, personal attention and dependable service.
              </p>

              {/* Story Narrative Paragraph 2 */}
              <p className="font-serif text-[15px] xl:text-[16px] text-[#143023] font-normal leading-[1.65] max-w-[460px]">
                Those values now guide a new chapter in fragrance.
              </p>

              {/* Warm Golden Accent Divider Line */}
              <div className="pt-2">
                <div className="w-14 h-[2px] bg-[#98722B] rounded-full" />
              </div>
            </motion.div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE & TABLET RESPONSIVE LAYOUT (HD Image on Top, Typography Below)     */}
        {/* ========================================================================= */}
        <div className="block lg:hidden w-full space-y-6 sm:space-y-8">
          
          {/* Pondicherry Heritage HD Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7 }}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(20,40,30,0.1)] border border-[#E8DEC9]/90 bg-[#FAF7F2]"
          >
            <Image
              src="/images/pondicherry-heritage-hd.jpg"
              alt="Attar Depot Heritage 1972 - Pondicherry French Quarter Street"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-[20%_center] w-full h-full brightness-[1.01] contrast-[1.02]"
            />
            {/* Subtle inner border sheen */}
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-2xl pointer-events-none" />
          </motion.div>

          {/* Typography Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col items-start space-y-4 px-1"
          >
            {/* Eyebrow Label */}
            <span className="text-[#98722B] text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              PONDICHERRY • SINCE 1972
            </span>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#0E281C] leading-[1.15]">
              A Family Legacy <br />
              of Trust
            </h2>

            {/* Paragraph 1 */}
            <p className="font-serif text-[15px] sm:text-base text-[#2F4037] leading-relaxed">
              Our family&apos;s journey in Pondicherry began in 1972, with a store dedicated to beds, mattresses and pillows. For more than five decades, customers came to know us for quality, personal attention and dependable service.
            </p>

            {/* Paragraph 2 */}
            <p className="font-serif text-[15px] sm:text-base text-[#143023] leading-relaxed">
              Those values now guide a new chapter in fragrance.
            </p>

            {/* Accent Line */}
            <div className="pt-2">
              <div className="w-14 h-[2px] bg-[#98722B] rounded-full" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
