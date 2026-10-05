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
  Clock,
  Droplet,
  Globe,
} from 'lucide-react';
import { useFeaturedProducts, useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import HeroBannerCarousel from '@/components/home/HeroBannerCarousel';
import MobileBestsellerSlider from '@/components/home/MobileBestsellerSlider';
import CategoryDisplaySlider from '@/components/home/CategoryDisplaySlider';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import FAQsection from '@/components/home/FAQsection';
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
    <div className="space-y-10 sm:space-y-14 lg:space-y-20 bg-transparent">
      {/* 1. Hero Banner Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: luxuryEase }}
      >
        <HeroBannerCarousel />
      </motion.section>

      {/* 2. Featured Sovereign Attars with Category Tabs & Smooth Scroll Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: luxuryEase }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6"
      >
        {/* Header with Title, Tagline and Scroll Controls */}
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1 sm:space-y-1.5">
            <span className="text-[10.5px] sm:text-xs font-bold text-[#C9A227] uppercase tracking-widest block font-sans">
              Royal Reserve
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl uppercase font-medium text-neutral-900 tracking-tight">
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

        {/* Product Cards Smooth Scroll View Container with Framer Motion Cross-fade */}
        <div className="relative group/carousel -mx-4 sm:mx-0 min-h-[360px]">
          {isLoading ? (
            <div className="flex gap-3 sm:gap-6 overflow-hidden py-3 sm:py-4 px-4 sm:px-0">
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
            <div className="mx-4 sm:mx-0 w-[calc(100%-2rem)] sm:w-full py-16 px-6 rounded-3xl bg-white/90 border border-stone-200 text-center space-y-3 shadow-xs">
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
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: luxuryEase }}
              >
                {/* Mobile View: Smooth Auto-Scroll Infinite Loop Slider */}
                <div className="block sm:hidden">
                  <MobileBestsellerSlider products={displayedProducts} />
                </div>

                {/* Desktop View: Interactive Chevron & Manual Horizontal Scroll */}
                <div
                  ref={scrollContainerRef}
                  className="hidden sm:flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pt-5 pb-6 px-0.5 no-scrollbar overscroll-x-contain"
                >
                  {displayedProducts.map((product) => (
                    <div
                      key={product._id}
                      className="w-[280px] md:w-[315px] flex-shrink-0 snap-start flex flex-col"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Explore All Collection Link with Framer Motion hover scale */}
        <div className="flex items-center justify-center pt-4 sm:pt-6">
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: luxuryEase }}
          >
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
              className="group inline-flex items-center gap-2.5 px-7 sm:px-9 py-2.5 sm:py-3 rounded-full bg-[#012520] text-white text-xs sm:text-sm font-bold uppercase tracking-widest border border-[#F5B418]/30 hover:border-[#F5B418]/70 shadow-[0_4px_20px_rgba(1,37,32,0.25)] hover:shadow-[0_8px_32px_rgba(1,37,32,0.35)] transition-all duration-300"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 text-[#F5B418] group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* 3. Category Display Slider (Continuous Buttery-Smooth Auto-Scroll) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.75, ease: luxuryEase }}
        className="w-full relative"
      >
        <CategoryDisplaySlider />
      </motion.section>

      {/* 4. Gifting Collection Banner */}
      <motion.section 
        className="w-full relative px-2 sm:px-4 lg:px-6 max-w-8xl mx-auto"
        initial={{ opacity: 0, y: 30, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: luxuryEase }}
      >
        <Link href="/gifting" className="block w-full cursor-pointer group">
          <div className="w-full relative bg-[#0A1917] overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg group-hover:shadow-[0_16px_45px_rgba(1,37,32,0.25)] border border-amber-900/25 group-hover:border-[#F5B418]/50 transition-all duration-700">
            <Image 
              src="/images/gifthomenew.png" 
              alt="Attar Gifting Collection" 
              width={1920}
              height={720}
              sizes="100vw"
              priority
              className="w-full h-auto block object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            {/* Subtle luxury vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
          </div>
        </Link>
      </motion.section>

      {/* 5. Shop By Occasions with Framer Motion Staggered Cards */}
      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, ease: luxuryEase }}
      >
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-[10.5px] sm:text-xs font-bold text-[#C9A227] uppercase tracking-widest block font-sans">
            Signature Moments
          </span>
          <h2 className="text-2xl sm:text-3xl uppercase font-serif text-emerald-950 tracking-tight font-medium">
            Shop by Occasions
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-sans max-w-lg">
            Discover exquisite concentrated attar formulations curated to match your aura, mood, and occasions
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {[
            {
              title: "Office Wear",
              desc: "Rich, warm & traditional blends",
              img: "/images/o1.png",
              link: "/shop?occasion=Office%20Wear",
              tag: "Daily Prestige",
            },
            {
              title: "Date Night",
              desc: "Elegant & unforgettable signatures",
              img: "/images/o2.png",
              link: "/shop?occasion=Date",
              tag: "Romantic Sillage",
            },
            {
              title: "Everyday Casual Wear",
              desc: "Fresh, subtle & long-lasting",
              img: "/images/o3.png",
              link: "/shop?occasion=Casual%20Wear",
              tag: "Fresh Accord",
            },
            {
              title: "Corporate & Formal",
              desc: "Sophisticated & commanding",
              img: "/images/o4.png",
              link: "/shop?occasion=party%2CParty",
              tag: "Imperial Aura",
            }
          ].map((occasion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: idx * 0.08, ease: luxuryEase }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Link href={occasion.link} className="block">
                <div className="relative h-[210px] xs:h-[240px] sm:h-[290px] md:h-[330px] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-[0_16px_36px_rgba(1,37,32,0.25)] border border-stone-200/90 group-hover:border-[#F5B418]/80 transition-all duration-500 bg-[#0A1917]">
                  <Image 
                    src={occasion.img} 
                    alt={occasion.title}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-108 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 via-60% to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-300" />
                  
                  {/* Top Occasion Tag */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#F5B418]/40 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F5B418] shadow-xs">
                      {occasion.tag}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 w-full p-3.5 sm:p-5 text-white flex flex-col justify-end h-full z-10 space-y-1">
                    <h3 className="text-base sm:text-xl font-serif font-bold uppercase tracking-tight group-hover:text-[#F5B418] transition-colors line-clamp-1">
                      {occasion.title}
                    </h3>
                    <p className="hidden xs:block text-[11px] sm:text-xs text-stone-300 font-sans opacity-90 line-clamp-1">
                      {occasion.desc}
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-[10.5px] sm:text-xs font-bold uppercase tracking-wider text-[#F5B418] group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 6. Brand Values / Legacy Section */}
      <motion.section 
        className="max-w-8xl mx-auto py-10 sm:py-16 my-4 sm:my-8 border-y border-amber-900/20 bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] shadow-[0_10px_35px_rgba(1,37,32,0.2)] rounded-none sm:rounded-3xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.75, ease: luxuryEase }}
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-8 divide-x divide-emerald-800/40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: luxuryEase }}
            className="flex flex-col items-center text-center px-2 sm:px-6 group"
          >
            <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-full border border-amber-400/50 flex items-center justify-center mb-2.5 sm:mb-4 bg-[#FAF8F2] shadow-md group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(245,180,24,0.4)] transition-all duration-300">
              <Clock className="w-6 h-6 sm:w-9 sm:h-9 text-[#012520] group-hover:text-[#C9A227] transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold tracking-wider sm:tracking-widest text-[#F5B418] uppercase font-sans mb-1">
              75 Years Legacy
            </h3>
            <p className="hidden md:block text-xs text-stone-300 font-sans max-w-xs">
              Generational hydro-distillation in authentic copper degs
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: luxuryEase }}
            className="flex flex-col items-center text-center px-2 sm:px-6 group"
          >
            <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-full border border-amber-400/50 flex items-center justify-center mb-2.5 sm:mb-4 bg-[#FAF8F2] shadow-md group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(245,180,24,0.4)] transition-all duration-300">
              <Droplet className="w-6 h-6 sm:w-9 sm:h-9 text-[#012520] group-hover:text-[#C9A227] transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold tracking-wider sm:tracking-widest text-[#F5B418] uppercase font-sans mb-1">
              Farm To Fragrance
            </h3>
            <p className="hidden md:block text-xs text-stone-300 font-sans max-w-xs">
              100% alcohol-free pure oils hydro-distilled from harvest blooms
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: luxuryEase }}
            className="flex flex-col items-center text-center px-2 sm:px-6 group"
          >
            <div className="w-13 h-13 sm:w-20 sm:h-20 rounded-full border border-amber-400/50 flex items-center justify-center mb-2.5 sm:mb-4 bg-[#FAF8F2] shadow-md group-hover:scale-110 group-hover:shadow-[0_0_24px_rgba(245,180,24,0.4)] transition-all duration-300">
              <Globe className="w-6 h-6 sm:w-9 sm:h-9 text-[#012520] group-hover:text-[#C9A227] transition-colors" strokeWidth={1.5} />
            </div>
            <h3 className="text-[11px] sm:text-sm font-bold tracking-wider sm:tracking-widest text-[#F5B418] uppercase font-sans mb-1">
              Loved Worldwide
            </h3>
            <p className="hidden md:block text-xs text-stone-300 font-sans max-w-xs">
              Delivered directly to luxury perfume connoisseurs worldwide
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 7. Customer Testimonials Reviews Carousel */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.75, ease: luxuryEase }}
      >
        <TestimonialCarousel />
      </motion.section>

      {/* 8. Frequently Asked Questions Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.75, ease: luxuryEase }}
      >
        <FAQsection />
      </motion.section>
    </div>
  );
}
