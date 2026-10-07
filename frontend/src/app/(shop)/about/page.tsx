import React from 'react';
import type { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import BrandHero from '@/components/about/BrandHero';
import BrandTimeline from '@/components/about/BrandTimeline';
import BrandValues from '@/components/about/BrandValues';
import BrandToday from '@/components/about/BrandToday';
import BrandTomorrow from '@/components/about/BrandTomorrow';

// Auto-sync uploaded hero image and today image into public directory
try {
  const heroSource =
    'C:/Users/Admin/.gemini/antigravity-ide/brain/9ff7d09c-6a49-4261-b6b4-8f7719475bd2/.user_uploaded/media_1791349681572.png';
  const heroDest = path.join(process.cwd(), 'public', 'images', 'brand-hero-attar.png');
  if (fs.existsSync(heroSource)) {
    fs.copyFileSync(heroSource, heroDest);
  }

  const todaySource =
    'C:/Users/Admin/.gemini/antigravity-ide/brain/9ff7d09c-6a49-4261-b6b4-8f7719475bd2/.user_uploaded/media_1791350423146.png';
  const todayDest = path.join(process.cwd(), 'public', 'images', 'brand-today-storefront.png');
  if (fs.existsSync(todaySource)) {
    fs.copyFileSync(todaySource, todayDest);
  }

  const tomorrowSource =
    'C:/Users/Admin/.gemini/antigravity-ide/brain/9ff7d09c-6a49-4261-b6b4-8f7719475bd2/.user_uploaded/media_1791351206831.png';
  const tomorrowDest = path.join(process.cwd(), 'public', 'images', 'brand-tomorrow-arch.png');
  if (fs.existsSync(tomorrowSource)) {
    fs.copyFileSync(tomorrowSource, tomorrowDest);
  }
} catch {
  // Silent fallback
}

export const metadata: Metadata = {
  title: 'Our Brand — A Legacy of Trust | Attar Depot',
  description:
    'A Legacy of Trust. A New World of Fragrance. The same values that earned generations of trust in Pondicherry now find a new expression in fragrance.',
  keywords:
    'Attar Depot, Our Brand, Pondicherry Heritage, Fragrance House, Legacy, Trust, Artisanal Attar',
  openGraph: {
    title: 'Our Brand — A Legacy of Trust | Attar Depot',
    description:
      'A Legacy of Trust. A New World of Fragrance. Explore the story of The Attar Depot.',
    url: 'https://attardepot.com/about',
    siteName: 'Attar Depot',
    images: [
      {
        url: '/images/about-hero-clean.jpg',
        width: 1200,
        height: 630,
        alt: 'The Attar Depot — A Legacy of Trust',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-[#F7F4EE] text-neutral-900 overflow-x-hidden selection:bg-[#C9A227]/30 selection:text-[#0E1C12]">
      {/* 1. Hero: A Legacy of Trust. A New World of Fragrance. */}
      <BrandHero />

      {/* 2. Journey Timeline: A Story That Spans Generations */}
      <BrandTimeline />

      {/* 3. Values: The Values Remain */}
      <BrandValues />

      {/* 4. Today: The Attar Depot */}
      <BrandToday />

      {/* 5. Tomorrow: A Fragrance House */}
      <BrandTomorrow />
    </main>
  );
}
