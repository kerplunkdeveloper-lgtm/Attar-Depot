'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Luxury Fine-line Gold Icons matching the exact reference image art style
// ============================================================================

function MemoriesIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Archway / Antique Portrait Frame */}
      <rect x="5" y="3" width="14" height="18" rx="7" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 18c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    </svg>
  );
}

function PlacesIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Compass / Atmospheric Globe */}
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4v16" strokeDasharray="1 2" opacity="0.6" />
      <path d="M4 12h16" strokeDasharray="1 2" opacity="0.6" />
      <polygon points="12,7 14.5,12 12,11 9.5,12" fill="currentColor" fillOpacity="0.4" />
      <polygon points="12,17 14.5,12 12,13 9.5,12" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

function PeopleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Cherished Loved Ones Silhouette */}
      <circle cx="10" cy="8" r="3.2" />
      <path d="M4.5 18c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5" />
      <circle cx="16.5" cy="9.5" r="2.2" opacity="0.75" />
      <path d="M15.5 14.2c1.8.3 3.5 1.8 3.5 3.8" opacity="0.75" />
    </svg>
  );
}

function MomentsIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Timeless Botanical Petal & Sparkle */}
      <path d="M12 3c-4.5 4.5-4.5 10 0 14 4.5-4 4.5-9.5 0-14z" />
      <path d="M12 7v8" opacity="0.7" />
      <path d="M17 5l1.5 1.5M18.5 5L17 6.5" opacity="0.8" strokeWidth="1.2" />
      <path d="M6 16l1 1M7 16l-1 1" opacity="0.8" strokeWidth="1.2" />
    </svg>
  );
}

function IdentityIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Cut Gem / Personal Seal */}
      <path d="M6 9l6-6 6 6-6 12-6-12z" />
      <path d="M6 9h12" />
      <path d="M12 3v18" opacity="0.5" />
      <path d="M9 9l3 12 3-12" opacity="0.7" />
    </svg>
  );
}

