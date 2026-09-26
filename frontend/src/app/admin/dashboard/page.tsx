'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  Droplets,
  Layers,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Activity,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Crown,
  Radio,
  Plus,
  Compass,
  ExternalLink,
  BarChart3,
  PieChart,
  Zap,
  ArrowUp,
} from 'lucide-react';
import { useAdminStats, useAdminCustomers, useAdminOrders } from '@/hooks/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';
export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats();
  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];

  const { data: allOrdersData } = useAdminOrders('All');
  const allOrders = allOrdersData?.orders && allOrdersData.orders.length > 0 ? allOrdersData.orders : recentOrders;

  const { data: customersData, isLoading: isCustomersLoading } = useAdminCustomers();
  const customers = customersData?.customers || [];

  // Date filter state (Exact reference UI: All Dates | Today | 📅 Select Date ˅ | < | >)
  const [dateFilterMode, setDateFilterMode] = useState<'all' | 'today' | 'custom'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return 'Select Date';
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const handleDateFilterChange = (mode: 'all' | 'today') => {
    setDateFilterMode(mode);
    if (mode === 'today') {
      setSelectedDate(new Date().toISOString().split('T')[0]);
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
      setDateFilterMode('custom');
    }
  };

  const handleOpenDatePicker = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          dateInputRef.current.showPicker();
        } catch {
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const handleStepPrev = () => {
    const baseDate = dateFilterMode === 'all' || !selectedDate ? new Date() : new Date(selectedDate);
    baseDate.setDate(baseDate.getDate() - 1);
    const newDateStr = baseDate.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    setDateFilterMode('custom');
  };

  const handleStepNext = () => {
    const baseDate = dateFilterMode === 'all' || !selectedDate ? new Date() : new Date(selectedDate);
    baseDate.setDate(baseDate.getDate() + 1);
    const todayStr = new Date().toISOString().split('T')[0];
    const newDateStr = baseDate.toISOString().split('T')[0];
    setSelectedDate(newDateStr);
    if (newDateStr === todayStr) {
      setDateFilterMode('today');
    } else {
      setDateFilterMode('custom');
    }
  };

  // Filtered stats based on active date filter
  const displayedMetrics = useMemo(() => {
    if (dateFilterMode === 'all') {
      return {
        revenue: stats?.totalRevenue || 0,
        ordersCount: stats?.totalOrders || 0,
        pendingCount: stats?.pendingOrdersCount || 0,
        customersCount: customers.length || stats?.totalUsers || 0,
        subtextRevenue: 'lifetime revenue',
        subtextOrders: 'lifetime queue',
        badgeRevenue: '+18.4%',
      };
    }

    // Target date string (YYYY-MM-DD)
    const targetDateStr =
      dateFilterMode === 'today'
        ? new Date().toISOString().split('T')[0]
        : selectedDate;

    // Filter orders matching target date
    const dayOrders = allOrders.filter((ord) => {
      if (!ord.createdAt) return false;
      const ordDate = new Date(ord.createdAt).toISOString().split('T')[0];
      return ordDate === targetDateStr;
    });

    const dayRevenue = dayOrders.reduce((sum, ord) => sum + (ord.totalPrice || 0), 0);
    const dayPending = dayOrders.filter((ord) => ord.orderStatus === 'Pending').length;

    // Filter new customers on target date
    const dayCustomers = customers.filter((c) => {
      if (!c.createdAt) return false;
      return new Date(c.createdAt).toISOString().split('T')[0] === targetDateStr;
    });

    return {
      revenue: dayRevenue,
      ordersCount: dayOrders.length,
      pendingCount: dayPending,
      customersCount: dayCustomers.length,
      subtextRevenue: dateFilterMode === 'today' ? 'today total' : `on ${formatDisplayDate(targetDateStr)}`,
      subtextOrders: dateFilterMode === 'today' ? 'today dispatches' : `on ${formatDisplayDate(targetDateStr)}`,
      badgeRevenue: dayOrders.length > 0 ? `${dayOrders.length} order(s)` : '0 orders',
    };
  }, [dateFilterMode, selectedDate, stats, allOrders, customers]);


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter orders based on user query & status
  const filteredOrders = recentOrders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.shippingAddress?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || ord.orderStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const aov =
    stats?.totalOrders && stats.totalOrders > 0
      ? Math.round(stats.totalRevenue / stats.totalOrders)
      : 2499;

  // Customer details pagination state (Exactly 4 items per page as requested)
  const [customerPage, setCustomerPage] = useState(1);
  const customerPageSize = 4;
  const totalCustomerPages = Math.max(1, Math.ceil(customers.length / customerPageSize));
  const paginatedCustomers = useMemo(() => {
    const start = (customerPage - 1) * customerPageSize;
    return customers.slice(start, start + customerPageSize);
  }, [customers, customerPage]);

  // Animated Chart visual states
  const [chartMode, setChartMode] = useState<'acquisition' | 'spend' | 'retention'>('acquisition');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(5); // default to latest month

  // Telemetry computation for customer charts
  const customerAnalytics = useMemo(() => {
    const total = customers.length;
    const totalRevenue = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const withOrders = customers.filter((c) => (c.ordersCount || 0) > 0);
    const repeatBuyers = customers.filter((c) => (c.ordersCount || 0) >= 2);
    const vipBuyers = customers.filter((c) => (c.totalSpent || 0) >= 5000 || (c.ordersCount || 0) >= 5);
    const activeRate = total > 0 ? Math.round((withOrders.length / total) * 100) : 0;
    const repeatRate = withOrders.length > 0 ? Math.round((repeatBuyers.length / withOrders.length) * 100) : 0;
    const avgCustSpend = total > 0 ? Math.round(totalRevenue / total) : 0;

    // Monthly signups & spending buckets (Last 6 Months: Apr - Sep)
    const monthNames = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const now = new Date();
    const monthsData = monthNames.map((name, i) => {
      const targetMonthIndex = (now.getMonth() - (5 - i) + 12) % 12;
      const countInMonth = customers.filter((c) => {
        const d = new Date(c.createdAt);
        return d.getMonth() === targetMonthIndex;
      }).length;

      const userCount = Math.max(countInMonth, i === 5 ? total : Math.max(1, Math.round(total * (0.35 + i * 0.13))));
      const spendInMonth = Math.round(userCount * (totalRevenue > 0 ? totalRevenue / Math.max(1, total) : 2200) * (0.6 + i * 0.09));

      return {
        month: name,
        users: Math.max(1, userCount),
        spend: Math.max(800, spendInMonth),
      };
    });

    // Top spenders for leaderboard
    const topSpenders = [...customers]
      .sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0))
      .slice(0, 4);

    return {
      total,
      totalRevenue,
      withOrdersCount: withOrders.length,
      repeatBuyersCount: repeatBuyers.length,
      vipBuyersCount: vipBuyers.length,
      activeRate,
      repeatRate,
      avgCustSpend,
      monthsData,
      topSpenders,
    };
  }, [customers]);

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 pb-10">
      {/* ========================================================================= */}
      {/* 1. EXECUTIVE DATE FILTER TOOLBAR (Matches Reference Image)                */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-serif">
            Dashboard
          </h1>
          
        </div>

        {/* Date Filter Toolbar (Exact Match with Reference Image) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* All Dates Button */}
          <button
            type="button"
            onClick={() => handleDateFilterChange('all')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
              dateFilterMode === 'all'
                ? 'bg-[#E1ECF7] text-slate-950 font-black shadow-2xs ring-1 ring-slate-300/80'
                : 'bg-[#F0F5FA] text-slate-800 hover:bg-[#E4EDF7]'
            }`}
          >
            All Dates
          </button>

          {/* Today Button */}
          <button
            type="button"
            onClick={() => handleDateFilterChange('today')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
              dateFilterMode === 'today'
                ? 'bg-[#E1ECF7] text-slate-950 font-black shadow-2xs ring-1 ring-slate-300/80'
                : 'bg-[#F0F5FA] text-slate-800 hover:bg-[#E4EDF7]'
            }`}
          >
            Today
          </button>

          {/* Select Date Button */}
          <div className="relative">
            <button
              type="button"
              onClick={handleOpenDatePicker}
              className={`px-3.5 py-2 rounded-2xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer flex items-center gap-2 ${
                dateFilterMode === 'custom'
                  ? 'bg-[#E1ECF7] text-slate-950 font-black shadow-2xs ring-1 ring-slate-300/80'
                  : 'bg-[#F0F5FA] text-slate-800 hover:bg-[#E4EDF7]'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                {dateFilterMode === 'custom' && selectedDate
                  ? formatDisplayDate(selectedDate)
                  : 'Select Date'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={handleCustomDateChange}
              className="absolute inset-0 opacity-0 pointer-events-auto cursor-pointer w-full h-full"
            />
          </div>

          {/* Stepper (< | >) */}
          <div className="bg-[#F0F5FA] rounded-2xl px-2.5 py-1.5 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={handleStepPrev}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-3.5 bg-slate-300 mx-1.5" />
            <button
              type="button"
              onClick={handleStepNext}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REFINED KPI METRIC CARDS GRID (Modern Vibrant Luxury Gradients)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Gross Revenue - Sunlit Amber / Gold Luxury Gradient */}
        <div
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-xl shadow-amber-600/20 ring-1 ring-white/20 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-600/30"
        >
          {/* Subtle top light highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-amber-200/50 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[11px] font-bold text-amber-100">
              Gross Revenue
            </span>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {isLoading ? '...' : formatPrice(displayedMetrics.revenue)}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
              <TrendingUp className="w-3 h-3" /> {displayedMetrics.badgeRevenue}
            </span>
            <span className="text-[11px] font-medium text-amber-100/90">
              {displayedMetrics.subtextRevenue}
            </span>
          </div>
        </div>

        {/* Consignment Orders - Royal Emerald & Deep Teal Gradient */}
        <div
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 text-white shadow-xl shadow-emerald-700/20 ring-1 ring-white/20 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-700/30"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-emerald-200/50 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[11px] font-bold text-emerald-100">
              Total Orders
            </span>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {isLoading ? '...' : displayedMetrics.ordersCount}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {displayedMetrics.pendingCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                {displayedMetrics.pendingCount} pending dispatch
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                All fulfilled
              </span>
            )}
            <span className="text-[11px] font-medium text-emerald-100/90">
              {displayedMetrics.subtextOrders}
            </span>
          </div>
        </div>

        {/* Registered Customers & Clients - Radiant Rose & Sunset Pink Gradient */}
        <Link
          href="/admin/customers"
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 text-white shadow-xl shadow-rose-600/20 ring-1 ring-white/20 transition-all duration-300 relative overflow-hidden group block hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-600/30"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-rose-200/50 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[11px] font-bold text-rose-100">
              Registered Customers
            </span>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {isCustomersLoading ? '...' : displayedMetrics.customersCount}
            </p>
            <span className="text-xs font-semibold text-rose-100">
              {dateFilterMode === 'all' ? 'customers' : 'newCustomers'}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
              {customers.filter((c) => (c.ordersCount || 0) > 0).length} Repeat Buyers
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-rose-700 font-extrabold text-[11px] shadow-sm group-hover:bg-rose-50 group-hover:scale-105 transition-all">
              <span>View Directory</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 3. ATELIER CONTROL HUB - 4 LUXURY ACTION PANELS                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Product Catalog */}
        <Link
          href="/admin/products"
          className="p-4.5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 transition-all duration-300 group hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl hover:shadow-slate-900/10 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/20">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Product Catalog
              </p>
              <p className="text-[11px] mt-0.5 text-slate-600 font-medium">
                {stats?.totalProducts || 0} active flacons
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-emerald-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:shadow-sm">
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        {/* Panel 2: Categories & Taxonomy Hub */}
        <Link
          href="/admin/categories"
          className="p-4.5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 transition-all duration-300 group hover:-translate-y-1 hover:border-amber-500 hover:shadow-xl hover:shadow-slate-900/10 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-md shadow-amber-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                Taxonomy & Notes
              </p>
              <p className="text-[11px] mt-0.5 text-slate-600 font-medium">
                All-in-one catalog hub
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-amber-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:shadow-sm">
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        {/* Panel 3: Orders Queue */}
        <Link
          href="/admin/orders"
          className="p-4.5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 transition-all duration-300 group hover:-translate-y-1 hover:border-indigo-500 hover:shadow-xl hover:shadow-slate-900/10 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                Total Orders
              </p>
              <p className="text-[11px] mt-0.5 text-slate-600 font-medium">
                {stats?.totalOrders || 0} total consignments
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:shadow-sm">
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>

        {/* Panel 4: Customer Directory */}
        <Link
          href="/admin/customers"
          className="p-4.5 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 transition-all duration-300 group hover:-translate-y-1 hover:border-rose-500 hover:shadow-xl hover:shadow-slate-900/10 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-600/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
                Customer Directory
              </p>
              <p className="text-[11px] mt-0.5 text-slate-600 font-medium">
                {customers.length} registered Customers
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-rose-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all shadow-xs group-hover:shadow-sm">
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>




      {/* ========================================================================= */}
      {/* 5. CUSTOMER DIRECTORY & TELEMETRY (4 ITEMS PER PAGE WITH NUMBERED PAGINATION) */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-900/5 transition-all">
        {/* Table Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <h2 className="font-poppins text-base sm:text-lg font-bold tracking-tight text-slate-900">
                Customer Details
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                {customers.length} Registered
              </span>
             
            </div>
           
          </div>

          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold border border-emerald-600/30 bg-gradient-to-r from-emerald-600 to-teal-700 text-slate-50 hover:from-emerald-500 hover:to-teal-600 hover:shadow-md hover:shadow-emerald-700/20 active:scale-95 transition-all self-start sm:self-auto shadow-sm"
          >
            <span>Open Customer Console</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
          </Link>
        </div>

        {/* Mobile View: Customer View Cards (4 Per Page) */}
        <div className="md:hidden p-3.5 space-y-3">
          {isCustomersLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading customer data...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No customers registered yet.
            </div>
          ) : (
            paginatedCustomers.map((cust) => {
              const isVip = (cust.totalSpent || 0) >= 5000 || (cust.ordersCount || 0) >= 5;
              const addr =
                cust.latestShippingAddress || (cust.addresses && cust.addresses[0]) || null;
              return (
                <div
                  key={`mcust-${cust._id}`}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs uppercase border border-slate-200 bg-slate-100 text-slate-800 overflow-hidden shrink-0 shadow-xs">
                        {cust.avatar && !cust.avatar.includes('unsplash') ? (
                          <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{cust.name?.slice(0, 2).toUpperCase() || 'PT'}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-slate-900">{cust.name || 'Customer'}</p>
                          {isVip && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border bg-amber-50 text-amber-800 border-amber-300">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono">#{cust._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>

                    <Link
                      href="/admin/customers"
                      className="text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-xs inline-flex items-center gap-1 active:scale-95"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Customer Address Details */}
                  {addr && (
                    <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-slate-800">
                          {addr.street || addr.address ? `${addr.street || addr.address}, ` : ''}
                        </span>
                        <span>
                          {addr.city}{addr.state ? `, ${addr.state}` : ''}{addr.postalCode ? ` - ${addr.postalCode}` : ''}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Orders</span>
                      <span className="font-bold text-slate-900">{cust.ordersCount || 0}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Total Spend</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {formatPrice(cust.totalSpent || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Full Customer View Table (4 Per Page) */}
        <div className="hidden md:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/90 text-[10px] uppercase tracking-wider font-bold text-slate-600">
                <th className="py-3 px-4 sm:px-6">Customer</th>
                <th className="py-3 px-4">Contact Channels</th>
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spend</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {isCustomersLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-400">
                    Loading customer data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-400">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((cust) => {
                  const addr =
                    cust.latestShippingAddress || (cust.addresses && cust.addresses[0]) || null;
                  const isVip = (cust.totalSpent || 0) >= 5000 || (cust.ordersCount || 0) >= 5;

                  return (
                    <tr
                      key={cust._id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase border border-slate-200 bg-slate-100 text-slate-800 overflow-hidden shrink-0 shadow-xs">
                            {cust.avatar && !cust.avatar.includes('unsplash') ? (
                              <img
                                src={cust.avatar}
                                alt={cust.name}
                                className="w-full h-full object-cover shrink-0"
                              />
                            ) : (
                              <span>{cust.name?.slice(0, 2).toUpperCase() || 'PT'}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">
                                {cust.title ? `${cust.title}. ` : ''}
                                {cust.name || 'Customer'}
                              </span>
                              {isVip && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-amber-50 text-amber-800 border-amber-300">
                                  VIP
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                              #{cust._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {cust.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[140px] text-[11px] text-slate-700">
                                {cust.email}
                              </span>
                            </div>
                          )}
                          {cust.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="font-mono text-[10.5px] text-slate-700">
                                {cust.phone}
                              </span>
                            </div>
                          )}
                          {!cust.email && !cust.phone && (
                            <span className="text-[10px] italic text-slate-400">
                              No contact info
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {addr ? (
                          <div className="space-y-0.5 max-w-[200px]">
                            <div className="flex items-start gap-1.5 text-[11px] text-slate-800">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 mt-0.5" />
                              <span className="line-clamp-1 font-medium" title={addr.street || addr.address || ''}>
                                {addr.street || addr.address || `${addr.city}, ${addr.state}`}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 pl-5">
                              {addr.city}{addr.state ? `, ${addr.state}` : ''}{addr.postalCode ? ` - ${addr.postalCode}` : ''}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            <span>No address saved</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">
                          {cust.ordersCount || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-emerald-700">
                          {formatPrice(cust.totalSpent || 0)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] text-slate-500">
                          {formatDate(cust.createdAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Link
                          href="/admin/customers"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-emerald-300/80 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Numbered Pagination Footer (4 per page) */}
        {!isCustomersLoading && customers.length > 0 && (
          <div className="p-4 border-t border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{' '}
              <strong className="text-slate-800 font-bold">
                {(customerPage - 1) * customerPageSize + 1}
              </strong>{' '}
              -{' '}
              <strong className="text-slate-800 font-bold">
                {Math.min(customerPage * customerPageSize, customers.length)}
              </strong>{' '}
              of <strong className="text-slate-800 font-bold">{customers.length}</strong> customers
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 self-center sm:self-auto">
              <button
                type="button"
                onClick={() => setCustomerPage((p) => Math.max(1, p - 1))}
                disabled={customerPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer text-slate-700 shadow-xs"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalCustomerPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCustomerPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    customerPage === pageNum
                      ? 'bg-[#044e43] text-white shadow-xs'
                      : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCustomerPage((p) => Math.min(totalCustomerPages, p + 1))}
                disabled={customerPage === totalCustomerPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer text-slate-700 shadow-xs"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      



















      {/* ========================================================================= */}
      {/* 4. RECENT CONSIGNMENTS LIVE ACTIVITY TABLE CONSOLE                        */}
      {/* ========================================================================= */}
      <div
        className=" overflow-hidden  bg-white  rounded-3xl  transition-all"
      >
        {/* Table Header & Interactive Filter Controls */}
        <div
          className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
        >
          <div>
            <h2 className="font-poppins text-base font-bold tracking-tight flex items-center gap-2 text-slate-900">
              <span>Recent Orders</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                {recentOrders.length} latest orders
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search orders or Customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-600 w-full sm:w-60 font-poppins transition-all bg-white border border-slate-300 text-slate-900 placeholder-slate-400 font-medium shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex gap-1 p-1 rounded-xl text-xs font-medium border border-slate-300/80 bg-slate-100/90 overflow-x-auto shadow-inner">
              {['All', 'Pending', 'Processing', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap text-xs ${
                    statusFilter === st
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold shadow-sm shadow-emerald-700/25 ring-1 ring-emerald-500/40'
                      : 'text-slate-700 hover:text-slate-950 font-bold hover:bg-white/90'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-extrabold flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-700/20 border border-emerald-600/30 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 hover:shadow-md hover:shadow-emerald-700/30 active:scale-95 whitespace-nowrap"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
            </Link>
          </div>
        </div>

        {/* Mobile View: High-End Responsive Consignment Cards */}
        <div className="md:hidden p-3.5 space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Retrieving live consignments...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No orders matching criteria
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const CustomerName = ord.shippingAddress?.fullName || 'Guest Customer';
              return (
                <div
                  key={`m-${ord._id}`}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-slate-900">#{ord.orderNumber}</span>
                      <span className="text-[10px] text-slate-400 block">{formatDate(ord.createdAt)}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : ord.orderStatus === 'Processing'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {ord.orderStatus}
                    </span>
                  </div>

                  {/* Delivery Address in Mobile Card */}
                  {ord.shippingAddress && (
                    <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium text-slate-800">
                          {ord.shippingAddress.address ? `${ord.shippingAddress.address}, ` : ''}
                        </span>
                        <span>
                          {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.postalCode}
                        </span>
                        {ord.shippingAddress.phone && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Ph: +91 {ord.shippingAddress.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900">{CustomerName}</p>
                      <p className="text-[10px] text-slate-500">{ord.orderItems?.length || 0} flacon item(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-poppins font-bold text-sm text-emerald-700">
                        {formatPrice(ord.totalPrice)}
                      </p>
                      <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300/80 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-xs mt-1 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Full Data-Dense Consignment Table */}
        <div className="hidden md:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead
              className="uppercase tracking-wider font-bold border-b border-slate-200/80 bg-slate-50/90 text-[11px] text-slate-600"
            >
              <tr>
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Flacons Ordered</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500">
                        Retrieving live consignments from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="font-semibold text-xs text-slate-800">
                        No orders matching criteria
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {statusFilter !== 'All'
                          ? `No orders currently marked as "${statusFilter}".`
                          : 'New consignments will appear here automatically in real time.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const CustomerName = ord.shippingAddress?.fullName || 'Guest Customer';
                  const initials = CustomerName
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr
                      key={ord._id}
                      className="transition-colors hover:bg-slate-50/70 group"
                    >
                      <td className="p-4 pl-6">
                        <div className="font-mono font-bold flex items-center gap-1.5 text-slate-900">
                          <span className="text-emerald-600">#</span>
                          <span>{ord.orderNumber}</span>
                        </div>
                        <p className="text-[10px] mt-0.5 text-slate-500">
                          {formatDate(ord.createdAt)}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full font-bold text-[10px] flex items-center justify-center flex-shrink-0 border border-slate-200 bg-slate-100 text-slate-800 shadow-xs">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {CustomerName}
                            </p>
                            {ord.shippingAddress?.phone && (
                              <p className="text-[10px] text-slate-400 font-mono">
                                +91 {ord.shippingAddress.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {ord.shippingAddress ? (
                          <div className="space-y-0.5 max-w-[210px]">
                            <div className="flex items-start gap-1.5 text-[11px] text-slate-800">
                              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-emerald-600 mt-0.5" />
                              <span
                                className="font-medium line-clamp-1"
                                title={ord.shippingAddress.address || ''}
                              >
                                {ord.shippingAddress.address || 'Standard Address'}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 pl-5">
                              {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.postalCode}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-300" />
                            <span>No address specified</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 min-w-[200px]">
                        <div className="flex items-center gap-2.5">
                          {/* Image Thumbnail */}
                          {(() => {
                            const firstItem = ord.orderItems?.[0];
                            const imgUrl =
                              firstItem?.image ||
                              firstItem?.product?.images?.[0] ||
                              'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=300';
                            return (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white shadow-2xs">
                                <img
                                  src={imgUrl}
                                  alt={firstItem?.name || 'Product'}
                                  className="w-full h-full object-cover"
                                />
                                {(ord.orderItems?.length || 0) > 1 && (
                                  <span className="absolute bottom-0 right-0 bg-slate-900/90 text-white font-mono text-[8px] font-bold px-1 rounded-tl-sm">
                                    +{(ord.orderItems?.length || 0) - 1}
                                  </span>
                                )}
                              </div>
                            );
                          })()}

                          <div className="min-w-0 flex-1">
                            <p
                              className="text-xs font-bold text-slate-900 truncate"
                              title={ord.orderItems?.map((i: any) => i.name).join(', ')}
                            >
                              {ord.orderItems?.[0]?.name || `${ord.orderItems?.length || 0} items`}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium">
                              {ord.orderItems?.[0]?.size ? `${ord.orderItems[0].size} • ` : ''}Qty: {ord.orderItems?.[0]?.quantity || 1}
                              {(ord.orderItems?.length || 0) > 1 ? ` (+${(ord.orderItems?.length || 0) - 1} more)` : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-poppins font-bold text-sm text-emerald-700 block">
                          {formatPrice(ord.totalPrice)}
                        </span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {ord.paymentMethod || 'Prepaid'}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                              ord.paymentStatus === 'Completed'
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                                : 'bg-amber-100 text-amber-950 border-amber-300'
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${
                                ord.paymentStatus === 'Completed' ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
                              }`}
                            />
                            {ord.paymentStatus === 'Completed' ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        {(() => {
                          const status = ord.orderStatus;
                          const config =
                            status === 'Delivered'
                              ? {
                                  label: 'Delivered',
                                  bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
                                  dot: 'bg-emerald-600',
                                  dispatchText: 'Delivered',
                                }
                              : status === 'Shipped'
                              ? {
                                  label: 'Dispatched',
                                  bg: 'bg-purple-100 text-purple-950 border-purple-300 font-bold',
                                  dot: 'bg-purple-600 animate-pulse',
                                  dispatchText: 'In Transit',
                                }
                              : status === 'Processing'
                              ? {
                                  label: 'Processing',
                                  bg: 'bg-sky-100 text-sky-950 border-sky-300',
                                  dot: 'bg-sky-500',
                                  dispatchText: 'Packing',
                                }
                              : status === 'Cancelled'
                              ? {
                                  label: 'Cancelled',
                                  bg: 'bg-rose-100 text-rose-950 border-rose-300',
                                  dot: 'bg-rose-600',
                                  dispatchText: 'Voided',
                                }
                              : {
                                  label: 'Pending',
                                  bg: 'bg-amber-100 text-amber-950 border-amber-300',
                                  dot: 'bg-amber-500 animate-pulse',
                                  dispatchText: 'Awaiting',
                                };

                          return (
                            <div className="space-y-1">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-2xs ${config.bg}`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                                {config.label}
                              </span>
                              <p className="text-[10px] text-slate-500 font-medium">
                                Dispatch: {config.dispatchText}
                              </p>
                            </div>
                          );
                        })()}
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-xs border border-emerald-300/80 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-sm active:scale-95"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    
    </div>
  );
}
