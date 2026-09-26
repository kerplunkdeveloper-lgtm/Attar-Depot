'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Users,
  ShoppingBag,
  Star,
  Search,
  MapPin,
  Eye,
  MoreVertical,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Edit,
  Trash2,
  ShieldBan,
  Phone,
  Mail,
  MessageCircle,
  Package,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowUp,
} from 'lucide-react';
import {
  useAdminCustomers,
  useAdminCustomerDetails,
  useAdminCreateCustomer,
  useAdminUpdateCustomer,
  useAdminDeleteCustomer,
  useAdminUpdateCustomerStatus,
} from '@/hooks/useAdmin';
import { formatPrice } from '@/lib/utils';
import { Customer } from '@/types';
import { toast } from '@/lib/toast';

const AVATAR_PALETTES = [
  'bg-emerald-100 text-emerald-800 border-emerald-300',
  'bg-blue-100 text-blue-800 border-blue-300',
  'bg-purple-100 text-purple-800 border-purple-300',
  'bg-amber-100 text-amber-800 border-amber-300',
  'bg-rose-100 text-rose-800 border-rose-300',
  'bg-teal-100 text-teal-800 border-teal-300',
  'bg-sky-100 text-sky-800 border-sky-300',
];

const getInitials = (name: string) => {
  const parts = (name || '').trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (name || '').slice(0, 2).toUpperCase();
};

const formatJoinedDate = (dateStr: string) => {
  if (!dateStr) return 'Recently';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatLastOrder = (dateStr?: string | null) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleDateString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  return { date: `${day} ${month} ${year}`, time };
};

const getCustomerLocation = (cust: Customer) => {
  const addr = cust.latestShippingAddress || (cust.addresses && cust.addresses[0]);
  if (!addr) return 'Not set';
  const city = (addr as any).city;
  const state = (addr as any).state;
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return 'India';
};

