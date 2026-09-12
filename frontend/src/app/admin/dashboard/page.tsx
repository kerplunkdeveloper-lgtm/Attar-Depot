'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  AlertTriangle,
  Eye,
} from 'lucide-react';
import { useAdminStats, useAdminOrders } from '@/hooks/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { data, isLoading } = useAdminStats();
  const stats = data?.stats;
  const recentOrders = data?.recentOrders || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter orders based on user query & status
  const filteredOrders = recentOrders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ord.shippingAddress?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ord.orderStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const aov = stats?.totalOrders && stats.totalOrders > 0
    ? Math.round(stats.totalRevenue / stats.totalOrders)
    : 2499;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* SaaS Welcome & Quick Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest">
              Executive Console
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">Real-Time Sync</span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Attar Depot SaaS Intelligence
          </h1>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Live telemetry on perfume flacon velocity, royal consignments, customer acquisition, and inventory dispatch status.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white hover:from-emerald-800 hover:to-emerald-950 transition-all shadow-md shadow-emerald-900/10 hover:shadow-lg active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 text-amber-300" />
            <span>Add Flacon</span>
          </Link>
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-emerald-200 shadow-2xs transition-all"
          >
            <Layers className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            Categories
          </Link>
          <Link
            href="/admin/orders"
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-700 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-emerald-200 shadow-2xs transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            All Orders
          </Link>
        </div>
      </div>

      {/* Modern SaaS KPI Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Gross Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100/50 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Gross Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isLoading ? '...' : formatPrice(stats?.totalRevenue || 0)}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
            <span className="text-[11px] text-neutral-400">vs previous month</span>
          </div>
        </div>

        {/* Total Consignments */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/40 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isLoading ? '...' : stats?.totalOrders || 0}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {stats?.pendingOrdersCount && stats.pendingOrdersCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {stats.pendingOrdersCount} pending dispatch
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                All dispatched
              </span>
            )}
            <span className="text-[11px] text-neutral-400">lifetime</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Average Order Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isLoading ? '...' : formatPrice(aov)}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              High tier
            </span>
            <span className="text-[11px] text-neutral-400">luxury fragrance tier</span>
          </div>
        </div>

        {/* Catalog Health & Patrons */}
        <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/40 to-transparent rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-neutral-500 text-xs font-medium">
            <span>Inventory & Patrons</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              {isLoading ? '...' : stats?.totalProducts || 0}
            </p>
            <span className="text-xs font-semibold text-neutral-500">flacons</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-full">
              {stats?.totalCategories || 5} Categories
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              {stats?.totalUsers || 1} Patrons
            </span>
          </div>
        </div>
      </div>

      {/* Recent Consignments SaaS Table Section */}
      <div className="rounded-3xl bg-white border border-emerald-100 overflow-hidden shadow-sm">
        {/* Table Header & Interactive Controls */}
        <div className="p-5 sm:p-6 border-b border-emerald-100 bg-[#FBFDFB] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-poppins text-base font-bold tracking-tight text-neutral-900 flex items-center gap-2">
              <span>Recent Consignment Activity</span>
              <span className="text-xs font-normal text-neutral-400">({recentOrders.length} latest)</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live updates of incoming store transactions, payment confirmations, and fulfillment.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search orders or patrons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-neutral-800 placeholder-neutral-400 w-full sm:w-56 font-poppins"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-1 bg-neutral-100/80 p-1 rounded-xl text-[11px] font-medium">
              {['All', 'Pending', 'Processing', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    statusFilter === st
                      ? 'bg-white text-emerald-900 font-bold shadow-2xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <Link
              href="/admin/orders"
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100/60 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4FAF6] text-neutral-600 uppercase tracking-wider font-semibold border-b border-emerald-100">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Patron Details</th>
                <th className="p-4">Flacons Ordered</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">
                    Retrieving orders from real-time database...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-400">
                    No orders matching the active criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const patronName = ord.shippingAddress?.fullName || 'Guest Patron';
                  const initials = patronName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr key={ord._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="p-4">
                        <div className="font-mono font-bold text-neutral-900 flex items-center gap-1.5">
                          <span>#{ord.orderNumber}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{formatDate(ord.createdAt)}</p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900">{patronName}</p>
                            <p className="text-[10px] text-neutral-400">
                              {ord.shippingAddress?.city || 'Local'}, {ord.shippingAddress?.state || 'India'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-neutral-800">
                          {ord.orderItems?.length || 0} flacon item(s)
                        </span>
                        <p className="text-[10px] text-neutral-400 truncate max-w-xs">
                          {ord.orderItems?.map((i) => i.name).join(', ')}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="font-poppins font-bold text-emerald-800 text-sm">
                          {formatPrice(ord.totalPrice)}
                        </span>
                        <p className="text-[10px] text-neutral-400">{ord.paymentMethod || 'Prepaid'}</p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : ord.orderStatus === 'Processing'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
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

                      <td className="p-4 text-right">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-950 font-bold bg-white hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl transition-all shadow-2xs"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Fulfill</span>
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
