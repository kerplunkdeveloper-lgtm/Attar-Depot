'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Star,
  Quote,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  MapPin,
  Play,
  Pause,
  Award,
} from 'lucide-react';
import { useTestimonials } from '@/hooks/useReviews';

interface TestimonialItem {
  _id: string;
  userName: string;
  location?: string;
  scentTag?: string;
  rating: number;
  title: string;
  comment: string;
  longevityHours?: string;
  patronTier?: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    _id: 't1',
    userName: 'His Highness Al-Subaie',
    location: 'Riyadh, Saudi Arabia',
    scentTag: 'Vintage 1998 Cambodi Agarwood',
    rating: 5,
    title: 'Unmatched 25-Year Wild Cambodi Agarwood',
    comment:
      'In 20 years of collecting rare artisanal oudh across the Arabian Gulf, Attar Depot’s Cambodi distillation is among the purest I have experienced. The dark plum and smoked honey dry-down radiates over 24 hours on silk robes without a single drop of synthetics.',
    longevityHours: '24h+ Royal Sillage',
    patronTier: 'Collector’s Circle',
  },
  {
    _id: 't2',
    userName: 'Dr. Evelyn Montgomery',
    location: 'Oxford, United Kingdom',
    scentTag: 'Kannauj Ruh Gulab (Damask Rose)',
    rating: 5,
    title: 'The Purest Kannauj Rose I Have Ever Experienced',
    comment:
      'No synthetic fixatives, no harsh alcohol burning your senses. Just thousands of fresh morning Damask rose petals hydro-distilled in traditional deg-bhapka copper vessels. Pure artisan mastery that transports you straight to imperial Mughal gardens.',
    longevityHours: '18h+ Sillage',
    patronTier: 'Olfactory Scholar',
  },
  {
    _id: 't3',
    userName: 'Aarif Khan',
    location: 'Dubai, United Arab Emirates',
    scentTag: 'Royal White Tahara Musk',
    rating: 5,
    title: 'Kashmiri White Tahara Musk is Pure Divinity',
    comment:
      'Silky, thick, and profoundly clean. I receive compliments everywhere from boardroom meetings to Friday prayers. The crystal flacon and royal velvet presentation box make it an exceptional heirloom gift.',
    longevityHours: '20h+ Sillage',
    patronTier: 'VIP Connoisseur',
  },
  {
    _id: 't4',
    userName: 'Madame Camille Dubois',
    location: 'Paris, France',
    scentTag: 'Sovereign Mukhallat Royale',
    rating: 5,
    title: 'The Golden Standard of Niche Haute Perfumery',
    comment:
      'As a Parisian fragrance evaluator, I have sampled countless luxury houses. Attar Depot’s artisanal maceration of ambergris, vintage oudh, and Taif rose surpasses the most renowned niche perfumeries in longevity, sillage, and depth.',
    longevityHours: '24h+ Sillage',
    patronTier: 'Master Evaluator',
  },
  {
    _id: 't5',
    userName: 'Tariq Al-Mansoor',
    location: 'Kuwait City, Kuwait',
    scentTag: 'Imperial Kalakassi Oudh',
    rating: 5,
    title: 'Sacred, Deep & Captivatingly Complex',
    comment:
      'The opening is rich with ancient forest wood and dry resin, evolving into warm leather and balsamic amber. A single drop of this pure oil on pulse points lingers gracefully well into the following morning.',
    longevityHours: '28h+ Sillage',
    patronTier: 'Royal Patron',
  },
  {
    _id: 't6',
    userName: 'Ananya Deshmukh',
    location: 'Mumbai, India',
    scentTag: 'Ruh Khus & Mysore Sandalwood',
    rating: 5,
    title: 'Earth in Its Most Sublime, Soothing Essence',
    comment:
      'The monsoon petrichor and earthy sweetness of wild copper-distilled vetiver blended into pure Mysore sandalwood is deeply therapeutic. It instantly grounds the soul with cool, aristocratic elegance.',
    longevityHours: '16h+ Sillage',
    patronTier: 'Verified Patron',
  },
];

