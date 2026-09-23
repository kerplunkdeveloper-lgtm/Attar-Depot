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
  UserCheck,
  Camera,
  Trash2,
  Loader2,
  Upload,
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
import { useUploadAvatar, useUpdateProfile } from '@/hooks/useProfile';
import { toast } from '@/lib/toast';
import { getQueryClient } from '@/components/providers/Providers';
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

  // Avatar upload & profile mutations
  const uploadAvatarMutation = useUploadAvatar();
  const updateProfileMutation = useUpdateProfile();
  const headerFileInputRef = useRef<HTMLInputElement>(null);
  const sidebarFileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WEBP).', { title: 'Invalid Image' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB.', { title: 'File Too Large' });
      return;
    }

    try {
      await uploadAvatarMutation.mutateAsync(file);
      toast.success('Admin avatar updated successfully!', { title: 'Avatar Saved' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar.', { title: 'Upload Failed' });
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar) return;
    try {
      await updateProfileMutation.mutateAsync({ avatar: '' });
      toast.success('Profile photo removed successfully.', { title: 'Photo Removed' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove avatar.', { title: 'Action Failed' });
    }
  };

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
          message: 'Admin session terminated securely.',
          options: {
            title: 'Logged Out Successfully',
          },
        })
      );
    }

    // 3. Fire backend logout in background without awaiting or blocking UI
    api.post('/auth/logout').catch((e) => console.error(e));
    getQueryClient().clear();

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
    {
      label: 'Account & Settings',
      items: [
        {
          name: 'Profile',
          href: '/admin/profile',
          icon: UserCheck,
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
        backgroundColor: '#FAF8F5',
        backgroundImage: `
          radial-gradient(circle at 12% 8%, rgba(209, 250, 229, 0.45) 0%, transparent 45%),
          radial-gradient(circle at 88% 18%, rgba(254, 243, 199, 0.45) 0%, transparent 45%),
          radial-gradient(circle at 50% 85%, rgba(236, 253, 245, 0.50) 0%, transparent 55%),
          linear-gradient(rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.88)),
          url('/images/luxury-marble-bg.jpg')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
      className="min-h-screen flex font-poppins relative text-slate-800 selection:bg-emerald-600 selection:text-white transition-colors duration-300"
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed top-16 left-60 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none bg-emerald-500/10 opacity-60" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none bg-amber-400/10 opacity-50" />

      {/* Real-time Order Popup Toast */}
      {toastNotification && (
        <div className="fixed top-5 right-5 z-[80] animate-in slide-in-from-top-4 fade-in duration-300 max-w-sm w-full">
          <div
            className="border border-slate-200/90 bg-white/95 text-slate-900 shadow-2xl shadow-emerald-950/10 ring-1 ring-emerald-500/20 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <ShoppingBag className="w-5 h-5 animate-pulse text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <p className="text-xs font-bold truncate text-slate-900">
                  {toastNotification.title}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-800 border-emerald-300">
                  New
                </span>
              </div>
              <p className="text-[11px] mt-0.5 leading-snug text-slate-600">
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
                  className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => setToastNotification(null)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-in fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* 1. ROYAL EMERALD LUXURY ADMIN SIDEBAR (Attractive Green, Modern UI/UX)    */}
      {/* ========================================================================= */}
      <aside
        style={{
          background: 'linear-gradient(180deg, #053b2f 0%, #042e25 50%, #021f19 100%)',
        }}
        className={`admin-sidebar fixed top-0 bottom-0 left-0 z-50 ${
          isSidebarCollapsed ? 'lg:w-16' : 'lg:w-56'
        } w-60 border-r border-emerald-800/80 text-white flex flex-col justify-between transition-all duration-300 shadow-[4px_0_30px_rgba(2,31,25,0.45)] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-4 overflow-y-auto scrollbar-none flex-1">
          {/* Logo & Brand Identity */}
          <div className="relative flex items-center justify-between pb-3 border-b border-emerald-800/60">
            <Link
              href="/admin/dashboard"
              className="group flex items-center justify-center flex-1 min-w-0 transition-transform duration-200"
            >
              {!isSidebarCollapsed ? (
                <div className="flex items-center justify-center w-full py-2 px-1">
                  <Image
                    src="/images/logonew.png"
                    alt="The Attar Depot"
                    width={220}
                    height={90}
                    priority
                    className="h-16 sm:h-18 max-h-22 w-auto object-contain brightness-105 contrast-105 drop-shadow-[0_2px_16px_rgba(245,180,24,0.4)] group-hover:scale-105 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center py-2">
                  <Image
                    src="/images/logonew.png"
                    alt="The Attar Depot"
                    width={52}
                    height={52}
                    priority
                    className="h-10 w-auto object-contain brightness-105 drop-shadow-[0_2px_10px_rgba(245,180,24,0.4)] group-hover:scale-110 transition-all duration-300"
                  />
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute right-0 top-1 p-1 rounded-lg !text-emerald-300 hover:!text-white hover:bg-emerald-800/60 transition-colors"
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
                  <div className="flex items-center gap-1.5 px-2.5 pt-1.5 pb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                    <p className="text-[10px] font-bold uppercase tracking-wider !text-emerald-300/80">
                      {group.label}
                    </p>
                  </div>
                )}
                <nav className="space-y-1 text-xs font-medium">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        title={isSidebarCollapsed ? item.name : undefined}
                        className={`group relative flex items-center ${
                          isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
                        } rounded-xl transition-all duration-200 border ${
                          isActive
                            ? 'admin-nav-active border-emerald-400/50 translate-x-0.5'
                            : 'admin-nav-inactive border-transparent hover:translate-x-0.5'
                        }`}
                      >
                        {/* Active Left Indicator Bar */}
                        {isActive && !isSidebarCollapsed && (
                          <span className="absolute -left-1 top-2 bottom-2 w-1.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-[0_0_10px_#F59E0B]" />
                        )}

                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${
                              isActive
                                ? '!text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]'
                                : '!text-emerald-300 group-hover:!text-white group-hover:scale-110'
                            }`}
                          />
                          {!isSidebarCollapsed && (
                            <span
                              className={`truncate text-xs tracking-wide transition-colors ${
                                isActive ? '!text-white font-bold drop-shadow-xs' : '!text-emerald-100 group-hover:!text-white'
                              }`}
                            >
                              {item.name}
                            </span>
                          )}
                        </div>

                        {!isSidebarCollapsed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && item.badge > 0 && (
                              <span
                                className={`px-2 py-0.5 text-[9px] font-black rounded-full transition-all ${
                                  isActive
                                    ? 'bg-amber-400 text-slate-950 shadow-[0_2px_8px_rgba(245,158,11,0.5)]'
                                    : 'bg-emerald-800/90 text-emerald-100 border border-emerald-600/50'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#F59E0B] animate-pulse" />
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
          className="relative p-2.5 border-t border-emerald-800/80 bg-[#021813]/90 space-y-1.5 shrink-0"
        >
          {!isSidebarCollapsed ? (
            <>
              {/* User Profile Mini Row */}
              <div className="flex items-center justify-between px-1 py-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative group/sideavatar shrink-0">
                    <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-amber-400/50 shadow-md bg-emerald-950 flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user?.name || 'Admin'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                      )}
                    </div>
                    {/* Quick Camera Upload Button */}
                    <button
                      type="button"
                      onClick={() => sidebarFileInputRef.current?.click()}
                      disabled={uploadAvatarMutation.isPending}
                      title="Upload/Change Photo"
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-xs ring-1 ring-[#021813] transition-transform hover:scale-110 cursor-pointer"
                    >
                      {uploadAvatarMutation.isPending ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        <Camera className="w-2.5 h-2.5" />
                      )}
                    </button>
                  </div>

                  <Link
                    href="/admin/profile"
                    title="Open Profile Page"
                    className="min-w-0 group/namelink hover:opacity-90 transition-opacity"
                  >
                    <p className="text-xs font-bold !text-white truncate leading-tight group-hover/namelink:underline">
                      {user?.name || 'Administrator'}
                    </p>
                    <p className="text-[10px] !text-emerald-300 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 !text-emerald-400 shrink-0" />
                      <span>Master Admin</span>
                    </p>
                  </Link>
                </div>

                {/* Desktop Collapse Toggle */}
                <button
                  onClick={() => setIsSidebarCollapsed(true)}
                  title="Collapse Sidebar"
                  className="hidden lg:flex p-1 rounded-lg !text-emerald-300/70 hover:!text-white hover:bg-white/10 transition-colors"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Actions Row */}
              <div className="pt-1 flex items-center gap-1.5">
                <Link
                  href="/"
                  target="_blank"
                  title="Open live storefront"
                  className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold !text-emerald-100 hover:!text-white bg-emerald-900/60 hover:bg-emerald-600 border border-emerald-600/50 shadow-xs transition-all duration-200"
                >
                  <ExternalLink className="w-3.5 h-3.5 !text-emerald-300" />
                  <span>Store</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Exit Admin Portal"
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold !text-rose-100 hover:!text-white bg-rose-950/60 hover:bg-rose-600 border border-rose-600/50 shadow-xs transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 !text-rose-300" />
                  <span>Exit</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                title="Expand Sidebar"
                className="p-1.5 rounded-lg !text-emerald-300/70 hover:!text-white hover:bg-white/10 transition-colors"
              >
                <PanelLeft className="w-4 h-4" />
              </button>

              <div className="relative group/colavatar">
                <div
                  title={user?.name || 'Administrator'}
                  className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-amber-400/50 shadow-md bg-emerald-950 flex items-center justify-center"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'Admin'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => sidebarFileInputRef.current?.click()}
                  title="Upload/Change Photo"
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs cursor-pointer hover:bg-amber-300"
                >
                  <Camera className="w-2.5 h-2.5" />
                </button>
              </div>

              <button
                onClick={handleLogout}
                title="Exit Admin Portal"
                className="p-1.5 rounded-lg !text-rose-300 hover:!text-rose-100 hover:bg-rose-900/50 transition-colors"
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
        className={`flex-1 ${
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-56'
        } flex flex-col min-h-screen transition-all duration-300`}
      >
        {/* Top Navbar */}
        <header
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
          }}
          className="h-16 border-b border-slate-200/80 shadow-xs backdrop-blur-xl px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors text-slate-800"
        >
          {/* Left: Mobile Trigger + Breadcrumb + Status Badge */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl shrink-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation Pill */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-100/90 text-xs font-medium shadow-xs truncate">
                <span className="hidden sm:inline text-[11px] font-medium text-slate-500">
                  Admin
                </span>
                <span className="hidden sm:inline text-slate-300">/</span>
                <div className="flex items-center gap-1.5 truncate">
                  <ActiveIcon className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span className="font-bold truncate text-slate-900 tracking-wide">
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
                  ? 'border-slate-300 bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 shadow-xs'
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
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                    : 'border-slate-300 bg-white text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 shadow-xs'
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
                  className="fixed inset-x-3 top-16 max-w-sm mx-auto sm:static sm:absolute sm:inset-auto sm:right-0 sm:mt-3 sm:w-96 sm:max-w-none rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-2xl"
                >
                  <div className="p-3.5 border-b border-slate-200/80 bg-slate-50/90 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Realtime Telemetry
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestChime}
                        className="text-[10px] px-2 py-0.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-semibold transition-colors shadow-xs"
                      >
                        Test Chime
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[10px] text-emerald-700 hover:text-emerald-900 hover:underline font-semibold"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                        <p className="text-xs font-medium text-slate-600">
                          No dispatch signals logged yet
                        </p>
                        <p className="text-[10px] mt-0.5 text-slate-400">
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
                              : 'bg-emerald-50/40'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-xs font-bold truncate text-slate-900">
                                {item.title}
                              </p>
                              <span className="text-[9px] text-slate-400">{item.timestamp}</span>
                            </div>
                            <p className="text-[11px] mt-0.5 leading-snug line-clamp-2 text-slate-600">
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
                                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline mt-1.5 inline-flex items-center gap-1"
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
              className="text-xs p-2 sm:px-3.5 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all font-bold shadow-xs border border-emerald-300/90 bg-emerald-50/80 text-emerald-900 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shrink-0"
            >
              <span className="hidden sm:inline">Storefront</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 group-hover:text-amber-300 shrink-0" />
            </Link>

            {/* Admin Avatar Profile Menu Trigger */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:pl-1.5 sm:pr-3 sm:py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-xs transition-all font-semibold cursor-pointer"
                aria-label="Admin Profile Options"
              >
                <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-xs bg-emerald-900 flex items-center justify-center">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || 'Admin'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-bold text-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold leading-tight truncate max-w-[90px] text-slate-900">
                    {user?.name || 'Admin'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu with Avatar Actions */}
              {isAdminDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white/95 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-3 border-b border-slate-200/80 mb-2 rounded-xl bg-slate-50 flex items-center gap-3">
                    <div className="relative group/avatar shrink-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-emerald-500/30 shadow-sm bg-slate-100 flex items-center justify-center">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user?.name || 'Admin'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center font-bold text-base">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                        )}
                      </div>
                      {/* Quick Camera Overlay Icon on Avatar */}
                      <button
                        type="button"
                        onClick={() => headerFileInputRef.current?.click()}
                        disabled={uploadAvatarMutation.isPending}
                        title="Upload/Change Photo"
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md ring-2 ring-white transition-transform hover:scale-110 cursor-pointer"
                      >
                        {uploadAvatarMutation.isPending ? (
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Camera className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold truncate text-slate-900">
                        {user?.name || 'Master Administrator'}
                      </p>
                      <p className="text-[10px] truncate text-slate-500">
                        {user?.email || 'admin@attardepot.com'}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Super Admin
                      </span>
                    </div>
                  </div>

                  {/* Photo Actions Row (Upload & Delete) */}
                  <div className="grid grid-cols-2 gap-1.5 pb-2 mb-2 border-b border-slate-200/80">
                    <button
                      type="button"
                      onClick={() => headerFileInputRef.current?.click()}
                      disabled={uploadAvatarMutation.isPending}
                      className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-500 shadow-xs transition-colors cursor-pointer"
                    >
                      {uploadAvatarMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Camera className="w-3 h-3" />
                      )}
                      <span>{user?.avatar ? 'Change' : 'Upload'}</span>
                    </button>

                    {user?.avatar ? (
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={updateProfileMutation.isPending}
                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 border border-rose-500 shadow-xs transition-colors cursor-pointer"
                      >
                        {updateProfileMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                        <span>Remove</span>
                      </button>
                    ) : (
                      <Link
                        href="/admin/profile"
                        onClick={() => setIsAdminDropdownOpen(false)}
                        className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-xs transition-colors"
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>Profile</span>
                      </Link>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <Link
                      href="/admin/profile"
                      onClick={() => setIsAdminDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-emerald-50 text-slate-800 hover:text-emerald-800"
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Profile & Security</span>
                      </span>
                      <ChevronRight className="w-3 h-3 opacity-60 text-slate-400" />
                    </Link>

                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setIsAdminDropdownOpen(false)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-emerald-50 text-slate-800 hover:text-emerald-800"
                    >
                      <span className="flex items-center gap-2">
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                        <span>View Live Store</span>
                      </span>
                      <ChevronRight className="w-3 h-3 opacity-60 text-slate-400" />
                    </Link>

                    <button
                      onClick={() => {
                        setIsAdminDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-700 hover:text-white hover:bg-rose-600 border border-rose-200 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Exit Admin Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden File Inputs for Header and Sidebar Profile Photo Upload */}
            <input
              ref={headerFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={handleAvatarFileSelect}
            />
            <input
              ref={sidebarFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={handleAvatarFileSelect}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-8xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <nav
          style={{
            background: 'linear-gradient(180deg, #053b2f 0%, #03271f 100%)',
          }}
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-800/80 shadow-[0_-4px_24px_rgba(2,31,25,0.4)] backdrop-blur-xl px-2 py-1.5 flex items-center justify-around"
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
                    ? 'text-white font-bold scale-105'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-white drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)]' : 'text-emerald-300/80'
                    }`}
                  />
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] bg-amber-400 text-slate-950 rounded-full text-[9px] font-black flex items-center justify-center px-0.5 shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] tracking-tight mt-0.5 whitespace-nowrap ${isActive ? 'text-white font-bold' : 'text-emerald-200/75'}`}>
                  {item.name.split(' ')[0]}
                </span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full mt-0.5 bg-amber-300 shadow-[0_0_6px_#F59E0B]" />
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
