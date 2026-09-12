import { Suspense } from 'react';
import ShopClient from './ShopClient';
import ProductGridSkeleton from '@/components/product/ProductCardSkeleton';

export const dynamic = 'force-dynamic';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
          <div className="border-b border-emerald-100 pb-6 animate-pulse">
            <div className="h-8 w-64 bg-neutral-200 rounded-lg mb-2" />
            <div className="h-4 w-96 bg-neutral-100 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductGridSkeleton count={6} />
          </div>
        </div>
      }
    >
      <ShopClient />
    </Suspense>
  );
}
