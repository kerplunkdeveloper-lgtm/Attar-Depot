'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Flame,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import HeroBannerCarousel from '@/components/home/HeroBannerCarousel';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import Faq from '@/components/home/Faq';
import { motion, AnimatePresence } from 'framer-motion';
import { luxuryEase, popSpring } from '@/lib/animations';

const HOME_CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'unisex', label: 'Unisex' },
  { id: 'gifted', label: 'Gifted' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { data: categories = [] } = useCategories();
  const { data: productsData, isLoading: isFeaturedLoading } = useFeaturedProducts();

  // Find matching category from database for the selected tab (e.g. category named "MEN", "WOMEN", "UNISEX", "GIFTED")
  const matchedCategory = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find((c) => {
      const slug = c.slug?.toLowerCase() || '';
      const name = c.name?.toLowerCase() || '';
      if (selectedCategory === 'men') return slug === 'men' || name === 'men';
      if (selectedCategory === 'women') return slug === 'women' || name === 'women';
      if (selectedCategory === 'unisex') return slug === 'unisex' || name === 'unisex';
      if (selectedCategory === 'gifted') return slug.includes('gift') || name.includes('gift');
      return false;
    });
  }, [categories, selectedCategory]);

  // Query params for backend API
  const queryParams = useMemo(() => {
    if (selectedCategory === 'all') return { limit: 20 };
    const params: Record<string, any> = { limit: 20 };
    if (matchedCategory) {
      params.category = matchedCategory.slug;
    }
    if (['men', 'women', 'unisex'].includes(selectedCategory)) {
      params.gender =
        selectedCategory === 'men'
          ? 'Men'
          : selectedCategory === 'women'
          ? 'Women'
          : 'Unisex';
    }
    if (selectedCategory === 'gifted' && !matchedCategory) {
      params.occasion = 'Gifting';
    }
    return params;
  }, [selectedCategory, matchedCategory]);

  const { data: categoryProductsData, isLoading: isCategoryLoading } = useProducts(queryParams);

  const featured = productsData?.featured || [];
  const bestSellers = productsData?.bestSellers || [];

  const allBestsellers = useMemo(() => {
    if (bestSellers.length > 0) return bestSellers;
    if (featured.length > 0) return featured;
    return categoryProductsData?.products || [];
  }, [bestSellers, featured, categoryProductsData]);

  const displayedProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allBestsellers;
    }

    const apiProducts = categoryProductsData?.products || [];
    if (apiProducts.length > 0) {
      return apiProducts;
    }

    // Client-side fallback filter from allBestsellers if API returned empty
    return allBestsellers.filter((product) => {
      const catName = product.category?.name?.toLowerCase() || '';
      const catSlug = product.category?.slug?.toLowerCase() || '';
      const prodGender = product.gender?.toLowerCase() || '';

      if (selectedCategory === 'men') {
        return prodGender === 'men' || catSlug === 'men' || catName === 'men';
      }
      if (selectedCategory === 'women') {
        return prodGender === 'women' || catSlug === 'women' || catName === 'women';
      }
      if (selectedCategory === 'unisex') {
        return prodGender === 'unisex' || catSlug === 'unisex' || catName === 'unisex';
      }
      if (selectedCategory === 'gifted') {
        return (
          catSlug.includes('gift') ||
          catName.includes('gift') ||
          product.occasions?.some((o) => o.toLowerCase().includes('gift'))
        );
      }
      return false;
    });
  }, [selectedCategory, allBestsellers, categoryProductsData]);

  const isLoading = isCategoryLoading && displayedProducts.length === 0;

  // Monitor scroll position for navigation buttons and progress indicator
  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    const maxScroll = scrollWidth - clientWidth;
    setScrollProgress(maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0);
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
  }, [checkScroll, displayedProducts]);

  // Reset scroll to start when category tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [selectedCategory]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = Math.max(220, scrollContainerRef.current.clientWidth * 0.75);
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="space-y-16  emerald-overlay-bg">
      {/* 1. Hero Banner Carousel */}
      <HeroBannerCarousel />

      {/* 2. Featured Sovereign Attars with Category Tabs & Smooth Scroll Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: luxuryEase }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6"
      >
        {/* Header with Title, Tagline and Scroll Controls */}
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1 sm:space-y-1.5">
           
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              Our Bestsellers
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Mobile "View All" Pill */}
            <Link
              href={
                selectedCategory === 'all'
                  ? '/shop'
                  : matchedCategory
                  ? `/shop?category=${matchedCategory.slug}`
                  : ['men', 'women', 'unisex'].includes(selectedCategory)
                  ? `/shop?gender=${selectedCategory === 'men' ? 'Men' : selectedCategory === 'women' ? 'Women' : 'Unisex'}`
                  : '/shop?occasion=Gifting'
              }
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
                title="Previous flacons"
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
                title="Next flacons"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs Bar with Framer Motion Sliding Active Pill */}
        <div className="relative pt-0.5">
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-1 px-0.5 overscroll-x-contain">
            {HOME_CATEGORY_TABS.map((tab) => {
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`relative px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full font-bold uppercase tracking-wider text-[10.5px] sm:text-[11px] whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer ${
                    isSelected
                      ? 'text-[#F5B418]'
                      : 'bg-white/90 text-stone-700 hover:text-stone-900 border border-stone-200/90 hover:border-stone-400 shadow-2xs hover:bg-white'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategoryPill"
                      className="absolute inset-0 bg-[#012520] rounded-full border border-[#F5B418]/50 shadow-[0_4px_16px_rgba(1,37,32,0.3)] -z-0"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_8px_#F5B418] shrink-0" />
                    )}
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Smooth Scroll View Container */}
        <div className="relative group/carousel -mx-4 px-4 sm:mx-0 sm:px-0">
          {isLoading ? (
            <div className="flex gap-3 sm:gap-6 overflow-hidden py-3 sm:py-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-[185px] xs:w-[210px] sm:w-[280px] md:w-[315px] flex-shrink-0"
                >
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="w-full py-16 px-6 rounded-3xl bg-white/90 border border-stone-200 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-neutral-900">
                No Fragrances Found
              </h3>
              <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
                No active perfumes found in this category. Our master perfumers are continuously distilling new batches.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-2 py-2.5 px-6 rounded-full bg-stone-900 text-white hover:bg-emerald-950 text-xs font-bold uppercase tracking-wider transition-all"
              >
                View All Bestsellers
              </button>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-1 pb-5 sm:pb-6 px-0.5 no-scrollbar overscroll-x-contain"
            >
              {displayedProducts.map((product) => (
                <div
                  key={product._id}
                  className="w-[185px] xs:w-[210px] sm:w-[280px] md:w-[315px] flex-shrink-0 snap-start flex flex-col"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Smooth Scroll Bottom Bar: Progress Tracker & Collection Link */}
        <div className="flex items-center justify-between pt-1 border-t border-stone-200/70 text-xs font-sans text-stone-600 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] sm:text-xs font-medium text-stone-700">
              Showing <span className="font-bold text-stone-900">{displayedProducts.length}</span> perfumes
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-20 sm:w-28 h-1 sm:h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-[#F5B418] rounded-full transition-all duration-200"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>
            <span className="text-[9px] sm:text-[10px] text-stone-500 font-medium uppercase tracking-wider whitespace-nowrap">
              Swipe
            </span>
          </div>

          <Link
            href={
              selectedCategory === 'all'
                ? '/shop'
                : matchedCategory
                ? `/shop?category=${matchedCategory.slug}`
                : ['men', 'women', 'unisex'].includes(selectedCategory)
                ? `/shop?gender=${selectedCategory === 'men' ? 'Men' : selectedCategory === 'women' ? 'Women' : 'Unisex'}`
                : '/shop?occasion=Gifting'
            }
            className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-900 hover:text-emerald-700 uppercase tracking-wider transition-colors group whitespace-nowrap"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3 sm:w-3.5 h-3 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.section>



      {/* 5. The Art of Distillation Banner */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.65, ease: luxuryEase }}
        className="relative overflow-hidden py-20 bg-gradient-to-r from-[#ECFDF5] via-[#D1FAE5]/60 to-[#ECFDF5] border-y border-emerald-200/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest font-sans">
                <Flame className="w-3.5 h-3.5 text-emerald-600" /> Deg & Bhapka Hydro-Distillation
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight uppercase">
                Centuries of Sacred Perfumery in Every Drop
              </h2>

              <p className="font-sans text-xs sm:text-sm text-neutral-700 leading-relaxed">
                In a modern world saturated with alcohol sprays that evaporate within hours, Attar Depot resurrects the timeless art of pure concentrated perfume oils.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-emerald-sm space-y-1">
                  <div className="text-emerald-800 font-bold text-base font-serif">100% Alcohol Free</div>
                  <p className="font-sans text-xs text-neutral-600">Safe on sensitive skin, prayer-approved (Halal), undiluted pure oils.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-emerald-sm space-y-1">
                  <div className="text-emerald-800 font-bold text-base font-serif">24+ Hour Sillage</div>
                  <p className="font-sans text-xs text-neutral-600">Blends with body warmth to radiate alluring intimacy all day.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="btn-emerald inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-emerald-sm text-white font-sans"
                >
                  <span>Learn the Distillation Secrets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-emerald-200 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000"
                alt="Ancient distillation of pure attars"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100 shadow-lg">
                <p className="font-serif text-sm font-medium italic text-emerald-950">
                  "No chemical fixatives, no aerosols. Just pristine botanical soul captured in pure sandalwood bases."
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 5. Customer Testimonials Reviews Carousel */}
      <TestimonialCarousel />

      {/* 6. Frequently Asked Questions (FAQ) */}
      <Faq />
    </div>
  );
}
