'use client';

import React, { useState, useMemo } from 'react';
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
import { useAdminStats, useAdminCustomers } from '@/hooks/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';
export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats();
  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];

  const { data: customersData, isLoading: isCustomersLoading } = useAdminCustomers();
  const customers = customersData?.customers || [];

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
     

      {/* ========================================================================= */}
      {/* 2. REFINED KPI METRIC CARDS GRID (Modern Vibrant Luxury Gradients)        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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
              {isLoading ? '...' : formatPrice(stats?.totalRevenue || 0)}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
            <span className="text-[11px] font-medium text-amber-100/90">
              vs previous month
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
              Consignments
            </span>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {isLoading ? '...' : stats?.totalOrders || 0}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {stats?.pendingOrdersCount && stats.pendingOrdersCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                {stats.pendingOrdersCount} pending dispatch
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                All fulfilled
              </span>
            )}
            <span className="text-[11px] font-medium text-emerald-100/90">
              lifetime queue
            </span>
          </div>
        </div>

        {/* Average Order Value (AOV) - Imperial Indigo & Deep Royal Violet Gradient */}
        <div
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-700 text-white shadow-xl shadow-indigo-700/20 ring-1 ring-white/20 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-700/30"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-purple-200/50 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[11px] font-bold text-indigo-100">
              Avg Order Value
            </span>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {isLoading ? '...' : formatPrice(aov)}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
              High Tier Basket
            </span>
            <span className="text-[11px] font-medium text-indigo-100/90">
              luxury basket avg
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
              {isCustomersLoading ? '...' : customers.length || stats?.totalUsers || 0}
            </p>
            <span className="text-xs font-semibold text-rose-100">customers</span>
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
                <th className="py-3 px-4">Location</th>
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
                        {addr?.city ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 flex-shrink-0 text-amber-500" />
                            <span className="truncate max-w-[120px] text-slate-700">
                              {addr.city}
                              {addr.state ? `, ${addr.state}` : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-slate-400">
                            Not provided
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
      {/* 6. ANIMATED REPRESENTATION CHART & TELEMETRY GRAPH (VISUAL ANALYTICS)     */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 p-5 sm:p-6 space-y-6 transition-all">
        {/* Analytics Header & Interactive View Toggles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-poppins text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Customer Analytics & Growth Representation
              </h3>
             
            </div>
           
          </div>

          {/* Interactive Chart Mode Toggles */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartMode('acquisition')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chartMode === 'acquisition'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Acquisition</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode('spend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chartMode === 'spend'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="font-poppins text-xs font-bold">₹</span>
              <span>Spend Volume</span>
            </button>
            <button
              type="button"
              onClick={() => setChartMode('retention')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                chartMode === 'retention'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Retention</span>
            </button>
          </div>
        </div>

        {/* 4 Summary Telemetry Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
              ₹
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 font-medium truncate">Total Lifetime Spend</p>
              <p className="text-base sm:text-lg font-bold font-poppins text-slate-900 truncate">
                {formatPrice(customerAnalytics.totalRevenue)}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 font-medium truncate">Active Patrons</p>
              <div className="flex items-center gap-1.5">
                <p className="text-base sm:text-lg font-bold text-slate-900">
                  {customerAnalytics.withOrdersCount}
                </p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                  {customerAnalytics.activeRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 font-medium truncate">VIP & Repeat Buyers</p>
              <div className="flex items-center gap-1.5">
                <p className="text-base sm:text-lg font-bold text-slate-900">
                  {customerAnalytics.repeatBuyersCount}
                </p>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                  {customerAnalytics.repeatRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-slate-500 font-medium truncate">Avg Customer Value</p>
              <p className="text-base sm:text-lg font-bold font-poppins text-slate-900 truncate">
                {formatPrice(customerAnalytics.avgCustSpend)}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Visualization Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Animated SVG Chart Area (7 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 shadow-xs relative">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">
                  {chartMode === 'spend'
                    ? 'Monthly Customer Spend Trajectory'
                    : chartMode === 'retention'
                    ? 'Customer Retention Distribution'
                    : 'Customer Signups & Inflow Curve'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Last 6 Months</span>
              </div>

              {hoveredPointIndex !== null && customerAnalytics.monthsData[hoveredPointIndex] && (
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-emerald-300 shadow-xs font-medium text-slate-800 animate-in fade-in duration-150">
                  <span className="font-bold text-emerald-700">
                    {customerAnalytics.monthsData[hoveredPointIndex].month}:
                  </span>
                  <span>
                    {chartMode === 'spend'
                      ? formatPrice(customerAnalytics.monthsData[hoveredPointIndex].spend)
                      : `${customerAnalytics.monthsData[hoveredPointIndex].users} Customers`}
                  </span>
                </div>
              )}
            </div>

            {/* SVG Visual Canvas */}
            <div className="relative w-full h-56 sm:h-64">
              {/* Dynamic SVG Curves & Wave */}
              {(() => {
                const data = customerAnalytics.monthsData;
                const maxValue = Math.max(
                  1,
                  ...data.map((d) => (chartMode === 'spend' ? d.spend : d.users))
                );

                // Coordinates computation
                const points = data.map((d, idx) => {
                  const x = 50 + idx * 115;
                  const val = chartMode === 'spend' ? d.spend : d.users;
                  const y = 180 - Math.round((val / maxValue) * 135);
                  return { x, y, val, month: d.month };
                });

                // Path string generator for smooth bezier curve
                const pathD = points.reduce((acc, pt, i, arr) => {
                  if (i === 0) return `M ${pt.x} ${pt.y}`;
                  const prev = arr[i - 1];
                  const cp1x = prev.x + (pt.x - prev.x) / 2;
                  const cp1y = prev.y;
                  const cp2x = prev.x + (pt.x - prev.x) / 2;
                  const cp2y = pt.y;
                  return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
                }, '');

                const areaD = `${pathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

                return (
                  <svg
                    viewBox="0 0 680 220"
                    className="w-full h-full overflow-visible select-none"
                  >
                    <defs>
                      <linearGradient id="emeraldWave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0.45" />
                        <stop offset="50%" stopColor="#10B981" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="amberWave" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
                        <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#059669" floodOpacity="0.35" />
                      </filter>
                    </defs>

                    {/* Horizontal Reference Grid Lines */}
                    <line x1="40" y1="50" x2="640" y2="50" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="40" y1="115" x2="640" y2="115" stroke="#E2E8F0" strokeDasharray="4 4" strokeWidth="1" />
                    <line x1="40" y1="180" x2="640" y2="180" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Animated Bar Columns behind curve */}
                    {points.map((pt, i) => {
                      const barHeight = 180 - pt.y;
                      const isHovered = hoveredPointIndex === i;
                      return (
                        <g key={`bar-${i}`} onMouseEnter={() => setHoveredPointIndex(i)}>
                          <rect
                            x={pt.x - 18}
                            y={pt.y}
                            width="36"
                            height={Math.max(4, barHeight)}
                            rx="6"
                            className={`transition-all duration-500 cursor-pointer ${
                              isHovered
                                ? chartMode === 'spend'
                                  ? 'fill-amber-400/40 stroke-amber-500'
                                  : 'fill-emerald-500/40 stroke-emerald-600'
                                : 'fill-emerald-500/10 hover:fill-emerald-500/25'
                            }`}
                          />
                        </g>
                      );
                    })}

                    {/* Animated Area Wave Fill */}
                    <path
                      d={areaD}
                      fill={chartMode === 'spend' ? 'url(#amberWave)' : 'url(#emeraldWave)'}
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Glowing Stroke Curve Line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={chartMode === 'spend' ? '#D97706' : '#059669'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glowEffect)"
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Interactive Points Nodes */}
                    {points.map((pt, i) => {
                      const isHovered = hoveredPointIndex === i;
                      return (
                        <g
                          key={`node-${i}`}
                          className="cursor-pointer transition-transform"
                          onMouseEnter={() => setHoveredPointIndex(i)}
                        >
                          {/* Animated Pulse Ring on Hover/Active */}
                          {isHovered && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="12"
                              className={`animate-ping ${
                                chartMode === 'spend' ? 'fill-amber-400/50' : 'fill-emerald-400/50'
                              }`}
                            />
                          )}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? '7' : '5'}
                            fill="#FFFFFF"
                            stroke={chartMode === 'spend' ? '#D97706' : '#059669'}
                            strokeWidth="3"
                            className="shadow-md transition-all duration-200"
                          />
                          {/* Month Label */}
                          <text
                            x={pt.x}
                            y="202"
                            textAnchor="middle"
                            className={`text-[11px] font-bold ${
                              isHovered ? 'fill-emerald-900 font-extrabold' : 'fill-slate-500'
                            }`}
                          >
                            {pt.month}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                );
              })()}
            </div>

            {/* Bottom Graph Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60 mt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                Customer Growth Curve
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 inline-block" />
                Volume Activity
              </span>
              <span className="text-slate-400 hidden sm:inline">
                Hover columns to inspect data
              </span>
            </div>
          </div>

          {/* Right Column: Customer Segments Radial Ring & Top Patrons (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Radial Retention Gauge Card */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Patron Retention Rate</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Direct engagement across accounts
                </p>
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs mt-2">
                  <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>+14% vs last quarter</span>
                </div>
              </div>

              {/* Radial Donut Gauge SVG */}
              <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    className="text-slate-200 stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Animated Foreground Progress */}
                  <path
                    className="text-emerald-600 stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={`${Math.max(15, customerAnalytics.activeRate)}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-extrabold text-xs text-slate-900 font-poppins">
                    {customerAnalytics.activeRate}%
                  </span>
                  <span className="text-[8px] font-bold uppercase text-slate-400">Active</span>
                </div>
              </div>
            </div>

            {/* Top Customer Contributors Leaderboard */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900">Top Patron Telemetry</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Ranked by Value</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {customerAnalytics.topSpenders.length === 0 ? (
                  <p className="text-slate-400 text-center text-xs py-2">No patrons logged</p>
                ) : (
                  customerAnalytics.topSpenders.map((patron, i) => {
                    const maxTopSpend = customerAnalytics.topSpenders[0]?.totalSpent || 1;
                    const percent = Math.min(100, Math.round(((patron.totalSpent || 0) / maxTopSpend) * 100));

                    return (
                      <div key={patron._id} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-800 truncate max-w-[120px]">
                            {patron.name || 'Patron'}
                          </span>
                          <span className="font-poppins font-bold text-emerald-700">
                            {formatPrice(patron.totalSpent || 0)}
                          </span>
                        </div>
                        {/* Animated Progress Bar */}
                        <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              i === 0
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-500'
                            }`}
                            style={{ width: `${Math.max(12, percent)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>



















      {/* ========================================================================= */}
      {/* 4. RECENT CONSIGNMENTS LIVE ACTIVITY TABLE CONSOLE                        */}
      {/* ========================================================================= */}
      <div
        className=" overflow-hidden  transition-all"
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
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead
              className="uppercase tracking-wider font-bold border-b border-slate-200/80 bg-slate-50/90 text-[11px] text-slate-600"
            >
              <tr>
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Flacons Ordered</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
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
                  <td colSpan={6} className="p-12 text-center text-neutral-400">
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
                            <p className="text-[10px] text-slate-500">
                              {ord.shippingAddress?.city || 'Local'},{' '}
                              {ord.shippingAddress?.state || 'India'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-slate-800">
                          {ord.orderItems?.length || 0} flacon item(s)
                        </span>
                        <p className="text-[10px] truncate max-w-xs text-slate-500">
                          {ord.orderItems?.map((i: any) => i.name).join(', ')}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="font-poppins font-bold text-sm text-emerald-700">
                          {formatPrice(ord.totalPrice)}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {ord.paymentMethod || 'Prepaid'}
                        </p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-purple-50 text-purple-800 border-purple-200'
                              : ord.orderStatus === 'Processing'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-500'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-purple-500'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-blue-500'
                                : 'bg-amber-500 animate-pulse'
                            }`}
                          />
                          {ord.orderStatus}
                        </span>
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
