'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Check,
  Send,
  SlidersHorizontal,
  ArrowUpDown,
  CreditCard,
  Calendar,
  RotateCcw,
  IndianRupee,
  RefreshCw,
} from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { toast } from '@/lib/toast';

const getStatusTheme = (status: string) => {
  switch (status) {
    case 'Pending':
      return {
        label: 'Pending',
        bg: 'bg-amber-50',
        text: 'text-amber-950 font-bold',
        border: 'border-amber-300',
        ring: 'focus:ring-amber-400/30',
        dot: 'bg-amber-500 animate-pulse',
        dispatchBg: 'bg-amber-100 text-amber-950 border-amber-300',
        dispatchText: 'Awaiting Dispatch',
        dispatchIcon: Clock,
        tabActive: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-extrabold shadow-sm shadow-amber-700/25 ring-1 ring-amber-500/40',
      };
    case 'Processing':
      return {
        label: 'Processing',
        bg: 'bg-sky-50',
        text: 'text-sky-950 font-bold',
        border: 'border-sky-300',
        ring: 'focus:ring-sky-400/30',
        dot: 'bg-sky-500',
        dispatchBg: 'bg-sky-100 text-sky-950 border-sky-300',
        dispatchText: 'Ready to Dispatch',
        dispatchIcon: Package,
        tabActive: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white font-extrabold shadow-sm shadow-sky-700/25 ring-1 ring-sky-500/40',
      };
    case 'Shipped':
      return {
        label: 'Dispatched',
        bg: 'bg-purple-50',
        text: 'text-purple-950 font-bold',
        border: 'border-purple-300',
        ring: 'focus:ring-purple-400/30',
        dot: 'bg-purple-600 animate-pulse',
        dispatchBg: 'bg-purple-100 text-purple-950 border-purple-300 font-bold shadow-xs',
        dispatchText: 'Dispatched / In Transit',
        dispatchIcon: Truck,
        tabActive: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-extrabold shadow-sm shadow-purple-700/25 ring-1 ring-purple-500/40',
      };
    case 'Delivered':
      return {
        label: 'Delivered',
        bg: 'bg-emerald-50',
        text: 'text-emerald-950 font-bold',
        border: 'border-emerald-300',
        ring: 'focus:ring-emerald-400/30',
        dot: 'bg-emerald-600',
        dispatchBg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        dispatchText: 'Delivered',
        dispatchIcon: CheckCircle2,
        tabActive: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold shadow-sm shadow-emerald-700/25 ring-1 ring-emerald-500/40',
      };
    case 'Cancelled':
      return {
        label: 'Cancelled',
        bg: 'bg-rose-50',
        text: 'text-rose-950 font-bold',
        border: 'border-rose-300',
        ring: 'focus:ring-rose-400/30',
        dot: 'bg-rose-600',
        dispatchBg: 'bg-rose-100 text-rose-950 border-rose-300',
        dispatchText: 'Cancelled',
        dispatchIcon: X,
        tabActive: 'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-extrabold shadow-sm shadow-rose-700/25 ring-1 ring-rose-500/40',
      };
    default:
      return {
        label: status || 'Pending',
        bg: 'bg-slate-50',
        text: 'text-slate-900 font-bold',
        border: 'border-slate-300',
        ring: 'focus:ring-slate-400/30',
        dot: 'bg-slate-500',
        dispatchBg: 'bg-slate-100 text-slate-800 border-slate-300',
        dispatchText: status || 'Pending',
        dispatchIcon: Clock,
        tabActive: 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold shadow-sm shadow-emerald-700/25 ring-1 ring-emerald-500/40',
      };
  }
};

