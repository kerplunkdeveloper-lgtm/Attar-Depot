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
  Flame,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleSearch } from '@/store/uiSlice';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

const TRENDING_KEYWORDS = [
  'Pure Dehn Al Oudh',
  'Kannauj Gulab',
  'White Kashmiri Musk',
  'Royal Ambergris',
  'Ruh Khus (Vetiver)',
  'Vintage Mukhallat',
  'Sandalwood Oil',
];

export default function SearchModal() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSearchOpen } = useAppSelector((state) => state.ui);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useCategories();

  // Debounce search query by 250ms for buttery-smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Focus search input when modal opens
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

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K to open, ESC to close)
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

  // Fetch real-time products
  const { data, isLoading } = useProducts({
    search: debouncedQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    limit: 8,
  });

  const products: Product[] = data?.products || [];
  const hasSearched = debouncedQuery.length > 0 || selectedCategory !== 'all';

  if (!isSearchOpen) return null;

  const handleClose = () => {
    dispatch(toggleSearch(false));
  };

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

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword);
    setDebouncedQuery(keyword);
  };

  return (
    <div
      className="fixed inset-0 z-[105] flex items-start justify-center p-3 sm:p-6 pt-10 sm:pt-18 bg-neutral-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fragrance Search Vault"
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100/90 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-emerald-100/90 bg-gradient-to-r from-[#ECFDF5]/90 via-white to-[#ECFDF5]/60">
          <form onSubmit={handleSearchAll} className="relative flex items-center">
            <Search className="w-5 h-5 text-emerald-700 flex-shrink-0 ml-1 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pure oudh, vintage musk, kannauj rose..."
              className="w-full text-sm sm:text-base font-sans text-neutral-900 placeholder:text-neutral-400 bg-transparent focus:outline-none pr-16"
            />

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setDebouncedQuery('');
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
                  aria-label="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold text-neutral-500 bg-neutral-100 border border-neutral-200 rounded-md">
                ESC
              </span>

              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-white/80 transition-colors sm:hidden"
                aria-label="Close search modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Category Filter Pills (Always accessible right below search) */}
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

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {isLoading ? (
            /* Royal Skeleton Loading State */
            <div className="space-y-3 py-3">
              <div className="h-4 w-40 skeleton-shimmer rounded-md mb-2 bg-emerald-100/70" />
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-emerald-100/80 shadow-2xs"
                >
                  <div className="w-14 h-16 rounded-xl skeleton-emerald flex-shrink-0 border border-emerald-100/70" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 rounded skeleton-shimmer bg-neutral-200/80" />
                    <div className="h-3 w-32 rounded skeleton-shimmer bg-emerald-50" />
                  </div>
                  <div className="h-5 w-16 rounded-md skeleton-shimmer bg-emerald-200/70" />
                </div>
              ))}
            </div>
          ) : hasSearched ? (
            /* Search Results View */
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 font-sans">
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
                        className="group flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#FAF8F2]/60 hover:bg-emerald-50/80 border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs hover:shadow-emerald-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Product Image Thumbnail */}
                          <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-white border border-emerald-100/90 flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={
                                product.images?.[0] ||
                                'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300'
                              }
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {product.category?.name && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.2 rounded-full uppercase tracking-wider">
                                  {product.category.name}
                                </span>
                              )}
                              {product.ratings?.average ? (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full">
                                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-500" />
                                  <span>{product.ratings.average.toFixed(1)}</span>
                                </span>
                              ) : null}
                            </div>

                            <h4 className="font-serif text-sm sm:text-base font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors truncate">
                              {product.name}
                            </h4>

                            {(topNote || baseNote) && (
                              <p className="text-[11px] text-neutral-500 truncate font-sans mt-0.5">
                                Notes: <span className="text-neutral-700">{topNote}</span>
                                {baseNote ? ` • ${baseNote}` : ''}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Price & View Action */}
                        <div className="flex items-center gap-2 flex-shrink-0 pl-2 text-right">
                          <div>
                            <span className="text-[10px] text-neutral-400 block">From</span>
                            <span className="font-sans font-bold text-emerald-800 text-sm sm:text-base">
                              {formatPrice(minPrice)}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty Results State */
                <div className="py-12 px-4 text-center space-y-3 max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto">
                    <ShoppingBag className="w-6 h-6 opacity-70" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900">
                      No Sovereign Attars Found
                    </h3>
                    <p className="text-xs text-neutral-500 font-sans mt-1">
                      No fragrances matched &ldquo;{query}&rdquo;. Try searching by notes like
                      oudh, musk, amber, or rose.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSelectedCategory('all');
                      handleSearchAll();
                    }}
                    className="btn-emerald px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-emerald-sm"
                  >
                    Browse Complete Catalog
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Initial Spotlight State: Trending Searches & Popular Collections */
            <div className="space-y-6">
              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Trending Royal Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleKeywordClick(kw)}
                      className="px-3 py-1.5 rounded-xl text-xs text-neutral-700 bg-neutral-50 hover:bg-emerald-50 hover:text-emerald-900 border border-neutral-200/80 hover:border-emerald-200 transition-all font-medium flex items-center gap-1.5 shadow-2xs hover:scale-102"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600 opacity-70" />
                      <span>{kw}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Categories Showcase */}
              <div className="pt-2 border-t border-emerald-100/80">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3">
                  Explore by Olfactory Family
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.slice(0, 6).map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => setSelectedCategory(c.slug)}
                      className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-[#FAF8F2]/80 hover:bg-emerald-50 border border-emerald-100/80 hover:border-emerald-300 transition-all text-left group shadow-2xs"
                    >
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-100 border border-emerald-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Image
                          src={
                            c.image ||
                            'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=200'
                          }
                          alt={c.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-800 truncate">
                          {c.name}
                        </p>
                        <span className="text-[10px] text-emerald-700 font-medium group-hover:underline">
                          Browse Flacons →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Hotkeys & Concierge */}
        <div className="p-3 sm:p-4 border-t border-emerald-100/90 bg-[#FAF8F2]/90 flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-500 font-sans">
          <div className="flex items-center gap-2">
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

          <div className="hidden sm:flex items-center gap-3 text-neutral-400">
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-700 font-mono text-[10px]">↵ ENTER</kbd> to search catalog
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
