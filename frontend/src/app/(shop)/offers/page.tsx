'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TicketPercent,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  ShoppingBag,
  Flame,
  Crown,
  Percent,
} from 'lucide-react';
import { useCoupons } from '@/hooks/useCoupons';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function OffersPage() {
  const { data, isLoading } = useCoupons();
  const coupons = data?.coupons || [];

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Promo code '${code}' copied! Apply at checkout for instant savings.`, {
        title: 'Voucher Copied',
      });
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      {/* 1. Regal Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#012620] via-[#023830] to-[#012620] text-white p-8 sm:p-12 border border-[#C9A227]/40 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial-at-c from-[#F5B418]/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5]/10 border border-[#F5B418]/40 text-[#F5B418] text-xs font-bold uppercase tracking-widest font-sans">
            <Crown className="w-3.5 h-3.5" />
            Imperial Privileges & Deals
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#FAF8F2] uppercase">
            Exclusive Vouchers & Offers
          </h1>

          <p className="font-sans text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Discover active seasonal discounts, royal privileges, and special promotional codes for our rare, alcohol-free pure attar distillations.
          </p>
        </div>
      </div>

      {/* 2. Active Coupons Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 uppercase">
              Current Available Privileges ({coupons.length})
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Copy any code below and paste it during checkout to claim your royal discount.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 uppercase tracking-wider"
          >
            <span>Browse The Boutique</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C9A227]" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-500">Checking for imperial privileges...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-16 text-center space-y-3 rounded-3xl bg-white border border-emerald-100 shadow-emerald-sm">
            <TicketPercent className="w-12 h-12 text-emerald-600 mx-auto opacity-60" />
            <h3 className="font-serif text-lg font-bold text-neutral-900">
              No Active Offers at this Moment
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Our master distillers are formulating upcoming festive privileges. Please check back soon or explore our everyday bestsellers.
            </p>
            <Link
              href="/shop"
              className="btn-emerald inline-block px-6 py-2.5 rounded-full text-xs font-bold text-white uppercase tracking-wider mt-2"
            >
              Explore Perfumes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="group relative rounded-3xl bg-white border border-emerald-100 shadow-emerald-sm hover:shadow-emerald-md hover:border-emerald-300 transition-all p-6 flex flex-col justify-between overflow-hidden"
              >
                {/* Gold Top Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-600 via-[#F5B418] to-emerald-600" />

                <div className="space-y-4">
                  {/* Badge & Discount */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                      {coupon.discountType === 'percentage' ? (
                        <>
                          <Percent className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{coupon.discountValue}% OFF</span>
                        </>
                      ) : (
                        <>
                          <span>₹{coupon.discountValue} OFF</span>
                        </>
                      )}
                    </span>

                    {coupon.minOrderValue > 0 ? (
                      <span className="text-[11px] text-neutral-500 font-medium">
                        Min. Spend {formatPrice(coupon.minOrderValue)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-bold">
                        No Minimum Spend
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-serif text-lg font-bold text-neutral-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      {coupon.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed mt-1 line-clamp-2">
                      {coupon.description || 'Apply this privilege token during checkout to unlock special pricing.'}
                    </p>
                  </div>

                  {coupon.discountType === 'percentage' && coupon.maxDiscount && (
                    <p className="text-[11px] text-neutral-500 font-medium bg-emerald-50/60 px-2.5 py-1 rounded-lg border border-emerald-100/80">
                      Maximum savings: <strong>{formatPrice(coupon.maxDiscount)}</strong>
                    </p>
                  )}
                </div>

                {/* Perforated Voucher Code Box */}
                <div className="pt-6 space-y-3">
                  <div className="relative p-3 rounded-2xl bg-gradient-to-r from-[#FAF8F5] to-emerald-50/40 border border-dashed border-emerald-300 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                        Voucher Code
                      </span>
                      <span className="font-mono text-base font-black text-[#012520] tracking-widest">
                        {coupon.code}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCode(coupon.code)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#012520] text-[#F5B418] hover:bg-emerald-950 font-sans font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm cursor-pointer"
                    >
                      {copiedCode === coupon.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#F5B418]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <Link
                    href="/shop"
                    className="w-full btn-emerald py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-white shadow-emerald-sm"
                  >
                    <span>Shop & Redeem</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. How to Redeem Guide */}
      <div className="p-8 rounded-3xl bg-white border border-emerald-100 shadow-emerald-sm space-y-6">
        <h3 className="font-serif text-xl font-bold text-neutral-900 uppercase">
          How to Redeem Your Fragrance Voucher
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-600">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center font-mono">
              1
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Copy Your Code</h4>
            <p>Select your desired offer above and click "Copy" to save the code to your clipboard.</p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center font-mono">
              2
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Select Your Perfumes</h4>
            <p>Add your chosen pure attars and discovery flacons meeting the minimum spend requirement.</p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center font-mono">
              3
            </div>
            <h4 className="font-bold text-neutral-900 text-sm">Enjoy Instant Savings</h4>
            <p>Paste the code in the Checkout or Cart Promo Box and verify your imperial discount applied!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
