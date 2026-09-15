'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
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
  Clock,
  Radio,
  ShieldCheck,
  Sun,
  Moon,
  Users,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/authSlice';
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

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, toggleTheme } = useAdminTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMuted, setIsMutedState] = useState(false);
  const [toastNotification, setToastNotification] = useState<AdminNotification | null>(null);

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  // Poll orders in background every 15s to detect live new orders (only when authenticated and not on login page)
  const isLoginPage = pathname === '/admin/login';
  const { data: ordersData } = useAdminOrders('All', !isLoginPage && !!user && user.role === 'admin');

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
  }, [ordersData]);

  // Click outside to close notification popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
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

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    dispatch(logout());
    toast.info('Administrator session terminated securely.', {
      title: 'Signed Out',
    });
    router.push('/admin/login');
  };

  const pendingOrdersCount = ordersData?.orders?.filter((o) => o.orderStatus === 'Pending').length || 0;

  const navItems = [
    {
      name: 'Dashboard',
      subtitle: 'Overview & Telemetry',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'All Categories',
      subtitle: 'Fragrance Families',
      href: '/admin/categories',
      icon: Layers,
    },
    {
      name: 'All Products',
      subtitle: 'Attars & Flacons',
      href: '/admin/products',
      icon: Droplets,
    },
    {
      name: 'Orders',
      subtitle: 'Dispatch & Consignments',
      href: '/admin/orders',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
    },
    {
      name: 'Customers',
      subtitle: 'Patrons & Client Directory',
      href: '/admin/customers',
      icon: Users,
    },
  ];

  const activePage = navItems.find((item) => pathname.startsWith(item.href)) || navItems[0];
  const ActiveIcon = activePage.icon;

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen ${
        isLight ? 'bg-[#F4F7F5] text-slate-800' : 'bg-[#070B0A] text-neutral-100'
      } flex font-poppins relative selection:bg-emerald-500 selection:text-white transition-colors duration-300`}
    >
      {/* Background Ambient Glows */}
      <div
        className={`fixed top-0 left-64 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity ${
          isLight ? 'bg-emerald-400/10 opacity-40' : 'bg-emerald-500/5 opacity-100'
        }`}
      />
      <div
        className={`fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-opacity ${
          isLight ? 'bg-amber-400/10 opacity-30' : 'bg-amber-500/3 opacity-100'
        }`}
      />

      {/* Real-time Order Popup Toast */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-60 animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm w-full">
          <div
            className={`${
              isLight
                ? 'bg-white/98 border-emerald-300 text-slate-800 shadow-2xl ring-1 ring-emerald-500/20'
                : 'bg-[#0E1715]/95 border-emerald-500/40 text-white shadow-2xl shadow-black/80 ring-1 ring-emerald-500/20'
            } backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3.5`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-900/40">
              <ShoppingBag className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {toastNotification.title}
                </p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  New
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 leading-snug ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                {toastNotification.message}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Link
                  href="/admin/orders"
                  onClick={() => setToastNotification(null)}
                  className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                >
                  View Order <ChevronRight className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => setToastNotification(null)}
                  className={`text-[10px] ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-neutral-400 hover:text-neutral-200'}`}
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className={`p-1 ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-neutral-400 hover:text-white'}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Executive Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 ${
          isLight
            ? 'bg-white/95 border-r border-slate-200 text-slate-800 shadow-xl'
            : 'bg-[#080E0C]/98 border-r border-[#1B2925] text-neutral-100 shadow-2xl'
        } flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Brand */}
          <div className={`flex items-center justify-between pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#1B2925]'}`}>
            <Link href="/admin/dashboard" className="group block">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-800 to-emerald-950 border border-emerald-400/40 flex items-center justify-center text-amber-300 font-poppins font-bold text-base shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span
                    className={`font-poppins text-base font-bold tracking-[0.12em] uppercase block transition-colors ${
                      isLight ? 'text-slate-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-300'
                    }`}
                  >
                    Attar Depot
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#34d399]" />
                    <span
                      className={`text-[9px] tracking-[0.2em] font-semibold uppercase block ${
                        isLight ? 'text-emerald-700' : 'text-emerald-400'
                      }`}
                    >
                      Atelier Backoffice
                    </span>
                  </div>
                </div>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`lg:hidden p-1.5 rounded-xl ${
                isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-neutral-400 hover:text-white hover:bg-[#121E1B]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SaaS Navigation */}
          <div className="space-y-2">
           

            <nav className="space-y-1.5 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`group relative flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all duration-200 ${
                      isActive
                        ? isLight
                          ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 shadow-sm translate-x-0.5 font-bold'
                          : 'bg-gradient-to-r from-emerald-950/90 via-[#0E201B] to-[#0A1612] text-white border border-emerald-500/40 shadow-[0_4px_20px_rgba(16,185,129,0.14)] translate-x-0.5'
                        : isLight
                        ? 'text-slate-600 hover:text-emerald-900 hover:bg-slate-100/80 border border-transparent'
                        : 'text-neutral-400 hover:text-emerald-200 hover:bg-[#111E1A]/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? isLight
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                            : isLight
                            ? 'bg-slate-100 text-slate-500 border border-slate-200 group-hover:text-emerald-700 group-hover:bg-emerald-50 group-hover:border-emerald-200'
                            : 'bg-[#0B1512] text-neutral-400 border border-[#1A2C26] group-hover:text-emerald-300 group-hover:border-emerald-500/30 group-hover:bg-[#13221E]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p
                          className={`text-xs font-bold leading-snug truncate ${
                            isActive
                              ? isLight
                                ? 'text-emerald-950 font-bold'
                                : 'text-white'
                              : isLight
                              ? 'text-slate-800 group-hover:text-slate-900'
                              : 'text-neutral-300 group-hover:text-white'
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-[10px] leading-none mt-0.5 font-normal truncate ${
                            isLight
                              ? 'text-slate-500 group-hover:text-slate-600'
                              : 'text-neutral-500 group-hover:text-neutral-400'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.badge && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border animate-pulse ${
                            isLight
                              ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Info & Footer */}
        <div className={`p-4 border-t ${isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1B2925] bg-[#070D0B]'} space-y-3`}>
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0E1815] border-[#1B2925]'}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-950 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold text-xs shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {user?.name || 'Administrator'}
              </p>
              <p className={`text-[10px] font-semibold truncate flex items-center gap-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                <ShieldCheck className="w-3 h-3 text-emerald-500 inline" />
                <span>Master Merchant</span>
              </p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors font-medium ${
                isLight ? 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100' : 'text-neutral-400 hover:text-emerald-300 hover:bg-[#121E1B]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Visit Storefront</span>
              </div>
              <ExternalLink className={`w-3 h-3 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
            </Link>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-left font-medium ${
                isLight ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-50' : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin Portal</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className={`h-16 border-b ${isLight ? 'border-slate-200/90 bg-white/90 shadow-xs' : 'border-[#1B2925] bg-[#070B0A]/85 shadow-md shadow-black/40'} backdrop-blur-xl px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl ${isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-neutral-400 hover:text-white hover:bg-[#121E1B]'}`}
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Selected Page Breadcrumb / Indicator */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-xs ${
                  isLight
                    ? 'bg-slate-100/90 border-slate-200/90 text-slate-700'
                    : 'bg-[#0E1815] border-[#1B2925] text-neutral-300'
                }`}
              >
                <span className={`text-[11px] font-normal ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                  Admin
                </span>
                <span className={isLight ? 'text-slate-300' : 'text-neutral-600'}>/</span>
                <div className="flex items-center gap-1.5">
                  <ActiveIcon className={`w-3.5 h-3.5 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                  <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {activePage.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3" ref={popoverRef}>
            {/* Theme Toggle Button (Light & Dark Mode) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center relative ${
                theme === 'dark'
                  ? 'border-[#1B2925] bg-[#0E1815] text-amber-400 hover:text-amber-300 hover:border-amber-400/40 hover:bg-[#15231F]'
                  : 'border-slate-200 bg-white text-emerald-800 hover:bg-emerald-50 hover:border-emerald-400 shadow-xs'
              }`}
              aria-label="Toggle light and dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 transition-transform hover:rotate-45 duration-300" />
              ) : (
                <Moon className="w-4 h-4 transition-transform -rotate-12 hover:rotate-0 duration-300" />
              )}
            </button>

            {/* Audio Chime Mute/Unmute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Notification Sound' : 'Mute Notification Sound'}
              className={`p-2 rounded-xl border transition-all ${
                isLight
                  ? isMuted
                    ? 'border-slate-200 bg-white text-slate-400 hover:text-slate-600'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 shadow-xs'
                  : isMuted
                  ? 'border-[#1B2925] bg-[#0E1815] text-neutral-500 hover:text-neutral-300'
                  : 'border-emerald-500/30 bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/50'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Notification Bell & Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-xl border transition-all relative ${
                  isLight
                    ? isNotificationsOpen
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:text-emerald-800 hover:border-emerald-300'
                    : isNotificationsOpen
                    ? 'border-emerald-500 bg-emerald-950/80 text-emerald-300 ring-2 ring-emerald-500/20'
                    : 'border-[#1B2925] bg-[#0E1815] text-neutral-300 hover:text-emerald-300 hover:border-emerald-500/30'
                }`}
                aria-label="Toggle notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1 ring-2 ring-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationsOpen && (
                <div
                  className={`absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl border ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-2xl text-slate-800'
                      : 'bg-[#0E1815]/98 border-[#223832] shadow-2xl shadow-black/90 text-white'
                  }`}
                >
                  {/* Popover Header */}
                  <div className={`p-4 border-b flex items-center justify-between ${isLight ? 'border-slate-100 bg-slate-50' : 'border-[#1B2925] bg-black'}`}>
                    <div>
                      <h3 className={`font-poppins text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <span>Live Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </h3>
                      <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        Real-time store consignments & alerts
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestChime}
                        className={`text-[10px] px-2 py-1 rounded-lg font-semibold shadow-xs flex items-center gap-1 border ${
                          isLight
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                            : 'text-emerald-300 bg-[#12211C] border-emerald-500/30 hover:text-emerald-200'
                        }`}
                        title="Simulate audio alert chime"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Test Chime</span>
                      </button>

                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className={`text-[10px] hover:underline ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-neutral-400 hover:text-white'}`}
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className={`max-h-80 overflow-y-auto divide-y ${isLight ? 'divide-slate-100' : 'divide-[#1B2925]'}`}>
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
                        <p className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>All Clear</p>
                        <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>No unread notifications</p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 transition-colors flex items-start gap-3 ${
                            item.read
                              ? isLight ? 'bg-white opacity-70' : 'bg-transparent opacity-60'
                              : isLight ? 'bg-emerald-50/40' : 'bg-[#121E1B]/60'
                          } ${isLight ? 'hover:bg-slate-50' : 'hover:bg-[#152420]'}`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className={`text-xs font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {item.title}
                              </p>
                              <span className={`text-[9px] ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>{item.timestamp}</span>
                            </div>
                            <p className={`text-[11px] mt-0.5 leading-snug line-clamp-2 ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
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
                                className="text-[10px] font-bold text-emerald-600 hover:underline mt-1.5 inline-flex items-center gap-1"
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
              className={`text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold shadow-xs border ${
                isLight
                  ? 'text-emerald-800 hover:text-emerald-900 border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80'
                  : 'text-neutral-300 hover:text-emerald-300 border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-950/70'
              }`}
            >
              <span>Storefront</span>
              <Sparkles className="w-3 h-3 text-emerald-600" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
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
