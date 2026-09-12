'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'popular';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [sortBy, setSortBy] = useState(initialSort);
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchKeyword(searchParams.get('search') || '');
  }, [searchParams]);

  const { data: categories = [] } = useCategories();
  const { data: productsData, isLoading } = useProducts({
    category: selectedCategory,
    search: searchKeyword,
    maxPrice: maxPrice < 12000 ? maxPrice : undefined,
    sort: sortBy,
  });

  const products = productsData?.products || [];

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    if (slug === selectedCategory || !slug) {
      params.delete('category');
    } else {
      params.set('category', slug);
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchKeyword('');
    setMaxPrice(12000);
    setSortBy('popular');
    router.push('/shop');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="border-b border-emerald-100 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
              The Sovereign Perfume Boutique
            </h1>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 mt-1">
              Explore authentic pure attars, precious agarwoods, floral hydro-distillates & royal musks.
            </p>
          </div>

          {/* Quick Stats & Controls */}
          <div className="flex items-center gap-3 self-start md:self-auto font-sans">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs shadow-sm font-sans">
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-700" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-neutral-800 focus:outline-none cursor-pointer font-sans"
              >
                <option value="popular">Most Revered</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 sticky top-24 bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider">
                Categories
              </h3>
              {selectedCategory && (
                <button
                  onClick={() => handleCategorySelect('')}
                  className="text-[11px] text-emerald-800 hover:underline font-bold"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                All Fragrance Families
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-emerald-800 text-white font-bold shadow-xs'
                      : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-6 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider">
                Max Price
              </h3>
              <span className="font-sans text-xs font-bold text-emerald-800">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="12000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>₹500</span>
              <span>₹12,000+</span>
            </div>
          </div>

          {/* Search Bar in Filter */}
          <div className="pt-6 border-t border-neutral-100">
            <h3 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider mb-3">
              Search By Note
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="e.g. Cambodian Oudh, Rose..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-sans"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={clearFilters}
            className="w-full py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-all"
          >
            Reset All Filters
          </button>
        </aside>

        {/* Mobile Filter Drawer / Bottom Sheet */}
        {isFilterDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
              onClick={() => setIsFilterDrawerOpen(false)}
            />
            <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between z-10 font-sans">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase">
                    Catalog Filters
                  </h3>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                    Categories
                  </h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    <button
                      onClick={() => {
                        handleCategorySelect('');
                        setIsFilterDrawerOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                        !selectedCategory
                          ? 'bg-emerald-800 text-white font-bold'
                          : 'text-neutral-600'
                      }`}
                    >
                      All Fragrance Families
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => {
                          handleCategorySelect(cat.slug);
                          setIsFilterDrawerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                          selectedCategory === cat.slug
                            ? 'bg-emerald-800 text-white font-bold'
                            : 'text-neutral-600'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Price */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Max Price
                    </h4>
                    <span className="text-xs font-bold text-emerald-800">
                      ₹{maxPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="12000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-neutral-200 rounded-lg appearance-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 space-y-2">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    clearFilters();
                    setIsFilterDrawerOpen(false);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-900"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductGridSkeleton count={6} />
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl glass-card p-12 text-center space-y-4 bg-white border border-emerald-100 font-sans">
              <Search className="w-12 h-12 text-emerald-400 mx-auto opacity-70" />
              <h3 className="font-serif text-2xl font-bold text-neutral-800">
                No Fragrances Found
              </h3>
              <p className="font-sans text-xs text-neutral-500 max-w-sm mx-auto">
                No bottles matched your criteria. Try adjusting your category or clearing search filters.
              </p>
              <button
                onClick={clearFilters}
                className="btn-emerald px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-white"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
