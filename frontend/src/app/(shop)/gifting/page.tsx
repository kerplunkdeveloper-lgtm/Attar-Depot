'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Gift,
  Star,
  Heart,
  ArrowRight,
  Sparkles,
  Crown,
  PackageCheck,
  MessageCircle,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';

// ── Occasion cards ────────────────────────────────────────────────────────────
const OCCASIONS = [
  {
    id: 'birthday',
    emoji: '🎂',
    label: 'Birthday',
    desc: 'Celebrate with a timeless scent',
    color: 'from-rose-50 to-pink-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    badge: 'bg-rose-100',
    query: 'Birthday',
  },
  {
    id: 'wedding',
    emoji: '💍',
    label: 'Wedding',
    desc: 'A fragrant blessing for the couple',
    color: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    badge: 'bg-amber-100',
    query: 'Wedding',
  },
  {
    id: 'eid',
    emoji: '🌙',
    label: 'Eid & Festivals',
    desc: 'Pure halal attars for celebrations',
    color: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100',
    query: 'Eid',
  },
  {
    id: 'anniversary',
    emoji: '❤️',
    label: 'Anniversary',
    desc: 'Mark every milestone with love',
    color: 'from-red-50 to-rose-50',
    border: 'border-red-200',
    text: 'text-red-700',
    badge: 'bg-red-100',
    query: 'Anniversary',
  },
  {
    id: 'corporate',
    emoji: '🤝',
    label: 'Corporate Gift',
    desc: 'Premium gifting for clients & team',
    color: 'from-slate-50 to-blue-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    badge: 'bg-slate-100',
    query: 'Corporate',
  },
  {
    id: 'newborn',
    emoji: '👶',
    label: 'New Baby',
    desc: 'Gentle, pure scents for new arrivals',
    color: 'from-sky-50 to-cyan-50',
    border: 'border-sky-200',
    text: 'text-sky-700',
    badge: 'bg-sky-100',
    query: 'New Baby',
  },
];

