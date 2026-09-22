'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, ArrowUpDown, X, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';

// ─── Collapsible filter section ───────────────────────────────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-neutral-100 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="font-serif text-sm font-bold text-neutral-900 uppercase tracking-wider">
          {title}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-emerald-700 transition-transform" />
        ) : (
          <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-emerald-700 transition-colors" />
        )}
      </button>
      {open && <div className="mt-1">{children}</div>}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-synced state
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popular');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [selectedNotes, setSelectedNotes] = useState<string[]>(
    searchParams.get('notes') ? searchParams.get('notes')!.split(',') : []
  );
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || '');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(
    searchParams.get('occasion') ? searchParams.get('occasion')!.split(',') : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(searchParams.get('priceRange') || '');
  const [maxPrice, setMaxPrice] = useState<number>(12000);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);

  // Debounce search input by 250ms to prevent laggy keystrokes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Sync from URL
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchKeyword(searchParams.get('search') || '');
    setSelectedGender(searchParams.get('gender') || '');
    setSelectedNotes(searchParams.get('notes') ? searchParams.get('notes')!.split(',') : []);
    setSelectedCollection(searchParams.get('collection') || '');
    setSelectedOccasions(searchParams.get('occasion') ? searchParams.get('occasion')!.split(',') : []);
    setSelectedPriceRange(searchParams.get('priceRange') || '');
  }, [searchParams]);

  const { data: categories = [] } = useCategories();
  const { data: filterOptions } = useFilterOptions();

  // Dynamic filter data from backend
  const NOTES_OPTIONS = filterOptions?.notes ?? [];
  const COLLECTIONS = filterOptions?.collections ?? [];
  const OCCASIONS = filterOptions?.occasions ?? [];
  const PRICE_RANGES = filterOptions?.priceRanges ?? [
    { label: 'Under ₹1999', value: 'under-1999' },
    { label: '₹2000 – ₹2999', value: '2000-2999' },
    { label: '₹3000 – ₹3999', value: '3000-3999' },
    { label: '₹4000 – ₹4999', value: '4000-4999' },
    { label: '₹5000 – ₹5999', value: '5000-5999' },
  ];
  const GENDER_OPTIONS = (filterOptions?.genders ?? ['Men', 'Women', 'Unisex']).map((g) => ({
    value: g,
    label: g === 'Men' ? "Men's Perfumes" : g === 'Women' ? "Women's Perfumes" : 'Unisex Perfumes',
  }));
  const maxPriceFromDB = filterOptions?.priceStats?.maxPrice ?? 12000;

  const { data: productsData, isLoading, isFetching } = useProducts({
    category: selectedCategory,
    search: debouncedSearch,
    maxPrice: !selectedPriceRange && maxPrice < maxPriceFromDB ? maxPrice : undefined,
    priceRange: selectedPriceRange || undefined,
    sort: sortBy,
    gender: selectedGender || undefined,
    notes: selectedNotes.length > 0 ? selectedNotes.join(',') : undefined,
    collection: selectedCollection || undefined,
    occasion: selectedOccasions.length > 0 ? selectedOccasions.join(',') : undefined,
  });

  const products = productsData?.products || [];

  const buildAndPush = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || (Array.isArray(val) && val.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(val) ? val.join(',') : val);
      }
    });
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const handleCategorySelect = (slug: string) => {
    const next = slug === selectedCategory ? '' : slug;
    setSelectedCategory(next);
    buildAndPush({ category: next });
  };

  const handleGenderSelect = (val: string) => {
    const next = val === selectedGender ? '' : val;
    setSelectedGender(next);
    buildAndPush({ gender: next });
  };

  const handleNoteToggle = (note: string) => {
    const next = selectedNotes.includes(note)
      ? selectedNotes.filter((n) => n !== note)
      : [...selectedNotes, note];
    setSelectedNotes(next);
    buildAndPush({ notes: next });
  };

  const handleCollectionSelect = (col: string) => {
    const next = col === selectedCollection ? '' : col;
    setSelectedCollection(next);
    buildAndPush({ collection: next });
  };

  const handleOccasionToggle = (occ: string) => {
    const next = selectedOccasions.includes(occ)
      ? selectedOccasions.filter((o) => o !== occ)
      : [...selectedOccasions, occ];
    setSelectedOccasions(next);
    buildAndPush({ occasion: next });
  };

  const handlePriceRangeSelect = (val: string) => {
    const next = val === selectedPriceRange ? '' : val;
    setSelectedPriceRange(next);
    buildAndPush({ priceRange: next });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchKeyword('');
    setMaxPrice(12000);
    setSortBy('popular');
    setSelectedGender('');
    setSelectedNotes([]);
    setSelectedCollection('');
    setSelectedOccasions([]);
    setSelectedPriceRange('');
    router.push('/shop');
  };

  const activeFilterCount = [
    selectedCategory,
    selectedGender,
    selectedCollection,
    selectedPriceRange,
  ].filter(Boolean).length + selectedNotes.length + selectedOccasions.length;

  // ─── Sidebar filter content (shared between desktop + mobile) ─────────────────
  const FilterContent = () => (
    <div className="space-y-0 font-sans">
      {/* Categories */}
      <FilterSection title="Categories">
        <div className="space-y-0.5">
          <button
            onClick={() => handleCategorySelect('')}
            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-emerald-800 text-white font-bold'
                : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
            }`}
          >
            All Fragrances
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Notes */}
      <FilterSection title="Notes">
        <div className="flex flex-wrap gap-1.5 pt-1">
          {NOTES_OPTIONS.map((note) => (
            <button
              key={note}
              onClick={() => handleNoteToggle(note)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                selectedNotes.includes(note)
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'border-neutral-200 text-neutral-600 hover:border-emerald-400 hover:text-emerald-800'
              }`}
            >
              {note}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Gender */}
      <FilterSection title="Gender">
        <div className="space-y-1 pt-1">
          {GENDER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleGenderSelect(value)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                selectedGender === value
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all ${
                  selectedGender === value
                    ? 'border-white bg-white/40'
                    : 'border-neutral-300'
                }`}
              />
              {label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Price">
        <div className="space-y-1.5 pt-1">
          {PRICE_RANGES.map((pr) => (
            <button
              key={pr.value}
              onClick={() => handlePriceRangeSelect(pr.value)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedPriceRange === pr.value
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              {pr.label}
            </button>
          ))}
          {!selectedPriceRange && (
            <div className="pt-2 border-t border-neutral-100 mt-2">
              <div className="flex justify-between text-[10px] text-neutral-500 mb-1.5">
                <span>Custom Max</span>
                <span className="font-bold text-emerald-800">₹{maxPrice.toLocaleString('en-IN')}</span>
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
          )}
        </div>
      </FilterSection>

      {/* Collections */}
      <FilterSection title="Collections">
        <div className="space-y-0.5 pt-1">
          {COLLECTIONS.map((col) => (
            <button
              key={col}
              onClick={() => handleCollectionSelect(col)}
              className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedCollection === col
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-neutral-600 hover:bg-emerald-50 hover:text-emerald-900'
              }`}
            >
              {col}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Occasions */}
      <FilterSection title="Occasions" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {OCCASIONS.map((occ) => (
            <button
              key={occ}
              onClick={() => handleOccasionToggle(occ)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                selectedOccasions.includes(occ)
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'border-neutral-200 text-neutral-600 hover:border-emerald-400 hover:text-emerald-800'
              }`}
            >
              {occ}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Search by note */}
      <FilterSection title="Search" defaultOpen={false}>
        <div className="relative pt-1">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="e.g. Cambodian Oudh, Rose..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-sans"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </FilterSection>

      {/* Reset */}
      <div className="pt-3">
        <button
          onClick={clearFilters}
          className="w-full py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-all"
        >
          Reset All Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Shop Banner */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full aspect-[21/9] sm:aspect-auto sm:h-[320px] md:h-[400px] lg:h-[480px]">
          <Image
            src="/images/shopbanner.png"
            alt="Attar Depot Royal Shop Collection"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top sm:object-center"
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
        {/* Header */}
        <div className="border-b border-emerald-100 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
                All Fragrances
              </h1>
              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedGender && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      {selectedGender}
                      <button onClick={() => handleGenderSelect(selectedGender)} className="ml-0.5 hover:text-emerald-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedNotes.map((n) => (
                    <span key={n} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      {n}
                      <button onClick={() => handleNoteToggle(n)} className="ml-0.5 hover:text-emerald-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCollection && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      {selectedCollection}
                      <button onClick={() => handleCollectionSelect(selectedCollection)} className="ml-0.5 hover:text-emerald-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedPriceRange && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      {PRICE_RANGES.find((p) => p.value === selectedPriceRange)?.label}
                      <button onClick={() => handlePriceRangeSelect(selectedPriceRange)} className="ml-0.5 hover:text-emerald-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedOccasions.map((o) => (
                    <span key={o} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      {o}
                      <button onClick={() => handleOccasionToggle(o)} className="ml-0.5 hover:text-emerald-950">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 self-start md:self-auto font-sans">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-sm relative"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-emerald-700 text-white text-[9px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
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
          <aside className="hidden lg:block space-y-0 sticky top-24 bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-emerald-50">
              <h3 className="font-serif text-base font-bold text-neutral-900 uppercase tracking-wider">
                Filter By
              </h3>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <FilterContent />
          </aside>

          {/* Mobile Filter Drawer */}
          {isFilterDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
                onClick={() => setIsFilterDrawerOpen(false)}
              />
              <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col z-10 font-sans">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900 uppercase">
                      Filter By
                    </h3>
                    {activeFilterCount > 0 && (
                      <span className="text-[10px] text-emerald-700 font-semibold">{activeFilterCount} active filters</span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1">
                  <FilterContent />
                </div>

                <div className="pt-4 border-t border-neutral-100 space-y-2">
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Apply Filters ({activeFilterCount})
                  </button>
                  <button
                    onClick={() => {
                      clearFilters();
                      setIsFilterDrawerOpen(false);
                    }}
                    className="w-full py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-900"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="lg:col-span-3 space-y-6">
            {isLoading && products.length === 0 ? (
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
                  No bottles matched your criteria. Try adjusting your filters or clearing all selections.
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-emerald px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-white"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500 font-sans">
                    <span className="font-bold text-neutral-800">{productsData?.total || products.length}</span> fragrances found
                    {isFetching && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold animate-pulse">
                        • Updating...
                      </span>
                    )}
                  </p>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-200 ${isFetching ? 'opacity-80' : 'opacity-100'}`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
