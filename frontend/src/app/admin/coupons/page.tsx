'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  TicketPercent,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Clock,
  ArrowUpDown,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  BadgePercent,
  TrendingUp,
  AlertTriangle,
  X,
  Radio,
  Eye,
  Megaphone,
  Percent,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import {
  useAdminCoupons,
  useAdminCreateCoupon,
  useAdminUpdateCoupon,
  useAdminDeleteCoupon,
  useAdminToggleCouponStatus,
  useAdminSeedDefaultCoupons,
  AdminCouponsParams,
} from '@/hooks/useCoupons';
import { Coupon } from '@/types';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { toast } from '@/lib/toast';
import { formatPrice, formatDate } from '@/lib/utils';

export default function AdminCouponsPage() {
  const { theme } = useAdminTheme();
  const isLight = true; // High readability admin theme matching Attar Depot design

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minOrderValue: 999,
    maxDiscount: '',
    startDate: '',
    expiryDate: '',
    usageLimit: 0,
    isActive: true,
    showInBanner: false,
    bannerText: '',
  });

  // Query
  const queryParams: AdminCouponsParams = {
    search: searchTerm,
    status: statusFilter,
    sort: sortBy,
  };

  const { data, isLoading, refetch } = useAdminCoupons(queryParams);
  const coupons = data?.coupons || [];
  const stats = data?.stats || { totalCoupons: 0, activeCoupons: 0, totalUsages: 0 };

  // Mutations
  const createMutation = useAdminCreateCoupon();
  const updateMutation = useAdminUpdateCoupon();
  const deleteMutation = useAdminDeleteCoupon();
  const toggleMutation = useAdminToggleCouponStatus();
  const seedMutation = useAdminSeedDefaultCoupons();

  const handleCopyCode = (code: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.info(`Promo code '${code}' copied to clipboard!`, { title: 'Code Copied' });
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 999,
      maxDiscount: '',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      usageLimit: 0,
      isActive: true,
      showInBanner: false,
      bannerText: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderValue: coupon.minOrderValue || 0,
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : '',
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
      usageLimit: coupon.usageLimit || 0,
      isActive: coupon.isActive,
      showInBanner: coupon.showInBanner,
      bannerText: coupon.bannerText || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.title.trim()) {
      toast.error('Coupon code and title are required.', { title: 'Validation Error' });
      return;
    }

    const payload: Partial<Coupon> = {
      code: formData.code.trim().toUpperCase(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue) || 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      startDate: formData.startDate ? formData.startDate : undefined,
      expiryDate: formData.expiryDate ? formData.expiryDate : null,
      usageLimit: Number(formData.usageLimit) || 0,
      isActive: formData.isActive,
      showInBanner: formData.showInBanner,
      bannerText: formData.bannerText.trim(),
    };

    try {
      if (editingCoupon) {
        await updateMutation.mutateAsync({ id: editingCoupon._id, data: payload });
        toast.success(`Coupon '${payload.code}' updated successfully!`, { title: 'Coupon Saved' });
      } else {
        await createMutation.mutateAsync(payload);
        toast.success(`Coupon '${payload.code}' created successfully!`, { title: 'Coupon Created' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save coupon.', { title: 'Error' });
    }
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    try {
      await toggleMutation.mutateAsync(coupon._id);
      toast.success(
        `Coupon '${coupon.code}' is now ${!coupon.isActive ? 'Active' : 'Inactive'}!`,
        { title: 'Status Toggled' }
      );
    } catch (err: any) {
      toast.error('Failed to toggle status.', { title: 'Error' });
    }
  };

  const handleDeleteCoupon = async () => {
    if (!couponToDelete) return;
    try {
      await deleteMutation.mutateAsync(couponToDelete._id);
      toast.success(`Coupon '${couponToDelete.code}' deleted successfully.`, {
        title: 'Coupon Removed',
      });
      setCouponToDelete(null);
    } catch (err: any) {
      toast.error('Failed to delete coupon.', { title: 'Error' });
    }
  };

  const handleSeedDefaults = async () => {
    try {
      await seedMutation.mutateAsync();
      toast.success('Default promotional coupons seeded successfully!', { title: 'Seeded' });
    } catch (err: any) {
      toast.error('Failed to seed default coupons.', { title: 'Error' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-sans">
      {/* 1. Header Banner */}
      <div
        className="p-2 sm:p-3 rounded-3xl border flex flex-col lg:flex-row lg:items-center justify-between gap-4 backdrop-blur-xl shadow-lg transition-all bg-gradient-to-r from-[#EBF7F2] via-[#E4F4EC] to-[#DCF1E6] border-[#B2DFD0] text-[#022D24] shadow-emerald-950/5"
      >
        <div>

          <h1 className="font-serif text-xl sm:text-xl font-bold tracking-tight text-neutral-900">
            Coupons, Promo Codes & Offers
          </h1>

        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeedDefaults}
            disabled={seedMutation.isPending}
            className="px-4 py-2.5 rounded-xl border border-emerald-300 bg-white/80 hover:bg-white text-emerald-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all active:scale-95"
            title="Seed default offers (DKIT22, ROYAL15, FESTIVE25)"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${seedMutation.isPending ? 'animate-spin' : ''}`} />
            <span>Seed Default Offers</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="btn-emerald px-5 py-2.5 rounded-xl text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-emerald-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* 2. Stats KPI Row - Premium Luxury Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Total Coupons - Royal Emerald */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-xl shadow-emerald-800/20 ring-1 ring-white/20 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-emerald-200/50 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[11px] font-bold text-emerald-100">
              Total Coupons
            </span>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <TicketPercent className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {stats.totalCoupons}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
              Configured Promotions
            </span>
          </div>
        </div>

        {/* Active Offers - Sunlit Amber */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-xl shadow-amber-600/20 ring-1 ring-white/20 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-amber-200/50 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[11px] font-bold text-amber-100">
              Active Offers
            </span>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {stats.activeCoupons}
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Live forCustomers
            </span>
          </div>
        </div>

        {/* Total Redemptions - Imperial Indigo */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-violet-700 text-white shadow-xl shadow-indigo-700/20 ring-1 ring-white/20 relative overflow-hidden group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/70 via-purple-200/50 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-widest text-[11px] font-bold text-indigo-100">
              Total Redemptions
            </span>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-inner group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 drop-shadow-xs" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              {stats.totalUsages} <span className="text-sm font-semibold text-indigo-200">orders</span>
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
              Successfully applied
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-emerald-100/90 shadow-emerald-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-emerald-50/40 border border-emerald-200/80 rounded-xl text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-emerald-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(['all', 'active', 'expired', 'inactive'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all capitalize ${
                statusFilter === st
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xs'
                  : 'bg-emerald-50/60 text-neutral-600 hover:bg-emerald-100/60'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
          <span className="text-[11px] text-neutral-500 font-semibold uppercase">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-emerald-500 font-sans"
          >
            <option value="newest">Newest First</option>
            <option value="discount-high">Highest Discount</option>
            <option value="usage-high">Most Used</option>
            <option value="code-asc">Code (A-Z)</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* 4. Coupons Data Table */}
      <div className="rounded-3xl bg-white border border-emerald-100/90 shadow-emerald-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-neutral-500">Loading coupons and promotional vouchers...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center space-y-4 px-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
              <TicketPercent className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">No Coupons Found</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                No promotions match your current filter. Create a new coupon code or seed default offers.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleSeedDefaults}
                className="px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 uppercase tracking-wider"
              >
                Seed Default Offers
              </button>
              <button
                onClick={handleOpenCreateModal}
                className="btn-emerald px-4 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wider"
              >
                Create Coupon
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-emerald-100 text-neutral-600 font-bold uppercase tracking-wider text-[10.5px]">
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Discount Value</th>
                  <th className="py-3.5 px-4">Min. Spend</th>
                  <th className="py-3.5 px-4">Usage & Limits</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Banner Feature</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 font-sans">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                  return (
                    <tr
                      key={coupon._id}
                      className="hover:bg-emerald-50/30 transition-colors group"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-300 hover:bg-amber-400 text-emerald-950 font-mono font-extrabold tracking-wider text-xs border border-amber-400/90 transition-all active:scale-95 shadow-2xs cursor-pointer"
                            title="Click to copy promo code"
                          >
                            <span>{coupon.code}</span>
                            {copiedCode === coupon.code ? (
                              <Check className="w-3 h-3 text-emerald-900" />
                            ) : (
                              <Copy className="w-3 h-3 text-emerald-900/70 group-hover:text-emerald-950" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Title & Description */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-bold text-neutral-900 line-clamp-1">{coupon.title}</p>
                        {coupon.description && (
                          <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount Value */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200">
                          {coupon.discountType === 'percentage' ? (
                            <>
                              <Percent className="w-3 h-3" />
                              <span>{coupon.discountValue}% OFF</span>
                            </>
                          ) : (
                            <>
                              <span>₹{coupon.discountValue} OFF</span>
                            </>
                          )}
                        </span>
                        {coupon.discountType === 'percentage' && coupon.maxDiscount && (
                          <p className="text-[10px] text-neutral-500 mt-0.5">
                            Up to ₹{coupon.maxDiscount}
                          </p>
                        )}
                      </td>

                      {/* Min Spend */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-800">
                          {coupon.minOrderValue > 0 ? formatPrice(coupon.minOrderValue) : 'No Minimum'}
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-neutral-800">
                          {coupon.usageCount}
                        </span>
                        <span className="text-neutral-500 text-[11px]">
                          {coupon.usageLimit > 0 ? ` / ${coupon.usageLimit}` : ' (Unlimited)'}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="py-3.5 px-4">
                        {coupon.expiryDate ? (
                          <div className={isExpired ? 'text-rose-600 font-bold' : 'text-neutral-700'}>
                            <p>{new Date(coupon.expiryDate).toLocaleDateString('en-IN')}</p>
                            {isExpired && <span className="text-[10px] uppercase font-bold text-rose-500 block">Expired</span>}
                          </div>
                        ) : (
                          <span className="text-neutral-400">Never Expires</span>
                        )}
                      </td>

                      {/* Banner Featured */}
                      <td className="py-3.5 px-4">
                        {coupon.showInBanner ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <Megaphone className="w-3 h-3 text-[#F5B418]" />
                            Top Banner
                          </span>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Active Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(coupon)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            coupon.isActive ? 'bg-emerald-600' : 'bg-neutral-300'
                          }`}
                          title={`Toggle ${coupon.isActive ? 'Inactive' : 'Active'}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                              coupon.isActive ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(coupon)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Edit Coupon"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCouponToDelete(coupon)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Coupon"
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
        )}
      </div>

      {/* 5. CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-emerald-100 shadow-2xl overflow-hidden font-sans">
            <div className="px-6 py-4 border-b border-emerald-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/60 to-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <TicketPercent className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg font-bold text-neutral-900">
                  {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create New Promotional Coupon'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full text-neutral-400 hover:text-neutral-800 hover:bg-emerald-50 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Code */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ROYAL20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-emerald-500 uppercase tracking-wider"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Display Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Festive Discovery Gift"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Description / Terms
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Valid on all pure oudh and floral attars for orders above ₹999."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Discount Value * ({formData.discountType === 'percentage' ? '%' : '₹'})
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Min. Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0 = No Min"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Max Discount & Usage Limit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Leave empty for unlimited"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0 = Unlimited"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Start Date & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-white border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Banner Feature Switch & Custom Announcement Text */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-neutral-900">Show in Top Website Announcement</p>
                    <p className="text-[11px] text-neutral-500">
                      Features this offer in the top utility bar andCustomers login/register banners.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showInBanner}
                    onChange={(e) => setFormData({ ...formData, showInBanner: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>

                {formData.showInBanner && (
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Catchy Banner Announcement Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Use code DKIT22 for ₹200 OFF on orders above ₹999! 🎁"
                      value={formData.bannerText}
                      onChange={(e) => setFormData({ ...formData, bannerText: e.target.value })}
                      className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Active Status</p>
                  <p className="text-[11px] text-neutral-500">Enable or disable coupon redemption immediately</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-200 text-xs font-bold text-neutral-600 hover:bg-neutral-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="btn-emerald px-6 py-2.5 rounded-xl text-xs font-bold text-white uppercase tracking-wider shadow-emerald-sm"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingCoupon
                    ? 'Save Changes'
                    : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {couponToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 border border-emerald-100 shadow-2xl font-sans">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">Delete Coupon?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to permanently delete code{' '}
                <strong className="text-neutral-800 font-mono font-bold">
                  {couponToDelete.code}
                </strong>
                ?Customers will no longer be able to apply this discount.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setCouponToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
                disabled={deleteMutation.isPending}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 uppercase tracking-wider shadow-sm"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