// ── Gift price tiers ──────────────────────────────────────────────────────────
const GIFT_TIERS = [
  {
    label: 'Thoughtful',
    range: 'Under ₹1,999',
    icon: Heart,
    color: 'from-rose-600 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    query: 'under-1999',
  },
  {
    label: 'Premium',
    range: '₹2,000 – ₹3,999',
    icon: Star,
    color: 'from-amber-600 to-yellow-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    query: '2000-2999',
  },
  {
    label: 'Luxe',
    range: '₹4,000 – ₹5,999',
    icon: Crown,
    color: 'from-emerald-700 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    query: '4000-4999',
  },
];

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
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedTier, setSelectedTier] = useState('');

  // Fetch products filtered by occasion if selected, else best sellers
  const { data: productsData, isLoading } = useProducts({
    sort: 'popular',
    limit: 8,
    occasion: selectedOccasion || undefined,
    priceRange: selectedTier || undefined,
  });

  const products = productsData?.products || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans">
      {/* ── Hero Banner ──────────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden">
        {/* Mobile: aspect-video (16:9) | Tablet+: fixed height */}
        <div className="relative w-full aspect-video sm:aspect-auto sm:h-[380px] md:h-[460px] lg:h-[540px]">
          <Image
            src="/images/giftbanner.png"
            alt="Attar Depot Gift Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-top sm:object-center"
          />
          {/* Subtle bottom fade to blend into page */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAF9F6] to-transparent pointer-events-none" />
        </div>
      </section>

      {/* ── Why Gift Attar ───────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {WHY_GIFT.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl border border-emerald-100 p-5 space-y-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-serif text-sm font-bold text-neutral-900">{item.title}</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gift Finder ──────────────────────────────────────────────────────── */}
      <section id="gift-finder" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 space-y-12">
        {/* Step 1: Occasion */}
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Step 1
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              What&apos;s the Occasion?
            </h2>
            <p className="text-xs text-neutral-500">
              Select an occasion to discover curated fragrances
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {OCCASIONS.map((occ) => {
              const isSelected = selectedOccasion === occ.query;
              return (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(isSelected ? '' : occ.query)}
                  className={`group relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center hover:-translate-y-0.5 active:scale-95 ${
                    isSelected
                      ? `bg-gradient-to-br ${occ.color} ${occ.border} border-2 shadow-md`
                      : 'bg-white border-neutral-200 hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  <span className="text-2xl">{occ.emoji}</span>
                  <span
                    className={`text-[11px] font-bold leading-tight ${
                      isSelected ? occ.text : 'text-neutral-700'
                    }`}
                  >
                    {occ.label}
                  </span>
                  {isSelected && (
                    <span
                      className={`absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full ${occ.badge} ${occ.text} flex items-center justify-center text-[8px] font-bold`}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Budget */}
        <div className="space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
              Step 2
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
              Choose Your Budget
            </h2>
            <p className="text-xs text-neutral-500">Every price point has a royal gift</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GIFT_TIERS.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.query;
              return (
                <button
                  key={tier.label}
                  onClick={() => setSelectedTier(isSelected ? '' : tier.query)}
                  className={`group flex items-center gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-0.5 active:scale-95 ${
                    isSelected
                      ? `${tier.bg} ${tier.border} border-2 shadow-md`
                      : 'bg-white border-neutral-200 hover:border-emerald-300 hover:shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center shadow-sm shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-neutral-900 font-serif">{tier.label}</p>
                    <p className="text-[11px] text-neutral-500">{tier.range}</p>
                  </div>
                  {isSelected && (
                    <span className="ml-auto text-emerald-700 font-bold text-xs">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product Results ──────────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">
                {selectedOccasion || selectedTier
                  ? 'Matching Gift Fragrances'
                  : 'Most Gifted Attars'}
              </h2>
              {!isLoading && (
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  {productsData?.total || products.length} fragrances found
                </p>
              )}
            </div>
            {(selectedOccasion || selectedTier) && (
              <button
                onClick={() => {
                  setSelectedOccasion('');
                  setSelectedTier('');
                }}
                className="text-[11px] text-emerald-700 font-semibold hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProductGridSkeleton count={8} />
            </div>
          ) : products.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Gift className="w-12 h-12 text-emerald-300 mx-auto" />
              <p className="font-serif text-lg font-bold text-neutral-700">No matches found</p>
              <p className="text-xs text-neutral-400">Try a different occasion or budget range</p>
              <button
                onClick={() => {
                  setSelectedOccasion('');
                  setSelectedTier('');
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-900 transition-all"
              >
                Show All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md"
            >
              <span>Explore Full Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Gift Promise Banner ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-emerald-900 via-[#023129] to-emerald-900 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <PackageCheck className="w-8 h-8 text-[#F5B418] mx-auto" />
              <p className="font-serif text-base font-bold text-white">Elegant Packaging</p>
              <p className="text-[11px] text-emerald-200/80">
                Every order arrives in a premium gift-ready flacon box
              </p>
            </div>
            <div className="space-y-2">
              <MessageCircle className="w-8 h-8 text-[#F5B418] mx-auto" />
              <p className="font-serif text-base font-bold text-white">Personal Message</p>
              <p className="text-[11px] text-emerald-200/80">
                Add a handwritten note at checkout — free of charge
              </p>
            </div>
            <div className="space-y-2">
              <Sparkles className="w-8 h-8 text-[#F5B418] mx-auto" />
              <p className="font-serif text-base font-bold text-white">100% Satisfaction</p>
              <p className="text-[11px] text-emerald-200/80">
                Loved by 10,000+ gift recipients across India
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Browse by Occasion CTA ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Shop by Occasion
          </h2>
          <p className="text-xs text-neutral-500">
            Every fragrance tells a different love story
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {OCCASIONS.map((occ) => (
            <Link
              key={occ.id}
              href={`/shop?occasion=${encodeURIComponent(occ.query)}`}
              className={`group flex items-center gap-3 p-4 rounded-2xl border bg-gradient-to-br ${occ.color} ${occ.border} hover:shadow-md hover:-translate-y-0.5 transition-all`}
            >
              <span className="text-2xl">{occ.emoji}</span>
              <div>
                <p className={`text-xs font-bold ${occ.text}`}>{occ.label}</p>
                <p className="text-[10px] text-neutral-500">{occ.desc}</p>
              </div>
              <ArrowRight
                className={`w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 ${occ.text} transition-opacity`}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
