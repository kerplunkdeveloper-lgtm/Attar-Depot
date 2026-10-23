'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowUpDown,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  Sparkles,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';
import { Category } from '@/types';
import { useAppDispatch } from '@/store';
import { toggleAiChat } from '@/store/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';
import {
  accordionVariants,
  backdropVariants,
  drawerRightVariants,
  staggerContainerVariants,
  fadeInUpVariants,
} from '@/lib/animations';

// ─── Reference Sliders Icon (Matches reference image pixel-for-pixel) ──────────
function FilterSlidersIcon({ className = 'w-5 h-5 text-neutral-900' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Line 1: circle at left (~8) */}
      <line x1="3" y1="5.5" x2="21" y2="5.5" />
      <circle cx="8" cy="5.5" r="2.5" fill="white" stroke="currentColor" strokeWidth="2" />
      {/* Line 2: circle at right (~16.5) */}
      <line x1="3" y1="12" x2="21" y2="12" />
      <circle cx="16.5" cy="12" r="2.5" fill="white" stroke="currentColor" strokeWidth="2" />
      {/* Line 3: circle at middle-left (~10) */}
      <line x1="3" y1="18.5" x2="21" y2="18.5" />
      <circle cx="10" cy="18.5" r="2.5" fill="white" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// ─── Visual Note Icons ────────────────────────────────────────────────────────
const NOTE_ICONS: Record<string, string> = {
  Oudh: '🪵',
  Rose: '🌹',
  Amber: '✨',
  Musk: '👑',
  Sandalwood: '🌿',
  Floral: '🌸',
  Citrus: '🍊',
  Spicy: '🌶️',
  Woody: '🌲',
  Vanilla: '🍦',
  Aquatic: '🌊',
  Oriental: '🕌',
};

// ─── Sort Options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Revered', icon: '👑' },
  { value: 'price-asc', label: 'Price: Low to High', icon: '↗' },
  { value: 'price-desc', label: 'Price: High to Low', icon: '↘' },
  { value: 'rating', label: 'Highest Rated', icon: '⭐' },
];

// ─── Category-Wise Banner Configuration ──────────────────────────────────────
interface CategoryBannerMeta {
  image: string;
  badge: string;
  tagline: string;
  subtitle: string;
  objectPosition?: string;
}

const CATEGORY_BANNERS: Record<string, CategoryBannerMeta> = {
  default: {
    image: '/images/shopbanner.png',
    badge: 'ROYAL ARTISANAL ESSENCES • EST. PONDICHERRY',
    tagline: '',
    subtitle: 'Explore our complete heritage collection of pure attars, rare oudh oils, and royal oriental mukhallats.',
    objectPosition: 'object-center',
  }
};

