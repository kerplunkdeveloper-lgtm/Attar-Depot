'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Search,
  Crown,
  ArrowRight,
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
      {/* ── Full-Width Luxury Gifting Banner ─────────────────────────────────── */}
      <section className="w-full relative overflow-hidden bg-[#011C16]">
        <div className="relative w-full aspect-[21/8] sm:aspect-[21/7] lg:aspect-[21/6.5] min-h-[190px] xs:min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[460px] overflow-hidden">
          <Image
            src="/images/giftbanner1.png"
            alt="Attar Depot Gift Collection Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Subtle bottom vignette blending into the page background */}
          <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Gifting Atelier Sub-Hero Header & Filters ───────────────────────── */}
      <section id="gifts-by-price" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8">
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#011C16]/5 border border-[#F5B418]/50 text-[#012520] text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-xs">
            <Crown className="w-3.5 h-3.5 text-[#F5B418]" />
            <span>Royal Fragrance Gifting Atelier</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
            Curated Gifts That Linger Forever
          </h1>

          <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Pure alcohol-free attars hand-poured into artisan crystal flacons and emerald velvet coffrets.
            Explore our curated gift collection or discover bespoke corporate gifting.
          </p>

          {/* Quick CTA to Corporate Gifting */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <Link
              href="/corporate-gifting"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#012520] text-[#F5B418] border border-[#F5B418]/40 hover:bg-[#02332A] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Corporate &amp; Bulk Gifting →</span>
            </Link>
          </div>

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
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
                    isActive
                      ? 'bg-[#012520] text-[#F5B418] border-[#F5B418]/60 shadow-md scale-[1.02]'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#F5B418] hover:text-[#012520] shadow-2xs'
                  }`}
                >
                  <span>{tab.label}</span>
                  {!isLoading && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-[#F5B418] text-[#012520]'
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

      {/* ── Corporate Gifting Highlight Banner ─────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#011C16] via-[#02332A] to-[#011C16] border border-[#F5B418]/50 p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5B418]/20 border border-[#F5B418]/50 text-[#F5B418] text-[11px] font-bold uppercase tracking-wider">
                <Crown className="w-3.5 h-3.5" />
                <span>B2B & Bulk Inquiries</span>
              </span>
              <h2 className="font-serif text-xl sm:text-3xl font-bold text-white tracking-tight">
                Corporate & Bespoke Event Gifting
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
                Planning bulk gifts for executives, clients, festive hampers (Diwali &amp; Eid), or luxury weddings? We offer custom 24K gold foil company branding, engraved flacons, and direct wholesale slabs.
              </p>
            </div>
            <Link
              href="/corporate-gifting"
              className="shrink-0 px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#011C16] bg-gradient-to-r from-[#F5B418] via-[#FFDF78] to-[#E5A412] hover:brightness-110 active:scale-95 shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore Corporate Gifting</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Gift Pure Attar ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center space-y-2 mb-8">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            The Royal Tradition of Gifting Pure Attar
          </h2>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Pure attar is more than a perfume — it is an intimate heirloom of prestige, warmth, and purity.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_GIFT.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all space-y-2 text-center"
            >
              <span className="text-3xl block">{item.icon}</span>
              <h3 className="font-serif text-sm font-bold text-neutral-900">{item.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