export default function AdminCustomersPage() {
  // API Data
  const { data, isLoading } = useAdminCustomers();
  const createCustomerMutation = useAdminCreateCustomer();
  const updateCustomerMutation = useAdminUpdateCustomer();
  const deleteCustomerMutation = useAdminDeleteCustomer();
  const updateStatusMutation = useAdminUpdateCustomerStatus();

  // Pure real database customers
  const allCustomers: Customer[] = useMemo(() => {
    return data?.customers || [];
  }, [data]);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'VIP' | 'Inactive' | 'Blocked'>('All');
  const [locationFilter, setLocationFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'spent' | 'orders' | 'name'>('newest');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'overview' | 'orders' | 'addresses' | 'payments'>('overview');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Edit Customer Modal State
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    status: 'Active' as 'Active' | 'Inactive' | 'Blocked',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [editError, setEditError] = useState('');

  // Delete Customer Confirmation Modal State
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // Exactly matches reference layout

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

  // Selected customer object for preview drawer/modal (Fix: null when selectedCustomerId is null!)
  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) return null;
    return allCustomers.find((c) => c._id === selectedCustomerId) || null;
  }, [allCustomers, selectedCustomerId]);

  // Hook for detailed customer orders from database
  const { data: customerDetailsData, isLoading: isCustomerDetailsLoading } = useAdminCustomerDetails(
    selectedCustomerId || ''
  );
  const realCustomerDetails = customerDetailsData?.customer;

  // ESC key to close preview drawer & dropdowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCustomerId(null);
        setActiveMenuId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenuId && !(e.target as HTMLElement).closest('.action-menu-container')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  // Distinct locations for filter dropdown
  const distinctLocations = useMemo(() => {
    const locSet = new Set<string>();
    allCustomers.forEach((c) => {
      const loc = getCustomerLocation(c);
      if (loc && loc !== 'Not set') {
        locSet.add(loc);
      }
    });
    return Array.from(locSet).sort();
  }, [allCustomers]);

  // Computed summary metrics from real database data
  const summary = useMemo(() => {
    const total = allCustomers.length;
    const active = allCustomers.filter((c) => c.status === 'Active').length;
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newCusts = allCustomers.filter((c) => new Date(c.createdAt) >= oneMonthAgo).length;
    const totalSpent = allCustomers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);
    const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

    return {
      total,
      active,
      newCusts,
      totalSpent,
      activePercent,
    };
  }, [allCustomers]);

  // Filtered and Sorted Customers
  const filteredCustomers = useMemo(() => {
    return allCustomers
      .filter((c) => {
        // Search Filter
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          (c.name || '').toLowerCase().includes(term) ||
          (c.email || '').toLowerCase().includes(term) ||
          (c.phone || '').includes(term) ||
          (c._id || '').toLowerCase().includes(term);

        if (!matchesSearch) return false;

        // Status Filter
        if (statusFilter === 'Active') return c.status === 'Active';
        if (statusFilter === 'Inactive') return c.status === 'Inactive';
        if (statusFilter === 'Blocked') return c.status === 'Blocked';
        if (statusFilter === 'VIP') return (c.ordersCount || 0) >= 5 || (c.totalSpent || 0) >= 5000;

        // Location Filter
        if (locationFilter !== 'All') {
          const loc = getCustomerLocation(c);
          if (loc !== locationFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sortBy === 'spent') return (b.totalSpent || 0) - (a.totalSpent || 0);
        if (sortBy === 'orders') return (b.ordersCount || 0) - (a.ordersCount || 0);
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [allCustomers, searchTerm, statusFilter, locationFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, currentPage, pageSize]);

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedCustomers.length && paginatedCustomers.length > 0) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedCustomers.map((c) => c._id)));
    }
  };

  const handleSelectRow = (id: string) => {
    const next = new Set(selectedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedRows(next);
  };

  // Status toggle handler
  const handleToggleBlock = async (cust: Customer) => {
    try {
      const nextStatus = cust.status === 'Blocked' ? 'Active' : 'Blocked';
      await updateStatusMutation.mutateAsync({ id: cust._id, status: nextStatus });
      toast.success(
        nextStatus === 'Blocked'
          ? `Customer ${cust.name} has been blocked.`
          : `Customer ${cust.name} has been unblocked.`
      );
      setActiveMenuId(null);
    } catch {
      toast.error('Failed to update customer status');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (cust: Customer) => {
    const addr = cust.latestShippingAddress || (cust.addresses && cust.addresses[0]);
    setEditingCustomer(cust);
    setEditForm({
      name: cust.name || '',
      title: cust.title || '',
      email: cust.email || '',
      phone: cust.phone || '',
      status: (cust.status as any) || 'Active',
      address: (addr as any)?.street || (addr as any)?.address || '',
      city: (addr as any)?.city || '',
      state: (addr as any)?.state || '',
      postalCode: (addr as any)?.postalCode || '',
      country: (addr as any)?.country || 'India',
    });
    setEditError('');
    setActiveMenuId(null);
  };

  // Submit Edit Customer
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    setEditError('');

    if (!editForm.name.trim()) {
      setEditError('Customer name is required');
      return;
    }

    try {
      await updateCustomerMutation.mutateAsync({
        id: editingCustomer._id,
        data: editForm,
      });
      toast.success('Customer details updated successfully!');
      setEditingCustomer(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update customer';
      setEditError(msg);
      toast.error(msg);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDelete = (cust: Customer) => {
    setDeletingCustomer(cust);
    setActiveMenuId(null);
  };

  // Submit Delete Customer
  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    try {
      await deleteCustomerMutation.mutateAsync(deletingCustomer._id);
      toast.success(`Customer "${deletingCustomer.name}" has been deleted.`);
      if (selectedCustomerId === deletingCustomer._id) {
        setSelectedCustomerId(null);
      }
      setDeletingCustomer(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete customer';
      toast.error(msg);
    }
  };

  // Submit Add New Customer
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newCustForm.name.trim()) {
      setFormError('Name is required');
      return;
    }
    if (!newCustForm.email.trim() && !newCustForm.phone.trim()) {
      setFormError('Provide at least an email or phone number');
      return;
    }

    try {
      await createCustomerMutation.mutateAsync(newCustForm);
      toast.success('Customer registered successfully!');
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
      const msg = err.response?.data?.message || 'Failed to create customer';
      setFormError(msg);
      toast.error(msg);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredCustomers.length === 0) {
      toast.error('No customer records to export');
      return;
    }

    const headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Location', 'Orders', 'Total Spent', 'Status', 'Joined Date'];
    const rows = filteredCustomers.map((c) => [
      c._id,
      `"${(c.name || '').replace(/"/g, '""')}"`,
      `"${(c.email || '').replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${getCustomerLocation(c).replace(/"/g, '""')}"`,
      c.ordersCount || 0,
      c.totalSpent || 0,
      c.status || 'Active',
      formatJoinedDate(c.createdAt),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Customer directory exported successfully!');
  };

  const avgOrderValue = useMemo(() => {
    if (!selectedCustomer || !selectedCustomer.ordersCount || selectedCustomer.ordersCount === 0) return 0;
    return Math.round((selectedCustomer.totalSpent || 0) / selectedCustomer.ordersCount);
  }, [selectedCustomer]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto text-slate-800 antialiased">
      {/* ─── 1. TOP HEADER & BREADCRUMBS ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Customers
          </h1>
         
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="text-xs text-slate-400 sm:text-right hidden sm:block">
            <span>Dashboard</span> &gt; <span className="text-slate-700 font-medium">Customers</span>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#044e43] hover:bg-[#033c34] text-slate-50 text-sm font-semibold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* ─── 2. FOUR STAT CARDS (Premium Luxury Gradients) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Customers - Royal Emerald */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-xl shadow-emerald-800/20 ring-1 ring-white/20 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-emerald-200/50 to-transparent" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Total Customers</p>
            <p className="text-2xl sm:text-3xl font-bold text-white font-poppins mt-0.5 drop-shadow-sm">
              {summary.total.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-white inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xs">
              <ArrowUp className="w-3 h-3 text-emerald-200" />
              <span>+12% this month</span>
            </p>
          </div>
        </div>

        {/* Card 2: New Customers - Imperial Blue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-700 text-white shadow-xl shadow-blue-800/20 ring-1 ring-white/20 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-blue-200/50 to-transparent" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-100">New Customers</p>
            <p className="text-2xl sm:text-3xl font-bold text-white font-poppins mt-0.5 drop-shadow-sm">
              {summary.newCusts.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-white inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xs">
              <ArrowUp className="w-3 h-3 text-blue-200" />
              <span>+18% this month</span>
            </p>
          </div>
        </div>

        {/* Card 3: Total Spent - Sunlit Amber */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-xl shadow-amber-600/20 ring-1 ring-white/20 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-amber-200/50 to-transparent" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            ₹
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-100">Total Spent</p>
            <p className="text-2xl sm:text-3xl font-bold text-white font-poppins mt-0.5 drop-shadow-sm">
              {formatPrice(summary.totalSpent)}
            </p>
            <p className="text-[11px] font-bold text-white inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xs">
              <ArrowUp className="w-3 h-3 text-amber-200" />
              <span>+22% this month</span>
            </p>
          </div>
        </div>

        {/* Card 4: Active Customers - Radiant Rose */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 text-white shadow-xl shadow-rose-600/20 ring-1 ring-white/20 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex items-center gap-4">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-rose-200/50 to-transparent" />
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <Star className="w-6 h-6 fill-white/90" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-100">Active Customers</p>
            <p className="text-2xl sm:text-3xl font-bold text-white font-poppins mt-0.5 drop-shadow-sm">
              {summary.active.toLocaleString()}
            </p>
            <p className="text-[11px] font-bold text-white inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xs">
              <span>{summary.activePercent}% of total</span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3. FILTER AND SEARCH BAR (EXACT REFERENCE UI) ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-xs"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="All">All Customers</option>
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Locations Dropdown */}
          <div className="relative">
            <select
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer max-w-[160px] truncate"
            >
              <option value="All">All Locations</option>
              {distinctLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-emerald-600 shadow-xs cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="spent">Sort by: Highest Spent</option>
              <option value="orders">Sort by: Most Orders</option>
              <option value="name">Sort by: Name (A-Z)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ─── 4. CUSTOMERS TABLE CONTAINER ─── */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading customer telemetry...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No customers found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== 'All' || locationFilter !== 'All'
                ? 'Try adjusting your search criteria or clear active filters.'
                : 'No customers have registered yet. Click "Add Customer" to create one.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead >
                  <tr className="border-b border-slate-200  text-[11px] uppercase tracking-wider font-semibold ">
                    <th className="py-3.5 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={
                          paginatedCustomers.length > 0 &&
                          selectedRows.size === paginatedCustomers.length
                        }
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-slate-50 focus:ring-slate-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Orders</th>
                    <th className="py-3.5 px-4">Total Spent</th>
                    <th className="py-3.5 px-4">Last Order</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {paginatedCustomers.map((cust, idx) => {
                    const isSelected = selectedRows.has(cust._id);
                    const location = getCustomerLocation(cust);
                    const lastOrder = formatLastOrder(cust.lastOrderDate);
                    const isVip = (cust.ordersCount || 0) >= 5 || (cust.totalSpent || 0) >= 5000;
                    const paletteClass = AVATAR_PALETTES[idx % AVATAR_PALETTES.length];
                    return (
                      <tr
                        key={cust._id}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          isSelected ? 'bg-emerald-50/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(cust._id)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                        </td>

                        {/* Customer Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar image / initials with strictly fixed round frame */}
                            <div className="w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full overflow-hidden shrink-0 border border-slate-200 bg-slate-100 flex items-center justify-center font-bold text-xs shadow-xs">
                              {cust.avatar && !cust.avatar.includes('unsplash') ? (
                                <img
                                  src={cust.avatar}
                                  alt={cust.name}
                                  className="w-full h-full object-cover shrink-0"
                                />
                              ) : (
                                <span className={`w-full h-full flex items-center justify-center font-bold ${paletteClass}`}>
                                  {getInitials(cust.name)}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <button
                                onClick={() => setSelectedCustomerId(cust._id)}
                                className="font-semibold text-slate-900 hover:text-emerald-700 text-sm text-left truncate block cursor-pointer transition-colors"
                              >
                                {cust.name}
                              </button>
                              <span className="text-xs text-slate-400 block mt-0.5">
                                Joined {formatJoinedDate(cust.createdAt)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Contact Column */}
                        <td className="py-3.5 px-4">
                          <div className="text-xs">
                            <span className="text-slate-800 font-medium block truncate max-w-[200px]">
                              {cust.email || 'No email provided'}
                            </span>
                            <span className="text-slate-500 block mt-0.5">
                              {cust.phone || 'No phone provided'}
                            </span>
                          </div>
                        </td>

                        {/* Location Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[150px]">{location}</span>
                          </div>
                        </td>

                        {/* Orders Column */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-semibold text-slate-800">
                            {cust.ordersCount || 0}
                          </span>
                        </td>

                        {/* Total Spent Column */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs font-bold text-slate-900 font-poppins">
                            {formatPrice(cust.totalSpent || 0)}
                          </span>
                        </td>

                        {/* Last Order Column */}
                        <td className="py-3.5 px-4">
                          {lastOrder ? (
                            <div className="text-xs">
                              <span className="text-slate-800 font-medium block">
                                {lastOrder.date}
                              </span>
                              <span className="text-slate-400 text-[11px] block mt-0.5">
                                {lastOrder.time}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No orders yet</span>
                          )}
                        </td>

                        {/* Status Column */}
                        <td className="py-3.5 px-4">
                          {isVip ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              VIP
                            </span>
                          ) : cust.status === 'Blocked' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Blocked
                            </span>
                          ) : cust.status === 'Inactive' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Inactive
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          )}
                        </td>

                        {/* Actions Column (Direct, clean inline actions inside the table - No clipping issues!) */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* View Customer Details */}
                            <button
                              type="button"
                              onClick={() => setSelectedCustomerId(cust._id)}
                              className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-xs transition-all cursor-pointer"
                              title="View Customer Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit Customer */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(cust)}
                              className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-xs transition-all cursor-pointer"
                              title="Edit Customer"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Block / Unblock Customer */}
                            <button
                              type="button"
                              onClick={() => handleToggleBlock(cust)}
                              className={`p-1.5 rounded-xl border shadow-xs transition-all cursor-pointer ${
                                cust.status === 'Blocked'
                                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'border-slate-200 bg-white text-slate-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-300'
                              }`}
                              title={cust.status === 'Blocked' ? 'Unblock Customer' : 'Block Customer'}
                            >
                              <ShieldBan className="w-4 h-4" />
                            </button>

                            {/* Delete Customer */}
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(cust)}
                              className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300 shadow-xs transition-all cursor-pointer"
                              title="Delete Customer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Exact Match with Reference Image) */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing{' '}
                <strong className="text-slate-800">
                  {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                </strong>{' '}
                -{' '}
                <strong className="text-slate-800">
                  {Math.min(currentPage * pageSize, filteredCustomers.length)}
                </strong>{' '}
                of <strong className="text-slate-800">{filteredCustomers.length}</strong> customers
              </div>

              {/* Numbered Pagination Buttons */}
              <div className="flex items-center gap-1.5 self-center sm:self-auto">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer text-slate-700"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Display page numbers cleanly
                  if (
                    totalPages <= 7 ||
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    Math.abs(pageNum - currentPage) <= 1
                  ) {
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          isActive
                            ? 'bg-[#044e43] text-white shadow-xs'
                            : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === 2 && currentPage > 3) {
                    return (
                      <span key="dots-start" className="px-1 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                    return (
                      <span key="dots-end" className="px-1 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 cursor-pointer text-slate-700"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── 5. CUSTOMER DETAILS PREVIEW DRAWER (OPENS ON VIEW CLICK, CLOSES PROPERLY) ─── */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          {/* Backdrop Click to Close */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setSelectedCustomerId(null)}
            title="Click outside to close preview"
          />

          {/* Slide-in Drawer Container */}
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl z-10 flex flex-col overflow-hidden border-l border-slate-200 animate-in slide-in-from-right duration-300">
            {/* Header: Customer Info + Action Buttons + Close Button */}
            <div className="p-5 border-b border-slate-200/80 bg-slate-50/90 flex items-start justify-between gap-3 flex-shrink-0">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl overflow-hidden flex items-center justify-center font-extrabold text-sm shrink-0 border border-slate-200 bg-slate-100 text-slate-800 shadow-sm">
                  {selectedCustomer.avatar && !selectedCustomer.avatar.includes('unsplash') ? (
                    <img
                      src={selectedCustomer.avatar}
                      alt={selectedCustomer.name}
                      className="w-full h-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center text-base font-black">
                      {getInitials(selectedCustomer.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-base text-slate-900 truncate">
                      {selectedCustomer.name}
                    </h2>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        selectedCustomer.status === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : selectedCustomer.status === 'Inactive'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {selectedCustomer.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Customer since {formatJoinedDate(selectedCustomer.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons in Header: Edit, Delete, and Close */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(selectedCustomer)}
                  className="p-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer"
                  title="Edit customer"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenDelete(selectedCustomer)}
                  className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-all shadow-xs cursor-pointer"
                  title="Delete customer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {/* PROMINENT CLOSE BUTTON */}
                <button
                  type="button"
                  onClick={() => setSelectedCustomerId(null)}
                  className="p-2 rounded-xl border border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
                  title="Close preview"
                  aria-label="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
              {/* Quick Contact Bar */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs font-semibold text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {selectedCustomer.phone || 'No phone provided'}
                  </span>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${selectedCustomer.phone}`}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-[11px] font-bold inline-flex items-center gap-1 shadow-xs"
                      >
                        <Phone className="w-3 h-3 text-blue-600" />
                        <span>Call</span>
                      </a>
                      <a
                        href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg border border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-xs"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>

                {selectedCustomer.email && (
                  <div className="flex items-center gap-2 text-slate-600 pt-1 border-t border-slate-200/60">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a href={`mailto:${selectedCustomer.email}`} className="hover:underline truncate font-medium">
                      {selectedCustomer.email}
                    </a>
                  </div>
                )}
              </div>

              {/* 3 Metric Boxes */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                  <p className="text-lg font-extrabold text-slate-900">{selectedCustomer.ordersCount || 0}</p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Total Orders</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                  <p className="text-lg font-poppins font-extrabold text-emerald-700">
                    {formatPrice(selectedCustomer.totalSpent || 0)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Total Purchase</p>
                </div>
                <div className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                  <p className="text-lg font-poppins font-extrabold text-slate-900">
                    {formatPrice(avgOrderValue)}
                  </p>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Avg Order Value</p>
                </div>
              </div>

              {/* Navigation Tabs inside Drawer */}
              <div className="flex items-center border-b border-slate-200 text-xs font-bold">
                {(['overview', 'orders', 'addresses', 'payments'] as const).map((tab) => {
                  const isActive = sidebarTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setSidebarTab(tab)}
                      className={`pb-2.5 px-3 capitalize transition-all relative cursor-pointer ${
                        isActive
                          ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-600 -mb-[1px]'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Overview */}
              {sidebarTab === 'overview' && (
                <div className="space-y-4">
                  {/* Latest Shipping Address */}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
                      Primary Delivery Address
                    </h3>
                    {selectedCustomer.latestShippingAddress || (selectedCustomer.addresses && selectedCustomer.addresses.length > 0) ? (
                      (() => {
                        const a = selectedCustomer.latestShippingAddress || selectedCustomer.addresses![0];
                        const street = (a as any).address || (a as any).street || '';
                        return (
                          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1 text-slate-700">
                            <p className="font-bold text-slate-900">{selectedCustomer.name}</p>
                            {street && <p>{street}</p>}
                            <p>
                              {a.city ? `${a.city}, ` : ''}{a.state ? `${a.state} ` : ''}{a.postalCode || ''}
                            </p>
                            <p className="text-slate-500">{a.country || 'India'}</p>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                        No address registered yet
                      </div>
                    )}
                  </div>

                  {/* Account Metadata */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer ID:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedCustomer._id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Type:</span>
                      <span className="font-bold text-slate-800">DirectCustomers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Status:</span>
                      <span className="font-bold text-emerald-700">{selectedCustomer.status || 'Active'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders History */}
              {sidebarTab === 'orders' && (
                <div className="space-y-3">
                  {isCustomerDetailsLoading ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <span>Loading customer order history...</span>
                    </div>
                  ) : !realCustomerDetails?.orders || realCustomerDetails.orders.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                      No order consignments logged for this customer.
                    </div>
                  ) : (
                    realCustomerDetails.orders.map((ord: any) => (
                      <div
                        key={ord._id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">#{ord.orderNumber}</span>
                          <span
                            className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                              ord.orderStatus === 'Delivered'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : ord.orderStatus === 'Shipped'
                                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 text-[11px]">
                          <span>{formatJoinedDate(ord.createdAt)}</span>
                          <span className="font-poppins font-bold text-emerald-700">
                            {formatPrice(ord.totalPrice)}
                          </span>
                        </div>
                        <div className="text-right pt-1">
                          <Link
                            href="/admin/orders"
                            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                          >
                            Inspect in Orders &rarr;
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tab 3: Addresses */}
              {sidebarTab === 'addresses' && (
                <div className="space-y-3">
                  {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 ? (
                    selectedCustomer.addresses.map((addr, i) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1 text-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">Address {i + 1}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                              Default
                            </span>
                          )}
                        </div>
                        <p>{addr.street || (addr as any).address || ''}</p>
                        <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p className="text-slate-500">{addr.country || 'India'}</p>
                      </div>
                    ))
                  ) : selectedCustomer.latestShippingAddress ? (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1 text-slate-700">
                      <span className="font-bold text-slate-900">Latest Shipping Address</span>
                      <p>{selectedCustomer.latestShippingAddress.address}</p>
                      <p>{selectedCustomer.latestShippingAddress.city}, {selectedCustomer.latestShippingAddress.state} {selectedCustomer.latestShippingAddress.postalCode}</p>
                      <p className="text-slate-500">{selectedCustomer.latestShippingAddress.country || 'India'}</p>
                    </div>
                  ) : (
                    <div className="p-8 rounded-xl border border-dashed border-slate-200 text-center text-slate-400">
                      No saved addresses.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Payments */}
              {sidebarTab === 'payments' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900">Payment Modes</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Total transactions value: <strong className="text-emerald-700 font-poppins">{formatPrice(selectedCustomer.totalSpent || 0)}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports Prepaid Online (UPI, Cards, NetBanking) and Cash on Delivery.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedCustomer)}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-bold border border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleToggleBlock(selectedCustomer)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedCustomer.status === 'Blocked'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white'
                    : 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-600 hover:text-white'
                }`}
              >
                <ShieldBan className="w-3.5 h-3.5" />
                <span>{selectedCustomer.status === 'Blocked' ? 'Unblock' : 'Block'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCustomerId(null)}
                className="py-2 px-4 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 6. EDIT CUSTOMER MODAL ─── */}
      {editingCustomer && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setEditingCustomer(null)} />

          <div className="relative w-full max-w-lg rounded-3xl shadow-2xl z-10 border border-slate-200 bg-white text-slate-800 flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Edit Customer</h3>
                  <p className="text-xs text-slate-500">Update contact dossier and status</p>
                </div>
              </div>
              <button
                onClick={() => setEditingCustomer(null)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              {editError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Honorific / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr., Mr., Sheikh"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none cursor-pointer"
                  >
                    <option value="Active">Active (Permitted)</option>
                    <option value="Inactive">Inactive (Dormant)</option>
                    <option value="Blocked">Blocked (Suspended)</option>
                  </select>
                </div>
              </div>

              {/* Address Fields */}
              <div className="pt-2 border-t border-slate-200">
                <p className="font-bold text-xs text-slate-800 mb-2">Shipping Address</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="Door no, Street name"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={editForm.city}
                      onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={editForm.state}
                      onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={editForm.postalCode}
                      onChange={(e) => setEditForm({ ...editForm, postalCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="px-4 py-2 rounded-xl font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateCustomerMutation.isPending}
                  className="px-5 py-2 rounded-xl font-bold bg-[#044e43] hover:bg-[#033c34] text-white shadow-sm transition-all disabled:opacity-50 text-xs cursor-pointer flex items-center gap-2"
                >
                  {updateCustomerMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── 7. DELETE CUSTOMER CONFIRMATION MODAL ─── */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setDeletingCustomer(null)} />

          <div className="relative w-full max-w-md rounded-3xl shadow-2xl z-10 border border-slate-200 bg-white text-slate-800 p-6 flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Delete Customer?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs text-rose-900 space-y-1">
              <p>
                Are you sure you want to delete <strong className="underline">{deletingCustomer.name}</strong>?
              </p>
              <p className="text-[11px] text-rose-700">
                Their account profile and direct references will be removed from the system.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="px-4 py-2 rounded-xl font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteCustomerMutation.isPending}
                className="px-5 py-2 rounded-xl font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-all disabled:opacity-50 text-xs cursor-pointer flex items-center gap-2"
              >
                {deleteCustomerMutation.isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Yes, Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 8. ADD NEW CUSTOMER MODAL ─── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-lg rounded-3xl shadow-2xl z-10 border border-slate-200 bg-white text-slate-800 flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Add New Customer</h3>
                  <p className="text-xs text-slate-500">Register a new client directly</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleCreateCustomer} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newCustForm.name}
                    onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="customer@example.com"
                    value={newCustForm.email}
                    onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={newCustForm.phone}
                    onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                  />
                </div>
              </div>

              {/* Address Fields */}
              <div className="pt-2 border-t border-slate-200">
                <p className="font-bold text-xs text-slate-800 mb-2">Delivery Address (Optional)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="Door no, Street name"
                      value={newCustForm.address}
                      onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={newCustForm.city}
                      onChange={(e) => setNewCustForm({ ...newCustForm, city: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={newCustForm.state}
                      onChange={(e) => setNewCustForm({ ...newCustForm, state: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newCustForm.postalCode}
                      onChange={(e) => setNewCustForm({ ...newCustForm, postalCode: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCustomerMutation.isPending}
                  className="px-5 py-2 rounded-xl font-bold bg-[#044e43] hover:bg-[#033c34] text-slate-50 shadow-sm transition-all disabled:opacity-50 text-xs cursor-pointer flex items-center gap-2"
                >
                  {createCustomerMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Add Customer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
