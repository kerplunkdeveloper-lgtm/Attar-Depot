'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleCartDrawer } from '@/store/uiSlice';
import { toast } from '@/lib/toast';

const FALLBACK_IMAGE =
  'https://scentira.in/cdn/shop/files/ajmal-cyan-oud-eau-de-parfum-perfume-8349662.png?v=1782869421&width=1000';

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.images?.[0] || FALLBACK_IMAGE);
  const [isWishlisted, setIsWishlisted] = useState(false);
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
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);

    if (nextState) {
      toast.success(`${product.name} saved to wishlist.`, {
        title: 'Wishlist Updated',
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
      : product.tagline
      ? product.tagline.toUpperCase()
      : 'FRESH FRUITY MUSK WITH WARM AMBER';

  // Target subtitle (matching reference "For Men And Women")
  const targetAudience =
    product.gender === 'Unisex'
      ? 'For Men And Women'
      : product.gender === 'Men'
      ? 'For Men'
      : product.gender === 'Women'
      ? 'For Women'
      : product.gender
      ? `For ${product.gender}`
      : 'For Men And Women';

  const reviewCount = product.ratings?.count || 9;
  const starCount = 5;

  return (
    <div className="group relative flex flex-col pt-10 sm:pt-12 transition-all duration-300">
      {/* ── Outer Card Box with Warm Ivory/Cream Background (matching reference #FAF6F0) ── */}
      <div className="relative flex-1 flex flex-col justify-between bg-[#FAF6F0] border border-[#ECE5D8] transition-all duration-300 ">
        {/* Top Badges / Wishlist (Clean & Minimalist) */}
        <div className="absolute top-2.5 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
         

          <button
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className="pointer-events-auto w-7 h-7 bg-white/70 hover:bg-white text-stone-600 hover:text-rose-600 border border-stone-200/60 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ml-auto"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors duration-200 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-stone-500 hover:text-stone-800'
              }`}
            />
          </button>
        </div>

        {/* ── Perfume Bottle Showcase with Top Pop-out Effect ── */}
        <Link
          href={`/product/${product.slug}`}
          prefetch={true}
          className="relative -mt-10 sm:-mt-20 w-full h-56 sm:h-64 flex items-center justify-center p-4 overflow-visible group/img"
        >
          {/* Skeleton Shimmer */}
          {!isImageLoaded && (
            <div className="absolute inset-x-8 top-10 bottom-6 bg-stone-200/40 animate-pulse rounded-md z-0" />
          )}

          {/* Soft 3D Pedestal Shadow directly under bottle base */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-3.5 bg-stone-900/10 rounded-[100%] blur-[5px] pointer-events-none group-hover:scale-95 group-hover:opacity-75 transition-all duration-500" />

          {/* Flacon Image (Pop-out, with seamless blend) */}
          <div className="relative w-full h-full max-h-[220px] sm:max-h-[240px] flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setImageSrc(FALLBACK_IMAGE)}
              className={`object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-1.5 ${
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>
        </Link>

        {/* ── Product Information & Centered Details ── */}
        <div className="px-5 pt-2 pb-6 flex-1 flex flex-col justify-between text-center space-y-4">
          <div className="space-y-1.5">
            {/* 1. Fragrance Notes / Accord (FRESH FRUITY MUSK WITH WARM...) */}
            <p className="font-sans text-[10.5px] sm:text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500 truncate max-w-[95%] mx-auto">
              {notesHeader}
            </p>

            {/* 2. Product Name (Cyan Oud Perfume 100 ML) */}
            <Link href={`/product/${product.slug}`} prefetch={true} className="block group/title">
              <h3 className="font-serif text-lg sm:text-[21px] font-normal text-stone-900 group-hover/title:text-emerald-950 transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
            </Link>

            {/* 3. Subtitle / Target Audience (For Men And Women) */}
            <p className="font-serif text-sm sm:text-base text-stone-700 line-clamp-1 leading-tight">
              {targetAudience}
            </p>

            {/* 4. Star Ratings + Review Count (★★★★★ 9 reviews) */}
            <div className="flex items-center justify-center gap-1.5 pt-1 font-sans">
              <div className="flex items-center gap-0.5 text-amber-500">
                {[...Array(starCount)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#E5A118] text-[#E5A118]"
                  />
                ))}
              </div>
              <span className="text-stone-700 text-xs font-normal">
                {reviewCount} reviews
              </span>
            </div>

            {/* 5. Pricing Row: ₹2,250 ₹2,500 10% Off */}
            <div className="flex items-baseline justify-center gap-2 pt-1 font-sans">
              <span className="text-base sm:text-lg font-bold text-stone-900">
                {formatPrice(itemPrice)}
              </span>
              {originalPrice && originalPrice > itemPrice && (
                <span className="text-xs sm:text-sm text-stone-400 line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="text-xs sm:text-sm font-bold text-[#16A34A]">
                  {discountPercent}% Off
                </span>
              )}
            </div>
          </div>

          {/* 6. Outline Action Button: ADD TO CART */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`w-full py-3.5 px-4 border text-xs font-bold uppercase tracking-[0.2em] rounded-none transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] ${
                isAdding
                  ? 'bg-stone-900 text-[#FAF6F0] border-stone-900'
                  : 'border-stone-800 text-stone-900 bg-transparent hover:bg-stone-900 hover:text-[#FAF6F0] hover:border-stone-900 shadow-2xs'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Added To Cart</span>
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
