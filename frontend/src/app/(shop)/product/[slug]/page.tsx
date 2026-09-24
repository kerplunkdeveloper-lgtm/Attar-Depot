'use client';

import React, { useState, useRef } from 'react';
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
  Heart,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowLeft,
  Truck,
  Gift,
  Shield,
  BadgePercent,
  Flame,
  Tag,
  Copy,
  TicketPercent,
} from 'lucide-react';
import { useProductDetails } from '@/hooks/useProducts';
import { useCoupons } from '@/hooks/useCoupons';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { toggleCartDrawer, toggleWishlistDrawer } from '@/store/uiSlice';
import { toggleWishlist } from '@/store/wishlistSlice';
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

  const { data: couponsData } = useCoupons();
  const availableCoupons = couponsData?.coupons || [];
  const [copiedPromoCode, setCopiedPromoCode] = useState<string | null>(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCopied, setIsCopied] = useState(false);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Touch gesture support for mobile carousel
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const wishlistItems = useAppSelector((state) => state.wishlist?.items || []);
  const isWishlisted = product ? wishlistItems.some((item) => item.productId === product._id) : false;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !product?.images) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 45;
    const isRightSwipe = distance < -45;

    if (isLeftSwipe && product.images.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
      setIsMainImageLoaded(false);
    }
    if (isRightSwipe && product.images.length > 1) {
      setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
      setIsMainImageLoaded(false);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    setIsMainImageLoaded(false);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    setIsMainImageLoaded(false);
  };

  // Skeleton Loading State
  if (isLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-300 font-sans">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-14 h-3.5 rounded-md bg-emerald-100/70 skeleton-shimmer" />
          <span className="text-neutral-300">/</span>
          <div className="w-14 h-3.5 rounded-md bg-emerald-100/70 skeleton-shimmer" />
          <span className="text-neutral-300">/</span>
          <div className="w-32 h-3.5 rounded-md bg-emerald-200/70 skeleton-shimmer" />
        </div>

        {/* Main Product Showcase Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Gallery Skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden skeleton-emerald border border-emerald-100/80 shadow-emerald-sm" />
            <div className="flex gap-2.5 sm:gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl skeleton-emerald border border-emerald-100 flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-5 sm:space-y-6">
            <div className="space-y-2.5">
              <div className="w-24 h-4 rounded-full skeleton-shimmer bg-emerald-100/80" />
              <div className="w-4/5 h-8 sm:h-10 rounded-lg skeleton-shimmer bg-neutral-200/90" />
              <div className="w-1/2 h-4 sm:h-5 rounded skeleton-shimmer bg-neutral-100" />
              <div className="w-36 h-4 rounded skeleton-shimmer bg-amber-100/80" />
            </div>

            <div className="pt-3 border-t border-emerald-100 space-y-2">
              <div className="w-36 h-9 rounded-xl skeleton-shimmer bg-emerald-200/80" />
              <div className="w-28 h-3 rounded skeleton-shimmer bg-neutral-100" />
            </div>

            <div className="space-y-2.5 pt-2">
              <div className="w-32 h-4 rounded skeleton-shimmer bg-neutral-200" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-xl skeleton-shimmer bg-neutral-100 border border-emerald-100" />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <div className="w-28 h-12 rounded-xl skeleton-shimmer bg-neutral-100" />
              <div className="flex-1 h-12 rounded-xl skeleton-shimmer bg-emerald-300/70" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <h2 className="font-serif text-3xl font-bold text-neutral-800">Fragrance Not Found</h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          The requested perfume flacon could not be located in our royal archive.
        </p>
        <Link href="/shop" className="btn-emerald inline-block px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white">
          Return to Boutique
        </Link>
      </div>
    );
  }

  const currentSize = product.sizes && product.sizes[selectedSizeIndex] ? product.sizes[selectedSizeIndex] : null;
  const currentPrice = currentSize ? currentSize.price : product.price;
  const currentOriginalPrice = currentSize?.originalPrice || product.originalPrice;
  const discountPercent =
    currentOriginalPrice && currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : null;

  const handleAddToCart = (openDrawer = true) => {
    const sizeLabel = currentSize ? currentSize.size : '12ml';
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

  const handleWishlistToggle = () => {
    if (!product) return;
    const sizeLabel = currentSize ? currentSize.size : '12ml';
    dispatch(
      toggleWishlist({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[selectedImageIndex] || product.images[0],
        size: sizeLabel,
        price: currentPrice,
        originalPrice: currentOriginalPrice,
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

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-10 space-y-8 sm:space-y-12 lg:space-y-16 pb-28 lg:pb-16 font-sans">
      {/* ─── 1. MOBILE RESPONSIVE TOP BAR & BREADCRUMBS ─── */}
      <div className="flex items-center justify-between gap-3 text-xs">
        {/* Mobile Quick Back Link */}
        <Link
          href="/shop"
          className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-white/80 border border-emerald-200/80 px-2.5 py-1.5 rounded-full shadow-2xs active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Vault</span>
        </Link>

        {/* Desktop Breadcrumbs */}
        <nav className="hidden lg:flex items-center space-x-2 text-xs text-neutral-500 font-medium">
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
          <span className="text-emerald-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Top-Right Quick Actions (Share & Wishlist on small screens) */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-neutral-600 bg-white/90 border border-emerald-100 hover:border-emerald-300 px-2.5 py-1.5 rounded-full shadow-2xs transition-colors"
            title="Share Fragrance"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handleWishlistToggle}
            className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full border shadow-2xs transition-all active:scale-95 ${
              isWishlisted
                ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                : 'bg-white/90 border-emerald-100 text-neutral-600 hover:text-rose-600'
            }`}
            title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Wishlist'}</span>
          </button>
        </div>
      </div>

      {/* ─── 2. MAIN PRODUCT SHOWCASE (GALLERY + DETAILS) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 items-start">
        {/* ── Left Column: Interactive Image Gallery ── */}
        <div className="space-y-3 sm:space-y-4">
          <div
            className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden glass-card border border-emerald-100/90 shadow-emerald-sm bg-white touch-pan-y group select-none cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsLightboxOpen(true)}
          >
            {/* Shimmer loading placeholder */}
            {!isMainImageLoaded && (
              <div className="absolute inset-0 skeleton-emerald z-0" />
            )}

            {/* Main Product Image */}
            <Image
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              onLoad={() => setIsMainImageLoaded(true)}
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Top Left: Authentic Oil Badge */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#012520]/80 backdrop-blur-md text-[10px] font-bold tracking-wider text-[#F5B418] border border-[#F5B418]/40 shadow-sm uppercase">
                <Sparkles className="w-3 h-3 text-[#F5B418]" />
                100% Pure Attar Oil
              </span>
              {discountPercent && discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-600/90 text-white text-[10px] font-black tracking-wider uppercase shadow-sm">
                  <BadgePercent className="w-3 h-3" />
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Top Right: Lightbox Zoom Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-emerald-200/80 flex items-center justify-center text-emerald-800 shadow-sm hover:bg-white active:scale-95 transition-all"
              aria-label="Enlarge image"
              title="Click to view full flacon"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Carousel Navigation Arrows (Visible on touch & desktop hover) */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-emerald-100 flex items-center justify-center text-emerald-900 shadow-md hover:bg-white active:scale-90 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-emerald-100 flex items-center justify-center text-emerald-900 shadow-md hover:bg-white active:scale-90 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom Image Counter Pill */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-[#012520]/75 backdrop-blur-md text-[10px] font-bold text-white tracking-widest shadow-sm">
                {selectedImageIndex + 1} / {product.images.length}
              </div>
            )}

            {/* Bottom Pagination Dots for Mobile */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 sm:hidden bg-black/30 backdrop-blur-md px-2 py-1 rounded-full">
                {product.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      selectedImageIndex === idx
                        ? 'w-4 bg-[#F5B418]'
                        : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none snap-x">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    setIsMainImageLoaded(false);
                  }}
                  className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all snap-start ${
                    selectedImageIndex === idx
                      ? 'border-emerald-600 scale-95 shadow-md ring-2 ring-emerald-400/30'
                      : 'border-transparent opacity-70 hover:opacity-100 hover:border-emerald-200'
                  }`}
                  aria-label={`Select photo ${idx + 1}`}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right Column: Product Details & Purchase Form ── */}
        <div className="space-y-4 sm:space-y-6">
          <div>
            {/* Category & Stock Pill */}
            <div className="flex items-center justify-between gap-2">
              {product.category && (
                <Link
                  href={`/shop?category=${product.category.slug}`}
                  className="inline-flex items-center gap-1 text-[11px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>{product.category.name}</span>
                </Link>
              )}

              {/* Stock Status Badge */}
              {product.stock > 0 ? (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Handcrafted Batch in Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50/70 border border-rose-200/60 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 uppercase tracking-tight mt-2.5 leading-tight">
              {product.name}
            </h1>

            {/* Tagline */}
            {product.tagline && (
              <p className="font-serif text-sm sm:text-base font-medium italic text-emerald-800/90 mt-1">
                "{product.tagline}"
              </p>
            )}

            {/* Ratings Summary (Anchor click scrolls smoothly to reviews) */}
            <a
              href="#reviews"
              className="inline-flex items-center gap-2 mt-3 text-xs group cursor-pointer"
            >
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
              <span className="text-neutral-500 group-hover:text-emerald-700 transition-colors underline decoration-dotted">
                ({product.ratings?.count || 12} Connoisseur Reviews)
              </span>
            </a>
          </div>

          {/* Pricing Box */}
          <div className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-emerald-100/90 shadow-emerald-sm">
            <div className="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
              <span className="font-sans text-2xl sm:text-3xl font-black text-emerald-800">
                {formatPrice(currentPrice)}
              </span>
              {currentOriginalPrice && currentOriginalPrice > currentPrice && (
                <span className="text-sm sm:text-base text-neutral-400 line-through">
                  {formatPrice(currentOriginalPrice)}
                </span>
              )}
              {discountPercent && discountPercent > 0 && (
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-emerald-50 text-[11px] text-emerald-700 font-medium">
              <span>✓ All Duties & Taxes Included</span>
              <span className="text-neutral-500">Free Express Delivery Across India</span>
            </div>
          </div>

          {/* Dynamic Available Offers & Coupons Card */}
          {availableCoupons.length > 0 && product.stock > 0 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-[#FAF8F5] border border-emerald-200/70 shadow-xs space-y-2 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <TicketPercent className="w-3.5 h-3.5 text-emerald-700" />
                  Available Offers & Vouchers
                </span>
                <Link
                  href="/offers"
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
                >
                  View All Offers
                </Link>
              </div>
              <div className="space-y-1.5">
                {availableCoupons.slice(0, 2).map((cpn) => (
                  <div
                    key={cpn._id}
                    className="p-2 sm:p-2.5 rounded-xl bg-white border border-emerald-100 flex items-center justify-between text-xs gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-[11px] text-[#012520] bg-emerald-100/60 px-2 py-0.5 rounded">
                          {cpn.code}
                        </span>
                        <span className="font-bold text-emerald-800 text-[11px]">
                          {cpn.discountType === 'percentage'
                            ? `${cpn.discountValue}% OFF`
                            : `₹${cpn.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-neutral-600 line-clamp-1 mt-0.5">
                        {cpn.description || cpn.title}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(cpn.code);
                        setCopiedPromoCode(cpn.code);
                        toast.info(`Promo code '${cpn.code}' copied!`, { title: 'Code Copied' });
                        setTimeout(() => setCopiedPromoCode(null), 2000);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-emerald-200 text-[10.5px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors shrink-0 uppercase tracking-wider cursor-pointer"
                    >
                      {copiedPromoCode === cpn.code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-emerald-600" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* Size / Volume / Tola Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Select Flacon Volume & Tola
                </label>
                <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                  1 Tola ≈ 11.66g
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.sizes.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSizeIndex(idx)}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      selectedSizeIndex === idx
                        ? 'border-emerald-600 bg-emerald-50/80 shadow-emerald-sm ring-1 ring-emerald-500'
                        : 'border-emerald-100 bg-white hover:border-emerald-200'
                    }`}
                  >
                    {selectedSizeIndex === idx && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                    <p className="text-xs font-bold text-neutral-900">{s.size}</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-0.5">{formatPrice(s.price)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Actions (Quantity & CTAs) */}
          <div className="space-y-3 pt-2">
            {product.stock <= 0 ? (
              <button
                type="button"
                disabled
                className="w-full py-3.5 sm:py-4 px-4 sm:px-6 border border-transparent text-white bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 rounded-2xl text-[11px] sm:text-xs font-black uppercase tracking-[0.16em] flex items-center justify-center gap-2 cursor-not-allowed shadow-[0_4px_15px_rgba(225,29,72,0.35)] select-none transition-all opacity-95 h-12"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-200" />
                </span>
                <span>Out Of Stock</span>
              </button>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-emerald-200 rounded-2xl bg-white shadow-2xs h-12 flex-shrink-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 active:scale-95 transition-all"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-neutral-900 active:scale-95 transition-all"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    onClick={() => handleAddToCart(true)}
                    className="flex-1 btn-emerald h-12 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-emerald-sm text-white active:scale-98 transition-transform"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Fragrance Vault</span>
                  </button>

                  {/* Desktop Wishlist Button */}
                  <button
                    onClick={handleWishlistToggle}
                    className={`hidden sm:flex w-12 h-12 rounded-2xl border items-center justify-center transition-all flex-shrink-0 active:scale-95 ${
                      isWishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-sm'
                        : 'bg-white hover:bg-neutral-50 text-neutral-600 hover:text-rose-600 border-emerald-200 shadow-2xs'
                    }`}
                    aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    title={isWishlisted ? 'Remove from Royal Wishlist' : 'Save to Royal Wishlist'}
                  >
                    <Heart className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'fill-rose-500 text-rose-500 scale-110' : ''}`} />
                  </button>
                </div>

                {/* Instant Express Checkout Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full h-12 px-6 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:brightness-105 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Express Checkout</span>
                </button>
              </>
            )}
          </div>

          {/* Luxury Specifications Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pt-4 border-t border-emerald-100 text-xs">
            <div className="p-3 rounded-xl bg-white border border-emerald-100/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <Droplet className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-neutral-400 font-semibold uppercase">Concentration</p>
                <p className="text-xs font-bold text-neutral-800 truncate">{product.concentration || '100% Pure Perfume Oil'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-100/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-neutral-400 font-semibold uppercase">Longevity</p>
                <p className="text-xs font-bold text-neutral-800 truncate">{product.longevityHours || '24+ Hours'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-100/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-neutral-400 font-semibold uppercase">Artisanal Origin</p>
                <p className="text-xs font-bold text-neutral-800 truncate">{product.origin || 'Assam & Kannauj'}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-emerald-100/80 flex items-center gap-2.5 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-neutral-400 font-semibold uppercase">Sillage & Aura</p>
                <p className="text-xs font-bold text-neutral-800 truncate">{product.projection || 'Intoxicating & Royal'}</p>
              </div>
            </div>
          </div>

          {/* Trust Guarantees Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-neutral-600">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
              <Shield className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Alcohol-Free Pure Oil</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Free Express Delivery</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
              <Gift className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Royal Velvet Flacon Box</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
              <Flame className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Artisan Deg Distillation</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. OLFACTORY FRAGRANCE PYRAMID SECTION ─── */}
      <FragrancePyramid notes={product.fragranceNotes} />

      {/* ─── 4. CUSTOMER TESTIMONIALS & REVIEWS SECTION ─── */}
      <ReviewSection
        productId={product._id}
        averageRating={product.ratings?.average || 5}
        totalReviews={product.ratings?.count || 0}
      />

      {/* ─── 5. HARMONIOUS COMPANIONS (2-COLUMN COMPACT MOBILE CATALOG) ─── */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 sm:space-y-6 pt-6 sm:pt-10 border-t border-emerald-100/90 font-sans">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 tracking-wider uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pairing Suggestions</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 uppercase">
                Harmonious Companions
              </h3>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline decoration-emerald-400"
            >
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* ─── 6. MOBILE STICKY BOTTOM PURCHASE BAR ─── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-emerald-100/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] px-3.5 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-all animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          {/* Product Mini Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-emerald-100 flex-shrink-0 bg-neutral-50 shadow-2xs">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-neutral-900 truncate font-serif">
                {product.name}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-extrabold text-emerald-800 font-sans">
                  {formatPrice(currentPrice)}
                </span>
                {currentSize && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                    {currentSize.size}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {product.stock <= 0 ? (
              <button
                type="button"
                disabled
                className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-sm cursor-not-allowed opacity-90 font-sans"
              >
                Out of Stock
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleAddToCart(true)}
                  className="btn-emerald px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-emerald-sm text-white active:scale-95 transition-transform"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-sm active:scale-95 transition-transform font-sans"
                >
                  Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── 7. FULLSCREEN IMAGE LIGHTBOX MODAL ─── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white z-10">
            <div className="text-xs">
              <p className="font-serif text-base sm:text-lg font-bold">{product.name}</p>
              <p className="text-white/60">
                Flacon {selectedImageIndex + 1} of {product.images.length}
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close fullscreen view"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Central Image */}
          <div
            className="relative flex-1 w-full max-w-3xl mx-auto my-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full max-h-[70vh] aspect-square rounded-2xl overflow-hidden">
              <Image
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>

            {/* Left/Right Buttons in Lightbox */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Thumbnails */}
          {product.images.length > 1 && (
            <div
              className="flex justify-center gap-2 overflow-x-auto py-2 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#F5B418] scale-105 shadow-md'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill sizes="48px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
