'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Sparkles,
  Truck,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  Check,
  Gift,
  Flame,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleCartDrawer, openAuthModal } from '@/store/uiSlice';
import {
  updateQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  addToCart,
} from '@/store/cartSlice';
import { useValidateCoupon, useCoupons } from '@/hooks/useCoupons';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';
import {
  backdropVariants,
  drawerRightVariants,
  luxuryEase,
} from '@/lib/animations';

export default function CartDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCartDrawerOpen } = useAppSelector((state) => state.ui);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { items, itemsCount, subtotal, discount, appliedCoupon, shipping, total } =
    useAppSelector((state) => state.cart);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const validateCouponMutation = useValidateCoupon();
  const { data: availableCouponsData } = useCoupons();
  const availableCoupons = availableCouponsData?.coupons || [];

  // Upsell / Recommendations
  const { data: productsData } = useFeaturedProducts();
  const recommendedProducts = (productsData?.bestSellers || productsData?.featured || []).slice(0, 4);

  // Free shipping threshold
  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountLeft = Math.max(0, freeShippingThreshold - subtotal);

  // Checkout redirect
  const handleCheckoutClick = () => {
    dispatch(toggleCartDrawer(false));
    if (!isAuthenticated) {
      dispatch(openAuthModal({ mode: 'login', redirectUrl: '/checkout' }));
    } else {
      router.push('/checkout');
    }
  };

  // Coupon handlers
  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a voucher code.', { title: 'Voucher Missing' });
      return;
    }

    try {
      const res = await validateCouponMutation.mutateAsync({
        code,
        orderTotal: subtotal,
      });
      if (res.valid && res.coupon) {
        dispatch(applyCoupon(res.coupon));
        setCouponInput('');
        toast.success(res.message || `Code '${code}' applied!`, {
          title: 'Voucher Applied',
        });
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to apply coupon voucher.',
        { title: 'Invalid Coupon' }
      );
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.info('Promotional voucher removed.', { title: 'Voucher Removed' });
  };

  // Quick clear cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to empty your fragrance vault?')) {
      dispatch(clearCart());
      toast.info('Your vault has been cleared.');
    }
  };

  // Quick add upsell product
  const handleQuickAdd = (product: any) => {
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;
    const sizeName = defaultSize ? defaultSize.size : '12 ML';
    const price = defaultSize ? defaultSize.price : product.price;
    const image = product.images?.[0] || '';

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image,
        size: sizeName,
        price,
        originalPrice: defaultSize?.originalPrice || product.originalPrice,
        quantity: 1,
        stock: product.stock,
      })
    );

    toast.success(`${product.name} (${sizeName}) added to vault.`, {
      title: 'Added to Vault',
    });
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-[95] overflow-hidden">
          {/* Silky Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            onClick={() => dispatch(toggleCartDrawer(false))}
          />

          {/* Drawer container: full-width on mobile (pl-0), bounded on desktop (sm:pl-10) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
            <motion.div
              variants={drawerRightVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full sm:w-[450px] max-w-full sm:max-w-md bg-[#FAF9F5] border-l border-emerald-100 shadow-2xl flex flex-col pointer-events-auto h-full"
            >
              {/* Mobile Drawer Top Pull Handle */}
              <div
                className="w-12 h-1 bg-stone-300 hover:bg-stone-400 rounded-full mx-auto my-2 sm:hidden cursor-pointer transition-colors"
                onClick={() => dispatch(toggleCartDrawer(false))}
                aria-label="Swipe or click to close"
              />

              {/* 1. Header with Badge & Actions */}
              <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-emerald-100/80 flex items-center justify-between bg-white shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-[#012520]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-900 leading-none">
                      Your Vault
                    </h2>
                    <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                      {itemsCount} {itemsCount === 1 ? 'precious item' : 'precious items'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-[11px] font-sans text-stone-600 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => dispatch(toggleCartDrawer(false))}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                    aria-label="Close cart drawer"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* 2. Luxury Free Shipping Progress Tracker */}
              <div className="bg-gradient-to-r from-emerald-50/90 via-[#FDFBF7] to-amber-50/70 p-3 sm:p-3.5 border-b border-emerald-100/70 text-xs font-sans">
                {amountLeft > 0 ? (
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-stone-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>
                        Add <strong className="text-emerald-950 font-bold">{formatPrice(amountLeft)}</strong> for{' '}
                        <span className="text-emerald-800 font-semibold">Free Express Shipping</span>
                      </span>
                    </span>
                    <span className="font-bold text-[11px] text-emerald-800 shrink-0">
                      {progressPercent}%
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-emerald-900 font-semibold mb-1.5 text-[11.5px]">
                    <Sparkles className="w-4 h-4 text-[#C9A227] shrink-0" />
                    <span>🎉 Free Royal Express Delivery Unlocked!</span>
                  </div>
                )}

                {/* Animated Progress Bar */}
                <div className="w-full bg-stone-200/70 h-2 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    className="bg-gradient-to-r from-[#012520] via-emerald-600 to-[#F5B418] h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.55, ease: luxuryEase }}
                  />
                </div>
              </div>

              {/* 3. Main Scrollable Container (Items + Promo + Upsells) */}
              <div className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-5 sm:py-5 space-y-4 no-scrollbar overscroll-contain">
                {items.length === 0 ? (
                  /* Empty State Experience with Category Shortcuts */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: luxuryEase }}
                    className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto min-h-[360px]"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-b from-emerald-50 to-amber-50/50 border border-emerald-200/80 flex items-center justify-center text-emerald-800 shadow-sm relative">
                      <ShoppingBag className="w-9 h-9" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#012520] text-[#F5B418] text-[10px] flex items-center justify-center font-bold">
                        0
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                        Your Vault is Empty
                      </h3>
                      <p className="font-sans text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                        Discover pure artisanal attars, non-alcoholic concentrated perfumes, and rare vintage oudhs.
                      </p>
                    </div>

                    {/* Quick Explore Collection Chips on Mobile */}
                    <div className="pt-2 grid grid-cols-2 gap-2 w-full max-w-xs font-sans text-xs">
                      <button
                        onClick={() => {
                          dispatch(toggleCartDrawer(false));
                          router.push('/shop');
                        }}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:border-emerald-600 hover:text-emerald-900 transition-colors shadow-2xs font-medium"
                      >
                        🔥 Bestsellers
                      </button>
                      <button
                        onClick={() => {
                          dispatch(toggleCartDrawer(false));
                          router.push('/shop?gender=Men');
                        }}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:border-emerald-600 hover:text-emerald-900 transition-colors shadow-2xs font-medium"
                      >
                        🌿 Men&apos;s Attar
                      </button>
                      <button
                        onClick={() => {
                          dispatch(toggleCartDrawer(false));
                          router.push('/shop?gender=Women');
                        }}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:border-emerald-600 hover:text-emerald-900 transition-colors shadow-2xs font-medium"
                      >
                        🌸 Women&apos;s Scents
                      </button>
                      <button
                        onClick={() => {
                          dispatch(toggleCartDrawer(false));
                          router.push('/gifting');
                        }}
                        className="p-2 rounded-xl bg-white border border-stone-200 text-stone-800 hover:border-emerald-600 hover:text-emerald-900 transition-colors shadow-2xs font-medium"
                      >
                        🎁 Gift Sets
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        dispatch(toggleCartDrawer(false));
                        router.push('/shop');
                      }}
                      className="mt-3 w-full max-w-xs py-3 px-6 rounded-full bg-[#012520] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-emerald-950 transition-colors font-sans"
                    >
                      Explore All Collections
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    {/* Cart Items List */}
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.div
                          key={`${item.productId}-${item.size}`}
                          layout
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{
                            opacity: 0,
                            x: 40,
                            height: 0,
                            marginBottom: 0,
                            overflow: 'hidden',
                          }}
                          transition={{ duration: 0.28, ease: luxuryEase }}
                          className="relative flex gap-3 sm:gap-3.5 bg-white p-3 sm:p-3.5 rounded-2xl border border-stone-200/90 hover:border-emerald-300 shadow-2xs transition-all"
                        >
                          {/* Flacon Thumbnail */}
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => dispatch(toggleCartDrawer(false))}
                            className="relative w-20 h-24 sm:w-22 sm:h-26 rounded-xl bg-gradient-to-b from-[#F9F7F1] to-[#EFECE3] overflow-hidden flex-shrink-0 border border-stone-200/60 block group/thumb"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="88px"
                              className="object-contain p-1.5 group-hover/thumb:scale-105 transition-transform duration-300"
                            />
                          </Link>

                          {/* Item Details */}
                          <div className="flex-1 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex justify-between items-start gap-1">
                                <Link
                                  href={`/product/${item.slug}`}
                                  onClick={() => dispatch(toggleCartDrawer(false))}
                                  className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-emerald-800 line-clamp-1 font-serif transition-colors"
                                >
                                  {item.name}
                                </Link>

                                {/* Delete Button */}
                                <motion.button
                                  whileHover={{ scale: 1.15 }}
                                  whileTap={{ scale: 0.88 }}
                                  onClick={() => {
                                    dispatch(
                                      removeFromCart({
                                        productId: item.productId,
                                        size: item.size,
                                      })
                                    );
                                    toast.info(
                                      `${item.name} (${item.size}) removed from vault.`
                                    );
                                  }}
                                  className="text-stone-400 hover:text-rose-600 p-1 -mr-1 rounded-full hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
                                  title="Remove item"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>

                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block text-[10.5px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full font-sans">
                                  {item.size}
                                </span>
                                <span className="text-[11px] text-stone-500 font-sans">
                                  {formatPrice(item.price)} each
                                </span>
                              </div>
                            </div>

                            {/* Quantity Stepper & Line Subtotal */}
                            <div className="flex items-center justify-between mt-2 pt-1 font-sans">
                              {/* Touch-Friendly Stepper */}
                              <div className="inline-flex items-center border border-stone-200/90 rounded-full bg-stone-50/90 p-0.5 shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(
                                      updateQuantity({
                                        productId: item.productId,
                                        size: item.size,
                                        quantity: item.quantity - 1,
                                      })
                                    )
                                  }
                                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center text-stone-600 hover:text-neutral-900 hover:bg-white active:scale-90 transition-all cursor-pointer"
                                  aria-label={
                                    item.quantity === 1
                                      ? 'Remove item'
                                      : 'Decrease quantity'
                                  }
                                >
                                  {item.quantity === 1 ? (
                                    <Trash2 className="w-3 h-3 text-rose-500" />
                                  ) : (
                                    <Minus className="w-3 h-3" />
                                  )}
                                </button>

                                <span className="w-6 text-center text-xs font-bold text-neutral-900">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    dispatch(
                                      updateQuantity({
                                        productId: item.productId,
                                        size: item.size,
                                        quantity: item.quantity + 1,
                                      })
                                    )
                                  }
                                  className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center text-stone-600 hover:text-neutral-900 hover:bg-white active:scale-90 transition-all cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Price */}
                              <div className="text-right">
                                <p className="text-sm font-bold text-[#012520] font-sans">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* 4. In-Drawer Promo Code Accordion */}
                    <div className="rounded-2xl border border-stone-200/90 bg-white p-3 font-sans shadow-2xs">
                      {appliedCoupon ? (
                        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 p-2.5 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-700" />
                            <div>
                              <p className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                                {appliedCoupon.code}
                              </p>
                              <p className="text-[10px] text-emerald-800">
                                Saved {formatPrice(discount)}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCoupon}
                            className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <button
                            type="button"
                            onClick={() => setIsCouponOpen(!isCouponOpen)}
                            className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Tag className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Have a promotional voucher?</span>
                            </span>
                            {isCouponOpen ? (
                              <ChevronUp className="w-4 h-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-stone-400" />
                            )}
                          </button>

                          {isCouponOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2.5 space-y-2"
                            >
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Enter code (e.g. ROYAL10)"
                                  value={couponInput}
                                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                  className="flex-1 px-3 py-1.5 text-xs uppercase tracking-wider rounded-xl border border-stone-300 focus:outline-hidden focus:border-[#012520] focus:ring-1 focus:ring-[#012520]"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleApplyCoupon()}
                                  disabled={validateCouponMutation.isPending || !couponInput.trim()}
                                  className="px-3.5 py-1.5 bg-[#012520] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-emerald-950 disabled:opacity-50 transition-colors shrink-0"
                                >
                                  {validateCouponMutation.isPending ? 'Checking...' : 'Apply'}
                                </button>
                              </div>

                              {/* Available Coupon Chips */}
                              {availableCoupons.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {availableCoupons.slice(0, 3).map((cpn) => (
                                    <button
                                      key={cpn._id}
                                      type="button"
                                      onClick={() => handleApplyCoupon(cpn.code)}
                                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                                    >
                                      {cpn.code}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 5. Complete Your Fragrance Ritual (Upsell Recommendations) */}
                    {recommendedProducts.length > 0 && (
                      <div className="pt-1 space-y-2 font-sans">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-serif font-bold text-neutral-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C9A227]" />
                            <span>Pairs Wonderfully With</span>
                          </span>
                        </div>

                        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 overscroll-x-contain">
                          {recommendedProducts.map((p) => {
                            const defaultSize = p.sizes?.[0];
                            const price = defaultSize?.price || p.price;
                            return (
                              <div
                                key={p._id}
                                className="w-[145px] shrink-0 bg-white p-2 rounded-xl border border-stone-200/80 shadow-2xs flex flex-col justify-between"
                              >
                                <div className="relative w-full h-16 rounded-lg bg-stone-50 overflow-hidden mb-1.5">
                                  <Image
                                    src={p.images?.[0] || ''}
                                    alt={p.name}
                                    fill
                                    sizes="60px"
                                    className="object-contain p-1"
                                  />
                                </div>
                                <div>
                                  <p className="text-[11px] font-serif font-bold text-neutral-900 line-clamp-1">
                                    {p.name}
                                  </p>
                                  <p className="text-[10px] text-stone-500 font-sans">
                                    {formatPrice(price)}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdd(p)}
                                  className="mt-1.5 w-full py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#012520] font-bold text-[10px] uppercase tracking-wider border border-emerald-200/70 transition-colors"
                                >
                                  + Add
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 4. Sticky Mobile Footer with Price Breakdown & Royal Checkout CTA */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-stone-200 bg-white/95 backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.06)] space-y-3 font-sans shrink-0">
                  {/* Price Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-600">
                      <span>Subtotal</span>
                      <span className="text-neutral-900 font-semibold">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-semibold">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-emerald-600" />
                          Coupon Savings ({appliedCoupon?.code})
                        </span>
                        <span className="font-bold text-emerald-800">
                          - {formatPrice(discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-600">
                      <span>Shipping</span>
                      <span
                        className={
                          shipping === 0
                            ? 'text-emerald-700 font-bold uppercase text-[11px]'
                            : 'text-neutral-900'
                        }
                      >
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-sm font-bold text-neutral-900 border-t border-stone-200/80 pt-2">
                      <div>
                        <span>Estimated Total</span>
                        <p className="text-[10px] text-stone-400 font-normal">
                          All taxes & duties included
                        </p>
                      </div>
                      <span className="text-[#012520] font-sans text-base sm:text-lg font-bold">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Primary Checkout CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#012520] hover:bg-[#033c34] text-white font-bold uppercase tracking-wider text-xs flex items-center justify-between shadow-lg shadow-emerald-950/20 border border-[#F5B418]/40 transition-all duration-300 cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#F5B418]" />
                      <span>Proceed to Checkout</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-[#F5B418]">
                      <span>{formatPrice(total)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.button>

                  {/* Trust Micro-Badges */}
                  <div className="pt-0.5 flex items-center justify-center gap-3 sm:gap-4 text-[10px] text-stone-600">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>100% Pure Attar</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>Fast Dispatch</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>Secure Payment</span>
                    </span>
                  </div>

                  {/* View Detailed Cart Page Link */}
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(toggleCartDrawer(false));
                      router.push('/cart');
                    }}
                    className="w-full text-center text-[11px] text-stone-600 hover:text-emerald-900 transition-colors pt-0.5 font-medium underline underline-offset-2 cursor-pointer"
                  >
                    View Detailed Cart Page
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
