'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { motion } from 'framer-motion';

interface CuratedCategoryItem {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  image: string;
  badge?: string;
  itemCount?: string;
}

const DEFAULT_CURATED_CATEGORIES: CuratedCategoryItem[] = [
  {
    id: 'cat-dehn-al-oudh',
    name: 'Dehn Al Oudh',
    slug: 'dehn-al-oudh',
    subtitle: 'Wild Assamese Agarwood Distilled in Generational Degs',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=900',
    badge: 'Royal Heritage',
    itemCount: 'Pure Agarwood',
  },
  {
    id: 'cat-royal-musk',
    name: 'Royal Musk',
    slug: 'royal-musk',
    subtitle: 'Silky White Tahara & Intoxicating Kashmiri Musk',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=900',
    badge: 'Bestseller',
    itemCount: 'Velvety & Enduring',
  },
  {
    id: 'cat-floral-gulab',
    name: 'Floral & Gulab',
    slug: 'floral-gulab-attar',
    subtitle: 'Hydro-Distilled Kannauj Damask Rose & Ruh Motia',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=900',
    badge: 'Botanical Bloom',
    itemCount: 'Pure Hydro-Distill',
  },
  {
    id: 'cat-amber-woods',
    name: 'Amber & Woods',
    slug: 'amber-woods',
    subtitle: 'Warm Golden Amber Resins & Vintage Mysore Sandalwood',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=900',
    badge: 'Signature Accord',
    itemCount: 'Warm & Smoky',
  },
  {
    id: 'cat-french-oriental',
    name: 'French Oriental',
    slug: 'french-oriental-blends',
    subtitle: 'Parisian Chic Elegance Marrying Deep Arabian Sillage',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=900',
    badge: 'Modern Royalty',
    itemCount: 'Complex Sillage',
  },
  {
    id: 'cat-mukhallat',
    name: 'Artisanal Blends',
    slug: 'artisanal-mukhallat',
    subtitle: 'Complex Imperial Blends of Saffron, Oudh & Ambergris',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=900',
    badge: 'Master Reserve',
    itemCount: 'Exclusive Reserve',
  },
];

