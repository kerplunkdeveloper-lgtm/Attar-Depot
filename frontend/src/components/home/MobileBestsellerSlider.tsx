'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface MobileBestsellerSliderProps {
  products: Product[];
}

export default function MobileBestsellerSlider({ products }: MobileBestsellerSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  const N = products.length;
  // Ensure sufficient clone buffers for continuous looping without visual gaps
  const repeats = Math.max(3, Math.ceil(9 / Math.max(N, 1)));
  const baseIndex = N > 1 ? N * Math.floor(repeats / 2) : 0;

  // Flatten cloned products with unique keys and real index reference
  const clonedProducts = useMemo(() => {
    if (N === 0) return [];
    if (N === 1) {
      return [{ ...products[0], _uniqueId: `${products[0]._id}_0`, _realIndex: 0 }];
    }
    const list: Array<Product & { _uniqueId: string; _realIndex: number }> = [];
    for (let r = 0; r < repeats; r++) {
      for (let i = 0; i < N; i++) {
        list.push({
          ...products[i],
          _uniqueId: `${products[i]._id}_clone_${r}_${i}`,
          _realIndex: i,
        });
      }
    }
    return list;
  }, [products, N, repeats]);

  const [currentIndex, setCurrentIndex] = useState(baseIndex);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const isTransitioningRef = useRef(false);
  const [stepWidth, setStepWidth] = useState(217); // 205px card + 12px gap

  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const [isInView, setIsInView] = useState(true);

  // Gesture tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragOffsetRef = useRef(0);
  const directionRef = useRef<'none' | 'horizontal' | 'vertical'>('none');
  const hasSwipedFarRef = useRef(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Real index of active product (0 to N - 1)
  const realActiveIndex = N > 0 ? ((currentIndex % N) + N) % N : 0;

  // Dynamically measure rendered card width and gap
  const updateStepWidth = useCallback(() => {
    if (firstCardRef.current && trackRef.current) {
      const cardWidth = firstCardRef.current.offsetWidth;
      const styles = window.getComputedStyle(trackRef.current);
      const gap = parseFloat(styles.gap) || 12;
      if (cardWidth > 0) {
        setStepWidth(cardWidth + gap);
      }
    }
  }, []);

  useEffect(() => {
    updateStepWidth();
    window.addEventListener('resize', updateStepWidth, { passive: true });
    window.addEventListener('orientationchange', updateStepWidth, { passive: true });
    return () => {
      window.removeEventListener('resize', updateStepWidth);
      window.removeEventListener('orientationchange', updateStepWidth);
    };
  }, [updateStepWidth, clonedProducts.length]);

  // Reset to center baseIndex when products change (e.g. category tab switched)
  useEffect(() => {
    if (N < 2) {
      setCurrentIndex(0);
      return;
    }
    const newBase = N * Math.floor(repeats / 2);
    setIsTransitioning(false);
    setCurrentIndex(newBase);
    setDragOffset(0);
    dragOffsetRef.current = 0;
    isPausedRef.current = false;
    setIsPaused(false);

    // Re-enable smooth transition for next tick
    const rafId = requestAnimationFrame(() => {
      setIsTransitioning(true);
      updateStepWidth();
    });
    return () => cancelAnimationFrame(rafId);
  }, [products, N, repeats, updateStepWidth]);

  // Pause helper with cooldown period
  const pauseWithCooldown = useCallback((cooldownMs = 4000) => {
    isPausedRef.current = true;
    setIsPaused(true);
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      setIsPaused(false);
    }, cooldownMs);
  }, []);

  // Slide forward with safety guard
  const nextSlide = useCallback(() => {
    if (isTransitioningRef.current || isDraggingRef.current || N < 2) return;
    isTransitioningRef.current = true;
    setIsTransitioning(true);
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = setTimeout(() => {
      isTransitioningRef.current = false;
    }, 800);
    setCurrentIndex((prev) => prev + 1);
  }, [N]);

  // Seamless Infinite Looping via clones
  const handleTransitionEnd = () => {
    if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    isTransitioningRef.current = false;
    if (N < 2) return;

    const minBound = N;
    const maxBound = N * (repeats - 1);

    if (currentIndex >= maxBound) {
      // Reached near upper edge -> silently snap back by N items without animation
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev - N);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    } else if (currentIndex < minBound) {
      // Reached near lower edge -> silently snap forward by N items without animation
      setIsTransitioning(false);
      setCurrentIndex((prev) => prev + N);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  };

  // Auto-scroll Timer: runs smoothly every 3.2 seconds
  useEffect(() => {
    if (isPaused || !isInView || N < 2) return;

    const timer = setInterval(() => {
      if (
        !isPausedRef.current &&
        !isDraggingRef.current &&
        document.visibilityState === 'visible'
      ) {
        nextSlide();
      }
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused, isInView, N, nextSlide]);

  // Viewport Intersection Observer & Tab Visibility
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);

    const handleVisibility = () => {
      if (document.hidden) {
        isPausedRef.current = true;
        setIsPaused(true);
      } else {
        isPausedRef.current = false;
        setIsPaused(false);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
    };
  }, []);

  // Touch Handling: buttery smooth 1:1 finger tracking & safe vertical scroll
  const handleTouchStart = (e: React.TouchEvent) => {
    if (N < 2) return;
    pauseWithCooldown(5000);

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    directionRef.current = 'none';
    hasSwipedFarRef.current = false;
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (N < 2) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;

    // Detect gesture direction
    if (directionRef.current === 'none') {
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 7) {
        directionRef.current = 'vertical';
        return; // User is scrolling vertically down page, let browser handle native scroll
      } else if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 7) {
        directionRef.current = 'horizontal';
        isDraggingRef.current = true;
        setIsTransitioning(false); // follow finger with 0 latency
      }
    }

    if (directionRef.current === 'horizontal') {
      if (Math.abs(diffX) > 8) {
        hasSwipedFarRef.current = true;
      }
      setDragOffset(diffX);
      dragOffsetRef.current = diffX;
    }
  };

  const handleTouchEnd = () => {
    if (N < 2) return;

    if (directionRef.current === 'horizontal') {
      const duration = Date.now() - touchStartTime.current;
      const diffX = dragOffsetRef.current;
      const threshold = Math.min(stepWidth * 0.22, 45);
      const isFastFlick = duration < 280 && Math.abs(diffX) > 20;

      setIsTransitioning(true);
      setDragOffset(0);
      dragOffsetRef.current = 0;

      if (diffX < -threshold || (isFastFlick && diffX < 0)) {
        setCurrentIndex((prev) => prev + 1);
      } else if (diffX > threshold || (isFastFlick && diffX > 0)) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    isDraggingRef.current = false;
    directionRef.current = 'none';
    pauseWithCooldown(4000);
  };

  const handleTouchCancel = () => {
    setDragOffset(0);
    dragOffsetRef.current = 0;
    isDraggingRef.current = false;
    directionRef.current = 'none';
    setIsTransitioning(true);
    pauseWithCooldown(3000);
  };

  // Prevent accidental product page navigation if user was swiping
  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasSwipedFarRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Jump to specific product via pagination dot
  const goToIndex = (targetRealIndex: number) => {
    if (N < 2) return;
    pauseWithCooldown(5000);
    setIsTransitioning(true);
    const diff = targetRealIndex - realActiveIndex;
    setCurrentIndex((prev) => prev + diff);
  };

  const translateX = -(currentIndex * stepWidth) + dragOffset;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none pt-1 pb-2"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onClickCapture={handleClickCapture}
      onMouseEnter={() => {
        isPausedRef.current = true;
        setIsPaused(true);
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
        setIsPaused(false);
      }}
    >
      {/* Sliding Track with 16px (pl-4) left alignment offset */}
      <div
        ref={trackRef}
        className="flex gap-3 pl-4 will-change-transform"
        style={{
          transform: `translate3d(${translateX}px, 0, 0)`,
          transition: isTransitioning
            ? 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)'
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {clonedProducts.map((item, idx) => (
          <div
            key={item._uniqueId}
            ref={idx === 0 ? firstCardRef : undefined}
            className="w-[205px] xs:w-[225px] flex-shrink-0 flex flex-col"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      {/* Luxury Minimalist Indicator Dots / Progress (Only shown when multiple items exist) */}
      {N > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4 pb-1">
          {products.length <= 10 ? (
            products.map((p, idx) => {
              const isActive = realActiveIndex === idx;
              return (
                <button
                  key={p._id || idx}
                  type="button"
                  onClick={() => goToIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-6 bg-[#012520] shadow-xs'
                      : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to ${p.name || 'product'} (${idx + 1})`}
                />
              );
            })
          ) : (
            <div className="w-32 h-1 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#012520] rounded-full transition-all duration-300"
                style={{
                  width: `${((realActiveIndex + 1) / N) * 100}%`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
