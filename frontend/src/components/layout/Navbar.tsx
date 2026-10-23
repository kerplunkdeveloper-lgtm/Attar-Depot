'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
  Briefcase,
  LocateFixed,
  Heart,
  Phone,
  Copy,
  Check,
  TicketPercent,
  Star,
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
import { SITE_CONTACT } from '@/config/siteContact';
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
  const { isSearchOpen, isCartDrawerOpen, isWishlistDrawerOpen, isAuthModalOpen } = useAppSelector(
    (state) => state.ui
  );

  const [mounted, setMounted] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileShopExpanded, setIsMobileShopExpanded] = useState(true);
  const [mobileShopTab, setMobileShopTab] = useState<'categories' | 'notes' | 'occasions' | 'collections' | 'price'>('categories');
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatar]);

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
  const mobileUserDropdownRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories();
  const { data: filterOptions } = useFilterOptions();
  const { data: taxonomy } = usePublicTaxonomy();

  const megaNotes = useMemo(() => {
    const set = new Set<string>();
    if (filterOptions?.notes && Array.isArray(filterOptions.notes)) {
      filterOptions.notes.forEach((n) => {
        if (n && typeof n === 'string' && n.trim()) set.add(n.trim());
      });
    }
    if (taxonomy?.notes && Array.isArray(taxonomy.notes)) {
      taxonomy.notes.forEach((n) => {
        if (n?.name && typeof n.name === 'string' && n.name.trim()) set.add(n.name.trim());
      });
    }
    const list = Array.from(set).filter((n) => n.toLowerCase() !== 'sex');
    if (list.length > 0) {
      return list.sort((a, b) => a.localeCompare(b));
    }
    return [
      'Amber',
      'Ambergris',
      'Ambroxan',
      'Apple',
      'Aquatic notes',
      'Calabrian bergamot',
      'Cardamom',
      'Cedarwood',
      'Citrus',
      'Cumin',
      'Floral',
      'Fresh & Aquatic',
      'Fruity',
      'Jasmine',
      'Musk',
      'Oudh/Agarwood',
      'Patchouli',
      'Rose',
      'Saffron',
      'Sandalwood',
      'Sichuan pepper',
      'Spicy',
      'Sweet',
      'Vanilla',
      'Woody',
    ].sort((a, b) => a.localeCompare(b));
  }, [filterOptions?.notes, taxonomy?.notes]);

  const megaCollections = useMemo(() => {
    const set = new Set<string>();
    if (taxonomy?.collections && Array.isArray(taxonomy.collections)) {
      taxonomy.collections.forEach((c) => {
        if (c?.name && typeof c.name === 'string' && c.name.trim()) set.add(c.name.trim());
      });
    }
    if (filterOptions?.collections && Array.isArray(filterOptions.collections)) {
      filterOptions.collections.forEach((c) => {
        if (c && typeof c === 'string' && c.trim()) set.add(c.trim());
      });
    }
    const list = Array.from(set);
    return list.length > 0
      ? list
      : ['Royal Heritage', 'Daily Luxury', 'Bridal Edition', 'Vintage Oud', 'Untold Stories', 'Artisan Series'];
  }, [taxonomy?.collections, filterOptions?.collections]);

  const megaOccasions = useMemo(() => {
    const set = new Set<string>();
    if (taxonomy?.occasions && Array.isArray(taxonomy.occasions)) {
      taxonomy.occasions.forEach((o) => {
        if (o?.name && typeof o.name === 'string' && o.name.trim()) set.add(o.name.trim());
      });
    }
    if (filterOptions?.occasions && Array.isArray(filterOptions.occasions)) {
      filterOptions.occasions.forEach((o) => {
        if (o && typeof o === 'string' && o.trim()) set.add(o.trim());
      });
    }
    const list = Array.from(set);
    return list.length > 0
      ? list
      : [
          'Daily Wear',
          'Evening Wear',
          'Special Occasions',
          'Festive & Bridal',
          'Office Wear',
          'Date',
          'Party',
          'Summer Wear',
          'Winter Wear',
          'Gym Wear',
        ];
  }, [taxonomy?.occasions, filterOptions?.occasions]);

  const megaPriceRanges = filterOptions?.priceRanges ?? [
    { label: 'Under ₹1999', value: 'under-1999', min: 0, max: 1999 },
    { label: '₹2000 – ₹2999', value: '2000-2999', min: 2000, max: 2999 },
    { label: '₹3000 – ₹3999', value: '3000-3999', min: 3000, max: 3999 },
    { label: '₹4000 – ₹4999', value: '4000-4999', min: 4000, max: 4999 },
    { label: '₹5000 – ₹5999', value: '5000-5999', min: 5000, max: 5999 },
  ];

  // Resolve direct category link matching database categories
  const resolveCategoryHref = useCallback(
    (item: { title: string; desc: string }) => {
      const cleanTitle = item.title.toLowerCase().replace(/&/g, '').trim();
      const cleanDesc = item.desc.replace(/[()]/g, '').toLowerCase().trim();

      // 1. Direct name or slug match in live categories
      const matched = categories.find((c) => {
        if (!c) return false;
        const cName = (c.name || '').toLowerCase();
        const cSlug = (c.slug || '').toLowerCase();

        return (
          cName.includes(cleanTitle) ||
          cleanTitle.includes(cName) ||
          cSlug === cleanTitle.replace(/\s+/g, '-') ||
          (cleanDesc && (cName.includes(cleanDesc) || cSlug.includes(cleanDesc)))
        );
      });
      if (matched) {
        return `/shop?category=${encodeURIComponent(matched.slug || matched._id)}`;
      }

      // 2. Olfactory Family / Descriptor fallback mapping to live categories
      const findCatByKeyword = (kw: string) => {
        return categories.find((c) => {
          const s = (c.slug || '').toLowerCase();
          const n = (c.name || '').toLowerCase();
          return s.includes(kw) || n.includes(kw);
        });
      };

      if (cleanTitle.includes('oud') || cleanTitle.includes('woody') || cleanDesc.includes('oud')) {
        const cat = findCatByKeyword('oud');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=dehn-al-oudh';
      }

      if (cleanTitle.includes('musk') || cleanDesc.includes('skin') || cleanDesc.includes('clean')) {
        const cat = findCatByKeyword('musk');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=royal-musk';
      }

      if (cleanTitle.includes('floral') || cleanTitle.includes('rose') || cleanDesc.includes('feminine')) {
        const cat = findCatByKeyword('floral') || findCatByKeyword('rose') || findCatByKeyword('gulab');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=floral-gulab-attar';
      }

      if (cleanTitle.includes('amber') || cleanTitle.includes('oriental') || cleanDesc.includes('arabic')) {
        const cat = findCatByKeyword('amber') || findCatByKeyword('oriental');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=amber-woods';
      }

      if (cleanTitle.includes('sweet') || cleanTitle.includes('gourmand') || cleanDesc.includes('delicious')) {
        const cat = findCatByKeyword('oriental') || findCatByKeyword('french');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=french-oriental-blends';
      }

      if (cleanTitle.includes('fresh') || cleanTitle.includes('aquatic') || cleanDesc.includes('blue')) {
        const cat = findCatByKeyword('french') || findCatByKeyword('fresh');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=french-oriental-blends';
      }

      if (cleanTitle.includes('leather') || cleanDesc.includes('dark') || cleanDesc.includes('bold')) {
        const cat = findCatByKeyword('oud');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=dehn-al-oudh';
      }

      if (cleanTitle.includes('green') || cleanTitle.includes('earthy') || cleanDesc.includes('herbal')) {
        const cat = findCatByKeyword('amber') || findCatByKeyword('woods');
        if (cat) return `/shop?category=${encodeURIComponent(cat.slug || cat._id)}`;
        return '/shop?category=amber-woods';
      }

      if (categories.length > 0 && categories[0]) {
        return `/shop?category=${encodeURIComponent(categories[0].slug || categories[0]._id)}`;
      }

      return '/shop';
    },
    [categories]
  );

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
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
      const clickedInsideDesktop = userDropdownRef.current?.contains(target);
      const clickedInsideMobile = mobileUserDropdownRef.current?.contains(target);
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
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
  const isCorporateGifting = pathname === '/corporate-gifting';
  const isContact = pathname === '/contact';
  const isFaq = pathname === '/faq';
  const isCart = pathname === '/cart';
  const isProductDetail = pathname.startsWith('/product/');

  const userDropdownMenuContent = (
    <AnimatePresence>
      {isUserMenuOpen && (
        <motion.div
          key="user-dropdown"
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -6 }}
          transition={{ duration: 0.18, ease: luxuryEase }}
          className="absolute right-0 top-full mt-2 w-68 max-w-[calc(100vw-1.5rem)] rounded-2xl p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-[#C9A227]/40 text-xs bg-white text-slate-800 z-50 ring-1 ring-black/5"
        >
          {isAuthenticated && user ? (
            <>
              <div className="px-3 py-2.5 border-b border-emerald-100 bg-emerald-50/60 rounded-xl mb-1.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden border border-[#C9A227]/40">
                  {user.avatar && !avatarError && !user.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      onError={() => setAvatarError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-neutral-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  {isAdmin && (
                    <span className="inline-block mt-0.5 text-[9.5px] bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full font-bold tracking-wider border border-emerald-200">
                      Store Admin
                    </span>
                  )}
                </div>
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
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-neutral-700 hover:bg-emerald-50 hover:text-emerald-900 font-medium transition-colors text-left cursor-pointer"
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
                type="button"
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
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. FIXED TOP HEADER WRAPPER                                              */}
      {/* ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-transform duration-300 ease-in-out ${
          isNavVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* TOP UTILITY & PROMO ANNOUNCEMENT BAR (ONLY VISIBLE AT THE VERY TOP OF THE PAGE) */}
        <div
          className={`w-full bg-[#FBF4E3] text-neutral-800 select-none transition-all duration-300 ease-in-out overflow-hidden ${
            isAtTop
              ? 'max-h-16 opacity-100 '
              : 'max-h-0 opacity-0 -translate-y-full border-b-0 pointer-events-none'
          }`}
        >
          <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 xl:px-10 min-h-[26px] sm:h-9 py-0.5 sm:py-0 flex items-center justify-center text-center overflow-hidden">
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
        <div className="w-full relative">
          {/* Royal Perfumery Panoramic Background with greenbgnew.jpeg */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
            <Image
              src="/images/greenbgnew.jpeg"
              alt="Navbar Background"
              fill
              priority
              quality={90}
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Subtle glassmorphic depth & ambient lighting to highlight royal emerald texture */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 0%, rgba(1, 28, 22, 0.25) 100%)',
              }}
            />
            {/* Top & bottom 24k gold hairline borders */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418]/60 to-transparent" />
          </div>

          <div className="max-w-8xl mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 relative z-10">
            <div className="relative flex items-center justify-between h-[86px] min-[360px]:h-[92px] xs:h-[96px] sm:h-[98px] lg:h-[84px] xl:h-[88px] gap-1.5 min-[360px]:gap-2 sm:gap-4">
              
              {/* ================================================================= */}
              {/* 1. LEFT SECTION: Brand Logo (Desktop & Mobile) + Mobile Hamburger  */}
              {/* ================================================================= */}
              <div className="flex items-center justify-start gap-1.5 min-[360px]:gap-2.5 sm:gap-3 shrink-0 z-20">
                {/* Mobile menu trigger button */}
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsMobileNavOpen(!isMobileNavOpen);
                  }}
                  className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl text-[#FAF8F2] hover:text-[#F5B418] transition-all lg:hidden flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.12] active:scale-95 border border-white/10 shadow-2xs cursor-pointer shrink-0"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileNavOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </button>

                {/* Brand Official Logo (Left-aligned, Crisp, Perfectly Proportioned) */}
                <Link
                  href="/"
                  className="relative flex items-center py-1 select-none"
                  aria-label="Attar Depot Home"
                >
                  <Image
                    src="/images/logonew.png"
                    alt="Attar Depot - Pure Essence of Royalty"
                    width={420}
                    height={130}
                    priority
                    quality={100}
                    className="h-[52px] min-[360px]:h-[58px] xs:h-[64px] sm:h-[70px] md:h-[74px] lg:h-[74px] xl:h-[78px] w-auto max-w-[200px] min-[360px]:max-w-[230px] xs:max-w-[260px] sm:max-w-[290px] md:max-w-[320px] lg:max-w-[340px] xl:max-w-[380px] object-contain drop-shadow-[0_2px_14px_rgba(245,180,24,0.35)] relative z-10 hover:opacity-95 transition-all duration-300"
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
                <nav className="flex items-center gap-1.5 xl:gap-2 bg-[#011C16]/90 px-2 py-1.5 xl:px-2.5 xl:py-1.5 rounded-full border border-[#F5B418]/45 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(245,180,24,0.25)]">
                  {/* Home Link (Iconic Golden Pill when active) */}
                  <Link
                    href="/"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[10px] xl:text-[10.5px] font-bold tracking-[0.05em] uppercase py-1 px-2.5 xl:px-3 rounded-full transition-all duration-200 group flex items-center gap-1 whitespace-nowrap ${
                      isHome
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {isHome && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] shadow-[0_0_6px_#F5B418] shrink-0 animate-pulse" />
                    )}
                    <span className="text-[10px] xl:text-[10.5px]">Home</span>
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
                      className={`relative flex items-center gap-1 text-[10px] xl:text-[10.5px] font-bold tracking-[0.05em] uppercase py-1 px-2.5 xl:px-3 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
                        isShop || isShopOpen
                          ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                          : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                      }`}
                      aria-expanded={isShopOpen}
                    >
                      <span className="text-[10px] xl:text-[10.5px]">Shop</span>
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
                    className={`relative text-[10px] xl:text-[10.5px] font-bold tracking-[0.05em] uppercase py-1 px-2.5 xl:px-3 rounded-full transition-all duration-200 group flex items-center gap-1 whitespace-nowrap ${
                      isGifting
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[10px] xl:text-[10.5px]">Gifting</span>
                  </Link>

                  {/* Corporate Gifting Link */}
                  <Link
                    href="/corporate-gifting"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[10px] xl:text-[10.5px] font-bold tracking-[0.05em] uppercase py-1 px-2.5 xl:px-3 rounded-full transition-all duration-200 group flex items-center gap-1 whitespace-nowrap ${
                      isCorporateGifting
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[10px] xl:text-[10.5px]">Corporate Gifting</span>
                  </Link>

                  {/* Our Brand Link */}
                  <Link
                    href="/about"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[10px] xl:text-[10.5px] font-bold tracking-[0.05em] uppercase py-1 px-2.5 xl:px-3 rounded-full transition-all duration-200 group flex items-center gap-1 whitespace-nowrap ${
                      isAbout
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[10px] xl:text-[10.5px]">Our Brand</span>
                  </Link>

                  {/* Contact Link */}
                  <Link
                    href="/contact"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[10px] xl:text-[10.5px] font-bold tracking-[0.05em] uppercase py-1 px-2.5 xl:px-3 rounded-full transition-all duration-200 group flex items-center gap-1 whitespace-nowrap ${
                      isContact
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[10px] xl:text-[10.5px]">Contact</span>
                  </Link>

                  {/* FAQ Link */}
                  <Link
                    href="/faq"
                    prefetch={true}
                    onMouseEnter={() => closeShopDropdown(100)}
                    className={`relative text-[10px] xl:text-[10.5px] font-bold tracking-[0.05em] uppercase py-1 px-2.5 xl:px-3 rounded-full transition-all duration-200 group flex items-center gap-1 whitespace-nowrap ${
                      isFaq
                        ? 'text-[#FAF8F2] bg-gradient-to-r from-[#F5B418]/30 via-[#F5B418]/20 to-[#F5B418]/30 border border-[#F5B418] shadow-[0_0_12px_rgba(245,180,24,0.35)]'
                        : 'text-[#FAF8F2]/85 hover:text-[#F5B418] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <span className="text-[10px] xl:text-[10.5px]">FAQ</span>
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
              <div className="flex items-center justify-end shrink-0 gap-1 sm:gap-2 z-20">

                {/* Mobile Quick Action Capsule Dock (Search, Wishlist, Cart & Profile) */}
                <div className="flex lg:hidden items-center gap-0.5 min-[360px]:gap-1 bg-[#011C16]/85 px-1 min-[360px]:px-1.5 py-0.5 rounded-full border border-[#F5B418]/45 backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
                  {/* Search Trigger */}
                  <button
                    onClick={() => dispatch(toggleSearch(true))}
                    className="relative w-7 h-7 min-[360px]:w-7.5 min-[360px]:h-7.5 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full hover:bg-white/[0.08] active:scale-95 cursor-pointer"
                    aria-label="Search Fragrance Vault"
                  >
                    <Search className="w-3.5 h-3.5" />
                  </button>

                  {/* Wishlist Trigger */}
                  <button
                    onClick={() => dispatch(toggleWishlistDrawer(true))}
                    className="relative w-7 h-7 min-[360px]:w-7.5 min-[360px]:h-7.5 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full hover:bg-white/[0.08] active:scale-95 cursor-pointer"
                    aria-label="Royal Wishlist Vault"
                    suppressHydrationWarning
                  >
                    <Heart className="w-3.5 h-3.5" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-[#F5B418] text-[8px] font-black text-white shadow-[0_0_8px_rgba(244,63,94,0.6)] border border-[#012520]">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  {/* Shopping Cart Trigger */}
                  <button
                    onClick={() => dispatch(toggleCartDrawer(true))}
                    className="relative w-7 h-7 min-[360px]:w-7.5 min-[360px]:h-7.5 flex items-center justify-center text-[#FAF8F2]/90 hover:text-[#F5B418] transition-all rounded-full hover:bg-white/[0.08] active:scale-95 cursor-pointer"
                    aria-label="View Shopping Cart"
                    suppressHydrationWarning
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {mounted && itemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] px-0.5 items-center justify-center rounded-full bg-gradient-to-r from-[#F5B418] to-[#FFDF78] text-[8px] font-black text-[#012520] shadow-[0_0_8px_rgba(245,180,24,0.7)] border border-[#012520] ring-1 ring-[#F5B418]/60">
                        {itemsCount}
                      </span>
                    )}
                  </button>

                  {/* Vertical Hairline Divider */}
                  <div className="w-[1px] h-3 bg-[#F5B418]/30 mx-0.5" />

                  {/* Profile / Sign In Button */}
                  <div className="relative flex items-center" ref={mobileUserDropdownRef}>
                    <button
                      onClick={() => {
                        if (isMobileNavOpen) setIsMobileNavOpen(false);
                        if (!isAuthenticated) {
                          dispatch(openAuthModal('login'));
                        } else {
                          setIsUserMenuOpen(!isUserMenuOpen);
                        }
                      }}
                      className="relative flex items-center justify-center w-7 h-7 min-[360px]:w-7.5 min-[360px]:h-7.5 xs:w-auto xs:px-2 text-[#FAF8F2]/95 hover:text-[#F5B418] transition-all rounded-full bg-gradient-to-r from-[#F5B418]/25 via-[#F5B418]/15 to-[#F5B418]/25 border border-[#F5B418]/60 active:scale-95 shadow-2xs cursor-pointer"
                      aria-label={mounted && isAuthenticated && user ? 'View Profile' : 'Sign In'}
                      suppressHydrationWarning
                    >
                      {mounted &&
                      isAuthenticated &&
                      user?.avatar &&
                      !avatarError &&
                      !user.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          onError={() => setAvatarError(true)}
                          className="w-3.5 h-3.5 rounded-full object-cover border border-[#F5B418]"
                        />
                      ) : (
                        <UserIcon className="w-3 h-3 text-[#F5B418]" />
                      )}
                      <span className="hidden xs:inline-block text-[8.5px] font-bold uppercase tracking-wider text-[#FAF8F2] ml-1">
                        {mounted && isAuthenticated && user ? user.name.split(' ')[0] : 'SIGN IN'}
                      </span>
                    </button>

                    {/* Mobile User Dropdown Menu */}
                    {userDropdownMenuContent}
                  </div>
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
                      !avatarError &&
                      !user.avatar.includes('photo-1534528741775-53994a69daeb') ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          onError={() => setAvatarError(true)}
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
                  {userDropdownMenuContent}
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
              className={`relative w-full border-b border-[#C9A227]/30 shadow-[0_35px_80px_-15px_rgba(1,37,32,0.4)] overflow-y-auto transition-all duration-300 ${
                isAtTop
                  ? 'max-h-[calc(100vh-86px)] sm:max-h-[calc(100vh-92px)] lg:max-h-[calc(100vh-96px)] xl:max-h-[calc(100vh-102px)]'
                  : 'max-h-[calc(100vh-60px)] sm:max-h-[calc(100vh-64px)] lg:max-h-[calc(100vh-68px)] xl:max-h-[calc(100vh-74px)]'
              }`}
            >
              {/* Artisanal Botanical Perfumery Artwork Background (Roses, Jasmine, Bergamot, Oranges, Vanilla Orchid & Amber Drops) */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
                <Image
                  src="/images/botanical-perfume-bg.jpg"
                  alt="Artisanal Perfumery Botanical Flowers & Fruits"
                  fill
                  priority
                  quality={95}
                  className="object-cover object-center"
                  sizes="100vw"
                />
                {/* Luminous Warm Ivory Veil for High-End Readability & Soft Luxury */}
                <div className="absolute inset-0 bg-[#FAF7EE]/60 backdrop-blur-[0.5px]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7EE]/70 via-[#FAF7EE]/30 to-[#FAF7EE]/70" />
              </div>

              {/* Top Vault Bar */}
              <div className="w-full border-b border-[#C9A227]/25 bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] relative z-10">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
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

              {/* Content Grid (Matching User Reference Image) */}
              <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-7 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                  {/* Left Section: DISCOVER FRAGRANCE NOTES (7 cols, 2 columns of 32 notes) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[#C9A227]/20">
                      <h3 className="font-sans text-xs sm:text-[13px] font-black uppercase tracking-wider text-neutral-900">
                        Discover Fragrance Notes
                      </h3>
                      <span className="text-[10px] font-bold text-[#0A5C4E] bg-[#E6F4F1] px-2.5 py-0.5 rounded-full border border-[#BCE4DC]">
                        32 Fragrance Notes
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      {/* Column 1 (16 notes) */}
                      <div className="space-y-2">
                        {[
                          'amber',
                          'Ambroxan',
                          'Aquatic notes',
                          'bergamot',
                          'cardamom',
                          'cinnamon',
                          'driftwood',
                          'geranium',
                          'lavender',
                          'mugwort',
                          'orange blossom',
                          'patchouli',
                          'pink pepper',
                          'Rose',
                          'Sichuan pepper',
                          'Vanilla',
                        ].map((note) => (
                          <Link
                            key={note}
                            href={`/shop?notes=${encodeURIComponent(note)}`}
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="group flex items-center gap-2.5 text-xs text-neutral-800 hover:text-black py-0.5 transition-all font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] group-hover:bg-[#012520] group-hover:scale-125 transition-all shrink-0" />
                            <span className="group-hover:translate-x-0.5 transition-transform">{note}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Column 2 (16 notes) */}
                      <div className="space-y-2">
                        {[
                          'Ambergris',
                          'Apple',
                          'artemisia',
                          'Calabrian bergamot',
                          'cedarwood',
                          'Cumin',
                          'elemi',
                          'labdanum',
                          'lemon',
                          'musk',
                          'orris',
                          'pepper',
                          'plum',
                          'sandalwood',
                          'tonka bean',
                          'vetiver',
                        ].map((note) => (
                          <Link
                            key={note}
                            href={`/shop?notes=${encodeURIComponent(note)}`}
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="group flex items-center gap-2.5 text-xs text-neutral-800 hover:text-black py-0.5 transition-all font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] group-hover:bg-[#012520] group-hover:scale-125 transition-all shrink-0" />
                            <span className="group-hover:translate-x-0.5 transition-transform">{note}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Section: CATEGORIES (5 cols) with vertical dividing line */}
                  <div className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-[#C9A227]/25 space-y-4 pt-4 lg:pt-0">
                    <div className="flex items-center gap-2 pb-3 border-b border-[#C9A227]/20">
                      <ShoppingBag className="w-4 h-4 text-emerald-800" />
                      <h3 className="font-sans text-xs sm:text-[13px] font-black uppercase tracking-wider text-neutral-900">
                        Categories
                      </h3>
                    </div>

                    <div className="space-y-1">
                      {[
                        { title: 'AMBER & ORIENTAL', desc: '(Rich/Arabic)' },
                        { title: 'FLORAL & ROSE', desc: '(Floral/Feminine)' },
                        { title: 'FRESH & AQUATIC', desc: '(Fresh/Blue)' },
                        { title: 'GREEN & EARTHY', desc: '(Natural/Herbal)' },
                        { title: 'LEATHER & DARK', desc: '(Dark/Bold)' },
                        { title: 'MUSK & CLEAN', desc: '(Clean/Skin)' },
                        { title: 'OUD & WOODY', desc: '(Oud/Traditional)' },
                        { title: 'SWEET & GOURMAND', desc: '(Sweet/Delicious)' },
                      ].map((cat) => {
                        const targetHref = resolveCategoryHref(cat);
                        return (
                          <Link
                            key={cat.title}
                            href={targetHref}
                            onClick={() => {
                              if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                              setIsShopOpen(false);
                            }}
                            className="group flex items-baseline justify-between py-1.5 px-2.5 rounded-xl hover:bg-white/85 hover:shadow-2xs transition-all cursor-pointer"
                          >
                            <div className="flex items-baseline gap-1.5 min-w-0">
                              <span className="font-sans text-xs font-bold text-neutral-800 tracking-wide group-hover:text-emerald-950 transition-colors uppercase">
                                {cat.title}
                              </span>
                              <span className="text-[11px] font-normal text-neutral-500 font-sans">
                                {cat.desc}
                              </span>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-900 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1 opacity-0 group-hover:opacity-100" />
                          </Link>
                        );
                      })}
                    </div>

                    {/* Our Fragrance Categories (Live Database Collections & Flacon Types) */}
                    {categories.length > 0 && (
                      <div className="pt-3 border-t border-[#C9A227]/20">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
                          Our Fragrance Categories
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {categories.map((c) => (
                            <Link
                              key={c._id}
                              href={`/shop?category=${encodeURIComponent(c.slug || c._id)}`}
                              onClick={() => {
                                if (shopTimeoutRef.current) clearTimeout(shopTimeoutRef.current);
                                setIsShopOpen(false);
                              }}
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/85 border border-[#C9A227]/30 text-neutral-800 hover:bg-[#012520] hover:text-[#F5B418] hover:border-[#012520] transition-all shadow-2xs cursor-pointer"
                            >
                              {c.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Guarantee Bar (Matching Reference Image) */}
              <div className="w-full border-t border-[#C9A227]/25 bg-[#FAF7EE]/85 backdrop-blur-xs py-3.5 relative z-10">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-center gap-4 text-xs font-medium text-neutral-800 select-none">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" /> 100% Certified Alcohol-Free
                  </span>
                  <span className="text-emerald-400 font-bold">•</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-700" /> Hand-poured Crystal Flacons
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

      {/* HEADER SPACING OFFSET TO PREVENT CONTENT OVERLAP */}
      <div className="h-[110px] min-[360px]:h-[116px] xs:h-[120px] sm:h-[122px] lg:h-[102px] xl:h-[106px] w-full shrink-0" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 2. OFF-CANVAS MOBILE DRAWER                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-[140] lg:hidden" aria-hidden={!isMobileNavOpen}>
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

            {/* Aside Navigation Drawer - Simple, Elegant & High-UX Luxury Navigation */}
            <motion.aside
              variants={drawerLeftVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 w-full sm:max-w-md h-[100dvh] bg-[#FCFBF7] z-[150] shadow-2xl flex flex-col justify-between border-r border-[#EAE3D2] overscroll-contain select-none text-neutral-800"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* 1. Drawer Header (Clean, Understated Luxury) */}
              <div className="shrink-0 px-4 py-3.5 sm:px-5 border-b border-[#EAE3D2] flex items-center justify-between bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <div>
                    <h2 className="font-serif text-sm font-bold tracking-[0.16em] text-[#012520] leading-none">
                      ATTAR DEPOT
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="w-8.5 h-8.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 flex items-center justify-center transition-all active:scale-95 cursor-pointer border border-neutral-200/60"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>


              {/* 4. Drawer Scrollable Navigation Body */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-3">
                
                {/* 4.1 Home Link */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    router.push('/');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs transition-all text-left cursor-pointer active:scale-[0.98] ${
                    pathname === '/'
                      ? 'bg-[#012520] text-[#F5B418] font-bold border border-[#F5B418]/40 shadow-[0_2px_12px_rgba(1,37,32,0.2)]'
                      : 'bg-white hover:bg-[#FAF8F5] text-neutral-700 hover:text-emerald-950 font-semibold border border-[#EAE3D2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        pathname === '/'
                          ? 'bg-[#F5B418] text-[#012520] font-bold'
                          : 'bg-[#FAF8F5] text-[#012520]'
                      }`}
                    >
                      <Home className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-sm tracking-wide">Home</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 ${
                      pathname === '/' ? 'text-[#F5B418]' : 'text-neutral-400'
                    }`}
                  />
                </button>

                {/* 4.2 Interactive Shop Fragrance Vault (Simple & Elegant Accordion) */}
                <div className="rounded-2xl border border-[#EAE3D2] bg-white overflow-hidden shadow-2xs transition-all">
                  {/* Shop Accordion Header */}
                  <div className="p-3 flex items-center justify-between bg-gradient-to-r from-[#FAF8F5] to-white border-b border-[#EAE3D2]/70">
                    <button
                      type="button"
                      onClick={() => setIsMobileShopExpanded(!isMobileShopExpanded)}
                      className="flex items-center gap-3 flex-1 text-left cursor-pointer select-none group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-[#012520] text-[#F5B418] flex items-center justify-center shadow-xs shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-serif text-sm font-bold text-[#012520] tracking-wide">
                            Shop Fragrances
                          </span>
                          <span className="text-[9px] font-bold bg-[#F5B418]/20 text-[#012520] border border-[#F5B418]/50 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                            Vault
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500">
                          {isMobileShopExpanded ? 'Categories, Notes, Occasions & Price' : 'Tap to explore collections'}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link
                        href="/shop"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="text-[10.5px] font-bold text-[#012520] bg-[#F5B418] hover:bg-[#FFD778] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs active:scale-95 transition-all uppercase tracking-wider"
                      >
                        <span>All</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setIsMobileShopExpanded(!isMobileShopExpanded)}
                        className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#012520] flex items-center justify-center transition-all cursor-pointer"
                        aria-label={isMobileShopExpanded ? 'Collapse shop menu' : 'Expand shop menu'}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            isMobileShopExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Tabs & Content */}
                  {isMobileShopExpanded && (
                    <div className="p-3 space-y-3 bg-[#FCFBF7]/80 relative overflow-hidden">
                      {/* Subtle Botanical Perfumery Background */}
                      <div className="absolute inset-0 pointer-events-none select-none opacity-25 -z-10 overflow-hidden">
                        <Image
                          src="/images/botanical-perfume-bg.jpg"
                          alt="Botanical Ingredients"
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      {/* Segmented Pill Tabs */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {[
                          { id: 'categories', label: 'Categories' },
                          { id: 'notes', label: 'Fragrance Notes' },
                          { id: 'occasions', label: 'Occasions' },
                          { id: 'collections', label: 'Collections' },
                          { id: 'price', label: 'Price Range' },
                        ].map((tab) => {
                          const isTabActive = mobileShopTab === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              onClick={() => setMobileShopTab(tab.id as any)}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 shrink-0 ${
                                isTabActive
                                  ? 'bg-[#012520] text-[#F5B418] shadow-xs'
                                  : 'bg-white text-neutral-600 hover:text-[#012520] border border-[#EAE3D2] hover:bg-[#FAF8F5]'
                              }`}
                            >
                              <span>{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Tab 1: Categories */}
                      {mobileShopTab === 'categories' && (
                        <div className="space-y-1.5 animate-in fade-in-50 duration-200">
                          <div className="grid grid-cols-2 gap-1.5">
                            {categories.slice(0, 10).map((cat) => (
                              <Link
                                key={cat._id}
                                href={`/shop?category=${cat.slug}`}
                                onClick={() => setIsMobileNavOpen(false)}
                                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#EAE3D2] text-[12.5px] font-semibold text-neutral-900 hover:text-[#012520] transition-all group active:scale-[0.98] shadow-2xs"
                              >
                                <span className="truncate">{cat.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                              </Link>
                            ))}
                          </div>
                          {categories.length === 0 && (
                            <p className="text-xs text-neutral-500 italic py-2 text-center">Pure Attars & Distillations</p>
                          )}
                        </div>
                      )}

                      {/* Tab 2: Fragrance Notes */}
                      {mobileShopTab === 'notes' && (
                        <div className="space-y-2 animate-in fade-in-50 duration-200">
                          <div className="flex flex-wrap gap-1.5">
                            {megaNotes.slice(0, 16).map((note) => (
                              <Link
                                key={note}
                                href={`/shop?notes=${encodeURIComponent(note)}`}
                                onClick={() => setIsMobileNavOpen(false)}
                                className="px-3 py-1.5 rounded-full bg-white hover:bg-[#012520] border border-[#EAE3D2] text-xs font-semibold text-neutral-800 hover:text-[#F5B418] transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs group"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] group-hover:bg-[#F5B418] transition-colors" />
                                <span>{note}</span>
                              </Link>
                            ))}
                          </div>
                          {megaNotes.length === 0 && (
                            <p className="text-xs text-neutral-500 italic py-2 text-center">Loading fragrance notes...</p>
                          )}
                        </div>
                      )}

                      {/* Tab 3: Occasions */}
                      {mobileShopTab === 'occasions' && (
                        <div className="grid grid-cols-2 gap-1.5 animate-in fade-in-50 duration-200">
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
                          ).slice(0, 8).map((occ) => (
                            <Link
                              key={occ}
                              href={`/shop?occasion=${encodeURIComponent(occ)}`}
                              onClick={() => setIsMobileNavOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#EAE3D2] text-[12.5px] font-semibold text-neutral-900 hover:text-[#012520] transition-all group active:scale-[0.98] shadow-2xs"
                            >
                              <span className="truncate">{occ}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Tab 4: Royal Collections */}
                      {mobileShopTab === 'collections' && (
                        <div className="grid grid-cols-2 gap-1.5 animate-in fade-in-50 duration-200">
                          {(megaCollections.length > 0
                            ? megaCollections
                            : ['Royal Heritage', 'Daily Luxury', 'Bridal Edition', 'Vintage Oud']
                          ).slice(0, 6).map((col) => (
                            <Link
                              key={col}
                              href={`/shop?collection=${encodeURIComponent(col)}`}
                              onClick={() => setIsMobileNavOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#EAE3D2] text-[12.5px] font-semibold text-neutral-900 hover:text-[#012520] transition-all group active:scale-[0.98] shadow-2xs"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <Crown className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                                <span className="truncate">{col}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Tab 5: Price Ranges */}
                      {mobileShopTab === 'price' && (
                        <div className="grid grid-cols-2 gap-1.5 animate-in fade-in-50 duration-200">
                          {megaPriceRanges.slice(0, 6).map(({ label, value }) => (
                            <Link
                              key={value}
                              href={`/shop?priceRange=${value}`}
                              onClick={() => setIsMobileNavOpen(false)}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] border border-[#EAE3D2] text-[12.5px] font-semibold text-neutral-900 hover:text-[#012520] transition-all group active:scale-[0.98] shadow-2xs"
                            >
                              <span className="truncate">{label}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#C9A227] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Bottom Banner Button: View All Fragrances */}
                      <Link
                        href="/shop"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="w-full mt-2 py-2 px-3 rounded-xl bg-white hover:bg-[#012520] text-[#012520] hover:text-[#F5B418] border border-[#EAE3D2] hover:border-[#012520] shadow-2xs flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider active:scale-[0.98] transition-all"
                      >
                        <span>View Complete Collection</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4.3 Boutique Pages (Simple & Elegant List) */}
                <div className="space-y-1.5">
                  {[
                    { name: 'Gifting & Sets', href: '/gifting', icon: Gift },
                    { name: 'Corporate Gifting', href: '/corporate-gifting', icon: Briefcase },
                    { name: 'Our Brand & Heritage', href: '/about', icon: Crown },
                    { name: 'FAQ & Guidance', href: '/faq', icon: MessageCircle },
                    { name: 'Contact Concierge', href: '/contact', icon: Phone },
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
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs transition-all text-left cursor-pointer active:scale-[0.98] ${
                          isActive
                            ? 'bg-[#012520] text-[#F5B418] font-bold border border-[#F5B418]/40 shadow-[0_2px_12px_rgba(1,37,32,0.2)]'
                            : 'bg-white hover:bg-[#FAF8F5] text-neutral-700 hover:text-emerald-950 font-semibold border border-[#EAE3D2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                              isActive
                                ? 'bg-[#F5B418] text-[#012520] font-bold'
                                : 'bg-[#FAF8F5] text-[#012520]'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-serif text-sm tracking-wide">{item.name}</span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#F5B418]' : 'text-neutral-400'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* 4.4 WhatsApp Luxury Concierge Assistance */}
                <a
                  href={SITE_CONTACT.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/15 border border-[#25D366]/30 text-[#075E54] transition-all active:scale-[0.98] cursor-pointer shadow-2xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#075E54]">Perfume Concierge</p>
                      <p className="text-[10px] text-neutral-600">Chat with us on WhatsApp</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#075E54] group-hover:translate-x-0.5 transition-transform" />
                </a>

              </div>

              {/* 5. Drawer Bottom Minimal Footer */}
              <div className="shrink-0 p-4 border-t border-[#EAE3D2] bg-white space-y-2.5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-between text-xs">
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between w-full">
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="flex items-center gap-2 hover:opacity-85 transition-opacity"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#012520] text-[#F5B418] flex items-center justify-center font-bold text-xs">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-semibold text-neutral-800 text-xs truncate max-w-[150px]">
                          {user?.name}
                        </span>
                      </Link>
                      <div className="flex items-center gap-3">
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsMobileNavOpen(false)}
                            className="text-[11px] font-bold text-emerald-800 hover:underline"
                          >
                            Admin
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            handleLogout();
                            setIsMobileNavOpen(false);
                          }}
                          className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileNavOpen(false);
                          dispatch(openAuthModal('login'));
                        }}
                        className="text-xs font-bold text-[#012520] hover:text-[#C9A227] transition-colors"
                      >
                        Sign In to Your Account →
                      </button>
                      <a
                        href="/admin/login"
                        onClick={() => setIsMobileNavOpen(false)}
                        className="text-[10.5px] text-neutral-500 hover:text-neutral-800"
                      >
                        Admin Portal
                      </a>
                    </div>
                  )}
                </div>

                {/* Subtle Hallmark & Social Icons */}
                <div className="pt-2 border-t border-[#EAE3D2]/60 flex items-center justify-between text-[10px] text-neutral-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#C9A227]" />
                    <span>Kannauj, India • 100% Pure Attars</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={SITE_CONTACT.socials.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-3 h-3" />
                    </a>
                    <a
                      href={SITE_CONTACT.whatsapp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center transition-colors"
                      aria-label="WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3" />
                    </a>
                    <a
                      href={SITE_CONTACT.socials.youtube.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-6 h-6 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-3 h-3" />
                    </a>
                  </div>
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
        className={`fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] border-t border-[#C9A227]/40 shadow-[0_-8px_30px_rgba(0,0,0,0.8)] rounded-t-[20px] pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 transition-all duration-300 select-none ${
          isMobileNavOpen || isCartDrawerOpen || isWishlistDrawerOpen || isAuthModalOpen
            ? 'translate-y-full opacity-0 pointer-events-none invisible'
            : 'translate-y-0 opacity-100'
        }`}
        aria-label="Mobile Bottom Navigation"
        aria-hidden={isMobileNavOpen || isCartDrawerOpen || isWishlistDrawerOpen || isAuthModalOpen}
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
