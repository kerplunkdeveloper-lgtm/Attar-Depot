'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Gem, Users, Heart } from 'lucide-react';

const values = [
  {
    num: '01',
    icon: Gem,
    title: 'Quality',
    description: 'Never compromise on what we offer.',
  },
  {
    num: '02',
    icon: Users,
    title: 'Trust',
    description: 'Earn it through every interaction.',
  },
  {
    num: '03',
    icon: Heart,
    title: 'People',
    description: 'Put the customer at the heart of everything.',
  },
];

export default function AboutValues() {
  return (
    <section 
      id="values"
      aria-label="Our Values - Attar Depot"
      className="relative w-full min-h-[640px] lg:min-h-[700px] flex items-center bg-[#0C0B0A] text-[#F5F2EB] py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background Image: Aromatic Oud Wood, Smoke & Brass Censer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
        <Image
          src="/images/overvalues.png"
          alt="Our Values - Artisanal Oud Wood and Pure Distillations"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[75%_center] sm:object-[70%_center] md:object-[65%_center] lg:object-right w-full h-full brightness-[0.88] contrast-[1.05]"
        />

        {/* Cinematic Vignettes & Gradients for Guaranteed Readability */}
        {/* Left-to-right fade so left content is clear while right incense visual glows */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C0B0A]/95 via-[#0C0B0A]/85 to-[#0C0B0A]/30 lg:to-transparent" />
        
        {/* Top and Bottom soft fades to blend with adjacent sections */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0C0B0A] via-[#0C0B0A]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0C0B0A] via-[#0C0B0A]/70 to-transparent" />
        
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-1/4 left-1/4 w-[420px] h-[420px] rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* Content Column: Heading, Cards & Signature Belief */}
          <div className="lg:col-span-8 xl:col-span-7 flex flex-col space-y-8 sm:space-y-10">
            {/* Eyebrow Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-[#C9A227] text-xs font-semibold tracking-[0.28em] uppercase font-sans"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
              <span>OUR VALUES</span>
            </motion.div>

            {/* Headline & Narrative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-4"
            >
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl  font-normal tracking-tight text-[#F7F4EE] leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                The Products Changed. <br />
                The Values Didn&apos;t.
              </h2>
              <p className="font-sans text-sm sm:text-base text-neutral-300 max-w-xl font-light leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                While the products may be different, the values we have always stood for remain the same.
              </p>
            </motion.div>

            {/* 3 Value Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-2">
              {values.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <motion.div
                    key={val.num}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.15 + idx * 0.1 }}
                    className="relative group p-6  sm:p-7 rounded-2xl bg-black/60 border border-[#C9A227]/30 hover:border-[#C9A227]/75 backdrop-blur-md transition-all duration-300 flex flex-col items-start hover:-translate-y-1 shadow-2xl hover:shadow-[0_12px_32px_rgba(201,162,39,0.15)]"
                  >
                    {/* Number Badge */}
                    <span className="font-mono text-xl text-[#C9A227] text-center   font-semibold tracking-widest mb-4">
                      {val.num}
                    </span>

                    {/* Icon */}
                    <div className="w-13 h-13  flex items-center justify-center text-[#C9A227] group-hover:scale-110 group-hover:bg-[#C9A227]/15 group-hover:border-[#C9A227]/60 transition-all duration-300 mb-5">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#F7F4EE] mb-2 tracking-wide">
                      {val.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-sm  text-neutral-300/90 font-light leading-relaxed">
                      {val.description}
                    </p>

                    {/* Subtle corner golden accent */}
                    <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#C9A227]/40 group-hover:bg-[#C9A227] transition-colors" />
                  </motion.div>
                );
              })}
            </div>

            {/* Signature Statement */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4 border-t border-neutral-800/80 max-w-xl"
            >
              <p className="font-serif text-xl sm:text-2xl md:text-3xl italic text-[#C9A227] font-light leading-snug drop-shadow-md">
                &ldquo;Never compromise on quality. <br />
                Never compromise on the customer.&rdquo;
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
