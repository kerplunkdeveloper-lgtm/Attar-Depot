'use client';

import React from 'react';

interface CleanTrustBadge {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
}

const TRUST_BADGES: CleanTrustBadge[] = [
  {
    id: 'non-toxic',
    name: 'Non Toxic',
    subtitle: '100% Pure & Skin Safe',
    icon: (
      /* 1. Molecule in crossed-out circle (Non Toxic) */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Circular Seal with Gold Accents */}
        <circle cx="24" cy="24" r="20" stroke="#046A5A" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="17.5" stroke="#C9A227" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
        {/* Diagonal Slash in Gold */}
        <line x1="9.5" y1="9.5" x2="38.5" y2="38.5" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" />
        {/* Molecular Hexagon Ring with Emerald & Gold Nodes */}
        <circle cx="24" cy="16" r="2.4" fill="#C9A227" stroke="#023F36" strokeWidth="1" />
        <circle cx="31" cy="20" r="2.4" fill="#046A5A" stroke="#023F36" strokeWidth="1" />
        <circle cx="31" cy="28" r="2.4" fill="#C9A227" stroke="#023F36" strokeWidth="1" />
        <circle cx="24" cy="32" r="2.4" fill="#046A5A" stroke="#023F36" strokeWidth="1" />
        <circle cx="17" cy="28" r="2.4" fill="#C9A227" stroke="#023F36" strokeWidth="1" />
        <circle cx="17" cy="20" r="2.4" fill="#046A5A" stroke="#023F36" strokeWidth="1" />
        {/* Bond Lines */}
        <path d="M24 16l7 4v8l-7 4-7-4v-8l7-4z" stroke="#046A5A" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    id: 'paraben-free',
    name: 'Paraben Free',
    subtitle: 'Zero Chemical Preservatives',
    icon: (
      /* 2. Test tube in crossed-out circle (Paraben Free) */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#046A5A" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="17.5" stroke="#C9A227" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
        <line x1="9.5" y1="9.5" x2="38.5" y2="38.5" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" />
        {/* Crystal Apothecary Flacon Tube */}
        <path d="M20 14h8M21 14v13a3 3 0 006 0V14" stroke="#023F36" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="22" y1="23" x2="26" y2="23" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="23" cy="26" r="1" fill="#C9A227" />
        <circle cx="25" cy="25" r="0.8" fill="#046A5A" />
      </svg>
    ),
  },
  {
    id: 'sulphate-free',
    name: 'Sulphate Free',
    subtitle: 'Gentle Natural Ingredients',
    icon: (
      /* 3. Soap bar with bubbles in crossed-out circle (Sulphate Free) */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#046A5A" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="17.5" stroke="#C9A227" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
        <line x1="9.5" y1="9.5" x2="38.5" y2="38.5" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" />
        {/* Soap Bar */}
        <path d="M16 23l10-5c1.1-.6 2.5-.2 3.1.9l2.8 5.6c.6 1.1.2 2.5-.9 3.1l-10 5c-1.1.6-2.5.2-3.1-.9l-2.8-5.6c-.6-1.1-.2-2.5.9-3.1z" stroke="#023F36" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Foaming Bubbles in Gold */}
        <circle cx="16" cy="18" r="1.8" stroke="#C9A227" strokeWidth="1.2" fill="#FAF8F2" />
        <circle cx="19" cy="15" r="1.2" stroke="#C9A227" strokeWidth="1.2" fill="#FAF8F2" />
        <circle cx="29" cy="30" r="2" stroke="#C9A227" strokeWidth="1.2" fill="#FAF8F2" />
        <circle cx="33" cy="32" r="1.4" stroke="#C9A227" strokeWidth="1.2" fill="#FAF8F2" />
      </svg>
    ),
  },
  {
    id: 'vegan',
    name: '100% Vegan',
    subtitle: 'Plant & Botanical Sourced',
    icon: (
      /* 4. Scalloped Rosette Stamp with Sprout & VEGAN Text */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Scalloped Floral Seal Outline in Gold & Emerald */}
        <path d="M24 6a4 4 0 013 1.3 4 4 0 004.2.8 4 4 0 013.8 2.2 4 4 0 003.8 2.3 4 4 0 012.3 3.8 4 4 0 002.3 3.8 4 4 0 010 4.2 4 4 0 00-2.3 3.8 4 4 0 01-2.3 3.8 4 4 0 00-3.8 2.3 4 4 0 01-3.8 2.2 4 4 0 00-4.2.8 4 4 0 01-6 0 4 4 0 00-4.2-.8 4 4 0 01-3.8-2.2 4 4 0 00-3.8-2.3 4 4 0 01-2.3-3.8 4 4 0 00-2.3-3.8 4 4 0 010-4.2 4 4 0 002.3-3.8 4 4 0 012.3-3.8 4 4 0 003.8-2.3 4 4 0 013.8-2.2 4 4 0 004.2-.8A4 4 0 0124 6z" stroke="#046A5A" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Twin Sprout Leaves */}
        <path d="M24 17.5c-2-3-5-3-5 0 0 2.5 3.5 3 5 0zM24 17.5c2-3 5-3 5 0 0 2.5-3.5 3-5 0z" fill="#C9A227" stroke="#023F36" strokeWidth="0.8" />
        {/* VEGAN Text */}
        <text
          x="24"
          y="28.5"
          textAnchor="middle"
          fontSize="7.5"
          fontFamily="var(--font-cormorant), Georgia, serif"
          fontWeight="800"
          letterSpacing="0.9"
          fill="#023F36"
        >
          VEGAN
        </text>
        <line x1="16" y1="31.5" x2="32" y2="31.5" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'organic',
    name: 'Organic Certified',
    subtitle: 'Wild-Harvested Botanicals',
    icon: (
      /* 5. Hand holding/cupping a growing plant sprout */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#C9A227" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
        {/* Cupped Hand */}
        <path d="M12 36l3.5-7.5c.7-1.5 2.2-2.5 3.8-2.5H23M23 26c3 0 7 2 8.5 3.5l3.5 3.5c1.2 1.2 1.2 3.1 0 4.3-1.2 1.2-3.1 1.2-4.3 0L27 34H18" stroke="#046A5A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="14.5" y1="30.5" x2="18" y2="38" stroke="#046A5A" strokeWidth="1.8" strokeLinecap="round" />
        {/* Sprouting Plant in Gold & Emerald */}
        <path d="M28 26V13" stroke="#023F36" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M28 19c-3.5-1-5-4-4.5-7 3-.5 6 1.5 6 5M28 17c3.5-1 5-4 4.5-7-3-.5-6 1.5-6 5" stroke="#046A5A" strokeWidth="1.5" fill="#D1FAE5" fillOpacity="0.6" strokeLinejoin="round" />
        <circle cx="28" cy="11" r="1.8" fill="#C9A227" stroke="#023F36" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    id: 'clean-beauty',
    name: 'Clean Beauty',
    subtitle: 'Dermatologically Safe & Pure',
    icon: (
      /* 6. Smiling serene woman face with sparkles */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hair Bun with Gold Accent */}
        <circle cx="24" cy="11" r="3.5" stroke="#046A5A" strokeWidth="1.8" fill="#FEF3C7" />
        {/* Head Contour & Ears */}
        <path d="M18 19c0-3.5 2.7-6 6-6s6 2.5 6 6v7c0 4-2.7 7-6 7s-6-3-6-7v-7z" stroke="#046A5A" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M16.5 23v3M31.5 23v3" stroke="#046A5A" strokeWidth="1.8" strokeLinecap="round" />
        {/* Smiling Eyes & Smile */}
        <path d="M21 24a1.2 1.2 0 012 0M25 24a1.2 1.2 0 012 0" stroke="#023F36" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M22 28c.7.8 2.3.8 3 0" stroke="#C9A227" strokeWidth="1.6" strokeLinecap="round" />
        {/* Shoulders */}
        <path d="M19 33.5v3.5c-4.5 1.5-7 3-8 5M29 33.5v3.5c4.5 1.5 7 3 8 5" stroke="#046A5A" strokeWidth="1.8" strokeLinecap="round" />
        {/* Radiant Gold Sparkles */}
        <path d="M12 18l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1zM36 21l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1z" fill="#C9A227" />
      </svg>
    ),
  },
  {
    id: 'alcohol-free',
    name: '100% Alcohol-Free',
    subtitle: 'Pure Concentrated Perfume Oil',
    icon: (
      /* 7. Perfume droplet in crossed-out circle */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#046A5A" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="17.5" stroke="#C9A227" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
        <line x1="9.5" y1="9.5" x2="38.5" y2="38.5" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" />
        {/* Pure Flacon Droplet */}
        <path d="M24 13c-4 5.5-6.5 8.8-6.5 12.2a6.5 6.5 0 0013 0c0-3.4-2.5-6.7-6.5-12.2z" stroke="#023F36" strokeWidth="1.8" fill="#FEF3C7" fillOpacity="0.5" strokeLinejoin="round" />
        <circle cx="24" cy="25" r="1.8" fill="#C9A227" />
      </svg>
    ),
  },
  {
    id: 'cruelty-free',
    name: 'Cruelty Free',
    subtitle: 'Never Tested On Animals',
    icon: (
      /* 8. Bunny silhouette / Heart */
      <svg viewBox="0 0 48 48" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="#046A5A" strokeWidth="1.8" />
        <circle cx="24" cy="24" r="17.5" stroke="#C9A227" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
        {/* Bunny ears and face in Emerald with Gold Accents */}
        <path d="M20 18c-1-5-3-9-5.5-9s-2.5 4 0 9M26 18c1-5 3-9 5.5-9s2.5 4 0 9" stroke="#023F36" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 23c-2 2-3 5-3 8 0 5.5 4.5 9 11 9s11-3.5 11-9c0-3-1-6-3-8-2.5-2.5-13.5-2.5-16 0z" stroke="#046A5A" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="20" cy="27" r="1.2" fill="#C9A227" />
        <circle cx="26" cy="27" r="1.2" fill="#C9A227" />
        <path d="M22 30l1 1 1-1" stroke="#023F36" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function InfiniteMarquee() {
  return (
    <section className="relative w-full py-4 sm:py-5 bg-gradient-to-r from-[#FAF8F2] via-white to-[#FAF8F2] border-y border-[#C9A227]/30 overflow-hidden shadow-2xs">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent pointer-events-none" />

      {/* Infinite Scrolling Track with Gradient Masked Edges */}
      <div className="relative w-full overflow-hidden marquee-mask group">
        <div className="animate-marquee flex items-center gap-8 sm:gap-12 py-1">
          {/* First sequence of trust badges */}
          {TRUST_BADGES.map((item, idx) => (
            <div
              key={`b1-${item.id}-${idx}`}
              className="flex items-center gap-3 sm:gap-3.5 px-3 py-1.5 rounded-2xl shrink-0 select-none group/item hover:bg-white/80 hover:shadow-xs transition-all duration-300"
            >
              {/* Premium Frosted Medallion Container */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white via-[#FAF8F2] to-emerald-50/70 border border-emerald-200/80 shadow-2xs flex items-center justify-center p-2 shrink-0 group-hover/item:scale-105 group-hover/item:border-[#C9A227]/80 group-hover/item:shadow-emerald-sm transition-all duration-300">
                {item.icon}
              </div>

              {/* Typography */}
              <div className="flex flex-col text-left">
                <span className="font-serif text-sm sm:text-base font-bold tracking-wide text-neutral-900 group-hover/item:text-emerald-800 transition-colors uppercase whitespace-nowrap">
                  {item.name}
                </span>
                <span className="font-sans text-[10px] sm:text-[11px] font-medium text-neutral-500 group-hover/item:text-neutral-700 tracking-wider whitespace-nowrap transition-colors">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}

          {/* Duplicated sequence for seamless continuous loop */}
          {TRUST_BADGES.map((item, idx) => (
            <div
              key={`b2-${item.id}-${idx}`}
              className="flex items-center gap-3 sm:gap-3.5 px-3 py-1.5 rounded-2xl shrink-0 select-none group/item hover:bg-white/80 hover:shadow-xs transition-all duration-300"
            >
              {/* Premium Frosted Medallion Container */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-white via-[#FAF8F2] to-emerald-50/70 border border-emerald-200/80 shadow-2xs flex items-center justify-center p-2 shrink-0 group-hover/item:scale-105 group-hover/item:border-[#C9A227]/80 group-hover/item:shadow-emerald-sm transition-all duration-300">
                {item.icon}
              </div>

              {/* Typography */}
              <div className="flex flex-col text-left">
                <span className="font-serif text-sm sm:text-base font-bold tracking-wide text-neutral-900 group-hover/item:text-emerald-800 transition-colors uppercase whitespace-nowrap">
                  {item.name}
                </span>
                <span className="font-sans text-[10px] sm:text-[11px] font-medium text-neutral-500 group-hover/item:text-neutral-700 tracking-wider whitespace-nowrap transition-colors">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
