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
import { toast } from '@/lib/toast';
import api from '@/lib/api';
import { getQueryClient } from '@/components/providers/Providers';
import { detectCityForNavbar } from '@/hooks/useGeolocation';

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
  const [mobileAccordion, setMobileAccordion] = useState<string | null>('categories');
  const [deliveryCity, setDeliveryCity] = useState<string | null>(null);

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

  const toggleAccordion = (section: string) => {
    setMobileAccordion((prev) => (prev === section ? null : section));
  };

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateAuth());
    dispatch(hydrateCart());
    dispatch(hydrateWishlist());
    // Silently detect city for delivery badge (won't trigger permission popup on its own)
    detectCityForNavbar()
      .then((city) => { if (city) setDeliveryCity(city); })
      .catch(() => {});
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
          className={`w-full bg-[#EBEBEB] text-neutral-800 select-none transition-all duration-300 ease-in-out overflow-hidden ${
            isAtTop
              ? 'max-h-10 opacity-100 border-b border-neutral-300'
              : 'max-h-0 opacity-0 -translate-y-full border-b-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-8 sm:h-9 flex items-center justify-center text-center">
            <div className="flex items-center justify-center text-[11.5px] sm:text-[12px] font-medium text-neutral-800 tracking-wide">
              <span>Celebrate. Gift. Delight.</span>
              <span className="mx-1 text-sm select-none" role="img" aria-label="gift">🎁</span>
              <span className="text-neutral-400 mx-1.5 sm:mx-2 font-normal">|</span>
              <Link
                href="/gifting"
                className="font-bold text-neutral-900 hover:text-emerald-800 group inline-flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
              >
                <span className="hidden sm:inline">Explore Our Gifting Collection</span>
                <span className="sm:hidden">Explore Gifting</span>
                <ArrowRight className="w-3 h-3 text-[#C9A227] group-hover:translate-x-0.5 group-hover:text-emerald-800 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN NAVIGATION BAR */}
        <div className="w-full bg-gradient-to-r from-[#012520]/95 via-[#023830]/95 to-[#012520]/95 backdrop-blur-xl border-b border-[#C9A227]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
          {/* Subtle top & bottom gold ambient glow lines */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/25 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418]/50 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[68px] sm:h-[76px] lg:h-[88px] gap-2 sm:gap-4">
              {/* ================================================================= */}
              {/* 1. LEFT SECTION: Mobile Trigger & Official Brand Logo             */}
              {/* ================================================================= */}
              <div className="flex items-center justify-start gap-2 sm:gap-3 shrink-0">
                {/* Mobile menu trigger button */}
                <button
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="w-10 h-10 rounded-xl text-[#FAF8F2] hover:text-[#F5B418] transition-all lg:hidden flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/10 shadow-2xs"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileNavOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>

                {/* Brand Official Logo Image (Positioned First on Left) */}
                <Link
                  href="/"
                  className="group flex items-center justify-start py-1 select-none transition-transform duration-300 active:scale-[0.98]"
                  aria-label="Attar Depot Home"
                >
                  <Image
                    src="/images/logonew.png"
                    alt="Attar Depot - Pure Essence of Royalty"
                    width={400}
                    height={120}
                    priority
                    quality={95}
                    className="h-[46px] sm:h-[56px] md:h-[62px] lg:h-[68px] xl:h-[74px] w-auto object-contain drop-shadow-[0_4px_16px_rgba(245,180,24,0.35)] group-hover:scale-105 group-hover:drop-shadow-[0_6px_22px_rgba(245,180,24,0.55)] group-hover:brightness-110 transition-all duration-300"
                  />
                </Link>
              </div>

              {/* ================================================================= */}
              {/* 2. CENTER SECTION: Desktop Navigation Menu Bar                    */}
              {/* ================================================================= */}
              <div className="hidden lg:flex items-center justify-center flex-1 px-2 xl:px-4">
                <nav className="flex items-center space-x-1 xl:space-x-1.5 bg-black/30 py-2 px-3.5 xl:px-4 rounded-full border border-emerald-500/25 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.25)]">
                  {/* Home Link */}
                  <Link
                    href="/"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs xl:text-[12.5px] font-semibold tracking-[0.1em] uppercase py-2 px-4 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isHome
                        ? 'text-[#F5B418] font-bold bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.25)]'
                        : 'text-[#FAF8F2]/80 hover:text-[#F5B418] hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {isHome && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0 animate-pulse" />
                    )}
                    <span>Home</span>
                  </Link>

                  {/* Shop Dropdown Trigger */}
                  <div
                    className="relative py-1"
                    ref={shopDropdownRef}
                    onMouseEnter={openShopDropdown}
                    onMouseLeave={() => closeShopDropdown(250)}
                  >
                    <button
                      onClick={toggleShopDropdown}
                      className={`relative flex items-center gap-1.5 text-xs xl:text-[12.5px] font-semibold tracking-[0.1em] uppercase py-2 px-4 rounded-full transition-all duration-200 cursor-pointer ${
                        isShop || isShopOpen
                          ? 'text-[#F5B418] font-bold bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.25)]'
                          : 'text-[#FAF8F2]/80 hover:text-[#F5B418] hover:bg-white/[0.08] border border-transparent'
                      }`}
                      aria-expanded={isShopOpen}
                    >
                      {(isShop || isShopOpen) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0 animate-pulse" />
                      )}
                      <span>Shop</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-250 ${
                          isShopOpen
                            ? 'rotate-180 text-[#F5B418]'
                            : isShop
                            ? 'text-[#F5B418]'
                            : 'text-[#FAF8F2]/60 group-hover:text-[#F5B418]'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Gifting Link */}
                  <Link
                    href="/gifting"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs xl:text-[12.5px] font-semibold tracking-[0.1em] uppercase py-2 px-4 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isGifting
                        ? 'text-[#F5B418] font-bold bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.25)]'
                        : 'text-[#FAF8F2]/80 hover:text-[#F5B418] hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {isGifting && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0 animate-pulse" />
                    )}
                    <Gift className="w-3.5 h-3.5 text-[#F5B418]/80 group-hover:text-[#F5B418]" />
                    <span>Gifting</span>
                  </Link>

                  {/* About Us Link */}
                  <Link
                    href="/about"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs xl:text-[12.5px] font-semibold tracking-[0.1em] uppercase py-2 px-4 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isAbout
                        ? 'text-[#F5B418] font-bold bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.25)]'
                        : 'text-[#FAF8F2]/80 hover:text-[#F5B418] hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {isAbout && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0 animate-pulse" />
                    )}
                    <span>About Us</span>
                  </Link>

                  {/* Contact Us Link */}
                  <Link
                    href="/contact"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs xl:text-[12.5px] font-semibold tracking-[0.1em] uppercase py-2 px-4 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isContact
                        ? 'text-[#F5B418] font-bold bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.25)]'
                        : 'text-[#FAF8F2]/80 hover:text-[#F5B418] hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {isContact && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0 animate-pulse" />
                    )}
                    <Phone className="w-3.5 h-3.5 text-[#F5B418]/80 group-hover:text-[#F5B418]" />
                    <span>Contact Us</span>
                  </Link>
                </nav>
              </div>

              {/* ================================================================= */}
              {/* 3. RIGHT SECTION: Search, User Profile, Cart (Others)             */}
              {/* ================================================================= */}
              <div className="flex items-center justify-end shrink-0 gap-1.5 sm:gap-2 lg:gap-2.5">

                {/* 📍 Delivery City Badge — Desktop only, shown when location is detected */}
                {mounted && deliveryCity && (
                  <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 backdrop-blur-md shadow-2xs cursor-default group transition-all hover:border-[#F5B418]/50">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-200 whitespace-nowrap">
                      Delivering to: <span className="text-white font-bold">{deliveryCity}</span>
                    </span>
                  </div>
                )}

                {/* Search Modal Trigger (Icon Only) */}
                <button
                  onClick={() => dispatch(toggleSearch(true))}
                  className="relative w-9.5 h-9.5 sm:w-10 sm:h-10 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#F5B418]/50 group cursor-pointer backdrop-blur-md active:scale-95 shadow-2xs"
                  aria-label="Search Fragrance Vault"
                  title="Search pure attars & flacons (Ctrl+K)"
                >
                  <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
                </button>

                {/* Wishlist Vault Trigger */}
                <button
                  onClick={() => dispatch(toggleWishlistDrawer(true))}
                  className="relative w-9.5 h-9.5 sm:w-10 sm:h-10 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#F5B418]/50 group cursor-pointer backdrop-blur-md active:scale-95 shadow-2xs"
                  aria-label="Royal Wishlist Vault"
                  title={`Royal Wishlist (${wishlistCount})`}
                  suppressHydrationWarning
                >
                  <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-[#F5B418] text-[9px] font-black text-white shadow-[0_0_8px_rgba(244,63,94,0.6)] border border-[#012520] animate-in zoom-in-50">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* User Profile / Auth Modal Trigger */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        dispatch(openAuthModal('login'));
                      } else {
                        setIsUserMenuOpen(!isUserMenuOpen);
                      }
                    }}
                    className="flex items-center gap-2 h-9.5 sm:h-10 px-3 sm:px-3.5 text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#F5B418]/50 backdrop-blur-md active:scale-95 shadow-2xs cursor-pointer"
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
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full object-cover border border-[#F5B418]"
                      />
                    ) : (
                      <UserIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}
                    {mounted && isAuthenticated && user ? (
                      <span className="hidden md:inline-block text-xs font-semibold text-[#FAF8F2] max-w-[85px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                    ) : (
                      <span className="hidden md:inline-block text-xs font-semibold text-[#FAF8F2]/80 uppercase tracking-wider">
                        Sign In
                      </span>
                    )}
                  </button>

                  {/* Desktop User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl glass-panel p-2.5 shadow-2xl border border-emerald-100/90 text-xs animate-in fade-in duration-150 bg-white/98 z-50">
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
                    </div>
                  )}
                </div>

                {/* Cart Drawer Trigger — Hidden in mobile view, visible on sm and up */}
                <button
                  onClick={() => dispatch(toggleCartDrawer(true))}
                  className="relative hidden sm:flex w-9.5 h-9.5 sm:w-10 sm:h-10 items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#F5B418]/50 group cursor-pointer backdrop-blur-md active:scale-95 shadow-2xs"
                  aria-label="View Shopping Cart"
                  suppressHydrationWarning
                >
                  <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:scale-110" />
                  {mounted && itemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFDF78] text-[9px] font-black text-[#012520] shadow-[0_0_8px_rgba(245,180,24,0.7)] border border-[#012520] ring-1 ring-[#F5B418]/60 animate-in zoom-in-50">
                      {itemsCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1.1 EDGE-TO-EDGE FULL-WIDTH MEGA MENU DROPDOWN PANEL (100% VIEWPORT)      */}
        {/* ========================================================================= */}
        {isShopOpen && (
          <div
            ref={megaMenuRef}
            className="w-full left-0 right-0 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={openShopDropdown}
            onMouseLeave={() => closeShopDropdown(250)}
          >
            {/* Dark Frosted Luxury Backdrop */}
            <div
              className={`fixed inset-0 bg-neutral-950/65 backdrop-blur-xs -z-10 transition-all duration-300 ${
                isAtTop
                  ? 'top-[100px] sm:top-[112px] lg:top-[124px]'
                  : 'top-[68px] sm:top-[76px] lg:top-[88px]'
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
                  ? 'max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-112px)] lg:max-h-[calc(100vh-124px)]'
                  : 'max-h-[calc(100vh-68px)] sm:max-h-[calc(100vh-76px)] lg:max-h-[calc(100vh-88px)]'
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
          </div>
        )}
      </header>

      {/* HEADER SPACING OFFSET TO PREVENT CONTENT OVERLAP */}
      <div className="h-[100px] sm:h-[112px] lg:h-[124px] w-full shrink-0" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 2. OFF-CANVAS MOBILE DRAWER                                              */}
      {/* ========================================================================= */}
      <div
        className={`fixed inset-0 z-[80] lg:hidden transition-all duration-300 ${
          isMobileNavOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!isMobileNavOpen}
      >
            {/* Dark Frosted Luxury Backdrop */}
            <div
              className={`fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
                isMobileNavOpen ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setIsMobileNavOpen(false)}
              aria-hidden="true"
            />

            {/* Aside Navigation Drawer */}
            <aside
              className={`fixed inset-y-0 left-0 w-[86vw] max-w-[360px] h-[100dvh] bg-white z-[85] shadow-2xl flex flex-col justify-between border-r border-emerald-100/90 transform transition-transform duration-300 ease-out overscroll-contain ${
                isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
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
                    width={280}
                    height={80}
                    priority
                    quality={95}
                    className="h-12 sm:h-14 w-auto object-contain drop-shadow-[0_2px_12px_rgba(245,180,24,0.4)] group-hover:scale-105 transition-transform"
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
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5">
                {/* Interactive Search Modal Trigger Bar */}
                <div
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    dispatch(toggleSearch(true));
                  }}
                  className="relative cursor-pointer group"
                >
                  <div className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF8F2] border border-emerald-200/90 rounded-2xl text-neutral-400 font-sans shadow-2xs flex items-center group-hover:border-emerald-500 transition-colors">
                    <span>Search pure oudh, musk, flacons...</span>
                  </div>
                  <Search className="w-4 h-4 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
                </div>

                {/* Primary Navigation Links */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/80 mb-1.5 px-1">
                    Store Navigation
                  </p>
                  {[
                    { name: 'Home', href: '/', icon: Home },
                    { name: 'All Perfumes', href: '/shop', icon: ShoppingBag },
                    { name: 'My Cart', href: '/cart', icon: ShoppingBag, isCart: true },
                    { name: 'My Wishlist', href: '/wishlist', icon: Heart, isWishlist: true },
                    { name: 'Gifting', href: '/gifting', icon: Gift },
                    { name: 'About Us', href: '/about', icon: Sparkles },
                    { name: 'Contact Us', href: '/contact', icon: Phone },
                    { name: 'Track Order', href: '/orders', icon: PackageCheck },
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
                            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                              item.isWishlist
                                ? 'bg-rose-50 text-rose-600'
                                : item.isCart
                                ? 'bg-[#F5B418]/20 text-[#B8860B]'
                                : isActive
                                ? 'bg-[#F5B418] text-[#012520] shadow-2xs font-bold'
                                : 'bg-emerald-50 text-emerald-800'
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
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F5B418]/20 text-[#B8860B] border border-[#F5B418]/40">
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

                {/* ============================================================= */}
                {/* INTERACTIVE ACCORDIONS: CATEGORIES, GENDER, NOTES, COLLECTIONS */}
                {/* ============================================================= */}
                <div className="pt-2 border-t border-emerald-100/80 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900/80 px-1">
                    Explore Fragrance Vault
                  </p>

                  {/* 1. Categories Accordion */}
                  <div className="border border-emerald-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('categories')}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-neutral-800 bg-neutral-50/70 hover:bg-emerald-50/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                        Curated Categories ({categories.length})
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${
                          mobileAccordion === 'categories' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {mobileAccordion === 'categories' && (
                      <div className="p-2 space-y-1 bg-white animate-in fade-in duration-150">
                        {categories.map((c) => (
                          <Link
                            key={c._id}
                            href={`/shop?category=${c.slug}`}
                            onClick={() => setIsMobileNavOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl text-xs text-neutral-700 hover:text-emerald-950 hover:bg-emerald-50 transition-all font-medium"
                          >
                            <span>{c.name}</span>
                            <ChevronRight className="w-3 h-3 text-neutral-400" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 2. Occasions Accordion */}
                  <div className="border border-emerald-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('occasions')}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-neutral-800 bg-neutral-50/70 hover:bg-emerald-50/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Gift className="w-3.5 h-3.5 text-emerald-700" />
                        Shop By Occasion ({megaOccasions.length > 0 ? megaOccasions.length : 4})
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${
                          mobileAccordion === 'occasions' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {mobileAccordion === 'occasions' && (
                      <div className="p-2 space-y-1 bg-white animate-in fade-in duration-150">
                        {(megaOccasions.length > 0
                          ? megaOccasions
                          : ['Daily Wear', 'Special Occasion', 'Evening Wear', 'Gifting']
                        ).map((occ) => (
                          <Link
                            key={occ}
                            href={`/shop?occasion=${encodeURIComponent(occ)}`}
                            onClick={() => setIsMobileNavOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl text-xs text-neutral-700 hover:text-emerald-950 hover:bg-emerald-50 transition-all font-medium"
                          >
                            <span>{occ}</span>
                            <ChevronRight className="w-3 h-3 text-neutral-400" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. Fragrance Notes Accordion */}
                  <div className="border border-emerald-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('notes')}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-neutral-800 bg-neutral-50/70 hover:bg-emerald-50/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                        Signature Notes ({megaNotes.length})
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${
                          mobileAccordion === 'notes' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {mobileAccordion === 'notes' && (
                      <div className="p-2.5 flex flex-wrap gap-1.5 bg-white animate-in fade-in duration-150">
                        {megaNotes.slice(0, 12).map((note) => (
                          <Link
                            key={note}
                            href={`/shop?notes=${encodeURIComponent(note)}`}
                            onClick={() => setIsMobileNavOpen(false)}
                            className="text-[11px] bg-emerald-50 hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg font-medium border border-emerald-200/70 transition-colors"
                          >
                            {note}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Price Ranges Accordion */}
                  <div className="border border-emerald-100 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleAccordion('price')}
                      className="w-full flex items-center justify-between p-3 text-xs font-bold text-neutral-800 bg-neutral-50/70 hover:bg-emerald-50/50 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-emerald-700" />
                        Shop By Price
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-emerald-700 transition-transform duration-200 ${
                          mobileAccordion === 'price' ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {mobileAccordion === 'price' && (
                      <div className="p-2 space-y-1 bg-white animate-in fade-in duration-150">
                        {megaPriceRanges.map(({ label, value }) => (
                          <Link
                            key={value}
                            href={`/shop?priceRange=${value}`}
                            onClick={() => setIsMobileNavOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl text-xs text-neutral-700 hover:text-emerald-950 hover:bg-emerald-50 transition-all font-medium"
                          >
                            <span>{label}</span>
                            <ChevronRight className="w-3 h-3 text-neutral-400" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Fragrance Concierge Card */}
                <div className="rounded-2xl bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]/60 border border-emerald-200/90 p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Royal Concierge Service</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 leading-relaxed font-sans">
                    Need scent recommendations or bespoke blending assistance? Our perfumers are available online.
                  </p>
                  <a
                    href="https://wa.me/919876543210?text=Salam%20%26%20Greetings!%20I%20am%20inquiring%20about%20Attar%20Depot%20pure%20perfume%20oils%20and%20bespoke%20royal%20fragrances."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold uppercase tracking-wider shadow-2xs transition-all active:scale-98"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Drawer Bottom Footer (Auth & Info) */}
              <div className="shrink-0 p-4 border-t border-emerald-100/90 bg-[#FAF8F2]/90 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {!isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          dispatch(openAuthModal('login'));
                        }}
                        className="flex-1 py-2.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider btn-emerald text-white shadow-emerald-sm"
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          dispatch(openAuthModal('signup'));
                        }}
                        className="flex-1 py-2.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider border border-emerald-300 text-emerald-950 bg-white hover:bg-emerald-50 transition-colors"
                      >
                        Register
                      </button>
                    </div>
                    <div className="text-center pt-0.5">
                      <a
                        href="/admin/login"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="text-[11px] text-neutral-500 hover:text-emerald-800 font-medium transition-colors"
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

                {/* Location & Social Links */}
                <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-neutral-600">
                  <div className="flex items-center gap-1 text-[10px] text-emerald-900 truncate font-medium">
                    <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span className="truncate">Kannauj, UP - India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://www.instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white text-neutral-600 hover:text-[#E4405F] border border-emerald-200/80 flex items-center justify-center transition-all shadow-2xs hover:scale-110"
                      title="Follow Attar Depot on Instagram"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-3 h-3" />
                    </a>
                    <a
                      href="https://www.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-white text-neutral-600 hover:text-[#1877F2] border border-emerald-200/80 flex items-center justify-center transition-all shadow-2xs hover:scale-110"
                      title="Follow Attar Depot on Facebook"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </aside>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE THUMB BOTTOM BAR (SOLID ROYAL EMERALD GREEN EXPERIENCE)          */}
      {/* ========================================================================= */}
      {!isProductDetail && (
      <nav
        className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] border-t border-[#C9A227]/40 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] rounded-t-[20px] pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 transition-all duration-300 select-none"
        aria-label="Mobile Bottom Navigation"
      >
        {/* Top ambient gold accent glow line */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/90 to-transparent pointer-events-none opacity-90 shadow-[0_0_8px_#F5B418]" />

        <div className="relative grid grid-cols-5 h-13 max-w-md mx-auto items-center px-1.5">
          {/* 1. Home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-0.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Navigate to Home"
          >
            <div
              className={`relative flex items-center justify-center w-8.5 h-6.5 rounded-xl transition-all duration-300 ${
                isHome
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_10px_rgba(245,180,24,0.25)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Home
                className={`w-4 h-4 transition-all duration-300 ${
                  isHome
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)] scale-105'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[9px] tracking-wide mt-0.5 transition-colors duration-200 ${
                isHome
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Home
            </span>
            {isHome && (
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_6px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </Link>

          {/* 2. Quick Search */}
          <button
            type="button"
            onClick={() => dispatch(toggleSearch(true))}
            className="flex flex-col items-center justify-center py-0.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent] cursor-pointer"
            aria-label="Search fragrances"
          >
            <div
              className={`relative flex items-center justify-center w-8.5 h-6.5 rounded-xl transition-all duration-300 ${
                isSearchOpen
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_10px_rgba(245,180,24,0.25)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Search
                className={`w-4 h-4 transition-all duration-300 ${
                  isSearchOpen
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)] scale-105'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[9px] tracking-wide mt-0.5 transition-colors duration-200 ${
                isSearchOpen
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Search
            </span>
            {isSearchOpen && (
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_8px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </button>

          {/* 3. Shop Vault (Center Elevated Imperial Medallion Action) */}
          <Link
            href="/shop"
            className="flex flex-col items-center justify-center -mt-3.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none relative transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Navigate to Shop"
          >
            {/* Subtle compact gold glow */}
            <span className={`absolute -inset-0.5 rounded-full bg-[#F5B418]/25 blur-[3px] ${isShop ? 'opacity-100' : 'opacity-60'} pointer-events-none`} />

            {/* Royal Gold Bezel Ring */}
            <div className={`relative p-[2px] rounded-full bg-gradient-to-b from-[#FFF0BA] via-[#F5B418] to-[#996D12] shadow-[0_4px_16px_rgba(245,180,24,0.5),0_2px_4px_rgba(0,0,0,0.5)] ring-1.5 ${isShop ? 'ring-[#FFE28A]' : 'ring-[#F5B418]/40'} transition-all duration-300 group-hover:scale-105 group-active:scale-95`}>
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
              isShop ? 'text-[#FFE28A] font-extrabold' : 'text-[#F5B418] group-hover:text-[#FFE28A]'
            }`}>
              Shop
            </span>
          </Link>

          {/* 4. Orders */}
          <Link
            href="/orders"
            className="flex flex-col items-center justify-center py-0.5 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="View Orders"
          >
            <div
              className={`relative flex items-center justify-center w-8.5 h-6.5 rounded-xl transition-all duration-300 ${
                isOrders
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_10px_rgba(245,180,24,0.25)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <PackageCheck
                className={`w-4 h-4 transition-all duration-300 ${
                  isOrders
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)] scale-105'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[9px] tracking-wide mt-0.5 transition-colors duration-200 ${
                isOrders
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Orders
            </span>
            {isOrders && (
              <span className="w-1 h-1 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_6px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </Link>

          {/* 5. Cart Bag */}
          <button
            type="button"
            onClick={() => dispatch(toggleCartDrawer(true))}
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
