'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// --- Custom Luxury 24k Gold SVG Icons ---

function FlowerIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flowerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C89218" />
        </linearGradient>
        <filter id="goldGlowFlower" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter="url(#goldGlowFlower)">
        {/* 5 Organic Jasmine Petals */}
        <circle cx="12" cy="6.8" r="3.4" fill="url(#flowerGoldGrad)" opacity="0.95" />
        <circle cx="17" cy="10.4" r="3.4" fill="url(#flowerGoldGrad)" opacity="0.95" />
        <circle cx="15.2" cy="16.5" r="3.4" fill="url(#flowerGoldGrad)" opacity="0.95" />
        <circle cx="8.8" cy="16.5" r="3.4" fill="url(#flowerGoldGrad)" opacity="0.95" />
        <circle cx="7" cy="10.4" r="3.4" fill="url(#flowerGoldGrad)" opacity="0.95" />
        {/* Pistil Core */}
        <circle cx="12" cy="12" r="2.4" fill="#FFF9D2" />
        <circle cx="12" cy="12" r="1.3" fill="#8B6914" />
      </g>
    </svg>
  );
}

function DropIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dropGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C89218" />
        </linearGradient>
        <filter id="goldGlowDrop" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter="url(#goldGlowDrop)">
        {/* Outer Droplet */}
        <path
          d="M12 2.5C12 2.5 5.5 11 5.5 15.5C5.5 19.09 8.41 22 12 22C15.59 22 18.5 19.09 18.5 15.5C18.5 11 12 2.5 12 2.5Z"
          stroke="url(#dropGoldGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner Luminous Core */}
        <path
          d="M12 7C12 7 8.2 12.8 8.2 15.5C8.2 17.6 9.9 19.3 12 19.3C14.1 19.3 15.8 17.6 15.8 15.5C15.8 12.8 12 7 12 7Z"
          fill="url(#dropGoldGrad)"
          opacity="0.8"
        />
        {/* Highlight Specular Streak */}
        <path
          d="M9.8 14.2C9.8 13.2 10.6 10.8 11.4 9.5"
          stroke="#FFF9D2"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function LotusIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lotusGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C89218" />
        </linearGradient>
        <filter id="goldGlowLotus" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter="url(#goldGlowLotus)">
        {/* Center Petal */}
        <path
          d="M12 3.8C10.5 7.5 10 12 12 18.5C14 12 13.5 7.5 12 3.8Z"
          fill="url(#lotusGoldGrad)"
        />
        {/* Left Inner Petal */}
        <path
          d="M12 18.5C8.5 17.2 5.8 12.8 7.2 8.2C9.8 11.2 11.4 14.8 12 18.5Z"
          fill="url(#lotusGoldGrad)"
          opacity="0.88"
        />
        {/* Right Inner Petal */}
        <path
          d="M12 18.5C15.5 17.2 18.2 12.8 16.8 8.2C14.2 11.2 12.6 14.8 12 18.5Z"
          fill="url(#lotusGoldGrad)"
          opacity="0.88"
        />
        {/* Left Outer Wing */}
        <path
          d="M12 18.5C6.8 18.8 3.8 15.2 3.2 12.5C5.8 13.6 8.8 15.8 12 18.5Z"
          fill="url(#lotusGoldGrad)"
          opacity="0.75"
        />
        {/* Right Outer Wing */}
        <path
          d="M12 18.5C17.2 18.8 20.2 15.2 20.8 12.5C18.2 13.6 15.2 15.8 12 18.5Z"
          fill="url(#lotusGoldGrad)"
          opacity="0.75"
        />
        {/* Lotus Pedestal Base */}
        <path
          d="M8.5 20.2C10.5 21 13.5 21 15.5 20.2"
          stroke="url(#lotusGoldGrad)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function BottleIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottleGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C89218" />
        </linearGradient>
        <filter id="goldGlowBottle" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter="url(#goldGlowBottle)">
        {/* Ornate Stopper Cap */}
        <circle cx="12" cy="4" r="2.3" fill="url(#bottleGoldGrad)" />
        {/* Ornate Neck Ring */}
        <rect x="9.5" y="6.8" width="5" height="1.8" rx="0.9" fill="url(#bottleGoldGrad)" />
        {/* Faceted Glass Flacon Body */}
        <path
          d="M8.5 9.5H15.5L17.5 13V19.5C17.5 20.6 16.6 21.5 15.5 21.5H8.5C7.4 21.5 6.5 20.6 6.5 19.5V13L8.5 9.5Z"
          stroke="url(#bottleGoldGrad)"
          strokeWidth="1.7"
          fill="none"
        />
        {/* Amber Attar Oil Fill */}
        <path
          d="M8 14H16V19.5C16 20 15.5 20.5 15 20.5H9C8.5 20.5 8 20 8 19.5V14Z"
          fill="url(#bottleGoldGrad)"
          opacity="0.82"
        />
        {/* Gold Filigree Emblem on Bottle */}
        <rect x="10.5" y="15" width="3" height="3" rx="0.5" stroke="#FFF9D2" strokeWidth="0.8" fill="none" />
      </g>
    </svg>
  );
}

