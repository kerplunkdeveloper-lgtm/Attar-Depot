'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check,
  CheckCircle,
  Truck,
  Package,
  MapPin,
  Calendar,
  Clock,
  Copy,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  Banknote,
  Sparkles,
  Phone,
  MessageCircle,
  Navigation,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

interface OrderConfirmedViewProps {
  order: any;
  formData: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    name: string;
    image: string;
    size: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  deliveryDistanceKm: number;
  codRatePerKm: number;
  codDistanceCharge: number;
  total: number;
}

export default function OrderConfirmedView({
  order,
  formData,
  items,
  subtotal,
  discount,
  shipping,
  deliveryDistanceKm,
  codRatePerKm,
  codDistanceCharge,
  total,
}: OrderConfirmedViewProps) {
  const [copied, setCopied] = useState(false);

  const orderNumber = order?.orderNumber || 'AD-' + Date.now().toString().slice(-6);
  const recipientName = order?.shippingAddress?.fullName || formData.fullName || 'Connoisseur';
  const recipientPhone = order?.shippingAddress?.phone || formData.phone || '';
  const city = order?.shippingAddress?.city || formData.city || '';
  const state = order?.shippingAddress?.state || formData.state || '';
  const address = order?.shippingAddress?.address || formData.address || '';
  const postalCode = order?.shippingAddress?.postalCode || formData.postalCode || '';

  const isCod = order?.paymentMethod === 'COD' || order?.paymentMethod === undefined;
  const distanceKm = order?.codDetails?.distanceKm || deliveryDistanceKm;
  const ratePerKm = order?.codDetails?.chargePerKm || codRatePerKm;
  const codCharge = order?.codDetails?.totalCodCharge || codDistanceCharge;
  const finalPayable = order?.totalPrice || total;

  const handleCopyOrderId = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      toast.success(`Consignment ID #${orderNumber} copied to clipboard!`, {
        title: 'Copied Successfully',
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Estimated delivery range: 2 to 4 days from today
  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 2);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 4);

  const formatDateShort = (d: Date) =>
    d.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 space-y-8 font-sans selection:bg-[#046A5A] selection:text-white">
      {/* ===================================================================== */}
      {/* 1. TOP HERO CELEBRATION WITH ANIMATED GREEN TICK & GOLD SPARKLES      */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center space-y-5 bg-gradient-to-b from-[#F0FDF4] via-white to-[#FAF8F2] p-8 sm:p-12 rounded-3xl border border-emerald-200/80 shadow-[0_15px_40px_rgba(5,150,105,0.08)] overflow-hidden"
      >
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-16 w-48 h-48 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Green Tick Badge Container */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 anim-success-pulse" />

          {/* Golden Rotating Dashed Ring */}
          <div
            className="absolute -inset-2.5 rounded-full border-2 border-dashed border-emerald-400/50 animate-spin"
            style={{ animationDuration: '24s' }}
          />

          {/* Floating Gold & Emerald Sparkle Accents */}
          <div className="absolute -top-2 -right-2 text-[#C9A227] anim-sparkle">
            <Sparkles className="w-6 h-6 fill-[#F5B418]" />
          </div>
          <div
            className="absolute -bottom-1 -left-2 text-emerald-500 anim-sparkle"
            style={{ animationDelay: '1.2s' }}
          >
            <Sparkles className="w-5 h-5 fill-emerald-400" />
          </div>

          {/* Emerald Gradient Circle with SVG Checkmark */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-[#046A5A] p-1.5 shadow-[0_12px_30px_rgba(5,150,105,0.38)] flex items-center justify-center ring-4 ring-emerald-100">
            <svg
              className="w-14 h-14 sm:w-16 sm:h-16"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Circular Stroke Draw */}
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#BBF7D0"
                strokeWidth="5.5"
                className="anim-checkmark-circle"
                strokeLinecap="round"
              />
              {/* Inner Checkmark Tick Path Draw */}
              <path
                d="M28 52 L43 67 L73 34"
                stroke="#FFFFFF"
                strokeWidth="7"
                className="anim-checkmark-check"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

       

        {/* Main Heading */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900 leading-tight">
            Order Confirmed!
          </h1>
        
        </div>

        {/* Consignment ID Quick Pill with Copy Button */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs text-xs">
            <span className="text-neutral-500 font-medium">Consignment Number:</span>
            <span className="font-mono font-bold text-emerald-900 text-sm tracking-wide">
              #{orderNumber}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-950 p-1 rounded-lg hover:bg-emerald-50 transition-colors"
              title="Copy Consignment ID"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-xs text-emerald-900">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>Estimated Delivery: <strong>{formatDateShort(deliveryStart)} – {formatDateShort(deliveryEnd)}</strong></span>
          </div>
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* 2. CASH ON DELIVERY DISTANCE CALCULATION BREAKDOWN BANNER              */}
      {/* ===================================================================== */}
      {isCod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-3xl p-6 sm:p-7 border border-emerald-200 bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 shadow-emerald-sm space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Banknote className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-950">
                  Cash on Delivery Breakdown
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Distance-calculated logistics rate applied @ ₹{ratePerKm}/km
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              Pay on Delivery
            </span>
          </div>

          {/* Distance & Rate Computation Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-100">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-0.5">
                Delivery Distance
              </span>
              <span className="font-mono font-bold text-neutral-900 text-sm">
                {distanceKm} km
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-100">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-0.5">
                Rate per Kilometer
              </span>
              <span className="font-mono font-bold text-neutral-900 text-sm">
                ₹{ratePerKm} / km
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 border border-emerald-100">
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block mb-0.5">
                COD Distance Fee
              </span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                +{formatPrice(codCharge)}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-800 uppercase tracking-wider block mb-0.5 font-bold">
                Total Cash Payable
              </span>
              <span className="font-mono font-extrabold text-emerald-950 text-base">
                {formatPrice(finalPayable)}
              </span>
            </div>
          </div>

          {/* Reassurance text */}
          <div className="flex items-start gap-2.5 text-[11px] text-neutral-600 bg-white/80 p-3 rounded-xl border border-emerald-100/70">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Safe & Verified Delivery:</strong> Please keep exact change of{' '}
              <strong className="text-emerald-800 font-mono">{formatPrice(finalPayable)}</strong> ready
              when the courier executive arrives. You are entitled to examine our wax-embossed royal
              seal before cash handover.
            </span>
          </div>
        </motion.div>
      )}

      {/* ===================================================================== */}
      {/* 3. LIVE CONSIGNMENT TRACKING & DISPATCH TIMELINE                      */}
      {/* ===================================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-3xl p-6 sm:p-8 bg-white border border-emerald-100 shadow-emerald-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-600" />
            <h2 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-900">
              Live Consignment Tracking Timeline
            </h2>
          </div>

          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Courier: Royal Express Logistics (Air Transit)
          </span>
        </div>

        {/* 4-Step Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1: Confirmed */}
          <div className="relative flex md:flex-col items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                Step 1 • Completed
              </span>
              <h4 className="font-serif text-sm font-bold text-neutral-900">Order Confirmed</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Consignment registered & payment mode recorded.
              </p>
            </div>
          </div>

          {/* Step 2: Bottling (Current Active) */}
          <div className="relative flex md:flex-col items-start gap-3.5 p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-emerald-xs">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center justify-center shrink-0 animate-pulse font-bold text-xs">
              <Clock className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Step 2 • In Progress
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <h4 className="font-serif text-sm font-bold text-neutral-900">Artisan Flacon Bottling</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Pure oil decanting & Deg-Bhapka olfactory check.
              </p>
            </div>
          </div>

          {/* Step 3: Air Dispatch */}
          <div className="relative flex md:flex-col items-start gap-3.5 p-4 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 opacity-80">
            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 font-bold text-xs">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                Step 3 • Upcoming
              </span>
              <h4 className="font-serif text-sm font-bold text-neutral-700">Royal Air Transit</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Dispatch with real-time SMS & WhatsApp alerts.
              </p>
            </div>
          </div>

          {/* Step 4: Doorstep Delivery */}
          <div className="relative flex md:flex-col items-start gap-3.5 p-4 rounded-2xl bg-neutral-50/60 border border-neutral-200/80 opacity-80">
            <div className="w-8 h-8 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center shrink-0 font-bold text-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                Step 4 • Upcoming
              </span>
              <h4 className="font-serif text-sm font-bold text-neutral-700">Doorstep Delivery</h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {isCod ? `Handover & Cash Collection of ${formatPrice(finalPayable)}` : 'Handover to recipient'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ===================================================================== */}
      {/* 4. CONSIGNMENT ITEMS & DESTINATION DETAILS DUAL GRID                   */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Destination Card */}
        <div className="rounded-3xl p-6 bg-white border border-emerald-100 shadow-emerald-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              Delivery Destination
            </h3>
          </div>

          <div className="space-y-1.5 text-neutral-700">
            <p className="font-bold text-neutral-900 text-sm">{recipientName}</p>
            {recipientPhone && (
              <p className="flex items-center gap-1.5 text-neutral-600">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>{recipientPhone}</span>
              </p>
            )}
            <p className="text-neutral-600 leading-relaxed pt-1">{address}</p>
            <p className="text-neutral-800 font-semibold">
              {city}, {state} - {postalCode}
            </p>
            <p className="text-[11px] text-neutral-500">Country: India</p>
          </div>

          <div className="pt-2 border-t border-emerald-50 text-[11px] text-emerald-800 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Courier dispatch routed to {city} fulfillment center</span>
          </div>
        </div>

        {/* Financial Valuation Summary Card */}
        <div className="rounded-3xl p-6 bg-white border border-emerald-100 shadow-emerald-sm space-y-3.5 text-xs">
          <div className="flex items-center gap-2 border-b border-emerald-100 pb-3">
            <Banknote className="w-4 h-4 text-emerald-600" />
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              Consignment Valuation
            </h3>
          </div>

          <div className="space-y-2 text-neutral-600">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-neutral-800">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-800">
                <span>Coupon Savings:</span>
                <span className="font-bold">- {formatPrice(discount)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Royal Insured Shipping:</span>
              <span className={shipping === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-neutral-800'}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>

            {isCod && (
              <div className="flex justify-between text-emerald-900 font-medium">
                <span>COD Distance Fee ({distanceKm} km × ₹{ratePerKm}):</span>
                <span className="font-bold text-emerald-800">+{formatPrice(codCharge)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-emerald-100 pt-2.5">
              <span>{isCod ? 'Total Payable on Delivery:' : 'Total Amount Paid:'}</span>
              <span className="font-sans text-xl font-extrabold text-emerald-800">
                {formatPrice(finalPayable)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 5. ORDERED FRAGRANCE ITEMS PREVIEW                                    */}
      {/* ===================================================================== */}
      {items.length > 0 && (
        <div className="rounded-3xl p-6 bg-white border border-emerald-100 shadow-emerald-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
                Consignment Items ({items.length})
              </h3>
            </div>
            <span className="text-[11px] text-neutral-500 font-medium">
              Pure Concentrated Attar
            </span>
          </div>

          <div className="divide-y divide-emerald-50 text-xs">
            {items.map((item, idx) => (
              <div key={`${item.productId}-${item.size}-${idx}`} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-14 rounded-xl bg-emerald-50/50 overflow-hidden shrink-0 border border-emerald-100">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-neutral-900">{item.name}</h4>
                    <p className="text-[11px] text-neutral-500">
                      Flacon Size: <strong className="text-emerald-800">{item.size}</strong> • Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <span className="font-mono font-bold text-neutral-900 text-sm">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 6. PRIMARY ACTIONS: TRACK IN MY ORDERS & BROWSE MORE FRAGRANCES        */}
      {/* ===================================================================== */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Primary Action: Track in Orders */}
        <Link
          href="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full btn-emerald text-xs font-bold uppercase tracking-widest text-white shadow-emerald-sm transition-all duration-200 active:scale-95 text-center"
        >
          <Truck className="w-4 h-4" />
          <span>Track in My Orders</span>
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </Link>

        {/* Secondary Action: Continue Shopping / Browse More */}
        <Link
          href="/shop"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-950 bg-white hover:bg-emerald-50 border-2 border-emerald-300 hover:border-emerald-600 transition-all duration-200 shadow-2xs active:scale-95 text-center"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-700" />
          <span>Browse More Fragrances</span>
        </Link>

        {/* WhatsApp Concierge Assistance */}
        <a
          href={`https://wa.me/919876543210?text=Salam!%20I%20have%20placed%20order%20%23${orderNumber}%20via%20Cash%20on%20Delivery.%20Please%20provide%20updates.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-xs font-bold uppercase tracking-wider text-[#128C7E] bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200 transition-all text-center"
        >
          <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
          <span>WhatsApp Concierge</span>
        </a>
      </div>
    </div>
  );
}
