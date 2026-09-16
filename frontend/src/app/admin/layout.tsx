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
      name: 'Categories & Taxonomy',
      subtitle: 'Collections, Notes & Occasions',
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
        isLight
          ? 'bg-gradient-to-br from-[#F0FDF4] via-[#F5FAF7] to-[#E9F6EF] text-slate-800'
          : 'bg-[#070B0A] text-neutral-100'
      } flex font-poppins relative selection:bg-emerald-500 selection:text-white transition-colors duration-300`}
    >
      {/* Background Ambient Glows */}
      <div
        className={`fixed top-0 left-64 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity ${
          isLight ? 'bg-emerald-400/20 opacity-60' : 'bg-emerald-500/5 opacity-100'
        }`}
      />
      <div
        className={`fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none transition-opacity ${
          isLight ? 'bg-amber-400/15 opacity-50' : 'bg-amber-500/3 opacity-100'
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

      {/* Executive Admin Sidebar (Dual Royal Green Theme: Sage-Mint Green in Light Mode, Imperial Emerald in Dark Mode) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 ${
          isLight
            ? 'bg-gradient-to-b from-[#EBF7F2] via-[#E2F3EB] to-[#D5EFE3] border-r border-[#B2DFD0] text-emerald-950 shadow-xl'
            : 'bg-gradient-to-b from-[#023329] via-[#012820] to-[#011C16] border-r border-[#0B4B3D] text-emerald-100 shadow-2xl'
        } flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Brand */}
          <div
            className={`flex items-center justify-between pb-4 border-b ${
              isLight ? 'border-[#B2DFD0]' : 'border-[#0B4B3D]/80'
            }`}
          >
            <Link href="/admin/dashboard" className="group block">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#065A49] to-[#022D24] border border-[#1A7763] flex items-center justify-center p-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform duration-300">
                  <AttarDepotLogo variant="icon" className="w-full h-full text-white" />
                </div>
                <div>
                  <span
                    className={`font-poppins text-base font-bold tracking-[0.12em] uppercase block transition-colors ${
                      isLight
                        ? 'text-[#043C31] group-hover:text-emerald-700'
                        : 'text-white group-hover:text-amber-300'
                    }`}
                  >
                    Attar Depot
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10b981]" />
                    <span
                      className={`text-[9px] tracking-[0.2em] font-bold uppercase block ${
                        isLight ? 'text-amber-700' : 'text-amber-300'
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
              className={`lg:hidden p-1.5 rounded-xl transition-colors ${
                isLight
                  ? 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-200/60'
                  : 'text-emerald-200 hover:text-white hover:bg-[#07473A]/60'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SaaS Navigation */}
          <div className="space-y-2">
            <p
              className={`text-[10px] font-bold uppercase tracking-[0.18em] px-3 ${
                isLight ? 'text-emerald-800/80' : 'text-emerald-300/70'
              }`}
            >
              Core Modules
            </p>
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
                          ? 'bg-gradient-to-r from-[#0E6251] via-[#0B5344] to-[#084236] text-white border border-[#1A7763] shadow-[0_4px_16px_rgba(11,83,68,0.25)] translate-x-0.5 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1.5 before:rounded-r-full before:bg-amber-400 before:shadow-[0_0_8px_#F59E0B]'
                          : 'bg-gradient-to-r from-[#075948] via-[#064B3D] to-[#043C31] text-white border border-[#238B74] shadow-[0_6px_20px_rgba(4,106,90,0.35)] translate-x-0.5 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1.5 before:rounded-r-full before:bg-amber-300 before:shadow-[0_0_10px_#FCD34D]'
                        : isLight
                        ? 'text-emerald-900/80 hover:text-emerald-950 hover:bg-emerald-200/50 border border-transparent hover:border-emerald-300/60'
                        : 'text-emerald-100/80 hover:text-white hover:bg-[#07473A]/50 border border-transparent hover:border-[#135A4B]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isActive
                            ? 'bg-emerald-500/30 text-amber-300 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                            : isLight
                            ? 'bg-white/80 text-emerald-800 border border-emerald-300/70 group-hover:bg-white group-hover:border-emerald-500 group-hover:text-emerald-950 shadow-xs'
                            : 'bg-[#032921] text-emerald-200 border border-[#0A4D3F] group-hover:text-white group-hover:border-[#1E7562] group-hover:bg-[#065646]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p
                          className={`text-xs font-bold leading-snug truncate ${
                            isActive
                              ? 'text-white'
                              : isLight
                              ? 'text-emerald-950 group-hover:text-[#022D24]'
                              : 'text-emerald-100 group-hover:text-white'
                          }`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-[10px] leading-none mt-0.5 truncate ${
                            isActive
                              ? 'text-amber-200 font-medium'
                              : isLight
                              ? 'text-emerald-700/70 group-hover:text-emerald-800 font-medium'
                              : 'text-emerald-300/60 group-hover:text-emerald-200 font-normal'
                          }`}
                        >
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {item.badge && item.badge > 0 && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            isLight
                              ? 'border-amber-500/40 bg-amber-500/20 text-amber-800'
                              : 'border-amber-400/40 bg-amber-500/20 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isLight
                              ? 'bg-amber-400 shadow-[0_0_6px_#F59E0B]'
                              : 'bg-amber-300 shadow-[0_0_8px_#FCD34D]'
                          }`}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Info & Footer */}
        <div
          className={`p-4 border-t ${
            isLight ? 'border-[#B2DFD0] bg-[#DBEFE5]/90' : 'border-[#0B4B3D] bg-[#011C16]/90'
          } space-y-3`}
        >
          <div
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border shadow-xs ${
              isLight
                ? 'border-emerald-300/80 bg-white/90 text-emerald-950'
                : 'border-[#0F5A4A] bg-[#032A22] text-white'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full ${
                isLight
                  ? 'bg-emerald-800 text-amber-200 border-amber-500/50'
                  : 'bg-gradient-to-br from-[#065E4D] to-[#023126] text-amber-300 border-amber-400/40'
              } border flex items-center justify-center font-bold text-xs shadow-md`}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-xs font-bold truncate ${
                  isLight ? 'text-[#022D24]' : 'text-white'
                }`}
              >
                {user?.name || 'Administrator'}
              </p>
              <p
                className={`text-[10px] font-semibold truncate flex items-center gap-1 ${
                  isLight ? 'text-amber-700' : 'text-amber-300'
                }`}
              >
                <ShieldCheck
                  className={`w-3 h-3 ${isLight ? 'text-emerald-700' : 'text-emerald-400'} inline`}
                />
                <span>Master Merchant</span>
              </p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors font-medium border ${
                isLight
                  ? 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-200/60 border-transparent hover:border-emerald-300/80'
                  : 'text-emerald-100 hover:text-white hover:bg-[#07473A]/60 border-transparent hover:border-[#135A4B]'
              }`}
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Visit Storefront</span>
              </div>
              <ExternalLink
                className={`w-3 h-3 ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}
              />
            </Link>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors text-left font-medium border ${
                isLight
                  ? 'text-rose-700 hover:text-rose-900 hover:bg-rose-100/70 border-transparent hover:border-rose-200'
                  : 'text-rose-300 hover:text-white hover:bg-rose-950/40 border-transparent hover:border-rose-800/40'
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
        <header
          className={`h-16 border-b ${
            isLight
              ? 'border-emerald-200/80 bg-[#F2FBF6]/90 shadow-xs'
              : 'border-[#1B2925] bg-[#070B0A]/85 shadow-md shadow-black/40'
          } backdrop-blur-xl px-3 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors`}
        >
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl shrink-0 ${
                isLight
                  ? 'text-emerald-900 hover:text-emerald-950 hover:bg-emerald-100'
                  : 'text-neutral-400 hover:text-white hover:bg-[#121E1B]'
              }`}
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Selected Page Breadcrumb / Indicator */}
            <div className="flex items-center gap-2 min-w-0">
              <div
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-xs truncate ${
                  isLight
                    ? 'bg-white/90 border-emerald-200 text-emerald-900 shadow-emerald-900/5'
                    : 'bg-[#0E1815] border-[#1B2925] text-neutral-300'
                }`}
              >
                <span className={`hidden sm:inline text-[11px] font-normal ${isLight ? 'text-emerald-700/70' : 'text-neutral-500'}`}>
                  Admin
                </span>
                <span className={`hidden sm:inline ${isLight ? 'text-emerald-300' : 'text-neutral-600'}`}>/</span>
                <div className="flex items-center gap-1.5 truncate">
                  <ActiveIcon className={`w-3.5 h-3.5 shrink-0 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`} />
                  <span className={`font-bold truncate ${isLight ? 'text-emerald-950' : 'text-white'}`}>
                    {activePage.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0" ref={popoverRef}>
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

              {/* Enhanced Notification Popover Panel */}
              {isNotificationsOpen && (
                <div
                  className={`fixed inset-x-3 top-16 max-w-sm mx-auto sm:static sm:absolute sm:inset-auto sm:right-0 sm:mt-3 sm:w-96 sm:max-w-none rounded-2xl border shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${
                    isLight
                      ? 'bg-white/98 border-slate-200 shadow-slate-900/10'
                      : 'bg-[#0D1614]/98 border-[#1B2925] shadow-black/80'
                  } backdrop-blur-xl`}
                >
                  <div
                    className={`p-3.5 border-b flex items-center justify-between ${
                      isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1B2925] bg-[#09110F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                      <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-800' : 'text-white'}`}>
                        Realtime Telemetry
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestChime}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border font-semibold transition-colors ${
                          isLight
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            : 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                        }`}
                      >
                        Test Chime
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-emerald-600 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-emerald-500/10">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Clock className={`w-8 h-8 mx-auto mb-2 opacity-40 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                        <p className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                          No dispatch signals logged yet
                        </p>
                        <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-600'}`}>
                          Listening for incoming orders...
                        </p>
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-3.5 flex items-start gap-3 transition-colors ${
                            item.read
                              ? isLight
                                ? 'bg-transparent opacity-75'
                                : 'bg-transparent opacity-60'
                              : isLight
                              ? 'bg-emerald-50/60'
                              : 'bg-emerald-950/20'
                          }`}
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

            {/* Live Storefront Link (Responsive Compact on Mobile) */}
            <Link
              href="/"
              target="_blank"
              title="View Storefront"
              className={`text-xs p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold shadow-xs border shrink-0 ${
                isLight
                  ? 'text-emerald-800 hover:text-emerald-900 border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80'
                  : 'text-neutral-300 hover:text-emerald-300 border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-950/70'
              }`}
            >
              <span className="hidden sm:inline">Storefront</span>
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </Link>
          </div>
        </header>

        {/* Main Content Area with Bottom Padding for Mobile Nav Bar */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">{children}</main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav
          className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${
            isLight
              ? 'bg-[#F2FBF6]/95 border-emerald-200 text-emerald-950 shadow-[0_-4px_20px_rgba(4,106,90,0.08)]'
              : 'bg-[#070B0A]/95 border-[#1B2925] text-neutral-200 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]'
          } backdrop-blur-xl px-2 py-1.5 flex items-center justify-around`}
          aria-label="Mobile Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                  isActive
                    ? isLight
                      ? 'text-[#065A49] font-bold scale-105'
                      : 'text-amber-300 font-bold scale-105'
                    : isLight
                    ? 'text-emerald-800/70 hover:text-emerald-950'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center px-0.5">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                  {item.name.split(' ')[0]}
                </span>
                {isActive && (
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isLight ? 'bg-emerald-600' : 'bg-amber-400'
                    }`}
                  />
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
