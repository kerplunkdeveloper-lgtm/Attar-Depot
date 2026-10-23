'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ContactHeroBanner() {
  return (
    <section className="relative w-full overflow-hidden select-none">
      {/* Panoramic Hero Banner */}
      <div className="relative w-full h-[140px] sm:h-[180px] md:h-[240px] lg:h-[380px]">
        <Image
          src="/images/contactbanner.png"
          alt="Contact Attar Depot - Pure Essence of Royalty"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover object-[center_38%]"
        />
        {/* Subtle gradient overlays for seamless integration */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#FAF8F2]/70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-t from-[#FAF8F2] to-transparent pointer-events-none" />
      </div>

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#C9A227] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C9A227] font-bold">Contact Us</span>
        </nav>
      </div>
    </section>
  );
}
