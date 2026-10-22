'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Droplets,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

function CategoryCardItem({ cat, priority = false }: { cat: any; priority?: boolean }) {
  const [imgError, setImgError] = useState(false);
  const rawImage = cat.image || cat.imageUrl || '';
  const hasValidImage = Boolean(
    !imgError &&
    rawImage &&
    typeof rawImage === 'string' &&
    rawImage.trim().length > 5
  );

  return (
    <div className="w-[310px] xs:w-[350px] sm:w-[420px] md:w-[460px] lg:w-[500px] xl:w-[540px] flex-shrink-0 snap-start flex flex-col group/card select-none">
      <Link
        href={`/shop?category=${cat.slug || cat._id}`}
        className="block relative w-full h-[370px] xs:h-[390px] sm:h-[420px] md:h-[440px] lg:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 hover:border-[#F5B418] shadow-md hover:shadow-[0_20px_40px_rgba(1,37,32,0.25)] transition-all duration-500 bg-[#0A1917]"
      >
        {/* Crystal Clear Category Background Image */}
        {hasValidImage ? (
          <Image
            src={rawImage}
            alt={cat.name}
            fill
            unoptimized
            priority={priority}
            onError={() => setImgError(true)}
            sizes="(max-width: 640px) 360px, (max-width: 1024px) 500px, 600px"
            className="object-cover object-center contrast-[1.03] brightness-[1.02] group-hover/card:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#012520] via-[#08302A] to-[#0A1917] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F5B418]/15 border border-[#F5B418]/30 flex items-center justify-center mb-3 group-hover/card:scale-110 transition-transform duration-500">
              <Droplets className="w-8 h-8 text-[#F5B418]" />
            </div>
            <span className="font-serif text-3xl font-light tracking-widest text-[#F5B418]/60 uppercase select-none">
              {cat.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Minimal Bottom Gradient - Leaves 75% of the image bright and clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 via-28% to-transparent pointer-events-none" />

        {/* Top Badge (if featured) */}
        {cat.featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#F5B418]/50 text-[10px] font-bold uppercase tracking-widest text-[#F5B418] shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-[#F5B418]" />
              <span>Featured</span>
            </span>
          </div>
        )}

        {/* Bottom Content Area - Crisp typography with high contrast */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end z-10 text-white space-y-1.5">
          <h3 className="font-serif text-xl sm:text-2xl font-bold uppercase tracking-tight text-white group-hover/card:text-[#F5B418] transition-colors duration-300 leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {cat.name}
          </h3>

          {cat.description && (
            <p className="font-sans text-[11.5px] sm:text-xs text-stone-200 line-clamp-2 leading-relaxed opacity-95 group-hover/card:opacity-100 transition-opacity drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {cat.description}
            </p>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-white/20 group-hover/card:border-[#F5B418]/40 transition-colors">
            <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#F5B418] group-hover/card:translate-x-1 transition-transform duration-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>

            {typeof cat.productCount === 'number' && cat.productCount > 0 && (
              <span className="text-[10px] font-sans font-medium text-stone-200 group-hover/card:text-white transition-colors bg-black/40 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-xs">
                {cat.productCount} {cat.productCount === 1 ? 'Flacon' : 'Flacons'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function CategoryDisplaySlider() {
  const { data: apiCategories = [], isLoading } = useCategories();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter only active, valid categories from database
  const categories = useMemo(() => {
    return (apiCategories || []).filter((c) => c && c.isActive !== false && Boolean(c.name));
  }, [apiCategories]);

  // Monitor scroll position for chevron buttons
  const checkScrollState = useCallback(() => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);
    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState, categories.length]);

  // Temporary pause handler on interaction
  const pauseTemporarily = useCallback((duration = 4500) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, duration);
  }, []);

  // Smooth scroll handler for slider arrows
  const handleScroll = (direction: 'left' | 'right') => {
    pauseTemporarily(5000);
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const card = el.querySelector('.group\\/card') as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 24 : clientWidth * 0.75;

    if (direction === 'right') {
      if (scrollLeft >= scrollWidth - clientWidth - 25) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    } else {
      if (scrollLeft <= 25) {
        el.scrollTo({ left: scrollWidth - clientWidth, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Subtle luxury Auto-Scroll Loop (every 4s, pauses on hover or touch)
  useEffect(() => {
    if (isPaused || categories.length <= 1) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      const el = sliderRef.current;
      if (!el) return;

      const card = el.querySelector('.group\\/card') as HTMLElement | null;
      const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.75;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 25) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, categories.length]);

  // Strictly dynamic: If loading or no categories exist in database, render nothing
  if (isLoading || categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Header with Title and Right Controls */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1 sm:space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl uppercase font-light text-neutral-900 tracking-tight">
            Our Categories
          </h2>
        </div>

        {/* Right Side Header Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick "View All" Pill */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-emerald-950 hover:text-emerald-700 uppercase tracking-wider py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all shadow-xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
          </Link>

          {/* Slider Arrow Controls in Header */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'border-stone-300 bg-white text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-sm active:scale-95 cursor-pointer'
                  : 'border-stone-200/80 bg-white/40 text-stone-300 cursor-not-allowed'
              }`}
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? 'border-stone-300 bg-white text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-sm active:scale-95 cursor-pointer'
                  : 'border-stone-200/80 bg-white/40 text-stone-300 cursor-not-allowed'
              }`}
              aria-label="Next categories"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIGH-END LUXURY CATEGORY SLIDER WITH RIGHT-SIDE ARROW ICON                */}
      {/* ========================================================================= */}
      <div
        className="relative group/carousel -mx-4 sm:mx-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => pauseTemporarily(5000)}
        onTouchEnd={() => pauseTemporarily(3000)}
      >
        {/* Soft Edge Fade Gradient Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white via-white/70 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white via-white/70 to-transparent z-20" />

        {/* Left Slider Floating Arrow Icon (Shown when scrolled) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-2 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-[#012520] text-stone-800 hover:text-[#F5B418] border border-stone-200 hover:border-[#012520] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md group"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-stone-800 group-hover:text-[#F5B418] transition-colors" />
          </button>
        )}

        {/* Right Slider Floating Arrow Icon (Prominent on the Right Side) */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="absolute right-2 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white/95 hover:bg-[#012520] text-stone-800 hover:text-[#F5B418] border border-stone-200 hover:border-[#012520] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer backdrop-blur-md group"
          aria-label="Next categories"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5] text-stone-800 group-hover:text-[#F5B418] transition-colors" />
        </button>

        {/* Smooth Horizontal Carousel Track */}
        <div
          ref={sliderRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-5 px-4 sm:px-2 no-scrollbar overscroll-x-contain"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {categories.map((cat, idx) => (
            <CategoryCardItem key={`cat-${cat._id || idx}`} cat={cat} priority={idx < 4} />
          ))}
        </div>
      </div>
    </section>
  );
}
