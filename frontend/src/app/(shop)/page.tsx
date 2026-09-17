'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/product/ProductCard';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';
import HeroBannerCarousel from '@/components/home/HeroBannerCarousel';
import TestimonialCarousel from '@/components/home/TestimonialCarousel';
import InfiniteMarquee from '@/components/home/InfiniteMarquee';

import Faq from '@/components/home/Faq';

export default function HomePage() {
  const { data: productsData, isLoading } = useFeaturedProducts();

  const featured = productsData?.featured || [];
  const bestSellers = productsData?.bestSellers || [];

  return (
    <div className="space-y-24 pb-20 emerald-overlay-bg">
      {/* 1. Hero Banner Carousel */}
      <HeroBannerCarousel />

      {/* 2. Imperial Royal Attar Standards - Infinite Marquee */}
      <div className="relative z-20">
        <InfiniteMarquee />
      </div>



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



      {/* 5. The Art of Distillation Banner */}
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

      {/* 6. Frequently Asked Questions (FAQ) */}
      <Faq />
    </div>
  );
}
