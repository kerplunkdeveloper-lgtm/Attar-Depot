'use client';

import React from 'react';

interface ProductCardSkeletonProps {
  count?: number;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl glass-card overflow-hidden flex flex-col justify-between border border-emerald-100/70 bg-white shadow-xs">
      {/* Flacon Image Placeholder */}
      <div className="relative aspect-square w-full skeleton-emerald overflow-hidden">
        {/* Shimmer Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className="w-16 h-4 rounded-full bg-emerald-200/60 skeleton-shimmer" />
        </div>

        {/* Shimmer Category Pill */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="w-20 h-5 rounded-full bg-white/80 skeleton-shimmer border border-emerald-100" />
        </div>
      </div>

      {/* Product Information Shimmer */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Rating Shimmer */}
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-3.5 rounded bg-emerald-100/70 skeleton-shimmer" />
            <div className="w-8 h-3 rounded bg-neutral-100 skeleton-shimmer" />
          </div>

          {/* Title Shimmer */}
          <div className="space-y-1.5 pt-1">
            <div className="w-4/5 h-5 rounded-md bg-neutral-200/80 skeleton-shimmer" />
            <div className="w-1/2 h-3 rounded bg-neutral-100 skeleton-shimmer" />
          </div>

          {/* Fragrance Notes Tagline Shimmer */}
          <div className="w-3/4 h-3 rounded bg-emerald-50 skeleton-shimmer mt-1" />
        </div>

        {/* Price & Action Shimmer */}
        <div className="pt-3 border-t border-emerald-100/70 flex items-center justify-between">
          <div className="space-y-1">
            <div className="w-20 h-5 rounded-md bg-emerald-200/70 skeleton-shimmer" />
            <div className="w-12 h-2.5 rounded bg-neutral-100 skeleton-shimmer" />
          </div>

          <div className="w-9 h-9 rounded-xl bg-emerald-100/80 skeleton-shimmer border border-emerald-200/50" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGridSkeleton({ count = 4 }: ProductCardSkeletonProps) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}
