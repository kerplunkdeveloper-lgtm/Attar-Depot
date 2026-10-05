import React from 'react';
import type { Metadata } from 'next';
import { ensureAboutBanner } from '@/lib/ensureAboutBanner';
import AboutHero from '@/components/about/AboutHero';
import AboutRibbonMarquee from '@/components/about/AboutRibbonMarquee';
import AboutHeritage from '@/components/about/AboutHeritage';
import AboutMeaning from '@/components/about/AboutMeaning';
import AboutTraditions from '@/components/about/AboutTraditions';
import AboutValues from '@/components/about/AboutValues';
import AboutCategories from '@/components/about/AboutCategories';
import FragranceBecomes from '@/components/about/FragranceBecomes';
import AboutVision from '@/components/about/AboutVision';
import AboutDiscovery from '@/components/about/AboutDiscovery';
import AboutClosingCta from '@/components/about/AboutClosingCta';

export const metadata: Metadata = {
  title: 'Our Brand - A Fragrance Discovery House | Attar Depot',
  description:
    'Fragrance can bring back a memory, remind you of someone, or simply feel right before you know why. Explore our collection of pure artisanal attars, aged oud, and fine fragrances.',
  keywords:
    'Attar Depot, Fragrance Discovery House, Pondicherry Perfume House, Heritage Attar, Pure Perfume Oil, Artisanal Agarwood, Oud Pondicherry',
  openGraph: {
    title: 'A Fragrance Discovery House | Attar Depot',
    description:
      'Fragrance can bring back a memory, remind you of someone, or simply feel right before you know why.',
    url: 'https://attardepot.com/about',
    siteName: 'Attar Depot',
    images: [
      {
        url: '/images/about-hero-clean.jpg',
        width: 1200,
        height: 630,
        alt: 'The Attar Depot - A Fragrance Discovery House',
      },
    ],
  },
};

export default function AboutPage() {
  ensureAboutBanner();

  return (
    <article className="w-full min-h-screen bg-transparent text-neutral-900 overflow-x-hidden selection:bg-[#C9A227] selection:text-black">
      {/* 0. Hero Banner Section: A Fragrance Discovery House (Reference Design) */}
      <AboutHero />

      {/* 1. Heritage Section: A Family Legacy of Trust (Pondicherry Since 1972) */}
      <AboutHeritage />

      {/* 2. Brand Identity: The Meaning Behind Our Name (Reference Design) */}
      <AboutMeaning />

      {/* 3. Three Fragrance Traditions: Indian Roots. Arabian Depth. French Refinement. (Reference Design) */}
      <AboutTraditions />

      {/* 4. Values Section: The Products Changed. The Values Didn't. */}
      <AboutValues />

      {/* 5. Passion & Categories Section: A New Chapter In Fragrance */}
      <AboutCategories />

      {/* 5b. Emotion of Scent: Fragrance Becomes Part of Us */}
      <FragranceBecomes />

      {/* 7. Vision Section: From One City To A Fragrance House */}
      <AboutVision />

      {/* 8. Discovery Section: Find What Feels Like You */}
      <AboutDiscovery />

      {/* 9. Closing Luxury CTA: Your Story. Your Scent. */}
      <AboutClosingCta />
    </article>
  );
}
