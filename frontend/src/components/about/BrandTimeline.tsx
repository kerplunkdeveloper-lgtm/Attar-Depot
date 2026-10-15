'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const timelineItems = [
  {
    year: '1972',
    accent: false,
    label: 'A new chapter in comfort begins',
    body: 'Our family opened a store dedicated to beds, mattresses and pillows in Pondicherry, bringing a promise of comfort and quality to homes.',
    img: '/images/heritage-storefront.jpg',
  },
  {
    year: '1989',
    accent: false,
    label: 'The vision lived on',
    body: 'The person who shaped the foundation was no longer there, but the principles remained — quality, personal attention and trust.',
    img: '/images/heritage-family-trust.png',
  },
  {
    year: '2003 – 2004',
    accent: false,
    label: 'A test of resilience',
    body: 'The family faced profound changes. After a brief pause, the doors opened again, carried forward by the same values and the trust of our customers.',
    img: '/images/pondicherry-heritage-hd.jpg',
  },
  {
    year: 'Five Decades',
    accent: true,
    label: 'Trust, built one customer at a time',
    body: 'For more than five decades, generations of customers knew us for our quality, personal attention and dependable service.',
    img: '/images/about-hero-banner.jpg',
  },
  {
    year: 'November 2022',
    accent: false,
    label: 'The world changed',
    body: "After five decades, we closed a chapter deeply woven into our family's life. But some things don't close with a door.",
    img: '/images/heritage-reference.png',
  },
  {
    year: '2025 – 2026',
    accent: false,
    label: 'A new foundation',
    body: 'The old structure came down, something new rose in its place — the foundation for our new chapter in fragrance.',
    img: '/images/aboutbanner-new.png',
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export default function BrandTimeline() {
  return (
    <section
      id="brand-journey"
      aria-label="A Story That Spans Generations"
      className="relative w-full py-16 sm:py-20 lg:py-24 bg-[#F7F4EE] overflow-hidden border-b border-[#EAE3D5]"
    >
      {/* Subtle warm noise texture */}
      <div className="absolute inset-0 opacity-[0.018]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <motion.div {...fadeUp()} className="text-center mb-14 lg:mb-18 space-y-4">
          <div className="inline-flex items-center gap-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#C9A227]" />
            <span className="font-sans text-[10.5px] font-bold tracking-[0.42em] uppercase text-[#C9A227]">
              OUR JOURNEY
            </span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#C9A227]" />
          </div>

          <h2 className="font-serif font-normal text-[#0D1A10] tracking-[-0.02em] leading-[1.08]"
            style={{ fontSize: 'clamp(30px, 3.8vw, 52px)' }}
          >
            A Story That Spans <span className="italic">Generations</span>
          </h2>

          <p className="font-serif text-[15px] sm:text-[17px] text-[#6B6554] italic font-normal">
            Different chapters. The same values.
          </p>
        </motion.div>

        {/* ── Timeline Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-4 xl:gap-5">
          {timelineItems.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col justify-between h-full"
            >
              <div>
                {/* ── Photo ── */}
                <div
                  className={`relative w-full overflow-hidden bg-[#E5DFD0] shadow-[0_4px_20px_rgba(14,26,16,0.10)] group-hover:shadow-[0_8px_30px_rgba(14,26,16,0.18)] transition-shadow duration-500 rounded-xl ${
                    item.accent ? 'ring-2 ring-[#C9A227]/70' : ''
                  }`}
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                    className="object-cover object-center brightness-[0.88] group-hover:brightness-[0.96] group-hover:scale-[1.04] transition-all duration-700 ease-out"
                  />
                  {/* Bottom gradient on photo */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Accent badge for "Five Decades" */}
                  {item.accent && (
                    <div className="absolute inset-0 ring-2 ring-inset ring-[#C9A227]/30 rounded-xl pointer-events-none" />
                  )}
                </div>

                {/* ── Timeline dot with continuous connector ── */}
                <div className="relative flex items-center mt-4.5 mb-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full border-[1.5px] z-10 flex-shrink-0 transition-all duration-300 ${
                      item.accent
                        ? 'border-[#C9A227] bg-[#C9A227] shadow-[0_0_8px_rgba(201,162,39,0.5)]'
                        : 'border-[#C9A227]/60 bg-[#F7F4EE] group-hover:border-[#C9A227] group-hover:bg-[#C9A227]/20'
                    }`}
                  />
                  {i < timelineItems.length - 1 && (
                    <div className="hidden lg:block absolute left-2.5 right-0 h-px bg-gradient-to-r from-[#C9A227]/50 to-[#C9A227]/15 pointer-events-none" />
                  )}
                </div>

                {/* ── Year + text ── */}
                <div className="space-y-1.5 pr-1">
                  <p
                    className={`font-sans text-[10.5px] font-bold tracking-[0.18em] uppercase ${
                      item.accent ? 'text-[#C9A227]' : 'text-[#9B7E3A]'
                    }`}
                  >
                    {item.year}
                  </p>
                  <h3
                    className={`font-serif leading-snug ${
                      item.accent
                        ? 'text-[#0D1A10] text-[14px] sm:text-[15px] font-semibold'
                        : 'text-[#1B2C1E] text-[13px] sm:text-[14px] font-medium'
                    }`}
                  >
                    {item.label}
                  </h3>
                  <p className="font-sans text-[11px] sm:text-[11.5px] leading-[1.65] text-[#555042] font-light">
                    {item.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
