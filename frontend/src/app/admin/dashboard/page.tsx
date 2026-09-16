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
import { useAdminTheme } from '@/context/AdminThemeContext';

export default function AdminDashboardPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === 'light';

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
      {/* 1. TOP EXECUTIVE WELCOME & TELEMETRY HEADER                               */}
      {/* ========================================================================= */}
      <div
        className={` flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
          isLight
            ? 'bg-gradient-to-r from-[#EBF7F2] via-[#E4F4EC] to-[#DCF1E6] border-[#B2DFD0] text-[#022D24] '
            : 'bg-gradient-to-r from-[#0C1714] via-[#091310] to-[#08100D] border-[#1C332B] text-white'
        }`}
      >
        <div>
          <h1
            className={`font-serif text-2xl  font-bold tracking-tight ${
              isLight ? 'text-[#022D24]' : 'text-white'
            }`}
          >
            Dashboard Overview
          </h1> 
        </div>

        {/* Real-time System Status Pills & Fast Shortcuts */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-semibold ${
              isLight
                ? 'bg-white/90 border-emerald-300/80 text-emerald-950 shadow-xs'
                : 'bg-[#091512] border-[#1E362E] text-neutral-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span>Store Online</span>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Link
              href="/admin/products"
              className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white hover:from-emerald-500 hover:to-emerald-700 transition-all shadow-md shadow-emerald-950/40 border border-emerald-400/30 active:scale-98"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>New Flacon</span>
            </Link>

            <Link
              href="/admin/categories"
              className={`flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                isLight
                  ? 'bg-white/90 hover:bg-white text-emerald-900 border-emerald-300/80 shadow-xs'
                  : 'bg-[#0E1A16] hover:bg-[#13241F] text-emerald-300 border-emerald-500/30'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isLight ? 'text-amber-600' : 'text-amber-300'}`} />
              <span>Taxonomy Hub</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REFINED KPI METRIC CARDS GRID (Harmonious Colors & Clean Hierarchy)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Gross Revenue */}
        <div
          className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] shadow-sm hover:border-emerald-400 hover:shadow-md'
              : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] hover:border-emerald-500/50 shadow-xl shadow-black/50'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent" />
          <div className="flex items-center justify-between">
            <span
              className={`uppercase tracking-widest text-[10px] font-bold ${
                isLight ? 'text-emerald-800/80' : 'text-neutral-400'
              }`}
            >
              Gross Revenue
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform ${
                isLight
                  ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300/70'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-inner'
              }`}
            >
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p
              className={`font-poppins text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? 'text-[#022D24]' : 'text-white'
              }`}
            >
              {isLoading ? '...' : formatPrice(stats?.totalRevenue || 0)}
            </p>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                isLight
                  ? 'text-emerald-800 bg-emerald-100/80 border-emerald-300/80'
                  : 'text-emerald-300 bg-emerald-950/90 border-emerald-500/40'
              }`}
            >
              <TrendingUp className="w-3 h-3" /> +18.4%
            </span>
            <span
              className={`text-[11px] font-medium ${
                isLight ? 'text-emerald-800/70' : 'text-neutral-400'
              }`}
            >
              vs previous month
            </span>
          </div>
        </div>

        {/* Consignment Orders */}
        <div
          className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] shadow-sm hover:border-amber-400 hover:shadow-md'
              : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] hover:border-amber-500/50 shadow-xl shadow-black/50'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent" />
          <div className="flex items-center justify-between">
            <span
              className={`uppercase tracking-widest text-[10px] font-bold ${
                isLight ? 'text-amber-800/80' : 'text-neutral-400'
              }`}
            >
              Consignments
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform ${
                isLight
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-amber-950/80 text-amber-300 border-amber-500/40 shadow-inner'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p
              className={`font-poppins text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {isLoading ? '...' : stats?.totalOrders || 0}
            </p>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            {stats?.pendingOrdersCount && stats.pendingOrdersCount > 0 ? (
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                  isLight
                    ? 'text-amber-900 bg-amber-50 border-amber-300'
                    : 'text-amber-300 bg-amber-950/90 border-amber-500/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {stats.pendingOrdersCount} pending dispatch
              </span>
            ) : (
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                  isLight
                    ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
                    : 'text-emerald-300 bg-emerald-950/90 border-emerald-500/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                All fulfilled
              </span>
            )}
            <span
              className={`text-[11px] font-medium ${
                isLight ? 'text-slate-500' : 'text-neutral-400'
              }`}
            >
              lifetime queue
            </span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div
          className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] shadow-sm hover:border-emerald-400 hover:shadow-md'
              : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] hover:border-blue-500/50 shadow-xl shadow-black/50'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent" />
          <div className="flex items-center justify-between">
            <span
              className={`uppercase tracking-widest text-[10px] font-bold ${
                isLight ? 'text-slate-600' : 'text-neutral-400'
              }`}
            >
              Avg Order Value
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform ${
                isLight
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-blue-950/80 text-blue-300 border-blue-500/40 shadow-inner'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p
              className={`font-poppins text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? 'text-[#022D24]' : 'text-white'
              }`}
            >
              {isLoading ? '...' : formatPrice(aov)}
            </p>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                isLight
                  ? 'text-blue-800 bg-blue-50 border-blue-300'
                  : 'text-blue-300 bg-blue-950/90 border-blue-500/40'
              }`}
            >
              High Tier
            </span>
            <span
              className={`text-[11px] font-medium ${
                isLight ? 'text-slate-500' : 'text-neutral-400'
              }`}
            >
              luxury basket avg
            </span>
          </div>
        </div>

        {/* Registered Patrons & Clients */}
        <Link
          href="/admin/customers"
          className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group block ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] shadow-sm hover:border-purple-400 hover:shadow-md'
              : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] hover:border-purple-500/50 shadow-xl shadow-black/50'
          }`}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-purple-400 to-transparent" />
          <div className="flex items-center justify-between">
            <span
              className={`uppercase tracking-widest text-[10px] font-bold ${
                isLight ? 'text-slate-600' : 'text-neutral-400'
              }`}
            >
              Registered Patrons
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-xs group-hover:scale-105 transition-transform ${
                isLight
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-inner'
              }`}
            >
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p
              className={`font-poppins text-2xl sm:text-3xl font-bold tracking-tight ${
                isLight ? 'text-[#022D24]' : 'text-white'
              }`}
            >
              {isCustomersLoading ? '...' : customers.length || stats?.totalUsers || 0}
            </p>
            <span
              className={`text-xs font-semibold ${
                isLight ? 'text-slate-500' : 'text-neutral-400'
              }`}
            >
              clients
            </span>
          </div>
          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${
                isLight
                  ? 'text-purple-800 bg-purple-50 border-purple-300'
                  : 'text-purple-300 bg-purple-950/90 border-purple-500/40'
              }`}
            >
              {customers.filter((c) => (c.ordersCount || 0) > 0).length} Repeat Buyers
            </span>
            <span
              className={`text-[11px] font-semibold flex items-center gap-0.5 ${
                isLight ? 'text-emerald-700' : 'text-emerald-400'
              }`}
            >
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
          className={`p-4.5 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 flex items-center justify-between shadow-sm ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] hover:border-emerald-500 hover:bg-emerald-50/50'
              : 'bg-gradient-to-b from-[#0D1815] to-[#07100D] border-[#1B2925] hover:border-emerald-500/50 shadow-black/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                isLight
                  ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300/70'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-inner'
              }`}
            >
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-xs font-bold transition-colors ${
                  isLight
                    ? 'text-emerald-950 group-hover:text-emerald-700'
                    : 'text-white group-hover:text-emerald-300'
                }`}
              >
                Flacon Catalog
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isLight ? 'text-emerald-800/70' : 'text-neutral-400'
                }`}
              >
                {stats?.totalProducts || 0} active flacons
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-all group-hover:translate-x-1 ${
              isLight
                ? 'text-emerald-600 group-hover:text-emerald-800'
                : 'text-neutral-500 group-hover:text-emerald-400'
            }`}
          />
        </Link>

        {/* Panel 2: Categories & Taxonomy Hub */}
        <Link
          href="/admin/categories"
          className={`p-4.5 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 flex items-center justify-between shadow-sm ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] hover:border-amber-400 hover:bg-amber-50/40'
              : 'bg-gradient-to-b from-[#0D1815] to-[#07100D] border-[#1B2925] hover:border-amber-500/50 shadow-black/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                isLight
                  ? 'bg-amber-100/70 text-amber-800 border-amber-300/70'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-inner'
              }`}
            >
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-xs font-bold transition-colors ${
                  isLight
                    ? 'text-emerald-950 group-hover:text-amber-800'
                    : 'text-white group-hover:text-amber-300'
                }`}
              >
                Taxonomy & Notes
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isLight ? 'text-emerald-800/70' : 'text-neutral-400'
                }`}
              >
                All-in-one catalog hub
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-all group-hover:translate-x-1 ${
              isLight
                ? 'text-amber-600 group-hover:text-amber-800'
                : 'text-neutral-500 group-hover:text-amber-400'
            }`}
          />
        </Link>

        {/* Panel 3: Orders Queue */}
        <Link
          href="/admin/orders"
          className={`p-4.5 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 flex items-center justify-between shadow-sm ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] hover:border-emerald-500 hover:bg-emerald-50/50'
              : 'bg-gradient-to-b from-[#0D1815] to-[#07100D] border-[#1B2925] hover:border-emerald-500/50 shadow-black/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                isLight
                  ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300/70'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-inner'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-xs font-bold transition-colors ${
                  isLight
                    ? 'text-emerald-950 group-hover:text-emerald-700'
                    : 'text-white group-hover:text-emerald-300'
                }`}
              >
                Consignments Queue
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isLight ? 'text-emerald-800/70' : 'text-neutral-400'
                }`}
              >
                {stats?.totalOrders || 0} total consignments
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-all group-hover:translate-x-1 ${
              isLight
                ? 'text-emerald-600 group-hover:text-emerald-800'
                : 'text-neutral-500 group-hover:text-emerald-400'
            }`}
          />
        </Link>

        {/* Panel 4: Customer Directory */}
        <Link
          href="/admin/customers"
          className={`p-4.5 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 flex items-center justify-between shadow-sm ${
            isLight
              ? 'bg-white/95 border-[#BCE3D7] hover:border-purple-400 hover:bg-purple-50/40'
              : 'bg-gradient-to-b from-[#0D1815] to-[#07100D] border-[#1B2925] hover:border-purple-500/50 shadow-black/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                isLight
                  ? 'bg-purple-100/70 text-purple-800 border-purple-300/70'
                  : 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-inner'
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p
                className={`text-xs font-bold transition-colors ${
                  isLight
                    ? 'text-emerald-950 group-hover:text-purple-800'
                    : 'text-white group-hover:text-purple-300'
                }`}
              >
                Patron Directory
              </p>
              <p
                className={`text-[11px] mt-0.5 ${
                  isLight ? 'text-emerald-800/70' : 'text-neutral-400'
                }`}
              >
                {customers.length} registered patrons
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 transition-all group-hover:translate-x-1 ${
              isLight
                ? 'text-purple-600 group-hover:text-purple-800'
                : 'text-neutral-500 group-hover:text-purple-400'
            }`}
          />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 4. RECENT CONSIGNMENTS LIVE ACTIVITY TABLE CONSOLE                        */}
      {/* ========================================================================= */}
      <div
        className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all shadow-xl ${
          isLight
            ? 'bg-white/95 border-[#BCE3D7] shadow-emerald-950/5'
            : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] shadow-black/70'
        }`}
      >
        {/* Table Header & Interactive Filter Controls */}
        <div
          className={`p-5 sm:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
            isLight ? 'border-[#BCE3D7] bg-[#F2FBF6]/90' : 'border-[#1E332B] bg-[#0C1513]'
          }`}
        >
          <div>
            <h2
              className={`font-poppins text-base font-bold tracking-tight flex items-center gap-2 ${
                isLight ? 'text-[#022D24]' : 'text-white'
              }`}
            >
              <span>Recent Consignment Activity</span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-950/80 text-emerald-400/90 border-emerald-500/30'
                }`}
              >
                {recentOrders.length} latest orders
              </span>
            </h2>
            <p
              className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}
            >
              Live updates of incoming store orders, payment confirmations, and fulfillment status.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick Search */}
            <div className="relative">
              <Search
                className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isLight ? 'text-slate-400' : 'text-neutral-500'
                }`}
              />
              <input
                type="text"
                placeholder="Search orders or patrons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-8 pr-8 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 w-full sm:w-56 font-poppins transition-all ${
                  isLight
                    ? 'bg-white border border-emerald-300/80 text-emerald-950 placeholder-emerald-800/40 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs'
                    : 'bg-[#070D0B] border border-[#223932] text-white placeholder-neutral-500 focus:ring-emerald-500/20 focus:border-emerald-400'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${
                    isLight
                      ? 'text-emerald-700 hover:text-emerald-950'
                      : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div
              className={`flex gap-1 p-1 rounded-xl text-[11px] font-medium border overflow-x-auto ${
                isLight ? 'bg-[#EBF7F2] border-[#BCE3D7]' : 'bg-[#070D0B] border-[#1E332B]'
              }`}
            >
              {['All', 'Pending', 'Processing', 'Delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold shadow-sm'
                      : isLight
                      ? 'text-emerald-900/70 hover:text-emerald-950 hover:bg-white/80'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <Link
              href="/admin/orders"
              className={`text-xs font-bold flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl transition-all shadow-xs border whitespace-nowrap ${
                isLight
                  ? 'text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200/80 border-emerald-300/80'
                  : 'text-emerald-300 bg-emerald-950/70 hover:bg-emerald-800 border-emerald-500/40 hover:text-white'
              }`}
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Orders Table with Responsive Horizontal Momentum Scroll */}
        <div
          className={`md:hidden px-4 py-1.5 text-[10px] flex items-center justify-between border-b ${
            isLight ? 'bg-emerald-50/60 text-emerald-800 border-emerald-200' : 'bg-[#0A1512] text-emerald-400 border-[#1E332B]'
          }`}
        >
          <span>Scroll horizontally for full order metrics</span>
          <span className="font-mono text-[11px]">&rarr;</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead
              className={`uppercase tracking-wider font-bold border-b text-[11px] ${
                isLight
                  ? 'bg-[#F4FAF6] text-emerald-950 border-[#BCE3D7]'
                  : 'bg-[#09110F] text-neutral-400 border-[#1E332B]'
              }`}
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
            <tbody
              className={`divide-y ${
                isLight
                  ? 'divide-[#E8F5EF] text-slate-700'
                  : 'divide-[#162520] text-neutral-300'
              }`}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>
                        Retrieving live consignments from database...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-neutral-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <ShoppingBag
                        className={`w-8 h-8 mx-auto ${
                          isLight ? 'text-slate-300' : 'text-neutral-600'
                        }`}
                      />
                      <p
                        className={`font-semibold text-xs ${
                          isLight ? 'text-slate-700' : 'text-neutral-400'
                        }`}
                      >
                        No orders matching criteria
                      </p>
                      <p
                        className={`text-[11px] ${
                          isLight ? 'text-slate-400' : 'text-neutral-500'
                        }`}
                      >
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
                      className={`transition-colors group ${
                        isLight ? 'hover:bg-emerald-50/40' : 'hover:bg-[#12211C]/80'
                      }`}
                    >
                      <td className="p-4 pl-6">
                        <div
                          className={`font-mono font-bold flex items-center gap-1.5 ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          <span className="text-emerald-500">#</span>
                          <span>{ord.orderNumber}</span>
                        </div>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            isLight ? 'text-slate-400' : 'text-neutral-500'
                          }`}
                        >
                          {formatDate(ord.createdAt)}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full font-bold text-[10px] flex items-center justify-center flex-shrink-0 shadow-xs border ${
                              isLight
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-500/30 shadow-inner'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p
                              className={`font-bold ${
                                isLight ? 'text-slate-900' : 'text-white'
                              }`}
                            >
                              {patronName}
                            </p>
                            <p
                              className={`text-[10px] ${
                                isLight ? 'text-slate-500' : 'text-neutral-400'
                              }`}
                            >
                              {ord.shippingAddress?.city || 'Local'},{' '}
                              {ord.shippingAddress?.state || 'India'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            isLight ? 'text-slate-800' : 'text-neutral-200'
                          }`}
                        >
                          {ord.orderItems?.length || 0} flacon item(s)
                        </span>
                        <p
                          className={`text-[10px] truncate max-w-xs ${
                            isLight ? 'text-slate-500' : 'text-neutral-400'
                          }`}
                        >
                          {ord.orderItems?.map((i: any) => i.name).join(', ')}
                        </p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`font-poppins font-bold text-sm ${
                            isLight ? 'text-emerald-700' : 'text-emerald-400'
                          }`}
                        >
                          {formatPrice(ord.totalPrice)}
                        </span>
                        <p
                          className={`text-[10px] ${
                            isLight ? 'text-slate-400' : 'text-neutral-500'
                          }`}
                        >
                          {ord.paymentMethod || 'Prepaid'}
                        </p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-xs ${
                            ord.orderStatus === 'Delivered'
                              ? isLight
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : ord.orderStatus === 'Shipped'
                              ? isLight
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                              : ord.orderStatus === 'Processing'
                              ? isLight
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : 'bg-blue-950/80 text-blue-300 border-blue-500/40'
                              : isLight
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
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
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs border ${
                            isLight
                              ? 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border-emerald-300'
                              : 'bg-[#12221D] hover:bg-emerald-700 text-emerald-300 hover:text-white border-emerald-500/40 group-hover:border-emerald-400'
                          }`}
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
        className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all shadow-xl ${
          isLight
            ? 'bg-white/95 border-[#BCE3D7] shadow-emerald-950/5'
            : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] shadow-black/70'
        }`}
      >
        <div
          className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
            isLight ? 'border-[#BCE3D7] bg-[#F2FBF6]/90' : 'border-[#1E332B] bg-[#0C1513]'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <Users
                className={`w-4 h-4 ${isLight ? 'text-purple-700' : 'text-purple-400'}`}
              />
              <h2
                className={`font-poppins text-base font-bold tracking-tight ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Patron Directory & Customer Telemetry
              </h2>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                  isLight
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                }`}
              >
                {customers.length} Registered
              </span>
            </div>
            <p
              className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}
            >
              Recent customer registrations, contact channels, delivery addresses, and purchasing telemetry.
            </p>
          </div>

          <Link
            href="/admin/customers"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all self-start sm:self-auto ${
              isLight
                ? 'bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-200 shadow-xs'
                : 'bg-purple-950/80 hover:bg-purple-900/80 text-purple-300 border-purple-500/30'
            }`}
          >
            <span>Full Customer Dossiers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Customer Mini Table */}
        <div
          className={`md:hidden px-4 py-1.5 text-[10px] flex items-center justify-between border-b ${
            isLight ? 'bg-purple-50/60 text-purple-800 border-purple-200' : 'bg-[#120F17] text-purple-400 border-[#2D1F3B]'
          }`}
        >
          <span>Scroll horizontally for full patron dossiers</span>
          <span className="font-mono text-[11px]">&rarr;</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr
                className={`border-b text-[10px] uppercase tracking-wider font-bold ${
                  isLight
                    ? 'border-slate-200 bg-slate-50/50 text-slate-500'
                    : 'border-[#1A2C26] bg-[#0A1210]/60 text-neutral-400'
                }`}
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
            <tbody
              className={`divide-y text-xs ${
                isLight ? 'divide-slate-100 text-slate-700' : 'divide-[#13221E] text-neutral-300'
              }`}
            >
              {isCustomersLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-neutral-500">
                    Loading customer data...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-neutral-500">
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
                      className={`transition-colors ${
                        isLight ? 'hover:bg-purple-50/20' : 'hover:bg-[#12211C]/50'
                      }`}
                    >
                      <td className="py-3 px-4 sm:px-6">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] uppercase border overflow-hidden flex-shrink-0 ${
                              isLight
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-purple-950 text-purple-300 border-purple-500/30'
                            }`}
                          >
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
                              <span
                                className={`font-bold ${
                                  isLight ? 'text-slate-900' : 'text-white'
                                }`}
                              >
                                {cust.title ? `${cust.title}. ` : ''}
                                {cust.name || 'Patron'}
                              </span>
                              {isVip && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                    isLight
                                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                                      : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                                  }`}
                                >
                                  VIP
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-mono ${
                                isLight ? 'text-slate-400' : 'text-neutral-500'
                              }`}
                            >
                              #{cust._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {cust.email && (
                            <div className="flex items-center gap-1">
                              <Mail
                                className={`w-3 h-3 ${
                                  isLight ? 'text-slate-400' : 'text-neutral-500'
                                }`}
                              />
                              <span
                                className={`truncate max-w-[140px] text-[11px] ${
                                  isLight ? 'text-slate-600' : 'text-neutral-300'
                                }`}
                              >
                                {cust.email}
                              </span>
                            </div>
                          )}
                          {cust.phone && (
                            <div className="flex items-center gap-1">
                              <Phone
                                className={`w-3 h-3 ${
                                  isLight ? 'text-slate-400' : 'text-neutral-500'
                                }`}
                              />
                              <span className="font-mono text-[10.5px]">
                                {cust.phone}
                              </span>
                            </div>
                          )}
                          {!cust.email && !cust.phone && (
                            <span className="text-[10px] italic text-neutral-500">
                              No contact info
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {addr?.city ? (
                          <div className="flex items-center gap-1 text-[11px]">
                            <MapPin
                              className={`w-3 h-3 flex-shrink-0 ${
                                isLight ? 'text-emerald-600' : 'text-emerald-400'
                              }`}
                            />
                            <span
                              className={`truncate max-w-[120px] ${
                                isLight ? 'text-slate-700' : 'text-neutral-200'
                              }`}
                            >
                              {addr.city}
                              {addr.state ? `, ${addr.state}` : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] italic text-neutral-500">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isLight ? 'text-slate-900' : 'text-white'
                          }`}
                        >
                          {cust.ordersCount || 0}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-bold ${
                            isLight ? 'text-emerald-700' : 'text-emerald-400'
                          }`}
                        >
                          {formatPrice(cust.totalSpent || 0)}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] ${
                            isLight ? 'text-slate-500' : 'text-neutral-400'
                          }`}
                        >
                          {formatDate(cust.createdAt)}
                        </span>
                      </td>

                      <td className="py-3 px-4 sm:px-6 text-right">
                        <Link
                          href="/admin/customers"
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                            isLight
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                              : 'bg-[#15231F] hover:bg-purple-950/60 text-purple-300 border-purple-500/30'
                          }`}
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
