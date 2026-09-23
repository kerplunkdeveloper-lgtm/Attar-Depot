'use client';

import dynamic from 'next/dynamic';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';

const ShopClient = dynamic(() => import('./ShopClient'), {
  ssr: false,
  loading: () => (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 font-sans">
      <div className="border-b border-emerald-100 pb-4 sm:pb-6 animate-pulse">
        <div className="h-8 w-64 bg-neutral-200 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-neutral-100 rounded-md" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  ),
});

export default function ShopPage() {
  return <ShopClient />;
}
