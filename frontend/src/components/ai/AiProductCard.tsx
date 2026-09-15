'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, ArrowUpRight, Check } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';

interface AiProductCardProps {
  product: Product;
}

export default function AiProductCard({ product }: AiProductCardProps) {
  const dispatch = useAppDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  const defaultSizeOption = product.sizes?.[0];
  const defaultSize = defaultSizeOption?.size || '6ml';
  const defaultPrice = defaultSizeOption?.price || product.price;
  const defaultOriginalPrice = defaultSizeOption?.originalPrice || product.originalPrice;
  const defaultStock = defaultSizeOption?.stock ?? product.stock ?? 10;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600',
        size: defaultSize,
        price: defaultPrice,
        originalPrice: defaultOriginalPrice,
        quantity: 1,
        stock: defaultStock,
      })
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const discountPercent =
    defaultOriginalPrice && defaultOriginalPrice > defaultPrice
      ? Math.round(((defaultOriginalPrice - defaultPrice) / defaultOriginalPrice) * 100)
      : 0;

  return (
    <div className="shrink-0 w-[215px] sm:w-64 snap-start bg-white rounded-2xl border border-emerald-100/90 shadow-sm overflow-hidden flex flex-col justify-between transition-all hover:shadow-md hover:border-emerald-200">
      {/* Product Image with Skeleton Loading */}
      <div className="relative aspect-square w-full bg-[#FAF8F2] overflow-hidden group">
        {!isImgLoaded && (
          <div className="absolute inset-0 skeleton-emerald z-0" />
        )}
        <Image
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 215px, 256px"
          onLoad={() => setIsImgLoaded(true)}
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            isImgLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-xs'
          }`}
        />

        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
            Save {discountPercent}%
          </span>
        )}

        <span className="absolute bottom-2 left-2 text-[10px] font-semibold text-emerald-900 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-emerald-100 shadow-2xs max-w-[85%] truncate">
          {product.fragranceFamily || 'Pure Attar'}
        </span>
      </div>

      {/* Details */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-[11px] mb-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-neutral-800">
              {product.ratings?.average || 4.9}
            </span>
            <span className="text-neutral-400 text-[10px]">
              ({product.ratings?.count || 14})
            </span>
          </div>

          <h4 className="font-serif text-sm font-bold text-neutral-900 line-clamp-1" title={product.name}>
            {product.name}
          </h4>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1 font-sans">
            <span className="text-sm font-bold text-neutral-900">
              ₹{defaultPrice.toLocaleString('en-IN')}
            </span>
            {defaultOriginalPrice && defaultOriginalPrice > defaultPrice && (
              <span className="text-[11px] text-neutral-400 line-through">
                ₹{defaultOriginalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] text-neutral-500 font-medium ml-auto">
              {defaultSize}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`py-2 px-2 rounded-xl text-[11px] font-bold tracking-wide flex items-center justify-center gap-1 transition-all ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>+ Cart</span>
              </>
            )}
          </button>

          <Link
            href={`/product/${product.slug}`}
            className="py-2 px-2 rounded-xl text-[11px] font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200/80 active:scale-95 flex items-center justify-center gap-1 transition-all"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
