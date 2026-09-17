'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  User,
  UserPlus,
  Users,
  UserX,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Package,
  ShieldBan,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  ExternalLink,
  Square,
  CheckSquare,
  Sparkles,
  ArrowUp,
  CreditCard,
} from 'lucide-react';
import {
  useAdminCustomers,
  useAdminCustomerDetails,
  useAdminCreateCustomer,
  useAdminUpdateCustomerStatus,
} from '@/hooks/useAdmin';
import { formatPrice, formatDate } from '@/lib/utils';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { Customer } from '@/types';

const AVATAR_COLORS = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-teal-100 text-teal-700',
];

const getInitials = (name: string) => {
  const parts = (name || '').trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name || '').slice(0, 2).toUpperCase();
};

export default function AdminCustomersPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === 'light';

  // API Data
  const { data, isLoading } = useAdminCustomers();
  const createCustomerMutation = useAdminCreateCustomer();
  const updateStatusMutation = useAdminUpdateCustomerStatus();

  // Pure real database customers
  const allCustomers: Customer[] = useMemo(() => {
    return data?.customers || [];
  }, [data]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'new' | 'blocked'>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'overview' | 'orders' | 'addresses' | 'payments'>('overview');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Add Customer Form state
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [formError, setFormError] = useState('');

  // Selected customer object for right panel
  const selectedCustomer = useMemo(() => {
    if (allCustomers.length === 0) return null;
    return allCustomers.find((c) => c._id === selectedCustomerId) || allCustomers[0] || null;
  }, [allCustomers, selectedCustomerId]);

  // Hook for detailed customer orders from database
  const { data: realCustomerDetails, isLoading: isCustomerDetailsLoading } = useAdminCustomerDetails(
    selectedCustomer ? selectedCustomer._id : null
  );

  // KPI Calculations
  const totalCount = allCustomers.length;
  const activeCount = allCustomers.filter((c) => (c.status || 'Active') === 'Active').length;
  const newCount = allCustomers.filter((c) => {
    const joined = new Date(c.createdAt).getTime();
    return Date.now() - joined < 30 * 24 * 60 * 60 * 1000;
  }).length;
  const blockedCount = allCustomers.filter((c) => c.status === 'Blocked').length;

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return allCustomers.filter((c) => {
      // Tab filter
      if (activeTab === 'active' && (c.status || 'Active') !== 'Active') return false;
      if (activeTab === 'blocked' && c.status !== 'Blocked') return false;
      if (activeTab === 'new') {
        const joined = new Date(c.createdAt).getTime();
        if (Date.now() - joined >= 30 * 24 * 60 * 60 * 1000) return false;
      }

      // Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matches =
          c.name.toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.phone || '').includes(q) ||
          (c.latestShippingAddress?.city || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [allCustomers, activeTab, searchTerm]);

  // Paginated customers
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // Checkbox select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedCustomers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedCustomers.map((c) => c._id)));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedRows);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedRows(next);
  };

  // Toggle block status
  const handleToggleBlock = async (cust: Customer) => {
    const nextStatus = cust.status === 'Blocked' ? 'Active' : 'Blocked';
    try {
      await updateStatusMutation.mutateAsync({ id: cust._id, status: nextStatus });
      cust.status = nextStatus;
      setActiveMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit New Customer
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!newCustForm.name.trim()) {
      setFormError('Please enter customer full name');
      return;
    }

    try {
      await createCustomerMutation.mutateAsync(newCustForm);
      setIsAddModalOpen(false);
      setNewCustForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      });
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to create customer');
    }
  };

  const avgOrderValue =
    selectedCustomer && selectedCustomer.ordersCount > 0
      ? Math.round(selectedCustomer.totalSpent / selectedCustomer.ordersCount)
      : 0;

  return (
    <div className={isLight ? 'space-y-6 pb-12 font-sans text-slate-800' : 'space-y-6 pb-12 font-sans text-neutral-100'}>
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-[28px] font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Customers
          </h1>
          <p className={`text-xs sm:text-sm mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            Manage your customers and view their details
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all shadow-sm self-start sm:self-auto ${
            isLight
              ? 'bg-[#111827] hover:bg-[#1f2937] text-white active:scale-98'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-[#0E1715] border-[#1B2925] shadow-lg shadow-black/40'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              Total Customers
            </span>
            <p className={`text-2xl font-bold tracking-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {totalCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-neutral-400'}>Registered in store</span>
            </div>
          </div>
        </div>

        {/* Card 2: New Customers */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-[#0E1715] border-[#1B2925] shadow-lg shadow-black/40'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              New Customers
            </span>
            <p className={`text-2xl font-bold tracking-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {newCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-neutral-400'}>Joined last 30 days</span>
            </div>
          </div>
        </div>

        {/* Card 3: Active Customers */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-[#0E1715] border-[#1B2925] shadow-lg shadow-black/40'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              Active Customers
            </span>
            <p className={`text-2xl font-bold tracking-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {activeCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-neutral-400'}>Active accounts</span>
            </div>
          </div>
        </div>

        {/* Card 4: Blocked Customers */}
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center gap-4 ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-[#0E1715] border-[#1B2925] shadow-lg shadow-black/40'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
              Blocked Customers
            </span>
            <p className={`text-2xl font-bold tracking-tight mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {blockedCount.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-[11px]">
              <span className={isLight ? 'text-slate-500 font-medium' : 'text-neutral-400'}>Restricted access</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className={`p-2 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isLight ? 'bg-white border-slate-200/90' : 'bg-[#0E1715] border-[#1B2925]'
      }`}>
        {/* Left Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pl-2">
          {(
            [
              { id: 'all', label: `All Customers (${totalCount})` },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'new', label: `New (${newCount})` },
              { id: 'blocked', label: `Blocked (${blockedCount})` },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all relative ${
                  isActive
                    ? isLight
                      ? 'text-slate-900 font-bold after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-slate-900'
                      : 'text-white font-bold after:content-[""] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-emerald-500'
                    : isLight
                    ? 'text-slate-500 hover:text-slate-800'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Search & Filters */}
        <div className="flex items-center gap-2 pr-1 self-stretch md:self-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-slate-400' : 'text-neutral-500'
            }`} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium border outline-none transition-all ${
                isLight
                  ? 'bg-slate-50/60 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-400'
                  : 'bg-[#0B1512] border-[#1B2925] text-white placeholder:text-neutral-500 focus:border-emerald-500/50'
              }`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                : 'bg-[#101E1A] border-[#1B2925] text-neutral-300 hover:text-white'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* 4. Split Screen: Main Table + Right Detail Sidebar */}
      <div className="flex flex-col lg:flex-row items-start gap-5">
        {/* Left: Customer Table Card */}
        <div className={`flex-1 min-w-0 w-full rounded-2xl border overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
            : 'bg-[#0E1715] border-[#1B2925]'
        }`}>
          {/* Mobile Horizontal Swipe Indicator */}
          <div
            className={`md:hidden px-4 py-1.5 text-[10px] flex items-center justify-between border-b ${
              isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-[#0A1512] text-emerald-400 border-[#1E332B]'
            }`}
          >
            <span>Scroll horizontally for full customer directory</span>
            <span className="font-mono text-[11px]">→</span>
          </div>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse text-xs min-w-[760px]">
              <thead>
                <tr className={`border-b font-semibold ${
                  isLight ? 'border-slate-200 text-slate-500 bg-white' : 'border-[#1B2925] text-neutral-400 bg-[#0C1513]'
                }`}>
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <button onClick={handleSelectAll} className="flex items-center text-slate-400 hover:text-slate-600">
                      {selectedRows.size > 0 && selectedRows.size === paginatedCustomers.length ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-3">Customer</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3 text-center">Total Orders</th>
                  <th className="py-3.5 px-3">Total Purchase</th>
                  <th className="py-3.5 px-3">Last Order</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 pr-4 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isLight ? 'divide-slate-100' : 'divide-[#15231F]'}`}>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-xs text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading patrons from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-xs text-slate-400">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-neutral-600" />
                        <p className="font-semibold text-xs text-slate-700 dark:text-neutral-300">
                          No customers found
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                          {searchTerm
                            ? `No customer matching "${searchTerm}".`
                            : 'Registered patrons will appear here once accounts or orders are created.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((cust, idx) => {
                    const isSelected = selectedCustomerId === cust._id;
                    const isChecked = selectedRows.has(cust._id);
                    const isBlocked = cust.status === 'Blocked';
                    const isInactive = cust.status === 'Inactive';
                    const colorClass = AVATAR_COLORS[idx % AVATAR_COLORS.length];

                    return (
                      <tr
                        key={cust._id}
                        onClick={() => setSelectedCustomerId(cust._id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? isLight
                              ? 'bg-slate-50/90 font-medium'
                              : 'bg-[#14231E]'
                            : isLight
                            ? 'hover:bg-slate-50/50'
                            : 'hover:bg-[#111E1A]'
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 pl-4 pr-2" onClick={(e) => handleToggleRow(cust._id, e)}>
                          <button className="flex items-center text-slate-400 hover:text-slate-600">
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>

                        {/* Customer Info */}
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3">
                            {cust.avatar && !cust.avatar.includes('unsplash') ? (
                              <img
                                src={cust.avatar}
                                alt={cust.name}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-slate-200"
                              />
                            ) : (
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${colorClass}`}>
                                {getInitials(cust.name)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className={`font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {cust.name}
                              </p>
                              <p className={`text-[11px] truncate ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                                Joined {new Date(cust.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="py-3.5 px-3">
                          <div>
                            <p className={`font-mono text-xs ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                              {cust.phone || '-'}
                            </p>
                            <p className={`text-[11px] truncate ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                              {cust.email || '-'}
                            </p>
                          </div>
                        </td>

                        {/* Total Orders */}
                        <td className="py-3.5 px-3 text-center">
                          <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                            {cust.ordersCount || 0}
                          </span>
                        </td>

                        {/* Total Purchase */}
                        <td className="py-3.5 px-3">
                          <span className={`font-bold font-poppins ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {formatPrice(cust.totalSpent || 0)}
                          </span>
                        </td>

                        {/* Last Order Date */}
                        <td className="py-3.5 px-3">
                          <span className={isLight ? 'text-slate-700' : 'text-neutral-300'}>
                            {cust.lastOrderDate
                              ? new Date(cust.lastOrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                              : '-'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-3 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            isBlocked
                              ? 'bg-red-50 text-red-600 border border-red-200/60'
                              : isInactive
                              ? 'bg-orange-50 text-orange-600 border border-orange-200/60'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          }`}>
                            {cust.status || 'Active'}
                          </span>
                        </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-4 pl-2 text-right relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === cust._id ? null : cust._id);
                          }}
                          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 ${
                            isLight ? 'hover:bg-slate-100' : 'hover:bg-[#1A2A25]'
                          }`}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === cust._id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`absolute right-4 top-10 w-44 rounded-xl border shadow-xl py-1.5 z-20 text-left animate-in fade-in zoom-in-95 ${
                              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-[#101E1A] border-[#1E332B] text-neutral-200'
                            }`}
                          >
                            <button
                              onClick={() => {
                                setSelectedCustomerId(cust._id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-1.5 text-xs text-left hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                            >
                              <User className="w-3.5 h-3.5" /> View Profile
                            </button>
                            <a
                              href={`https://wa.me/${(cust.phone || '').replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full px-3.5 py-1.5 text-xs text-left hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center gap-2 text-emerald-600"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                            </a>
                            <a
                              href={`tel:${cust.phone}`}
                              className="w-full px-3.5 py-1.5 text-xs text-left hover:bg-slate-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                            >
                              <Phone className="w-3.5 h-3.5" /> Call Customer
                            </a>
                            <div className="border-t my-1 border-slate-100 dark:border-neutral-800"></div>
                            <button
                              onClick={() => handleToggleBlock(cust)}
                              className={`w-full px-3.5 py-1.5 text-xs text-left flex items-center gap-2 font-medium ${
                                cust.status === 'Blocked' ? 'text-emerald-600' : 'text-red-600'
                              }`}
                            >
                              <ShieldBan className="w-3.5 h-3.5" />
                              {cust.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className={`p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
            isLight ? 'border-slate-200 bg-white text-slate-500' : 'border-[#1B2925] bg-[#0C1513] text-neutral-400'
          }`}>
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, filteredCustomers.length)} to{' '}
              {Math.min(currentPage * pageSize, filteredCustomers.length)} of {filteredCustomers.length.toLocaleString()} customers
            </span>

            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg border disabled:opacity-40 ${
                  isLight ? 'border-slate-200 hover:bg-slate-100' : 'border-[#1E332B] hover:bg-neutral-800'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {[1, 2, 3, 4, 5].slice(0, totalPages).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                    currentPage === page
                      ? isLight
                        ? 'bg-slate-900 text-white'
                        : 'bg-emerald-600 text-white'
                      : isLight
                      ? 'text-slate-600 hover:bg-slate-100'
                      : 'text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              {totalPages > 5 && (
                <>
                  <span className="px-1 text-slate-400">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-7 h-7 rounded-lg font-bold text-xs ${
                      currentPage === totalPages
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg border disabled:opacity-40 ${
                  isLight ? 'border-slate-200 hover:bg-slate-100' : 'border-[#1E332B] hover:bg-neutral-800'
                }`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Per page selector */}
            <div className="flex items-center gap-1.5">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`py-1 px-2.5 rounded-lg border text-xs outline-none cursor-pointer ${
                  isLight ? 'border-slate-200 bg-white text-slate-700' : 'border-[#1E332B] bg-[#0E1715] text-neutral-300'
                }`}
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Selected Customer Details Sidebar (Exact match to reference UI) */}
        {selectedCustomer && (
          <div className={`w-full lg:w-[380px] xl:w-[410px] rounded-2xl border p-5 transition-all flex-shrink-0 space-y-5 ${
            isLight
              ? 'bg-white border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
              : 'bg-[#0E1715] border-[#1B2925] shadow-xl'
          }`}>
            {/* Top User Profile Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedCustomer.avatar && !selectedCustomer.avatar.includes('unsplash-placeholder') ? (
                  <img
                    src={selectedCustomer.avatar}
                    alt={selectedCustomer.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center">
                    {getInitials(selectedCustomer.name)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {selectedCustomer.name}
                    </h2>
                    <span className={`px-2 py-0.2 rounded-full text-[10.5px] font-semibold ${
                      selectedCustomer.status === 'Blocked'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : selectedCustomer.status === 'Inactive'
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {selectedCustomer.status || 'Active'}
                    </span>
                  </div>
                  <p className={`text-[11.5px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-neutral-400'}`}>
                    Customer since {new Date(selectedCustomer.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomerId(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Links */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <Phone className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                {selectedCustomer.phone ? (
                  <a href={`tel:${selectedCustomer.phone}`} className={`hover:underline font-mono ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                    {selectedCustomer.phone}
                  </a>
                ) : (
                  <span className={isLight ? 'text-slate-400' : 'text-neutral-500'}>Not provided</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Mail className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`} />
                {selectedCustomer.email ? (
                  <a href={`mailto:${selectedCustomer.email}`} className={`hover:underline ${isLight ? 'text-slate-800' : 'text-neutral-200'}`}>
                    {selectedCustomer.email}
                  </a>
                ) : (
                  <span className={isLight ? 'text-slate-400' : 'text-neutral-500'}>Not provided</span>
                )}
              </div>

              {selectedCustomer.phone && (
                <div className="flex items-center gap-2 pt-0.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <a
                    href={`https://wa.me/${(selectedCustomer.phone || '').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              )}
            </div>

            {/* 3 Metric Boxes */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-100' : 'bg-[#101E1A] border-[#1B2925]'}`}>
                <p className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedCustomer.ordersCount || 0}
                </p>
                <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Total Orders</p>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-100' : 'bg-[#101E1A] border-[#1B2925]'}`}>
                <p className={`text-base font-bold font-poppins ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {formatPrice(selectedCustomer.totalSpent || 0)}
                </p>
                <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Total Purchase</p>
              </div>

              <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-100' : 'bg-[#101E1A] border-[#1B2925]'}`}>
                <p className={`text-base font-bold font-poppins ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {formatPrice(avgOrderValue)}
                </p>
                <p className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>Avg. Order Value</p>
              </div>
            </div>

            {/* Sub Tabs: Overview | Orders | Addresses | Payments */}
            <div className={`flex items-center border-b text-xs font-semibold ${
              isLight ? 'border-slate-200' : 'border-[#1B2925]'
            }`}>
              {(['overview', 'orders', 'addresses', 'payments'] as const).map((tab) => {
                const isActive = sidebarTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSidebarTab(tab)}
                    className={`pb-2.5 px-2.5 capitalize transition-all relative ${
                      isActive
                        ? isLight
                          ? 'text-slate-900 font-bold border-b-2 border-slate-900 -mb-[1px]'
                          : 'text-white font-bold border-b-2 border-emerald-500 -mb-[1px]'
                        : isLight
                        ? 'text-slate-400 hover:text-slate-700'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab 1: OVERVIEW */}
            {sidebarTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Personal Information */}
                <div>
                  <h3 className={`font-bold text-xs mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Personal Information
                  </h3>
                  <div className={`p-3 rounded-xl space-y-2 border ${
                    isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#0B1512] border-[#162420]'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>Full Name</span>
                      <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {selectedCustomer.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>Mobile Number</span>
                      <span className={`font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {selectedCustomer.phone || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>Email Address</span>
                      <span className={isLight ? 'text-slate-900' : 'text-white'}>
                        {selectedCustomer.email || '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={isLight ? 'text-slate-500' : 'text-neutral-400'}>Account Created</span>
                      <span className={isLight ? 'text-slate-900' : 'text-white'}>
                        {formatDate(selectedCustomer.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Default Address */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Default Address
                    </h3>
                    <button onClick={() => setSidebarTab('addresses')} className="text-[11px] text-blue-600 hover:underline font-medium">
                      View All
                    </button>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                    isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#0B1512] border-[#162420]'
                  }`}>
                    <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                      {selectedCustomer.latestShippingAddress ? (
                        `${selectedCustomer.latestShippingAddress.address || ''}${selectedCustomer.latestShippingAddress.city ? `, ${selectedCustomer.latestShippingAddress.city}` : ''}${selectedCustomer.latestShippingAddress.postalCode ? ` - ${selectedCustomer.latestShippingAddress.postalCode}` : ''}${selectedCustomer.latestShippingAddress.state ? `, ${selectedCustomer.latestShippingAddress.state}` : ''}${selectedCustomer.latestShippingAddress.country ? `, ${selectedCustomer.latestShippingAddress.country}` : ''}`
                      ) : (
                        'No shipping address on file'
                      )}
                    </p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Recent Orders
                    </h3>
                    <button onClick={() => setSidebarTab('orders')} className="text-[11px] text-blue-600 hover:underline font-medium">
                      View All
                    </button>
                  </div>

                  {realCustomerDetails?.orders && realCustomerDetails.orders.length > 0 ? (
                    <div className="space-y-2">
                      {realCustomerDetails.orders.slice(0, 3).map((ord) => (
                        <div
                          key={ord._id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#0B1512] border-[#162420]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className={`font-mono font-bold text-[11px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                #{ord.orderNumber}
                              </p>
                              <p className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
                                {formatDate(ord.createdAt)}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className={`font-bold font-poppins text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>
                              {formatPrice(ord.totalPrice)}
                            </p>
                            <span className={`inline-block text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-xl border text-center text-[11px] ${
                      isLight ? 'bg-slate-50/50 border-slate-100 text-slate-400' : 'bg-[#0B1512] border-[#162420] text-neutral-500'
                    }`}>
                      No orders placed yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: ORDERS */}
            {sidebarTab === 'orders' && (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {realCustomerDetails?.orders && realCustomerDetails.orders.length > 0 ? (
                  realCustomerDetails.orders.map((ord) => (
                    <div
                      key={ord._id}
                      className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#0B1512] border-[#162420]'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs">#{ord.orderNumber}</span>
                        <span className="font-poppins font-bold text-xs">{formatPrice(ord.totalPrice)}</span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{formatDate(ord.createdAt)}</span>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`p-8 rounded-xl border text-center text-xs ${
                    isLight ? 'bg-slate-50/50 border-slate-100 text-slate-400' : 'bg-[#0B1512] border-[#162420] text-neutral-400'
                  }`}>
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold">No orders recorded</p>
                    <p className="text-[11px] mt-0.5 opacity-75">This customer has not placed any orders yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: ADDRESSES */}
            {sidebarTab === 'addresses' && (
              <div className="space-y-3">
                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                  selectedCustomer.addresses.map((addr, aIdx) => (
                    <div key={addr._id || aIdx} className={`p-3.5 rounded-xl border space-y-1 ${isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#0B1512] border-[#162420]'}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{addr.name || 'Saved Address'}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-neutral-300">
                        {addr.street}
                        {addr.city ? `, ${addr.city}` : ''}
                        {addr.postalCode ? ` - ${addr.postalCode}` : ''}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {addr.state ? `${addr.state}, ` : ''}
                        {addr.country || 'India'}
                      </p>
                    </div>
                  ))
                ) : selectedCustomer.latestShippingAddress ? (
                  <div className={`p-3.5 rounded-xl border space-y-1 ${isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#0B1512] border-[#162420]'}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">Primary Shipping Address</span>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Latest
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-neutral-300">
                      {selectedCustomer.latestShippingAddress.address}
                      {selectedCustomer.latestShippingAddress.city ? `, ${selectedCustomer.latestShippingAddress.city}` : ''}
                      {selectedCustomer.latestShippingAddress.postalCode ? ` - ${selectedCustomer.latestShippingAddress.postalCode}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {selectedCustomer.latestShippingAddress.state ? `${selectedCustomer.latestShippingAddress.state}, ` : ''}
                      {selectedCustomer.latestShippingAddress.country || 'India'}
                    </p>
                  </div>
                ) : (
                  <div className={`p-8 rounded-xl border text-center text-xs ${
                    isLight ? 'bg-slate-50/50 border-slate-100 text-slate-400' : 'bg-[#0B1512] border-[#162420] text-neutral-400'
                  }`}>
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold">No address registered</p>
                    <p className="text-[11px] mt-0.5 opacity-75">No shipping address recorded for this patron</p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: PAYMENTS */}
            {sidebarTab === 'payments' && (
              <div className="space-y-2.5">
                {realCustomerDetails?.orders && realCustomerDetails.orders.length > 0 ? (
                  Array.from(
                    new Set(
                      realCustomerDetails.orders
                        .map((o) => o.paymentMethod)
                        .filter(Boolean)
                    )
                  ).map((method) => {
                    const methodOrders = realCustomerDetails.orders.filter((o) => o.paymentMethod === method);
                    return (
                      <div
                        key={method}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#0B1512] border-[#162420]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <div>
                            <p className="font-semibold text-xs capitalize">{method}</p>
                            <p className="text-[10px] text-slate-400">
                              Used in {methodOrders.length} order{methodOrders.length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-emerald-600 font-bold text-xs">Active</span>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className={`p-8 rounded-xl border text-center text-xs ${
                      isLight ? 'bg-slate-50/50 border-slate-100 text-slate-400' : 'bg-[#0B1512] border-[#162420] text-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-semibold">No payment history</p>
                    <p className="text-[11px] mt-0.5 opacity-75">No transactions completed yet for this patron</p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Action Buttons (Send Message + Block Customer) */}
            <div className="pt-2 flex items-center gap-2">
              {selectedCustomer.email ? (
                <a
                  href={`mailto:${selectedCustomer.email}`}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    isLight
                      ? 'bg-[#111827] hover:bg-[#1f2937] text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
              ) : (
                <button
                  disabled
                  className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 opacity-50 cursor-not-allowed ${
                    isLight ? 'bg-slate-200 text-slate-500' : 'bg-neutral-800 text-neutral-500'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>No Email</span>
                </button>
              )}

              <button
                onClick={() => handleToggleBlock(selectedCustomer)}
                className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs border flex items-center justify-center gap-2 transition-all ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    : 'bg-transparent border-[#1E332B] text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <ShieldBan className={`w-3.5 h-3.5 ${selectedCustomer.status === 'Blocked' ? 'text-emerald-600' : 'text-red-500'}`} />
                <span>{selectedCustomer.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)}></div>

          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 border transition-all max-h-[90vh] flex flex-col my-auto overflow-hidden ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0E1715] border-[#1B2925] text-white'
          }`}>
            <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
              <div>
                <h3 className="font-bold text-base">Add New Customer</h3>
                <p className="text-xs text-slate-400">Enter customer details to register in portal</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 overflow-y-auto flex-1 space-y-3.5 text-xs">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {formError}
                  </div>
                )}

                <div>
                  <label className="block font-semibold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={newCustForm.name}
                    onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1E332B] bg-[#0B1512]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={newCustForm.phone}
                      onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${
                        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1E332B] bg-[#0B1512]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="customer@example.com"
                      value={newCustForm.email}
                      onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${
                        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1E332B] bg-[#0B1512]'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Street Address</label>
                  <input
                    type="text"
                    placeholder="Street, locality or apartment"
                    value={newCustForm.address}
                    onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${
                      isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1E332B] bg-[#0B1512]'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">City</label>
                    <input
                      type="text"
                      value={newCustForm.city}
                      onChange={(e) => setNewCustForm({ ...newCustForm, city: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${
                        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1E332B] bg-[#0B1512]'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">State</label>
                    <input
                      type="text"
                      value={newCustForm.state}
                      onChange={(e) => setNewCustForm({ ...newCustForm, state: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${
                        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1E332B] bg-[#0B1512]'
                      }`}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold mb-1">Postal Code</label>
                    <input
                      type="text"
                      value={newCustForm.postalCode}
                      onChange={(e) => setNewCustForm({ ...newCustForm, postalCode: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${
                        isLight ? 'border-slate-200 bg-slate-50/50' : 'border-[#1E332B] bg-[#0B1512]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className={`p-4 border-t flex items-center justify-end gap-2.5 flex-shrink-0 ${
                isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1E332B] bg-[#0A1411]'
              }`}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-semibold border text-slate-600 hover:bg-slate-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCustomerMutation.isPending}
                  className="px-4 py-2 rounded-xl font-bold bg-[#111827] text-white hover:bg-[#1f2937] shadow-sm disabled:opacity-50 text-xs"
                >
                  {createCustomerMutation.isPending ? 'Saving...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
