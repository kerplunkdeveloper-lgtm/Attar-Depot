'use client';

import React from 'react';
import { motion } from 'framer-motion';

// ============================================================================
// Fine-crafted Gold Botanical Leaf Emblem (Attar)
// ============================================================================
function AttarLeafIcon({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="attarLeafGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFBC72" />
          <stop offset="35%" stopColor="#C49B44" />
          <stop offset="70%" stopColor="#9C7529" />
          <stop offset="100%" stopColor="#755217" />
        </linearGradient>
        <linearGradient id="leafVein" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B38936" />
          <stop offset="50%" stopColor="#F5DF9E" />
          <stop offset="100%" stopColor="#8C661D" />
        </linearGradient>
      </defs>

      {/* Main Branch Stem */}
      <path
        d="M30 84 C38 72 48 54 55 36"
        stroke="url(#attarLeafGold)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M44 58 C56 52 68 53 78 57"
        stroke="url(#attarLeafGold)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M38 68 C44 76 50 84 56 90"
        stroke="url(#attarLeafGold)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Top Center Leaf */}
      <path
        d="M55 36 C55 24 60 14 62 10 C65 15 72 26 68 36 C64 42 58 40 55 36 Z"
        fill="url(#attarLeafGold)"
        fillOpacity="0.16"
        stroke="url(#attarLeafGold)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M57 34 C60 25 62 16 62 11" stroke="url(#leafVein)" strokeWidth="1" />
      <path d="M59 28 C63 26 66 28 66 28" stroke="url(#leafVein)" strokeWidth="0.8" />
      <path d="M58 22 C61 20 63 22 63 22" stroke="url(#leafVein)" strokeWidth="0.8" />

      {/* Top Right Leaf */}
      <path
        d="M65 34 C72 32 82 34 86 36 C84 41 76 48 68 46 C64 44 64 38 65 34 Z"
        fill="url(#attarLeafGold)"
        fillOpacity="0.16"
        stroke="url(#attarLeafGold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M66 35 C74 36 82 36 85 36" stroke="url(#leafVein)" strokeWidth="0.9" />

      {/* Top Left Leaf */}
      <path
        d="M50 36 C42 30 38 24 38 18 C45 20 52 26 53 34 Z"
        fill="url(#attarLeafGold)"
        fillOpacity="0.16"
        stroke="url(#attarLeafGold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M51 34 C46 28 41 22 39 19" stroke="url(#leafVein)" strokeWidth="0.9" />

      {/* Large Graceful Left Leaf */}
      <path
        d="M44 58 C32 54 22 52 14 60 C12 68 18 78 28 78 C38 78 43 68 44 58 Z"
        fill="url(#attarLeafGold)"
        fillOpacity="0.18"
        stroke="url(#attarLeafGold)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M42 59 C32 64 24 67 14 61" stroke="url(#leafVein)" strokeWidth="1.2" />
      <path d="M34 63 C33 71 28 75 28 75" stroke="url(#leafVein)" strokeWidth="0.8" />
      <path d="M26 66 C23 71 20 73 20 73" stroke="url(#leafVein)" strokeWidth="0.8" />
      <path d="M38 61 C37 57 32 55 32 55" stroke="url(#leafVein)" strokeWidth="0.8" />

      {/* Lower Right Leaf */}
      <path
        d="M46 68 C54 70 64 72 68 80 C66 88 56 94 48 90 C42 86 43 76 46 68 Z"
        fill="url(#attarLeafGold)"
        fillOpacity="0.18"
        stroke="url(#attarLeafGold)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M47 70 C54 78 60 84 67 81" stroke="url(#leafVein)" strokeWidth="1.2" />
      <path d="M52 75 C49 81 48 87 48 87" stroke="url(#leafVein)" strokeWidth="0.8" />
      <path d="M56 80 C55 84 53 87 53 87" stroke="url(#leafVein)" strokeWidth="0.8" />
    </svg>
  );
}

