'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Droplets, Layers } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { motion } from 'framer-motion';
import { luxuryEase } from '@/lib/animations';

export default function CategoryDisplaySlider() {
  const { data: apiCategories = [], isLoading } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter only active categories from database - NO static dummy images
  const categories = useMemo(() => {
    return apiCategories.filter((c) => c.isActive !== false);
  }, [apiCategories]);

  // Monitor scroll position for chevron buttons
  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, categories.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Header with Title, Tagline and Scroll Controls matching Our Bestsellers */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1 sm:space-y-1.5">
          <span className="text-[10.5px] sm:text-xs font-bold text-[#C9A227] uppercase tracking-widest block font-sans">
            Artisanal Reserve
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase font-light text-neutral-900 tracking-tight">
            Our Categories
          </h2>
        </div>

        {!isLoading && categories.length > 0 && (
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Mobile "View All" Pill */}
            <Link
              href="/shop"
              className="sm:hidden inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 hover:text-emerald-700 uppercase tracking-wider py-1.5 px-3 rounded-full bg-emerald-50 border border-emerald-200/80 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3 text-[#C9A227]" />
            </Link>

            {/* Smooth Scroll Navigation Arrows (Desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft
                    ? 'border-stone-300 bg-white text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-sm active:scale-95 cursor-pointer'
                    : 'border-stone-200/80 bg-white/40 text-stone-300 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
                title="Previous categories"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                  canScrollRight
                    ? 'border-stone-300 bg-white text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-sm active:scale-95 cursor-pointer'
                    : 'border-stone-200/80 bg-white/40 text-stone-300 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
                title="Next categories"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Categories Horizontal Slider Container */}
      <div className="relative group/carousel -mx-4 sm:mx-0">
        {isLoading ? (
          <div className="flex gap-4 sm:gap-6 overflow-hidden py-3 sm:py-4 px-4 sm:px-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[210px] xs:w-[240px] sm:w-[280px] md:w-[315px] flex-shrink-0 animate-pulse"
              >
                <div className="aspect-[3/4] rounded-2xl sm:rounded-3xl bg-stone-200/80" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="mx-4 sm:mx-0 w-[calc(100%-2rem)] sm:w-full py-12 px-6 rounded-3xl bg-white/90 border border-stone-200 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
              No Categories Found
            </h3>
            <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
              Categories empty
            </p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-6 px-4 sm:px-0.5 no-scrollbar overscroll-x-contain"
          >
            {categories.map((cat) => {
              const hasImage = Boolean(cat.image && (cat.image.startsWith('http') || cat.image.startsWith('/')));
              return (
                <div
                  key={cat._id}
                  className="w-[210px] xs:w-[240px] sm:w-[280px] md:w-[315px] flex-shrink-0 snap-start flex flex-col group/card"
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="block relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 hover:border-[#F5B418]/80 shadow-sm hover:shadow-[0_16px_36px_rgba(1,37,32,0.18)] transition-all duration-500 bg-[#0A1917]"
                  >
                    {/* Category Background Image or Elegant Fallback */}
                    {hasImage ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 240px, (max-width: 1024px) 280px, 320px"
                        className="object-cover object-center group-hover/card:scale-106 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#012520] via-[#08302A] to-[#0A1917] flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#F5B418]/10 border border-[#F5B418]/30 flex items-center justify-center mb-3 group-hover/card:scale-110 transition-transform duration-500">
                          <Droplets className="w-8 h-8 text-[#F5B418]" />
                        </div>
                        <span className="font-serif text-3xl font-light tracking-widest text-[#F5B418]/40 uppercase select-none">
                          {cat.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Dark Cinematic Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 via-60% to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity duration-300" />

                    {/* Top Badge (if featured) */}
                    {cat.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#F5B418]/40 text-[10px] font-bold uppercase tracking-widest text-[#F5B418] shadow-sm">
                          <Sparkles className="w-2.5 h-2.5 text-[#F5B418]" />
                          <span>Featured</span>
                        </span>
                      </div>
                    )}

                    {/* Bottom Content Area */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end z-10 text-white space-y-1.5">
                      <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-tight text-white group-hover/card:text-[#F5B418] transition-colors duration-300 leading-tight">
                        {cat.name}
                      </h3>

                      {cat.description && (
                        <p className="font-sans text-[11px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed opacity-90 group-hover/card:opacity-100 transition-opacity">
                          {cat.description}
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between border-t border-white/10 group-hover/card:border-[#F5B418]/30 transition-colors">
                        <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#F5B418] group-hover/card:translate-x-1 transition-transform duration-300">
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>

                        {typeof cat.productCount === 'number' && cat.productCount > 0 && (
                          <span className="text-[10px] font-sans text-stone-400 group-hover/card:text-stone-300 transition-colors">
                            {cat.productCount} Flacons
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
