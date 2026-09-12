'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleCartDrawer } from '@/store/uiSlice';
import { updateQuantity, removeFromCart } from '@/store/cartSlice';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function CartDrawer() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isCartDrawerOpen } = useAppSelector((state) => state.ui);
  const { items, itemsCount, subtotal, shipping, total } = useAppSelector(
    (state) => state.cart
  );

  if (!isCartDrawerOpen) return null;

  const freeShippingThreshold = 1999;
  const progressPercent = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountLeft = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckoutClick = () => {
    dispatch(toggleCartDrawer(false));
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleCartDrawer(false))}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-emerald-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-emerald-100 flex items-center justify-between bg-[#F4FAF6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-700" />
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900">
                Your Fragrance Vault ({itemsCount})
              </h2>
            </div>
            <button
              onClick={() => dispatch(toggleCartDrawer(false))}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-emerald-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#ECFDF5] p-3.5 border-b border-emerald-100 text-xs font-sans">
            {amountLeft > 0 ? (
              <p className="text-neutral-700 mb-1.5">
                Add <span className="font-bold text-emerald-800">{formatPrice(amountLeft)}</span> more for{' '}
                <span className="text-emerald-800 font-semibold">Free Royal Insured Shipping</span>
              </p>
            ) : (
              <p className="text-emerald-800 font-semibold mb-1.5 flex items-center gap-1">
                ✓ You have unlocked Complimentary Royal Insured Shipping!
              </p>
            )}
            <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-700 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900">
                    Your Vault is Empty
                  </h3>
                  <p className="font-sans text-xs text-neutral-500 mt-1 max-w-xs">
                    Immerse yourself in our collection of precious non-alcoholic attars and rare vintage agarwood oils.
                  </p>
                </div>
                <button
                  onClick={() => {
                    dispatch(toggleCartDrawer(false));
                    router.push('/shop');
                  }}
                  className="btn-emerald px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider mt-2 shadow-sm font-sans"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-3 bg-[#FAF8F2]/60 p-3 rounded-2xl border border-emerald-100 hover:border-emerald-300 transition-colors shadow-sm"
                >
                  <div className="relative w-16 h-20 rounded-xl bg-emerald-50/50 overflow-hidden flex-shrink-0 border border-emerald-100/60">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => dispatch(toggleCartDrawer(false))}
                          className="text-sm font-bold text-neutral-900 hover:text-emerald-700 line-clamp-1 font-serif"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => {
                            dispatch(
                              removeFromCart({
                                productId: item.productId,
                                size: item.size,
                              })
                            );
                            toast.info(`${item.name} (${item.size}) was removed from your vault.`, {
                              title: 'Vault Updated',
                            });
                          }}
                          className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="inline-block mt-0.5 text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md font-sans">
                        {item.size}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 font-sans">
                      <div className="flex items-center border border-emerald-200 rounded-lg bg-white">
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                size: item.size,
                                quantity: item.quantity - 1,
                              })
                            )
                          }
                          className="px-2 py-1 text-neutral-500 hover:text-neutral-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            dispatch(
                              updateQuantity({
                                productId: item.productId,
                                size: item.size,
                                quantity: item.quantity + 1,
                              })
                            )
                          }
                          className="px-2 py-1 text-neutral-500 hover:text-neutral-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-800 font-sans">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-emerald-100 bg-[#F4FAF6] space-y-3 font-sans">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="text-neutral-900 font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-emerald-700 font-semibold' : 'text-neutral-900'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-emerald-200/80 pt-2">
                  <span>Estimated Total</span>
                  <span className="text-emerald-800 font-sans text-base font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full btn-emerald py-3 px-4 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-emerald-sm text-white font-sans"
              >
                <span>Proceed to Royal Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  dispatch(toggleCartDrawer(false));
                  router.push('/cart');
                }}
                className="w-full text-center text-xs text-neutral-500 hover:text-emerald-800 transition-colors py-1 font-medium font-sans"
              >
                View Detailed Cart Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
