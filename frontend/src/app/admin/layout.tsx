'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Droplets,
  Package,
  Layers,
  ShoppingBag,
  ArrowLeft,
  LogOut,
  Sparkles,
  Menu,
  X,
  Bell,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  Radio,
  ShieldCheck,
  Sun,
  Moon,
  Users,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout, hydrateAuth } from '@/store/authSlice';
import api from '@/lib/api';
import {
  playOrderChime,
  getSoundMuted,
  setSoundMuted,
  AdminNotification,
} from '@/lib/adminNotifications';
import { useAdminOrders } from '@/hooks/useAdmin';
import { toast } from '@/lib/toast';
import { formatPrice } from '@/lib/utils';
import { AdminThemeProvider, useAdminTheme } from '@/context/AdminThemeContext';
import AttarDepotLogo from '@/components/common/AttarDepotLogo';

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAdminTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isMuted, setIsMutedState] = useState(false);
  const [toastNotification, setToastNotification] = useState<AdminNotification | null>(null);

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  // Poll orders in background every 15s to detect live new orders (only when authenticated and not on login page)
  const isLoginPage = pathname === '/admin/login';
  const [hasAdminToken, setHasAdminToken] = useState(false);
  const { data: ordersData } = useAdminOrders('All', !isLoginPage && (hasAdminToken || (!!user && user.role === 'admin')));

  // Hydrate authentication from localStorage and enforce admin session route protection
  useEffect(() => {
    dispatch(hydrateAuth());
    if (typeof window !== 'undefined' && localStorage.getItem('attar_token')) {
      setHasAdminToken(true);
    }

    // If on an internal admin page, verify valid token and admin role
    if (pathname !== '/admin/login') {
      const token = typeof window !== 'undefined' ? localStorage.getItem('attar_token') : null;
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('attar_user') : null;

      if (!token) {
        window.location.href = '/admin/login';
        return;
      }
      if (userStr) {
        try {
          const u = JSON.parse(userStr);
          if (u?.role !== 'admin') {
            window.location.href = '/admin/login';
            return;
          }
        } catch (e) {
          window.location.href = '/admin/login';
          return;
        }
      }
    }
  }, [pathname, dispatch]);

  // Load sound mute preference
  useEffect(() => {
    setIsMutedState(getSoundMuted());
  }, []);

  // Check for incoming orders & trigger sound chime and SaaS toast notification
  useEffect(() => {
    if (!ordersData?.orders) return;

    const orders = ordersData.orders;

    // On initial mount, populate the known order IDs and seed recent database orders
    if (initialLoadRef.current) {
      orders.forEach((ord) => knownOrderIdsRef.current.add(ord._id));
      initialLoadRef.current = false;

      if (orders.length > 0) {
        const initialList: AdminNotification[] = orders.slice(0, 5).map((ord) => ({
          id: `ord-${ord._id}`,
          type: 'order',
          title: `Consignment #${ord.orderNumber}`,
          message: `${ord.shippingAddress?.fullName || 'Patron'} - ${ord.orderStatus} (${formatPrice(ord.totalPrice)})`,
          timestamp: new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: ord.orderStatus !== 'Pending',
          orderId: ord._id,
          orderNumber: ord.orderNumber,
          amount: ord.totalPrice,
          link: '/admin/orders',
        }));
        setNotifications(initialList);
      }
      return;
    }

    // Find any brand new orders
    const newOrders = orders.filter((ord) => !knownOrderIdsRef.current.has(ord._id));

    if (newOrders.length > 0) {
      newOrders.forEach((newOrd) => {
        knownOrderIdsRef.current.add(newOrd._id);

        const newNotice: AdminNotification = {
          id: `ord-${newOrd._id}-${Date.now()}`,
          type: 'order',
          title: `New Order #${newOrd.orderNumber}`,
          message: `${newOrd.shippingAddress?.fullName || 'Patron'} placed an order (${formatPrice(newOrd.totalPrice)})`,
          timestamp: 'Just now',
          read: false,
          orderId: newOrd._id,
          orderNumber: newOrd.orderNumber,
          amount: newOrd.totalPrice,
          link: '/admin/orders',
        };

        // Add to notification list
        setNotifications((prev) => [newNotice, ...prev]);

        // Pop high visibility toast and global toastify alert
        setToastNotification(newNotice);
        setTimeout(() => setToastNotification(null), 6000);

        toast.success(`Consignment #${newOrd.orderNumber} received for ${formatPrice(newOrd.totalPrice)}!`, {
          title: 'New Royal Order',
          action: {
            label: 'View Order',
            onClick: () => router.push('/admin/orders'),
          },
        });

        // Play chime sound
        playOrderChime();
      });
    }
  }, [ordersData, router]);

  // Click outside to close notification popover or profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMutedState(nextMuted);
    setSoundMuted(nextMuted);
  };

  const handleTestChime = () => {
    playOrderChime();
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = () => {
    // 1. Immediately wipe Redux and localStorage session
    dispatch(logout());

    // 2. Persist logout toast so it displays on the login page immediately
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(
        'attar_pending_toast',
        JSON.stringify({
          type: 'success',
          message: 'Administrator session terminated securely.',
          options: {
            title: 'Logged Out Successfully',
          },
        })
      );
    }

    // 3. Fire backend logout in background without awaiting or blocking UI
    api.post('/auth/logout').catch((e) => console.error(e));

    // 4. Instant hard redirect to admin login page
    window.location.href = '/admin/login';
  };

  const pendingOrdersCount = ordersData?.orders?.filter((o) => o.orderStatus === 'Pending').length || 0;

  // Grouped Navigation Modules - Compact & Professional
  const navGroups = [
    {
      label: 'Core Overview',
      items: [
        {
          name: 'Dashboard',
          href: '/admin/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: 'Catalog & Inventory',
      items: [
        {
          name: 'Products',
          href: '/admin/products',
          icon: Droplets,
        },
        {
          name: 'Categories',
          href: '/admin/categories',
          icon: Layers,
        },
      ],
    },
    {
      label: 'Sales & Patrons',
      items: [
        {
          name: 'Orders',
          href: '/admin/orders',
          icon: ShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
        },
        {
          name: 'Customers',
          href: '/admin/customers',
          icon: Users,
        },
      ],
    },
  ];

  const allNavItems = navGroups.flatMap((g) => g.items);
  const activePage = allNavItems.find((item) => pathname.startsWith(item.href)) || allNavItems[0];
  const ActiveIcon = activePage.icon;
  const isDashboard = pathname === '/admin/dashboard';

  return (
    <div
      style={{
        backgroundColor: '#011C16',
        backgroundImage:
          'radial-gradient(at 20% 10%, rgba(4, 90, 75, 0.25) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(201, 162, 39, 0.12) 0px, transparent 40%), linear-gradient(180deg, #022019 0%, #011C16 40%, #01140F 100%)',
      }}
      className="min-h-screen flex font-poppins relative text-amber-300 selection:bg-amber-400 selection:text-slate-950 transition-colors duration-300"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-16 left-60 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none bg-emerald-500/10 opacity-70" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none bg-amber-400/10 opacity-60" />

      {/* Real-time Order Popup Toast */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-[80] animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm w-full">
          <div
            style={{ backgroundColor: '#02241D' }}
            className="border border-[#0C4E40] text-white shadow-2xl shadow-black/80 ring-1 ring-amber-400/20 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#063B2F] border border-amber-400/40 text-amber-300 flex items-center justify-center flex-shrink-0 shadow-lg">
              <ShoppingBag className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold truncate text-amber-300">
                  {toastNotification.title}
                </p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-amber-400/20 text-amber-300 border-amber-400/40">
                  New
                </span>
              </div>
              <p className="text-[11px] mt-0.5 leading-snug text-emerald-100/80">
                {toastNotification.message}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Link
                  href="/admin/orders"
                  onClick={() => setToastNotification(null)}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-200 hover:underline flex items-center gap-1"
                >
                  View Order <ChevronRight className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => setToastNotification(null)}
                  className="text-[10px] text-emerald-200/60 hover:text-amber-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="p-1 text-emerald-200/60 hover:text-amber-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/75 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* 1. COMPACT ROYAL GREEN ADMIN SIDEBAR (Full Background, Premium UI/UX)      */}
      {/* ========================================================================= */}
      <aside
        style={{
          backgroundColor: '#02241D',
          backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 45%, #011914 100%)',
          color: '#FFFFFF',
        }}
        className={`fixed top-0 bottom-0 left-0 z-50 ${
          isSidebarCollapsed ? 'lg:w-16' : 'lg:w-56'
        } w-60 border-r border-[#08483A] text-white flex flex-col justify-between transition-all duration-300 shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-4 overflow-y-auto scrollbar-none flex-1">
          {/* Logo & Brand Identity */}
          <div className="relative flex items-center justify-between pb-3 border-b border-[#0C4E40]">
            <Link
              href="/admin/dashboard"
              className="group flex items-center justify-center flex-1 min-w-0 transition-transform duration-200"
            >
              {!isSidebarCollapsed ? (
                <div className="flex items-center justify-center w-full py-0.5">
                  <Image
                    src="/images/logo.png"
                    alt="The Attar Depot"
                    width={180}
                    height={100}
                    priority
                    className="h-14 max-h-18 w-auto object-contain drop-shadow-[0_4px_14px_rgba(201,162,39,0.38)] group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center py-0.5">
                  <Image
                    src="/images/logo.png"
                    alt="The Attar Depot"
                    width={48}
                    height={48}
                    priority
                    className="h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(201,162,39,0.4)] group-hover:scale-110 transition-all duration-300"
                  />
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute right-0 top-1 p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Grouped Categorized Navigation */}
          <div className="space-y-3.5">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                {!isSidebarCollapsed && (
                  <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-400/90 px-2.5 pt-1">
                    {group.label}
                  </p>
                )}
                <nav className="space-y-0.5 text-xs font-medium">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        title={isSidebarCollapsed ? item.name : undefined}
                        style={
                          isActive
                            ? {
                                background: 'linear-gradient(90deg, #0C6A56 0%, #075242 100%)',
                                borderColor: 'rgba(30, 165, 136, 0.7)',
                              }
                            : undefined
                        }
                        className={`group relative flex items-center ${
                          isSidebarCollapsed ? 'justify-center p-2' : 'justify-between px-2.5 py-2'
                        } rounded-xl transition-all duration-150 ${
                          isActive
                            ? 'text-white border shadow-[0_4px_16px_rgba(4,90,75,0.45)] font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1.5 before:rounded-r-full before:bg-amber-400 before:shadow-[0_0_10px_#F59E0B]'
                            : 'text-emerald-100 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-[#0C5847] font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 transition-colors ${
                              isActive
                                ? 'text-amber-300 drop-shadow-sm'
                                : 'text-emerald-300 group-hover:text-amber-300'
                            }`}
                          />
                          {!isSidebarCollapsed && (
                            <span className={`truncate text-xs ${isActive ? 'text-white font-bold' : 'text-emerald-100 group-hover:text-white'}`}>
                              {item.name}
                            </span>
                          )}
                        </div>

                        {!isSidebarCollapsed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && item.badge > 0 && (
                              <span
                                className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                                  isActive
                                    ? 'bg-amber-400 text-[#022D24] shadow-xs'
                                    : 'bg-[#064B3C] text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
                            )}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer & User Profile Row */}
        <div
          style={{ backgroundColor: '#011914' }}
          className="p-2.5 border-t border-[#094738] space-y-1.5 shrink-0"
        >
          {!isSidebarCollapsed ? (
            <>
              {/* User Profile Mini Row */}
              <div className="flex items-center justify-between px-1 py-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#065E4D] to-[#023126] text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold text-[11px] shadow-xs shrink-0">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {user?.name || 'Administrator'}
                    </p>
                    <p className="text-[9px] text-amber-300/90 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Master Admin</span>
                    </p>
                  </div>
                </div>

                {/* Desktop Collapse Toggle */}
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  title="Collapse Sidebar"
                  className="hidden lg:flex p-1 rounded-lg text-emerald-300/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Actions Row */}
              <div className="pt-1 flex items-center gap-1">
                <Link
                  href="/"
                  target="_blank"
                  title="Open live storefront"
                  className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium text-emerald-200 hover:text-white hover:bg-white/10 border border-emerald-900/60 hover:border-[#0F5A4A] transition-all bg-emerald-950/40"
                >
                  <ExternalLink className="w-3 h-3 text-emerald-300" />
                  <span>Store</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Exit Admin Portal"
                  className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold text-rose-300 hover:text-white hover:bg-rose-950/80 border border-rose-950/60 hover:border-rose-800/60 transition-all bg-rose-950/30"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Exit</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                title="Expand Sidebar"
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <PanelLeft className="w-4 h-4" />
              </button>

              <div
                title={user?.name || 'Administrator'}
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#065E4D] to-[#023126] text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold text-[11px] shadow-xs"
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>

              <button
                onClick={handleLogout}
                title="Exit Admin Portal"
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-950/60 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN ADMIN CONTENT AREA & EXECUTIVE HEADER                             */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: '#011C16',
        }}
        className={`flex-1 ${
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56'
        } flex flex-col min-h-screen transition-all duration-300`}
      >
        {/* Top Navbar */}
        <header
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(90deg, #02241D 0%, #033026 50%, #02241D 100%)',
          }}
          className="h-16 border-b border-[#0C4E40] shadow-md px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors text-amber-300"
        >
          {/* Left: Mobile Trigger + Breadcrumb + Status Badge */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl shrink-0 text-amber-300 hover:text-amber-100 hover:bg-white/10 transition-colors"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation Pill */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#146654] bg-[#03362B]/85 text-xs font-medium shadow-sm truncate">
                <span className="hidden sm:inline text-[11px] font-medium text-amber-200/75">
                  Admin
                </span>
                <span className="hidden sm:inline text-amber-400/50">/</span>
                <div className="flex items-center gap-1.5 truncate">
                  <ActiveIcon className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                  <span className="font-bold truncate text-amber-300 tracking-wide">
                    {activePage.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Icons & Admin Profile Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0" ref={popoverRef}>
            {/* Audio Chime Mute/Unmute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Notification Sound' : 'Mute Notification Sound'}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'border-[#0D5545] bg-[#022D24] text-amber-200/50 hover:text-amber-200'
                  : 'border-[#146654] bg-[#03362B] text-amber-300 hover:bg-[#054E3F] hover:text-amber-200 shadow-sm'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Notification Bell & Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-xl border transition-all relative ${
                  isNotificationsOpen
                    ? 'border-amber-400/70 bg-[#054E3F] text-amber-300 ring-2 ring-amber-400/30'
                    : 'border-[#146654] bg-[#03362B] text-amber-300 hover:bg-[#054E3F] hover:text-amber-200 shadow-sm'
                }`}
                aria-label="Toggle notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-amber-400 text-[#02241D] rounded-full text-[10px] font-bold flex items-center justify-center px-1 ring-2 ring-[#02241D] animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Enhanced Notification Popover Panel */}
              {isNotificationsOpen && (
                <div
                  style={{ backgroundColor: '#02241D' }}
                  className="fixed inset-x-3 top-16 max-w-sm mx-auto sm:static sm:absolute sm:inset-auto sm:right-0 sm:mt-3 sm:w-96 sm:max-w-none rounded-2xl border border-[#0C4E40] shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl"
                >
                  <div className="p-3.5 border-b border-[#0C4E40] bg-[#011B16] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Realtime Telemetry
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestChime}
                        className="text-[10px] px-2 py-0.5 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 font-semibold transition-colors"
                      >
                        Test Chime
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-amber-300 hover:text-amber-100 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-emerald-500/15">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-300/60" />
                        <p className="text-xs font-medium text-emerald-200/80">
                          No dispatch signals logged yet
                        </p>
                        <p className="text-[10px] mt-0.5 text-emerald-300/50">
                          Listening for incoming orders...
                        </p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 flex items-start gap-3 transition-colors ${
                            item.read
                              ? 'bg-transparent opacity-65'
                              : 'bg-emerald-950/40'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold truncate text-white">
                                {item.title}
                              </p>
                              <span className="text-[9px] text-amber-300/70">{item.timestamp}</span>
                            </div>
                            <p className="text-[11px] mt-0.5 leading-snug line-clamp-2 text-emerald-100/80">
                              {item.message}
                            </p>
                            {item.link && (
                              <Link
                                href={item.link}
                                onClick={() => {
                                  setIsNotificationsOpen(false);
                                  setNotifications((prev) =>
                                    prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
                                  );
                                }}
                                className="text-[10px] font-bold text-amber-300 hover:text-amber-100 hover:underline mt-1.5 inline-flex items-center gap-1"
                              >
                                <span>Inspect Consignment</span>
                                <ChevronRight className="w-2.5 h-2.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Storefront Link */}
            <Link
              href="/"
              target="_blank"
              title="View Storefront"
              className="text-xs p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold shadow-sm border border-[#146654] bg-[#03362B] text-amber-300 hover:bg-[#054E3F] hover:text-amber-200 shrink-0"
            >
              <span className="hidden sm:inline">Storefront</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </Link>

            {/* Admin Avatar Profile Menu Trigger */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:pl-1 sm:pr-2.5 sm:py-1 rounded-xl border border-[#146654] bg-[#03362B] hover:bg-[#054E3F] text-amber-300 shadow-sm transition-all"
                aria-label="Admin Profile Options"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#065E4D] to-[#023126] text-amber-300 border border-amber-400/40 flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-tight truncate max-w-[90px] text-amber-300">
                    {user?.name || 'Admin'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-amber-300/70 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isAdminDropdownOpen && (
                <div
                  style={{ backgroundColor: '#02241D' }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#0C4E40] shadow-2xl shadow-black/80 backdrop-blur-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-2.5 border-b border-[#0C4E40] mb-1 rounded-xl bg-[#011B16]">
                    <p className="text-xs font-bold truncate text-amber-300">
                      {user?.name || 'Master Administrator'}
                    </p>
                    <p className="text-[10px] truncate mt-0.5 text-emerald-200/70">
                      {user?.email || 'admin@attardepot.com'}
                    </p>
                    <span className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      Super Administrator
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setIsAdminDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors hover:bg-white/10 text-emerald-100 hover:text-amber-300"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                        <span>View Live Store</span>
                      </span>
                      <ChevronRight className="w-3 h-3 opacity-60 text-amber-400/70" />
                    </Link>

                    <button
                      onClick={() => {
                        setIsAdminDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/70 rounded-xl transition-all"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Exit Admin Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-8xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(90deg, #02241D 0%, #033026 50%, #02241D 100%)',
          }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#0C4E40] shadow-[0_-4px_25px_rgba(0,0,0,0.5)] backdrop-blur-xl px-2 py-1.5 flex items-center justify-around"
          aria-label="Mobile Navigation"
        >
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-amber-300 font-bold scale-105'
                    : 'text-emerald-100/70 hover:text-amber-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] bg-amber-400 text-[#02241D] rounded-full text-[9px] font-bold flex items-center justify-center px-0.5">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {item.name.split(' ')[0]}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full mt-0.5 bg-amber-400 shadow-[0_0_6px_#F59E0B]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  );
}
