'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, Check } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleCartDrawer, toggleWishlistDrawer } from '@/store/uiSlice';
import { toggleWishlist } from '@/store/wishlistSlice';
import { toast } from '@/lib/toast';

const FALLBACK_IMAGE =
  'https://scentira.in/cdn/shop/files/ajmal-cyan-oud-eau-de-parfum-perfume-8349662.png?v=1782869421&width=1000';

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.images?.[0] || FALLBACK_IMAGE);

  const handlePrefetch = () => {
    // 1. Instant Cache Seeding: Makes product page load with 0ms delay!
    queryClient.setQueryData(['product', product.slug], (existing: any) => {
      if (existing?.product) return existing;
      return { product, relatedProducts: [] };
    });

    // 2. Prefetch full product details with reviews and related items
    queryClient.prefetchQuery({
      queryKey: ['product', product.slug],
      queryFn: async () => {
        const { data } = await api.get(`/products/${product.slug}`);
        return data;
      },
      staleTime: 5 * 60 * 1000,
    });

    // 3. Preload the flacon image into browser memory cache
    if (typeof window !== 'undefined' && product.images?.[0]) {
      const img = new window.Image();
      img.src = product.images[0];
    }
  };
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some((item) => item.productId === product._id)
  );
  const [isAdding, setIsAdding] = useState(false);

  const defaultSizeObj = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
  const sizeName = defaultSizeObj ? defaultSizeObj.size : '100 ML';
  const itemPrice = defaultSizeObj ? defaultSizeObj.price : product.price;
  const originalPrice = defaultSizeObj?.originalPrice || product.originalPrice;

  const discountPercent =
    originalPrice && originalPrice > itemPrice
      ? Math.round(((originalPrice - itemPrice) / originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: imageSrc,
        size: sizeName,
        price: itemPrice,
        originalPrice: originalPrice,
        quantity: 1,
        stock: product.stock,
      })
    );

    toast.success(`${product.name} added to your cart.`, {
      title: 'Added to Cart',
      action: {
        label: 'View Cart',
        onClick: () => dispatch(toggleCartDrawer(true)),
      },
    });

    setTimeout(() => {
      setIsAdding(false);
    }, 1800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleWishlist({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: imageSrc,
        size: sizeName,
        price: itemPrice,
        originalPrice: originalPrice,
        stock: product.stock,
        fragranceFamily: product.fragranceFamily,
        tagline: product.tagline,
        gender: product.gender,
      })
    );

    if (!isWishlisted) {
      toast.success(`${product.name} saved to your royal wishlist.`, {
        title: 'Wishlist Updated',
        action: {
          label: 'View Wishlist',
          onClick: () => dispatch(toggleWishlistDrawer(true)),
        },
      });
    } else {
      toast.info(`${product.name} removed from wishlist.`);
    }
  };

  // Olfactory notes line (matching reference "FRESH FRUITY MUSK WITH WARM...")
  const notesHeader =
    product.fragranceNotes?.topNotes && product.fragranceNotes.topNotes.length > 0
      ? product.fragranceNotes.topNotes.slice(0, 3).join(' • ').toUpperCase()
      : product.fragranceFamily
      ? `${product.fragranceFamily.toUpperCase()} ACCORD`
      : product.category?.name
      ? `${product.category.name.toUpperCase()} ACCORD`
      : 'ROYAL ARTISANAL ACCORD';

  // Dynamic Subtitle / Target Audience (Prioritizes tagline from database, with smart dynamic gender fallback)
  const targetAudience = (() => {
    // 1. If product has a custom tagline from database, display it dynamically
    if (product.tagline && product.tagline.trim() !== '') {
      return product.tagline;
    }

    // 2. Dynamic gender formatting (handles case-insensitive and custom values)
    if (product.gender && product.gender.trim() !== '') {
      const g = product.gender.trim();
      const lower = g.toLowerCase();

      if (lower === 'unisex' || lower === 'both' || lower === 'all') {
        return 'For Men And Women';
      }
      if (lower === 'men' || lower === 'male') {
        return 'For Men';
      }
      if (lower === 'women' || lower === 'female') {
        return 'For Women';
      }
      if (lower.startsWith('for ')) {
        return g;
      }
      return `For ${g}`;
    }

    // 3. Fallback to royal collection or category if available
    if (product.collection && product.collection.trim() !== '') {
      return `${product.collection} Edition`;
    }
    if (product.category?.name) {
      return `Pure ${product.category.name}`;
    }

    return 'For Men And Women';
  })();

  const reviewCount = product.ratings?.count || 9;
  const starCount = 5;

  return (
    <div
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
      className="group relative flex flex-col pt-7 sm:pt-12 transition-all duration-300"
    >
      {/* ── Outer Card Box with Warm Ivory/Cream Background (matching reference #FAF6F0) ── */}
      <div className="relative flex-1 flex flex-col justify-between bg-[#FAF6F0] border border-[#ECE5D8] rounded-xs sm:rounded-none transition-all duration-300 hover:border-stone-300/80 hover:shadow-xs">
        {/* Top Badges / Wishlist (Clean & Minimalist) */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-3 z-20 flex items-center justify-end pointer-events-none">
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isWishlisted ? 'Remove from royal wishlist' : 'Save to royal wishlist'}
            className={`pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 border rounded-full ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-white/80 hover:bg-white text-stone-500 hover:text-rose-600 border-stone-200/80 shadow-2xs'
            }`}
          >
            <Heart
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
                isWishlisted
                  ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]'
                  : 'text-stone-500 stroke-[1.8]'
              }`}
            />
          </button>
        </div>

        {/* ── Perfume Bottle Showcase with Top Pop-out Effect ── */}
        <Link
          href={`/product/${product.slug}`}
          prefetch={true}
          onMouseEnter={handlePrefetch}
          onFocus={handlePrefetch}
          className="relative -mt-7 sm:-mt-20 w-full h-40 sm:h-64 flex items-center justify-center p-2 sm:p-4 overflow-visible group/img"
        >
          {/* Skeleton Shimmer */}
          {!isImageLoaded && (
            <div className="absolute inset-x-4 sm:inset-x-8 top-6 sm:top-10 bottom-4 sm:bottom-6 bg-stone-200/40 animate-pulse rounded-md z-0" />
          )}

          {/* Soft 3D Pedestal Shadow directly under bottle base */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 w-16 sm:w-32 h-2 sm:h-3.5 bg-stone-900/10 rounded-[100%] blur-[4px] sm:blur-[5px] pointer-events-none group-hover:scale-95 group-hover:opacity-75 transition-all duration-500" />

          {/* Flacon Image (Pop-out, with seamless blend) */}
          <div className="relative w-full h-full max-h-[145px] sm:max-h-[240px] flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageSrc(FALLBACK_IMAGE)}
              className="object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-1.5"
            />
          </div>
        </Link>

        {/* ── Product Information & Centered Details ── */}
        <div className="px-2.5 sm:px-5 pt-1 sm:pt-2 pb-3.5 sm:pb-6 flex-1 flex flex-col justify-between text-center space-y-2 sm:space-y-4">
          <div className="space-y-1 sm:space-y-1.5">
            {/* 1. Fragrance Notes / Accord (FRESH FRUITY MUSK WITH WARM...) */}
            <p className="font-sans text-[9px] sm:text-[11px] font-medium uppercase tracking-[0.08em] sm:tracking-[0.14em] text-stone-500 truncate max-w-full mx-auto px-0.5">
              {notesHeader}
            </p>

            {/* 2. Product Name (Cyan Oud Perfume 100 ML) */}
            <Link
              href={`/product/${product.slug}`}
              prefetch={true}
              onMouseEnter={handlePrefetch}
              onFocus={handlePrefetch}
              className="block group/title"
            >
              <h3 className="font-serif text-sm sm:text-[21px] font-medium sm:font-normal text-stone-900 group-hover/title:text-emerald-950 transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* 3. Subtitle / Target Audience (For Men And Women) */}
            <p className="font-serif text-[11px] sm:text-base text-stone-700 line-clamp-1 leading-tight">
              {targetAudience}
            </p>

            {/* 4. Star Ratings + Review Count (★★★★★ 9 reviews) */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1 font-sans">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(starCount)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-[#E5A118] text-[#E5A118]"
                  />
                ))}
              </div>
              <span className="text-stone-700 text-[10px] sm:text-xs font-normal">
                {reviewCount} reviews
              </span>
            </div>

            {/* 5. Pricing Row: ₹2,250 ₹2,500 10% Off */}
            <div className="flex flex-wrap items-baseline justify-center gap-1 sm:gap-2 pt-0.5 sm:pt-1 font-sans">
              <span className="text-sm sm:text-lg font-bold text-stone-900">
                {formatPrice(itemPrice)}
              </span>
              {originalPrice && originalPrice > itemPrice && (
                <span className="text-[10px] sm:text-sm text-stone-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="text-[10px] sm:text-sm font-bold text-[#16A34A]">
                  {discountPercent}% Off
                </span>
              )}
            </div>
          </div>

          {/* 6. Outline Action Button: ADD TO CART */}
          <div className="pt-1 sm:pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-2.5 sm:py-3.5 px-1 sm:px-4 border text-[9.5px] sm:text-xs font-bold uppercase tracking-[0.08em] sm:tracking-[0.2em] rounded-none transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                isAdding
                  ? 'bg-stone-900 text-[#FAF6F0] border-stone-900'
                  : 'border-stone-800 text-stone-900 bg-transparent hover:bg-stone-900 hover:text-[#FAF6F0] hover:border-stone-900 shadow-2xs'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                  <span className="sm:hidden">Added</span>
                  <span className="hidden sm:inline">Added To Cart</span>
                </>
              ) : (
                <span>Add To Cart</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductCard = React.memo(ProductCardComponent);
export default ProductCard;
