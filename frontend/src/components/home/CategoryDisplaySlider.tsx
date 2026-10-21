'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Droplets } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

function CategoryCardItem({ cat }: { cat: any }) {
  const [imgError, setImgError] = useState(false);
  const rawImage = cat.image || cat.imageUrl || '';
  const hasValidImage = Boolean(
    !imgError &&
    rawImage &&
    typeof rawImage === 'string' &&
    rawImage.trim().length > 5
  );

  return (
    <div className="w-[310px] xs:w-[350px] sm:w-[430px] md:w-[490px] lg:w-[550px] xl:w-[580px] flex-shrink-0 snap-start flex flex-col group/card">
      <Link
        href={`/shop?category=${cat.slug || cat._id}`}
        className="block relative w-full h-[370px] xs:h-[390px] sm:h-[430px] md:h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 hover:border-[#F5B418] shadow-md hover:shadow-[0_20px_40px_rgba(1,37,32,0.25)] transition-all duration-500 bg-[#0A1917]"
      >
        {/* Crystal Clear Category Background Image */}
        {hasValidImage ? (
          <Image
            src={rawImage}
            alt={cat.name}
            fill
            unoptimized
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

        {/* Minimal Bottom Gradient - Leaves 75% of the image 100% bright and clear */}
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter only active, valid categories from database - strictly dynamic data only
  const categories = useMemo(() => {
    return (apiCategories || []).filter((c) => c && c.isActive !== false && Boolean(c.name));
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

  // Viewport observer: only auto-scroll when section is in viewport
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Temporary pause on manual button click or touch interaction
  const pauseTemporarily = useCallback((duration = 4000) => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, duration);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    pauseTemporarily(4500);
    if (!scrollContainerRef.current) return;
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const card = scrollContainerRef.current.querySelector('.group\\/card') as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 24 : clientWidth * 0.75;
    scrollContainerRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  // Luxury Auto-Scroll Loop (slides smoothly every 3.8 seconds, pauses on hover/touch)
  useEffect(() => {
    if (isPaused || !isInView || categories.length <= 1) return;

    const interval = setInterval(() => {
      if (document.hidden) return;

      const el = scrollContainerRef.current;
      if (!el) return;

      const card = el.querySelector('.group\\/card') as HTMLElement | null;
      const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.75;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        // Smoothly loop back to start when reaching end
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused, isInView, categories.length]);

  // Strictly dynamic: If loading or no categories exist in database, render nothing
  if (isLoading || categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1 sm:space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl uppercase font-light text-neutral-900 tracking-tight">
            Our Categories
          </h2>
        </div>

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
      </div>

      {/* Categories Horizontal Slider Container with Auto-Scroll & Hover/Touch Pause */}
      <div
        className="relative group/carousel -mx-4 sm:mx-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => pauseTemporarily(5000)}
        onTouchEnd={() => pauseTemporarily(3000)}
      >
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-6 px-4 sm:px-0.5 no-scrollbar overscroll-x-contain"
        >
          {categories.map((cat) => (
            <CategoryCardItem key={cat._id} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
