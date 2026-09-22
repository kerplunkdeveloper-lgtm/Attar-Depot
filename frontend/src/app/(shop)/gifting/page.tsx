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

     
    </div>
  );
}
