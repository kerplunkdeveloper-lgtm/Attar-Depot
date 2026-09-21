'use client';

import React from 'react';

interface ProductCardSkeletonProps {
  count?: number;
}

export function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col pt-10 sm:pt-12">
      <div className="relative flex-1 flex flex-col justify-between bg-[#FAF6F0] border border-[#ECE5D8]">
        {/* Flacon Image Placeholder floating out */}
        <div className="relative -mt-10 sm:-mt-12 w-full h-56 sm:h-64 flex items-center justify-center p-4">
          {/* Bottle Silhouette Shimmer */}
          <div className="w-24 sm:w-28 h-40 sm:h-48 rounded-xl bg-stone-300/35 animate-pulse" />

          {/* Soft shadow shimmer */}
          <div className="absolute bottom-3 w-24 h-3 rounded-[100%] bg-stone-900/5 blur-xs" />
        </div>

        {/* Product Information Shimmer */}
        <div className="px-5 pt-2 pb-6 flex-1 flex flex-col justify-between text-center space-y-4">
          <div className="space-y-2 flex flex-col items-center">
            {/* Notes Accord Line */}
            <div className="w-36 h-3 rounded-xs bg-stone-300/40 animate-pulse" />

            {/* Title Shimmer */}
            <div className="w-48 h-5 rounded-xs bg-stone-300/50 animate-pulse mt-1" />

            {/* Target Audience Shimmer */}
            <div className="w-32 h-3.5 rounded-xs bg-stone-300/30 animate-pulse" />

            {/* Rating Shimmer */}
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <div className="w-20 h-3 rounded-xs bg-amber-200/60 animate-pulse" />
              <div className="w-12 h-3 rounded-xs bg-stone-200 animate-pulse" />
            </div>

            {/* Price Shimmer */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <div className="w-14 h-5 rounded-xs bg-stone-300/60 animate-pulse" />
              <div className="w-12 h-4 rounded-xs bg-stone-200 animate-pulse" />
              <div className="w-12 h-4 rounded-xs bg-emerald-200/60 animate-pulse" />
            </div>
          </div>

          {/* Button Shimmer */}
          <div className="pt-2 w-full">
            <div className="w-full h-11 border border-stone-300 bg-stone-100/40 animate-pulse" />
          </div>
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