// ─── Square Checkbox (With Generous Touch Row & High Contrast) ─────────────────
function SquareCheckbox({
  checked,
  label,
  count,
  onClick,
}: {
  checked: boolean;
  label: string;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left group cursor-pointer transition-all active:scale-[0.99] ${
        checked
          ? 'bg-[#012520]/[0.07] border border-[#012520]/25 text-[#012520]'
          : 'hover:bg-stone-100/70 border border-transparent text-stone-800'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 pr-2">
        <span
          className={`w-[19px] h-[19px] rounded-[5px] border flex items-center justify-center shrink-0 transition-all ${
            checked
              ? 'bg-[#012520] border-[#012520] text-[#F5B418] shadow-xs'
              : 'border-stone-300 bg-white group-hover:border-stone-500'
          }`}
        >
          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </span>
        <span
          className={`font-sans text-[13.5px] sm:text-sm leading-snug line-clamp-2 transition-colors ${
            checked ? 'text-[#012520] font-bold' : 'text-stone-700 font-medium group-hover:text-black'
          }`}
        >
          {label}
        </span>
      </div>
      {typeof count === 'number' && count > 0 && (
        <span className="text-[11px] font-sans text-stone-500 bg-stone-100 group-hover:bg-stone-200 px-2 py-0.5 rounded-full shrink-0">
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Dual Range Slider Component (With 1-Tap Quick Price Presets) ───────────────
function DualRangeSlider({
  min,
  max,
  minVal,
  maxVal,
  onChange,
}: {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onChange: (minVal: number, maxVal: number) => void;
}) {
  const safeMin = min;
  const safeMax = Math.max(max, safeMin + 100);
  const currentMin = Math.max(safeMin, Math.min(minVal, safeMax));
  const currentMax = Math.min(safeMax, Math.max(maxVal, safeMin));

  const minPercent = Math.min(
    100,
    Math.max(0, Math.round(((currentMin - safeMin) / (safeMax - safeMin || 1)) * 100))
  );
  const maxPercent = Math.min(
    100,
    Math.max(0, Math.round(((currentMax - safeMin) / (safeMax - safeMin || 1)) * 100))
  );

  return (
    <div className="pt-2 pb-1 space-y-3.5">
      {/* 1-Tap Quick Price Presets */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { label: 'All', minV: safeMin, maxV: safeMax },
          { label: 'Under ₹1k', minV: safeMin, maxV: 1000 },
          { label: '₹1k – ₹2.5k', minV: 1000, maxV: 2500 },
          { label: '₹2.5k – ₹5k', minV: 2500, maxV: 5000 },
          { label: '₹5k+', minV: 5000, maxV: safeMax },
        ].map((preset) => {
          const isPresetActive = currentMin === preset.minV && currentMax === preset.maxV;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange(preset.minV, preset.maxV)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                isPresetActive
                  ? 'bg-[#012520] text-[#F5B418] border border-[#012520] shadow-2xs font-bold'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      {/* Slider Track */}
      <div className="relative w-full h-7 flex items-center select-none touch-none">
        <div className="absolute w-full h-[3px] bg-stone-200 rounded-full" />
        <div
          className="absolute h-[3px] bg-[#012520] rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${Math.max(0, maxPercent - minPercent)}%`,
          }}
        />

        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step={50}
          value={currentMin}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), currentMax - 50);
            onChange(val, currentMax);
          }}
          className="range-thumb-slider absolute w-full pointer-events-none appearance-none bg-transparent focus:outline-none"
          style={{ zIndex: currentMin > safeMax - 150 ? 5 : 3 }}
        />

        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step={50}
          value={currentMax}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), currentMin + 50);
            onChange(currentMin, val);
          }}
          className="range-thumb-slider absolute w-full pointer-events-none appearance-none bg-transparent focus:outline-none"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* From / To numeric inputs */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <label className="block text-[11px] text-stone-500 mb-1 font-sans font-medium">From</label>
          <div className="flex items-center px-3 py-2 border border-stone-300 rounded-xl bg-white focus-within:border-[#012520] focus-within:ring-2 focus-within:ring-[#012520]/15 transition-all shadow-2xs">
            <span className="text-sm font-serif text-stone-600 mr-1.5 select-none font-bold">₹</span>
            <input
              type="number"
              min={safeMin}
              max={currentMax}
              value={currentMin}
              inputMode="numeric"
              onChange={(e) => {
                const val = Number(e.target.value);
                onChange(
                  isNaN(val) ? safeMin : Math.max(safeMin, Math.min(val, currentMax)),
                  currentMax
                );
              }}
              className="w-full text-sm font-sans font-bold text-stone-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        <span className="text-stone-400 mt-6 select-none font-sans text-sm font-bold">–</span>

        <div className="flex-1">
          <label className="block text-[11px] text-stone-500 mb-1 font-sans font-medium">To</label>
          <div className="flex items-center px-3 py-2 border border-stone-300 rounded-xl bg-white focus-within:border-[#012520] focus-within:ring-2 focus-within:ring-[#012520]/15 transition-all shadow-2xs">
            <span className="text-sm font-serif text-stone-600 mr-1.5 select-none font-bold">₹</span>
            <input
              type="number"
              min={currentMin}
              max={safeMax}
              value={currentMax}
              inputMode="numeric"
              onChange={(e) => {
                const val = Number(e.target.value);
                onChange(
                  currentMin,
                  isNaN(val) ? safeMax : Math.min(safeMax, Math.max(val, currentMin))
                );
              }}
              className="w-full text-sm font-sans font-bold text-stone-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Collapsible Filter Section (With Active Count Badges) ────────────────────
