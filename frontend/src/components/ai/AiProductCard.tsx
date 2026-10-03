'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleAiChat } from '@/store/uiSlice';

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

  const handleViewProduct = () => {
    dispatch(toggleAiChat(false));
  };

  const discountPercent =
    defaultOriginalPrice && defaultOriginalPrice > defaultPrice
      ? Math.round(((defaultOriginalPrice - defaultPrice) / defaultOriginalPrice) * 100)
      : 0;

  return (
    <div className="shrink-0 w-[205px] sm:w-[225px] snap-start bg-white rounded-2xl border border-[#F5B418]/30 shadow-[0_4px_16px_rgba(1,37,32,0.06)] hover:shadow-[0_8px_25px_rgba(245,180,24,0.18)] hover:border-[#F5B418] overflow-hidden flex flex-col justify-between transition-all group">
      {/* Product Image with Skeleton Loading */}
      <Link
        href={`/product/${product.slug}`}
        onClick={handleViewProduct}
        className="relative aspect-square w-full bg-[#FAF8F2] overflow-hidden block"
      >
        {!isImgLoaded && (
          <div className="absolute inset-0 skeleton-emerald z-0" />
        )}
        <Image
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=600'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 205px, 225px"
          onLoad={() => setIsImgLoaded(true)}
          className={`object-cover transition-all duration-500 group-hover:scale-105 ${
            isImgLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-xs'
          }`}
        />

        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-emerald-800 to-emerald-950 text-[#F5B418] border border-[#F5B418]/40 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
            Save {discountPercent}%
          </span>
        )}

        <span className="absolute bottom-2 left-2 text-[9.5px] font-semibold text-[#012520] bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full border border-[#F5B418]/30 shadow-2xs max-w-[85%] truncate">
          {product.fragranceFamily || 'Pure Attar'}
        </span>
      </Link>

      {/* Details */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-[#FDFBF7]">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-[11px] mb-1">
            <Star className="w-3 h-3 fill-[#F5B418] text-[#F5B418]" />
            <span className="font-bold text-neutral-800">
              {product.ratings?.average || 4.9}
            </span>
            <span className="text-neutral-400 text-[10px]">
              ({product.ratings?.count || 14})
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            onClick={handleViewProduct}
            className="block font-serif text-[13px] font-bold text-neutral-900 hover:text-[#046A5A] transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1 font-sans">
            <span className="text-sm font-black text-neutral-900">
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
            className={`py-2 px-2 rounded-xl text-[11px] font-bold tracking-wide flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isAdded
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-[#F5B418] hover:brightness-110 active:scale-95 border border-[#F5B418]/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 shrink-0 text-emerald-300" />
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
            onClick={handleViewProduct}
            className="py-2 px-2 rounded-xl text-[11px] font-semibold text-neutral-700 bg-white hover:bg-neutral-50 active:scale-95 border border-neutral-200 hover:border-[#F5B418] flex items-center justify-center gap-1 transition-all"
          >
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}