const OrderItemRow = ({ item }: { item: any }) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = !imgError && (item.image || item.product?.images?.[0]) 
    ? (item.image || item.product?.images?.[0]) 
    : 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=400';

  return (
    <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-50/90 border border-slate-200/80 hover:bg-emerald-50/60 hover:border-emerald-200 transition-all group shadow-2xs">
      {/* Product Image Thumbnail */}
      <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-slate-200/90 bg-white shadow-2xs">
        <img
          src={imageUrl}
          alt={item.name || 'Product'}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
        />
        {/* Quantity floating badge over image */}
        <span className="absolute bottom-0 right-0 bg-slate-900/90 text-white font-mono text-[9px] font-bold px-1 rounded-tl-md">
          ×{item.quantity}
        </span>
      </div>

      {/* Details: Name, Size, and Price */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-900 truncate leading-snug group-hover:text-emerald-800 transition-colors" title={item.name}>
          {item.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {item.size && (
            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200 shadow-2xs">
              {item.size}
            </span>
          )}
          <span className="text-[10px] font-bold text-emerald-700">
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function AdminOrdersPage() {
  const isLight = true;

  // Filter & Search States
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all'); // 'all' | 'cod' | 'online'
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all'); // 'all' | 'paid' | 'pending'
  const [dispatchFilter, setDispatchFilter] = useState<string>('all'); // 'all' | 'tracked' | 'untracked'
  const [dateFilter, setDateFilter] = useState<string>('all'); // 'all' | 'today' | 'yesterday' | '7days' | 'month'
  const [sortBy, setSortBy] = useState<string>('newest'); // 'newest' | 'oldest' | 'price_desc' | 'price_asc' | 'items_desc'

  const [trackingModal, setTrackingModal] = useState<{ id: string; status: string; trackingNumber: string } | null>(null);

  // Fetch all orders so that counts and multi-filters work seamlessly client-side
  const { data, isLoading, refetch } = useAdminOrders('All');
  const orders = data?.orders || [];
  const updateStatusMutation = useUpdateOrderStatus();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
      toast.success(`Order status updated to ${newStatus}.`, {
        title: 'Fulfillment Updated',
      });
    } catch (e) {
      toast.error('Failed to update order status.', {
        title: 'Update Failed',
      });
    }
  };

  const handleSaveTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModal) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: trackingModal.id,
        status: trackingModal.status,
        trackingNumber: trackingModal.trackingNumber,
      });
      setTrackingModal(null);
      toast.success('Courier airway tracking number attached successfully.', {
        title: 'Tracking Attached',
      });
    } catch (e) {
      toast.error('Error attaching tracking number.', {
        title: 'Error',
      });
    }
  };

  // Status Tab Live Counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      All: orders.length,
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
    orders.forEach((ord) => {
      if (counts[ord.orderStatus] !== undefined) {
        counts[ord.orderStatus]++;
      }
    });
    return counts;
  }, [orders]);

  // Overall KPI Metrics
  const kpiStats = useMemo(() => {
    let totalRevenue = 0;
    let awaitingDispatch = 0;
    let inTransit = 0;
    let delivered = 0;

    orders.forEach((ord) => {
      totalRevenue += Number(ord.totalPrice) || 0;
      if (ord.orderStatus === 'Pending' || ord.orderStatus === 'Processing') {
        awaitingDispatch++;
      } else if (ord.orderStatus === 'Shipped') {
        inTransit++;
      } else if (ord.orderStatus === 'Delivered') {
        delivered++;
      }
    });

    return {
      totalOrders: orders.length,
      totalRevenue,
      awaitingDispatch,
      inTransit,
      delivered,
    };
  }, [orders]);

  // Comprehensive Multi-Filtered & Sorted Orders
  const filteredAndSortedOrders = useMemo(() => {
    const result = orders.filter((ord) => {
      // 1. Status Filter
      if (selectedStatus !== 'All' && ord.orderStatus !== selectedStatus) {
        return false;
      }

      // 2. Multi-field Search Filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const orderNum = (ord.orderNumber || '').toLowerCase();
        const custName = (ord.shippingAddress?.fullName || '').toLowerCase();
        const phone = (ord.shippingAddress?.phone || '').toLowerCase();
        const city = (ord.shippingAddress?.city || '').toLowerCase();
        const state = (ord.shippingAddress?.state || '').toLowerCase();
        const tracking = (ord.trackingNumber || '').toLowerCase();
        const itemMatch = ord.orderItems?.some((item: any) =>
          (item.name || '').toLowerCase().includes(q)
        );

        const matches =
          orderNum.includes(q) ||
          custName.includes(q) ||
          phone.includes(q) ||
          city.includes(q) ||
          state.includes(q) ||
          tracking.includes(q) ||
          itemMatch;

        if (!matches) return false;
      }

      // 3. Payment Method Filter
      if (paymentMethodFilter !== 'all') {
        const method = (ord.paymentMethod || '').toLowerCase();
        const isCod = method.includes('cod') || method.includes('cash');
        if (paymentMethodFilter === 'cod' && !isCod) return false;
        if (paymentMethodFilter === 'online' && isCod) return false;
      }

      // 4. Payment Status Filter
      if (paymentStatusFilter !== 'all') {
        const isPaid = ord.paymentStatus === 'Completed';
        if (paymentStatusFilter === 'paid' && !isPaid) return false;
        if (paymentStatusFilter === 'pending' && isPaid) return false;
      }

      // 5. Dispatch / Airway Tracking Filter
      if (dispatchFilter !== 'all') {
        const hasTracking = Boolean(ord.trackingNumber && ord.trackingNumber.trim());
        if (dispatchFilter === 'tracked' && !hasTracking) return false;
        if (dispatchFilter === 'untracked' && hasTracking) return false;
      }

      // 6. Date Range Filter
      if (dateFilter !== 'all') {
        const orderDate = new Date(ord.createdAt);
        const now = new Date();

        if (dateFilter === 'today') {
          const isSameDay =
            orderDate.getDate() === now.getDate() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear();
          if (!isSameDay) return false;
        } else if (dateFilter === 'yesterday') {
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          const isYesterday =
            orderDate.getDate() === yesterday.getDate() &&
            orderDate.getMonth() === yesterday.getMonth() &&
            orderDate.getFullYear() === yesterday.getFullYear();
          if (!isYesterday) return false;
        } else if (dateFilter === '7days') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (orderDate < sevenDaysAgo) return false;
        } else if (dateFilter === 'month') {
          const isThisMonth =
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear();
          if (!isThisMonth) return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'price_desc') {
        return (Number(b.totalPrice) || 0) - (Number(a.totalPrice) || 0);
      }
      if (sortBy === 'price_asc') {
        return (Number(a.totalPrice) || 0) - (Number(b.totalPrice) || 0);
      }
      if (sortBy === 'items_desc') {
        return (b.orderItems?.length || 0) - (a.orderItems?.length || 0);
      }
      return 0;
    });

    return result;
  }, [
    orders,
    selectedStatus,
    searchTerm,
    paymentMethodFilter,
    paymentStatusFilter,
    dispatchFilter,
    dateFilter,
    sortBy,
  ]);

  // Total Revenue of Current Filter View
  const filteredRevenue = useMemo(() => {
    return filteredAndSortedOrders.reduce((sum, ord) => sum + (Number(ord.totalPrice) || 0), 0);
  }, [filteredAndSortedOrders]);

  // Check if any filter is active
  const isAnyFilterActive =
    selectedStatus !== 'All' ||
    searchTerm.trim() !== '' ||
    paymentMethodFilter !== 'all' ||
    paymentStatusFilter !== 'all' ||
    dispatchFilter !== 'all' ||
    dateFilter !== 'all' ||
    sortBy !== 'newest';

  const resetAllFilters = () => {
    setSelectedStatus('All');
    setSearchTerm('');
    setPaymentMethodFilter('all');
    setPaymentStatusFilter('all');
    setDispatchFilter('all');
    setDateFilter('all');
    setSortBy('newest');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Header */}
      <div
        className={`p-5 sm:p-6 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl shadow-lg transition-all ${
          isLight
            ? 'bg-gradient-to-r from-[#EBF7F2] via-[#E4F4EC] to-[#DCF1E6] border-[#B2DFD0] text-[#022D24] shadow-emerald-950/5'
            : 'bg-gradient-to-r from-[#0C1714] via-[#091310] to-[#08100D] border-[#1C332B] text-white shadow-black/60'
        }`}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <h1
              className={`font-serif text-2xl font-bold tracking-tight ${
                isLight ? 'text-[#022D24]' : 'text-white'
              }`}
            >
              Orders & Consignments
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-600 text-white shadow-xs">
              {filteredAndSortedOrders.length}
            </span>
          </div>
          <p className="text-xs text-emerald-900/70 mt-1">
            Real-time fulfillment, airway courier tracking & payment verification
          </p>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {isAnyFilterActive && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 text-rose-700 border border-rose-300 hover:bg-rose-50 shadow-xs transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/90 text-emerald-950 border border-emerald-300 hover:bg-emerald-100 shadow-xs transition-all cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Quick Filter KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Total Orders Card */}
        <div
          onClick={() => setSelectedStatus('All')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            selectedStatus === 'All'
              ? 'bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white/95 border-emerald-200/80 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">Total Orders</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-poppins text-slate-900">{kpiStats.totalOrders}</div>
          <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
            {formatPrice(kpiStats.totalRevenue)} gross
          </div>
        </div>

        {/* Awaiting Dispatch Card */}
        <div
          onClick={() => setSelectedStatus(selectedStatus === 'Pending' ? 'Processing' : 'Pending')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            selectedStatus === 'Pending' || selectedStatus === 'Processing'
              ? 'bg-gradient-to-br from-amber-500/15 to-amber-600/5 border-amber-500 ring-2 ring-amber-500/20'
              : 'bg-white/95 border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">Awaiting Dispatch</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-poppins text-amber-950">{kpiStats.awaitingDispatch}</div>
          <div className="text-[11px] font-semibold text-amber-800 mt-0.5">
            Needs courier packing
          </div>
        </div>

        {/* Dispatched / In Transit Card */}
        <div
          onClick={() => setSelectedStatus('Shipped')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            selectedStatus === 'Shipped'
              ? 'bg-gradient-to-br from-purple-500/15 to-purple-600/5 border-purple-500 ring-2 ring-purple-500/20'
              : 'bg-white/95 border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900">In Transit</span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold font-poppins text-purple-950">{kpiStats.inTransit}</div>
          <div className="text-[11px] font-semibold text-purple-800 mt-0.5">
            Shipped on courier
          </div>
        </div>

        {/* Delivered Card */}
        <div
          onClick={() => setSelectedStatus('Delivered')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            selectedStatus === 'Delivered'
              ? 'bg-gradient-to-br from-emerald-500/15 to-teal-600/5 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white/95 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-poppins text-emerald-950">{kpiStats.delivered}</div>
          <div className="text-[11px] font-semibold text-emerald-800 mt-0.5">
            Successfully completed
          </div>
        </div>

        {/* Filtered Revenue Card */}
        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 to-teal-50/50 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">Filtered Value</span>
            <IndianRupee className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-xl font-bold font-poppins text-emerald-900">
            {formatPrice(filteredRevenue)}
          </div>
          <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
            {filteredAndSortedOrders.length} matching {filteredAndSortedOrders.length === 1 ? 'order' : 'orders'}
          </div>
        </div>
      </div>

      {/* Master Filter Toolbar */}
      <div className="p-4 rounded-3xl border border-emerald-200/90 bg-white/95 shadow-md shadow-emerald-950/5 space-y-3.5 backdrop-blur-xl">
        {/* Status Filter Tabs with Counts */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
              const isSelected = selectedStatus === st;
              const count = statusCounts[st] || 0;
              const theme = st !== 'All' ? getStatusTheme(st) : null;
              const displayLabel = st === 'Shipped' ? 'Dispatched' : st;

              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? theme
                        ? theme.tabActive
                        : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold shadow-sm shadow-emerald-700/25 ring-1 ring-emerald-500/40'
                      : 'text-slate-700 bg-slate-100/80 hover:bg-emerald-50 hover:text-emerald-900 border border-transparent hover:border-emerald-200'
                  }`}
                >
                  <span>{displayLabel}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? 'bg-white/25 text-white'
                        : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-bold text-slate-500">
            <span>Showing </span>
            <span className="text-emerald-700 font-extrabold">{filteredAndSortedOrders.length}</span>
            <span> of </span>
            <span className="text-slate-800 font-extrabold">{orders.length}</span>
            <span> orders</span>
          </div>
        </div>

        {/* Granular Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          {/* Omni Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order #, Customer, Phone, City, Tracking AWB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 font-poppins shadow-2xs bg-slate-50/90 border border-slate-200/90 text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Payment Method Filter */}
          <div className="lg:col-span-2 relative">
            <CreditCard className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full appearance-none rounded-xl pl-8 pr-7 py-2 text-xs font-semibold bg-slate-50/90 border border-slate-200/90 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">All Payment Methods</option>
              <option value="cod">💵 Cash on Delivery (COD)</option>
              <option value="online">💳 Prepaid / Online</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Payment Status Filter */}
          <div className="lg:col-span-2 relative">
            <CheckCircle2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full appearance-none rounded-xl pl-8 pr-7 py-2 text-xs font-semibold bg-slate-50/90 border border-slate-200/90 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">All Payment Status</option>
              <option value="paid">✅ Paid (Completed)</option>
              <option value="pending">⏳ Payment Pending</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Dispatch & Tracking Filter */}
          <div className="lg:col-span-2 relative">
            <Truck className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={dispatchFilter}
              onChange={(e) => setDispatchFilter(e.target.value)}
              className="w-full appearance-none rounded-xl pl-8 pr-7 py-2 text-xs font-semibold bg-slate-50/90 border border-slate-200/90 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">All Tracking Status</option>
              <option value="tracked">🚚 With AWB Tracking</option>
              <option value="untracked">⚠️ Awaiting AWB #</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Date Range Filter */}
          <div className="lg:col-span-2 relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full appearance-none rounded-xl pl-8 pr-7 py-2 text-xs font-semibold bg-slate-50/90 border border-slate-200/90 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all cursor-pointer shadow-2xs"
            >
              <option value="all">📅 All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">▼</span>
          </div>
        </div>

        {/* Row 3: Sort Order + Active Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          {/* Active Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-emerald-600" />
              <span>Active Filters:</span>
            </span>

            {!isAnyFilterActive ? (
              <span className="text-[11px] text-slate-400 italic">None (Displaying all consignments)</span>
            ) : (
              <>
                {selectedStatus !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                    Status: {selectedStatus === 'Shipped' ? 'Dispatched' : selectedStatus}
                    <button onClick={() => setSelectedStatus('All')} className="hover:text-emerald-700 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm.trim() && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-sky-50 text-sky-950 border border-sky-200">
                    Search: &quot;{searchTerm}&quot;
                    <button onClick={() => setSearchTerm('')} className="hover:text-sky-700 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {paymentMethodFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-950 border border-amber-200">
                    Method: {paymentMethodFilter === 'cod' ? 'COD' : 'Prepaid/Online'}
                    <button onClick={() => setPaymentMethodFilter('all')} className="hover:text-amber-700 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {paymentStatusFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-purple-50 text-purple-950 border border-purple-200">
                    Payment: {paymentStatusFilter === 'paid' ? 'Paid' : 'Pending'}
                    <button onClick={() => setPaymentStatusFilter('all')} className="hover:text-purple-700 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {dispatchFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-950 border border-indigo-200">
                    Tracking: {dispatchFilter === 'tracked' ? 'AWB Attached' : 'Awaiting AWB'}
                    <button onClick={() => setDispatchFilter('all')} className="hover:text-indigo-700 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {dateFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 text-rose-950 border border-rose-200">
                    Date: {dateFilter === '7days' ? 'Last 7 Days' : dateFilter}
                    <button onClick={() => setDateFilter('all')} className="hover:text-rose-700 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={resetAllFilters}
                  className="text-[10px] font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer ml-1 inline-flex items-center gap-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 self-end">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <span className="text-[11px] font-semibold text-slate-500">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl pl-2.5 pr-6 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="items_desc">Most Items First</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[9px]">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Consignments Container (Responsive Table Card) */}
      <div
        className={`rounded-3xl border overflow-hidden backdrop-blur-xl transition-all shadow-xl ${
          isLight
            ? 'bg-white/95 border-[#BCE3D7] shadow-emerald-950/5'
            : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] shadow-black/70'
        }`}
      >
        {/* Mobile View: Cards Layout */}
        <div className="md:hidden p-3.5 space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <span>Retrieving consignments database...</span>
            </div>
          ) : filteredAndSortedOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <p className="font-bold text-slate-800 text-sm">No orders match criteria</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Try clearing active filters or searching for different keywords.
              </p>
              {isAnyFilterActive && (
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          ) : (
            filteredAndSortedOrders.map((ord) => {
              const theme = getStatusTheme(ord.orderStatus);
              const DispatchIcon = theme.dispatchIcon;

              return (
                <div
                  key={`m-ord-${ord._id}`}
                    className={`p-4 rounded-2xl border transition-all ${
                      isLight ? 'bg-white/90 border-emerald-200/90 shadow-xs' : 'bg-[#091512] border-[#1E332B]'
                    } space-y-3`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-xs block text-slate-900">
                          <span className="text-emerald-500">#</span>{ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{formatDate(ord.createdAt)}</span>
                      </div>

                      {/* Color-Coded Status Select with high-contrast text */}
                      <div className="relative">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className={`appearance-none rounded-xl pl-6 pr-6 py-1.5 text-xs font-bold border shadow-xs cursor-pointer transition-colors ${theme.bg} ${theme.text} ${theme.border} ${theme.ring} focus:outline-none focus:ring-2`}
                        >
                          <option value="Pending" className="bg-amber-50 text-amber-950 font-bold">
                            ⏳ Pending
                          </option>
                          <option value="Processing" className="bg-sky-50 text-sky-950 font-bold">
                            📦 Processing
                          </option>
                          <option value="Shipped" className="bg-purple-50 text-purple-950 font-bold">
                            🚚 Dispatched
                          </option>
                          <option value="Delivered" className="bg-emerald-50 text-emerald-950 font-bold">
                            ✅ Delivered
                          </option>
                          <option value="Cancelled" className="bg-rose-50 text-rose-950 font-bold">
                            ❌ Cancelled
                          </option>
                        </select>
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                          <span className={`w-2 h-2 rounded-full block ${theme.dot}`} />
                        </span>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60 text-[9px]">
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* Dispatch Status Pill */}
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${theme.dispatchBg}`}>
                        <DispatchIcon className="w-3 h-3 flex-shrink-0" />
                        <span>Dispatch: {theme.dispatchText}</span>
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <p className="font-bold text-slate-900">{ord.shippingAddress?.fullName || 'Guest'}</p>
                        <p className="text-[11px] text-slate-500">
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.state} • {ord.shippingAddress?.phone}
                        </p>
                      </div>

                      {/* Mobile Product Items with Images */}
                      <div className="space-y-1.5 pt-1">
                        <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                          Ordered Items ({ord.orderItems?.length || 0}):
                        </p>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                          {ord.orderItems?.map((item: any, i: number) => (
                            <OrderItemRow key={item._id || i} item={item} />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          ord.paymentStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${ord.paymentStatus === 'Completed' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                          {ord.paymentMethod} ({ord.paymentStatus === 'Completed' ? 'Paid' : 'Pending'})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <p className={`font-poppins font-bold text-sm ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                        {formatPrice(ord.totalPrice)}
                      </p>
                      {ord.trackingNumber ? (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-lg border bg-purple-50 text-purple-950 border-purple-300 shadow-xs flex items-center gap-1">
                          <Truck className="w-3 h-3 text-purple-700" />
                          <span>{ord.trackingNumber}</span>
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            setTrackingModal({
                              id: ord._id,
                              status: ord.orderStatus,
                              trackingNumber: '',
                            })
                          }
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-purple-300 bg-purple-50 text-purple-950 hover:bg-purple-600 hover:text-white transition-all shadow-xs"
                        >
                          + Add Tracking
                        </button>
                      )}
                    </div>
                  </div>
                );
            })
          )}
        </div>

        {/* Desktop View: Wide Data Table */}
        <div className="hidden md:block overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead
              className={`uppercase tracking-wider font-semibold border-b ${
                isLight ? 'bg-[#F4FAF6] text-emerald-950 border-[#BCE3D7]' : 'bg-[#09110F] text-neutral-400 border-[#1E332B]'
              }`}
            >
              <tr>
                <th className="p-4 pl-6">Order Ref</th>
                <th className="p-4">Customer </th>
                <th className="p-4 min-w-[240px]">Ordered Items</th>
                <th className="p-4">Price</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status & Dispatch</th>
                <th className="p-4 pr-6 text-right">Tracking Airway</th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight ? 'divide-[#E8F5EF] text-slate-700' : 'divide-[#162520] text-neutral-300'
              }`}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Retrieving orders database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                        <SlidersHorizontal className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">No matching orders found</p>
                        <p className="text-xs text-slate-500 mt-1">
                          No orders match your filter and search criteria. Try clearing some filters or searching for a different keyword.
                        </p>
                      </div>
                      {isAnyFilterActive && (
                        <button
                          onClick={resetAllFilters}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-700/25 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset All Filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map((ord) => (
                  <tr
                    key={ord._id}
                    className={`transition-colors ${isLight ? 'hover:bg-emerald-50/40' : 'hover:bg-[#12211C]/80'}`}
                  >
                    <td className="p-4 pl-6">
                      <span className={`font-mono font-bold block text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        <span className="text-emerald-500">#</span>{ord.orderNumber}
                      </span>
                      <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                        {formatDate(ord.createdAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {ord.shippingAddress?.fullName || 'Guest'}
                      </p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                      </p>
                      <p className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                        {ord.shippingAddress?.phone}
                      </p>
                    </td>

                    <td className="p-4 min-w-[240px] max-w-sm">
                      <div className="max-h-[140px] overflow-y-auto space-y-1.5 scrollbar-thin pr-1">
                        {ord.orderItems?.map((item: any, i: number) => (
                          <OrderItemRow key={item._id || i} item={item} />
                        ))}
                      </div>
                    </td>

                    <td className={`p-4 font-poppins font-bold text-sm ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                      <div>{formatPrice(ord.totalPrice)}</div>
                      {ord.coupon?.code && (
                        <div className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                          <span>{ord.coupon.code}</span>
                          {(ord.discountPrice || ord.coupon?.discount) > 0 && (
                            <span>(-{formatPrice(ord.discountPrice || ord.coupon?.discount)})</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`font-bold block text-xs ${isLight ? 'text-slate-900' : 'text-white'} mb-1`}>
                        {ord.paymentMethod}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border shadow-2xs ${
                          ord.paymentStatus === 'Completed'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            ord.paymentStatus === 'Completed' ? 'bg-emerald-600' : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        {ord.paymentStatus === 'Completed' ? 'Paid' : 'Payment Pending'}
                      </span>
                    </td>

                    {/* Status & Dispatch Column: Customized color backgrounds and high-contrast text */}
                    <td className="p-4 min-w-[210px]">
                      {(() => {
                        const theme = getStatusTheme(ord.orderStatus);
                        const DispatchIcon = theme.dispatchIcon;
                        return (
                          <div className="space-y-1.5">
                            {/* Interactive Status Selector with dynamic background & sharp text color */}
                            <div className="relative inline-block w-full">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                                className={`w-full appearance-none rounded-xl pl-7 pr-7 py-1.5 text-xs font-bold border shadow-xs cursor-pointer transition-all ${theme.bg} ${theme.text} ${theme.border} ${theme.ring} focus:outline-none focus:ring-2`}
                              >
                                <option value="Pending" className="bg-amber-50 text-amber-950 font-bold">
                                  ⏳ Pending
                                </option>
                                <option value="Processing" className="bg-sky-50 text-sky-950 font-bold">
                                  📦 Processing
                                </option>
                                <option value="Shipped" className="bg-purple-50 text-purple-950 font-bold">
                                  🚚 Dispatched (Shipped)
                                </option>
                                <option value="Delivered" className="bg-emerald-50 text-emerald-950 font-bold">
                                  ✅ Delivered
                                </option>
                                <option value="Cancelled" className="bg-rose-50 text-rose-950 font-bold">
                                  ❌ Cancelled
                                </option>
                              </select>
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                                <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                              </span>
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60 text-[9px]">
                                ▼
                              </span>
                            </div>

                            {/* Clear Dispatch Indicator Pill with Dedicated Status Color */}
                            <div className="flex items-center gap-1">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shadow-2xs truncate ${theme.dispatchBg}`}
                              >
                                <DispatchIcon className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{theme.dispatchText}</span>
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Tracking Airway Column */}
                    <td className="p-4 pr-6 text-right">
                      {ord.trackingNumber ? (
                        <div className="inline-flex flex-col items-end gap-1">
                          <span
                            className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border bg-purple-50 text-purple-950 border-purple-300 shadow-xs flex items-center gap-1.5"
                          >
                            <Truck className="w-3 h-3 text-purple-700" />
                            <span>{ord.trackingNumber}</span>
                          </span>
                          <button
                            onClick={() =>
                              setTrackingModal({
                                id: ord._id,
                                status: ord.orderStatus,
                                trackingNumber: ord.trackingNumber || '',
                              })
                            }
                            className="text-[10px] font-bold text-purple-700 hover:text-purple-950 hover:underline cursor-pointer"
                          >
                            Edit AWB
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            setTrackingModal({
                              id: ord._id,
                              status: ord.orderStatus,
                              trackingNumber: '',
                            })
                          }
                          className="text-xs font-bold px-3 py-1.5 rounded-xl border border-purple-300 bg-purple-50 text-purple-950 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>+ Attach AWB</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tracking Modal */}
      {trackingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div
            className={`border rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl ${
              isLight ? 'bg-white border-emerald-300' : 'bg-[#0A1210] border-[#1E332B]'
            }`}
          >
            <h3
              className={`font-serif text-sm font-bold uppercase tracking-wider ${
                isLight ? 'text-emerald-950' : 'text-white'
              }`}
            >
              Attach Airway Courier Tracking
            </h3>
            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label
                  className={`block mb-1 font-semibold font-poppins ${
                    isLight ? 'text-emerald-950' : 'text-neutral-300'
                  }`}
                >
                  Airway Tracking Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BLUEDART-98421482"
                  value={trackingModal.trackingNumber}
                  onChange={(e) =>
                    setTrackingModal({ ...trackingModal, trackingNumber: e.target.value })
                  }
                  className={`w-full rounded-xl px-3.5 py-2 font-mono text-xs focus:outline-none focus:ring-2 ${
                    isLight
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 focus:bg-white focus:ring-emerald-500/20'
                      : 'bg-[#070D0B] border border-[#1E332B] text-white focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModal(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100 border border-slate-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateStatusMutation.isPending}
                  className="px-4 py-1.5 rounded-xl font-extrabold uppercase tracking-wider text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-md shadow-emerald-700/25 border border-emerald-500/40 transition-all cursor-pointer"
                >
                  {updateStatusMutation.isPending ? 'Saving...' : 'Attach Number'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
