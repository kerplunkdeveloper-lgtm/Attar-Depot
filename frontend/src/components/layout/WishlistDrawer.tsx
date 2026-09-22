'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  ShoppingBag,
  Heart,
  Sparkles,
  ArrowRight,
  Check,
  Crown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleWishlistDrawer, toggleCartDrawer } from '@/store/uiSlice';
import { removeFromWishlist, clearWishlist, WishlistItem } from '@/store/wishlistSlice';
import { addToCart } from '@/store/cartSlice';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function WishlistDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isWishlistDrawerOpen } = useAppSelector((state) => state.ui);
  const { items, itemsCount } = useAppSelector((state) => state.wishlist);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWishlistDrawerOpen) {
        dispatch(toggleWishlistDrawer(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isWishlistDrawerOpen, dispatch]);

  if (!isWishlistDrawerOpen) return null;

  const handleMoveToCart = (item: WishlistItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
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
        onClick: () => {
          dispatch(toggleWishlistDrawer(false));
          dispatch(toggleCartDrawer(true));
        },
      },
    });
  };

  const handleAddAllToCart = () => {
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
        onClick: () => {
          dispatch(toggleWishlistDrawer(false));
          dispatch(toggleCartDrawer(true));
        },
      },
    });
  };

  const handleRemove = (productId: string, name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    dispatch(removeFromWishlist(productId));
    toast.info(`${name} removed from wishlist.`);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all fragrances from your wishlist?')) {
      dispatch(clearWishlist());
      toast.info('Your wishlist has been cleared.');
    }
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleWishlistDrawer(false))}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#C9A227]/30 shadow-2xl flex flex-col">
          {/* Top Luxury Gold Banner */}
          <div className="bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-white p-5 border-b border-[#C9A227]/30 relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#F5B418]/15 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-[#F5B418]/50 flex items-center justify-center text-[#F5B418] shadow-[0_0_10px_rgba(245,180,24,0.3)]">
                  <Heart className="w-4 h-4 fill-[#F5B418]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-bold tracking-wide text-[#FAF8F2] flex items-center gap-1.5">
                    <span>Royal Wishlist</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#F5B418]" />
                  </h2>
                  <p className="text-[11px] text-[#FAF8F2]/70 font-sans">
                    {itemsCount} {itemsCount === 1 ? 'scent' : 'scents'} saved in your personal vault
                  </p>
                </div>
              </div>

              <button
                onClick={() => dispatch(toggleWishlistDrawer(false))}
                className="p-1.5 text-[#FAF8F2]/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close Wishlist"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Subheader info badge */}
          <div className="bg-[#FAF8F2] px-5 py-2.5 border-b border-stone-200/70 flex items-center justify-between text-xs font-sans text-stone-600">
            <span className="flex items-center gap-1.5 text-stone-800 font-medium">
              <Crown className="w-3.5 h-3.5 text-[#046A5A]" />
              <span>100% Pure Non-Alcoholic Essence</span>
            </span>
            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] text-stone-500 hover:text-rose-600 transition-colors underline underline-offset-2"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Wishlist Items Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-50 via-rose-50 to-emerald-50 border border-stone-200 flex items-center justify-center text-stone-400 shadow-inner">
                    <Heart className="w-10 h-10 text-stone-400 stroke-[1.5]" />
                  </div>
                  <Sparkles className="w-5 h-5 text-[#F5B418] absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    Your Wishlist is Empty
                  </h3>
                  <p className="font-sans text-xs text-stone-500 max-w-xs leading-relaxed">
                    Explore our collection of pure attars, rare agarwood oils, and royal distillations to curate your personal scent wardrobe.
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch(toggleWishlistDrawer(false));
                    router.push('/shop');
                  }}
                  className="mt-3 py-3 px-6 rounded-none border border-stone-900 bg-stone-900 text-[#FAF6F0] hover:bg-emerald-950 hover:border-emerald-950 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md active:scale-95 font-sans"
                >
                  Explore Fragrances
                </button>
              </div>
            ) : (
              items.map((item) => {
                const discount =
                  item.originalPrice && item.originalPrice > item.price
                    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                    : null;

                return (
                  <div
                    key={item.productId}
                    className="group relative flex gap-3.5 bg-[#FAF6F0] p-3.5 border border-[#ECE5D8] hover:border-[#C9A227]/50 transition-all duration-200"
                  >
                    {/* Bottle Image Thumbnail */}
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => dispatch(toggleWishlistDrawer(false))}
                      className="relative w-20 h-24 bg-white/80 border border-stone-200/60 overflow-hidden flex-shrink-0 flex items-center justify-center p-1 group/img"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-contain mix-blend-multiply transition-transform duration-300 group-hover/img:scale-105"
                      />
                    </Link>

                    {/* Scent Info & Action Buttons */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Fragrance Family or Tag */}
                        {item.fragranceFamily && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block truncate">
                            {item.fragranceFamily}
                          </span>
                        )}

                        {/* Title */}
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => dispatch(toggleWishlistDrawer(false))}
                          className="font-serif text-sm font-semibold text-stone-900 hover:text-emerald-950 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>

                        {/* Size */}
                        <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                          Size: <span className="font-semibold text-stone-700">{item.size || '100 ML'}</span>
                        </p>

                        {/* Pricing */}
                        <div className="flex items-baseline gap-2 mt-1 font-sans">
                          <span className="text-sm font-bold text-stone-900">
                            {formatPrice(item.price)}
                          </span>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <span className="text-xs text-stone-400 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                          {discount && discount > 0 && (
                            <span className="text-[10px] font-bold text-[#16A34A]">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Row */}
                      <div className="flex items-center gap-2 pt-2.5 mt-1 border-t border-stone-200/60 font-sans">
                        <button
                          onClick={(e) => handleMoveToCart(item, e)}
                          className="flex-1 py-1.5 px-3 bg-stone-900 text-[#FAF6F0] hover:bg-emerald-950 text-[11px] font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-[#F5B418]" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={(e) => handleRemove(item.productId, item.name, e)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200/80 transition-colors rounded-none"
                          aria-label="Remove from wishlist"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3 font-sans">
              <button
                onClick={handleAddAllToCart}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-[#FAF8F2] hover:brightness-110 border border-[#C9A227]/40 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98"
              >
                <ShoppingBag className="w-4 h-4 text-[#F5B418]" />
                <span>Move All to Cart ({itemsCount})</span>
              </button>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <Link
                  href="/wishlist"
                  onClick={() => dispatch(toggleWishlistDrawer(false))}
                  className="text-stone-700 hover:text-emerald-900 font-semibold underline underline-offset-2 flex items-center gap-1"
                >
                  <span>View Full Wishlist Page</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span className="text-[11px] text-emerald-800 font-medium">
                  Free Royal Insured Delivery
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
