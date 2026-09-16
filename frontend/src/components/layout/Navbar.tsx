'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
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
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleCartDrawer, openAuthModal, toggleSearch } from '@/store/uiSlice';
import { logout, hydrateAuth } from '@/store/authSlice';
import { hydrateCart } from '@/store/cartSlice';
import { useCategories } from '@/hooks/useCategories';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { usePublicTaxonomy } from '@/hooks/useTaxonomy';
import { toast } from '@/lib/toast';
import AttarDepotLogo from '@/components/common/AttarDepotLogo';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { itemsCount } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated, isAdmin } = useAppSelector((state) => state.auth);

  const [mounted, setMounted] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const shopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      if (shopTimeoutRef.current) {
        clearTimeout(shopTimeoutRef.current);
      }
    };
  }, []);

  // Scroll detection state: transparent at top, blurred on scroll down
  const [isScrolled, setIsScrolled] = useState(false);
  const isHomePage = pathname === '/';
  const isTransparent = !isScrolled && isHomePage && !isShopOpen;

  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories();
  const { data: filterOptions } = useFilterOptions();
  const { data: taxonomy } = usePublicTaxonomy();

  const rawMegaNotes = (taxonomy?.notes && taxonomy.notes.length > 0)
    ? taxonomy.notes.map((n) => n.name)
    : (filterOptions?.notes ?? []);
  const megaNotes = rawMegaNotes.filter(
    (n) => n && n.trim() !== '' && n.toLowerCase() !== 'sex'
  );

  const megaGenders = filterOptions?.genders ?? ['Men', 'Women', 'Unisex'];

  const megaCollections = (taxonomy?.collections && taxonomy.collections.length > 0)
    ? taxonomy.collections.map((c) => c.name)
    : (filterOptions?.collections ?? []);

  const megaOccasions = (taxonomy?.occasions && taxonomy.occasions.length > 0)
    ? taxonomy.occasions.map((o) => o.name)
    : (filterOptions?.occasions ?? []);

  const megaPriceRanges = filterOptions?.priceRanges ?? [
    { label: 'Under ₹1999', value: 'under-1999', min: 0, max: 1999 },
    { label: '₹2000 – ₹2999', value: '2000-2999', min: 2000, max: 2999 },
    { label: '₹3000 – ₹3999', value: '3000-3999', min: 3000, max: 3999 },
    { label: '₹4000 – ₹4999', value: '4000-4999', min: 4000, max: 4999 },
    { label: '₹5000 – ₹5999', value: '5000-5999', min: 5000, max: 5999 },
  ];

  const GENDER_LABEL: Record<string, string> = {
    Men: "Men's Perfumes",
    Women: "Women's Perfumes",
    Unisex: 'Unisex Perfumes',
  };

  useEffect(() => {
    setMounted(true);
    dispatch(hydrateAuth());
    dispatch(hydrateCart());
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

  // Automatically dismiss mobile drawer when route changes
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileNavOpen]);

  // Smooth scroll hide/show listener
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Always show near the very top
      if (currentScrollY < 30) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling DOWN -> hide navbar smoothly
        if (!isMobileNavOpen && !isUserMenuOpen && !isShopOpen) {
          setIsNavVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current) {
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
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target as Node)
      ) {
        if (shopTimeoutRef.current) {
          clearTimeout(shopTimeoutRef.current);
        }
        setIsShopOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    toast.info('You have safely signed out of your account.', {
      title: 'Signed Out',
    });
    router.push('/');
  };

  return (
    <>
      <header
      className={`fixed top-0 left-0 right-0 z-40 w-full border-b border-emerald-100/80 bg-white/95 backdrop-blur-md shadow-xs transition-transform duration-350 ease-in-out ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >

      {/* Main Navigation Bar with Perfectly Balanced Mobile Layout */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1 sm:gap-4">
          {/* 1. LEFT SECTION: Desktop Navigation Links / Mobile Menu Trigger */}
          <div className="flex items-center justify-start flex-shrink-0 lg:flex-1">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-1.5 sm:p-2 text-emerald-900 hover:text-emerald-700 transition-colors lg:hidden rounded-xl hover:bg-emerald-50"
              aria-label="Toggle menu"
            >
              {isMobileNavOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
              <Link
                href="/"
                prefetch={true}
                onMouseEnter={() => closeShopDropdown(100)}
                className="text-xs font-semibold tracking-wider text-neutral-700 hover:text-emerald-700 transition-colors uppercase py-2"
              >
                Home
              </Link>

              {/* Dynamic Full-Width Shop Dropdown */}
              <div
                className="relative py-2"
                ref={shopDropdownRef}
                onMouseEnter={openShopDropdown}
                onMouseLeave={() => closeShopDropdown(250)}
              >
                <button
                  onClick={toggleShopDropdown}
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-700 hover:text-emerald-700 transition-colors uppercase"
                  aria-expanded={isShopOpen}
                >
                  <span>Shop</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isShopOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isShopOpen && (
                  <div
                    className="fixed left-0 right-0 w-full top-16 sm:top-20 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={openShopDropdown}
                    onMouseLeave={() => closeShopDropdown(250)}
                  >
                    {/* Full-width darkened backdrop covering the rest of the page */}
                    <div
                      className="fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-xs -z-10"
                      onClick={() => {
                        if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                        setIsShopOpen(false);
                      }}
                      aria-hidden="true"
                    />

                    {/* Edge-to-Edge Full-Width White Mega Menu Panel */}
                    <div className="w-full bg-white border-b border-emerald-100 shadow-[0_25px_60px_-15px_rgba(4,106,90,0.18)] overflow-hidden">
                      {/* Top Bar (Full Width) */}
                      <div className="w-full border-b border-emerald-100/80 bg-gradient-to-r from-emerald-50/90 via-emerald-50/40 to-emerald-50/90">
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                              Artisanal Fragrance Vault
                            </span>
                            <span className="hidden md:inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                              100% Pure & Alcohol-Free
                            </span>
                          </div>
                          <Link
                            href="/shop"
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 uppercase tracking-wider transition-colors flex items-center gap-1 group"
                          >
                            <span>View Entire Collection</span>
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* Main 6-Column Content Grid across full width container */}
                      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="grid grid-cols-6 gap-6 divide-x divide-emerald-50">

                          {/* Column 1: Notes */}
                          <div className="pr-4 space-y-2">
                            <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
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
                                    className="group flex items-center justify-between text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                  >
                                    <span>{note}</span>
                                    <ChevronRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                  </Link>
                                ))
                              ) : (
                                <p className="text-[11px] text-neutral-400 italic px-2">Loading notes...</p>
                              )}
                            </div>
                          </div>

                          {/* Column 2: Categories */}
                          <div className="px-4 space-y-2">
                            <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                              <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
                              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
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
                                  className="group flex items-center justify-between text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                >
                                  <span>{cat.name}</span>
                                  <ChevronRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                              ))}
                              {categories.length === 0 && (
                                <p className="text-[11px] text-neutral-400 italic px-2">Pure Attars</p>
                              )}
                            </div>
                          </div>

                          {/* Column 3: Gender & Formulation */}
                          <div className="px-4 space-y-2">
                            <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                              <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                By Gender
                              </p>
                            </div>
                            <div className="space-y-1">
                              {megaGenders.map((val) => (
                                <Link
                                  key={val}
                                  href={`/shop?gender=${val}`}
                                  onClick={() => {
                                    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                    setIsShopOpen(false);
                                  }}
                                  className="group flex items-center justify-between text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                >
                                  <span>{GENDER_LABEL[val] || val}</span>
                                  <ChevronRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                              ))}
                            </div>

                            {/* Formulation Type */}
                            <div className="pt-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 pb-1.5 border-b border-emerald-100 mb-1.5">
                                Formulation
                              </p>
                              <div className="space-y-1">
                                <Link
                                  href="/shop?type=pure-oil"
                                  onClick={() => {
                                    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                    setIsShopOpen(false);
                                  }}
                                  className="block text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                >
                                  Pure Attar Oils (Concentrated)
                                </Link>
                                <Link
                                  href="/shop?type=spray"
                                  onClick={() => {
                                    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                    setIsShopOpen(false);
                                  }}
                                  className="block text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                >
                                  Artisanal EDP Blends
                                </Link>
                              </div>
                            </div>
                          </div>

                          {/* Column 4: Collections */}
                          <div className="px-4 space-y-2">
                            <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                              <Crown className="w-3.5 h-3.5 text-emerald-700" />
                              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                Collections
                              </p>
                            </div>
                            <div className="space-y-1">
                              {megaCollections.length > 0 ? (
                                megaCollections.slice(0, 8).map((col) => (
                                  <Link
                                    key={col}
                                    href={`/shop?collection=${encodeURIComponent(col)}`}
                                    onClick={() => {
                                      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                      setIsShopOpen(false);
                                    }}
                                    className="group flex items-center justify-between text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                  >
                                    <span>{col}</span>
                                    <ChevronRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                  </Link>
                                ))
                              ) : (
                                <>
                                  <Link
                                    href="/shop?collection=Royal+Heritage"
                                    onClick={() => {
                                      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                      setIsShopOpen(false);
                                    }}
                                    className="block text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                  >
                                    Royal Heritage
                                  </Link>
                                  <Link
                                    href="/shop?collection=Daily+Luxury"
                                    onClick={() => {
                                      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                      setIsShopOpen(false);
                                    }}
                                    className="block text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                  >
                                    Daily Luxury
                                  </Link>
                                  <Link
                                    href="/shop?collection=Bridal+Edition"
                                    onClick={() => {
                                      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                      setIsShopOpen(false);
                                    }}
                                    className="block text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                  >
                                    Bridal Edition
                                  </Link>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Column 5: Price & Occasions */}
                          <div className="px-4 space-y-2">
                            <div className="flex items-center gap-1.5 pb-2 border-b border-emerald-100 mb-2">
                              <Compass className="w-3.5 h-3.5 text-emerald-700" />
                              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                                Shop By Price
                              </p>
                            </div>
                            <div className="space-y-1">
                              {megaPriceRanges.slice(0, 5).map(({ label, value }) => (
                                <Link
                                  key={value}
                                  href={`/shop?priceRange=${value}`}
                                  onClick={() => {
                                    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                    setIsShopOpen(false);
                                  }}
                                  className="group flex items-center justify-between text-xs text-neutral-600 hover:text-emerald-900 py-1 px-2 rounded-lg hover:bg-emerald-50/80 transition-all font-medium"
                                >
                                  <span>{label}</span>
                                  <ChevronRight className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                              ))}
                            </div>

                            {/* Occasions tags */}
                            <div className="pt-3">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 pb-1.5 border-b border-emerald-100 mb-2">
                                Occasions
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {(megaOccasions.length > 0 ? megaOccasions : ['Festive', 'Daily Wear', 'Evening', 'Gifting']).slice(0, 4).map((occ) => (
                                  <Link
                                    key={occ}
                                    href={`/shop?occasion=${encodeURIComponent(occ)}`}
                                    onClick={() => {
                                      if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                      setIsShopOpen(false);
                                    }}
                                    className="text-[11px] bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 px-2.5 py-1 rounded-md transition-colors font-medium border border-emerald-100/60"
                                  >
                                    {occ}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Column 6: Luxury Spotlight Card with Attar Perfume Image */}
                          <div className="pl-5 flex flex-col justify-between">
                            <div className="h-full rounded-2xl bg-gradient-to-br from-[#023129] via-[#034A3E] to-[#01221c] p-4 text-white shadow-xl relative overflow-hidden group flex flex-col justify-between border border-emerald-700/40">
                              <div className="absolute -right-10 -top-10 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all pointer-events-none" />
                              
                              {/* Top Badge & Header */}
                              <div className="relative z-10 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase bg-amber-400/20 text-amber-300 border border-amber-400/35 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                                    <Crown className="w-3 h-3 text-amber-300" /> Royal Blend
                                  </span>
                                  <span className="text-[9px] font-semibold text-emerald-300/80 uppercase tracking-wider">
                                    Artisanal
                                  </span>
                                </div>
                                <h4 className="font-serif text-sm font-bold tracking-wide text-white leading-snug pt-1">
                                  Pure Dehn Al Oud & Artisan Attars
                                </h4>
                              </div>

                              {/* Attar Perfume Image Frame */}
                              <div className="relative z-10 my-2.5 w-full h-32 rounded-xl overflow-hidden shadow-md border border-emerald-500/30 bg-emerald-950/60 group/img">
                                <Image
                                  src="/api/spotlight-image"
                                  alt="Pure Artisanal Attar Perfume Oil Flacon"
                                  fill
                                  unoptimized={true}
                                  sizes="260px"
                                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                  priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#023129]/80 via-transparent to-transparent pointer-events-none" />
                              </div>

                              {/* Description */}
                              <p className="relative z-10 text-[11px] text-emerald-100/75 leading-relaxed">
                                Distilled from premium aged agarwood and precious botanicals. 100% alcohol-free.
                              </p>

                              {/* Yellow Bestseller CTA Button */}
                              <div className="relative z-10 pt-3">
                                <Link
                                  href="/shop?sort=bestselling"
                                  onClick={() => {
                                    if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                    setIsShopOpen(false);
                                  }}
                                  className="inline-flex items-center justify-between w-full text-xs font-bold text-emerald-950 bg-[#F5B418] hover:bg-[#ffc32c] py-2.5 px-4 rounded-xl transition-all shadow-md group-hover:shadow-lg uppercase tracking-wider font-sans"
                                >
                                  <span>Explore Bestsellers</span>
                                  <ChevronRight className="w-4 h-4 text-emerald-950 stroke-[2.5]" />
                                </Link>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Bottom Bar (Full Width) */}
                      <div className="w-full border-t border-emerald-100/70 bg-neutral-50/90">
                        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
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
                            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 px-5 py-2 rounded-xl transition-all shadow-xs hover:shadow-md uppercase tracking-wider"
                          >
                            <span>Explore All Fragrances</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>


              <Link
                href="/about"
                prefetch={true}
                onMouseEnter={() => closeShopDropdown(100)}
                className="text-xs font-semibold tracking-wider text-neutral-700 hover:text-emerald-700 transition-colors uppercase py-2"
              >
                Heritage
              </Link>

              <Link
                href="/orders"
                prefetch={true}
                onMouseEnter={() => closeShopDropdown(100)}
                className="text-xs font-semibold tracking-wider text-neutral-700 hover:text-emerald-700 transition-colors uppercase py-2"
              >
                Orders
              </Link>
            </nav>
          </div>

          {/* 2. CENTER SECTION: Brand Logo (Responsive scaling, no overflow/overlap) */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center text-center px-1 sm:px-4 min-w-0">
            <Link href="/" className="group flex items-center gap-2 sm:gap-2.5 max-w-full">
              <AttarDepotLogo variant="icon" className="w-6 h-6 sm:w-8 sm:h-8 text-[#046A5A] group-hover:scale-105 transition-transform shrink-0 drop-shadow-xs" />
              <div className="flex flex-col items-start text-left">
                <span className="font-serif text-base xs:text-lg sm:text-2xl font-bold tracking-[0.12em] xs:tracking-[0.16em] text-emerald-gradient uppercase drop-shadow-sm truncate leading-tight">
                  Attar Depot
                </span>
                <span className="hidden xs:block text-[8px] sm:text-[9px] tracking-[0.18em] sm:tracking-[0.28em] text-emerald-800/80 font-sans font-medium uppercase group-hover:text-emerald-600 transition-colors truncate">
                  Pure Essence of Royalty
                </span>
              </div>
            </Link>
          </div>

          {/* 3. RIGHT SECTION: Search, User Profile, Cart */}
          <div className="flex items-center justify-end flex-shrink-0 lg:flex-1 gap-1 sm:gap-2 lg:gap-3">
            {/* Spotlight Center Search Modal Trigger */}
            <button
              onClick={() => dispatch(toggleSearch(true))}
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-full text-neutral-600 hover:text-emerald-950 hover:bg-emerald-50 sm:bg-neutral-50/90 sm:border sm:border-neutral-200/90 sm:hover:border-emerald-200 transition-all shadow-2xs group"
              aria-label="Search Fragrance Vault (Ctrl+K)"
              title="Search pure attars & flacons (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-emerald-700 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block text-xs text-neutral-500 group-hover:text-emerald-900 font-medium">
                Search scents...
              </span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold text-neutral-400 bg-white border border-neutral-200 rounded shadow-2xs group-hover:border-emerald-300">
                ⌘K
              </kbd>
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
                className="flex items-center gap-1.5 p-1.5 sm:p-2 text-neutral-700 hover:text-emerald-700 transition-colors rounded-full hover:bg-emerald-50"
                aria-label="User Account"
                suppressHydrationWarning
              >
                {mounted && isAuthenticated && user?.avatar && !user.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-emerald-300"
                  />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
                {mounted && isAuthenticated && user && (
                  <span className="hidden md:inline-block text-xs font-medium text-emerald-800 max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl glass-panel p-2.5 shadow-emerald-md border border-emerald-100 text-xs animate-in fade-in duration-150 bg-white/95 z-50">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-3 py-2 border-b border-emerald-50 mb-1">
                        <p className="font-bold text-neutral-800 truncate">{user.name}</p>
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
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-800 hover:bg-emerald-50 font-semibold"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-700" />
                        <span>My Profile & Addresses</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-700 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>Order History</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-left mt-1 border-t border-emerald-50 pt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-2 text-center">
                        <p className="text-[11px] text-neutral-600 mb-3">
                          Sign in to save your perfume vault & orders
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            dispatch(openAuthModal('login'));
                          }}
                          className="block w-full py-2 px-3 rounded-xl text-center text-xs uppercase font-bold tracking-wider btn-emerald mb-2 text-white"
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            dispatch(openAuthModal('signup'));
                          }}
                          className="block w-full py-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                        >
                          Create Account
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => dispatch(toggleCartDrawer(true))}
              className="relative p-1.5 sm:p-2 text-neutral-700 hover:text-emerald-700 transition-colors rounded-full hover:bg-emerald-50"
              aria-label="View Shopping Cart"
              suppressHydrationWarning
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && itemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#046A5A] text-[9px] font-bold text-white shadow-xs">
                  {itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Spacer to offset fixed header height so page content is not hidden behind it */}
    <div className="h-16 sm:h-20 w-full flex-shrink-0" aria-hidden="true" />

    {/* ========================================================================= */}

    {/* 4. PREMIUM OFF-CANVAS MOBILE DRAWER & BACKDROP (PORTALLED TO BODY)         */}
    {/* ========================================================================= */}
    {mounted && typeof document !== 'undefined' && createPortal(
      <div
        className={`fixed inset-0 z-[80] lg:hidden transition-all duration-300 ${
          isMobileNavOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
        aria-hidden={!isMobileNavOpen}
      >
        {/* Frosted Luxury Backdrop */}
        <div
          className={`fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            isMobileNavOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileNavOpen(false)}
          aria-hidden="true"
        />

        {/* Luxury Off-Canvas Aside Drawer Panel */}
        <aside
          className={`fixed inset-y-0 left-0 w-[88%] max-w-[360px] h-[100dvh] bg-white z-[85] shadow-2xl flex flex-col justify-between border-r border-emerald-100/90 transform transition-transform duration-300 ease-out overscroll-contain ${
            isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
        >
          {/* Drawer Header (Fixed at Top) */}
          <div className="flex-shrink-0 p-4 sm:p-5 border-b border-emerald-100/90 flex items-center justify-between bg-gradient-to-r from-[#ECFDF5] via-white to-[#ECFDF5]/60 shadow-xs">
            <Link
              href="/"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#046A5A] to-[#023F36] flex items-center justify-center text-[#FAF8F2] shadow-emerald-sm border border-emerald-500/20 p-1.5 shrink-0">
                <AttarDepotLogo variant="icon" className="w-full h-full text-[#FAF8F2]" />
              </div>
              <div>
                <span className="font-serif text-base font-bold tracking-[0.16em] text-emerald-gradient uppercase block leading-tight">
                  Attar Depot
                </span>
                <span className="text-[9px] tracking-[0.28em] text-emerald-800 font-sans uppercase block">
                  Pure Royal Essence
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(false)}
              className="w-9 h-9 rounded-full bg-white border border-emerald-200/80 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-900 flex items-center justify-center transition-all shadow-2xs active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body (Smooth momentum scroll, no trapped scrollbars) */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-6">
            {/* Quick Search Trigger (Opens Center Search Modal) */}
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

            {/* Main Store Navigation Links */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-800/80 mb-2 px-1">
                Store Navigation
              </p>
              {[
                { name: 'Home', href: '/', icon: Home },
                { name: 'All Perfume Flacons', href: '/shop', icon: ShoppingBag },
                { name: 'Heritage & Alchemy', href: '/about', icon: Sparkles },
                { name: 'Track Royal Orders', href: '/orders', icon: PackageCheck },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center justify-between p-2.5 rounded-2xl text-xs transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs'
                        : 'text-neutral-700 hover:text-emerald-900 hover:bg-emerald-50/70 font-semibold border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                          isActive
                            ? 'bg-emerald-700 text-white shadow-2xs'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span>{item.name}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 ${
                        isActive ? 'text-emerald-700' : 'text-neutral-400'
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* Dynamic Categories Section */}
            <div className="space-y-2 pt-3 border-t border-emerald-100/80">
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-900 font-sans">
                  Dynamic Collections
                </p>
                <span className="text-[9px] text-emerald-800 bg-[#ECFDF5] border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {categories.length} Curated
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    href={`/shop?category=${c.slug}`}
                    onClick={() => setIsMobileNavOpen(false)}
                    className="group flex items-center gap-3 p-2 rounded-2xl text-xs text-neutral-800 hover:text-emerald-900 hover:bg-emerald-50/90 transition-all border border-emerald-100/70 bg-white hover:border-emerald-300 shadow-2xs"
                  >
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 border border-emerald-100 flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src={
                          c.image ||
                          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=200'
                        }
                        alt={c.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-neutral-900 group-hover:text-emerald-800 truncate">
                        {c.name}
                      </p>
                      {c.description && (
                        <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                          {c.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>

              <Link
                href="/shop"
                onClick={() => setIsMobileNavOpen(false)}
                className="block text-center py-2 text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 bg-emerald-50/80 rounded-xl hover:bg-emerald-100 transition-colors mt-2"
              >
                View All Fragrance Oils →
              </Link>
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

          {/* Drawer Footer (Fixed at Bottom with Safe Area) */}
          <div className="flex-shrink-0 p-4 border-t border-emerald-100/90 bg-[#FAF8F2]/90 space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
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
                    className="flex-1 py-2.5 rounded-2xl text-center text-xs font-bold uppercase tracking-wider border border-emerald-300 text-emerald-900 bg-white hover:bg-emerald-50 transition-colors"
                  >
                    Register
                  </button>
                </div>
                <div className="text-center pt-1">
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
                      'P'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-emerald-700 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 text-center text-xs font-semibold text-emerald-900 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors shadow-2xs"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsMobileNavOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 text-center text-xs font-semibold text-emerald-900 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors shadow-2xs"
                  >
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>My Orders</span>
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

            {/* Location & Social Icons */}
            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-neutral-600">
              <div className="flex items-center gap-1 text-[10px] text-emerald-900 truncate font-medium">
                <MapPin className="w-3 h-3 text-emerald-700 flex-shrink-0" />
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
      </div>,
      document.body
    )}
  </>
);
}
