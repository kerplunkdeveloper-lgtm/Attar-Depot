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
  const isCart = pathname === '/cart';

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
        {/* MAIN NAVIGATION BAR */}
        <div className="w-full bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] backdrop-blur-xl border-b border-[#C9A227]/25 shadow-[0_8px_30px_rgba(1,37,32,0.45)] relative">
          {/* Subtle bottom gold ambient glow line */}
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/45 to-transparent pointer-events-none" />

          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 gap-2 sm:gap-4">
              {/* ================================================================= */}
              {/* 1. LEFT SECTION: Mobile Trigger & Official Brand Logo             */}
              {/* ================================================================= */}
              <div className="flex items-center justify-start gap-2 sm:gap-4 shrink-0">
                {/* Mobile menu trigger button */}
                <button
                  onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                  className="p-2 -ml-1 text-[#FAF8F2] hover:text-[#F5B418] transition-all lg:hidden rounded-xl hover:bg-white/10 active:scale-95 border border-white/10"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileNavOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>

                {/* Brand Official Logo Image (Positioned First on Left) */}
                <Link
                  href="/"
                  className="group flex items-center justify-start py-1 select-none"
                  aria-label="Attar Depot Home"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Attar Depot - Pure Essence of Royalty"
                    width={320}
                    height={100}
                    priority
                    className="h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 w-auto object-contain drop-shadow-[0_4px_20px_rgba(245,180,24,0.4)] group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                  />
                </Link>
              </div>

              {/* ================================================================= */}
              {/* 2. CENTER SECTION: Desktop Navigation Menu Bar                    */}
              {/* ================================================================= */}
              <div className="hidden lg:flex items-center justify-center flex-1 px-2 xl:px-4">
                <nav className="flex items-center space-x-1 xl:space-x-2 bg-white/[0.04] py-1.5 px-3 rounded-full border border-white/[0.08] backdrop-blur-md shadow-inner">
                  {/* Home Link */}
                  <Link
                    href="/"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs font-semibold tracking-wider uppercase py-1.5 px-3.5 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isHome
                        ? 'text-[#F5B418] font-bold bg-white/10 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.18)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {isHome && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0" />
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
                      className={`relative flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase py-1.5 px-3.5 rounded-full transition-all duration-200 ${
                        isShop || isShopOpen
                          ? 'text-[#F5B418] font-bold bg-white/10 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.18)]'
                          : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                      }`}
                      aria-expanded={isShopOpen}
                    >
                      {(isShop || isShopOpen) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0" />
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

                  {/* Heritage Link */}
                  <Link
                    href="/about"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs font-semibold tracking-wider uppercase py-1.5 px-3.5 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isAbout
                        ? 'text-[#F5B418] font-bold bg-white/10 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.18)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {isAbout && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0" />
                    )}
                    <span>About Us</span>
                  </Link>

                  {/* Gifting Link */}
                  <Link
                    href="/gifting"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs font-semibold tracking-wider uppercase py-1.5 px-3.5 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isGifting
                        ? 'text-[#F5B418] font-bold bg-white/10 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.18)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {isGifting && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0" />
                    )}
                    <span>Gifting</span>
                  </Link>

                  {/* Orders Link */}
                  <Link
                    href="/orders"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-xs font-semibold tracking-wider uppercase py-1.5 px-3.5 rounded-full transition-all duration-200 group flex items-center gap-1.5 ${
                      isOrders
                        ? 'text-[#F5B418] font-bold bg-white/10 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.18)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {isOrders && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0" />
                    )}
                    <span>Orders</span>
                  </Link>
                </nav>
              </div>

              {/* ================================================================= */}
              {/* 3. RIGHT SECTION: Search, User Profile, Cart (Others)             */}
              {/* ================================================================= */}
              <div className="flex items-center justify-end shrink-0 gap-1.5 sm:gap-2.5 lg:gap-3">

                {/* 📍 Delivery City Badge — Desktop only, shown when location is detected */}
                {mounted && deliveryCity && (
                  <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 backdrop-blur-sm shadow-[0_0_10px_rgba(16,185,129,0.2)] cursor-default group transition-all hover:border-emerald-400/60">
                    <LocateFixed className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
                    <span className="text-[10px] font-semibold text-emerald-300 whitespace-nowrap">
                      Delivering to: <span className="text-white font-bold">{deliveryCity}</span>
                    </span>
                  </div>
                )}
                {/* Responsive Luxury Search Bar / Modal Trigger */}
                <button
                  onClick={() => dispatch(toggleSearch(true))}
                  className="flex items-center justify-center sm:justify-between w-9 h-9 sm:w-36 md:w-44 lg:w-52 xl:w-64 sm:h-10 sm:px-3.5 rounded-full text-[#FAF8F2]/80 hover:text-[#FAF8F2] bg-white/5 sm:bg-black/25 hover:bg-black/40 border border-white/10 sm:border-emerald-600/30 sm:hover:border-[#F5B418]/60 transition-all shadow-inner group cursor-pointer"
                  aria-label="Search Fragrance Vault"
                  title="Search pure attars & flacons (Ctrl+K)"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Search className="w-4 h-4 text-[#F5B418] group-hover:scale-110 transition-transform shrink-0 drop-shadow-[0_0_6px_rgba(245,180,24,0.4)]" />
                    <span className="hidden sm:inline-block text-xs text-[#FAF8F2]/60 group-hover:text-[#FAF8F2]/90 transition-colors truncate font-normal">
                      <span className="hidden xl:inline">Search pure attars, oudh, musk...</span>
                      <span className="xl:hidden">Search scents...</span>
                    </span>
                  </div>
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#F5B418] bg-white/10 border border-white/15 rounded shadow-2xs group-hover:border-[#F5B418]/50 group-hover:text-[#F5B418] transition-colors shrink-0 ml-1">
                    ⌘K
                  </kbd>
                </button>

                {/* Wishlist Vault Trigger */}
                <button
                  onClick={() => dispatch(toggleWishlistDrawer(true))}
                  className="relative p-1.5 sm:p-2 text-[#FAF8F2]/90 hover:text-[#F5B418] transition-colors rounded-full hover:bg-white/10 border border-transparent hover:border-white/10 group cursor-pointer"
                  aria-label="Royal Wishlist Vault"
                  title={`Royal Wishlist (${wishlistCount})`}
                  suppressHydrationWarning
                >
                  <Heart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110 group-active:scale-90" />
                  {mounted && wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-[#F5B418] text-[9px] font-black text-white shadow-[0_0_8px_rgba(244,63,94,0.6)] border border-[#012520] animate-in zoom-in-50">
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
                    className="flex items-center gap-1.5 p-1.5 sm:p-2 text-[#FAF8F2]/90 hover:text-[#F5B418] transition-colors rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
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
                        className="w-6 h-6 rounded-full object-cover border border-[#F5B418]"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5" />
                    )}
                    {mounted && isAuthenticated && user && (
                      <span className="hidden md:inline-block text-xs font-semibold text-[#FAF8F2] max-w-[85px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                    )}
                  </button>

                  {/* Desktop User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl glass-panel p-2.5 shadow-emerald-md border border-emerald-100 text-xs animate-in fade-in duration-150 bg-white/98 z-50">
                      {isAuthenticated && user ? (
                        <>
                          <div className="px-3 py-2 border-b border-emerald-50 mb-1">
                            <p className="font-bold text-neutral-900 truncate">{user.name}</p>
                            <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                            {isAdmin && (
                              <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold tracking-wider">
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
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-left mt-1 border-t border-emerald-50 pt-2 transition-colors font-semibold"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <div className="p-2 text-center space-y-2">
                          <p className="text-[11px] text-neutral-600">
                            Sign in to access your royal vault & order tracking
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              dispatch(openAuthModal('login'));
                            }}
                            className="block w-full py-2 px-3 rounded-xl text-center text-xs uppercase font-bold tracking-wider btn-emerald text-white shadow-emerald-sm"
                          >
                            Sign In
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              dispatch(openAuthModal('signup'));
                            }}
                            className="block w-full py-1 text-xs text-emerald-800 hover:text-emerald-950 font-semibold transition-colors"
                          >
                            Create Account
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={() => dispatch(toggleCartDrawer(true))}
                  className="relative p-1.5 sm:p-2 text-[#FAF8F2]/90 hover:text-[#F5B418] transition-colors rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
                  aria-label="View Shopping Cart"
                  suppressHydrationWarning
                >
                  <ShoppingBag className="w-5 h-5" />
                  {mounted && itemsCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#F5B418] text-[9px] font-black text-[#012520] shadow-[0_0_8px_rgba(245,180,24,0.6)] border border-[#012520]">
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
              className="fixed inset-0 top-16 sm:top-20 lg:top-24 bg-neutral-950/60 backdrop-blur-xs -z-10 transition-opacity"
              onClick={() => {
                if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                setIsShopOpen(false);
              }}
              aria-hidden="true"
            />

            {/* Edge-to-Edge Mega Menu Panel */}
            <div className="w-full bg-white border-b border-[#C9A227]/30 shadow-[0_35px_80px_-15px_rgba(1,37,32,0.35)] overflow-y-auto max-h-[calc(100vh-4.5rem)] sm:max-h-[calc(100vh-5.5rem)] lg:max-h-[calc(100vh-6.5rem)]">
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
      <div className="h-16 sm:h-20 lg:h-24 w-full shrink-0" aria-hidden="true" />

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
              <div className="shrink-0 p-3.5 sm:p-4 border-b border-[#C9A227]/25 flex items-center justify-between bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-white shadow-xs">
                <Link
                  href="/"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex items-center group select-none py-1"
                  aria-label="Attar Depot Home"
                >
                  <Image
                    src="/images/logo.png"
                    alt="Attar Depot - Pure Essence of Royalty"
                    width={180}
                    height={55}
                    priority
                    className="h-12 sm:h-13 w-auto object-contain drop-shadow-[0_2px_10px_rgba(245,180,24,0.35)] group-hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-[#FAF8F2] hover:text-[#F5B418] flex items-center justify-center transition-all shadow-2xs active:scale-95"
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
                    { name: 'My Wishlist', href: '/wishlist', icon: Heart, isWishlist: true },
                    { name: 'Gifting', href: '/gifting', icon: Gift },
                    { name: 'About Us', href: '/about', icon: Sparkles },
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
                          } else {
                            router.push(item.href);
                          }
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all text-left ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200/90 shadow-2xs'
                            : 'text-neutral-700 hover:text-emerald-950 hover:bg-emerald-50/70 font-semibold border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                              item.isWishlist
                                ? 'bg-rose-50 text-rose-600'
                                : isActive
                                ? 'bg-emerald-700 text-white shadow-2xs'
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
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${
                              isActive ? 'text-emerald-700' : 'text-neutral-400'
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
      <nav
        className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] border-t border-[#C9A227]/50 shadow-[0_-12px_40px_rgba(0,0,0,0.85)] rounded-t-[26px] pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2.5 transition-all duration-300 select-none"
        aria-label="Mobile Bottom Navigation"
      >
        {/* Top ambient gold accent glow line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418] to-transparent pointer-events-none opacity-90 shadow-[0_0_10px_#F5B418]" />

        <div className="relative grid grid-cols-5 h-16 max-w-md mx-auto items-center px-2">
          {/* 1. Home */}
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-1 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Navigate to Home"
          >
            <div
              className={`relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-300 ${
                isHome
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.3)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Home
                className={`w-5 h-5 transition-all duration-300 ${
                  isHome
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_8px_rgba(245,180,24,0.7)] scale-110'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-wide mt-1 transition-colors duration-200 ${
                isHome
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Home
            </span>
            {isHome && (
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_8px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </Link>

          {/* 2. Quick Search */}
          <button
            type="button"
            onClick={() => dispatch(toggleSearch(true))}
            className="flex flex-col items-center justify-center py-1 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Search fragrances"
          >
            <div
              className={`relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-300 ${
                isSearchOpen
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.3)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <Search
                className={`w-5 h-5 transition-all duration-300 ${
                  isSearchOpen
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_8px_rgba(245,180,24,0.7)] scale-110'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-wide mt-1 transition-colors duration-200 ${
                isSearchOpen
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
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
            className="flex flex-col items-center justify-center -mt-6 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none relative transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Navigate to Shop"
          >
            {/* Ambient pulsating gold aura halo */}
            <span className={`absolute -inset-1.5 rounded-full bg-[#F5B418]/35 blur-xs ${isShop ? 'animate-pulse opacity-100' : 'animate-gold-halo'} pointer-events-none`} />

            {/* Royal Gold Bezel Ring */}
            <div className={`relative p-[2.5px] rounded-full bg-gradient-to-b from-[#FFF0BA] via-[#F5B418] to-[#996D12] shadow-[0_8px_25px_rgba(245,180,24,0.65),0_2px_4px_rgba(0,0,0,0.6)] ring-2 ${isShop ? 'ring-[#FFE28A]' : 'ring-[#F5B418]/40'} transition-all duration-300 group-hover:scale-105 group-active:scale-95`}>
              {/* Inner Medallion Disc */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#FFEAA0] via-[#F5B418] to-[#D99B12] flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Glass top reflection sheen */}
                <div className="absolute top-0 inset-x-0 h-[48%] bg-gradient-to-b from-white/70 to-transparent rounded-t-full pointer-events-none" />

                {/* Shop icon */}
                <ShoppingBag className="w-5 h-5 stroke-[2.8] text-[#012520] transition-transform duration-300 group-hover:scale-110 group-active:scale-95 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] relative z-10" />
              </div>
            </div>

            {/* Text Label */}
            <span className={`text-[9.5px] font-black uppercase tracking-[0.14em] mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] transition-colors ${
              isShop ? 'text-[#FFE28A] font-extrabold' : 'text-[#F5B418] group-hover:text-[#FFE28A]'
            }`}>
              Shop
            </span>
          </Link>

          {/* 4. Orders */}
          <Link
            href="/orders"
            className="flex flex-col items-center justify-center py-1 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="View Orders"
          >
            <div
              className={`relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-300 ${
                isOrders
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.3)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <PackageCheck
                className={`w-5 h-5 transition-all duration-300 ${
                  isOrders
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_8px_rgba(245,180,24,0.7)] scale-110'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
            </div>
            <span
              className={`text-[10px] tracking-wide mt-1 transition-colors duration-200 ${
                isOrders
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Orders
            </span>
            {isOrders && (
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_8px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </Link>

          {/* 5. Cart Bag */}
          <button
            type="button"
            onClick={() => dispatch(toggleCartDrawer(true))}
            className="flex flex-col items-center justify-center py-1 group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 select-none transition-transform duration-200 active:scale-95 [-webkit-tap-highlight-color:transparent]"
            aria-label="Open Cart"
          >
            <div
              className={`relative flex items-center justify-center w-10 h-8 rounded-2xl transition-all duration-300 ${
                isCart
                  ? 'bg-[#F5B418]/15 border border-[#F5B418]/40 shadow-[0_0_12px_rgba(245,180,24,0.3)]'
                  : 'text-[#FAF8F2]/75 group-hover:text-[#F5B418] group-hover:bg-white/[0.06] border border-transparent'
              }`}
            >
              <ShoppingBag
                className={`w-5 h-5 transition-all duration-300 ${
                  isCart
                    ? 'stroke-[2.4] text-[#F5B418] drop-shadow-[0_0_8px_rgba(245,180,24,0.7)] scale-110'
                    : 'stroke-[1.8] group-hover:scale-105'
                }`}
              />
              {mounted && itemsCount > 0 && (
                <>
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[18px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-[#F5B418] via-[#FFDF78] to-[#E5A412] text-[9.5px] font-black text-[#012520] shadow-[0_0_12px_rgba(245,180,24,0.85)] border border-[#012520] ring-1 ring-[#F5B418]/60 animate-bounce-subtle z-10">
                    {itemsCount}
                  </span>
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[18px] rounded-full bg-[#F5B418] animate-ping opacity-40 pointer-events-none" />
                </>
              )}
            </div>
            <span
              className={`text-[10px] tracking-wide mt-1 transition-colors duration-200 ${
                isCart
                  ? 'font-bold text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.3)]'
                  : 'font-medium text-[#FAF8F2]/75 group-hover:text-[#F5B418]'
              }`}
            >
              Cart
            </span>
            {isCart && (
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFE28A] shadow-[0_0_8px_#F5B418] mt-0.5 animate-pulse" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