function FilterSection({
  title,
  children,
  defaultOpen = false,
  activeCount = 0,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (defaultOpen) setOpen(true);
  }, [defaultOpen]);

  return (
    <div className="border-b border-stone-200/90 pb-3" suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-left group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="font-serif text-[17px] sm:text-[18px] text-stone-900 font-medium tracking-wide group-hover:text-[#012520] transition-colors">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#012520] text-[#F5B418] text-[10.5px] font-sans font-bold shadow-xs">
              {activeCount}
            </span>
          )}
        </div>
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-stone-500 group-hover:text-stone-900 transition-colors">
          {open ? (
            <ChevronDown className="w-4 h-4 stroke-[2]" />
          ) : (
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            variants={accordionVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            className="overflow-hidden"
          >
            <div className="pt-1 pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Filter Content Component ─────────────────────────────────────────────────
interface FilterContentProps {
  categories: Category[];
  selectedCategory: string;
  activeCategoryObj?: Category | null;
  onSelectCategory: (slug: string) => void;
  notesOptions: string[];
  selectedNotes: string[];
  onToggleNote: (note: string) => void;
  genderOptions: Array<{ value: string; label: string }>;
  selectedGender: string;
  onSelectGender: (val: string) => void;
  minPrice: number;
  maxPrice: number;
  minPriceLimit: number;
  maxPriceLimit: number;
  onPriceChange: (minVal: number, maxVal: number) => void;
  collections: string[];
  selectedCollection: string;
  onSelectCollection: (col: string) => void;
  occasions: string[];
  selectedOccasions: string[];
  onToggleOccasion: (occ: string) => void;
  searchKeyword: string;
  onSearchKeywordChange: (val: string) => void;
  isCustomPrice: boolean;
}

function FilterContent({
  categories,
  selectedCategory,
  activeCategoryObj,
  onSelectCategory,
  notesOptions,
  selectedNotes,
  onToggleNote,
  genderOptions,
  selectedGender,
  onSelectGender,
  minPrice,
  maxPrice,
  minPriceLimit,
  maxPriceLimit,
  onPriceChange,
  collections,
  selectedCollection,
  onSelectCollection,
  occasions,
  selectedOccasions,
  onToggleOccasion,
  searchKeyword,
  onSearchKeywordChange,
  isCustomPrice,
}: FilterContentProps) {
  return (
    <div className="space-y-0 font-sans" suppressHydrationWarning>
      {/* 1. Category / Type */}
      <FilterSection
        title="Category & Type"
        defaultOpen={true}
        activeCount={selectedCategory ? 1 : 0}
      >
        <div className="space-y-1">
          <SquareCheckbox
            label="All Fragrances"
            checked={!selectedCategory}
            onClick={() => onSelectCategory('')}
          />
          {categories.map((cat) => (
            <SquareCheckbox
              key={cat._id}
              label={cat.name}
              checked={
                selectedCategory === cat.slug ||
                selectedCategory === cat._id ||
                Boolean(activeCategoryObj && (activeCategoryObj._id === cat._id || activeCategoryObj.slug === cat.slug))
              }
              onClick={() => onSelectCategory(cat.slug || cat._id)}
            />
          ))}
        </div>
      </FilterSection>

      {/* 2. Gender (1-Tap Segmented Cards) */}
      <FilterSection
        title="Gender Selection"
        defaultOpen={true}
        activeCount={selectedGender ? 1 : 0}
      >
        <div className="grid grid-cols-2 gap-2 pt-1">
          {[
            { value: '', label: 'All Genders', icon: '✨' },
            { value: 'Men', label: "Men's Attars", icon: '👑' },
            { value: 'Women', label: "Women's Attars", icon: '🌸' },
            { value: 'Unisex', label: 'Unisex Blends', icon: '💎' },
          ].map((item) => {
            const isSelected = selectedGender.toLowerCase() === item.value.toLowerCase();
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelectGender(item.value)}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#012520] text-[#F5B418] border-[#012520] shadow-xs'
                    : 'bg-stone-50/80 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <span className="text-base select-none">{item.icon}</span>
                <span className="font-sans text-xs sm:text-sm leading-tight font-semibold truncate">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 3. Fragrance Family & Notes (Interactive Visual Chips) */}
      <FilterSection
        title="Fragrance Family & Notes"
        defaultOpen={selectedNotes.length > 0 || true}
        activeCount={selectedNotes.length}
      >
        <div className="flex flex-wrap gap-1.5 pt-1">
          {notesOptions.map((note) => {
            const isSelected = selectedNotes.includes(note);
            return (
              <button
                key={note}
                type="button"
                onClick={() => onToggleNote(note)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#012520] text-[#F5B418] border border-[#F5B418]/60 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 hover:text-black border border-stone-200/90'
                }`}
              >
                <span>{NOTE_ICONS[note] || '✨'}</span>
                <span>{note}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 4. Price (With Presets & Dual Slider) */}
      <FilterSection
        title="Price Range"
        defaultOpen={true}
        activeCount={isCustomPrice ? 1 : 0}
      >
        <DualRangeSlider
          min={minPriceLimit}
          max={maxPriceLimit}
          minVal={minPrice}
          maxVal={maxPrice}
          onChange={onPriceChange}
        />
      </FilterSection>

      {/* 5. Occasions */}
      <FilterSection
        title="Signature Occasions"
        defaultOpen={selectedOccasions.length > 0}
        activeCount={selectedOccasions.length}
      >
        <div className="space-y-1">
          {occasions.map((occ) => (
            <SquareCheckbox
              key={occ}
              label={occ}
              checked={selectedOccasions.includes(occ)}
              onClick={() => onToggleOccasion(occ)}
            />
          ))}
        </div>
      </FilterSection>

      {/* 6. Collections */}
      {collections.length > 0 && (
        <FilterSection
          title="Royal Collections"
          defaultOpen={Boolean(selectedCollection)}
          activeCount={selectedCollection ? 1 : 0}
        >
          <div className="space-y-1">
            {collections.map((col) => (
              <SquareCheckbox
                key={col}
                label={col}
                checked={selectedCollection === col}
                onClick={() => onSelectCollection(col)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* 7. Search by Note / Keyword */}
      <FilterSection
        title="Search by Keyword"
        defaultOpen={Boolean(searchKeyword)}
        activeCount={searchKeyword ? 1 : 0}
      >
        <div className="relative pt-1">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => onSearchKeywordChange(e.target.value)}
            placeholder="e.g. Cambodian Oudh, Rose..."
            className="w-full text-xs font-sans pl-8 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-[#012520] transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </FilterSection>
    </div>
  );
}

// ─── Main ShopClient Component ────────────────────────────────────────────────
export default function ShopClient() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { data: categories = [] } = useCategories();
  const { data: filterOptions } = useFilterOptions();

  const minPriceLimit = filterOptions?.priceStats?.minPrice ?? 0;
  const maxPriceLimit = filterOptions?.priceStats?.maxPrice ?? 16200;

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

  const initialMinPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : minPriceLimit;
  const initialMaxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : maxPriceLimit;

  const [minPrice, setMinPrice] = useState<number>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number>(initialMaxPrice);
  const [debouncedMinPrice, setDebouncedMinPrice] = useState<number>(initialMinPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState<number>(initialMaxPrice);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortSheetOpen, setIsSortSheetOpen] = useState(false);
  const [showStickyMobileBar, setShowStickyMobileBar] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);
  const [bannerImgError, setBannerImgError] = useState(false);

  // Reset banner image error state on category change
  useEffect(() => {
    setBannerImgError(false);
  }, [selectedCategory]);

  // Monitor scroll for sticky mobile filter capsule
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowStickyMobileBar(window.scrollY > 280);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Sync debounced price slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 300);
    return () => clearTimeout(timer);
  }, [minPrice, maxPrice]);

  // Sync from URL changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSearchKeyword(searchParams.get('search') || '');
    setSelectedGender(searchParams.get('gender') || '');
    setSelectedNotes(searchParams.get('notes') ? searchParams.get('notes')!.split(',') : []);
    setSelectedCollection(searchParams.get('collection') || '');
    setSelectedOccasions(searchParams.get('occasion') ? searchParams.get('occasion')!.split(',') : []);

    const minParam = searchParams.get('minPrice');
    const maxParam = searchParams.get('maxPrice');
    if (minParam !== null) setMinPrice(Number(minParam));
    if (maxParam !== null) setMaxPrice(Number(maxParam));
  }, [searchParams]);

  // Prevent background scroll when mobile filter drawer or sort sheet is open
  useEffect(() => {
    if (isFilterDrawerOpen || isSortSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFilterDrawerOpen, isSortSheetOpen]);

  // Dynamic filter data from backend
  const NOTES_OPTIONS = filterOptions?.notes?.length
    ? filterOptions.notes
    : ['Oudh', 'Rose', 'Amber', 'Musk', 'Sandalwood', 'Floral', 'Citrus', 'Spicy', 'Woody'];
  const COLLECTIONS = filterOptions?.collections ?? [];
  const OCCASIONS = filterOptions?.occasions?.length
    ? filterOptions.occasions
    : ['Daily Wear', 'Evening & Party', 'Wedding & Royal', 'Spiritual & Meditation', 'Formal & Office'];
  const GENDER_OPTIONS = [
    { value: 'Men', label: "Men's Perfumes" },
    { value: 'Women', label: "Women's Perfumes" },
    { value: 'Unisex', label: 'Unisex Perfumes' },
  ];

  const isCustomPrice = minPrice > minPriceLimit || maxPrice < maxPriceLimit;

  const { data: productsData, isLoading, isFetching } = useProducts({
    category: selectedCategory,
    search: debouncedSearch,
    minPrice: debouncedMinPrice > minPriceLimit ? debouncedMinPrice : undefined,
    maxPrice: debouncedMaxPrice < maxPriceLimit ? debouncedMaxPrice : undefined,
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
      if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(val) ? val.join(',') : String(val));
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
    const next = val.toLowerCase() === selectedGender.toLowerCase() ? '' : val;
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

  const handlePriceChange = (newMin: number, newMax: number) => {
    setMinPrice(newMin);
    setMaxPrice(newMax);
    buildAndPush({
      minPrice: newMin > minPriceLimit ? String(newMin) : null,
      maxPrice: newMax < maxPriceLimit ? String(newMax) : null,
    });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchKeyword('');
    setMinPrice(minPriceLimit);
    setMaxPrice(maxPriceLimit);
    setDebouncedMinPrice(minPriceLimit);
    setDebouncedMaxPrice(maxPriceLimit);
    setSortBy('popular');
    setSelectedGender('');
    setSelectedNotes([]);
    setSelectedCollection('');
    setSelectedOccasions([]);
    router.push('/shop');
  };

  const activeFilterCount =
    [
      selectedCategory,
      selectedGender,
      selectedCollection,
      isCustomPrice ? 'custom-price' : '',
      debouncedSearch ? 'search' : '',
    ].filter(Boolean).length +
    selectedNotes.length +
    selectedOccasions.length;

  // Dynamic page heading
  const pageHeading = useMemo(() => {
    if (debouncedSearch && debouncedSearch.trim() !== '') {
      return `Search: "${debouncedSearch}"`;
    }

    const currentCategoryObj = categories.find(
      (c) => c.slug === selectedCategory || c._id === selectedCategory
    );
    const categoryName = currentCategoryObj?.name || (selectedCategory ? selectedCategory : null);

    const parts: string[] = [];
    if (categoryName) parts.push(categoryName);
    if (selectedCollection) parts.push(selectedCollection);
    if (selectedOccasions.length > 0) parts.push(selectedOccasions.join(', '));
    if (selectedNotes.length > 0) parts.push(selectedNotes.join(', '));

    if (selectedGender) {
      const genderLabel =
        selectedGender.toLowerCase() === 'men'
          ? "Men's"
          : selectedGender.toLowerCase() === 'women'
          ? "Women's"
          : selectedGender;

      if (parts.length > 0) {
        return `${genderLabel} ${parts.join(' • ')}`;
      } else {
        return `${genderLabel} Fragrances`;
      }
    }

    if (parts.length > 0) {
      return parts.join(' • ');
    }

    if (isCustomPrice) {
      return `Fragrances (₹${minPrice} – ₹${maxPrice})`;
    }

    return 'All Fragrances';
  }, [
    debouncedSearch,
    categories,
    selectedCategory,
    selectedCollection,
    selectedOccasions,
    selectedGender,
    selectedNotes,
    isCustomPrice,
    minPrice,
    maxPrice,
  ]);

  // Active Category Object (Robust lookup matching slug, _id, name, normalized slug, or scent family keyword)
  const activeCategoryObj = useMemo(() => {
    if (!selectedCategory) return null;
    const decoded = decodeURIComponent(selectedCategory).trim().toLowerCase();
    const normalizedTarget = decoded.replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

    // 1. Exact match (slug, ID, name, normalized)
    const exact = categories.find((c) => {
      if (!c) return false;
      const cSlug = c.slug?.toLowerCase();
      const cName = c.name?.toLowerCase();
      const cId = c._id;

      if (cSlug === decoded || cId === selectedCategory || cName === decoded) return true;

      const normalizedSlug = (c.slug || '').toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');
      const normalizedName = (c.name || '').toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

      return (
        normalizedSlug === normalizedTarget ||
        normalizedName === normalizedTarget ||
        normalizedSlug === decoded ||
        normalizedName === decoded
      );
    });
    if (exact) return exact;

    // 2. Olfactory Family keyword match (e.g., 'amber-oriental' -> 'amber-woods', 'floral-rose' -> 'floral-gulab-attar')
    return (
      categories.find((c) => {
        if (!c) return false;
        const cSlug = (c.slug || '').toLowerCase();
        const cName = (c.name || '').toLowerCase();

        if (normalizedTarget.includes('oud') || normalizedTarget.includes('woody')) {
          return cSlug.includes('oud') || cName.includes('oud');
        }
        if (normalizedTarget.includes('musk') || normalizedTarget.includes('clean')) {
          return cSlug.includes('musk') || cName.includes('musk');
        }
        if (normalizedTarget.includes('floral') || normalizedTarget.includes('rose') || normalizedTarget.includes('gulab')) {
          return cSlug.includes('floral') || cName.includes('floral') || cSlug.includes('rose') || cName.includes('rose') || cSlug.includes('gulab') || cName.includes('gulab');
        }
        if (normalizedTarget.includes('amber')) {
          return cSlug.includes('amber') || cName.includes('amber');
        }
        if (normalizedTarget.includes('oriental') || normalizedTarget.includes('french') || normalizedTarget.includes('gourmand') || normalizedTarget.includes('sweet')) {
          return cSlug.includes('oriental') || cName.includes('oriental') || cSlug.includes('french') || cName.includes('french');
        }
        if (normalizedTarget.includes('fresh') || normalizedTarget.includes('aquatic') || normalizedTarget.includes('blue')) {
          return cSlug.includes('french') || cName.includes('french') || cSlug.includes('fresh') || cName.includes('fresh');
        }
        if (normalizedTarget.includes('green') || normalizedTarget.includes('earthy')) {
          return cSlug.includes('amber') || cSlug.includes('woods') || cName.includes('woods');
        }
        if (normalizedTarget.includes('leather') || normalizedTarget.includes('dark')) {
          return cSlug.includes('oud') || cName.includes('oud');
        }
        return false;
      }) || null
    );
  }, [categories, selectedCategory]);

  // Dynamic Category-Specific Banner Metadata (Matches CategoryDisplaySlider.tsx priority)
  const activeBanner = useMemo<CategoryBannerMeta>(() => {
    if (!selectedCategory) {
      return CATEGORY_BANNERS.default;
    }

    // 1. DYNAMIC CATEGORY IMAGE FROM DATABASE / ADMIN (Highest Priority — Exact match with CategoryDisplaySlider.tsx)
    const rawDynamicImage =
      activeCategoryObj?.image ||
      (activeCategoryObj as any)?.imageUrl ||
      (activeCategoryObj as any)?.banner;

    if (
      rawDynamicImage &&
      typeof rawDynamicImage === 'string' &&
      rawDynamicImage.trim().length > 5
    ) {
      return {
        image: rawDynamicImage.trim(),
        badge: 'ROYAL HERITAGE COLLECTION',
        tagline: activeCategoryObj?.name || 'Artisanal Fragrance',
        subtitle:
          activeCategoryObj?.description ||
          'Rare concentrated perfume oils handcrafted with generational mastery.',
        objectPosition: 'object-center',
      };
    }

    // 2. Direct match in curated high-res banners
    const slug = (activeCategoryObj?.slug || selectedCategory).toLowerCase();
    if (CATEGORY_BANNERS[slug]) {
      return {
        ...CATEGORY_BANNERS[slug],
        tagline: activeCategoryObj?.name || CATEGORY_BANNERS[slug].tagline,
      };
    }

    // 3. Partial/fuzzy matches
    if (slug.includes('oud')) {
      return {
        ...CATEGORY_BANNERS['dehn-al-oudh'],
        tagline: activeCategoryObj?.name || CATEGORY_BANNERS['dehn-al-oudh'].tagline,
      };
    }
    if (slug.includes('musk')) {
      return {
        ...CATEGORY_BANNERS['royal-musk'],
        tagline: activeCategoryObj?.name || CATEGORY_BANNERS['royal-musk'].tagline,
      };
    }
    if (slug.includes('rose') || slug.includes('floral') || slug.includes('gulab')) {
      return {
        ...CATEGORY_BANNERS['floral-gulab-attar'],
        tagline: activeCategoryObj?.name || CATEGORY_BANNERS['floral-gulab-attar'].tagline,
      };
    }
    if (slug.includes('amber') || slug.includes('wood') || slug.includes('sandal')) {
      return {
        ...CATEGORY_BANNERS['amber-woods'],
        tagline: activeCategoryObj?.name || CATEGORY_BANNERS['amber-woods'].tagline,
      };
    }
    if (slug.includes('french') || slug.includes('oriental')) {
      return {
        ...CATEGORY_BANNERS['french-oriental-blends'],
        tagline: activeCategoryObj?.name || CATEGORY_BANNERS['french-oriental-blends'].tagline,
      };
    }

    // 4. Default Fallback
    return {
      ...CATEGORY_BANNERS.default,
      tagline: activeCategoryObj?.name || '',
    };
  }, [selectedCategory, activeCategoryObj]);

  const filterContentProps: FilterContentProps = {
    categories,
    selectedCategory,
    activeCategoryObj,
    onSelectCategory: handleCategorySelect,
    notesOptions: NOTES_OPTIONS,
    selectedNotes,
    onToggleNote: handleNoteToggle,
    genderOptions: GENDER_OPTIONS,
    selectedGender,
    onSelectGender: handleGenderSelect,
    minPrice,
    maxPrice,
    minPriceLimit,
    maxPriceLimit,
    onPriceChange: handlePriceChange,
    collections: COLLECTIONS,
    selectedCollection,
    onSelectCollection: handleCollectionSelect,
    occasions: OCCASIONS,
    selectedOccasions,
    onToggleOccasion: handleOccasionToggle,
    searchKeyword,
    onSearchKeywordChange: setSearchKeyword,
    isCustomPrice,
  };

  return (
    <>
      {/* Hero Shop Banner with Unified Natural Responsive Aspect Ratio (Full Image Cover) */}
      <section className="relative w-full overflow-hidden bg-neutral-950">
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/8.4] lg:aspect-[21/8] xl:aspect-[21/7.8] min-h-[190px] xs:min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[460px] xl:min-h-[500px] max-h-[560px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBanner.image + (activeCategoryObj?.slug || 'all')}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={bannerImgError ? '/images/shopbanner.png' : activeBanner.image}
                alt={activeBanner.tagline || 'Shop Banner'}
                fill
                priority
                unoptimized
                onError={() => setBannerImgError(true)}
                sizes="100vw"
                className="w-full h-full object-cover object-center"
                style={{
                  objectFit: 'cover',
                  objectPosition: activeBanner.objectPosition || 'center',
                }}
              />

              {/* Minimal Top-Bottom Vignette for Clarity & Contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/25 pointer-events-none" />

              {/* Banner Text Content - Only when activeBanner.tagline exists */}
              {activeBanner.tagline && activeBanner.tagline.trim().length > 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-center pointer-events-none">
                  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: 0.05 }}
                      className="space-y-2.5 sm:space-y-3"
                    >
                      <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight [text-shadow:_0_2px_12px_rgba(0,0,0,0.95),_0_4px_30px_rgba(0,0,0,0.95)] leading-tight drop-shadow-2xl">
                        {activeBanner.tagline}
                      </h1>
                      <div className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-transparent via-[#F5B418] to-transparent mx-auto opacity-95 shadow-[0_0_12px_rgba(245,180,24,0.8)]" />
                    </motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 font-sans">
        {/* Header & Controls */}
        <div className="border-b border-stone-200/90 pb-4 sm:pb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                  {pageHeading}
                </h2>
                {!isLoading && (
                  <span className="text-xs font-semibold text-[#012520] bg-[#012520]/10 px-2.5 py-0.5 rounded-full border border-[#012520]/20">
                    {productsData?.total ?? products.length} {products.length === 1 ? 'flacon' : 'flacons'}
                  </span>
                )}
              </div>

              {/* Active Filter Chips */}
              {activeFilterCount > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  {debouncedSearch && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-[#012520] text-xs font-semibold">
                      <span>Search: &ldquo;{debouncedSearch}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchKeyword('');
                          buildAndPush({ search: null });
                        }}
                        className="text-[#012520]/60 hover:text-[#012520] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-[#012520] text-xs font-semibold">
                      <span>Category: {categories.find((c) => c.slug === selectedCategory || c._id === selectedCategory)?.name || selectedCategory}</span>
                      <button type="button" onClick={() => handleCategorySelect(selectedCategory)} className="text-[#012520]/60 hover:text-[#012520] cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedGender && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-[#012520] text-xs font-semibold">
                      <span>Gender: {selectedGender}</span>
                      <button type="button" onClick={() => handleGenderSelect(selectedGender)} className="text-[#012520]/60 hover:text-[#012520] cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {selectedNotes.map((n) => (
                    <span key={n} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-[#012520] text-xs font-semibold">
                      <span>{NOTE_ICONS[n] || '✨'} {n}</span>
                      <button type="button" onClick={() => handleNoteToggle(n)} className="text-[#012520]/60 hover:text-[#012520] cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedOccasions.map((o) => (
                    <span key={o} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-[#012520] text-xs font-semibold">
                      <span>{o}</span>
                      <button type="button" onClick={() => handleOccasionToggle(o)} className="text-[#012520]/60 hover:text-[#012520] cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedCollection && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-[#012520] text-xs font-semibold">
                      <span>{selectedCollection}</span>
                      <button type="button" onClick={() => handleCollectionSelect(selectedCollection)} className="text-[#012520]/60 hover:text-[#012520] cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {isCustomPrice && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#012520]/10 border border-[#012520]/25 text-[#012520] text-xs font-semibold">
                      <span>₹{minPrice.toLocaleString()} – ₹{maxPrice.toLocaleString()}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setMinPrice(minPriceLimit);
                          setMaxPrice(maxPriceLimit);
                          buildAndPush({ minPrice: null, maxPrice: null });
                        }}
                        className="text-[#012520]/60 hover:text-[#012520] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {activeFilterCount > 1 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-[#012520] hover:text-[#C5A262] font-bold underline underline-offset-2 pl-1 cursor-pointer"
                    >
                      Reset All ({activeFilterCount})
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Controls: Mobile Filter Button & Sort */}
            <div className="flex items-center gap-2.5 w-full md:w-auto font-sans">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-neutral-900 shadow-2xs hover:border-[#012520] transition-all cursor-pointer"
              >
                <FilterSlidersIcon className="w-4 h-4 text-[#012520]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#012520] text-[#F5B418] text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Mobile Sort Button (triggers sort bottom sheet) */}
              <button
                type="button"
                onClick={() => setIsSortSheetOpen(true)}
                className="lg:hidden flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs shadow-2xs font-semibold text-neutral-800 hover:border-[#012520] transition-all cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <span className="truncate">
                  {SORT_OPTIONS.find((s) => s.value === sortBy)?.label.split(' ')[0] || 'Sort'}
                </span>
              </button>

              {/* Desktop Sort Dropdown */}
              <div className="hidden lg:flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs shadow-2xs font-sans hover:border-[#012520] transition-all">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    buildAndPush({ sort: e.target.value });
                  }}
                  className="bg-transparent text-neutral-800 focus:outline-none cursor-pointer font-sans text-xs"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Expanded Sidebar & High-Performance Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Sidebar (Spacious Width & Full Auto-Adjust Height, No Inner Scroll) */}
          <aside
            className="hidden lg:block w-[320px] xl:w-[360px] shrink-0 bg-white/95 backdrop-blur-xs p-6 rounded-3xl border border-stone-200/90 shadow-sm h-auto sticky top-24 self-start"
            suppressHydrationWarning
          >
            {/* Filter Header with exact reference icon & title */}
            <div className="flex items-center justify-between pb-4 mb-2 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <FilterSlidersIcon className="w-5 h-5 text-neutral-900" />
                <h2 className="font-sans text-xl font-bold text-neutral-900 tracking-tight">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#012520] text-[#F5B418] text-[11px] font-sans font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-[#012520] hover:text-[#C5A262] font-sans font-bold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Accordion Filter Sections */}
            <FilterContent {...filterContentProps} />
          </aside>

          {/* Mobile Filter Drawer (High UX Sheet with Sticky Bottom Bar) */}
          <AnimatePresence>
            {isFilterDrawerOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <motion.div
                  variants={backdropVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                  onClick={() => setIsFilterDrawerOpen(false)}
                />
                <motion.div
                  variants={drawerRightVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative ml-auto w-full max-w-sm sm:max-w-md bg-white h-[100dvh] shadow-2xl flex flex-col z-10 font-sans"
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 shrink-0 bg-white">
                    <div className="flex items-center gap-2.5">
                      <FilterSlidersIcon className="w-5 h-5 text-[#012520]" />
                      <h2 className="font-serif text-xl font-bold text-neutral-900 tracking-tight">
                        Filters
                      </h2>
                      {activeFilterCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#012520] text-[#F5B418] text-[11px] font-sans font-bold flex items-center justify-center">
                          {activeFilterCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-xs text-[#012520] hover:text-[#C5A262] font-semibold underline underline-offset-2 pr-1 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsFilterDrawerOpen(false)}
                        aria-label="Close filters"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-black hover:bg-stone-100 transition-colors cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Filter Body */}
                  <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain custom-scrollbar">
                    <FilterContent {...filterContentProps} />
                  </div>

                  {/* Sticky Footer: Instant Mobile Filter Action */}
                  <div className="p-4 border-t border-stone-200 bg-white/95 backdrop-blur-xs flex items-center gap-3 pb-8 sm:pb-4 shrink-0 shadow-lg">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="py-3 px-4 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50 hover:text-black transition-all shrink-0 cursor-pointer"
                    >
                      Reset All
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterDrawerOpen(false)}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#012520] text-[#F5B418] text-xs font-bold uppercase tracking-wider hover:bg-[#023F36] transition-all shadow-md active:scale-[0.99] cursor-pointer text-center"
                    >
                      Show {productsData?.total ?? products.length} Fragrances
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Product Grid (Full Available Width with 3 Cols) */}
          <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
            {isLoading && products.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                <ProductGridSkeleton count={6} />
              </div>
            ) : products.length === 0 ? (
              <div className="relative overflow-hidden rounded-3xl p-8 sm:p-14 text-center space-y-6 bg-gradient-to-b from-white via-stone-50/50 to-amber-50/20 backdrop-blur-md border border-stone-200/90 font-sans shadow-sm">
                {/* Ambient Luxury Glow */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-br from-[#F5B418]/15 via-[#012520]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

               

                <div className="relative space-y-2 max-w-lg mx-auto">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
                    No Fragrances Found
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {selectedCategory
                      ? 'Currently, no flacons are cataloged under this specific selection. Try exploring our other master distillations or reset your filters.'
                      : 'No perfume flacons matched this combination of criteria. Try adjusting your filters or explore our royal signature creations.'}
                  </p>
                </div>

                <div className="relative pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#012520] text-[#F5B418] hover:bg-[#023F36] transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                  >
                    Reset All Filters
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch(toggleAiChat(true))}
                    className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider border border-[#012520]/30 text-[#012520] bg-white/80 hover:bg-[#012520] hover:text-[#F5B418] transition-all shadow-2xs hover:shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F5B418]" />
                    <span>Ask AI Perfumer</span>
                  </button>
                </div>

                {/* Quick Discovery Suggestions */}
                {categories.length > 0 && (
                  <div className="relative pt-4 border-t border-stone-200/80 max-w-xl mx-auto">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-3">
                      Explore Popular Collections
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {categories
                        .filter((c) => c.slug !== selectedCategory && c._id !== selectedCategory)
                        .slice(0, 5)
                        .map((c) => (
                          <button
                            key={c._id}
                            type="button"
                            onClick={() => handleCategorySelect(c.slug || c._id)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#012520] hover:text-[#F5B418] text-stone-700 border border-stone-200/90 shadow-2xs hover:border-[#012520] transition-all cursor-pointer active:scale-95"
                          >
                            {c.name}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-neutral-500 font-sans">
                    <span className="font-bold text-neutral-800">
                      {productsData?.total ?? products.length}
                    </span>{' '}
                    fragrances found
                    {isFetching && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-neutral-600 font-semibold animate-pulse">
                        • Updating...
                      </span>
                    )}
                  </p>
                </div>
                <motion.div
                  key={sortBy + selectedCategory}
                  variants={staggerContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className={`grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 transition-opacity duration-200 ${
                    isFetching ? 'opacity-80' : 'opacity-100'
                  }`}
                >
                  {products.map((product) => (
                    <motion.div key={product._id} variants={fadeInUpVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sort Bottom Sheet */}
      <AnimatePresence>
        {isSortSheetOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsSortSheetOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative mt-auto w-full bg-white rounded-t-3xl shadow-2xl p-5 sm:p-6 z-10 font-sans space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-[#012520]" />
                  <h3 className="font-serif text-lg font-bold text-neutral-900">Sort Fragrances</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSortSheetOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-stone-500 hover:text-black hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 pb-6 sm:pb-2">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        buildAndPush({ sort: opt.value });
                        setIsSortSheetOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-sans text-sm font-semibold transition-all cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? 'bg-[#012520] text-[#F5B418] border-[#012520] shadow-xs'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base select-none">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Sticky Mobile Filter & Sort Bar */}
      <AnimatePresence>
        {showStickyMobileBar && !isFilterDrawerOpen && !isSortSheetOpen && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 lg:hidden flex items-center bg-[#012520]/95 text-white rounded-full shadow-2xl p-1.5 border border-[#F5B418]/30 backdrop-blur-md"
          >
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <FilterSlidersIcon className="w-4 h-4 text-[#F5B418]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#F5B418] text-[#012520] text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="w-[1px] h-5 bg-white/20" />

            <button
              type="button"
              onClick={() => setIsSortSheetOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#F5B418]" />
              <span>Sort</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
