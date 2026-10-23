'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MARQUEE_ITEMS = [
  'YOUR SIGNATURE SCENT',
  'ELEGANCE IN EVERY DROP',
  'LUXURY THAT LINGERS',
  'CRAFTED TO BE REMEMBERED',
  'YOUR SCENT, YOUR STORY',
];

function GoldDiamondStar({ className = 'w-3 h-3 sm:w-3.5 sm:h-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="goldStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8C6514" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
        fill="url(#goldStarGrad)"
      />
    </svg>
  );
}

function MarqueePhraseSet() {
  return (
    <div className="flex items-center gap-6 sm:gap-10 md:gap-14 lg:gap-16 pr-6 sm:pr-10 md:pr-14 lg:pr-16 shrink-0 select-none">
      {MARQUEE_ITEMS.map((text, idx) => (
        <React.Fragment key={idx}>
          <span className="font-serif text-[12.5px] min-[360px]:text-[13.5px] sm:text-[14.5px] md:text-[15.5px] lg:text-[16.5px] font-semibold tracking-[0.16em] sm:tracking-[0.22em] text-[#291A10] uppercase whitespace-nowrap transition-colors hover:text-[#012520] cursor-default drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
            {text}
          </span>
          <div className="flex items-center justify-center shrink-0 px-1">
            <GoldDiamondStar />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function HeroRibbonMarquee() {
  const [scrollDirection, setScrollDirection] = useState<'normal' | 'reverse'>('normal');
  const [isSpeedBoosted, setIsSpeedBoosted] = useState(false);

  const handleNudge = (direction: 'left' | 'right') => {
    setScrollDirection(direction === 'left' ? 'reverse' : 'normal');
    setIsSpeedBoosted(true);
    setTimeout(() => setIsSpeedBoosted(false), 3000);
  };

  return (
    <section className="relative w-full overflow-hidden select-none" aria-label="Brand Philosophy Marquee">
      {/* Background Container with Jasmine Flowers & Silk Ribbon Artwork */}
      <div className="relative w-full h-[58px] xs:h-[64px] sm:h-[74px] md:h-[80px] lg:h-[86px] flex items-center shadow-[0_4px_24px_rgba(0,0,0,0.06)] border-y border-[#D4AF37]/50 overflow-hidden bg-[#FAF6EE]">
        {/* Panoramic Botanical Flowers Artwork */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
          <Image
            src="/images/hero-marquee-bg.jpg"
            alt="Royal Jasmine & Neroli Flowers Background"
            fill
            priority
            quality={95}
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Luminous Warm Ivory Veil for Pristine Typography Contrast */}
          <div className="absolute inset-0 bg-[#FBF7EE]/45 backdrop-blur-[0.3px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBF7EE]/70 via-transparent to-[#FBF7EE]/70" />
        </div>

        {/* 24K Glowing Gold Top Rail */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E6C364] via-40% via-[#D4AF37] to-transparent shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
        {/* 24K Glowing Gold Bottom Rail */}
        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#E6C364] via-40% via-[#D4AF37] to-transparent shadow-[0_0_8px_rgba(212,175,55,0.7)]" />

        {/* Left Interactive Circular Navigation Arrow (Reference Design) */}
        <div className="absolute left-1.5 sm:left-6 md:left-8 z-20 flex items-center">
          <button
            type="button"
            onClick={() => handleNudge('left')}
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/95 hover:bg-white text-[#3E2B1D] hover:text-[#012520] shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-[#E8DFC8] flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group"
            aria-label="Scroll Marquee Left"
            title="Nudge marquee left"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Right Interactive Circular Navigation Arrow (Reference Design) */}
        <div className="absolute right-1.5 sm:right-6 md:right-8 z-20 flex items-center">
          <button
            type="button"
            onClick={() => handleNudge('right')}
            className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/95 hover:bg-white text-[#3E2B1D] hover:text-[#012520] shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-[#E8DFC8] flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group"
            aria-label="Scroll Marquee Right"
            title="Nudge marquee right"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.2} />
          </button>
        </div>

        {/* Soft Left & Right Edge Vignette Fade Masks (Compact on mobile to maximize visible reading width) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-28 md:w-36 bg-gradient-to-r from-[#FAF6EE] via-[#FAF6EE]/75 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-28 md:w-36 bg-gradient-to-l from-[#FAF6EE] via-[#FAF6EE]/75 to-transparent z-10" />

        {/* Hardware-Accelerated 60fps Infinite Marquee Track */}
        <div className="relative w-full flex items-center overflow-hidden">
          <div
            className={`hero-marquee-track flex items-center shrink-0 ${
              scrollDirection === 'reverse' ? 'marquee-reverse' : 'marquee-forward'
            } ${isSpeedBoosted ? 'marquee-boosted' : ''}`}
          >
            {/* 4 sets of phrases for seamless 360 loop across all screen sizes */}
            <MarqueePhraseSet />
            <MarqueePhraseSet />
            <MarqueePhraseSet />
            <MarqueePhraseSet />
          </div>
        </div>
      </div>

      {/* Pure CSS Smooth Infinite Marquee Animation with Pause on Hover */}
      <style jsx>{`
        @keyframes infiniteHeroMarqueeLeft {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes infiniteHeroMarqueeRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        .hero-marquee-track {
          display: flex;
          align-items: center;
          width: max-content;
          will-change: transform;
        }
        .marquee-forward {
          animation: infiniteHeroMarqueeLeft 36s linear infinite;
        }
        .marquee-reverse {
          animation: infiniteHeroMarqueeRight 36s linear infinite;
        }
        .hero-marquee-track.marquee-boosted {
          animation-duration: 16s !important;
        }
        .hero-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .marquee-forward,
          .marquee-reverse {
            animation-duration: 26s;
          }
        }
      `}</style>
    </section>
  );
}