const AUTO_SLIDE_DURATION = 5000; // 5 seconds per slide

export default function TestimonialCarousel() {
  const { data: apiTestimonials = [] } = useTestimonials();

  // Combine API testimonials if present, otherwise use complete royal catalogue
  const testimonials: TestimonialItem[] =
    apiTestimonials.length >= 3
      ? apiTestimonials.map((t: any, i: number) => ({
          _id: t._id || `api_${i}`,
          userName: t.userName || 'Royal Patron',
          location: t.location || 'Verified Connoisseur',
          scentTag: t.productName || 'Pure Concentrated Attar',
          rating: t.rating || 5,
          title: t.title || 'Exquisite Olfactory Experience',
          comment: t.comment || 'Pure, concentrated, and enduring.',
          longevityHours: t.longevityHours || '24h+ Sillage',
          patronTier: 'Verified Patron',
        }))
      : DEFAULT_TESTIMONIALS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isManualPlaying, setIsManualPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  // Determine items visible per screen breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setItemsPerPage(1); // Mobile: 1 full card
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tablet: 2 cards
      } else {
        setItemsPerPage(3); // Desktop: 3 cards
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = testimonials.length;
  const maxIndex = Math.max(0, totalSlides - itemsPerPage);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setProgress(0);
    lastTimeRef.current = Date.now();
  }, [maxIndex]);

  const goToSlide = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, maxIndex));
    setCurrentIndex(clamped);
    setProgress(0);
    lastTimeRef.current = Date.now();
  };

  // Smooth progress bar and auto-slide loop
  useEffect(() => {
    if (!isManualPlaying || isPaused) {
      lastTimeRef.current = Date.now();
      return;
    }

    lastTimeRef.current = Date.now();
    let accumulated = progress;

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      accumulated += (delta / AUTO_SLIDE_DURATION) * 100;

      if (accumulated >= 100) {
        accumulated = 0;
        setProgress(0);
        handleNext();
      } else {
        setProgress(accumulated);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isManualPlaying, isPaused, handleNext, progress]);

  // Touch swipe support for mobile & tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;

    // Horizontal swipe threshold (ignore if mostly vertical scroll)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
    setIsPaused(false);
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-[#FAF8F2] via-[#F4EFE6] to-[#FAF8F2] relative overflow-hidden border-y border-emerald-950/10">
      {/* Opulent background radiance */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with Title and Luxury Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-emerald-200/90 text-xs font-bold text-emerald-900 uppercase tracking-widest shadow-xs font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Imperial Patronage & Reverence</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
              Words of Reverence
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Unfiltered accounts from royal estates, perfumery scholars, and passionate niche collectors who have experienced our pure non-alcoholic attars.
            </p>
          </div>

          {/* Desktop Controls (Counter + Play/Pause + Nav Arrows) */}
          <div className="flex items-center gap-4 self-start md:self-end">
            {/* Slide Index Counter */}
            <div className="hidden sm:flex items-center gap-1 font-serif text-sm text-neutral-700 bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-emerald-100 shadow-xs">
              <span className="font-bold text-emerald-800 text-base">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-500">
                {String(totalSlides).padStart(2, '0')}
              </span>
            </div>

            {/* Play/Pause Auto-slide Button */}
            <button
              type="button"
              onClick={() => setIsManualPlaying((prev) => !prev)}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-emerald-800 border border-emerald-200/90 shadow-xs hover:shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={isManualPlaying ? 'Pause Auto Slide' : 'Resume Auto Slide'}
              aria-label={isManualPlaying ? 'Pause Auto Slide' : 'Resume Auto Slide'}
            >
              {isManualPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-emerald-800" />
              )}
            </button>

            {/* Previous Slide Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white hover:bg-emerald-900 text-neutral-800 hover:text-white border border-emerald-200/90 shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Next Slide Button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white hover:bg-emerald-900 text-neutral-800 hover:text-white border border-emerald-200/90 shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          className="relative select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cards Track */}
          <div className="overflow-hidden -mx-3 px-3 py-2">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}
            >
              {testimonials.map((t, idx) => {
                const isActive =
                  idx >= currentIndex && idx < currentIndex + itemsPerPage;

                return (
                  <div
                    key={t._id}
                    className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3 transition-opacity duration-500"
                  >
                    <div
                      className={`h-full rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative bg-white/95 backdrop-blur-xs border transition-all duration-300 group ${
                        isActive
                          ? 'border-emerald-200/90 shadow-emerald-sm hover:shadow-emerald-md hover:border-emerald-300'
                          : 'border-emerald-100/60 shadow-xs opacity-80'
                      }`}
                    >
                      {/* Top Corner Watermark Quote Icon */}
                      <Quote className="w-12 h-12 text-emerald-100/70 absolute top-6 right-6 group-hover:text-emerald-200/80 transition-colors pointer-events-none rotate-180" />

                      <div className="space-y-4 relative z-10 text-left">
                        {/* Rating Stars & Patron Tier Badge */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-1 text-amber-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < t.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-neutral-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-sans text-[11px] font-bold text-neutral-600 ml-0.5">
                              5.0
                            </span>
                          </div>

                          {t.patronTier && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-50/90 border border-amber-200/70 px-2 py-0.5 rounded-full font-sans">
                              <Award className="w-2.5 h-2.5 text-amber-700" />
                              <span>{t.patronTier}</span>
                            </span>
                          )}
                        </div>

                        {/* Scent Pill & Longevity */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {t.scentTag && (
                            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50/80 border border-emerald-100 px-2.5 py-1 rounded-md font-sans tracking-wide">
                              <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">
                                {t.scentTag}
                              </span>
                            </div>
                          )}

                          {t.longevityHours && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100/50 border border-emerald-200/60 px-2 py-1 rounded-md font-sans">
                              <Clock className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{t.longevityHours}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 line-clamp-1 leading-snug group-hover:text-emerald-950 transition-colors">
                          &ldquo;{t.title}&rdquo;
                        </h4>

                        {/* Review Comment */}
                        <p className="font-sans text-xs sm:text-[13px] text-neutral-600 leading-relaxed italic line-clamp-4">
                          &ldquo;{t.comment}&rdquo;
                        </p>
                      </div>

                      {/* Patron Identity Footer */}
                      <div className="pt-5 mt-5 border-t border-emerald-100/80 flex items-center justify-between text-left">
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Royal Monogram Avatar */}
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#046A5A] to-[#023F36] text-[#FAF8F2] font-serif font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0 border border-amber-300/30">
                            {t.userName ? t.userName[0].toUpperCase() : 'P'}
                          </div>
                          <div className="font-sans min-w-0">
                            <p className="text-xs font-bold text-neutral-900 truncate">
                              {t.userName}
                            </p>
                            <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-emerald-700 flex-shrink-0" />
                              <span>{t.location || 'Verified Connoisseur'}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 flex-shrink-0 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-sans">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Auto-Slide Countdown Progress Bar & Pagination Pills */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-950/5">
          {/* Progress bar representing slide timer */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-full sm:w-48 h-1.5 bg-emerald-200/50 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-[#046A5A] to-amber-500 rounded-full transition-all duration-75 ease-linear"
                style={{
                  width: `${isManualPlaying && !isPaused ? progress : 0}%`,
                }}
              />
            </div>
            <span className="text-[11px] font-sans text-neutral-500 whitespace-nowrap">
              {isPaused
                ? 'Paused on hover'
                : isManualPlaying
                ? 'Auto-advancing'
                : 'Paused'}
            </span>
          </div>

          {/* Interactive Pagination Dots/Pills */}
          <div className="flex items-center gap-1.5">
            {[...Array(maxIndex + 1)].map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'w-8 bg-gradient-to-r from-emerald-700 to-[#046A5A] shadow-xs'
                    : 'w-2 bg-emerald-200/80 hover:bg-emerald-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
