'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  link?: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'banner-1',
    image: '/images/banner1.png',
    alt: 'Attar Depot Royal Fragrance Banner 1',
    link: '/shop',
  },
  {
    id: 'banner-2',
    image: '/images/bannerf1.png',
    alt: 'Attar Depot Exclusive Fragrance Banner 2',
    link: '/shop',
  },
];

const SLIDE_DURATION = 5000; // 5 seconds per slide
const TRANSITION_DURATION = 700; // 700ms smooth ease

export default function HeroBannerCarousel() {
  const realCount = BANNER_SLIDES.length;

  // Extended slides for seamless infinite loop: [last, ...slides, first]
  const extendedSlides = [
    BANNER_SLIDES[realCount - 1],
    ...BANNER_SLIDES,
    BANNER_SLIDES[0],
  ];

  // Start at index 1 (which corresponds to real slide 0)
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMovedRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(Date.now());
  const isTransitioningRef = useRef(false);

  // Calculate real active index (0 to realCount - 1)
  const activeRealIndex =
    currentIndex === 0
      ? realCount - 1
      : currentIndex === realCount + 1
      ? 0
      : currentIndex - 1;

  // Move to next slide
  const nextSlide = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, []);

  // Move to previous slide
  const prevSlide = useCallback(() => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, []);

  // Direct slide selection via pagination dots
  const goToSlide = (realIndex: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex(realIndex + 1);
    setProgress(0);
    lastTimeRef.current = Date.now();
  };

  // Seamless jump when reaching clones at either end
  const handleTransitionEnd = () => {
    isTransitioningRef.current = false;
    if (currentIndex === realCount + 1) {
      // Reached the clone of the first slide -> snap instantly to actual first slide
      setIsTransitioning(false);
      setCurrentIndex(1);
    } else if (currentIndex === 0) {
      // Reached the clone of the last slide -> snap instantly to actual last slide
      setIsTransitioning(false);
      setCurrentIndex(realCount);
    }
  };

  // Auto-slide timer and smooth progress indicator
  useEffect(() => {
    if (isPaused) {
      lastTimeRef.current = Date.now();
      return;
    }

    lastTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setProgress((prev) => {
        const nextProgress = prev + (elapsed / SLIDE_DURATION) * 100;
        if (nextProgress >= 100) {
          nextSlide();
          return 0;
        }
        return nextProgress;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMovedRef.current = false;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const diffX = Math.abs(e.touches[0].clientX - touchStartX.current);
      if (diffX > 10) {
        touchMovedRef.current = true;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Horizontal swipe threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      touchMovedRef.current = true;
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

  return (
    <section className="w-full max-w-8xl mx-auto px-2 sm:px-2 lg:px-2 pt-4 sm:pt-10">
      <div
        className="relative w-full rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden select-none group bg-[#012520] shadow-[0_10px_35px_rgba(1,37,32,0.22)] border border-[#C9A227]/25"
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
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning
              ? `transform ${TRANSITION_DURATION}ms cubic-bezier(0.25, 1, 0.5, 1)`
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className="w-full flex-shrink-0 relative"
            >
              {slide.link ? (
                <Link
                  href={slide.link}
                  onClick={(e) => {
                    if (touchMovedRef.current) {
                      e.preventDefault();
                      touchMovedRef.current = false;
                    }
                  }}
                  className="block w-full cursor-pointer select-none group/slide relative overflow-hidden"
                >
                  <div className="relative w-full h-[155px] xs:h-[185px] sm:h-[260px] md:h-[320px] lg:h-[380px] xl:h-[430px] 2xl:h-[460px] overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={index <= 2}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover/slide:scale-[1.015]"
                    />
                    {/* Subtle bottom vignette to blend beautifully with controls */}
                    <div className="absolute inset-x-0 bottom-0 h-8 sm:h-14 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </Link>
              ) : (
                <div className="block w-full select-none relative overflow-hidden">
                  <div className="relative w-full h-[155px] xs:h-[185px] sm:h-[260px] md:h-[320px] lg:h-[380px] xl:h-[430px] 2xl:h-[460px] overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.alt}
                      fill
                      priority={index <= 2}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1440px"
                      className="object-cover object-center"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-8 sm:h-14 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrow - Left (Desktop Only) */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="hidden sm:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#012520]/80 hover:bg-[#023830] text-[#FAF8F2] hover:text-[#F5B418] shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer border border-[#F5B418]/30 hover:border-[#F5B418]"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Navigation Arrow - Right (Desktop Only) */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next Slide"
          className="hidden sm:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-[#012520]/80 hover:bg-[#023830] text-[#FAF8F2] hover:text-[#F5B418] shadow-[0_4px_20px_rgba(0,0,0,0.45)] backdrop-blur-md items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer border border-[#F5B418]/30 hover:border-[#F5B418]"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Slide Counter Badge (Top Right) */}
        <div className="absolute top-2.5 sm:top-4 right-3 sm:right-5 z-20 hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#012520]/80 backdrop-blur-md text-white border border-[#F5B418]/30 text-[11px] sm:text-xs font-mono font-medium shadow-md">
          <span className="text-[#F5B418] font-bold">
            0{activeRealIndex + 1}
          </span>
          <span className="text-white/30">/</span>
          <span className="text-white/70">0{realCount}</span>
        </div>

        {/* Bottom Controls: Animated Progress Pills & Pause Indicator */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 z-20 bg-[#012520]/75 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-[#F5B418]/25 shadow-lg">
          {BANNER_SLIDES.map((slide, idx) => {
            const isActive = activeRealIndex === idx;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className="relative h-1.5 sm:h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none"
                style={{
                  width: isActive ? '28px' : '8px',
                  backgroundColor: isActive ? 'rgba(245,180,24,0.2)' : 'rgba(255,255,255,0.3)',
                }}
              >
                {/* Dynamic Animated Progress Bar Fill */}
                {isActive && (
                  <div
                    className="h-full bg-gradient-to-r from-[#F5B418] via-[#FFDF78] to-[#F5B418] rounded-full transition-all duration-75 ease-linear shadow-[0_0_8px_rgba(245,180,24,0.7)]"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
