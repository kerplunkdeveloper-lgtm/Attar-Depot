'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTestimonials } from '@/hooks/useReviews';

interface TestimonialItem {
  id: string;
  userName: string;
  subtitle: string;
  rating: number;
  comment: string;
  avatarUrl: string;
}

const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    userName: 'Simran R.',
    subtitle: 'Oud Series Gift Box',
    rating: 5,
    comment:
      "Finding a luxury gift that's both meaningful and elegant isn't easy, but Attar Depot got it right. The attar collection arrived beautifully packaged, and it was one of the most appreciated gifts I've ever given.",
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 't2',
    userName: 'Ani S.',
    subtitle: 'Misk Rijali Gift Box',
    rating: 5,
    comment:
      "I ordered an Attar Depot gift box for my brother, and the presentation alone made it feel incredibly special. The fragrances were beautifully curated, and the premium packaging meant I didn't even need additional gift wrapping.",
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 't3',
    userName: 'Riya M.',
    subtitle: 'Wisal series Gift Set',
    rating: 5,
    comment:
      "Attar Depot's gift set was exactly what I was looking for. The fragrances felt luxurious, the presentation was beautiful, and it made the gift feel truly special. It's one of those gifts that leaves a lasting impression.",
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 't4',
    userName: 'Sameer K.',
    subtitle: 'Imperial Oudh Collection',
    rating: 5,
    comment:
      "I've been using Attar Depot for over a decade, and they never disappoint. The fragrances are long-lasting, authentic, and truly unique.",
    avatarUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 't5',
    userName: 'Dr. Evelyn M.',
    subtitle: 'Pure Botanical Series',
    rating: 5,
    comment:
      'No synthetic fixatives, no harsh alcohol burning your senses. Just pure morning Damask rose and Mysore sandalwood hydro-distilled in traditional copper degs. Pure artisan mastery.',
    avatarUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
  },
  {
    id: 't6',
    userName: 'Aarif K.',
    subtitle: 'Royal White Tahara Musk',
    rating: 5,
    comment:
      'Silky, thick, and profoundly clean. I receive compliments everywhere from boardroom meetings to family gatherings. The crystal flacon and royal packaging make it exceptional.',
    avatarUrl:
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
  },
];

export default function TestimonialCarousel() {
  const { data: apiTestimonials = [] } = useTestimonials();
  const carouselRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  // Combine API testimonials if present, with reference testimonials
  const testimonials: TestimonialItem[] = React.useMemo(() => {
    if (apiTestimonials && apiTestimonials.length >= 3) {
      const mappedApi: TestimonialItem[] = apiTestimonials.map((t: any, i: number) => ({
        id: t._id || `api_${i}`,
        userName: t.userName || 'Royal Patron',
        subtitle: t.productName || 'Attar Special Edition',
        rating: t.rating || 5,
        comment: t.comment || 'Pure, concentrated, and enduring fragrance of unparalleled quality.',
        avatarUrl:
          t.avatarUrl ||
          DEFAULT_TESTIMONIALS[i % DEFAULT_TESTIMONIALS.length].avatarUrl,
      }));
      return [...DEFAULT_TESTIMONIALS, ...mappedApi];
    }
    return DEFAULT_TESTIMONIALS;
  }, [apiTestimonials]);

  // Update scroll navigation buttons state & active dot
  const updateScrollState = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate index for dots
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 20
      : 360;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveDot(Math.min(index, testimonials.length - 1));
  }, [testimonials.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  // Next / Prev scroll actions
  const scroll = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;

    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : 360;

    if (direction === 'left') {
      el.scrollBy({ left: -step, behavior: 'smooth' });
    } else {
      // Loop to beginning if at the end
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }
  };

  const scrollToIndex = (idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : 360;
    el.scrollTo({ left: idx * step, behavior: 'smooth' });
  };

  // Auto-scroll loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;

      const card = el.firstElementChild as HTMLElement | null;
      const step = card ? card.offsetWidth + 24 : 360;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-14 sm:py-20  relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading matching reference design */}
        <div className="text-center mb-10 sm:mb-14 relative">
          <h2 className="font-sans text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.2em] text-neutral-900 uppercase">
            TESTIMONIALS
          </h2>
        </div>

        {/* Carousel Container */}
        <div
          className="relative group/carousel"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Navigation Arrow - Left */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              className="hidden sm:flex absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#EADBCA] shadow-md text-neutral-800 hover:text-black hover:bg-[#FAF3E8] items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          {/* Navigation Arrow - Right */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              className="hidden sm:flex absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 border border-[#EADBCA] shadow-md text-neutral-800 hover:text-black hover:bg-[#FAF3E8] items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C9A227]/40"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          )}

          {/* Scrollable Track - Responsive Widths with peek effect matching reference image */}
          <div
            ref={carouselRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth py-2 px-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="w-[84vw] sm:w-[360px] md:w-[350px] lg:w-[calc((100%-48px)/3.18)] shrink-0 snap-start"
              >
                <div className="bg-[#FAF3E8] border border-[#EADBCA] rounded-xs p-6 sm:p-7 md:p-8 flex flex-col justify-between h-full min-h-[300px] sm:min-h-[320px] transition-shadow duration-300 hover:shadow-sm">
                  {/* Top: 5 Stars */}
                  <div>
                    <div className="flex items-center gap-1 mb-5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 fill-[#4A4A4A] text-[#4A4A4A]"
                        />
                      ))}
                    </div>

                    {/* Middle: Review text with quotes */}
                    <p className="font-sans text-[13.5px] sm:text-[14.5px] leading-[1.65] text-[#262626] font-normal">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  </div>

                  {/* Bottom: Profile avatar, name, and subtitle */}
                  <div className="flex items-center gap-3.5 mt-8 pt-2">
                    {/* Grayscale Avatar with fallback */}
                    <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 bg-neutral-300 border border-neutral-300/60">
                      <img
                        src={item.avatarUrl}
                        alt={item.userName}
                        className="w-full h-full object-cover grayscale contrast-110"
                        loading="lazy"
                        onError={(e) => {
                          // Hide broken image and reveal styled initial fallback
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.classList.add(
                              'flex',
                              'items-center',
                              'justify-center',
                              'bg-neutral-800',
                              'text-white',
                              'font-medium',
                              'text-xs'
                            );
                            parent.innerText = item.userName[0];
                          }
                        }}
                      />
                    </div>

                    {/* Author Details */}
                    <div className="min-w-0">
                      <h4 className="text-[14px] font-semibold text-neutral-900 truncate leading-snug">
                        {item.userName}
                      </h4>
                      <p className="text-[12px] text-neutral-500 truncate mt-0.5 font-normal">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Pagination Indicators & Mobile Swipe Hint */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeDot === idx
                  ? 'w-6 bg-neutral-800'
                  : 'w-1.5 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

