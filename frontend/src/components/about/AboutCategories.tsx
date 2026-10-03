'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CategoryCard {
  title: string;
  tagline: string;
  image: string;
  href: string;
  alt: string;
}

const categories: CategoryCard[] = [
  {
    title: 'ATTAR',
    tagline: 'Pure. Traditional. Timeless.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    href: '/shop?category=attar',
    alt: 'Traditional Pure Concentrated Attar Perfume Oil',
  },
  {
    title: 'OUD',
    tagline: 'Rare. Rich. Distinctive.',
    image: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?auto=format&fit=crop&q=80&w=800',
    href: '/shop?category=oud',
    alt: 'Rare Aged Agarwood Dehn Al Oudh',
  },
  {
    title: 'PERFUME',
    tagline: 'Modern. Refined. For Every You.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    href: '/shop?category=perfume',
    alt: 'Modern Refined Eau De Parfum and Artisanal Scents',
  },
];

export default function AboutCategories() {
  return (
    <section className="w-full  backdrop-blur-[1px] py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 text-[#1F1C18]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* Left Column: Narrative & CTA */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col space-y-6 sm:space-y-7"
          >
            {/* Tag */}
            <div className="text-[#8C7355] text-xs font-semibold tracking-[0.25em] uppercase font-sans">
              OUR PASSION
            </div>

            {/* Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#161412] leading-[1.12]">
              A New Chapter <br />
              In Fragrance.
            </h2>

            {/* Narrative text */}
            <div className="space-y-4 font-sans text-sm sm:text-base text-neutral-700 font-light leading-relaxed">
              <p>
                Our fascination with attars, oud and fine fragrances grew from a simple appreciation for beautiful scents into a deeper curiosity about the traditions, craftsmanship and artistry behind them.
              </p>
              <p>
                And so, <strong className="font-medium text-[#161412]">The Attar Depot</strong> was born. <br />
                Not as a departure from our past, <br />
                but as an extension of what we&apos;ve always believed in.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0C0B0A] hover:bg-[#046A5A] text-[#F7F4EE] transition-all duration-300 font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-xl hover:shadow-2xl hover:scale-[1.02]"
              >
                <span>EXPLORE OUR COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          {/* Right Column: 3 Vertical Category Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: idx * 0.15 }}
                className="relative"
              >
                <Link
                  href={cat.href}
                  className="group relative block w-full aspect-[9/16] sm:aspect-[3/5] rounded-3xl overflow-hidden border border-neutral-300/80 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  {/* Category Image */}
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 240px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Vignette Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 group-hover:via-black/20 transition-all duration-500" />

                  {/* Top Text Content (Title & Tagline) */}
                  <div className="absolute inset-x-0 top-6 px-4 text-center">
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.2em] text-[#F7F4EE] uppercase group-hover:text-[#C9A227] transition-colors duration-300">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs text-neutral-300 font-light mt-1 tracking-wide">
                      {cat.tagline}
                    </p>
                  </div>

                  {/* Bottom Hover Action Indicator */}
                  <div className="absolute bottom-5 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-sans font-medium uppercase tracking-widest text-[#C9A227] bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C9A227]/40">
                      Discover <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