export default function CategoryDisplaySlider() {
  const { data: apiCategories = [] } = useCategories();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // Combine database categories with curated high-definition imagery
  const categoryItems: CuratedCategoryItem[] = useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) {
      return DEFAULT_CURATED_CATEGORIES;
    }

    const mapped = apiCategories.map((apiCat, idx) => {
      const match = DEFAULT_CURATED_CATEGORIES.find(
        (def) =>
          def.slug.toLowerCase() === apiCat.slug.toLowerCase() ||
          def.name.toLowerCase().includes(apiCat.name.toLowerCase()) ||
          apiCat.name.toLowerCase().includes(def.name.toLowerCase())
      );

      return {
        id: apiCat._id || `cat-${idx}`,
        name: apiCat.name,
        slug: apiCat.slug,
        subtitle:
          apiCat.description ||
          match?.subtitle ||
          'Pure artisanal non-alcoholic fragrance distillation',
        image:
          apiCat.image && apiCat.image.startsWith('http')
            ? apiCat.image
            : match?.image || DEFAULT_CURATED_CATEGORIES[idx % DEFAULT_CURATED_CATEGORIES.length].image,
        badge: match?.badge || (apiCat.featured ? 'Featured' : 'Signature'),
        itemCount: match?.itemCount || `${apiCat.productCount || 8}+ Flacons`,
      };
    });

    if (mapped.length < 4) {
      const existingSlugs = new Set(mapped.map((c) => c.slug.toLowerCase()));
      const extra = DEFAULT_CURATED_CATEGORIES.filter((c) => !existingSlugs.has(c.slug.toLowerCase()));
      return [...mapped, ...extra];
    }

    return mapped;
  }, [apiCategories]);

  const N = categoryItems.length;
  // 4 clone repeats ensures full buffer across wide displays and infinite seamless wrap
  const repeats = 4;
  const clonedItems = useMemo(() => {
    if (N === 0) return [];
    const list: Array<CuratedCategoryItem & { _uniqueKey: string }> = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < N; i++) {
        list.push({
          ...categoryItems[i],
          _uniqueKey: `${categoryItems[i].id}_r${r}_${i}`,
        });
      }
    }
    return list;
  }, [categoryItems, N]);

  // Motion physics and scroll tracking state (Refs for 60/120fps direct hardware transform)
  const scrollPosRef = useRef(0);
  const singleSetWidthRef = useRef(1600);
  const stepWidthRef = useRef(270);
  const cruiseSpeedRef = useRef(0.68); // 0.68px per frame at 60fps = ~41px/s smooth gliding
  const currentSpeedRef = useRef(0.68);
  const isHoveredRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isAnimatingStepRef = useRef(false);
  const isInViewRef = useRef(true);
  const hasDraggedFarRef = useRef(false);

  // Gesture tracking
  const pointerStartXRef = useRef(0);
  const pointerStartYRef = useRef(0);
  const pointerStartScrollPosRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const pointerVelocityXRef = useRef(0);
  const gestureDirectionRef = useRef<'none' | 'horizontal' | 'vertical'>('none');
  const stepAnimationRafRef = useRef<number | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isHoveredState, setIsHoveredState] = useState(false);

  // Measure card dimensions and total single-set width
  const measureDimensions = useCallback(() => {
    if (firstCardRef.current && trackRef.current) {
      const cardW = firstCardRef.current.offsetWidth;
      const styles = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(styles.gap) || 16;
      if (cardW > 0) {
        stepWidthRef.current = cardW + gap;
        singleSetWidthRef.current = N * (cardW + gap);
      }
    }
  }, [N]);

  useEffect(() => {
    measureDimensions();
    window.addEventListener('resize', measureDimensions, { passive: true });
    window.addEventListener('orientationchange', measureDimensions, { passive: true });
    return () => {
      window.removeEventListener('resize', measureDimensions);
      window.removeEventListener('orientationchange', measureDimensions);
    };
  }, [measureDimensions, clonedItems.length]);

  // RAF Continuous Auto-Scroll Engine
  useEffect(() => {
    let rafId: number;
    let lastFrameTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(now - lastFrameTime, 35); // clamp delta to prevent giant leaps after tab switch
      lastFrameTime = now;
      const deltaRatio = dt / 16.667;

      if (isInViewRef.current && trackRef.current && singleSetWidthRef.current > 0) {
        // Determine target speed based on hover/drag/step animation states
        let targetSpeed = 0;
        if (!isHoveredRef.current && !isPointerDownRef.current && !isAnimatingStepRef.current) {
          targetSpeed = cruiseSpeedRef.current;
        }

        // Velvet exponential acceleration/deceleration for natural physics
        currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * (0.08 * deltaRatio);

        if (!isPointerDownRef.current && !isAnimatingStepRef.current) {
          scrollPosRef.current += currentSpeedRef.current * deltaRatio;

          // Seamless infinite wrap modulo singleSetWidth
          const setW = singleSetWidthRef.current;
          if (scrollPosRef.current >= setW) {
            scrollPosRef.current -= setW;
          } else if (scrollPosRef.current < 0) {
            scrollPosRef.current += setW;
          }

          // Apply directly to DOM without causing React re-renders for buttery 120fps smoothness
          trackRef.current.style.transform = `translate3d(${-scrollPosRef.current}px, 0, 0)`;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      if (stepAnimationRafRef.current) cancelAnimationFrame(stepAnimationRafRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, [N]);

  // Viewport intersection observer to save battery and GPU cycles when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    const handleVisibility = () => {
      isInViewRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Cooldown helper to pause auto-scroll after user interaction and resume smoothly
  const pauseAutoScrollTemporarily = useCallback((durationMs = 3000) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      isAnimatingStepRef.current = false;
      isDraggingRef.current = false;
    }, durationMs);
  }, []);

  // Smooth ease-out step slide for Chevron Left/Right navigation
  const smoothSlideBy = useCallback((deltaPx: number) => {
    if (stepAnimationRafRef.current) cancelAnimationFrame(stepAnimationRafRef.current);
    isAnimatingStepRef.current = true;

    const startPos = scrollPosRef.current;
    const targetPos = startPos + deltaPx;
    const setW = singleSetWidthRef.current;
    const startTime = performance.now();
    const duration = 580; // 580ms luxury slide

    const animateStep = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Luxury ease-out cubic curve
      const eased = 1 - Math.pow(1 - progress, 3);

      scrollPosRef.current = startPos + (targetPos - startPos) * eased;

      // Handle wrapping during manual navigation
      if (setW > 0) {
        if (scrollPosRef.current >= setW) scrollPosRef.current -= setW;
        else if (scrollPosRef.current < 0) scrollPosRef.current += setW;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-scrollPosRef.current}px, 0, 0)`;
      }

      if (progress < 1) {
        stepAnimationRafRef.current = requestAnimationFrame(animateStep);
      } else {
        pauseAutoScrollTemporarily(2800);
      }
    };

    stepAnimationRafRef.current = requestAnimationFrame(animateStep);
  }, [pauseAutoScrollTemporarily]);

  const slideNext = useCallback(() => {
    smoothSlideBy(stepWidthRef.current);
  }, [smoothSlideBy]);

  const slidePrev = useCallback(() => {
    smoothSlideBy(-stepWidthRef.current);
  }, [smoothSlideBy]);

  // Pointer / Touch Gestures (drag scrubbing with momentum and vertical scroll safety)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return; // only primary mouse click
    if (stepAnimationRafRef.current) cancelAnimationFrame(stepAnimationRafRef.current);

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    hasDraggedFarRef.current = false;
    gestureDirectionRef.current = 'none';

    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
    pointerStartScrollPosRef.current = scrollPosRef.current;
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = performance.now();
    pointerVelocityXRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const diffX = e.clientX - pointerStartXRef.current;
    const diffY = e.clientY - pointerStartYRef.current;

    // Detect gesture direction on initial movement
    if (gestureDirectionRef.current === 'none') {
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 8) {
        gestureDirectionRef.current = 'vertical';
        isPointerDownRef.current = false;
        return; // release control so page scrolls vertically without hindrance
      } else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        gestureDirectionRef.current = 'horizontal';
        isDraggingRef.current = true;
        hasDraggedFarRef.current = true;
      }
    }

    if (gestureDirectionRef.current === 'horizontal') {
      const now = performance.now();
      const dt = Math.max(now - lastPointerTimeRef.current, 1);
      const instantVelocity = (e.clientX - lastPointerXRef.current) / dt;
      pointerVelocityXRef.current = instantVelocity;
      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;

      // 1:1 finger tracking
      scrollPosRef.current = pointerStartScrollPosRef.current - diffX;

      const setW = singleSetWidthRef.current;
      if (setW > 0) {
        if (scrollPosRef.current >= setW) scrollPosRef.current -= setW;
        else if (scrollPosRef.current < 0) scrollPosRef.current += setW;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-scrollPosRef.current}px, 0, 0)`;
      }
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDownRef.current && gestureDirectionRef.current !== 'horizontal') return;
    isPointerDownRef.current = false;

    if (gestureDirectionRef.current === 'horizontal') {
      const flickSpeed = pointerVelocityXRef.current;
      if (Math.abs(flickSpeed) > 0.45) {
        // Apply inertia momentum glide
        const inertiaDistance = -flickSpeed * 220;
        smoothSlideBy(inertiaDistance);
      } else {
        pauseAutoScrollTemporarily(2400);
      }
    }

    gestureDirectionRef.current = 'none';
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDraggedFarRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* Header: Title, Live Drift Status, and Controls */}
      <div className="flex items-end justify-between gap-3 border-b border-stone-200/50 pb-3 sm:pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl uppercase font-semibold text-neutral-900 tracking-tight">
              My Categories
            </h2>
            {/* Subtle luxury continuous glide indicator */}
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-[10px] font-medium text-emerald-800 tracking-wide">
              <span className={`w-1.5 h-1.5 rounded-full ${isHoveredState ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span>{isHoveredState ? 'Paused' : 'Auto-Gliding'}</span>
            </span>
          </div>
          <p className="hidden sm:block text-xs text-neutral-500 font-sans tracking-wide">
            Curated pure oil essences hydro-distilled from the world’s most precious botanicals
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Mobile "View All" Pill */}
          <Link
            href="/shop"
            className="sm:hidden inline-flex items-center gap-1 text-[11px] font-bold text-emerald-900 hover:text-emerald-700 uppercase tracking-wider py-1.5 px-3 rounded-full bg-emerald-50/80 border border-emerald-200/80 transition-all active:scale-95"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3 text-[#F5B418]" />
          </Link>

          {/* Desktop Smooth Slide Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={slidePrev}
              type="button"
              className="w-10 h-10 rounded-full border border-stone-300 bg-white/90 text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer group"
              aria-label="Previous Category"
              title="Previous category"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={slideNext}
              type="button"
              className="w-10 h-10 rounded-full border border-stone-300 bg-white/90 text-stone-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center cursor-pointer group"
              aria-label="Next Category"
              title="Next category"
            >
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Infinite Card Glider Container */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden select-none -mx-4 sm:mx-0 pt-1 pb-3 cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClickCapture={handleClickCapture}
        onMouseEnter={() => {
          isHoveredRef.current = true;
          setIsHoveredState(true);
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          setIsHoveredState(false);
          isPointerDownRef.current = false;
        }}
      >
        {/* Continuous Gliding Track */}
        <div
          ref={trackRef}
          className="flex gap-3 sm:gap-4 pl-4 sm:pl-0 will-change-transform"
          style={{
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {clonedItems.map((cat, idx) => (
            <div
              key={cat._uniqueKey}
              ref={idx === 0 ? firstCardRef : undefined}
              className="w-[210px] xs:w-[235px] sm:w-[260px] md:w-[275px] lg:w-[285px] flex-shrink-0 flex flex-col group/card"
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                prefetch={true}
                className="block relative aspect-[9/15] rounded-2xl sm:rounded-3xl overflow-hidden border border-stone-200/90 hover:border-[#F5B418]/90 shadow-md hover:shadow-[0_16px_40px_rgba(245,180,24,0.2)] transition-all duration-500 bg-neutral-950"
              >
                {/* Background Image with Zoom & Warm Lighting on Hover */}
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 240px, 320px"
                  className="object-cover object-center group-hover/card:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Multi-Stop Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 via-65% to-transparent opacity-85 group-hover/card:opacity-95 transition-opacity duration-300" />

                {/* Golden Radial Sheen on Hover */}
                <div className="absolute inset-0 bg-radial-at-c from-amber-400/10 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top Badge */}
                {cat.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#F5B418]/40 text-[10px] font-bold uppercase tracking-widest text-[#F5B418] shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 text-[#F5B418]" />
                      <span>{cat.badge}</span>
                    </span>
                  </div>
                )}

                {/* Bottom Content Area */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex flex-col justify-end z-10 text-white space-y-1.5">
                  {/* Category Name */}
                  <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-tight text-white group-hover/card:text-[#F5B418] transition-colors duration-300 leading-tight">
                    {cat.name}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-sans text-[11px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed opacity-90 group-hover/card:opacity-100 transition-opacity">
                    {cat.subtitle}
                  </p>

                  {/* Bottom Action CTA */}
                  <div className="pt-2 flex items-center justify-between border-t border-white/10 group-hover/card:border-[#F5B418]/30 transition-colors">
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11.5px] font-bold uppercase tracking-wider text-[#F5B418] group-hover/card:translate-x-1 transition-transform duration-300">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    {cat.itemCount && (
                      <span className="text-[10px] font-sans text-stone-400 group-hover/card:text-stone-300 transition-colors">
                        {cat.itemCount}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
