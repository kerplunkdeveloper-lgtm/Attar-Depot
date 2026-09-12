'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Droplet,
  Flame,
  Award,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';

export default function HomePage() {
  const { data: categories = [] } = useCategories();
  const { data: productsData, isLoading } = useFeaturedProducts();

  const featured = productsData?.featured || [];
  const bestSellers = productsData?.bestSellers || [];

  return (
    <div className="space-y-24 pb-20 emerald-overlay-bg">
      {/* 1. Regal Hero Banner with Royal Emerald Overlay */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Emerald Green Overlay Vignette */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=1920"
            alt="Attar Depot Kannauj Damask Rose and Pure Agarwood"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center brightness-[0.70] contrast-105 scale-105 animate-in fade-in duration-1000"
          />
          {/* Subtle Emerald Green Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-emerald-950/35" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-white/90" />
        </div>

        {/* Hero Content with Perfect Center Alignment */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-7 pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-emerald-200/90 shadow-emerald-sm backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-700">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-emerald-800 uppercase font-sans">
              The Royal Collection of Pure Attar 
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-neutral-900 leading-[1.05] capitalize">
            Distilled For <br />
            <span className="text-emerald-gradient drop-shadow-sm italic">
              Emperors & Connoisseurs
            </span>
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-neutral-700 max-w-2xl mx-auto font-normal leading-relaxed">
            Zero alcohol. 100% concentrated pure perfume oils, 25-year aged wild Cambodian agarwoods, and Kannauj hydro-distilled Damask roses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/shop"
              className="btn-emerald px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-emerald-md hover:scale-105 transition-all text-white font-sans"
            >
              <span>Explore The Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/about"
              className="px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-800 hover:text-emerald-700 bg-white/90 hover:bg-white border border-emerald-200 shadow-sm backdrop-blur-md transition-all font-sans"
            >
              Discover Our Heritage
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Categories Section with Clean Balanced Alignment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-sans">
              Olfactory Families
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 uppercase mt-1">
               Fragrance Categories
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group font-sans"
          >
            <span>View All Collections</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] glass-card flex flex-col justify-end p-4 border border-emerald-100 hover:border-emerald-300 transition-all duration-300 shadow-emerald-sm hover:shadow-emerald-md"
            >
              <Image
                src={cat.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800'}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="relative z-10 space-y-1 text-left">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-emerald-200 transition-colors leading-tight">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="font-sans text-[11px] text-neutral-300 line-clamp-1">
                    {cat.description}
                  </p>
                )}
                <span className="inline-block text-[10px] text-emerald-300 font-bold tracking-wider uppercase pt-1 font-sans">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Sovereign Attars with Better Alignment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-sans">
            Handcrafted Treasures
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 uppercase">
            Best Selling Elixirs
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-600">
            Timeless concentrated oils celebrated for unmatched projection and intoxicating depth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            (bestSellers.length > 0 ? bestSellers : featured).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* 4. The Art of Distillation Banner */}
      <section className="relative overflow-hidden py-20 bg-gradient-to-r from-[#ECFDF5] via-[#D1FAE5]/60 to-[#ECFDF5] border-y border-emerald-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest font-sans">
                <Flame className="w-3.5 h-3.5 text-emerald-600" /> Deg & Bhapka Hydro-Distillation
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 leading-tight uppercase">
                Centuries of Sacred Perfumery in Every Drop
              </h2>

              <p className="font-sans text-xs sm:text-sm text-neutral-700 leading-relaxed">
                In a modern world saturated with alcohol sprays that evaporate within hours, Attar Depot resurrects the timeless art of pure concentrated perfume oils.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-emerald-sm space-y-1">
                  <div className="text-emerald-800 font-bold text-base font-serif">100% Alcohol Free</div>
                  <p className="font-sans text-xs text-neutral-600">Safe on sensitive skin, prayer-approved (Halal), undiluted pure oils.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-100 shadow-emerald-sm space-y-1">
                  <div className="text-emerald-800 font-bold text-base font-serif">24+ Hour Sillage</div>
                  <p className="font-sans text-xs text-neutral-600">Blends with body warmth to radiate alluring intimacy all day.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="btn-emerald inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-emerald-sm text-white font-sans"
                >
                  <span>Learn the Distillation Secrets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-emerald-200 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1000"
                alt="Ancient distillation of pure attars"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-100 shadow-lg">
                <p className="font-serif text-sm font-medium italic text-emerald-950">
                  "No chemical fixatives, no aerosols. Just pristine botanical soul captured in pure sandalwood bases."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonials Reviews Carousel */}
      <TestimonialCarousel />
    </div>
  );
}
