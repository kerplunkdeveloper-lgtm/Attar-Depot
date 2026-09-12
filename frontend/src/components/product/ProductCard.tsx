'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleCartDrawer } from '@/store/uiSlice';
import { toast } from '@/lib/toast';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800';

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(product.images[0] || FALLBACK_IMAGE);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    const sizeName = defaultSize ? defaultSize.size : '6ml';
    const itemPrice = defaultSize ? defaultSize.price : product.price;

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: imageSrc,
        size: sizeName,
        price: itemPrice,
        originalPrice: defaultSize?.originalPrice || product.originalPrice,
        quantity: 1,
        stock: product.stock,
      })
    );

    toast.success(`${product.name} (${sizeName}) has been added to your vault.`, {
      title: 'Flacon Added',
      action: {
        label: 'View Vault',
        onClick: () => dispatch(toggleCartDrawer(true)),
      },
    });
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div className="group relative rounded-2xl glass-card overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-emerald-md border border-emerald-100/80 bg-white">
      {/* Product Image Container with Skeleton Loader */}
      <Link href={`/product/${product.slug}`} prefetch={true} className="relative aspect-square w-full bg-[#ECFDF5] overflow-hidden">
        {/* Shimmer Skeleton Placeholder while Image Loads */}
        {!isImageLoaded && (
          <div className="absolute inset-0 skeleton-emerald z-0" />
        )}

        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setIsImageLoaded(true)}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
          className={`object-cover transition-all duration-700 group-hover:scale-105 ${
            isImageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-xs'
          }`}
        />

        {/* Soft emerald overlay vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-25 group-hover:opacity-10 transition-opacity pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 font-sans">
          {product.isBestSeller && (
            <span className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              Best Seller
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-white/95 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Category Pill */}
        {product.category && (
          <div className="absolute bottom-3 left-3 z-10 font-sans">
            <span className="text-[11px] font-medium tracking-wide text-emerald-900 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200/80 shadow-sm">
              {product.category.name}
            </span>
          </div>
        )}
      </Link>


      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-amber-500 text-xs mb-1.5 font-sans">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-neutral-800">
              {product.ratings?.average || 4.9}
            </span>
            <span className="text-neutral-400 text-[11px]">
              ({product.ratings?.count || 12})
            </span>
          </div>

          {/* Product Name in Cormorant Garamond */}
          <Link href={`/product/${product.slug}`} prefetch={true}>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Tagline in Inter */}
          <p className="font-sans text-xs text-neutral-500 line-clamp-1 mt-1 font-normal">
            {product.tagline || (product.fragranceNotes?.topNotes?.length ? `Notes: ${product.fragranceNotes.topNotes.slice(0, 3).join(', ')}` : 'Pure concentrated royal attar')}
          </p>
        </div>

        {/* Pricing & Actions in Inter */}
        <div className="pt-3 border-t border-emerald-100 flex items-center justify-between font-sans">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans text-base sm:text-lg font-bold text-emerald-800">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-neutral-500 block font-sans">
              {product.sizes && product.sizes[0] ? `From ${product.sizes[0].size}` : 'Pure Attar'}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-700 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-700 transition-all duration-200 shadow-sm"
            title="Quick add to vault"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

const ProductCard = React.memo(ProductCardComponent);
export default ProductCard;