function LeafIcon({ className = 'w-7 h-7 sm:w-8 sm:h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4B8" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#C89218" />
        </linearGradient>
        <filter id="goldGlowLeaf" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.6" />
        </filter>
      </defs>
      <g filter="url(#goldGlowLeaf)">
        {/* Outer Feather/Leaf Shape */}
        <path
          d="M20.5 3.5C20.5 3.5 13.5 4 8.5 9C3.5 14 3.5 19.5 3.5 19.5C3.5 19.5 9 19.5 14 14.5C19 9.5 20.5 3.5 20.5 3.5Z"
          stroke="url(#leafGoldGrad)"
          strokeWidth="1.7"
          fill="none"
        />
        {/* Central Stem */}
        <path
          d="M3.5 20.5C6.5 17.5 12 12 20.5 3.5"
          stroke="url(#leafGoldGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Delicate Ribs */}
        <path d="M8.5 15.5C10 14 11 12.5 11 12.5" stroke="url(#leafGoldGrad)" strokeWidth="1" strokeLinecap="round" />
        <path d="M12 12C13.5 10.5 14.5 9 14.5 9" stroke="url(#leafGoldGrad)" strokeWidth="1" strokeLinecap="round" />
        <path d="M15.5 8.5C17 7 18 5.5 18 5.5" stroke="url(#leafGoldGrad)" strokeWidth="1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function DiamondStar({ className = 'w-3.5 h-3.5 sm:w-4 sm:h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="starGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF9D2" />
          <stop offset="50%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#D49B28" />
        </linearGradient>
      </defs>
      <path
        d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"
        fill="url(#starGoldGrad)"
      />
    </svg>
  );
}

