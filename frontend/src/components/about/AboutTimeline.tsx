'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TimelineMilestone {
  period: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const milestones: TimelineMilestone[] = [
  {
    period: '1972',
    title: 'The Beginning',
    description: 'A family business in Pondicherry',
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&q=80&w=350',
    alt: '1972 - The Beginning in Pondicherry',
  },
  {
    period: '50+ Years',
    title: 'A Legacy of Trust',
    description: 'Generation after generation of customers',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=350',
    alt: '50+ Years - Generation after generation of customers',
  },
  {
    period: 'A New Passion',
    title: 'Attars • Oud • Fine Fragrance',
    description: 'A growing fascination with the world of scents',
    image: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?auto=format&fit=crop&q=80&w=350',
    alt: 'A New Passion - Attars, Oud, and Fine Fragrance',
  },
  {
    period: 'Today',
    title: 'The Attar Depot',
    description: 'Bringing our passion to life in Pondicherry',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=350',
    alt: 'Today - The Attar Depot in Pondicherry',
  },
  {
    period: 'Tomorrow',
    title: 'A Fragrance House',
    description: 'Beyond a single location, to new possibilities',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=350',
    alt: 'Tomorrow - A Fragrance House beyond single location',
  },
];

export default function AboutTimeline() {
  return (
    <section className="w-full bg-transparent pb-20 sm:pb-24 md:pb-28 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Subtitle */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[#8C7355] text-xs font-semibold tracking-[0.3em] uppercase font-sans">
            A JOURNEY THROUGH TIME
          </p>
        </div>

        {/* Desktop & Large Tablet Horizontal Timeline */}
        <div className="hidden md:block relative">
          {/* Continuous Golden Connecting Line */}
          <div className="absolute top-[48px] left-[10%] right-[10%] h-[1.5px] bg-gradient-to-r from-[#D9C4A0]/40 via-[#C9A227] to-[#D9C4A0]/40 z-0" />

          {/* 5 Milestone Nodes Grid */}
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {milestones.map((item, idx) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Milestone Node Circle */}
                <div className="relative mb-5">
                  {/* Subtle Node Ring */}
                  <div className="w-24 h-24 rounded-full p-1 bg-white/30 backdrop-blur-sm border-2 border-[#D9C4A0] group-hover:border-[#C9A227] shadow-md group-hover:shadow-lg transition-all duration-300">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-200">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="100px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                      {/* Sepia / warm overlay */}
                      <div className="absolute inset-0 bg-[#C9A227]/10 mix-blend-color group-hover:opacity-0 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Golden Center Indicator Dot */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#C9A227] border-2 border-white shadow-sm" />
                </div>

                {/* Period Tag */}
                <span className="font-serif text-lg lg:text-xl font-bold text-[#161412] tracking-tight mb-1">
                  {item.period}
                </span>

                {/* Title */}
                <h3 className="font-sans text-xs lg:text-sm font-semibold text-[#8C7355] uppercase tracking-wider mb-1.5">
                  {item.title}
                </h3>

                {/* Subtitle / Description */}
                <p className="font-sans text-xs text-neutral-600 font-light leading-relaxed max-w-[170px]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile & Small Tablet Responsive Flow */}
        <div className="md:hidden relative">
          {/* Vertical Golden Connecting Line */}
          <div className="absolute top-6 bottom-6 left-12 w-[1.5px] bg-gradient-to-b from-[#C9A227] via-[#D9C4A0] to-[#C9A227] z-0" />

          <div className="space-y-8 relative z-10">
            {milestones.map((item, idx) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="flex items-center gap-5 group"
              >
                {/* Node Circle */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full p-1 bg-white/30 backdrop-blur-sm border-2 border-[#D9C4A0] group-hover:border-[#C9A227] shadow-md transition-all duration-300">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-200">
                      <Image
                        src={item.image}
                        alt={item.alt}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  {/* Indicator Dot */}
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#C9A227] border-2 border-white shadow-sm" />
                </div>

                {/* Text Content */}
                <div className="flex-1 pr-2">
                  <span className="font-serif text-lg font-bold text-[#161412] block">
                    {item.period}
                  </span>
                  <h3 className="font-sans text-xs font-semibold text-[#8C7355] uppercase tracking-wider mt-0.5">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 font-light mt-1 leading-snug">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
