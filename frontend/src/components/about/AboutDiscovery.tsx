'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface DiscoveryCard {
  title: string;
  tagline: string;
  image: string;
  filter: string;
  alt: string;
}

const discoveryCards: DiscoveryCard[] = [
  {
    title: 'Everyday',
    tagline: 'Something subtle. Something you.',
    image: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&q=80&w=500',
    filter: 'everyday',
    alt: 'Everyday fresh subtle citrus and tea notes',
  },
  {
    title: 'Distinctive',
    tagline: 'Something that stands apart.',
    image: 'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?auto=format&fit=crop&q=80&w=500',
    filter: 'distinctive',
    alt: 'Distinctive aged oud and rare woods',
  },
  {
    title: 'Occasion',
    tagline: 'Something memorable.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=500',
    filter: 'occasion',
    alt: 'Occasion royal damask rose and floral bouquet',
  },
  {
    title: 'Explore',
    tagline: 'Something completely new.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=500',
    filter: 'explore',
    alt: 'Explore warm amber and rare artisanal accords',
  },
];

export default function AboutDiscovery() {
  return (
    <section className="w-full py-20 sm:py-24 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 text-[#1F1C18]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <p className="text-[#8C7355] text-xs font-semibold tracking-[0.3em] uppercase font-sans">
            YOUR FRAGRANCE JOURNEY
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#161412]">
            Find What Feels Like You.
          </h2>
        </div>

        {/* Main Grid: 4 Cards on Left, Discover Callout on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* 4 Cards Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {discoveryCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group relative bg-white/40 backdrop-blur-md rounded-2xl overflow-hidden border border-neutral-300/70 hover:border-[#C9A227] hover:bg-white/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/5">
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                    className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Content */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#161412] mb-1">
                      {card.title}
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs text-neutral-500 font-light leading-snug">
                      {card.tagline}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Callout Box */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-4 flex flex-col justify-center space-y-6 lg:pl-6"
          >
            <div className="space-y-3">
              <p className="font-sans text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
                We don&apos;t want to tell you what fragrance you should wear.
              </p>
              <p className="font-serif text-xl sm:text-2xl italic text-[#161412] font-normal leading-snug">
                &ldquo;We want to help you discover the one that feels like you.&rdquo;
              </p>
            </div>

            <div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 px-7 py-3.5 sm:py-4 rounded-full bg-[#08221D] hover:bg-[#046A5A] text-[#F7F4EE] transition-all duration-300 font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-lg hover:shadow-xl hover:scale-[1.02]"
              >
                <span>EXPLORE FRAGRANCES</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
