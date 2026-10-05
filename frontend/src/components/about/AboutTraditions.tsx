'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface TraditionCard {
  id: string;
  title: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition: string;
}

const traditions: TraditionCard[] = [
  {
    id: 'indian-attars',
    title: 'Indian Attars',
    tagline: 'A rich tradition of natural ingredients and time-honoured craftsmanship.',
    imageSrc: '/images/o2.png',
    imageAlt: 'Indian Attars - Handcrafted floral essences, velvety rose petals, and pure attar flacon',
    objectPosition: 'object-[50%_40%]',
  },
  {
    id: 'arabian-oud',
    title: 'Arabian Oud',
    tagline: 'Deep, resinous and rare, with a heritage that spans centuries.',
    imageSrc: '/images/o4.png',
    imageAlt: 'Arabian Oud - Rare aged agarwood essence, dark luxury flacon, and festive amber aura',
    objectPosition: 'object-[50%_35%]',
  },
  {
    id: 'french-fragrance',
    title: 'French Fragrances',
    tagline: 'A refined approach to perfumery, known for balance, elegance and artistry.',
    imageSrc: '/images/bannerf1.png',
    imageAlt: 'French Fragrances - Crystal perfume flacon, fresh sunlit citrus orange, and delicate neroli blossoms',
    objectPosition: 'object-[65%_50%]',
  },
];

export default function AboutTraditions() {
  return (
    <section
      id="fragrance-traditions"
      aria-label="Indian Roots. Arabian Depth. French Refinement."
      className="relative w-full bg-[#FAF7F2] py-20 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors"
    >
      {/* Subtle Warm Ambient Lighting */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-gradient-to-r from-[#C49B44]/8 via-[#98722B]/5 to-transparent blur-3xl rounded-full pointer-events-none -z-0"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-normal text-[#0E281C] tracking-tight leading-tight"
          >
            Indian Roots. Arabian Depth. French Refinement.
          </motion.h2>

          {/* Centered Antique Gold Accent Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 h-[2px] bg-[#98722B] mx-auto mt-4 rounded-full origin-center"
            aria-hidden="true"
          />
        </div>

        {/* 3 Interactive Animated Tradition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {traditions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.75,
                delay: 0.12 + index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8 }}
              className="group flex flex-col items-center text-center cursor-pointer transition-transform duration-500"
            >
              {/* Image Frame Container - Square Aspect Ratio matching reference exactly */}
              <div className="relative w-full aspect-square sm:aspect-[1/0.98] rounded-2xl overflow-hidden bg-[#ECE6DC] shadow-[0_4px_20px_-4px_rgba(14,40,28,0.06)] group-hover:shadow-[0_22px_44px_-10px_rgba(152,114,43,0.25)] border border-[#E8DFD3] group-hover:border-[#98722B]/70 transition-all duration-500">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
                  className={`object-cover scale-[1.01] group-hover:scale-108 transition-transform duration-700 ease-out ${item.objectPosition}`}
                />

                {/* Subtle Luxury Radial Vignette on hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0E281C]/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  aria-hidden="true"
                />

                {/* Subtle Gold Shimmer Border on hover */}
                <div
                  className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-[#C49B44]/0 group-hover:ring-[#C49B44]/50 transition-all duration-500 pointer-events-none"
                  aria-hidden="true"
                />
              </div>

              {/* Card Content: Title & Tagline */}
              <div className="mt-5 sm:mt-6 flex flex-col items-center px-2">
                <h3 className="font-serif text-2xl sm:text-[25px] font-normal text-[#0E281C] tracking-tight leading-snug group-hover:text-[#98722B] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="font-serif text-[15px] sm:text-base text-[#465A50] font-normal leading-[1.65] mt-2 max-w-[320px] transition-colors duration-300">
                  {item.tagline}
                </p>

                {/* Subtle micro gold indicator that expands on hover */}
                <div
                  className="w-0 group-hover:w-8 h-[1.5px] bg-[#98722B] mt-3.5 transition-all duration-500 ease-out rounded-full opacity-0 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
