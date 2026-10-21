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
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);
  const [isMobilePaused, setIsMobilePaused] = useState(false);
  const mobilePauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter only active, valid categories from database
  const categories = useMemo(() => {
    return (apiCategories || []).filter((c) => c && c.isActive !== false && Boolean(c.name));
  }, [apiCategories]);

  // Infinite duplicated set for Desktop continuous marquee (minimum 2 duplicates for seamless -50% loop)
  const desktopMarqueeSets = useMemo(() => {
    if (!categories.length) return [];
    return [...categories, ...categories];
  }, [categories]);

  // Calculate dynamic animation duration based on item count for consistent glide speed (~40s per full cycle)
  const marqueeDuration = useMemo(() => {
    const baseSecondsPerItem = 8;
    return Math.max(32, categories.length * baseSecondsPerItem);
  }, [categories.length]);

  // Monitor mobile scroll position for chevron buttons
  const checkMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = mobileScrollRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
  }, []);

  useEffect(() => {
    const el = mobileScrollRef.current;
    if (!el) return;
    checkMobileScroll();
    el.addEventListener('scroll', checkMobileScroll, { passive: true });
    window.addEventListener('resize', checkMobileScroll);
    return () => {
      el.removeEventListener('scroll', checkMobileScroll);
      window.removeEventListener('resize', checkMobileScroll);
    };
  }, [checkMobileScroll, categories.length]);

  // Temporary pause handler on mobile touch interaction
  const pauseMobileTemporarily = useCallback((duration = 4000) => {
    setIsMobilePaused(true);
    if (mobilePauseTimeoutRef.current) clearTimeout(mobilePauseTimeoutRef.current);
    mobilePauseTimeoutRef.current = setTimeout(() => {
      setIsMobilePaused(false);
    }, duration);
  }, []);

  const handleMobileScroll = (direction: 'left' | 'right') => {
    pauseMobileTemporarily(4500);
    if (!mobileScrollRef.current) return;
    const { scrollLeft, clientWidth } = mobileScrollRef.current;
    const card = mobileScrollRef.current.querySelector('.group\\/card') as HTMLElement | null;
    const scrollAmount = card ? card.offsetWidth + 20 : clientWidth * 0.75;
    mobileScrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  // Mobile Auto-Scroll Loop (every 3.8s, pauses on touch)
  useEffect(() => {
    if (isMobilePaused || categories.length <= 1) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      const el = mobileScrollRef.current;
      if (!el) return;

      const card = el.querySelector('.group\\/card') as HTMLElement | null;
      const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.75;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isMobilePaused, categories.length]);

  // Strictly dynamic: If loading or no categories exist in database, render nothing
  if (isLoading || categories.length === 0) {
    return null;
  }

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Header with Title and Controls */}
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1 sm:space-y-1.5">
         
          <h2 className="font-serif text-2xl sm:text-3xl uppercase font-light text-neutral-900 tracking-tight">
            Our Categories
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Mobile "View All" Pill */}
          <Link
            href="/shop"
            className="sm:hidden inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 hover:text-emerald-700 uppercase tracking-wider py-1.5 px-3 rounded-full bg-emerald-50 border border-emerald-200/80 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3 text-[#C9A227]" />
          </Link>

          {/* Smooth Scroll Navigation Arrows (Mobile & Tablet) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleMobileScroll('left')}
              disabled={!canScrollLeft}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollLeft
                  ? 'border-stone-300 bg-white text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-sm active:scale-95 cursor-pointer'
                  : 'border-stone-200/80 bg-white/40 text-stone-300 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleMobileScroll('right')}
              disabled={!canScrollRight}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${
                canScrollRight
                  ? 'border-stone-300 bg-white text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-sm active:scale-95 cursor-pointer'
                  : 'border-stone-200/80 bg-white/40 text-stone-300 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DESKTOP VIEW: Continuous 60fps Seamless Automatic Marquee               */}
      {/* ========================================================================= */}
      <div
        className="hidden md:block relative w-full overflow-hidden py-2"
        onMouseEnter={() => setIsMarqueePaused(true)}
        onMouseLeave={() => setIsMarqueePaused(false)}
      >
        {/* Soft Edge Fade Masks (Left & Right) for luxury seamless portal look */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 lg:w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 lg:w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-20" />

        {/* Marquee Infinite Gliding Track */}
        <div
          className={`category-marquee-track ${isMarqueePaused ? 'marquee-paused' : ''}`}
          style={{
            animationDuration: `${marqueeDuration}s`,
          }}
        >
          {desktopMarqueeSets.map((cat, idx) => (
            <CategoryCardItem key={`marquee-${cat._id || idx}-${idx}`} cat={cat} priority={idx < 4} />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE VIEW: Touch-Friendly Swipeable Carousel with Snap & Auto-Scroll  */}
      {/* ========================================================================= */}
      <div
        className="md:hidden relative group/carousel -mx-4"
        onTouchStart={() => pauseMobileTemporarily(5000)}
        onTouchEnd={() => pauseMobileTemporarily(3000)}
      >
        <div
          ref={mobileScrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-2 pb-6 px-4 no-scrollbar overscroll-x-contain"
        >
          {categories.map((cat, idx) => (
            <CategoryCardItem key={`mobile-${cat._id || idx}`} cat={cat} priority={idx < 2} />
          ))}
        </div>
      </div>

      {/* Pure CSS 60fps Hardware-Accelerated Marquee Animation */}
      <style jsx>{`
        @keyframes categoryInfiniteMarquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .category-marquee-track {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          will-change: transform;
          animation-name: categoryInfiniteMarquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .category-marquee-track:hover,
        .category-marquee-track.marquee-paused {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}
