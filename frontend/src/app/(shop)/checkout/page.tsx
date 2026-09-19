'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, CheckCircle, MapPin, Home, Briefcase, LocateFixed, Loader2, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearCart } from '@/store/cartSlice';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAddresses } from '@/hooks/useProfile';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, itemsCount, subtotal, shipping, total } = useAppSelector(
    (state) => state.cart
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const createOrderMutation = useCreateOrder();
  const { data: addresses = [] } = useAddresses(isAuthenticated);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  useEffect(() => {
    if (addresses.length > 0 && !formData.address) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      if (defaultAddr && defaultAddr._id) {
        setSelectedAddressId(defaultAddr._id);
        setFormData({
          fullName: defaultAddr.fullName || user?.name || '',
          phone: defaultAddr.phone || user?.phone || '',
          address: defaultAddr.street ? `${defaultAddr.street}${defaultAddr.landmark ? ', ' + defaultAddr.landmark : ''}` : '',
          city: defaultAddr.city || '',
          state: defaultAddr.state || '',
          postalCode: defaultAddr.postalCode || '',
          country: defaultAddr.country || 'India',
        });
      }
    }
  }, [addresses]);

  const selectSavedAddress = (addr: any) => {
    setSelectedAddressId(addr._id);
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      address: addr.street ? `${addr.street}${addr.landmark ? ', ' + addr.landmark : ''}` : '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || 'India',
    });
  };

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online' | 'UPI'>('COD');
  const [orderPlaced, setOrderPlaced] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const { fetchLocation, isLocating, error: geoError, clearError } = useGeolocation();

  const handleUseMyLocation = async () => {
    clearError();
    const loc = await fetchLocation();
    if (loc) {
      setSelectedAddressId(null); // deselect saved address
      setFormData((prev) => ({
        ...prev,
        address: loc.street || prev.address,
        city: loc.city || prev.city,
        state: loc.state || prev.state,
        postalCode: loc.postalCode || prev.postalCode,
        country: loc.country || 'India',
      }));
      toast.success(`Location detected: ${loc.displayName}`, { title: '📍 Location Found' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (!formData.address || !formData.city || !formData.postalCode) {
      setErrorMessage('Please complete all shipping address fields.');
      return;
    }

    try {
      const orderPayload = {
        orderItems: items.map((i) => ({
          product: i.productId,
          name: i.name,
          image: i.image,
          size: i.size,
          price: i.price,
          quantity: i.quantity,
        })),
        shippingAddress: formData,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const created = await createOrderMutation.mutateAsync(orderPayload);
      dispatch(clearCart());
      setOrderPlaced(created);
      toast.success(`Consignment #${created.orderNumber} successfully registered!`, {
        title: 'Order Dispatched',
        action: {
          label: 'Track Orders',
          onClick: () => router.push('/orders'),
        },
      });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to dispatch order. Please try again.';
      setErrorMessage(msg);
      toast.error(msg, {
        title: 'Order Failed',
      });
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-wider text-neutral-900">
          Imperial Order Confirmed
        </h1>

        <p className="font-sans text-sm text-neutral-600">
          Thank you, <strong className="text-emerald-700">{formData.fullName}</strong>. Your order{' '}
          <strong className="text-emerald-800 font-mono">#{orderPlaced.orderNumber}</strong> has been registered with our royal dispatch atelier.
        </p>

        <div className="p-5 rounded-2xl glass-card border border-emerald-100 text-left text-xs space-y-2 max-w-md mx-auto bg-white shadow-emerald-sm font-sans">
          <div className="flex justify-between">
            <span className="text-neutral-500">Total Amount:</span>
            <span className="font-bold text-emerald-800 text-sm">{formatPrice(orderPlaced.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Payment Mode:</span>
            <span className="text-neutral-800 font-medium">{orderPlaced.paymentMethod} ({orderPlaced.paymentStatus})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Destination:</span>
            <span className="text-neutral-800">{formData.city}, {formData.state}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center font-sans">
          <Link
            href="/orders"
            className="btn-emerald px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-sm"
          >
            Track in My Orders
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-neutral-700 bg-white hover:bg-emerald-50 border border-emerald-200"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-neutral-800">No Items to Checkout</h2>
        <p className="font-sans text-xs text-neutral-500">Your fragrance vault is empty. Please add an attar to proceed.</p>
        <Link href="/shop" className="btn-emerald inline-block px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white font-sans">
          Browse Perfumes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 uppercase">
          Royal Checkout & Dispatch
        </h1>
        <p className="font-sans text-xs sm:text-sm text-neutral-600 mt-1">
          Provide your courier destination for insured parcel delivery.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs font-sans">
          <span className="text-emerald-900 font-medium">
            Already have an account? Sign in for saved addresses and loyalty points.
          </span>
          <Link
            href="/login?redirect=/checkout"
            className="btn-emerald px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[11px] text-white"
          >
            Sign In Now
          </Link>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Shipping Details & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="rounded-3xl glass-card p-6 sm:p-8 border border-emerald-100 space-y-4 bg-white shadow-emerald-sm">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3 text-neutral-900">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <h2 className="font-serif text-base font-bold uppercase tracking-wider">
                  Consignment Shipping Address
                </h2>
              </div>

              {/* 📍 Use My Location Button */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all duration-200 font-sans
                  bg-gradient-to-r from-emerald-50 to-emerald-100/80 border-emerald-300 text-emerald-800
                  hover:from-emerald-600 hover:to-emerald-700 hover:text-white hover:border-emerald-600 hover:shadow-[0_0_14px_rgba(16,185,129,0.35)]
                  disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              >
                {isLocating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LocateFixed className="w-3.5 h-3.5 group-hover:animate-pulse" />
                )}
                <span>{isLocating ? 'Detecting...' : 'Use My Location'}</span>
              </button>
            </div>

            {/* Geo Error Banner */}
            {geoError && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{geoError}</span>
              </div>
            )}

            {/* Saved Addresses Quick Selector */}
            {isAuthenticated && addresses.length > 0 && (
              <div className="space-y-3 pb-3 border-b border-emerald-100/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Select from Saved Addresses</span>
                  </span>
                  <Link
                    href="/profile"
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-950 hover:underline"
                  >
                    Manage in Profile →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;
                    return (
                      <div
                        key={addr._id}
                        onClick={() => selectSavedAddress(addr)}
                        className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-xs'
                            : 'border-neutral-200 bg-neutral-50/40 hover:bg-emerald-50/30 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-neutral-900 truncate">
                            {addr.fullName}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white border border-neutral-200 text-neutral-600">
                              {addr.addressType || 'Home'}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-600 truncate">{addr.street}</p>
                        <p className="text-[11px] text-neutral-500 font-medium">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Contact Mobile Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Street Address & Villa / Flat No. *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  State / Province *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Postal / Pin Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  disabled
                  value={formData.country}
                  className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="rounded-3xl glass-card p-6 sm:p-8 border border-emerald-100 space-y-4 bg-white shadow-emerald-sm">
            <div className="flex items-center gap-2 border-b border-emerald-100 pb-3 text-neutral-900">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <h2 className="font-serif text-base font-bold uppercase tracking-wider">
                Payment Mechanism
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-emerald-sm'
                    : 'border-emerald-100 bg-white hover:border-emerald-200'
                }`}
              >
                <Banknote className="w-5 h-5 text-emerald-600 mb-2" />
                <div>
                  <p className="text-xs font-bold text-neutral-800">Cash on Delivery</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Pay upon delivery</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'UPI'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-emerald-sm'
                    : 'border-emerald-100 bg-white hover:border-emerald-200'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600 mb-2" />
                <div>
                  <p className="text-xs font-bold text-neutral-800">UPI / QR Transfer</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Instant zero-fee transfer</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Online')}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  paymentMethod === 'Online'
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-emerald-sm'
                    : 'border-emerald-100 bg-white hover:border-emerald-200'
                }`}
              >
                <CreditCard className="w-5 h-5 text-emerald-600 mb-2" />
                <div>
                  <p className="text-xs font-bold text-neutral-800">Credit / Debit Card</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Encrypted 256-bit</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Order Items Review & Final Submit */}
        <div className="space-y-6">
          <div className="rounded-3xl glass-card p-6 border border-emerald-100 space-y-4 bg-white shadow-emerald-sm">
            <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-emerald-100 pb-3">
              Consignment Items ({itemsCount})
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 font-sans">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3 text-xs">
                  <div className="relative w-12 h-14 rounded-xl bg-emerald-50/50 overflow-hidden flex-shrink-0 border border-emerald-100/60">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-sm font-bold text-neutral-900 line-clamp-1">{item.name}</p>
                    <p className="text-neutral-500 text-[11px] font-sans">{item.size} × {item.quantity}</p>
                  </div>
                  <span className="font-sans font-bold text-emerald-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-emerald-100 pt-3 space-y-2 text-xs font-sans">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-800">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Royal Insured Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-neutral-800'}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-emerald-100 pt-2">
                <span>Total Due</span>
                <span className="font-sans text-xl font-extrabold text-emerald-800">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={createOrderMutation.isPending}
              className="w-full btn-emerald py-3.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-emerald-sm text-white font-sans"
            >
              <span>{createOrderMutation.isPending ? 'Placing Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 justify-center pt-2 font-sans">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Complimentary insured transit with courier SMS tracking</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
