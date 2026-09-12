'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateQuantity, removeFromCart, clearCart } from '@/store/cartSlice';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, itemsCount, subtotal, shipping, total } = useAppSelector(
    (state) => state.cart
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 uppercase">
          Your Fragrance Vault ({itemsCount})
        </h1>
        <p className="font-sans text-xs sm:text-sm text-neutral-600 mt-1">
          Review your selected pure attars before proceeding to secure imperial checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl glass-card p-12 text-center space-y-4 max-w-md mx-auto bg-white border border-emerald-100 shadow-emerald-sm">
          <ShoppingBag className="w-12 h-12 text-emerald-600 mx-auto opacity-70" />
          <h2 className="font-serif text-2xl font-bold text-neutral-900">
            Your Cart is Currently Empty
          </h2>
          <p className="font-sans text-xs text-neutral-500">
            Explore our rare vintage agarwood distillations and delicate floral attars.
          </p>
          <Link
            href="/shop"
            className="btn-emerald inline-block px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm font-sans"
          >
            Explore The Boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl glass-card border border-emerald-100 gap-4 bg-white shadow-emerald-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-24 rounded-2xl bg-emerald-50/50 overflow-hidden flex-shrink-0 border border-emerald-100/60">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-serif text-lg font-bold text-neutral-900 hover:text-emerald-700 transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="font-sans text-xs text-emerald-700 mt-0.5 font-semibold">
                      Flacon Size: {item.size}
                    </p>
                    <p className="font-sans text-xs text-neutral-500 mt-1">
                      Unit: {formatPrice(item.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-emerald-50">
                  {/* Quantity */}
                  <div className="flex items-center border border-emerald-200 rounded-xl bg-white font-sans">
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
                      className="px-2.5 py-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-neutral-800">
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
                      className="px-2.5 py-1.5 text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total line price */}
                  <span className="font-sans text-base font-bold text-emerald-800 min-w-[90px] text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          productId: item.productId,
                          size: item.size,
                        })
                      )
                    }
                    className="text-neutral-400 hover:text-red-600 p-2 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => dispatch(clearCart())}
                className="font-sans text-xs text-neutral-500 hover:text-red-600 transition-colors font-medium"
              >
                Clear Entire Vault
              </button>
              <Link
                href="/shop"
                className="font-sans text-xs text-emerald-700 hover:text-emerald-800 font-semibold tracking-wide"
              >
                ← Continue Browsing Fragrances
              </Link>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="rounded-3xl glass-card p-6 border border-emerald-100 space-y-6 h-fit bg-white shadow-emerald-sm">
            <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-neutral-900 border-b border-emerald-100 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({itemsCount} items)</span>
                <span className="font-bold text-neutral-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Royal Insured Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-700 font-bold' : 'font-bold text-neutral-900'}>
                  {shipping === 0 ? 'COMPLIMENTARY' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Taxes & Duties</span>
                <span className="font-medium text-neutral-800">Included</span>
              </div>

              <div className="flex justify-between text-base font-bold text-neutral-900 border-t border-emerald-100 pt-3">
                <span>Estimated Total</span>
                <span className="font-sans text-xl font-extrabold text-emerald-800">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full btn-emerald py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-emerald-sm text-white font-sans"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 justify-center pt-2 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Authenticity Guaranteed • 100% Secure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
