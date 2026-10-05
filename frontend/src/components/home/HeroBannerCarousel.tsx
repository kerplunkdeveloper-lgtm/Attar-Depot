'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Crown, Sparkles } from 'lucide-react';
import { useBanners, useTrackBannerClick } from '@/hooks/useBanners';

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  link?: string;
  openInNewTab?: boolean;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: 'default-1',
    image: '/images/banner1.png',
    alt: 'Attar Depot Royal Heritage Fragrance Banner',
    link: '/shop',
  },
  {
    id: 'default-2',
    image: '/images/bannerf1.png',
    alt: 'Attar Depot Exclusive Artisanal Distillations',
    link: '/gifting',
  },
  {
    id: 'default-3',
    image: '/images/banner2.png',
    alt: 'Attar Depot Pure Traditional Attars',
    link: '/corporate-gifting',
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 700; // 700ms smooth ease

export default function HeroBannerCarousel() {
  const { data: bannerData } = useBanners();
  const trackClick = useTrackBannerClick();

  // Compute dynamic slides from backend or fallback to default
  const slides: BannerSlide[] = useMemo(() => {
    if (bannerData?.banners && bannerData.banners.length > 0) {
      return bannerData.banners.map((b) => ({
        id: b._id,
        image: b.image,
        alt: b.title || 'Attar Depot Luxury Fragrance',
        link: b.link || '/shop',
        openInNewTab: b.openInNewTab,
      }));
    }
    return DEFAULT_SLIDES;
  }, [bannerData]);

  const realCount = slides.length;
  const isMultiple = realCount > 1;

  // Extended slides for seamless infinite loop: [last, ...slides, first]
  const extendedSlides = useMemo(() => {
    if (!isMultiple) return slides;
    return [slides[realCount - 1], ...slides, slides[0]];
  }, [slides, realCount, isMultiple]);

  // Start at index 1 (which corresponds to real slide 0)
  const [currentIndex, setCurrentIndex] = useState(isMultiple ? 1 : 0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync index when slides change
  useEffect(() => {
    setCurrentIndex(isMultiple ? 1 : 0);
    setProgress(0);
  }, [realCount, isMultiple]);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMovedRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(Date.now());
  const isTransitioningRef = useRef(false);

  // Calculate real active index (0 to realCount - 1)
  const activeRealIndex = isMultiple
    ? currentIndex === 0
      ? realCount - 1
      : currentIndex === realCount + 1
      ? 0
      : currentIndex - 1
    : 0;

  // Move to next slide
  const nextSlide = useCallback(() => {
    if (!isMultiple || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setProgress(0);
  }, [isMultiple]);

  // Move to previous slide
  const prevSlide = useCallback(() => {
    if (!isMultiple || isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setProgress(0);
  }, [isMultiple]);

  // Go to specific real index
  const goToSlide = (realIndex: number) => {
    if (isTransitioningRef.current || !isMultiple) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex(realIndex + 1);
    setProgress(0);
  };

  // Handle transition end for seamless infinite loop
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    if (!isMultiple) return;

    if (currentIndex === realCount + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(realCount);
    }
  };

  // Autoplay timer with progress bar
  useEffect(() => {
    if (!isMultiple || isPaused) return;

    lastTimeRef.current = Date.now();
    const interval = 50;

    const timer = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setProgress((prev) => {
        const nextVal = prev + (delta / SLIDE_DURATION) * 100;
        if (nextVal >= 100) {
          nextSlide();
          return 0;
        }
        return nextVal;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isMultiple, isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMovedRef.current = false;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.touches[0].clientX;
    const diffY = touchStartY.current - e.touches[0].clientY;

    if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
      touchMovedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setIsPaused(false);
  };

  const handleBannerClick = (slide: BannerSlide, e: React.MouseEvent) => {
    if (touchMovedRef.current) {
      e.preventDefault();
      touchMovedRef.current = false;
      return;
    }
    if (slide.id && !slide.id.startsWith('default-')) {
      trackClick.mutate(slide.id);
    }
  };

  return (
    <section className="w-full relative overflow-hidden select-none ">
      <div
        className="relative w-full overflow-hidden select-none group"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Promotional Banner Carousel"
      >
        {/* Slides Viewport Container */}
        <div
          className="flex will-change-transform"
          style={{
            transform: isMultiple ? `translateX(-${currentIndex * 100}%)` : 'none',
            transition:
              isMultiple && isTransitioning
                ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`
                : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => {
            const isExternal = slide.link?.startsWith('http://') || slide.link?.startsWith('https://');

            const content = (
              <div className="relative w-full aspect-[21/9] sm:aspect-[21/8] lg:aspect-[21/7.5] min-h-[220px] xs:min-h-[260px] sm:min-h-[380px] md:min-h-[460px] lg:min-h-[560px] xl:min-h-[640px] 2xl:min-h-[700px] overflow-hidden">
                <Image
                  src={slide.image}
                  alt={slide.alt || 'Attar Depot Hero Banner'}
                  fill
                  priority={index <= 2}
                  sizes="100vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover/slide:scale-[1.015]"
                />

                {/* Subtle top vignette to ensure transparent navbar menu readability */}
                <div className="absolute inset-x-0 top-0 h-32 sm:h-44 bg-gradient-to-b from-[#011C16]/85 via-[#011C16]/35 to-transparent pointer-events-none" />

                {/* Subtle luxury bottom vignette to blend into page */}
                <div className="absolute inset-x-0 bottom-0 h-12 sm:h-20 bg-gradient-to-t from-[#011C16]/80 via-transparent to-transparent pointer-events-none" />
              </div>
            );

            return (
              <div
                key={`${slide.id}-${index}`}
                className="w-full flex-shrink-0 relative"
              >
                {slide.link ? (
                  isExternal ? (
                    <a
                      href={slide.link}
                      target={slide.openInNewTab ? '_blank' : '_self'}
                      rel={slide.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleBannerClick(slide, e)}
                      className="block w-full cursor-pointer select-none group/slide relative overflow-hidden"
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={slide.link}
                      target={slide.openInNewTab ? '_blank' : undefined}
                      rel={slide.openInNewTab ? 'noopener noreferrer' : undefined}
                      onClick={(e) => handleBannerClick(slide, e)}
                      className="block w-full cursor-pointer select-none group/slide relative overflow-hidden"
                    >
                      {content}
                    </Link>
                  )
                ) : (
                  <div className="block w-full select-none relative overflow-hidden">
                    {content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrow - Left (Circular black translucent button, reference match) */}
        {isMultiple && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="flex absolute left-3 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white shadow-2xl backdrop-blur-md items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-white/20 hover:border-[#F5B418]"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.2]" />
          </button>
        )}

        {/* Navigation Arrow - Right (Circular black translucent button, reference match) */}
        {isMultiple && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="flex absolute right-3 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white shadow-2xl backdrop-blur-md items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-white/20 hover:border-[#F5B418]"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.2]" />
          </button>
        )}

        {/* Mystery Discount Badge (Reference Match - Bottom Left) */}
        <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-6 z-20 hidden md:block">
          <Link
            href="/shop?filter=sale"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C5A059]/90 hover:bg-[#D49E24] text-white shadow-lg backdrop-blur-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 border border-white/20"
          >
            <Sparkles className="w-3 h-3 text-amber-100" />
            <span>Mystery Discount</span>
          </Link>
        </div>

        {/* Royal Heritage Seal Badge (Reference Match - Bottom Right) */}
        <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-6 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 text-[#012520] shadow-xl border border-amber-300/60 backdrop-blur-md select-none">
          <div className="w-5 h-5 rounded-full bg-[#012520] text-[#F5B418] flex items-center justify-center">
            <Crown className="w-3 h-3 text-[#F5B418]" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Attar Depot • Pure Attar
          </span>
        </div>

        {/* Slide Counter Badge (Top Right) */}
        {isMultiple && (
          <div className="absolute top-4 sm:top-6 right-4 sm:right-8 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#011C16]/80 backdrop-blur-md text-white border border-[#F5B418]/40 text-xs font-mono font-medium shadow-md">
            <span className="text-[#F5B418] font-bold">
              0{activeRealIndex + 1}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/70">0{realCount}</span>
          </div>
        )}

        {/* Bottom Controls: Animated Progress Pills */}
        {isMultiple && (
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-[#011C16]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#F5B418]/30 shadow-xl">
            {slides.map((slide, idx) => {
              const isActive = activeRealIndex === idx;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none"
                  style={{
                    width: isActive ? '32px' : '8px',
                    backgroundColor: isActive ? 'rgba(245,180,24,0.25)' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {/* Dynamic Animated Progress Bar Fill */}
                  {isActive && (
                    <div
                      className="h-full bg-gradient-to-r from-[#F5B418] via-[#FFDF78] to-[#F5B418] rounded-full transition-all duration-75 ease-linear shadow-[0_0_8px_rgba(245,180,24,0.8)]"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
