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
  },
  {
    id: 'banner-2',
    image: '/images/bannerf1.png',
    alt: 'Attar Depot Exclusive Fragrance Banner 2',
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
    <section
      className="relative w-full overflow-hidden select-none group bg-neutral-900"
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
                className="block w-full cursor-pointer select-none"
              >
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={1920}
                  height={800}
                  priority={index <= 2}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                />
              </Link>
            ) : (
              <div className="block w-full select-none">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  width={1920}
                  height={800}
                  priority={index <= 2}
                  sizes="100vw"
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrow - Left */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-emerald-950 shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-emerald-100/50"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Navigation Arrow - Right */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/80 hover:bg-white text-emerald-950 shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-20 cursor-pointer border border-emerald-100/50"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Counter Badge (Top Right) */}
      <div className="absolute top-3 sm:top-5 right-4 sm:right-6 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 text-xs font-sans font-medium">
        <span className="text-emerald-400 font-bold">
          0{activeRealIndex + 1}
        </span>
        <span className="text-white/40">/</span>
        <span className="text-white/70">0{realCount}</span>
      </div>

      {/* Bottom Controls: Animated Progress Pills & Pause Indicator */}
      <div className="absolute bottom-2 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 z-20 bg-black/40 backdrop-blur-md px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-white/15">
        {BANNER_SLIDES.map((slide, idx) => {
          const isActive = activeRealIndex === idx;

          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer focus:outline-none"
              style={{
                width: isActive ? '36px' : '10px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.5)',
              }}
            >
              {/* Dynamic Animated Progress Bar Fill */}
              {isActive && (
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-amber-300 rounded-full transition-all duration-75 ease-linear"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
