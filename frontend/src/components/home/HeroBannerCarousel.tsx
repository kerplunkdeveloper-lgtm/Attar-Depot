'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
    alt: 'Attar Depot Royal Heritage Fragrance - Find Your Signature',
    link: '/shop',
  },
  {
    id: 'default-2',
    image: '/images/bannerf1.png',
    alt: 'Attar Depot Fruity Scents - A Burst of Freshness',
    link: '/shop',
  },
  {
    id: 'default-3',
    image: '/images/giftbanner1.png',
    alt: 'Attar Depot Luxury Fragrance Gifting Sets',
    link: '/gifting',
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 650; // 650ms smooth luxury easing

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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

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
    <section className="w-full relative select-none p-0 m-0 overflow-hidden bg-[#011C16]">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none group isolate"
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
                ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
                : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => {
            const isExternal = slide.link?.startsWith('http://') || slide.link?.startsWith('https://');

            const content = (
              <div className="relative w-full overflow-hidden bg-[#011C16]">
                {/* Unified Responsive Banner Viewport: Desktop banner image is used across all screen sizes (mobile & desktop) */}
                <div className="relative w-full aspect-[21/9] sm:aspect-[21/8.4] lg:aspect-[21/8] xl:aspect-[21/7.8] min-h-[160px] xs:min-h-[185px] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[520px] xl:min-h-[600px] 2xl:min-h-[660px] overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.alt || 'Attar Depot Luxury Hero Banner'}
                    fill
                    priority={index <= 2}
                    sizes="100vw"
                    quality={95}
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover/slide:scale-[1.018]"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  {/* Subtle luxury bottom edge blend */}
                  <div className="absolute inset-x-0 bottom-0 h-6 sm:h-12 bg-gradient-to-t from-[#011C16]/40 via-transparent to-transparent pointer-events-none" />
                </div>
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

        {/* Navigation Arrow - Left */}
        {isMultiple && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#011C16]/75 hover:bg-[#F5B418] text-[#FAF8F2] hover:text-[#011C16] shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:-translate-x-2 sm:group-hover:translate-x-0 z-20 cursor-pointer border border-[#F5B418]/40 hover:border-[#F5B418] active:scale-95 hover:scale-105"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.2]" />
          </button>
        )}

        {/* Navigation Arrow - Right */}
        {isMultiple && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-[#011C16]/75 hover:bg-[#F5B418] text-[#FAF8F2] hover:text-[#011C16] shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-2 sm:group-hover:translate-x-0 z-20 cursor-pointer border border-[#F5B418]/40 hover:border-[#F5B418] active:scale-95 hover:scale-105"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 stroke-[2.2]" />
          </button>
        )}

        {/* Slide Counter Badge (Top Right) */}
        {isMultiple && (
          <div className="absolute top-2 sm:top-5 right-2 sm:right-6 z-20 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#011C16]/85 backdrop-blur-md text-white border border-[#F5B418]/40 text-[10px] sm:text-xs font-mono font-medium shadow-lg select-none">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F5B418]" />
            <span className="text-[#F5B418] font-bold">
              0{activeRealIndex + 1}
            </span>
            <span className="text-white/30">/</span>
            <span className="text-white/70">0{realCount}</span>
          </div>
        )}

        {/* Bottom Controls: Animated Story Progress Pills */}
        {isMultiple && (
          <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2.5 z-20 bg-[#011C16]/85 backdrop-blur-md px-2.5 sm:px-4 py-1 sm:py-2 rounded-full border border-[#F5B418]/35 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {slides.map((slide, idx) => {
              const isActive = activeRealIndex === idx;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className="relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none group/pill py-1 -my-1"
                  style={{
                    width: isActive ? '28px' : '8px',
                    backgroundColor: isActive ? 'rgba(245,180,24,0.25)' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {/* Dynamic Animated Progress Bar Fill */}
                  {isActive ? (
                    <div
                      className="h-full bg-gradient-to-r from-[#F5B418] via-[#FFE28A] to-[#F5B418] rounded-full transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(245,180,24,0.9)]"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  ) : (
                    <div className="h-full w-full group-hover/pill:bg-white/50 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom 24k Gold Hairline Border Divider */}
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418]/50 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
