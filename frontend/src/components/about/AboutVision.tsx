'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Store, Monitor, Gift, Sparkles } from 'lucide-react';

const visionPillars = [
  {
    icon: Store,
    title: 'Stores',
    description: 'Physical fragrance experiences',
  },
  {
    icon: Monitor,
    title: 'Digital',
    description: 'A modern discovery experience',
  },
  {
    icon: Gift,
    title: 'Gifting',
    description: 'Fragrance for meaningful moments',
  },
  {
    icon: Sparkles,
    title: 'Signature Creations',
    description: 'Our own future fragrances',
  },
];

export default function AboutVision() {
  return (
    <section className="w-full bg-transparent py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 text-[#1F1C18]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col space-y-6"
          >
            {/* Tag */}
            <div className="text-[#8C7355] text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              OUR VISION
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#161412] leading-[1.12]">
              From One City <br />
              To A Fragrance House.
            </h2>

            {/* Description */}
            <p className="font-sans text-sm sm:text-base text-neutral-700 font-light leading-relaxed">
              Our ambition is to build a fragrance house that grows beyond a single location — through our stores, digital experience, gifting, personalised fragrance discovery and our own signature creations.
            </p>
          </motion.div>

          {/* Right Column: 4 Pillar Cards */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {visionPillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="p-5 sm:p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-neutral-300/70 hover:border-[#C9A227] hover:bg-white/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-black/5 group-hover:bg-[#C9A227]/15 text-[#8C7355] group-hover:text-[#845717] flex items-center justify-center transition-colors duration-300 mb-4">
                    <IconComp className="w-5 h-5" />
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#161412] mb-1.5 tracking-wide">
                    {pillar.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs text-neutral-500 font-light leading-snug">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
