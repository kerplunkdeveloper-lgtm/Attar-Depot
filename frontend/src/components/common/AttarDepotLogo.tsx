'use client';

import React from 'react';

interface AttarDepotLogoProps {
  variant?: 'icon' | 'full' | 'text';
  className?: string;
  size?: number | string;
  fillColor?: string;
  accentColor?: string;
}

/**
 * Official "The Attar Depot" Royal Emblem & Logomark
 * Faithfully recreating the calligraphic teardrop/flame essence emblem
 * and the iconic luxury typography with the signature flacon-seal dots.
 */
export default function AttarDepotLogo({
  variant = 'full',
  className = '',
  size,
  fillColor = 'currentColor',
  accentColor = '#C9A227',
}: AttarDepotLogoProps) {
  // 1. Just the Iconic Calligraphic Essence Emblem (Perfume Flame / "A" Calligraphy)
  if (variant === 'icon') {
    return (
      <svg
        viewBox="0 0 260 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`inline-block shrink-0 ${className}`}
        style={size ? { width: size, height: size } : undefined}
        aria-label="The Attar Depot Royal Emblem"
      >
        <g fill={fillColor}>
          {/* Main calligraphic flame & teardrop arch */}
          <path
            d="M 130 5
               C 134 40, 148 70, 165 102
               C 185 138, 202 178, 198 218
               C 195 248, 178 274, 150 286
               C 126 296, 95 289, 78 268
               C 62 248, 60 220, 68 195
               C 74 175, 87 155, 100 138
               C 104 133, 110 137, 108 142
               C 96 168, 86 198, 92 226
               C 97 250, 116 266, 140 264
               C 162 262, 178 244, 180 222
               C 183 188, 168 152, 150 122
               C 142 108, 134 94, 130 78
               Z"
          />
          {/* Inner calligraphic swash forming the majestic "A" arch & drop loop */}
          <path
            d="M 130 75
               C 133 98, 140 120, 150 140
               C 164 168, 180 200, 172 232
               C 165 258, 142 276, 116 273
               C 92 270, 72 250, 68 226
               C 65 208, 70 190, 80 174
               C 83 170, 88 172, 87 176
               C 79 192, 77 212, 85 228
               C 94 246, 115 256, 134 250
               C 152 244, 162 226, 162 208
               C 162 186, 150 162, 138 142
               C 128 124, 118 104, 115 84
               C 114 78, 120 74, 123 78
               C 126 82, 128 88, 130 92
               Z"
          />
          {/* Sweeping crescent tail at bottom right */}
          <path
            d="M 112 265
               C 128 276, 148 278, 166 270
               C 180 264, 189 252, 188 238
               C 187 222, 175 208, 162 200
               C 155 196, 150 198, 148 205
               C 146 214, 152 222, 160 227
               C 168 233, 172 242, 168 250
               C 164 258, 152 263, 142 263
               C 130 263, 118 258, 108 250
               C 104 247, 100 252, 102 256
               C 104 260, 108 263, 112 265
               Z"
          />
        </g>
      </svg>
    );
  }

  // 2. Just the Signature Typography ("THE ATTAR DEPOT" with distinctive dots)
  if (variant === 'text') {
    return (
      <div className={`flex flex-col items-center select-none ${className}`}>
        <span className="font-serif text-[9px] sm:text-[11px] font-bold tracking-[0.3em] uppercase leading-none opacity-90">
          The
        </span>
        <div className="flex items-baseline font-serif text-base sm:text-xl font-black tracking-[0.14em] uppercase leading-tight mt-0.5">
          {/* ATTAR with dots in A's */}
          <span className="relative inline-flex items-center">
            A
            <span
              className="absolute left-1/2 bottom-[26%] -translate-x-1/2 w-1 h-1 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </span>
          <span>TT</span>
          <span className="relative inline-flex items-center">
            A
            <span
              className="absolute left-1/2 bottom-[26%] -translate-x-1/2 w-1 h-1 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </span>
          <span>R</span>
          <span className="mx-1.5" />
          {/* DEPOT with centered dot in O */}
          <span>DEP</span>
          <span className="relative inline-flex items-center">
            O
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.2 h-1.2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </span>
          <span>T</span>
        </div>
      </div>
    );
  }

  // 3. Full Brand Mark (Emblem + "THE ATTAR DEPOT" signature lettering)
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Royal Perfume Flame Emblem */}
      <svg
        viewBox="0 0 260 270"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-12 h-14 sm:w-14 sm:h-16 shrink-0 transition-transform duration-300 hover:scale-105"
        aria-hidden="true"
      >
        <g fill={fillColor}>
          {/* Outer Calligraphic flame / drop */}
          <path
            d="M 130 5
               C 134 40, 148 70, 165 102
               C 185 138, 202 178, 198 218
               C 195 248, 178 274, 150 286
               C 126 296, 95 289, 78 268
               C 62 248, 60 220, 68 195
               C 74 175, 87 155, 100 138
               C 104 133, 110 137, 108 142
               C 96 168, 86 198, 92 226
               C 97 250, 116 266, 140 264
               C 162 262, 178 244, 180 222
               C 183 188, 168 152, 150 122
               C 142 108, 134 94, 130 78
               Z"
          />
          {/* Inner majestic "A" arch & drop loop */}
          <path
            d="M 130 75
               C 133 98, 140 120, 150 140
               C 164 168, 180 200, 172 232
               C 165 258, 142 276, 116 273
               C 92 270, 72 250, 68 226
               C 65 208, 70 190, 80 174
               C 83 170, 88 172, 87 176
               C 79 192, 77 212, 85 228
               C 94 246, 115 256, 134 250
               C 152 244, 162 226, 162 208
               C 162 186, 150 162, 138 142
               C 128 124, 118 104, 115 84
               C 114 78, 120 74, 123 78
               Z"
          />
        </g>
      </svg>

      {/* "THE" Prefix */}
      <span className="font-serif text-[9px] sm:text-[11px] font-bold tracking-[0.32em] uppercase mt-1 leading-none text-current opacity-90">
        The
      </span>

      {/* "ATTAR DEPOT" with royal flacon dots */}
      <div className="flex items-baseline font-serif text-base sm:text-xl font-black tracking-[0.14em] uppercase leading-tight mt-0.5 text-current">
        {/* 'A' with internal dot */}
        <span className="relative inline-flex items-center">
          A
          <span
            className="absolute left-1/2 bottom-[24%] -translate-x-1/2 w-1 sm:w-1.2 h-1 sm:h-1.2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </span>
        <span>TT</span>
        {/* Second 'A' with internal dot */}
        <span className="relative inline-flex items-center">
          A
          <span
            className="absolute left-1/2 bottom-[24%] -translate-x-1/2 w-1 sm:w-1.2 h-1 sm:h-1.2 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </span>
        <span>R</span>
        <span className="mx-1 sm:mx-1.5" />
        <span>DEP</span>
        {/* 'O' with center bullseye dot */}
        <span className="relative inline-flex items-center">
          O
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.2 sm:w-1.5 h-1.2 sm:h-1.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        </span>
        <span>T</span>
      </div>
    </div>
  );
}
