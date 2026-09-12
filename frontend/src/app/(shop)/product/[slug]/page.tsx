'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Droplet,
  Clock,
  Sparkles,
  ShoppingBag,
  Share2,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { useProductDetails } from '@/hooks/useProducts';
import { useAppDispatch } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleCartDrawer } from '@/store/uiSlice';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';
import FragrancePyramid from '@/components/product/FragrancePyramid';
import ReviewSection from '@/components/product/ReviewSection';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { slug } = params;

  const { data, isLoading } = useProductDetails(slug);
  const product = data?.product;
  const relatedProducts = data?.relatedProducts || [];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-300">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-14 h-3.5 rounded bg-emerald-100/70 skeleton-shimmer" />
          <span className="text-neutral-300">/</span>
          <div className="w-14 h-3.5 rounded bg-emerald-100/70 skeleton-shimmer" />
          <span className="text-neutral-300">/</span>
          <div className="w-32 h-3.5 rounded bg-emerald-200/70 skeleton-shimmer" />
        </div>

        {/* Main Product Showcase Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden skeleton-emerald border border-emerald-100/80 shadow-emerald-sm" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 rounded-2xl skeleton-emerald border border-emerald-100 flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="w-28 h-5 rounded-full skeleton-shimmer bg-emerald-100/80" />
              <div className="w-4/5 h-10 rounded-lg skeleton-shimmer bg-neutral-200/90" />
              <div className="w-1/2 h-5 rounded skeleton-shimmer bg-neutral-100" />
              <div className="w-36 h-4 rounded skeleton-shimmer bg-amber-100/80" />
            </div>

            <div className="pt-4 border-t border-emerald-100 space-y-2">
              <div className="w-32 h-8 rounded-lg skeleton-shimmer bg-emerald-200/80" />
              <div className="w-24 h-3 rounded skeleton-shimmer bg-neutral-100" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="w-36 h-4 rounded skeleton-shimmer bg-neutral-200" />
              <div className="flex gap-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-24 h-12 rounded-xl skeleton-shimmer bg-neutral-100 border border-emerald-100" />
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <div className="w-32 h-12 rounded-full skeleton-shimmer bg-neutral-100" />
              <div className="flex-1 h-12 rounded-full skeleton-shimmer bg-emerald-300/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 font-sans">
        <h2 className="font-serif text-3xl font-bold text-neutral-800">Fragrance Not Found</h2>
        <p className="text-xs text-neutral-500">The requested perfume flacon could not be located in our royal archive.</p>
        <Link href="/shop" className="btn-emerald inline-block px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white">
          Return to Boutique
        </Link>
      </div>
    );
  }

  const currentSize = product.sizes && product.sizes[selectedSizeIndex] ? product.sizes[selectedSizeIndex] : null;
  const currentPrice = currentSize ? currentSize.price : product.price;
  const currentOriginalPrice = currentSize?.originalPrice || product.originalPrice;

  const handleAddToCart = (openDrawer = true) => {
    const sizeLabel = currentSize ? currentSize.size : '6ml';
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[selectedImageIndex] || product.images[0],
        size: sizeLabel,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        quantity,
        stock: product.stock,
      })
    );

    toast.success(`${product.name} (${sizeLabel}) × ${quantity} added to your vault.`, {
      title: 'Flacon Added',
      action: {
        label: 'View Vault',
        onClick: () => dispatch(toggleCartDrawer(true)),
      },
    });

    if (openDrawer) {
      dispatch(toggleCartDrawer(true));
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.info('Fragrance share link copied to clipboard.', {
        title: 'Link Copied',
      });
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-neutral-500 font-medium">
        <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-emerald-700 transition-colors">Shop</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-emerald-700 transition-colors">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-emerald-800 font-semibold truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery Images */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden glass-card border border-emerald-100 shadow-emerald-sm bg-white">
            {!isMainImageLoaded && (
              <div className="absolute inset-0 skeleton-emerald z-0" />
            )}
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              onLoad={() => setIsMainImageLoaded(true)}
              className={`object-cover transition-all duration-700 ${
                isMainImageLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-95 blur-xs'
              }`}
            />
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setIsMainImageLoaded(false);
                  }}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-emerald-600 scale-95 shadow-sm'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Product Details & Purchase Form */}
        <div className="space-y-6 font-sans">
          <div>
            <div className="flex items-center justify-between">
              {product.category && (
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 font-sans">
                  {product.category.name}
                </span>
              )}
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs text-neutral-500 hover:text-emerald-700 transition-colors font-sans"
                title="Share link"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 uppercase tracking-tight mt-1.5 leading-tight">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="font-serif text-sm sm:text-base font-medium italic text-emerald-800/90 mt-1">
                "{product.tagline}"
              </p>
            )}

            {/* Ratings Summary in Inter */}
            <div className="flex items-center gap-2 mt-3 text-xs font-sans">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.ratings?.average || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-neutral-800">
                {product.ratings?.average || 4.9}
              </span>
              <span className="text-neutral-500">
                ({product.ratings?.count || 12} Connoisseur Reviews)
              </span>
            </div>
          </div>

          {/* Pricing Box in Inter */}
          <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-white border border-emerald-100 shadow-emerald-sm font-sans">
            <span className="font-sans text-3xl font-extrabold text-emerald-800">
              {formatPrice(currentPrice)}
            </span>
            {currentOriginalPrice && currentOriginalPrice > currentPrice && (
              <span className="text-sm text-neutral-400 line-through">
                {formatPrice(currentOriginalPrice)}
              </span>
            )}
            <span className="text-xs text-emerald-700 font-semibold ml-auto font-sans">
              ✓ Tax & Duties Included
            </span>
          </div>

          {/* Description in Inter */}
          <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
            {product.description}
          </p>

          {/* Size / Volume Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2 font-sans">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                Select Flacon Volume & Tola
              </label>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedSizeIndex === idx
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-emerald-sm'
                        : 'border-emerald-100 bg-white hover:border-emerald-200'
                    }`}
                  >
                    <p className="text-xs font-bold text-neutral-800">{s.size}</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">{formatPrice(s.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & CTA Buttons in Inter */}
          <div className="space-y-3.5 pt-2 font-sans">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-emerald-200 rounded-xl bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-500 hover:text-neutral-900"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-neutral-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-neutral-500 hover:text-neutral-900"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(true)}
                className="flex-1 btn-emerald py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-emerald-sm text-white"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Fragrance Vault</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 transition-all shadow-sm"
            >
              Instant Express Checkout
            </button>
          </div>

          {/* Specifications */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-emerald-100 text-xs font-sans">
            <div className="flex items-center gap-2 text-neutral-700">
              <Droplet className="w-4 h-4 text-emerald-600" />
              <span>{product.concentration || '100% Pure Perfume Oil'}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Longevity: {product.longevityHours || '24 Hours'}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Origin: {product.origin || 'Assam & Kannauj'}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Projection: {product.projection || 'Strong & Intoxicating'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fragrance Pyramid Section */}
      <FragrancePyramid notes={product.fragranceNotes} />

      {/* Customer Reviews & Testimonials Section */}
      <ReviewSection
        productId={product._id}
        averageRating={product.ratings?.average || 5}
        totalReviews={product.ratings?.count || 0}
      />

      {/* Related Fragrances */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-emerald-100 font-sans">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
            Harmonious Companions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
