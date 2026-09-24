'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, Check, ShoppingBag } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleCartDrawer, toggleWishlistDrawer } from '@/store/uiSlice';
import { toggleWishlist } from '@/store/wishlistSlice';
import { toast } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { softSpring, popSpring, luxuryEase } from '@/lib/animations';

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
  const sizeName = defaultSizeObj ? defaultSizeObj.size : '12 ML';
  const itemPrice = defaultSizeObj ? defaultSizeObj.price : product.price;
  const originalPrice = defaultSizeObj?.originalPrice || product.originalPrice;

  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;

  const discountPercent =
    originalPrice && originalPrice > itemPrice
      ? Math.round(((originalPrice - itemPrice) / originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast.error(`${product.name} is currently out of stock.`);
      return;
    }

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

    toast.success(`${product.name} added to your vault.`, {
      title: 'Added to Cart',
      action: {
        label: 'View Vault',
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

  // Olfactory notes line
  const notesHeader =
    product.fragranceNotes?.topNotes && product.fragranceNotes.topNotes.length > 0
      ? product.fragranceNotes.topNotes.slice(0, 3).join(' • ').toUpperCase()
      : product.fragranceFamily
      ? `${product.fragranceFamily.toUpperCase()} ACCORD`
      : product.category?.name
      ? `${product.category.name.toUpperCase()} ACCORD`
      : 'ROYAL ARTISANAL ACCORD';

  // Dynamic Subtitle / Target Audience
  const targetAudience = (() => {
    if (product.tagline && product.tagline.trim() !== '') {
      return product.tagline;
    }

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

    if (product.collection && product.collection.trim() !== '') {
      return `${product.collection} Edition`;
    }
    if (product.category?.name) {
      return `Pure ${product.category.name}`;
    }

    return 'For Men And Women';
  })();

  const reviewCount = product.ratings?.count || 0;
  const averageRating = product.ratings?.average || 0;

  return (
    <div
      onMouseEnter={handlePrefetch}
      onTouchStart={handlePrefetch}
      className="group relative flex flex-col pt-7 sm:pt-12 transition-all duration-300"
    >
      {/* ── Outer Card Box with Luxury Light Gradient Green Background & Emerald Glow ── */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={softSpring}
        className="relative flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F0FAF5] via-[#F8FCFA] to-[#E9F6F0] border border-emerald-100/90 rounded-2xl transition-colors duration-300 hover:border-emerald-300 shadow-xs hover:shadow-[0_16px_32px_-6px_rgba(4,106,90,0.14)]"
      >
        
        {/* Top Badges: Out of Stock (Red) OR Discount Badge */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-rose-600 to-red-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm border border-rose-300/40">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Out of Stock
            </span>
          </div>
        ) : discountPercent && discountPercent > 0 ? (
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-800 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-2xs">
              {discountPercent}% Off
            </span>
          </div>
        ) : null}

        {/* Top Right: Wishlist Button */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-3 z-20 flex items-center justify-end pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            transition={popSpring}
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isWishlisted ? 'Remove from royal wishlist' : 'Save to royal wishlist'}
            className={`pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border rounded-full transition-colors ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-white/85 hover:bg-white text-stone-500 hover:text-rose-600 border-emerald-100 shadow-2xs'
            }`}
          >
            <Heart
              className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-all duration-300 ${
                isWishlisted
                  ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_0_4px_rgba(244,63,94,0.4)]'
                  : 'text-stone-500 stroke-[1.8]'
              }`}
            />
          </motion.button>
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
            <div className="absolute inset-x-4 sm:inset-x-8 top-6 sm:top-10 bottom-4 sm:bottom-6 bg-emerald-100/50 animate-pulse rounded-md z-0" />
          )}

          {/* Soft 3D Pedestal Shadow directly under bottle base */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 w-16 sm:w-32 h-2 sm:h-3.5 bg-emerald-950/15 rounded-[100%] blur-[4px] sm:blur-[5px] pointer-events-none group-hover:scale-95 group-hover:opacity-75 transition-all duration-500" />

          {/* Flacon Image (Pop-out, with seamless blend) */}
          <div className="relative w-full h-full max-h-[145px] sm:max-h-[240px] flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageSrc(FALLBACK_IMAGE)}
              className={`object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-1.5 ${
                isOutOfStock ? 'opacity-80 grayscale-[20%]' : ''
              }`}
            />
          </div>
        </Link>

        {/* ── Product Information & Centered Details ── */}
        <div className="px-2.5 sm:px-5 pt-1 sm:pt-2 pb-3.5 sm:pb-5 flex-1 flex flex-col justify-between text-center space-y-2 sm:space-y-3.5">
          <div className="space-y-1 sm:space-y-1.5">
            {/* 1. Fragrance Notes / Accord */}
            <p className="font-sans text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.14em] text-emerald-800/80 truncate max-w-full mx-auto px-0.5">
              {notesHeader}
            </p>

            {/* 2. Product Name */}
            <Link
              href={`/product/${product.slug}`}
              prefetch={true}
              onMouseEnter={handlePrefetch}
              onFocus={handlePrefetch}
              className="block group/title"
            >
              <h3 className="font-serif text-sm sm:text-[20px] font-medium sm:font-normal text-stone-900 group-hover/title:text-emerald-900 transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>
              
            {/* 3. Subtitle / Target Audience */}
            <p className="font-serif text-[11px] sm:text-base text-stone-600 line-clamp-1 leading-tight">
              {targetAudience}
            </p>

            {/* 4. Star Ratings + Review Count */}
            <div className="flex items-center justify-center gap-1 sm:gap-1.5 pt-0.5 sm:pt-1 font-sans">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 ${
                      i < Math.round(averageRating)
                        ? 'fill-[#E5A118] text-[#E5A118]'
                        : 'fill-transparent text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-stone-600 text-[10px] sm:text-xs font-normal">
                {reviewCount > 0 ? `${reviewCount} reviews` : 'No reviews'}
              </span>
            </div>

            {/* 5. Pricing Row */}
            <div className="flex flex-wrap items-baseline justify-center gap-1 sm:gap-2 pt-0.5 sm:pt-1 font-sans">
              <span className="text-sm sm:text-lg font-extrabold text-stone-900">
                {formatPrice(itemPrice)}
              </span>
              {originalPrice && originalPrice > itemPrice && (
                <span className="text-[10px] sm:text-sm text-stone-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {isOutOfStock ? (
                <span className="text-[10px] sm:text-xs font-bold text-rose-600">
                  • Sold Out
                </span>
              ) : discountPercent && discountPercent > 0 ? (
                <span className="text-[10px] sm:text-sm font-bold text-[#16A34A]">
                  {discountPercent}% Off
                </span>
              ) : null}
            </div>
          </div>

          {/* 6. Action Button: ADD TO CART (Emerald Blinking Glow) OR OUT OF STOCK (Red Blinking Glow) */}
          <div className="pt-1 sm:pt-2">
            {isOutOfStock ? (
              <button
                type="button"
                disabled
                className="w-full py-2.5 sm:py-3 px-2 sm:px-4 border border-transparent text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-[0.10em] sm:tracking-[0.16em] flex items-center justify-center gap-2 cursor-not-allowed shadow-[0_4px_15px_rgba(225,29,72,0.35)] select-none transition-all opacity-95"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-200" />
                </span>
                <span>Out Of Stock</span>
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.96 }}
                transition={popSpring}
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`group/btn cart-btn-blink w-full py-2.5 sm:py-3 px-2 sm:px-4 border text-[10px] sm:text-xs font-bold uppercase tracking-[0.10em] sm:tracking-[0.16em] rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                  isAdding
                    ? 'bg-[#046A5A] text-white border-[#046A5A] shadow-emerald-sm !animate-none'
                    : 'bg-gradient-to-r from-[#046A5A] via-[#035346] to-[#023F36] text-white border-transparent shadow-2xs hover:shadow-emerald-sm hover:brightness-110'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.span
                      key="added"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-300 shrink-0 stroke-[3]" />
                      <span className="sm:hidden">Added</span>
                      <span className="hidden sm:inline">Added To Cart</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-200" />
                      </span>
                      <ShoppingBag className="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110 text-white" />
                      <span>Add To Cart</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const ProductCard = React.memo(ProductCardComponent);
export default ProductCard;
