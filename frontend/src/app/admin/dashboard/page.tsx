'use client';

import React, { useState } from 'react';
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
  Mail,
  Phone,
  MapPin,
  Crown,
  Radio,
  Plus,
  Compass,
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

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-300 pb-10">


      {/* ========================================================================= */}
      {/* 2. REFINED KPI METRIC CARDS GRID (Harmonious Colors & Clean Hierarchy)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Gross Revenue */}
        <div
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 60%, #011B16 100%)',
          }}
          className="p-5 rounded-3xl border border-[#0C4E40] transition-all duration-300 relative overflow-hidden group shadow-xl hover:border-amber-400/60 hover:-translate-y-1"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[10px] font-bold text-amber-400">
              Gross Revenue
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-amber-300">
              {isLoading ? '...' : formatPrice(stats?.totalRevenue || 0)}
            </p>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/15 text-amber-300 shadow-xs">
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
            <span className="text-[11px] font-medium text-emerald-200/70">
              vs previous month
            </span>
          </div>
        </div>

        {/* Consignment Orders */}
        <div
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 60%, #011B16 100%)',
          }}
          className="p-5 rounded-3xl border border-[#0C4E40] transition-all duration-300 relative overflow-hidden group shadow-xl hover:border-amber-400/60 hover:-translate-y-1"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[10px] font-bold text-amber-400">
              Consignments
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-amber-300">
              {isLoading ? '...' : stats?.totalOrders || 0}
            </p>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            {stats?.pendingOrdersCount && stats.pendingOrdersCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/15 text-amber-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {stats.pendingOrdersCount} pending dispatch
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-950/80 text-emerald-300 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                All fulfilled
              </span>
            )}
            <span className="text-[11px] font-medium text-emerald-200/70">
              lifetime queue
            </span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 60%, #011B16 100%)',
          }}
          className="p-5 rounded-3xl border border-[#0C4E40] transition-all duration-300 relative overflow-hidden group shadow-xl hover:border-amber-400/60 hover:-translate-y-1"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[10px] font-bold text-amber-400">
              Avg Order Value
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-amber-300">
              {isLoading ? '...' : formatPrice(aov)}
            </p>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/15 text-amber-300 shadow-xs">
              High Tier
            </span>
            <span className="text-[11px] font-medium text-emerald-200/70">
              luxury basket avg
            </span>
          </div>
        </div>

        {/* Registered Patrons & Clients */}
        <Link
          href="/admin/customers"
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 60%, #011B16 100%)',
          }}
          className="p-5 rounded-3xl border border-[#0C4E40] transition-all duration-300 relative overflow-hidden group block shadow-xl hover:border-amber-400/60 hover:-translate-y-1"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[10px] font-bold text-amber-400">
              Registered Patrons
            </span>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-amber-300">
              {isCustomersLoading ? '...' : customers.length || stats?.totalUsers || 0}
            </p>
            <span className="text-xs font-semibold text-emerald-200/70">clients</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/15 text-amber-300 shadow-xs">
              {customers.filter((c) => (c.ordersCount || 0) > 0).length} Repeat Buyers
            </span>
            <span className="text-[11px] font-semibold flex items-center gap-0.5 text-amber-300 group-hover:underline">
              View Directory &rarr;
            </span>
          </div>
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 3. ATELIER CONTROL HUB - 4 LUXURY ACTION PANELS                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Panel 1: Flacon Catalog */}
        <Link
          href="/admin/products"
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 100%)',
          }}
          className="p-4.5 rounded-3xl border border-[#0C4E40] transition-all duration-300 group hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                Flacon Catalog
              </p>
              <p className="text-[11px] mt-0.5 text-emerald-200/70">
                {stats?.totalProducts || 0} active flacons
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400/80 transition-all group-hover:translate-x-1 group-hover:text-amber-300" />
        </Link>

        {/* Panel 2: Categories & Taxonomy Hub */}
        <Link
          href="/admin/categories"
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 100%)',
          }}
          className="p-4.5 rounded-3xl border border-[#0C4E40] transition-all duration-300 group hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                Taxonomy & Notes
              </p>
              <p className="text-[11px] mt-0.5 text-emerald-200/70">
                All-in-one catalog hub
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400/80 transition-all group-hover:translate-x-1 group-hover:text-amber-300" />
        </Link>

        {/* Panel 3: Orders Queue */}
        <Link
          href="/admin/orders"
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 100%)',
          }}
          className="p-4.5 rounded-3xl border border-[#0C4E40] transition-all duration-300 group hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                Consignments Queue
              </p>
              <p className="text-[11px] mt-0.5 text-emerald-200/70">
                {stats?.totalOrders || 0} total consignments
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400/80 transition-all group-hover:translate-x-1 group-hover:text-amber-300" />
        </Link>

        {/* Panel 4: Customer Directory */}
        <Link
          href="/admin/customers"
          style={{
            backgroundColor: '#02241D',
            backgroundImage: 'linear-gradient(180deg, #032E25 0%, #02241D 100%)',
          }}
          className="p-4.5 rounded-3xl border border-[#0C4E40] transition-all duration-300 group hover:-translate-y-1 hover:border-amber-400/60 hover:shadow-[0_8px_25px_rgba(0,0,0,0.4)] flex items-center justify-between shadow-xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                Patron Directory
              </p>
              <p className="text-[11px] mt-0.5 text-emerald-200/70">
                {customers.length} registered patrons
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-400/80 transition-all group-hover:translate-x-1 group-hover:text-amber-300" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 4. RECENT CONSIGNMENTS LIVE ACTIVITY TABLE CONSOLE                        */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: '#02241D',
        }}
        className="rounded-3xl border border-[#0C4E40] overflow-hidden shadow-2xl backdrop-blur-xl transition-all"
      >
        {/* Table Header & Interactive Filter Controls */}
        <div
          style={{ backgroundColor: '#011B16' }}
          className="p-5 sm:p-6 border-b border-[#0C4E40] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
        >
          <div>
            <h2 className="font-poppins text-base font-bold tracking-tight flex items-center gap-2 text-amber-300">
              <span>Recent Orders</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border bg-amber-400/15 text-amber-300 border-amber-400/40">
                {recentOrders.length} latest orders
              </span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-300/60" />
              <input
                type="text"
                placeholder="Search orders or patrons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-8 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 w-full sm:w-56 font-poppins transition-all bg-[#02241D] border border-[#0C4E40] text-amber-200 placeholder-emerald-300/40 shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-300/70 hover:text-amber-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex gap-1 p-1 rounded-xl text-[11px] font-medium border border-[#0C4E40] bg-[#02241D] overflow-x-auto">
              {['All', 'Pending', 'Processing', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-emerald-200/70 hover:text-amber-300 hover:bg-white/5'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <Link
              href="/admin/orders"
              className="text-xs font-bold flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shadow-xs border border-amber-400/50 bg-amber-400 text-slate-950 hover:bg-amber-300 whitespace-nowrap"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mobile View: High-End Responsive Consignment Cards */}
        <div className="md:hidden p-3.5 space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-amber-300/60">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Retrieving live consignments...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-200/60">
              No orders matching criteria
            </div>
          ) : (
            filteredOrders.map((ord) => {
              const patronName = ord.shippingAddress?.fullName || 'Guest Patron';
              return (
                <div
                  key={`m-${ord._id}`}
                  style={{ backgroundColor: '#011B16' }}
                  className="p-4 rounded-2xl border border-[#0C4E40] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-xs text-amber-300">#{ord.orderNumber}</span>
                      <span className="text-[10px] text-emerald-200/60 block">{formatDate(ord.createdAt)}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : ord.orderStatus === 'Shipped'
                          ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                          : ord.orderStatus === 'Processing'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                          : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {ord.orderStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-[#0C4E40]">
                    <div>
                      <p className="font-bold text-amber-200">{patronName}</p>
                      <p className="text-[10px] text-emerald-200/60">{ord.orderItems?.length || 0} flacon item(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-poppins font-bold text-sm text-amber-300">
                        {formatPrice(ord.totalPrice)}
                      </p>
                      <Link
                        href="/admin/orders"
                        className="text-[10px] font-bold text-amber-400 hover:text-amber-200 hover:underline inline-flex items-center gap-0.5 mt-0.5"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
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
              style={{ backgroundColor: '#011612' }}
              className="uppercase tracking-wider font-bold border-b border-[#0C4E40] text-[11px] text-amber-300/90"
            >
              <tr>
                <th className="p-4 pl-6">Order ID & Date</th>
                <th className="p-4">Patron Details</th>
                <th className="p-4">Flacons Ordered</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B4436] text-white">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-amber-300/70">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-emerald-200/70">
                        Retrieving live consignments from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-amber-400/50" />
                      <p className="font-semibold text-xs text-amber-300">
                        No orders matching criteria
                      </p>
                      <p className="text-[11px] text-emerald-200/60">
                        {statusFilter !== 'All'
                          ? `No orders currently marked as "${statusFilter}".`
                          : 'New consignments will appear here automatically in real time.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const patronName = ord.shippingAddress?.fullName || 'Guest Patron';
                  const initials = patronName
                    .split(' ')
                    .map((n: string) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase();

                  return (
                    <tr
                      key={ord._id}
                      className="transition-colors hover:bg-white/[0.04] group"
                    >
                      <td className="p-4 pl-6">
                        <div className="font-mono font-bold flex items-center gap-1.5 text-amber-300">
                          <span className="text-amber-400">#</span>
                          <span>{ord.orderNumber}</span>
                        </div>
                        <p className="text-[10px] mt-0.5 text-emerald-200/60">
                          {formatDate(ord.createdAt)}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full font-bold text-[10px] flex items-center justify-center flex-shrink-0 border border-amber-400/40 bg-[#063B2F] text-amber-300 shadow-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-amber-200">
                              {patronName}
                            </p>
                            <p className="text-[10px] text-emerald-200/60">
                              {ord.shippingAddress?.city || 'Local'},{' '}
                              {ord.shippingAddress?.state || 'India'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-semibold text-emerald-100">
                          {ord.orderItems?.length || 0} flacon item(s)
                        </span>
                        <p className="text-[10px] truncate max-w-xs text-emerald-200/60">
                          {ord.orderItems?.map((i: any) => i.name).join(', ')}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="font-poppins font-bold text-sm text-amber-300">
                          {formatPrice(ord.totalPrice)}
                        </span>
                        <p className="text-[10px] text-emerald-200/60">
                          {ord.paymentMethod || 'Prepaid'}
                        </p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                              : ord.orderStatus === 'Processing'
                              ? 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                              : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-400'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-purple-400'
                                : ord.orderStatus === 'Processing'
                                ? 'bg-blue-400'
                                : 'bg-amber-400 animate-pulse'
                            }`}
                          />
                          {ord.orderStatus}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <Link
                          href="/admin/orders"
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs border border-[#146654] bg-[#03362B] text-amber-300 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400"
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

      {/* ========================================================================= */}
      {/* 5. PATRON DIRECTORY & CUSTOMER DETAILS OVERVIEW                           */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: '#02241D',
        }}
        className="rounded-3xl border border-[#0C4E40] overflow-hidden shadow-2xl backdrop-blur-xl transition-all"
      >
        <div
          style={{ backgroundColor: '#011B16' }}
          className="p-5 sm:p-6 border-b border-[#0C4E40] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
        >
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h2 className="font-poppins text-base font-bold tracking-tight text-amber-300">
                Customer Details
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-amber-400/15 text-amber-300 border-amber-400/40">
                {customers.length} Registered
              </span>
            </div>
          </div>

          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-[#146654] bg-[#03362B] text-amber-300 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400 transition-all self-start sm:self-auto"
          >
            <span>Full Customer Dossiers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile View: Customer Dossier Cards */}
        <div className="md:hidden p-3.5 space-y-3">
          {isCustomersLoading ? (
            <div className="p-8 text-center text-xs text-amber-300/60">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Loading customer dossiers...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-xs text-emerald-200/60">
              No customers registered yet.
            </div>
          ) : (
            customers.slice(0, 5).map((cust) => {
              const addr = cust.latestShippingAddress || (cust.addresses && cust.addresses[0]) || null;
              const isVip = (cust.totalSpent || 0) >= 5000;
              return (
                <div
                  key={`mcust-${cust._id}`}
                  style={{ backgroundColor: '#011B16' }}
                  className="p-4 rounded-2xl border border-[#0C4E40] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-[10px] uppercase border border-amber-400/40 bg-[#063B2F] text-amber-300 overflow-hidden shrink-0">
                        {cust.avatar && !cust.avatar.includes('unsplash') ? (
                          <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{cust.name?.slice(0, 2) || 'PT'}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-xs text-amber-200">{cust.name || 'Patron'}</p>
                          {isVip && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded border bg-amber-400/20 text-amber-300 border-amber-400/40">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-emerald-200/60 font-mono">#{cust._id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>

                    <Link
                      href="/admin/customers"
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg border border-amber-400/40 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                    >
                      Dossier &rarr;
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#0C4E40]">
                    <div>
                      <span className="text-emerald-200/60 block text-[10px]">Total Orders</span>
                      <span className="font-bold text-white">{cust.ordersCount || 0}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-200/60 block text-[10px]">Total Spend</span>
                      <span className="font-mono font-bold text-amber-300">
                        {formatPrice(cust.totalSpent || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Full Customer Dossiers Table */}
        <div className="hidden md:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr
                style={{ backgroundColor: '#011612' }}
                className="border-b border-[#0C4E40] text-[10px] uppercase tracking-wider font-bold text-amber-300/90"
              >
                <th className="py-3 px-4 sm:px-6">Patron</th>
                <th className="py-3 px-4">Contact Channels</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spend</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4 sm:px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#0B4436] text-xs text-emerald-100">
              {isCustomersLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-amber-300/60">
                    Loading customer data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-emerald-200/60">
                    No customers registered yet.
                  </td>
                </tr>
              ) : (
                customers.slice(0, 5).map((cust) => {
                  const addr =
                    cust.latestShippingAddress || (cust.addresses && cust.addresses[0]) || null;
                  const isVip = (cust.totalSpent || 0) >= 5000;

                  return (
                    <tr
                      key={cust._id}
                      className="transition-colors hover:bg-white/[0.04]"
                    >
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] uppercase border border-amber-400/40 bg-[#063B2F] text-amber-300 overflow-hidden flex-shrink-0 shadow-sm">
                            {cust.avatar && !cust.avatar.includes('unsplash') ? (
                              <img
                                src={cust.avatar}
                                alt={cust.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{cust.name?.slice(0, 2) || 'PT'}</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-amber-200">
                                {cust.title ? `${cust.title}. ` : ''}
                                {cust.name || 'Patron'}
                              </span>
                              {isVip && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-amber-400/20 text-amber-300 border-amber-400/40">
                                  VIP
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono text-emerald-200/60">
                              #{cust._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {cust.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-amber-400/80" />
                              <span className="truncate max-w-[140px] text-[11px] text-emerald-100">
                                {cust.email}
                              </span>
                            </div>
                          )}
                          {cust.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-amber-400/80" />
                              <span className="font-mono text-[10.5px] text-emerald-100">
                                {cust.phone}
                              </span>
                            </div>
                          )}
                          {!cust.email && !cust.phone && (
                            <span className="text-[10px] italic text-emerald-200/50">
                              No contact info
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {addr?.city ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin className="w-3 h-3 flex-shrink-0 text-amber-400" />
                            <span className="truncate max-w-[120px] text-emerald-100">
                              {addr.city}
                              {addr.state ? `, ${addr.state}` : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-emerald-200/50">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-white">
                          {cust.ordersCount || 0}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-amber-300">
                          {formatPrice(cust.totalSpent || 0)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[11px] text-emerald-200/60">
                          {formatDate(cust.createdAt)}
                        </span>
                      </td>

                      <td className="py-3 px-4 sm:px-6 text-right">
                        <Link
                          href="/admin/customers"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border border-[#146654] bg-[#03362B] text-amber-300 hover:bg-amber-400 hover:text-slate-950 hover:border-amber-400"
                        >
                          <span>Dossier</span>
                          <ChevronRight className="w-3 h-3" />
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
