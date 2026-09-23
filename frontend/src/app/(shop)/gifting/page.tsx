'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Search,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';
import { Product } from '@/types';

// ── Price filter tabs ─────────────────────────────────────────────────────────
type PriceFilter = 'all' | 'under-999' | 'over-999';

const PRICE_TABS: Array<{ id: PriceFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'under-999', label: 'Under ₹999' },
  { id: 'over-999', label: 'Over ₹999' },
];

// Helper to determine lowest or base price of a product
const getEffectivePrice = (product: Product): number => {
  if (product.sizes && product.sizes.length > 0) {
    const validPrices = product.sizes
      .map((s) => s.price)
      .filter((p): p is number => typeof p === 'number' && !isNaN(p));
    if (validPrices.length > 0) return Math.min(...validPrices);
  }
  return product.price || 0;
};

// ── Why Gift Attar cards ──────────────────────────────────────────────────────
const WHY_GIFT = [
  {
    icon: '🌿',
    title: '100% Alcohol-Free',
    desc: 'Halal-certified pure oils — perfect for all faiths and sensitivities.',
  },
  {
    icon: '⏳',
    title: 'Lasts 24+ Hours',
    desc: 'Unlike sprays, pure attar lingers on skin all day — a lasting memory.',
  },
  {
    icon: '🎁',
    title: 'Elegant Presentation',
    desc: 'Hand-poured in artisan crystal flacons, ready to gift as-is.',
  },
  {
    icon: '🌍',
    title: 'Heritage Gifting',
    desc: 'A centuries-old tradition — gifting attar is a mark of royalty.',
  },
];

export default function GiftingPage() {
  const [selectedPriceTab, setSelectedPriceTab] = useState<PriceFilter>('all');

  const { data: categories = [] } = useCategories();

  // Find the "Gifted" / "Gifting" category from database
  const giftedCategory = useMemo(() => {
    return categories.find((c) => {
      const slug = (c.slug || '').toLowerCase();
      const name = (c.name || '').toLowerCase();
      return (
        slug === 'gifted' ||
        slug === 'gifting' ||
        slug.includes('gift') ||
        name.includes('gift')
      );
    });
  }, [categories]);

  // Fetch products under the Gifted category (or fallback to occasion=Gifting / gift)
  const { data: productsData, isLoading } = useProducts({
    category: giftedCategory ? giftedCategory.slug : 'gifted',
    limit: 60,
    sort: 'popular',
  });

  const rawProducts = productsData?.products || [];

  // Filter products by selected price tab (All, Under ₹999, Over ₹999)
  const filteredProducts = useMemo(() => {
    return rawProducts.filter((product) => {
      const price = getEffectivePrice(product);
      if (selectedPriceTab === 'under-999') {
        return price <= 999;
      }
      if (selectedPriceTab === 'over-999') {
        return price > 999;
      }
      return true;
    });
  }, [rawProducts, selectedPriceTab]);

  // Count items per price tab
  const tabCounts = useMemo(() => {
    return {
      all: rawProducts.length,
      'under-999': rawProducts.filter((p) => getEffectivePrice(p) <= 999).length,
      'over-999': rawProducts.filter((p) => getEffectivePrice(p) > 999).length,
    };
  }, [rawProducts]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-16">
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#012520]">
        <div className="relative w-full">
          <Image
            src="/images/giftbanner1.png"
            alt="Attar Depot Gift Collection Banner"
            width={1920}
            height={800}
            priority
            sizes="100vw"
            className="w-full h-auto object-cover block"
          />
          {/* Subtle royal emerald tint overlay */}
          <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />
          {/* Elegant bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-14 md:h-20 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/30 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Section Right Next to Banner: SHOP GIFTS BY PRICE ──────────────── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
        {/* Heading & Intro */}
        <div className="text-center space-y-2.5 mb-6 sm:mb-10">
         
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            SHOP GIFTS BY PRICE
          </h1>


          {/* Price Filter Tabs: All, Under ₹999, Over ₹999 */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 pt-3 flex-wrap">
            {PRICE_TABS.map((tab) => {
              const isActive = selectedPriceTab === tab.id;
              const count = tabCounts[tab.id];
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedPriceTab(tab.id)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 border ${
                    isActive
                      ? 'bg-emerald-900 text-white border-emerald-900 shadow-md shadow-emerald-950/15 scale-[1.02]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-emerald-600 hover:text-emerald-900 shadow-2xs'
                  }`}
                >
                  <span>{tab.label}</span>
                  {!isLoading && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid with 2 Columns on Mobile & 4 Columns on Desktop */}
        <div>
          {isLoading && rawProducts.length === 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              <ProductGridSkeleton count={8} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-2xl glass-card p-8 sm:p-12 text-center space-y-4 bg-white border border-emerald-100 font-sans max-w-md mx-auto">
              <Search className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
              <h3 className="font-serif text-xl font-bold text-neutral-800">
                No Gifts in This Price Range
              </h3>
              <p className="font-sans text-xs text-neutral-500">
                We couldn&apos;t find any gifted fragrances matching this specific price filter.
              </p>
              <button
                type="button"
                onClick={() => setSelectedPriceTab('all')}
                className="px-5 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-emerald-900 transition-colors"
              >
                View All Gifts
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-neutral-500 font-sans">
                  Showing <span className="font-bold text-neutral-900">{filteredProducts.length}</span> luxury gifts
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Why Gift Attar ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-neutral-200/60 mt-8">
        <div className="text-center mb-8">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
            Why Gift Royal Attar?
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Pure luxury distilled into crystal flacons that make lasting impressions.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {WHY_GIFT.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-emerald-100/80 p-4 sm:p-5 space-y-2 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all text-center sm:text-left"
            >
              <span className="text-2xl sm:text-3xl block">{item.icon}</span>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-neutral-900">
                {item.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