// ============================================================================
// Fine-crafted Gold Ornate Attar Bottle / Flacon (Depot)
// ============================================================================
function DepotBottleIcon({ className = 'w-16 h-20' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="depotBottleGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFBC72" />
          <stop offset="35%" stopColor="#C49B44" />
          <stop offset="70%" stopColor="#9C7529" />
          <stop offset="100%" stopColor="#755217" />
        </linearGradient>
        <linearGradient id="depotFlameShine" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FDF2D3" />
          <stop offset="40%" stopColor="#DFBC72" />
          <stop offset="100%" stopColor="#8C661D" />
        </linearGradient>
      </defs>

      {/* Flame Finial Stopper on Top */}
      <path
        d="M40 6 C40 6 34 14 34 20 C34 24.5 36.8 28 40 28 C43.2 28 46 24.5 46 20 C46 14 40 6 40 6 Z"
        fill="url(#depotFlameShine)"
        stroke="url(#depotBottleGold)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M40 10 C38 15 38 19 40 23"
        stroke="url(#depotBottleGold)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Fluted Collar Rings */}
      <path
        d="M33 28 L47 28"
        stroke="url(#depotBottleGold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x="35"
        y="30"
        width="10"
        height="5"
        rx="1"
        fill="url(#depotBottleGold)"
        fillOpacity="0.25"
        stroke="url(#depotBottleGold)"
        strokeWidth="1.2"
      />
      <path
        d="M31 35 L49 35"
        stroke="url(#depotBottleGold)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Ornate Bulbous Perfume Flask Body */}
      <path
        d="M32 36 C28 42 22 52 22 66 C22 82 28 92 34 94 L46 94 C52 92 58 82 58 66 C58 52 52 42 48 36 Z"
        fill="url(#depotBottleGold)"
        fillOpacity="0.14"
        stroke="url(#depotBottleGold)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      {/* Ornate Filigree Arabesque Etchings inside Body */}
      <path
        d="M40 40 L40 90"
        stroke="url(#depotBottleGold)"
        strokeWidth="0.9"
        strokeDasharray="2 3"
      />
      
      {/* Central Diamond Rosette */}
      <path
        d="M40 54 L48 64 L40 74 L32 64 Z"
        fill="url(#depotFlameShine)"
        fillOpacity="0.3"
        stroke="url(#depotBottleGold)"
        strokeWidth="1.3"
      />
      <circle cx="40" cy="64" r="2.5" fill="url(#depotBottleGold)" />

      {/* Curved Filigree Side Details */}
      <path
        d="M26 62 C30 60 34 62 36 64"
        stroke="url(#depotBottleGold)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M54 62 C50 60 46 62 44 64"
        stroke="url(#depotBottleGold)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M27 74 C31 76 35 74 37 71"
        stroke="url(#depotBottleGold)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M53 74 C49 76 45 74 43 71"
        stroke="url(#depotBottleGold)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Pedestal Base */}
      <path
        d="M31 94 L49 94"
        stroke="url(#depotBottleGold)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M28 98 L52 98"
        stroke="url(#depotBottleGold)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <rect
        x="30"
        y="94"
        width="20"
        height="4"
        fill="url(#depotBottleGold)"
        fillOpacity="0.25"
      />
    </svg>
  );
}

// ============================================================================
// MAIN COMPONENT: The Meaning Behind Our Name (Pure UI & Responsive)
// ============================================================================
export default function AboutMeaning() {
  return (
    <section
      aria-label="The Meaning Behind Our Name - Attar Depot"
      className="relative w-full bg-[#FAF7F2] text-[#142A20] overflow-hidden select-none py-14 sm:py-16 lg:py-20 border-t border-[#EAE1D1]/80"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER: The Meaning Behind Our Name                               */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          {/* Main Headline */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.015em] text-[#0E281C] leading-[1.12]">
            The Meaning Behind Our Name
          </h2>

          {/* Warm Golden Accent Underline */}
          <div className="w-14 h-[2px] bg-[#98722B] mx-auto mt-3.5 rounded-full" />
        </motion.div>

        {/* ========================================================================= */}
        {/* TWO PILLARS: Attar (Left) & Depot (Right)                                 */}
        {/* ========================================================================= */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 items-center">
          
          {/* ----------------------------------------------------------------------- */}
          {/* Left Pillar: Attar                                                      */}
          {/* ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5 sm:gap-6 justify-center md:justify-end md:pr-12 lg:pr-16"
          >
            {/* Golden Botanical Leaves Emblem */}
            <div className="shrink-0 flex items-center justify-center p-1">
              <AttarLeafIcon className="w-14 h-14 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px]" />
            </div>

            {/* Content Text */}
            <div className="flex flex-col space-y-1.5 max-w-[280px]">
              <h3 className="font-serif text-2xl sm:text-[28px] lg:text-[32px] font-normal text-[#0E281C] tracking-tight leading-snug">
                Attar
              </h3>
              <p className="font-serif text-sm sm:text-[15px] lg:text-base text-[#2F4037] font-normal leading-[1.6]">
                Concentrated fragrance and the heritage of perfumery.
              </p>
            </div>
          </motion.div>

          {/* ----------------------------------------------------------------------- */}
          {/* Center Vertical Divider (Desktop only)                                  */}
          {/* ----------------------------------------------------------------------- */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-20 lg:h-24 bg-[#DED0BA]" />

          {/* ----------------------------------------------------------------------- */}
          {/* Mobile Horizontal Separator Line                                        */}
          {/* ----------------------------------------------------------------------- */}
          <div className="block md:hidden w-24 h-[1px] bg-[#DED0BA] mx-auto -my-3" />

          {/* ----------------------------------------------------------------------- */}
          {/* Right Pillar: Depot                                                     */}
          {/* ----------------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-5 sm:gap-6 justify-center md:justify-start md:pl-12 lg:pl-16"
          >
            {/* Golden Ornate Attar Bottle Emblem */}
            <div className="shrink-0 flex items-center justify-center p-1">
              <DepotBottleIcon className="w-14 h-16 sm:w-16 sm:h-20 lg:w-[64px] lg:h-[76px]" />
            </div>

            {/* Content Text */}
            <div className="flex flex-col space-y-1.5 max-w-[320px]">
              <h3 className="font-serif text-2xl sm:text-[28px] lg:text-[32px] font-normal text-[#0E281C] tracking-tight leading-snug">
                Depot
              </h3>
              <p className="font-serif text-sm sm:text-[15px] lg:text-base text-[#2F4037] font-normal leading-[1.6]">
                A destination where fragrances are brought together, explored and shared.
              </p>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
