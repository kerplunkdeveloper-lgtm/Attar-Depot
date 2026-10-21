'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, Banknote, ArrowRight, ArrowLeft, CheckCircle, MapPin, Home, Briefcase, LocateFixed, Loader2, AlertCircle, TicketPercent, Tag, X, Sparkles, Check, Landmark, Wallet } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppDispatch, useAppSelector } from '@/store';
import { clearCart, applyCoupon, removeCoupon } from '@/store/cartSlice';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAddresses } from '@/hooks/useProfile';
import { useValidateCoupon, useCoupons } from '@/hooks/useCoupons';
import { formatPrice } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { openAuthModal } from '@/store/uiSlice';
import OrderConfirmedView from './OrderConfirmedView';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, itemsCount, subtotal, discount, appliedCoupon, shipping, total } = useAppSelector(
    (state) => state.cart
  );
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const createOrderMutation = useCreateOrder();
  const { data: addresses = [] } = useAddresses(isAuthenticated);

  // Dynamic Coupons & Offers state
  const [couponInput, setCouponInput] = useState('');
  const validateCouponMutation = useValidateCoupon();
  const { data: availableCouponsData } = useCoupons();
  const availableCoupons = availableCouponsData?.coupons || [];

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a promotional voucher code.', { title: 'Voucher Missing' });
      return;
    }

    try {
      const res = await validateCouponMutation.mutateAsync({ code, orderTotal: subtotal });
      if (res.valid && res.coupon) {
        dispatch(applyCoupon(res.coupon));
        setCouponInput('');
        toast.success(res.message || `Code '${code}' applied!`, { title: 'Voucher Applied' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to apply coupon.', { title: 'Invalid Coupon' });
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.info('Promo voucher removed.', { title: 'Voucher Removed' });
  };

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

  // Keep form full name and phone synced with logged-in user
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // If user lands directly on checkout without logging in, open the auth modal
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('attar_token') : null;
    if (!token && !isAuthenticated && items.length > 0) {
      dispatch(openAuthModal({ mode: 'login', redirectUrl: '/checkout' }));
    }
  }, [isAuthenticated, items.length, dispatch]);

  const [paymentMethod, setPaymentMethod] = useState<'Online' | 'UPI'>('Online');
  const [orderPlaced, setOrderPlaced] = useState<any>(null);
  const [placedItemsSnapshot, setPlacedItemsSnapshot] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  // 📍 COD Distance Calculation (₹7 per km)
  const [deliveryDistanceKm, setDeliveryDistanceKm] = useState<number>(12);

  // Helper to estimate realistic distance from regional hub based on city, pin code, or coordinates
  const estimateDeliveryDistance = (cityName: string, pin: string, lat?: number, lon?: number): number => {
    if (lat && lon) {
      const seed = Math.abs(Math.sin(lat * 123.45 + lon * 67.89));
      return Math.max(4, Math.round(5 + seed * 20)); // 5 km to 25 km
    }
    if (pin) {
      const digits = pin.replace(/\D/g, '');
      if (digits.length >= 3) {
        const sum = digits.split('').reduce((acc, c) => acc + parseInt(c, 10), 0);
        return Math.max(5, (sum % 21) + 6); // 6 km to 26 km
      }
    }
    if (cityName) {
      const lower = cityName.toLowerCase();
      if (lower.includes('kannauj') || lower.includes('kanpur')) return 8;
      if (lower.includes('mumbai') || lower.includes('thane')) return 11;
      if (lower.includes('delhi') || lower.includes('noida') || lower.includes('gurgaon')) return 16;
      if (lower.includes('chennai') || lower.includes('bangalore') || lower.includes('hyderabad')) return 18;
      return 14;
    }
    return 12; // default 12 km
  };

  const selectSavedAddress = (addr: any) => {
    setSelectedAddressId(addr._id);
    const newCity = addr.city || '';
    const newPostal = addr.postalCode || '';
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      address: addr.street ? `${addr.street}${addr.landmark ? ', ' + addr.landmark : ''}` : '',
      city: newCity,
      state: addr.state || '',
      postalCode: newPostal,
      country: addr.country || 'India',
    });
    setDeliveryDistanceKm(estimateDeliveryDistance(newCity, newPostal));
  };

  const { fetchLocation, isLocating, clearError } = useGeolocation();

  const handleUseMyLocation = async () => {
    clearError();
    const loc = await fetchLocation();
    if (loc) {
      setSelectedAddressId(null); // deselect saved address
      const newCity = loc.city || formData.city;
      const newPostal = loc.postalCode || formData.postalCode;
      setFormData((prev) => ({
        ...prev,
        address: loc.street || prev.address,
        city: newCity,
        state: loc.state || prev.state,
        postalCode: newPostal,
        country: loc.country || 'India',
      }));
      const calculatedKm = estimateDeliveryDistance(newCity, newPostal, loc.latitude, loc.longitude);
      setDeliveryDistanceKm(calculatedKm);
      toast.success(
        loc.street
          ? `Location detected: ${loc.displayName} (~${calculatedKm} km from hub)`
          : `Area detected: ${loc.displayName}. Please enter your flat/street address.`,
        { title: '📍 Location Detected' }
      );
    } else {
      toast.info('Could not auto-detect location. Please enter your address details below.', {
        title: 'Manual Address Entry',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'city' || name === 'postalCode') {
      const cityToTest = name === 'city' ? value : formData.city;
      const pinToTest = name === 'postalCode' ? value : formData.postalCode;
      setDeliveryDistanceKm(estimateDeliveryDistance(cityToTest, pinToTest));
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to complete your royal order.', { title: 'Sign In Required' });
      dispatch(openAuthModal({ mode: 'login', redirectUrl: '/checkout' }));
      return;
    }

    if (!formData.address || !formData.city || !formData.postalCode) {
      setErrorMessage('Please complete all shipping address fields.');
      return;
    }

    const finalTotal = total;

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
        paymentMethod: 'Online',
        itemsPrice: subtotal,
        discountPrice: discount || 0,
        coupon: appliedCoupon
          ? {
              code: appliedCoupon.code,
              discount: appliedCoupon.discountAmount,
            }
          : undefined,
        shippingPrice: shipping,
        totalPrice: finalTotal,
        codDetails: {
          isCod: false,
          distanceKm: 0,
          chargePerKm: 0,
          totalCodCharge: 0,
        },
        notes: '',
      };

      setPlacedItemsSnapshot([...items]);
      const created = await createOrderMutation.mutateAsync(orderPayload);
      dispatch(clearCart());
      setOrderPlaced(created?.order || created);
      toast.success(`Consignment #${(created?.order || created).orderNumber} successfully confirmed!`, {
        title: 'Order Confirmed',
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
      <OrderConfirmedView
        order={orderPlaced}
        formData={formData}
        items={orderPlaced.orderItems && orderPlaced.orderItems.length > 0 ? orderPlaced.orderItems : placedItemsSnapshot}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        deliveryDistanceKm={0}
        codRatePerKm={0}
        codDistanceCharge={0}
        total={orderPlaced.totalPrice || total}
      />
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* ─── Top Bar: Back Button, Title & Security Badge ─── */}
      <div className="space-y-4 border-b border-emerald-100 ">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Luxury Back Button */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/cart');
              }
            }}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-emerald-50/80 border border-emerald-200/80 text-neutral-700 hover:text-emerald-900 text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-2xs hover:shadow-emerald-sm active:scale-95 cursor-pointer font-sans"
            aria-label="Back to Cart"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to Cart</span>
          </button>
        </div>
      </div>

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
                Shipping Address
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

            {/* Online Payment Card (Razorpay) */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-emerald-500 bg-[#F4FAF6] shadow-emerald-xs space-y-4 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  {/* Razorpay Logo Container */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50/90 border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
                    <svg className="w-7 h-8 sm:w-8 sm:h-9" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.2 0L0 34H9.2L18.5 10L13.2 0Z" fill="#0C2340" />
                      <path d="M17.8 0L9.8 20.8H16.8L25.8 0H17.8Z" fill="#0284C7" />
                      <path d="M11.8 15.5L7.2 34H14.8L19.2 22.5L11.8 15.5Z" fill="#082B4F" />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                        Razorpay Secure Checkout
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Prepaid Only
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      UPI (GPay, PhonePe, Paytm, BHIM), Credit & Debit Cards, Net Banking & Wallets
                    </p>

                    {/* Method Badges Row */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-white border border-neutral-200 rounded text-[9.5px] font-black tracking-tight text-neutral-800 shadow-2xs">
                        <span>UPI</span>
                        <span className="flex flex-col text-[6px] leading-[2.5px] ml-0.5">
                          <span className="text-[#097939] font-black">▲</span>
                          <span className="text-[#ED7524] font-black">▼</span>
                        </span>
                      </span>

                      <span className="inline-flex items-center px-2 py-0.5 bg-white border border-neutral-200 rounded text-[9.5px] font-black italic tracking-wider text-[#1434CB] shadow-2xs">
                        VISA
                      </span>

                      <span className="inline-flex items-center px-1.5 py-1 bg-white border border-neutral-200 rounded shadow-2xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B] -mr-1"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] opacity-90"></span>
                      </span>

                      <span className="inline-flex items-center px-2 py-0.5 bg-white border border-neutral-200 rounded text-[9.5px] font-black tracking-tight text-[#092B65] shadow-2xs">
                        <span>RuPay</span>
                        <span className="text-[#F37021] text-[8px] ml-0.5 font-black">❯</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-neutral-200 rounded text-[9.5px] font-semibold text-neutral-700 shadow-2xs">
                        <Landmark className="w-3 h-3 text-neutral-500" />
                        <span>Net Banking</span>
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-neutral-200 rounded text-[9.5px] font-semibold text-neutral-700 shadow-2xs">
                        <Wallet className="w-3 h-3 text-neutral-500" />
                        <span>Wallets</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs self-end sm:self-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Reassurance Banner */}
              <div className="pt-3 border-t border-emerald-100 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>256-Bit SSL Encrypted & RBI Compliant Payment Gateway</span>
                </div>
                <span className="font-semibold text-emerald-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                  ✓ Free Insured Delivery Included
                </span>
              </div>
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

            {/* Promo Code & Voucher Section */}
            <div className="border-t border-emerald-100 pt-3 space-y-2.5 font-sans">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <TicketPercent className="w-3.5 h-3.5 text-emerald-600" />
                  Promo Voucher
                </span>
                {appliedCoupon && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Applied
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#012520] bg-white px-2 py-0.5 rounded border border-emerald-200 shadow-2xs">
                      {appliedCoupon.code}
                    </span>
                    <div>
                      <p className="text-[11px] font-bold text-emerald-900 leading-tight">
                        Saved {formatPrice(discount)}
                      </p>
                      <p className="text-[10px] text-emerald-700">
                        {appliedCoupon.title}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-neutral-400 hover:text-rose-600 p-1 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-emerald-50/40 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900 uppercase placeholder:text-neutral-400 placeholder:font-sans placeholder:font-normal focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={validateCouponMutation.isPending || !couponInput.trim()}
                      className="btn-emerald px-4 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wider shrink-0 disabled:opacity-50"
                    >
                      {validateCouponMutation.isPending ? 'Applying...' : 'Apply'}
                    </button>
                  </div>

                  {/* Available Offers Chips */}
                  {availableCoupons.length > 0 && (
                    <div className="pt-1">
                      <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#C9A227]" />
                        Available Offers for You:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {availableCoupons.slice(0, 3).map((cpn) => (
                          <button
                            key={cpn._id}
                            type="button"
                            onClick={() => handleApplyCoupon(cpn.code)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10.5px] font-medium text-emerald-900 transition-colors text-left group"
                          >
                            <span className="font-mono font-bold">{cpn.code}</span>
                            <span className="text-emerald-700">
                              ({cpn.discountType === 'percentage' ? `${cpn.discountValue}%` : `₹${cpn.discountValue}`} OFF)
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-emerald-100 pt-3 space-y-2 text-xs font-sans">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-800">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    Coupon Savings ({appliedCoupon?.code})
                  </span>
                  <span className="font-bold text-emerald-800">- {formatPrice(discount)}</span>
                </div>
              )}
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
