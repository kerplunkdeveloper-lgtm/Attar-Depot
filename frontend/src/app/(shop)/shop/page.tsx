'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, Search } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';

function ShopContent() {
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
    const params = new URLSearchParams(window.location.search);
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

        {/* Active Filters Bar */}
        {(selectedCategory || searchKeyword || maxPrice < 12000) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-emerald-100 text-xs font-sans">
            <span className="text-neutral-500">Active filters:</span>
            {selectedCategory && (
              <span className="bg-emerald-100/70 border border-emerald-200 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                Category: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => handleCategorySelect('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchKeyword && (
              <span className="bg-emerald-100/70 border border-emerald-200 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                Query: "{searchKeyword}"
                <button onClick={() => setSearchKeyword('')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {maxPrice < 12000 && (
              <span className="bg-emerald-100/70 border border-emerald-200 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5 font-medium">
                Under ₹{maxPrice}
                <button onClick={() => setMaxPrice(12000)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-emerald-700 hover:text-emerald-900 ml-2 font-semibold underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Catalog Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-6 font-sans">
          {/* Categories */}
          <div className="rounded-2xl glass-card p-5 border border-emerald-100 space-y-3 bg-white shadow-emerald-sm">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-emerald-100 pb-2.5">
              Fragrance Families
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('')}
                className={`w-full text-left text-xs py-2.5 px-3 rounded-xl transition-colors flex justify-between items-center ${
                  !selectedCategory
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-neutral-600 hover:text-emerald-800 hover:bg-emerald-50/50'
                }`}
              >
                <span>All Collections</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left text-xs py-2.5 px-3 rounded-xl transition-colors flex justify-between items-center ${
                    selectedCategory === cat.slug
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'text-neutral-600 hover:text-emerald-800 hover:bg-emerald-50/50'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="rounded-2xl glass-card p-5 border border-emerald-100 space-y-3 bg-white shadow-emerald-sm">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-emerald-100 pb-2.5">
              Price Range
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs text-neutral-600 font-medium">
                <span>₹500</span>
                <span className="text-emerald-800 font-bold">Up to ₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="500"
                max="12000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#046A5A] cursor-pointer"
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
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

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
          <div className="border-b border-emerald-100 pb-6 animate-pulse">
            <div className="h-8 w-64 bg-neutral-200 rounded-lg mb-2" />
            <div className="h-4 w-96 bg-neutral-100 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductGridSkeleton count={6} />
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
