'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Share2,
  Check,
  Crown,
  ShieldCheck,
  Droplet,
  Clock,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  removeFromWishlist,
  clearWishlist,
  hydrateWishlist,
  WishlistItem,
} from '@/store/wishlistSlice';
import { addToCart } from '@/store/cartSlice';
import { toggleCartDrawer } from '@/store/uiSlice';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, itemsCount } = useAppSelector((state) => state.wishlist);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateWishlist());
  }, [dispatch]);

  const handleMoveToCart = (item: WishlistItem) => {
    dispatch(
      addToCart({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        image: item.image,
        size: item.size || '100 ML',
        price: item.price,
        originalPrice: item.originalPrice,
        quantity: 1,
        stock: item.stock || 50,
      })
    );

    toast.success(`${item.name} moved to your cart.`, {
      title: 'Added to Cart',
      action: {
        label: 'View Cart',
        onClick: () => dispatch(toggleCartDrawer(true)),
      },
    });
  };

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;

    items.forEach((item) => {
      dispatch(
        addToCart({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          image: item.image,
          size: item.size || '100 ML',
          price: item.price,
          originalPrice: item.originalPrice,
          quantity: 1,
          stock: item.stock || 50,
        })
      );
    });

    toast.success(`All ${items.length} fragrances moved to your cart!`, {
      title: 'Cart Updated',
      action: {
        label: 'Open Cart',
        onClick: () => dispatch(toggleCartDrawer(true)),
      },
    });
  };

  const handleRemove = (productId: string, name: string) => {
    dispatch(removeFromWishlist(productId));
    toast.info(`${name} removed from wishlist.`);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your royal wishlist?')) {
      dispatch(clearWishlist());
      toast.info('Your wishlist has been cleared.');
    }
  };

  const handleShareWishlist = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success('Wishlist link copied to clipboard! Share it with friends or family.', {
        title: 'Link Copied',
      });
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-xs text-stone-500 font-sans">
          <Link href="/" className="hover:text-emerald-800 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-bold">Royal Wishlist</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-white rounded-3xl p-6 sm:p-10 border border-[#C9A227]/30 shadow-2xl relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#F5B418]/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#10B981]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F5B418] bg-white/10 px-3 py-1 rounded-full border border-[#F5B418]/30">
                  Personal Fragrance Vault
                </span>
                <Sparkles className="w-4 h-4 text-[#F5B418]" />
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#FAF8F2] tracking-tight">
                Your Curated Wishlist
              </h1>

              <p className="font-sans text-xs sm:text-sm text-[#FAF8F2]/75 leading-relaxed">
                Save and compare your most desired 100% natural, alcohol-free pure attars, vintage agarwood distillations, and royal accords.
              </p>
            </div>

            {/* Quick Actions Bar */}
            {mounted && items.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleShareWishlist}
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-[#FAF8F2] text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 border border-white/15"
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4 text-[#F5B418]" />
                  )}
                  <span>{isCopied ? 'Link Copied' : 'Share Wishlist'}</span>
                </button>

                <button
                  onClick={handleMoveAllToCart}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#F5B418] to-[#FFEAA0] text-[#012520] hover:brightness-105 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move All To Cart ({itemsCount})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        {mounted && items.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-10 sm:p-16 border border-[#ECE5D8] text-center space-y-5 max-w-2xl mx-auto shadow-sm">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-50 border border-stone-200 flex items-center justify-center mx-auto text-stone-400">
                <Heart className="w-12 h-12 stroke-[1.5] text-stone-400" />
              </div>
              <Sparkles className="w-6 h-6 text-[#F5B418] absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                Your Royal Vault is Empty
              </h2>
              <p className="font-sans text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                You haven’t saved any fragrances yet. Explore our handcrafted collection of Kannauj rose distillations, aged Dehn Al Oudh, and pure musks.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-none border border-stone-900 bg-stone-900 text-[#FAF6F0] hover:bg-emerald-950 hover:border-emerald-950 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 font-sans"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs font-sans text-stone-600 border-b border-stone-200 pb-3">
              <span className="font-bold text-stone-900">
                Saved Fragrances ({itemsCount})
              </span>
              <button
                onClick={handleClearAll}
                className="text-stone-500 hover:text-rose-600 transition-colors underline underline-offset-2"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => {
                const discount =
                  item.originalPrice && item.originalPrice > item.price
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : null;

                return (
                  <div
                    key={item.productId}
                    className="group bg-white rounded-2xl border border-[#ECE5D8] hover:border-[#C9A227]/60 transition-all duration-300 overflow-hidden shadow-2xs hover:shadow-lg flex flex-col justify-between"
                  >
                    {/* Image & Quick Remove */}
                    <div className="relative bg-[#FAF6F0] p-6 flex items-center justify-center min-h-[220px]">
                      <button
                        onClick={() => handleRemove(item.productId, item.name)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-stone-400 hover:text-rose-600 border border-stone-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-2xs z-10"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {discount && discount > 0 && (
                        <span className="absolute top-3 left-3 bg-[#16A34A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-sans shadow-2xs">
                          {discount}% Off
                        </span>
                      )}

                      <Link
                        href={`/product/${item.slug}`}
                        className="relative w-full h-44 flex items-center justify-center group/img"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain mix-blend-multiply transition-transform duration-500 group-hover/img:scale-105"
                        />
                      </Link>
                    </div>

                    {/* Product Details & Actions */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5 text-center">
                        {item.fragranceFamily && (
                          <p className="font-sans text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400 truncate">
                            {item.fragranceFamily}
                          </p>
                        )}

                        <Link
                          href={`/product/${item.slug}`}
                          className="font-serif text-lg font-normal text-stone-900 hover:text-emerald-950 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>

                        <p className="font-sans text-xs text-stone-500">
                          Flacon Size: <span className="font-bold text-stone-700">{item.size || '100 ML'}</span>
                        </p>

                        <div className="flex items-baseline justify-center gap-2 pt-1 font-sans">
                          <span className="text-base font-bold text-stone-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-stone-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-stone-100 font-sans">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="w-full py-3 px-4 bg-stone-900 hover:bg-emerald-950 text-[#FAF6F0] text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#F5B418]" />
                          <span>Move to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Royal Guarantees Badge Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-stone-700 font-sans">
          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">100% Pure Perfume Oil</p>
              <p className="text-[11px] text-stone-500">Zero alcohol, crafted with pure organic botanicals</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#996D12] flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Kannauj Heritage</p>
              <p className="text-[11px] text-stone-500">Deg & Bhapka traditional copper hydro-distillation</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-stone-200/80 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-900">Complimentary Shipping</p>
              <p className="text-[11px] text-stone-500">Free royal insured delivery on all orders above ₹1,999</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
