'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMuted, setIsMutedState] = useState(false);
  const [toastNotification, setToastNotification] = useState<AdminNotification | null>(null);

  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: 'mock-1',
      type: 'order',
      title: 'Royal Consignment #ORD-8821',
      message: 'New order for Dehn Al Oudh Royale & Kashmiri Rose (₹4,999)',
      timestamp: '2 mins ago',
      read: false,
      orderNumber: '8821',
      amount: 4999,
      link: '/admin/orders',
    },
    {
      id: 'mock-2',
      type: 'stock',
      title: 'Inventory Health Alert',
      message: 'Cambodian Agarwood flacons are running low (3 bottles remaining)',
      timestamp: '25 mins ago',
      read: false,
      link: '/admin/products',
    },
    {
      id: 'mock-3',
      type: 'system',
      title: 'System Dispatch Ready',
      message: 'Courier airway label automation is synchronized with Bluedart.',
      timestamp: '1 hour ago',
      read: true,
      link: '/admin/orders',
    },
  ]);

  const popoverRef = useRef<HTMLDivElement>(null);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const initialLoadRef = useRef(true);

  // Poll orders in background every 15s to detect live new orders
  const { data: ordersData } = useAdminOrders('All');

  // Load sound mute preference
  useEffect(() => {
    setIsMutedState(getSoundMuted());
  }, []);

  // Check for incoming orders & trigger sound chime and SaaS toast notification
  useEffect(() => {
    if (!ordersData?.orders) return;

    const orders = ordersData.orders;

    // On initial mount, populate the known order IDs without triggering chimes
    if (initialLoadRef.current) {
      orders.forEach((ord) => knownOrderIdsRef.current.add(ord._id));
      initialLoadRef.current = false;
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

  const navItems = [
    { name: 'SaaS Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Flacons & Products', href: '/admin/products', icon: Package },
    { name: 'Dynamic Categories', href: '/admin/categories', icon: Layers },
    { name: 'Consignment Orders', href: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAF8] text-neutral-900 flex font-poppins relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Real-time Order Popup Toast */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-60 animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm w-full">
          <div className="bg-white/95 backdrop-blur-md border border-emerald-300 rounded-2xl p-4 shadow-2xl flex items-start gap-3.5 ring-4 ring-emerald-500/10">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <ShoppingBag className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold text-neutral-900 truncate">
                  {toastNotification.title}
                </p>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  New
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
                {toastNotification.message}
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Link
                  href="/admin/orders"
                  onClick={() => setToastNotification(null)}
                  className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
                >
                  View Order <ChevronRight className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => setToastNotification(null)}
                  className="text-[10px] text-neutral-400 hover:text-neutral-600"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="text-neutral-400 hover:text-neutral-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Executive Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-emerald-100/90 flex flex-col justify-between transition-transform duration-300 shadow-xl lg:shadow-emerald-sm/40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-50">
            <Link href="/admin/dashboard" className="group block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  AD
                </div>
                <div>
                  <span className="font-poppins text-base font-bold tracking-[0.14em] text-neutral-900 uppercase block">
                    Attar Depot
                  </span>
                  <span className="text-[9px] tracking-[0.24em] text-emerald-700 uppercase font-semibold block">
                    SaaS Command
                  </span>
                </div>
              </div>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-neutral-400 hover:text-neutral-700 p-1.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SaaS Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Core Management
            </p>
            <nav className="space-y-1 text-xs font-semibold">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/60 text-emerald-900 border border-emerald-200/90 font-bold shadow-2xs translate-x-1'
                        : 'text-neutral-600 hover:text-emerald-800 hover:bg-emerald-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-neutral-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-xs" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick System Status Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              <span className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                Live Sync Engine
              </span>
              <span className="text-emerald-700">Healthy</span>
            </div>
            <p className="text-[11px] text-neutral-600">
              Real-time order poller & audio chime dispatch active.
            </p>
          </div>
        </div>

        {/* User Info & Footer */}
        <div className="p-4 border-t border-emerald-100 bg-[#F7FAF8] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-200 flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-neutral-900 truncate">
                {user?.name || 'Administrator'}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold truncate">
                Role: Master Merchant
              </p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-neutral-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors font-medium"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Visit Storefront</span>
              </div>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-left font-medium"
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
        <header className="h-16 border-b border-emerald-100 bg-white/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-100"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Attar SaaS Command
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                v2.4 Enterprise
              </span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3" ref={popoverRef}>
            {/* Audio Chime Mute/Unmute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Notification Sound' : 'Mute Notification Sound'}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50'
                  : 'border-emerald-200 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100/60'
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
                    ? 'border-emerald-400 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-emerald-100 text-neutral-700 hover:text-emerald-800 hover:bg-emerald-50/50'
                }`}
                aria-label="Toggle notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1 ring-2 ring-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-emerald-100 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Popover Header */}
                  <div className="p-4 border-b border-emerald-50 bg-[#F4FAF6] flex items-center justify-between">
                    <div>
                      <h3 className="font-poppins text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                        <span>Live Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.2 rounded-full font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </h3>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Real-time store consignments & alerts
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestChime}
                        className="text-[10px] text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 px-2 py-1 rounded-lg font-semibold shadow-2xs flex items-center gap-1 hover:bg-emerald-50"
                        title="Play audio chime preview"
                      >
                        <Volume2 className="w-3 h-3" />
                        Test Chime
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-neutral-500 hover:text-emerald-800 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Popover List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-neutral-50 text-xs">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-neutral-400">
                        No notifications currently.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((item) =>
                                item.id === n.id ? { ...item, read: true } : item
                              )
                            );
                            if (n.link) {
                              router.push(n.link);
                              setIsNotificationsOpen(false);
                            }
                          }}
                          className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 hover:bg-emerald-50/40 ${
                            !n.read ? 'bg-emerald-50/20' : 'bg-white'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              n.type === 'order'
                                ? 'bg-emerald-100 text-emerald-800'
                                : n.type === 'stock'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {n.type === 'order' ? (
                              <ShoppingBag className="w-3.5 h-3.5" />
                            ) : n.type === 'stock' ? (
                              <AlertCircle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p
                                className={`text-xs truncate ${
                                  !n.read ? 'font-bold text-neutral-900' : 'font-medium text-neutral-700'
                                }`}
                              >
                                {n.title}
                              </p>
                              <span className="text-[10px] text-neutral-400 flex-shrink-0">
                                {n.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                              {n.message}
                            </p>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Popover Footer */}
                  <div className="p-2.5 border-t border-emerald-50 bg-[#F4FAF6] text-center">
                    <Link
                      href="/admin/orders"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center justify-center gap-1"
                    >
                      View All Consignments <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Live Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="text-xs text-neutral-700 hover:text-emerald-800 border border-emerald-200/90 bg-emerald-50/40 hover:bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all font-semibold shadow-2xs"
            >
              <span>Storefront</span>
              <Sparkles className="w-3 h-3 text-emerald-700" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
