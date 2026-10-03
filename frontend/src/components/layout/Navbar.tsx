'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  ChevronUp,
  Search,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  LogOut,
  PackageCheck,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  ChevronRight,
  Home,
  Crown,
  Compass,
  MessageCircle,
  Tag,
  Flame,
  Bot,
  Layers,
  ArrowRight,
  Gift,
  LocateFixed,
  Heart,
  Phone,
  Copy,
  Check,
  TicketPercent,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  toggleCartDrawer,
  toggleWishlistDrawer,
  openAuthModal,
  toggleSearch,
} from '@/store/uiSlice';
import { logout, hydrateAuth } from '@/store/authSlice';
import { hydrateCart } from '@/store/cartSlice';
import { hydrateWishlist } from '@/store/wishlistSlice';
import { useCategories } from '@/hooks/useCategories';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { usePublicTaxonomy } from '@/hooks/useTaxonomy';
import { useBannerCoupons } from '@/hooks/useCoupons';
import { toast } from '@/lib/toast';
import api from '@/lib/api';
import { getQueryClient } from '@/components/providers/Providers';
import { motion, AnimatePresence } from 'framer-motion';
import {
  backdropVariants,
  drawerLeftVariants,
  accordionVariants,
  luxuryEase,
  popSpring,
} from '@/lib/animations';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { itemsCount } = useAppSelector((state) => state.cart);
  const { itemsCount: wishlistCount } = useAppSelector((state) => state.wishlist);
  const { user, isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);
  const { isSearchOpen } = useAppSelector((state) => state.ui);

  const [mounted, setMounted] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  // Dynamic promo banner coupons
  const { data: bannerCouponsData } = useBannerCoupons();
  const bannerCoupons = bannerCouponsData?.coupons || [];
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [isBannerCopied, setIsBannerCopied] = useState(false);

  useEffect(() => {
    if (bannerCoupons.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % bannerCoupons.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannerCoupons.length]);

  const currentBannerCoupon = bannerCoupons[activeBannerIdx] || bannerCoupons[0] || null;

  const handleCopyBannerCoupon = (code: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setIsBannerCopied(true);
      toast.info(`Promo code '${code}' copied! Apply at checkout for discount.`, {
        title: 'Voucher Copied',
      });
      setTimeout(() => setIsBannerCopied(false), 2500);
    }
  };

  const lastScrollY = useRef(0);
  const shopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories();
  const { data: filterOptions } = useFilterOptions();
  const { data: taxonomy } = usePublicTaxonomy();

  const rawMegaNotes =
    taxonomy?.notes && taxonomy.notes.length > 0
      ? taxonomy.notes.map((n) => n.name)
      : filterOptions?.notes ?? [];
  const megaNotes = rawMegaNotes.filter(
    (n) => n && n.trim() !== '' && n.toLowerCase() !== 'sex'
  );

  const megaCollections =
    taxonomy?.collections && taxonomy.collections.length > 0
      ? taxonomy.collections.map((c) => c.name)
      : filterOptions?.collections ?? [];

  const megaOccasions =
    taxonomy?.occasions && taxonomy.occasions.length > 0
      ? taxonomy.occasions.map((o) => o.name)
      : filterOptions?.occasions ?? [];

  const megaPriceRanges = filterOptions?.priceRanges ?? [
    { label: 'Under ₹1999', value: 'under-1999', min: 0, max: 1999 },
    { label: '₹2000 – ₹2999', value: '2000-2999', min: 2000, max: 2999 },
    { label: '₹3000 – ₹3999', value: '3000-3999', min: 3000, max: 3999 },
    { label: '₹4000 – ₹4999', value: '4000-4999', min: 4000, max: 4999 },
    { label: '₹5000 – ₹5999', value: '5000-5999', min: 5000, max: 5999 },
  ];

  const openShopDropdown = () => {
    if (shopTimeoutRef.current) {
      clearTimeout(shopTimeoutRef.current);
      shopTimeoutRef.current = null;
    }
    setIsShopOpen(true);
  };

  const closeShopDropdown = (delay = 250) => {
    if (shopTimeoutRef.current) {
      clearTimeout(shopTimeoutRef.current);
    }
    shopTimeoutRef.current = setTimeout(() => {
      setIsShopOpen(false);
    }, delay);
  };

  const toggleShopDropdown = () => {
    if (shopTimeoutRef.current) {
      clearTimeout(shopTimeoutRef.current);
      shopTimeoutRef.current = null;
    }
    setIsShopOpen((prev) => !prev);
  };

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateAuth());
    dispatch(hydrateCart());
    dispatch(hydrateWishlist());
  }, [dispatch]);

  // Lock body scroll when mobile off-canvas drawer is active
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileNavOpen]);

  // Automatically dismiss mobile drawer and mega menu when route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsShopOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileNavOpen(false);
        setIsShopOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll hide/show listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsAtTop(currentScrollY < 15);

      if (currentScrollY < 30) {
        setIsNavVisible(true);
      } else if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > 90 &&
        Math.abs(currentScrollY - lastScrollY.current) > 8
      ) {
        // Scrolling DOWN -> hide navbar smoothly
        if (!isMobileNavOpen && !isUserMenuOpen && !isShopOpen) {
          setIsNavVisible(false);
        }
      } else if (
        currentScrollY < lastScrollY.current &&
        Math.abs(currentScrollY - lastScrollY.current) > 8
      ) {
        // Scrolling UP -> reveal navbar smoothly
        setIsNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileNavOpen, isUserMenuOpen, isShopOpen]);

  // Click outside listeners for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(target) &&
        (!megaMenuRef.current || !megaMenuRef.current.contains(target))
      ) {
        if (shopTimeoutRef.current) {
          clearTimeout(shopTimeoutRef.current);
        }
        setIsShopOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    api.post('/auth/logout').catch(() => {});
    getQueryClient().clear();
    setIsUserMenuOpen(false);
    toast.info('You have safely signed out of your account.', {
      title: 'Signed Out',
    });
    router.push('/');
  };

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isAbout = pathname === '/about';
  const isOrders = pathname === '/orders';
  const isGifting = pathname === '/gifting';
  const isContact = pathname === '/contact';
  const isCart = pathname === '/cart';
  const isProductDetail = pathname.startsWith('/product/');

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FIXED TOP HEADER WRAPPER                                              */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ease-in-out ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* TOP UTILITY & PROMO ANNOUNCEMENT BAR (ONLY VISIBLE AT THE VERY TOP OF THE PAGE) */}
        <div
          className={`w-full bg-[#FBF4E3] text-neutral-800 select-none transition-all duration-300 ease-in-out overflow-hidden ${
            isAtTop
              ? 'max-h-16 opacity-100 border-b border-neutral-300'
              : 'max-h-0 opacity-0 -translate-y-full border-b-0 pointer-events-none'
          }`}
        >
          <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 min-h-[26px] sm:h-9 py-0.5 sm:py-0 flex items-center justify-center text-center overflow-hidden">
            {currentBannerCoupon ? (
              <div className="flex items-center justify-center w-full text-[9px] xs:text-[10px] sm:text-[12.5px] font-medium text-neutral-800 tracking-tight sm:tracking-wide gap-1 sm:gap-2 whitespace-nowrap overflow-hidden">
                <span className="font-semibold text-neutral-900 truncate flex-shrink">
                  {currentBannerCoupon.bannerText ||
                    `Special Offer: Get ${
                      currentBannerCoupon.discountType === 'percentage'
                        ? `${currentBannerCoupon.discountValue}% OFF`
                        : `₹${currentBannerCoupon.discountValue} OFF`
                    } on your order!`}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyBannerCoupon(currentBannerCoupon.code)}
                  className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 rounded bg-[#012520] text-[#F5B418] font-mono font-bold text-[8.5px] xs:text-[9px] sm:text-[11px] border border-[#F5B418]/40 hover:bg-emerald-950 transition-all active:scale-95 cursor-pointer shadow-2xs flex-shrink-0"
                  title="Click to copy voucher code"
                >
                  <span>{currentBannerCoupon.code}</span>
                  {isBannerCopied ? (
                    <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#F5B418]" />
                  )}
                </button>
                <span className="text-neutral-400 mx-0.5 sm:mx-1 font-normal hidden sm:inline flex-shrink-0">|</span>
                <Link
                  href="/shop"
                  className="font-bold text-emerald-800 hover:text-emerald-950 group inline-flex items-center gap-0.5 sm:gap-1 transition-colors underline-offset-4 hover:underline text-[8.5px] xs:text-[9.5px] sm:text-[12px] flex-shrink-0"
                >
                  <span className="hidden sm:inline">Shop Now</span>
                  <span className="sm:hidden">Shop</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#C9A227] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full text-[9.5px] sm:text-[13px] font-medium text-neutral-800 tracking-tight sm:tracking-wide whitespace-nowrap overflow-hidden gap-1 sm:gap-1.5">
                <span className="truncate flex-shrink">Celebrate. Gift. Delight.</span>
                <span className="text-xs sm:text-base select-none flex-shrink-0" role="img" aria-label="gift">🎁</span>
                <span className="text-neutral-400 font-normal hidden sm:inline flex-shrink-0">|</span>
                <Link
                  href="/shop"
                  className="font-bold text-neutral-900 hover:text-emerald-800 group inline-flex items-center gap-0.5 sm:gap-1 transition-colors underline-offset-4 hover:underline text-[9.5px] sm:text-[12px] flex-shrink-0"
                >
                  <span className="hidden sm:inline">Explore Pure Attars</span>
                  <span className="sm:hidden">Shop</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#C9A227] group-hover:translate-x-0.5 group-hover:text-emerald-800 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN LUXURY NAVIGATION BAR (MATCHING USER REFERENCE DESIGN)       */}
        {/* ================================================================= */}
        <div className="w-full relative overflow-hidden border-b border-[#F5B418]/30 shadow-[0_12px_45px_rgba(0,0,0,0.65)]">
          {/* Royal Perfumery Panoramic Background (Flanking flacons, Islamic arch & incense smoke) */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
            <img
              src="/api/navbar-bg"
              alt=""
              className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.08]"
            />
            {/* Emerald dark glassmorphic vignette for pristine legibility and contrast */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 50%, rgba(1, 37, 32, 0.65) 0%, rgba(1, 28, 22, 0.85) 60%, rgba(0, 16, 12, 0.94) 100%)',
              }}
            />
            {/* Top & bottom 24k gold hairline borders */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418]/60 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
            <div className="relative flex items-center justify-between h-[56px] min-[360px]:h-[60px] sm:h-[64px] lg:h-[68px] xl:h-[74px] gap-2 sm:gap-4">
              
              {/* ================================================================= */}
              {/* 1. LEFT SECTION: Brand Logo (Desktop & Mobile) + Mobile Hamburger  */}
              {/* ================================================================= */}
              <div className="flex items-center justify-start gap-2 sm:gap-3 shrink-0 z-20">
                {/* Mobile menu trigger button */}
                <button
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl text-[#FAF8F2] hover:text-[#F5B418] transition-all lg:hidden flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/10 shadow-2xs cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileNavOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>

                {/* Brand Official Logo (Left-aligned) */}
                <Link
                  href="/"
                  className="group relative flex items-center py-1 select-none transition-transform duration-300 active:scale-[0.98]"
                  aria-label="Attar Depot Home"
                >
                  {/* Subtle golden ambient aura behind the logo */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#F5B418]/25 via-[#F5B418]/15 to-transparent rounded-full blur-lg pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <Image
                    src="/images/logonew.png"
                    alt="Attar Depot - Pure Essence of Royalty"
                    width={320}
                    height={90}
                    priority
                    quality={95}
                    className="h-[36px] min-[360px]:h-[40px] xs:h-[44px] sm:h-[48px] md:h-[52px] lg:h-[58px] xl:h-[68px] w-auto object-contain drop-shadow-[0_2px_12px_rgba(245,180,24,0.4)] group-hover:scale-[1.03] group-hover:drop-shadow-[0_4px_18px_rgba(245,180,24,0.6)] group-hover:brightness-110 transition-all duration-300 relative z-10"
                  />
                </Link>
              </div>

              {/* ================================================================= */}
              {/* 2. CENTER SECTION: Signature Capsule Pill Navigation Bar (Compact) */}
              {/* ================================================================= */}
              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center z-20 pointer-events-auto">
                {/* Left Ornamental Diamond Finial */}
                <div className="hidden 2xl:flex items-center gap-0.5 text-[#F5B418]/80 mr-1.5 select-none pointer-events-none">
                  <span className="w-4 h-[1px] bg-gradient-to-l from-[#F5B418]/90 to-transparent" />
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#F5B418] drop-shadow-[0_0_5px_rgba(245,180,24,0.5)]">
                    <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="rgba(245,180,24,0.18)" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>

                {/* Central Floating Capsule Pill (Refined & Compact Menu Size) */}
                <nav className="flex items-center gap-2 bg-[#011C16]/85 px-1.5 py-2 xl:px-2 xl:py-2 rounded-full border border-[#F5B418]/45 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(245,180,24,0.25)]">
                  {/* Home Link (Iconic Golden Pill when active) */}
                  <Link
                    href="/"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[9px] xl:text-[9.5px] font-bold tracking-[0.06em] uppercase py-0.5 px-2 xl:px-2.5 rounded-full transition-all duration-200 group flex items-center gap-1 ${
                      isHome
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {isHome && (
                      <span className="w-2 h-2 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0 animate-pulse" />
                    )}
                    <span className="text-[12px]">Home</span>
                  </Link>

                  {/* Shop Dropdown Trigger */}
                  <div
                    className="relative"
                    ref={shopDropdownRef}
                    onMouseEnter={openShopDropdown}
                    onMouseLeave={() => closeShopDropdown(250)}
                  >
                    <button
                      onClick={toggleShopDropdown}
                      className={`relative flex items-center gap-1 text-[9px] xl:text-[9.5px] font-bold tracking-[0.06em] uppercase py-0.5 px-2 xl:px-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                        isShop || isShopOpen
                          ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                          : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                      }`}
                      aria-expanded={isShopOpen}
                    >
                      <span className="text-[12px]">Shop</span>
                      <ChevronDown
                        className={`w-2.5 h-2.5 transition-transform duration-300 ${
                          isShopOpen
                            ? 'rotate-180 text-[#F5B418]'
                            : isShop
                            ? 'text-[#F5B418]'
                            : 'text-[#FAF8F2]/70 group-hover:text-[#F5B418]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Gifting Link */}
                  <Link
                    href="/gifting"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[9px] xl:text-[9.5px] font-bold tracking-[0.06em] uppercase py-0.5 px-2 xl:px-2.5 rounded-full transition-all duration-200 group flex items-center gap-1 ${
                      isGifting
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[12px]">Gifting</span>
                  </Link>

                  {/* Our Brand Link */}
                  <Link
                    href="/about"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[9px] xl:text-[9.5px] font-bold tracking-[0.06em] uppercase py-0.5 px-2 xl:px-2.5 rounded-full transition-all duration-200 group flex items-center gap-1 ${
                      isAbout
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[12px]">Our Brand</span>
                  </Link>

                  {/* Contact Link */}
                  <Link
                    href="/contact"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[9px] xl:text-[9.5px] font-bold tracking-[0.06em] uppercase py-0.5 px-2 xl:px-2.5 rounded-full transition-all duration-200 group flex items-center gap-1 ${
                      isContact
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[12px]">Contact</span>
                  </Link>
                </nav>

                {/* Right Ornamental Diamond Finial */}
                <div className="hidden 2xl:flex items-center gap-0.5 text-[#F5B418]/80 ml-1.5 select-none pointer-events-none">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#F5B418] drop-shadow-[0_0_5px_rgba(245,180,24,0.5)]">
                    <path d="M12 2L22 12L12 22L2 12L12 2Z" stroke="currentColor" strokeWidth="1.5" fill="rgba(245,180,24,0.18)" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                  <span className="w-4 h-[1px] bg-gradient-to-r from-[#F5B418]/90 to-transparent" />
                </div>
              </div>

              {/* ================================================================= */}
              {/* 3. RIGHT SECTION: Utility Dock (Search, Heart, Bag, Sign In)      */}
              {/* ================================================================= */}
              <div className="flex items-center justify-end shrink-0 gap-1.5 sm:gap-2 z-20">

                {/* Mobile Quick Action Buttons (Search, Wishlist & Sign In) */}
                <div className="flex lg:hidden items-center gap-1">
                  <button
                    onClick={() => dispatch(toggleSearch(true))}
                    className="relative w-8 h-8 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full bg-white/[0.06] border border-white/10 active:scale-95 shadow-2xs cursor-pointer"
                    aria-label="Search Fragrance Vault"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => dispatch(toggleWishlistDrawer(true))}
                    className="relative w-8 h-8 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full bg-white/[0.06] border border-white/10 active:scale-95 shadow-2xs cursor-pointer"
                    aria-label="Royal Wishlist Vault"
                    suppressHydrationWarning
                  >
                    <Heart className="w-3.5 h-3.5" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-[#F5B418] text-[9px] font-black text-white shadow-[0_0_8px_rgba(244,63,94,0.6)] border border-[#012520]">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        dispatch(openAuthModal('login'));
                      } else {
                        router.push('/profile');
                      }
                    }}
                    className="relative flex items-center gap-1.5 h-8 px-2.5 text-[#FAF8F2]/95 hover:text-[#F5B418] transition-all rounded-full bg-[#011C16]/85 border border-[#F5B418]/60 active:scale-95 shadow-2xs cursor-pointer"
                    aria-label={mounted && isAuthenticated && user ? 'View Profile' : 'Sign In'}
                    suppressHydrationWarning
                  >
                    {mounted &&
                    isAuthenticated &&
                    user?.avatar &&
                    !user.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-3.5 h-3.5 rounded-full object-cover border border-[#F5B418]"
                      />
                    ) : (
                      <UserIcon className="w-3 h-3 text-[#F5B418]" />
                    )}
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#FAF8F2]">
                      {mounted && isAuthenticated && user ? user.name.split(' ')[0] : 'SIGN IN'}
                    </span>
                  </button>
                </div>

                {/* Desktop Signature Pill Utility Dock (Compact) */}
                <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#011C16]/85 px-1.5 py-0.5 xl:px-2 xl:py-0.5 rounded-full border border-[#F5B418]/45 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(245,180,24,0.25)]">
                  {/* Search Modal Trigger */}
                  <button
                    onClick={() => dispatch(toggleSearch(true))}
                    className="relative w-7 h-7 xl:w-7.5 xl:h-7.5 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full hover:bg-white/[0.08] group cursor-pointer active:scale-95"
                    aria-label="Search Fragrance Vault"
                    title="Search pure attars & flacons (Ctrl+K)"
                  >
                    <Search className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                  </button>

                  {/* Wishlist Vault Trigger */}
                  <button
                    onClick={() => dispatch(toggleWishlistDrawer(true))}
                    className="relative w-7 h-7 xl:w-7.5 xl:h-7.5 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full hover:bg-white/[0.08] group cursor-pointer active:scale-95"
                    aria-label="Royal Wishlist Vault"
                    title={`Royal Wishlist (${wishlistCount})`}
                    suppressHydrationWarning
                  >
                    <Heart className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-[#F5B418] text-[8px] font-black text-white shadow-[0_0_8px_rgba(244,63,94,0.6)] border border-[#012520] animate-in zoom-in-50">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Cart Drawer Trigger */}
                  <button
                    onClick={() => dispatch(toggleCartDrawer(true))}
                    className="relative w-7 h-7 xl:w-7.5 xl:h-7.5 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full hover:bg-white/[0.08] group cursor-pointer active:scale-95"
                    aria-label="View Shopping Cart"
                    suppressHydrationWarning
                  >
                    <ShoppingBag className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                    {mounted && itemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFDF78] text-[8px] font-black text-[#012520] shadow-[0_0_8px_rgba(245,180,24,0.7)] border border-[#012520] ring-1 ring-[#F5B418]/60 animate-in zoom-in-50">
                        {itemsCount}
                      </span>
                    )}
                  </button>

                  {/* Vertical Hairline Divider */}
                  <div className="w-[1px] h-3.5 bg-[#F5B418]/30 mx-0.5" />

                  {/* User Profile / SIGN IN Pill Button */}
                  <div className="relative" ref={userDropdownRef}>
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          dispatch(openAuthModal('login'));
                        } else {
                          setIsUserMenuOpen(!isUserMenuOpen);
                        }
                      }}
                      className="flex items-center gap-1.5 h-7 xl:h-7.5 px-2 xl:px-2.5 text-[#FAF8F2] hover:text-[#F5B418] transition-all rounded-full bg-gradient-to-r from-[#F5B418]/25 via-[#F5B418]/15 to-[#F5B418]/25 hover:from-[#F5B418]/35 hover:to-[#F5B418]/25 border border-[#F5B418]/60 hover:border-[#F5B418] shadow-[0_0_10px_rgba(245,180,24,0.2)] active:scale-95 cursor-pointer group"
                      aria-label="User Account"
                      suppressHydrationWarning
                    >
                      {mounted &&
                      isAuthenticated &&
                      user?.avatar &&
                      !user.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-3.5 h-3.5 rounded-full object-cover border border-[#F5B418]"
                        />
                      ) : (
                        <UserIcon className="w-3 h-3 text-[#F5B418] transition-transform duration-200 group-hover:scale-110" />
                      )}
                      {mounted && isAuthenticated && user ? (
                        <span className="text-[9.5px] xl:text-[10px] font-bold text-[#FAF8F2] max-w-[75px] truncate">
                          {user.name.split(' ')[0]}
                        </span>
                      ) : (
                        <span className="text-[9px] xl:text-[9.5px] font-extrabold text-[#FAF8F2] group-hover:text-[#F5B418] uppercase tracking-[0.08em]">
                          SIGN IN
                        </span>
                      )}
                    </button>

                  {/* Desktop User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        key="user-dropdown"
                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -6 }}
                        transition={{ duration: 0.18, ease: luxuryEase }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass-panel p-2.5 shadow-2xl border border-emerald-100/90 text-xs bg-white/98 z-50"
                      >
                      {isAuthenticated && user ? (
                        <>
                          <div className="px-3 py-2.5 border-b border-emerald-100 bg-emerald-50/50 rounded-xl mb-1.5">
                            <p className="font-bold text-neutral-900 truncate">{user.name}</p>
                            <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                            {isAdmin && (
                              <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold tracking-wider border border-emerald-200">
                                Store Admin
                              </span>
                            )}
                          </div>

                          {isAdmin && (
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-800 hover:bg-emerald-50 font-semibold transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                              <span>Admin Portal</span>
                            </Link>
                          )}

                          <Link
                            href="/profile"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium transition-colors"
                          >
                            <UserIcon className="w-4 h-4 text-emerald-700" />
                            <span>My Profile & Addresses</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              dispatch(toggleWishlistDrawer(true));
                            }}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium transition-colors text-left"
                          >
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-rose-500" />
                              <span>Saved Wishlist</span>
                            </div>
                            {mounted && wishlistCount > 0 && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">
                                {wishlistCount}
                              </span>
                            )}
                          </button>

                          <Link
                            href="/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium transition-colors"
                          >
                            <PackageCheck className="w-4 h-4 text-emerald-700" />
                            <span>Order History</span>
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-left mt-1 border-t border-emerald-50 pt-2 transition-colors font-semibold cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <div className="p-3 text-center space-y-2.5">
                          <p className="text-[11px] text-neutral-600 leading-relaxed">
                            Sign in to access your royal vault, saved addresses & order history
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              dispatch(openAuthModal('login'));
                            }}
                            className="block w-full py-2 px-3 rounded-xl text-center text-xs uppercase font-bold tracking-wider btn-emerald text-white shadow-emerald-sm cursor-pointer"
                          >
                            Sign In
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              dispatch(openAuthModal('signup'));
                            }}
                            className="block w-full py-1 text-xs text-emerald-800 hover:text-emerald-950 font-semibold transition-colors cursor-pointer"
                          >
                            Create Account
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1.1 EDGE-TO-EDGE FULL-WIDTH MEGA MENU DROPDOWN PANEL (100% VIEWPORT)      */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {isShopOpen && (
            <motion.div
              key="mega-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: luxuryEase }}
              ref={megaMenuRef}
              className="w-full left-0 right-0 z-50"
              onMouseEnter={openShopDropdown}
              onMouseLeave={() => closeShopDropdown(250)}
            >
            {/* Dark Frosted Luxury Backdrop */}
            <div
              className={`fixed inset-0 bg-neutral-950/65 backdrop-blur-xs -z-10 transition-all duration-300 ${
                isAtTop
                  ? 'top-[82px] min-[360px]:top-[86px] sm:top-[92px] lg:top-[96px] xl:top-[102px]'
                  : 'top-[56px] min-[360px]:top-[60px] sm:top-[64px] lg:top-[68px] xl:top-[74px]'
              }`}
              onClick={() => {
                if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                setIsShopOpen(false);
              }}
              aria-hidden="true"
            />

            {/* Edge-to-Edge Mega Menu Panel */}
            <div
              className={`w-full bg-white border-b border-[#C9A227]/30 shadow-[0_35px_80px_-15px_rgba(1,37,32,0.35)] overflow-y-auto transition-all duration-300 ${
                isAtTop
                  ? 'max-h-[calc(100vh-86px)] sm:max-h-[calc(100vh-92px)] lg:max-h-[calc(100vh-96px)] xl:max-h-[calc(100vh-102px)]'
                  : 'max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-64px)] lg:max-h-[calc(100vh-68px)] xl:max-h-[calc(100vh-74px)]'
              }`}
            >
              {/* Top Vault Bar */}
              <div className="w-full border-b border-[#C9A227]/25 bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F5B418]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#FAF8F2]">
                      Artisanal Fragrance Vault & Distillations
                    </span>
                    <span className="hidden md:inline-block text-[10px] font-semibold text-[#F5B418] bg-white/10 px-2 py-0.5 rounded-full border border-[#F5B418]/30">
                      100% Pure Alcohol-Free
                    </span>
                  </div>
                  <Link
                    href="/shop"
                    onClick={() => {
                      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                      setIsShopOpen(false);
                    }}
                    className="text-[11px] font-bold text-[#F5B418] hover:text-[#ffd778] uppercase tracking-wider transition-colors flex items-center gap-1 group"
                  >
                    <span>View Entire Collection</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* 5-Column Responsive Full-Width Content Grid */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-7">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 xl:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-emerald-100/80">
                  {/* Col 1: Fragrance Notes */}
                  <div className="lg:pr-4 space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                        Fragrance Notes
                      </p>
                    </div>
                    <div className="space-y-1">
                      {megaNotes.length > 0 ? (
                        megaNotes.slice(0, 8).map((note) => (
                          <Link
                            key={note}
                            href={`/shop?notes=${encodeURIComponent(note)}`}
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="group flex items-center justify-between text-xs text-neutral-700 hover:text-emerald-950 py-1.5 px-2.5 rounded-xl hover:bg-emerald-50 transition-all font-medium"
                          >
                            <span>{note}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#046A5A] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))
                      ) : (
                        <p className="text-[11px] text-neutral-400 italic px-2">Loading notes...</p>
                      )}
                    </div>
                  </div>

                  {/* Col 2: Categories */}
                  <div className="lg:px-4 pt-4 lg:pt-0 space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                        Categories
                      </p>
                    </div>
                    <div className="space-y-1">
                      {categories.slice(0, 8).map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/shop?category=${cat.slug}`}
                          onClick={() => {
                            if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                            setIsShopOpen(false);
                          }}
                          className="group flex items-center justify-between text-xs text-neutral-700 hover:text-emerald-950 py-1.5 px-2.5 rounded-xl hover:bg-emerald-50 transition-all font-medium"
                        >
                          <span>{cat.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-[#046A5A] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                      {categories.length === 0 && (
                        <p className="text-[11px] text-neutral-400 italic px-2">Pure Attars</p>
                      )}
                    </div>
                  </div>

                  {/* Col 3: Occasions */}
                  <div className="lg:px-4 pt-4 lg:pt-0 space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                      <Gift className="w-3.5 h-3.5 text-emerald-700" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                        Occasions
                      </p>
                    </div>
                    <div className="space-y-1">
                      {(megaOccasions.length > 0
                        ? megaOccasions
                        : [
                            'Daily Wear',
                            'Special Occasions',
                            'Evening Wear',
                            'Festive & Bridal',
                            'Office & Work',
                            'Gifting',
                            'Spiritual & Meditation',
                            'Casual Day',
                          ]
                      )
                        .slice(0, 8)
                        .map((occ) => (
                          <Link
                            key={occ}
                            href={`/shop?occasion=${encodeURIComponent(occ)}`}
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="group flex items-center justify-between text-xs text-neutral-700 hover:text-emerald-950 py-1.5 px-2.5 rounded-xl hover:bg-emerald-50 transition-all font-medium"
                          >
                            <span>{occ}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#046A5A] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                    </div>
                  </div>

                  {/* Col 4: Collections & Price */}
                  <div className="lg:px-4 pt-4 lg:pt-0 space-y-2.5">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                      <Crown className="w-3.5 h-3.5 text-emerald-700" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-950">
                        Royal Collections
                      </p>
                    </div>
                    <div className="space-y-1">
                      {(megaCollections.length > 0
                        ? megaCollections
                        : ['Royal Heritage', 'Daily Luxury', 'Bridal Edition', 'Vintage Oud']
                      )
                        .slice(0, 4)
                        .map((col) => (
                          <Link
                            key={col}
                            href={`/shop?collection=${encodeURIComponent(col)}`}
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="group flex items-center justify-between text-xs text-neutral-700 hover:text-emerald-950 py-1.5 px-2.5 rounded-xl hover:bg-emerald-50 transition-all font-medium"
                          >
                            <span>{col}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#046A5A] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                    </div>

                    <div className="pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-950 pb-1 border-b border-emerald-100 mb-1.5">
                        Price Range
                      </p>
                      <div className="space-y-1">
                        {megaPriceRanges.slice(0, 3).map(({ label, value }) => (
                          <Link
                            key={value}
                            href={`/shop?priceRange=${value}`}
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="block text-xs text-neutral-700 hover:text-emerald-950 py-1 px-2.5 rounded-xl hover:bg-emerald-50 transition-all font-medium"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Col 5: Luxury Spotlight Card */}
                  <div className="lg:pl-4 pt-4 lg:pt-0 flex flex-col justify-between">
                    <div className="h-full rounded-2xl bg-gradient-to-br from-[#023129] via-[#034A3E] to-[#01221c] p-4 text-white shadow-xl relative overflow-hidden group flex flex-col justify-between border border-emerald-700/50">
                      <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#F5B418]/15 rounded-full blur-xl group-hover:bg-[#F5B418]/25 transition-all pointer-events-none" />

                      <div className="relative z-10 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#F5B418] bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded-full">
                            Signature Flacon
                          </span>
                          <span className="text-[10px] text-emerald-200">★ 4.9/5</span>
                        </div>
                        <p className="font-serif text-sm font-bold tracking-wide text-white">
                          Dehn Al Oudh Royale
                        </p>
                        <p className="text-[10px] text-emerald-200/80 line-clamp-1">
                          12-Year Vintage Aged Assam Agarwood
                        </p>
                      </div>

                      <div className="relative z-10 my-2.5 w-full h-28 rounded-xl overflow-hidden shadow-md border border-emerald-500/30 bg-emerald-950/60 group/img">
                        <Image
                          src="/images/attar-spotlight.jpg"
                          alt="Pure Artisanal Attar Perfume Oil Flacon"
                          fill
                          sizes="240px"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#023129]/80 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <div className="relative z-10 pt-1">
                        <Link
                          href="/shop?sort=bestselling"
                          onClick={() => {
                            if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                            setIsShopOpen(false);
                          }}
                          className="inline-flex items-center justify-between w-full text-xs font-bold text-emerald-950 bg-[#F5B418] hover:bg-[#ffc32c] py-2 px-3 rounded-xl transition-all shadow-md group-hover:shadow-lg uppercase tracking-wider"
                        >
                          <span>Explore Bestsellers</span>
                          <ChevronRight className="w-3.5 h-3.5 text-emerald-950 stroke-[2.5]" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee Bar */}
              <div className="w-full border-t border-emerald-100/70 bg-neutral-50/90">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-5 text-xs text-neutral-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" /> 100% Certified Alcohol-Free
                    </span>
                    <span className="hidden md:inline-block text-emerald-300">•</span>
                    <span className="hidden md:flex items-center gap-1.5 font-medium">
                      <PackageCheck className="w-4 h-4 text-emerald-700" /> Free Shipping Over ₹999
                    </span>
                    <span className="hidden lg:inline-block text-emerald-300">•</span>
                    <span className="hidden lg:flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-4 h-4 text-emerald-700" /> Hand-poured Crystal Flacons
                    </span>
                  </div>

                  <Link
                    href="/shop"
                    onClick={() => {
                      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                      setIsShopOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-4 py-1.5 rounded-xl transition-all shadow-xs hover:shadow-md uppercase tracking-wider"
                  >
                    <span>Explore All Fragrances</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

      {/* HEADER SPACING OFFSET TO PREVENT CONTENT OVERLAP */}
      <div className="h-[82px] min-[360px]:h-[86px] sm:h-[92px] lg:h-[96px] xl:h-[102px] w-full shrink-0" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 2. OFF-CANVAS MOBILE DRAWER                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-[80] lg:hidden" aria-hidden={!isMobileNavOpen}>
            {/* Dark Frosted Luxury Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
              onClick={() => setIsMobileNavOpen(false)}
              aria-hidden="true"
            />

            {/* Aside Navigation Drawer */}
            <motion.aside
              variants={drawerLeftVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 w-[86vw] max-w-[360px] h-[100dvh] bg-white z-[85] shadow-2xl flex flex-col justify-between border-r border-emerald-100/90 overscroll-contain"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Drawer Top Header */}
              <div className="shrink-0 p-3.5 sm:p-4 border-b border-[#C9A227]/30 flex items-center justify-between bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-white shadow-xs relative">
                <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/50 to-transparent pointer-events-none" />
                {/* Mobile Drawer Brand Logo */}
                <Link
                  href="/"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex items-center group select-none py-1"
                  aria-label="Attar Depot Home"
                >
                  <Image
                    src="/images/logonew.png"
                    alt="Attar Depot - Pure Essence of Royalty"
                    width={300}
                    height={85}
                    priority
                    quality={95}
                    className="h-[52px] sm:h-[58px] w-auto object-contain drop-shadow-[0_2px_12px_rgba(245,180,24,0.4)] group-hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8.5 h-8.5 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-[#FAF8F2] hover:text-[#F5B418] flex items-center justify-center transition-all shadow-2xs active:scale-95 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
                {/* Primary Navigation - Atelier & Collections */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#012520] mb-1.5 px-1 font-serif flex items-center gap-1.5">
                    <Crown className="w-3 h-3 text-[#F5B418]" />
                    <span>Atelier & Collections</span>
                  </p>
                  {[
                    { name: 'Home', href: '/', icon: Home },
                    { name: 'All Perfumes', href: '/shop', icon: ShoppingBag },
                    { name: 'Royal Gifting', href: '/gifting', icon: Gift },
                    { name: 'Our Brand & Heritage', href: '/about', icon: Sparkles },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          router.push(item.href);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all text-left cursor-pointer active:scale-[0.98] ${
                          isActive
                            ? 'bg-[#012520] text-[#F5B418] font-bold border border-[#F5B418]/40 shadow-[0_2px_12px_rgba(1,37,32,0.25)]'
                            : 'text-neutral-700 hover:text-emerald-950 hover:bg-emerald-50/70 font-semibold border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center transition-colors ${
                              isActive
                                ? 'bg-[#F5B418] text-[#012520] shadow-2xs font-bold'
                                : 'bg-[#FAF8F2] border border-[#F5B418]/30 text-[#012520]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.name}</span>
                        </div>
                        <ChevronRight
                          className={`w-3.5 h-3.5 ${
                            isActive ? 'text-[#F5B418]' : 'text-neutral-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Secondary Navigation - Personal Sanctuary */}
                <div className="pt-2 border-t border-emerald-100/80 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#012520] mb-1.5 px-1 font-serif flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#F5B418]" />
                    <span>Your Sanctuary</span>
                  </p>
                  {[
                    { name: 'My Shopping Bag', href: '/cart', icon: ShoppingBag, isCart: true },
                    { name: 'My Wishlist', href: '/wishlist', icon: Heart, isWishlist: true },
                    { name: 'Track Orders', href: '/orders', icon: PackageCheck },
                    { name: 'Contact', href: '/contact', icon: Phone },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          if (item.isWishlist) {
                            dispatch(toggleWishlistDrawer(true));
                          } else if (item.isCart) {
                            dispatch(toggleCartDrawer(true));
                          } else {
                            router.push(item.href);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all text-left cursor-pointer active:scale-[0.98] ${
                          isActive
                            ? 'bg-[#012520] text-[#F5B418] font-bold border border-[#F5B418]/40 shadow-[0_2px_12px_rgba(1,37,32,0.25)]'
                            : 'text-neutral-700 hover:text-emerald-950 hover:bg-emerald-50/70 font-semibold border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7.5 h-7.5 rounded-xl flex items-center justify-center transition-colors ${
                              item.isWishlist
                                ? 'bg-rose-50 text-rose-600'
                                : item.isCart
                                ? 'bg-[#F5B418]/20 text-[#B8860B]'
                                : isActive
                                ? 'bg-[#F5B418] text-[#012520] shadow-2xs font-bold'
                                : 'bg-[#FAF8F2] border border-[#F5B418]/30 text-[#012520]'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.isWishlist && mounted && wishlistCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                              {wishlistCount}
                            </span>
                          )}
                          {item.isCart && mounted && itemsCount > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5B418]/25 text-[#012520] border border-[#F5B418]/50 shadow-2xs">
                              {itemsCount}
                            </span>
                          )}
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${
                              isActive ? 'text-[#F5B418]' : 'text-neutral-400'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* ========================================================= */}
                {/* SOCIAL MEDIA CHANNELS & COMMUNITY                         */}
                {/* ========================================================= */}
                <div className="rounded-2xl bg-gradient-to-br from-[#FAF8F2] via-white to-[#FDFBF7] border border-[#F5B418]/40 p-3.5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-serif text-xs font-bold text-[#012520] tracking-wide block">
                        Connect With Us
                      </span>
                      <p className="text-[10px] text-neutral-500 font-sans mt-0.5">
                        Follow our fragrance stories & daily reveals
                      </p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5B418]/20 text-[#012520] border border-[#F5B418]/40">
                      Official
                    </span>
                  </div>

                  {/* 2x2 Interactive Social Links Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-rose-50/60 border border-neutral-200/90 hover:border-[#E4405F]/50 transition-all duration-200 shadow-2xs group cursor-pointer active:scale-95"
                      aria-label="Follow Attar Depot on Instagram"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FD1D1D] via-[#E4405F] to-[#833AB4] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-neutral-800 group-hover:text-[#E4405F] block truncate transition-colors">
                          Instagram
                        </span>
                        <span className="text-[9.5px] text-neutral-400 block truncate">
                          @theattardepot
                        </span>
                      </div>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href="https://wa.me/919876543210?text=Salam%20%26%20Greetings!%20I%20am%20inquiring%20about%20Attar%20Depot%20pure%20perfume%20oils."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-emerald-50/60 border border-neutral-200/90 hover:border-[#25D366]/50 transition-all duration-200 shadow-2xs group cursor-pointer active:scale-95"
                      aria-label="Chat on WhatsApp"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-neutral-800 group-hover:text-emerald-700 block truncate transition-colors">
                          WhatsApp
                        </span>
                        <span className="text-[9.5px] text-neutral-400 block truncate">
                          Direct Concierge
                        </span>
                      </div>
                    </a>

                    {/* YouTube */}
                    <a
                      href="https://www.youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-rose-50/60 border border-neutral-200/90 hover:border-[#FF0000]/40 transition-all duration-200 shadow-2xs group cursor-pointer active:scale-95"
                      aria-label="Subscribe on YouTube"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FF0000] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Youtube className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-neutral-800 group-hover:text-[#FF0000] block truncate transition-colors">
                          YouTube
                        </span>
                        <span className="text-[9.5px] text-neutral-400 block truncate">
                          Fragrance Films
                        </span>
                      </div>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-xl bg-white hover:bg-blue-50/60 border border-neutral-200/90 hover:border-[#1877F2]/40 transition-all duration-200 shadow-2xs group cursor-pointer active:scale-95"
                      aria-label="Follow Attar Depot on Facebook"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1877F2] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Facebook className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-neutral-800 group-hover:text-[#1877F2] block truncate transition-colors">
                          Facebook
                        </span>
                        <span className="text-[9.5px] text-neutral-400 block truncate">
                          Official Page
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Footer (Auth & Info) */}
              <div className="shrink-0 p-4 border-t border-[#F5B418]/30 bg-gradient-to-b from-[#FAF8F2] to-white space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-lg">
                {!isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          dispatch(openAuthModal('login'));
                        }}
                        className="flex-1 py-2.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-[#F5B418] border border-[#F5B418]/50 shadow-[0_2px_12px_rgba(1,37,32,0.3)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          dispatch(openAuthModal('signup'));
                        }}
                        className="flex-1 py-2.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider border-2 border-[#F5B418]/60 text-[#012520] bg-white hover:bg-[#FAF8F2] active:scale-95 transition-all shadow-2xs cursor-pointer"
                      >
                        Register
                      </button>
                    </div>
                    <div className="text-center pt-0.5">
                      <a
                        href="/admin/login"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="text-[11px] text-neutral-500 hover:text-[#046A5A] font-medium transition-colors"
                      >
                        Store Admin / Merchant Access →
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 px-1">
                      <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-200 flex items-center justify-center font-bold text-xs shadow-2xs overflow-hidden">
                        {user?.avatar && !user.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : user?.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          'A'
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                        <p className="text-[10px] text-emerald-700 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex flex-col items-center justify-center gap-1 py-2 px-1 text-center text-[11px] font-semibold text-emerald-900 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors shadow-2xs"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="truncate">Profile</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          dispatch(toggleWishlistDrawer(true));
                        }}
                        className="flex flex-col items-center justify-center gap-1 py-2 px-1 text-center text-[11px] font-semibold text-emerald-900 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors shadow-2xs relative"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate">Wishlist</span>
                        {mounted && wishlistCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white">
                            {wishlistCount}
                          </span>
                        )}
                      </button>
                      <Link
                        href="/orders"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex flex-col items-center justify-center gap-1 py-2 px-1 text-center text-[11px] font-semibold text-emerald-900 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors shadow-2xs"
                      >
                        <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="truncate">Orders</span>
                      </Link>
                    </div>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="block py-2 text-center text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl font-bold"
                      >
                        Admin Portal
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileNavOpen(false);
                      }}
                      className="w-full text-center text-xs text-red-600 hover:underline py-1 font-medium"
                    >
                      Log Out
                    </button>
                  </div>
                )}

                {/* Location & Brand Motto */}
                <div className="pt-2 border-t border-emerald-100/80 flex items-center justify-between text-[11px] text-neutral-600">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-900 truncate font-medium">
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span className="truncate">Kannauj, UP - India</span>
                  </div>
                  <span className="text-[10px] text-[#046A5A] font-semibold tracking-wide">
                    100% Pure Attars
                  </span>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. MOBILE THUMB BOTTOM BAR (SOLID ROYAL EMERALD GREEN EXPERIENCE)          */}
      {/* ========================================================================= */}
      {!isProductDetail && (
      <nav
        className="fixed bottom-0 left-0 right-0 z-[120] lg:hidden bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] border-t border-[#C9A227]/40 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] rounded-t-[20px] pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 transition-all duration-300 select-none"
        aria-label="Mobile Bottom Navigation"
      >
        {/* Top ambient gold accent glow line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/90 to-transparent pointer-events-none opacity-90 shadow-[0_0_8px_#F5B418]" />

        <div className="relative grid grid-cols-5 h-13 max-w-md mx-auto items-center px-1.5">
          {/* 1. Home */}
          <Link
            href="/"
            onClick={() => {
              if (isSearchOpen) dispatch(toggleSearch(false));
            }}
            className="flex flex-col items-center justify-center py-0.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Navigate to Home"
          >
            <div
              className={`relative flex items-center justify-center w-8.5 h-6.5 rounded-xl transition-all duration-300 ${
                isHome && !isSearchOpen
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_10px_rgba(245,180,24,0.25)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Home
                className={`w-4 h-4 transition-all duration-300 ${
                  isHome && !isSearchOpen
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)] scale-105'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[9px] tracking-wide mt-0.5 transition-colors duration-200 ${
                isHome && !isSearchOpen
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Home
            </span>
            {isHome && !isSearchOpen && (
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_6px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </Link>

          {/* 2. Quick Search (Toggles search modal without hiding bottom bar) */}
          <button
            type="button"
            onClick={() => dispatch(toggleSearch(!isSearchOpen))}
            className="flex flex-col items-center justify-center py-0.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent] cursor-pointer"
            aria-label="Search fragrances"
          >
            <div
              className={`relative flex items-center justify-center w-8.5 h-6.5 rounded-xl transition-all duration-300 ${
                isSearchOpen
                  ? 'bg-[#F5B418]/25 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.45)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Search
                className={`w-4 h-4 transition-all duration-300 ${
                  isSearchOpen
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_8px_rgba(245,180,24,0.8)] scale-110'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[9px] tracking-wide mt-0.5 transition-colors duration-200 ${
                isSearchOpen
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.4)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Search
            </span>
            {isSearchOpen && (
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_8px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 3. Shop Vault (Center Elevated Imperial Medallion Action) */}
          <Link
            href="/shop"
            onClick={() => {
              if (isSearchOpen) dispatch(toggleSearch(false));
            }}
            className="flex flex-col items-center justify-center -mt-3.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none relative transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Navigate to Shop"
          >
            {/* Subtle compact gold glow */}
            <span className={`absolute -inset-0.5 rounded-full bg-[#F5B418]/25 blur-[3px] ${isShop && !isSearchOpen ? 'opacity-100' : 'opacity-60'} pointer-events-none`} />

            {/* Royal Gold Bezel Ring */}
            <div className={`relative p-[2px] rounded-full bg-gradient-to-b from-[#FFF0BA] via-[#F5B418] to-[#996D12] shadow-[0_4px_16px_rgba(245,180,24,0.5),0_2px_4px_rgba(0,0,0,0.5)] ring-1.5 ${isShop && !isSearchOpen ? 'ring-[#FFE28A]' : 'ring-[#F5B418]/40'} transition-all duration-300 group-hover:scale-105 group-active:scale-95`}>
              {/* Inner Medallion Disc */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#FFEAA0] via-[#F5B418] to-[#D99B12] flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Glass top reflection sheen */}
                <div className="absolute top-0 inset-x-0 h-[48%] bg-gradient-to-b from-white/70 to-transparent rounded-t-full pointer-events-none" />

                {/* Shop icon */}
                <ShoppingBag className="w-4 h-4 stroke-[2.6] text-[#012520] transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] relative z-10" />
              </div>
            </div>

            {/* Text Label */}
            <span className={`text-[9px] font-black uppercase tracking-[0.12em] mt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] transition-colors ${
              isShop && !isSearchOpen ? 'text-[#FFE28A] font-extrabold' : 'text-[#F5B418] group-hover:text-[#FFE28A]'
            }`}>
              Shop
            </span>
          </Link>

          {/* 4. Orders */}
          <Link
            href="/orders"
            onClick={() => {
              if (isSearchOpen) dispatch(toggleSearch(false));
            }}
            className="flex flex-col items-center justify-center py-0.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="View Orders"
          >
            <div
              className={`relative flex items-center justify-center w-8.5 h-6.5 rounded-xl transition-all duration-300 ${
                isOrders && !isSearchOpen
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_10px_rgba(245,180,24,0.25)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <PackageCheck
                className={`w-4 h-4 transition-all duration-300 ${
                  isOrders && !isSearchOpen
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)] scale-105'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[9px] tracking-wide mt-0.5 transition-colors duration-200 ${
                isOrders && !isSearchOpen
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Orders
            </span>
            {isOrders && !isSearchOpen && (
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_6px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </Link>

          {/* 5. Cart Bag */}
          <button
            type="button"
            onClick={() => {
              if (isSearchOpen) dispatch(toggleSearch(false));
              dispatch(toggleCartDrawer(true));
            }}
            className="flex flex-col items-center justify-center py-0.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent] cursor-pointer"
            aria-label="Open Cart"
          >
            <div
              className={`relative flex items-center justify-center w-8.5 h-6.5 rounded-xl transition-all duration-300 ${
                isCart
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_10px_rgba(245,180,24,0.25)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <ShoppingBag
                className={`w-4 h-4 transition-all duration-300 ${
                  isCart
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)] scale-105'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
              {mounted && itemsCount > 0 && (
                <span className="absolute -top-1 -right-1.5 flex h-3.5 min-w-[15px] px-0.5 items-center justify-center rounded-full bg-gradient-to-r from-[#F5B418] via-[#FFDF78] to-[#E5A412] text-[8.5px] font-black text-[#012520] shadow-[0_0_8px_rgba(245,180,24,0.8)] border border-[#012520] z-10">
                  {itemsCount}
                </span>
              )}
            </div>
            <span
              className={`text-[9px] tracking-wide mt-0.5 transition-colors duration-200 ${
                isCart
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Cart
            </span>
            {isCart && (
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_8px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </button>
        </div>
      </nav>
      )}
    </>
  );
}