interface PillarItem {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const pillars: PillarItem[] = [
  {
    id: 'memories',
    name: 'MEMORIES',
    subtitle: 'Nostalgic moments treasured forever',
    icon: MemoriesIcon,
  },
  {
    id: 'places',
    name: 'PLACES',
    subtitle: 'Sacred streets, spice markets & coastlines',
    icon: PlacesIcon,
  },
  {
    id: 'people',
    name: 'PEOPLE',
    subtitle: 'The warmth and love of those we hold dear',
    icon: PeopleIcon,
  },
  {
    id: 'moments',
    name: 'MOMENTS',
    subtitle: 'Unspoken celebrations etched in scent',
    icon: MomentsIcon,
  },
  {
    id: 'identity',
    name: 'IDENTITY',
    subtitle: 'Your personal invisible aura and presence',
    icon: IdentityIcon,
  },
];

export default function FragranceBecomes() {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  return (
    <section
      id="emotion-of-scent"
      aria-label="The Emotion of Scent - Fragrance Becomes Part of Us"
      className="relative w-full min-h-[580px] sm:min-h-[520px] md:min-h-[500px] lg:min-h-[480px] xl:min-h-[540px] 2xl:min-h-[580px] flex items-center bg-[#0C0B0A] text-[#FAF6F0] overflow-hidden select-none"
    >
      {/* ========================================================================= */}
      {/* Unified Background Layer (Guaranteed positive non-zero height on all screens) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src="/images/fragrance-becomes-bg.png"
          alt="The Emotion of Scent - Fragrance Becomes Part of Us"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-[24%_center] sm:object-[28%_center] md:object-[32%_center] lg:object-center w-full h-full brightness-[1.02]"
        />

        {/* Ambient Dark Gradients to ensure pristine contrast and legibility */}
        {/* Desktop Gradients */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/45" />
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/45" />

        {/* Mobile & Tablet Gradients (slight darker tint over text area) */}
        <div className="block lg:hidden absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/65" />
        <div className="block lg:hidden absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/85" />
      </div>

      {/* ========================================================================= */}
      {/* Content Grid Container                                                    */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-14 xl:px-16 py-14 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          
          {/* Spacer Column on Desktop so text does NOT overlap the woman's face */}
          <div className="hidden lg:block lg:col-span-4 xl:col-span-4 pointer-events-none" />

          {/* Center Column: Narrative Text & Quote */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-5 sm:space-y-6 max-w-xl"
          >
            {/* Top Eyebrow */}
            <div className="text-[#C9A227] text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase font-sans">
              THE EMOTION OF SCENT
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[40px] xl:text-[46px] font-normal tracking-tight text-[#F7F4EE] leading-[1.12] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Fragrance Becomes <br />
              Part of Us.
            </h2>

            {/* Prose Paragraphs */}
            <div className="space-y-2.5 font-sans text-sm sm:text-[15px] xl:text-base text-neutral-200/90 font-light leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
              <p>A familiar perfume can bring back a memory.</p>
              <p>
                A particular scent can remind us of a place, <br className="hidden sm:inline" />
                a celebration, or someone we love.
              </p>
              <p>
                Sometimes, a scent simply feels right — <br className="hidden sm:inline" />
                even before we know why.
              </p>
            </div>

            {/* Italic Key Quote */}
            <div className="pt-2 sm:pt-3">
              <p className="font-serif text-base sm:text-lg lg:text-[19px] xl:text-[20px] italic text-[#F1E6D0] leading-snug font-light tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                We believe discovering fragrance should be <br className="hidden sm:inline" />
                just as meaningful as wearing it.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Vertical Gold Divider + 5 Scent Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 xl:col-span-3 flex items-center justify-start lg:justify-end"
          >
            <div className="flex items-stretch gap-5 sm:gap-6 w-full lg:w-auto">
              
              {/* Vertical Glowing Gold Divider (Desktop) */}
              <div className="hidden lg:flex flex-col items-center justify-between py-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-[0_0_8px_#E5C158]" />
                <div className="w-[1px] flex-1 my-2 bg-gradient-to-b from-[#C9A227] via-[#C9A227]/70 to-[#C9A227]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#E5C158] shadow-[0_0_8px_#E5C158]" />
              </div>

              {/* 5 Senses List */}
              <div className="flex flex-col space-y-3.5 sm:space-y-4 w-full">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  const isHovered = activeTooltip === pillar.id;

                  return (
                    <div
                      key={pillar.id}
                      className="relative group flex items-center gap-3.5 sm:gap-4 cursor-pointer"
                      onMouseEnter={() => setActiveTooltip(pillar.id)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${pillar.name}: ${pillar.subtitle}`}
                    >
                      {/* Circular Gold Icon Badge */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#C9A227]/75 group-hover:border-[#F3E5AB] bg-black/40 group-hover:bg-[#C9A227]/20 backdrop-blur-md flex items-center justify-center text-[#C9A227] group-hover:text-[#F3E5AB] group-hover:scale-105 group-hover:shadow-[0_0_18px_rgba(201,162,39,0.5)] transition-all duration-300 shrink-0">
                        <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                      </div>

                      {/* Label Text */}
                      <div className="flex flex-col">
                        <span className="font-sans text-xs sm:text-[13px] font-medium tracking-[0.22em] uppercase text-[#E8DFC8] group-hover:text-[#F7F4EE] transition-colors duration-300">
                          {pillar.name}
                        </span>
                        {/* Subtitle visible on mobile/tablet */}
                        <span className="block sm:hidden text-[11px] text-neutral-400 font-light">
                          {pillar.subtitle}
                        </span>
                      </div>

                      {/* Desktop Hover Floating Tooltip */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, x: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -6, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                            className="hidden lg:block absolute right-full mr-4 top-1/2 -translate-y-1/2 w-52 p-3 rounded-xl bg-black/90 backdrop-blur-md border border-[#C9A227]/40 shadow-2xl z-30 pointer-events-none"
                          >
                            <span className="text-[10px] font-semibold tracking-wider text-[#C9A227] uppercase block mb-0.5">
                              {pillar.name}
                            </span>
                            <p className="text-[11px] text-neutral-300 font-sans font-light leading-snug">
                              {pillar.subtitle}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
