import React from 'react';
import type { Metadata } from 'next';
import AboutHero from '@/components/about/AboutHero';
import AboutHeritage from '@/components/about/AboutHeritage';
import AboutValues from '@/components/about/AboutValues';
import AboutCategories from '@/components/about/AboutCategories';
import FragranceBecomes from '@/components/about/FragranceBecomes';
import AboutPondicherry from '@/components/about/AboutPondicherry';
import AboutVision from '@/components/about/AboutVision';
import AboutDiscovery from '@/components/about/AboutDiscovery';
import AboutClosingCta from '@/components/about/AboutClosingCta';

export const metadata: Metadata = {
  title: 'Our Story | Attar Depot - Since 1972 • Pondicherry',
  description:
    'Discover the journey of Attar Depot. From five decades of generational trust in Pondicherry to a world of pure artisanal attars, aged oud, and fine fragrances.',
  keywords:
    'Attar Depot Story, Pondicherry Perfume House, Heritage Attar, 1972 Pondicherry, Pure Perfume Oil, Artisanal Agarwood, Oud Pondicherry',
  openGraph: {
    title: 'Our Story | Attar Depot - Since 1972 • Pondicherry',
    description:
      'Five decades of trust from Pondicherry. A new chapter written in fragrance.',
    url: 'https://attardepot.com/about',
    siteName: 'Attar Depot',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=85&w=1200',
        width: 1200,
        height: 630,
        alt: 'Attar Depot - A Legacy of Trust, A New World of Fragrance',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <article className="w-full min-h-screen bg-transparent text-neutral-900 overflow-x-hidden selection:bg-[#C9A227] selection:text-black">
      {/* 0. Hero Banner Section: A Legacy of Trust, A New World of Fragrance */}
      <AboutHero />

      {/* 1. Heritage & Timeline Section: It Began With Trust */}
      <AboutHeritage />

      {/* 4. Values Section: The Products Changed. The Values Didn't. */}
      <AboutValues />

      {/* 5. Passion & Categories Section: A New Chapter In Fragrance */}
      <AboutCategories />

      {/* 5b. Emotion of Scent: Fragrance Becomes Part of Us */}
      <FragranceBecomes />

      {/* 6. Pondicherry Origin Section: Born in Pondicherry */}
      <AboutPondicherry />

      {/* 7. Vision Section: From One City To A Fragrance House */}
      <AboutVision />

      {/* 8. Discovery Section: Find What Feels Like You */}
      <AboutDiscovery />

      {/* 9. Closing Luxury CTA: Your Story. Your Scent. */}
      <AboutClosingCta />
    </article>
  );
}
