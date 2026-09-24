'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Star,
  ShoppingBag,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleSearch } from '@/store/uiSlice';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, modalVariants, luxuryEase } from '@/lib/animations';

export default function SearchModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSearchOpen } = useAppSelector((state) => state.ui);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useCategories();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus input & lock scroll when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setDebouncedQuery('');
      setSelectedCategory('all');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  // Ctrl+K / Cmd+K to open, ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dispatch(toggleSearch(!isSearchOpen));
      } else if (e.key === 'Escape' && isSearchOpen) {
        dispatch(toggleSearch(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, isSearchOpen]);

  // Fetch real products from API
  const { data, isLoading } = useProducts({
    search: debouncedQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    limit: 8,
  });

  const products: Product[] = data?.products || [];
  const hasSearched = debouncedQuery.length > 0 || selectedCategory !== 'all';

  const handleClose = () => dispatch(toggleSearch(false));

  const handleProductSelect = (slug: string) => {
    handleClose();
    router.push(`/product/${slug}`);
  };

  const handleSearchAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    handleClose();
    const params = new URLSearchParams();
    if (query.trim()) params.append('search', query.trim());
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* ========================================================== */}
          {/* MOBILE: Full-screen overlay (< lg)                         */}
          {/* ========================================================== */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: luxuryEase }}
            className="fixed inset-0 z-[105] flex flex-col bg-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
        {/* Mobile Header — matches Navbar brand colours */}
        <div className="shrink-0 bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] pt-[max(0.75rem,env(safe-area-inset-top))]">
          {/* Search input row */}
          <div className="flex items-center gap-3 px-4 pb-3">
            <form
              onSubmit={handleSearchAll}
              className="flex-1 flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-2xl px-4 h-11"
            >
              <Search className="w-4 h-4 text-[#F5B418] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search attars, oudh, musk..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setDebouncedQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-0.5 rounded-full text-white/60 hover:text-white transition-colors"
                  aria-label="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
            {/* iOS-style Cancel button */}
            <button
              type="button"
              onClick={handleClose}
              className="text-sm font-semibold text-[#F5B418] shrink-0 px-1"
            >
              Cancel
            </button>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-[#F5B418] text-[#012520] border-[#F5B418]'
                  : 'bg-white/10 text-white/75 border-white/20 hover:border-[#F5B418]/50 hover:text-[#F5B418]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex-shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all border ${
                  selectedCategory === cat.slug
                    ? 'bg-[#F5B418] text-[#012520] border-[#F5B418]'
                    : 'bg-white/10 text-white/75 border-white/20 hover:border-[#F5B418]/50 hover:text-[#F5B418]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAF9]">
          {isLoading ? (
            /* Skeleton */
            <div className="p-4 space-y-3">
              <div className="h-3.5 w-32 bg-emerald-100 rounded-full animate-pulse mb-4" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-emerald-100 shadow-sm">
                  <div className="w-14 h-16 rounded-xl bg-emerald-50 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-emerald-50 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-14 bg-emerald-100 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            /* Search results */
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  {products.length > 0
                    ? `${products.length}${data?.total ? ` of ${data.total}` : ''} Results`
                    : 'No Results'}
                </p>
                {products.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSearchAll()}
                    className="text-xs font-bold text-emerald-700 flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {products.length > 0 ? (
                <div className="space-y-2.5">
                  {products.map((product) => {
                    const topNote = product.fragranceNotes?.topNotes?.[0];
                    const baseNote = product.fragranceNotes?.baseNotes?.[0];
                    const minPrice = product.sizes?.[0]?.price || product.price;
                    return (
                      <div
                        key={product._id}
                        onClick={() => handleProductSelect(product.slug)}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer shadow-sm active:scale-[0.99] group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-neutral-50 border border-emerald-100 flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                              <ShoppingBag className="w-5 h-5 text-emerald-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {product.category?.name && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {product.category.name}
                              </span>
                            )}
                            {product.ratings?.average ? (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                                {product.ratings.average.toFixed(1)}
                              </span>
                            ) : null}
                          </div>
                          <h4 className="font-serif text-sm font-bold text-neutral-900 truncate">{product.name}</h4>
                          {(topNote || baseNote) && (
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                              {topNote}{baseNote ? ` · ${baseNote}` : ''}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 pl-2">
                          <div className="text-right">
                            <span className="text-[10px] text-neutral-400 block">From</span>
                            <span className="font-bold text-emerald-800 text-sm">{formatPrice(minPrice)}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}

                  {/* View all CTA */}
                  {data?.total && data.total > products.length && (
                    <button
                      type="button"
                      onClick={() => handleSearchAll()}
                      className="w-full mt-2 py-3.5 rounded-2xl border-2 border-dashed border-emerald-200 text-sm font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
                    >
                      View all {data.total} results in shop
                    </button>
                  )}
                </div>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center py-16 px-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900 mb-1">No Attars Found</h3>
                  <p className="text-sm text-neutral-500 mb-6">
                    No fragrances matched &ldquo;{query}&rdquo;. Try different keywords.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSearchAll()}
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-bold shadow"
                  >
                    Browse Complete Catalog
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Default: real categories grid only (zero dummy data) */
            <div className="p-4 space-y-5">
              {categories.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">Browse by Category</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {categories.map((c) => (
                      <button
                        key={c._id}
                        type="button"
                        onClick={() => setSelectedCategory(c.slug)}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 transition-all text-left shadow-sm active:scale-[0.98]"
                      >
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 border border-emerald-100 flex-shrink-0">
                          {c.image ? (
                            <Image src={c.image} alt={c.name} fill sizes="44px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-emerald-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-neutral-900 truncate">{c.name}</p>
                          <span className="text-[10px] text-emerald-700 font-medium">Explore →</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm text-neutral-500">Type to search our fragrance collection</p>
              </div>
            </div>
          )}
          </div>
        </motion.div>

        {/* ========================================================== */}
          {/* DESKTOP: Centred modal overlay (≥ lg)                      */}
          {/* ========================================================== */}
          <div
            className="hidden lg:flex fixed inset-0 z-[105] items-start justify-center p-6 pt-20"
            role="dialog"
            aria-modal="true"
            aria-label="Fragrance Search Vault"
          >
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 bg-neutral-950/75 backdrop-blur-md"
              onClick={handleClose}
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100/90 overflow-hidden flex flex-col max-h-[80vh] z-10"
              onClick={(e) => e.stopPropagation()}
            >
          {/* Desktop Search Header */}
          <div className="p-5 border-b border-emerald-100/90 bg-gradient-to-r from-[#ECFDF5]/90 via-white to-[#ECFDF5]/60">
            <form onSubmit={handleSearchAll} className="relative flex items-center">
              <Search className="w-5 h-5 text-emerald-700 flex-shrink-0 ml-1 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pure oudh, vintage musk, kannauj rose..."
                className="w-full text-base font-sans text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none pr-20"
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                {query && (
                  <button
                    type="button"
                    onClick={() => { setQuery(''); setDebouncedQuery(''); inputRef.current?.focus(); }}
                    className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                    aria-label="Clear"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-md">
                  ESC
                </span>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-white/80 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Desktop Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-0.5 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white text-neutral-600 hover:text-emerald-800 border border-emerald-100 hover:border-emerald-300'
                }`}
              >
                All Fragrances
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:text-emerald-800 border border-emerald-100 hover:border-emerald-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {isLoading ? (
              <div className="space-y-3 py-2">
                <div className="h-4 w-40 bg-emerald-100/70 rounded-md animate-pulse mb-3" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-sm">
                    <div className="w-14 h-16 rounded-xl bg-emerald-50 animate-pulse flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-48 bg-neutral-200 rounded animate-pulse" />
                      <div className="h-3 w-32 bg-emerald-50 rounded animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-emerald-200/70 rounded-md animate-pulse" />
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                    {products.length > 0
                      ? `Curated Flacons (${products.length}${data?.total ? ` of ${data.total}` : ''})`
                      : 'Search Results'}
                  </p>
                  {products.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSearchAll()}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
                    >
                      <span>View all in Store</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {products.length > 0 ? (
                  <div className="space-y-2">
                    {products.map((product) => {
                      const topNote = product.fragranceNotes?.topNotes?.[0];
                      const baseNote = product.fragranceNotes?.baseNotes?.[0];
                      const minPrice = product.sizes?.[0]?.price || product.price;
                      return (
                        <div
                          key={product._id}
                          onClick={() => handleProductSelect(product.slug)}
                          className="group flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#FAF8F2]/60 hover:bg-emerald-50/80 border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer shadow-sm"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-white border border-emerald-100/90 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                              {product.images?.[0] ? (
                                <Image src={product.images[0]} alt={product.name} fill sizes="56px" className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                                  <ShoppingBag className="w-5 h-5 text-emerald-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                {product.category?.name && (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    {product.category.name}
                                  </span>
                                )}
                                {product.ratings?.average ? (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                                    {product.ratings.average.toFixed(1)}
                                  </span>
                                ) : null}
                              </div>
                              <h4 className="font-serif text-sm font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors truncate">
                                {product.name}
                              </h4>
                              {(topNote || baseNote) && (
                                <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                                  Notes: <span className="text-neutral-700">{topNote}</span>
                                  {baseNote ? ` • ${baseNote}` : ''}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 pl-2 text-right">
                            <div>
                              <span className="text-[10px] text-neutral-400 block">From</span>
                              <span className="font-bold text-emerald-800 text-sm">{formatPrice(minPrice)}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 px-4 text-center space-y-3 max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                      <ShoppingBag className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-neutral-900">No Sovereign Attars Found</h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        No fragrances matched &ldquo;{query}&rdquo;. Try searching by notes like oudh, musk, amber, or rose.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSearchAll()}
                      className="btn-emerald px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
                    >
                      Browse Complete Catalog
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Default desktop: real categories grid only, no dummy data */
              <div>
                {categories.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
                      Explore by Category
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {categories.slice(0, 6).map((c) => (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => setSelectedCategory(c.slug)}
                          className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FAF8F2]/80 hover:bg-emerald-50 border border-emerald-100/80 hover:border-emerald-300 transition-all text-left group shadow-sm"
                        >
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 border border-emerald-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                            {c.image ? (
                              <Image src={c.image} alt={c.name} fill sizes="40px" className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-800 truncate">{c.name}</p>
                            <span className="text-[10px] text-emerald-700 font-medium">Browse →</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {categories.length === 0 && (
                  <div className="py-10 text-center text-sm text-neutral-400">
                    Type to search our fragrance collection
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Footer */}
          <div className="p-3.5 border-t border-emerald-100/90 bg-[#FAF8F2]/90 flex items-center justify-between gap-2 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span>Need advice?</span>
              <a
                href="https://wa.me/919876543210?text=Salam!%20Can%20you%20help%20me%20choose%20a%20pure%20attar?"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline"
              >
                Ask Fragrance Specialist →
              </a>
            </div>
            <span className="text-neutral-400">
              Press{' '}
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-mono text-[10px]">↵</kbd>{' '}
              to search
            </span>
          </div>
        </motion.div>
      </div>
    </>
  )}
</AnimatePresence>
  );
}
