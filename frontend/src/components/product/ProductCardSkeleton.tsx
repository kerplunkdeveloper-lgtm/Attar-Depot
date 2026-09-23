'use client';

import React from 'react';

interface ProductCardSkeletonProps {
  count?: number;
}

export function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col pt-7 sm:pt-12">
      <div className="relative flex-1 flex flex-col justify-between bg-[#FAF6F0] border border-[#ECE5D8]">
        {/* Flacon Image Placeholder */}
        <div className="relative -mt-7 sm:-mt-12 w-full h-40 sm:h-64 flex items-center justify-center p-2 sm:p-4">
          {/* Bottle Silhouette Shimmer */}
          <div className="w-16 sm:w-28 h-28 sm:h-48 rounded-xl bg-stone-300/35 animate-pulse" />

          {/* Soft shadow shimmer */}
          <div className="absolute bottom-2 sm:bottom-3 w-16 sm:w-24 h-2 sm:h-3 rounded-[100%] bg-stone-900/5 blur-xs" />
        </div>

        {/* Product Information Shimmer */}
        <div className="px-2.5 sm:px-5 pt-1 sm:pt-2 pb-3.5 sm:pb-6 flex-1 flex flex-col justify-between text-center space-y-2 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2 flex flex-col items-center">
            {/* Notes Accord Line */}
            <div className="w-20 sm:w-36 h-2.5 sm:h-3 rounded-xs bg-stone-300/40 animate-pulse" />

            {/* Title Shimmer */}
            <div className="w-28 sm:w-48 h-3.5 sm:h-5 rounded-xs bg-stone-300/50 animate-pulse mt-0.5 sm:mt-1" />

            {/* Target Audience Shimmer */}
            <div className="w-20 sm:w-32 h-2.5 sm:h-3.5 rounded-xs bg-stone-300/30 animate-pulse" />

            {/* Rating Shimmer */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1">
              <div className="w-14 sm:w-20 h-2.5 sm:h-3 rounded-xs bg-amber-200/60 animate-pulse" />
              <div className="w-8 sm:w-12 h-2.5 sm:h-3 rounded-xs bg-stone-200 animate-pulse" />
            </div>

            {/* Price Shimmer */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-0.5 sm:pt-1">
              <div className="w-10 sm:w-14 h-3.5 sm:h-5 rounded-xs bg-stone-300/60 animate-pulse" />
              <div className="w-8 sm:w-12 h-3 sm:h-4 rounded-xs bg-stone-200 animate-pulse" />
              <div className="w-8 sm:w-12 h-3 sm:h-4 rounded-xs bg-emerald-200/60 animate-pulse" />
            </div>
          </div>

          {/* Button Shimmer */}
          <div className="pt-1 sm:pt-2 w-full">
            <div className="w-full h-8 sm:h-11 border border-stone-300 bg-stone-100/40 animate-pulse" />
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
