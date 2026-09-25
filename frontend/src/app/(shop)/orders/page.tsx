'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import { useMyOrders } from '@/hooks/useOrders';
import { useAppSelector } from '@/store';
import { formatPrice, formatDate } from '@/lib/utils';

export default function OrdersPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: orders = [], isLoading } = useMyOrders(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <Package className="w-12 h-12 text-emerald-600 mx-auto opacity-80" />
        <h1 className="font-serif text-3xl font-bold text-neutral-900 uppercase">
          Sign In to View Your Orders
        </h1>
        <p className="font-sans text-xs text-neutral-500">
          Access your royal order history, shipment tracking, and invoice receipts.
        </p>
        <Link
          href="/login?redirect=/orders"
          className="btn-emerald inline-block px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm font-sans"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-sans">
            <CheckCircle className="w-3 h-3" /> Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-sans">
            <Truck className="w-3 h-3" /> In Transit / Shipped
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-sans">
            <Clock className="w-3 h-3" /> Preparing Flacons
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-700 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full font-sans">
            <Clock className="w-3 h-3" /> Order Received (Pending)
          </span>
        );
    }
  };

  return (
    <div className=" px-5 py-12 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 uppercase">
          Your Orders
        </h1>

      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded-3xl glass-card animate-pulse bg-emerald-50/60" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl glass-card p-12 text-center space-y-4 max-w-md mx-auto bg-white border border-emerald-100 shadow-emerald-sm">
          <ShoppingBag className="w-12 h-12 text-emerald-600 mx-auto opacity-70" />
          <h2 className="font-serif text-2xl font-bold text-neutral-900">
            No Orders Dispatched Yet
          </h2>
          <p className="font-sans text-xs text-neutral-500">
            You haven&apos;t placed an order yet. Treat yourself or a loved one to sovereign scents.
          </p>
          <Link
            href="/shop"
            className="btn-emerald inline-block px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm font-sans"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl glass-card border border-emerald-100 overflow-hidden bg-white shadow-emerald-sm"
            >
              {/* Order Header */}
              <div className="bg-[#F4FAF6] p-4 sm:p-5 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Consignment ID</span>
                  <span className="font-mono font-bold text-neutral-900 text-sm">
                    #{order.orderNumber}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px]">Placed On</span>
                  <span className="font-semibold text-neutral-800">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px]">Total Valuation</span>
                  <span className="font-sans font-bold text-emerald-800 text-sm">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px]">Payment Mode</span>
                  <span className="font-medium text-neutral-800 text-xs">
                    {order.paymentMethod === 'COD' ? 'Cash on Delivery' : order.paymentMethod}
                    {order.codDetails?.distanceKm ? (
                      <span className="text-[10px] text-emerald-700 block font-mono">
                        {order.codDetails.distanceKm} km @ ₹7/km (+{formatPrice(order.codDetails.totalCodCharge)})
                      </span>
                    ) : null}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 block text-[11px] mb-1">Status</span>
                  {getStatusBadge(order.orderStatus)}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6 space-y-4">
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 text-xs border-b border-emerald-50 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-16 rounded-2xl bg-emerald-50/50 overflow-hidden flex-shrink-0 border border-emerald-100/60">
                        <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-neutral-900">{item.name}</h4>
                        <p className="text-neutral-500 text-[11px] font-sans">
                          Flacon: <span className="text-emerald-700 font-semibold">{item.size}</span> • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-sans font-bold text-neutral-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer & Destination */}
              <div className="bg-[#F4FAF6] px-4 sm:px-6 py-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 font-sans">
                <span>
                  Delivering to: <strong className="text-neutral-800">{order.shippingAddress?.fullName}</strong>, {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </span>
                {order.trackingNumber && (
                  <span className="text-emerald-700 font-mono font-bold">
                    Airway Tracking: #{order.trackingNumber}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