// Lens Flare Starburst
function StarburstFlare({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 ${className}`}>
      {/* Soft Glow Halos */}
      <div className="absolute inset-0 -m-8 rounded-full bg-radial from-amber-300/40 via-amber-400/15 to-transparent blur-md animate-pulse" />
      <div className="absolute inset-0 -m-3 rounded-full bg-white/70 blur-xs" />
      {/* Cross Flares */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-0.5 bg-gradient-to-b from-transparent via-white to-transparent" />
      {/* Diagonal Spikes */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-0.5 rotate-45 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-0.5 -rotate-45 bg-gradient-to-r from-transparent via-amber-200 to-transparent" />
    </div>
  );
}

// --- Data Items matching reference image exactly ---
interface RibbonItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}

const RIBBON_ITEMS: RibbonItem[] = [
  {
    id: 'ribbon-1',
    icon: FlowerIcon,
    title: 'YOUR SIGNATURE SCENT',
    subtitle: 'A FRAGRANCE THAT DEFINES YOU',
  },
  {
    id: 'ribbon-2',
    icon: DropIcon,
    title: 'ELEGANCE IN EVERY DROP',
    subtitle: 'PURE • TIMELESS • LUXURIOUS',
  },
  {
    id: 'ribbon-3',
    icon: LotusIcon,
    title: 'LUXURY THAT LINGERS',
    subtitle: 'LASTING IMPRESSIONS',
  },
  {
    id: 'ribbon-4',
    icon: BottleIcon,
    title: 'CRAFTED TO BE REMEMBERED',
    subtitle: 'THE ART OF FINE FRAGRANCE',
  },
  {
    id: 'ribbon-5',
    icon: LeafIcon,
    title: 'YOUR SCENT, YOUR STORY',
    subtitle: 'MAKE EVERY MOMENT MEMORABLE',
  },
];

export default function AboutRibbonMarquee() {
  return (
    <section
      aria-label="The Attar Depot Essence Marquee"
      className="relative w-full overflow-hidden select-none bg-[#021814]"
    >
      {/* Panoramic Canvas Container */}
      <div className="relative w-full h-[220px] xs:h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[440px] flex items-center justify-center">
        {/* 1. Full-bleed Background: Real Reference Imagery */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src="/images/about-ribbon-marquee-bg.png"
            alt="The Attar Depot - Pure Luxury Fragrance Canvas"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center w-full h-full brightness-[1.03] contrast-[1.04]"
          />

          {/* Gentle luxury top & bottom vignette transitions to neighbor sections */}
          <div className="absolute inset-x-0 top-0 h-10 sm:h-16 bg-gradient-to-b from-[#F7F3EE]/30 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-[#021814]/60 via-transparent to-transparent pointer-events-none" />

          {/* Ambient center radial golden glow */}
          <div className="absolute inset-0 bg-radial from-amber-400/10 via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* 2. Center Majestic Ribbon Container with Live Marquee */}
        <div className="relative z-10 w-full">
          {/* Main Ribbon Strip (Deep Royal Emerald Satin + Gold Edge Rails) */}
          <div className="relative w-full h-[76px] xs:h-[84px] sm:h-[92px] lg:h-[104px] flex items-center shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,215,0,0.25)] border-y border-[#FFD700]/70 overflow-hidden">
            {/* Satin Backdrop Gradient that seamlessly blends with the reference ribbon */}
            <div className="absolute inset-0 bg-linear-to-r from-[#011B17]/96 via-[#023B32]/98 to-[#011B17]/96 backdrop-blur-xs" />

            {/* Glowing 24K Gold Upper Rail */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-linear-to-r from-amber-500/20 via-[#FFE885] via-20% via-[#FFD700] via-50% via-[#FFE885] via-80% to-amber-500/20 shadow-[0_0_16px_rgba(255,215,0,0.9)]">
              {/* Starburst Lens Flares on the top rail */}
              <StarburstFlare className="left-[18%] top-0 hidden sm:block scale-90" />
              <StarburstFlare className="left-[52%] top-0 block scale-110" />
              <StarburstFlare className="left-[84%] top-0 hidden md:block scale-80" />
            </div>

            {/* Glowing 24K Gold Lower Rail */}
            <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-linear-to-r from-amber-500/20 via-[#FFE885] via-20% via-[#FFD700] via-50% via-[#FFE885] via-80% to-amber-500/20 shadow-[0_0_16px_rgba(255,215,0,0.9)]">
              {/* Subtle secondary flares on bottom rail */}
              <StarburstFlare className="left-[34%] top-0 hidden sm:block scale-75" />
              <StarburstFlare className="left-[68%] top-0 hidden lg:block scale-75" />
            </div>

            {/* Soft Edge Fade Masks (Left & Right) for seamless glide in/out */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-linear-to-r from-[#011B17] via-[#011B17]/70 to-transparent z-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-linear-to-l from-[#011B17] via-[#011B17]/70 to-transparent z-20" />

            {/* Continuous Smooth 60fps Hardware-Accelerated Marquee Track */}
            <div className="relative w-full flex items-center overflow-hidden">
              <div className="marquee-content flex items-center shrink-0">
                {/* 1st iteration */}
                <RibbonItemsSet />
                {/* 2nd iteration for infinite seamless wrap */}
                <RibbonItemsSet />
                {/* 3rd iteration for ultra-wide displays */}
                <RibbonItemsSet />
                {/* 4th iteration for extra buffer */}
                <RibbonItemsSet />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pure CSS Smooth Infinite Marquee Animation with Pause on Hover */}
      <style jsx>{`
        @keyframes ribbonMarqueeAnimation {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-25%, 0, 0);
          }
        }
        .marquee-content {
          display: flex;
          align-items: center;
          width: max-content;
          animation: ribbonMarqueeAnimation 34s linear infinite;
          will-change: transform;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .marquee-content {
            animation-duration: 24s;
          }
        }
      `}</style>
    </section>
  );
}

// Single set of the 5 badges with divider stars
function RibbonItemsSet() {
  return (
    <div className="flex items-center gap-6 sm:gap-10 md:gap-14 lg:gap-16 pr-6 sm:pr-10 md:pr-14 lg:pr-16 shrink-0">
      {RIBBON_ITEMS.map((item) => {
        const IconComponent = item.icon;
        return (
          <React.Fragment key={item.id}>
            <div className="flex items-center gap-3 sm:gap-4 md:gap-4.5 group cursor-default transition-transform duration-300 hover:scale-[1.03]">
              {/* 24k Gold Emblem Icon with subtle interactive pulse */}
              <div className="p-1 rounded-full transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(255,215,0,0.8)]">
                <IconComponent className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9" />
              </div>

              {/* Luxury Dual-Line Typography (Title & Subtitle) */}
              <div className="flex flex-col text-left whitespace-nowrap">
                <span className="font-serif text-[11px] xs:text-xs sm:text-[13px] md:text-sm lg:text-[15px] font-bold tracking-[0.16em] sm:tracking-[0.18em] text-[#FFD700] drop-shadow-[0_1px_8px_rgba(255,215,0,0.45)] group-hover:text-[#FFF5C0] transition-colors leading-tight">
                  {item.title}
                </span>
                <span className="font-sans text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-semibold tracking-[0.22em] text-[#F3E6D5] opacity-90 group-hover:opacity-100 transition-opacity uppercase leading-normal mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>

            {/* Glowing 4-Point Gold Diamond Star Separator */}
            <div className="flex items-center justify-center opacity-85 px-1 sm:px-2">
              <DiamondStar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFD700] drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]" />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
