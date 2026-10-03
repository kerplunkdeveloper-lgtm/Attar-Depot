'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  Eye,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Layers,
  MousePointerClick,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sliders,
  LayoutGrid,
  List,
  Flame,
  Globe,
  Link2,
} from 'lucide-react';
import {
  useAdminBanners,
  useAdminCreateBanner,
  useAdminUpdateBanner,
  useAdminDeleteBanner,
  useAdminToggleBanner,
  AdminBannersParams,
} from '@/hooks/useBanners';
import { Banner } from '@/types';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import { toast } from '@/lib/toast';

const LINK_PRESETS = [
  { label: 'All Fragrances', value: '/shop' },
  { label: 'Dehn Al Oudh', value: '/shop?category=dehn-al-oudh' },
  { label: 'Pure Attar Oils', value: '/shop?category=attar' },
  { label: 'Discovery Sets', value: '/shop?category=discovery-sets' },
  { label: 'Bestsellers', value: '/shop?sort=bestselling' },
];

const PRESET_BANNERS = [
  {
    title: 'Heritage Flacons',
    url: '/images/banner1.png',
  },
  {
    title: 'Exclusive Distillations',
    url: '/images/bannerf1.png',
  },
  {
    title: 'Gift Celebration',
    url: '/images/giftbanner1.png',
  },
  {
    title: 'Bespoke Perfumery',
    url: '/images/shopbanner.png',
  },
];

export default function AdminBannersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortBy, setSortBy] = useState<'order' | 'clicks-high' | 'newest' | 'oldest' | 'title-asc'>('order');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    badge: '',
    image: '',
    link: '/shop',
    openInNewTab: false,
    order: 1,
    isActive: true,
  });

  // Query
  const queryParams: AdminBannersParams = {
    search: searchTerm,
    status: statusFilter,
    sort: sortBy,
  };

  const { data, isLoading, refetch } = useAdminBanners(queryParams);
  const banners = data?.banners || [];
  const stats = data?.stats || {
    totalBanners: 0,
    activeBanners: 0,
    inactiveBanners: 0,
    totalClicks: 0,
  };

  // Mutations
  const createMutation = useAdminCreateBanner();
  const updateMutation = useAdminUpdateBanner();
  const deleteMutation = useAdminDeleteBanner();
  const toggleMutation = useAdminToggleBanner();

  const handleOpenCreateModal = () => {
    setEditingBanner(null);
    const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.order || 0)) + 1 : 1;
    setFormData({
      title: '',
      subtitle: '',
      badge: '',
      image: '',
      link: '/shop',
      openInNewTab: false,
      order: nextOrder,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      image: banner.image,
      link: banner.link || '/shop',
      openInNewTab: banner.openInNewTab || false,
      order: banner.order || 1,
      isActive: banner.isActive,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Banner title is required', { title: 'Validation Error' });
      return;
    }

    if (!formData.image.trim()) {
      toast.error('Please upload or select a banner image', { title: 'Image Required' });
      return;
    }

    if (!formData.link.trim()) {
      toast.error('Destination link is required', { title: 'Link Required' });
      return;
    }

    try {
      if (editingBanner) {
        await updateMutation.mutateAsync({
          id: editingBanner._id,
          data: formData,
        });
        toast.success(`Banner '${formData.title}' updated successfully!`, { title: 'Banner Updated' });
      } else {
        await createMutation.mutateAsync(formData);
        toast.success(`Banner '${formData.title}' created and added to carousel!`, { title: 'Banner Created' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save banner', { title: 'Action Failed' });
    }
  };

  const handleToggleStatus = async (banner: Banner) => {
    try {
      await toggleMutation.mutateAsync(banner._id);
      toast.success(
        `Banner '${banner.title}' is now ${!banner.isActive ? 'Active on Homepage' : 'Hidden from Homepage'}`,
        { title: 'Status Changed' }
      );
    } catch (err: any) {
      toast.error('Failed to change banner status', { title: 'Error' });
    }
  };

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await deleteMutation.mutateAsync(bannerToDelete._id);
      toast.success(`Banner '${bannerToDelete.title}' has been deleted.`, { title: 'Banner Deleted' });
      setBannerToDelete(null);
    } catch (err: any) {
      toast.error('Failed to delete banner', { title: 'Error' });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#012520] to-[#046A5A] text-[#F5B418] shadow-md shadow-[#012520]/10">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-playfair text-slate-900 tracking-tight">
                Hero Banners & Carousel
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Manage promotional banners, direct destination links, sequence order, and homepage presence
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-sm font-medium transition-all shadow-sm"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>Preview Storefront</span>
          </Link>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#012520] via-[#034D40] to-[#046A5A] hover:from-[#02332B] hover:to-[#057F6D] text-white text-sm font-semibold shadow-md shadow-[#012520]/20 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border border-[#F5B418]/30"
          >
            <Plus className="w-4 h-4 text-[#F5B418]" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Banners */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Slides</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats.totalBanners}</p>
          </div>
        </div>

        {/* Active Banners */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold">Live on Homepage</p>
            <p className="text-2xl font-bold text-emerald-900 mt-0.5">{stats.activeBanners}</p>
          </div>
        </div>

        {/* Inactive Banners */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Hidden / Drafts</p>
            <p className="text-2xl font-bold text-amber-900 mt-0.5">{stats.inactiveBanners}</p>
          </div>
        </div>

        {/* Total Link Clicks */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
            <MousePointerClick className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-indigo-700 font-semibold">Total Clicks</p>
            <p className="text-2xl font-bold text-indigo-900 mt-0.5">{stats.totalClicks}</p>
          </div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, badge, or destination link..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filters & View Switches */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Pills */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            {(['all', 'active', 'inactive'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer font-medium"
            >
              <option value="order">Display Order (Asc)</option>
              <option value="clicks-high">Most Clicked</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
          <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-600">Loading banners from database...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 p-16 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-4 border border-amber-200">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No Banners Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'No banners matched your current filter criteria.'
              : 'You have not added any promotional hero banners yet. Add your first banner to dynamically power the homepage carousel!'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#012520] to-[#046A5A] text-white text-sm font-semibold shadow-md"
          >
            <Plus className="w-4 h-4 text-[#F5B418]" />
            <span>Create First Banner</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col ${
                banner.isActive
                  ? 'border-slate-200/90 hover:border-emerald-500/40 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 opacity-80'
              }`}
            >
              {/* Banner Visual Preview Container */}
              <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full bg-slate-900 overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top overlay badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                  {/* Order Priority */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-xs font-mono font-bold shadow-md">
                    <span className="text-[#F5B418]">#{banner.order}</span>
                    <span className="text-white/40">Priority</span>
                  </div>

                  {/* Active / Inactive Pill */}
                  <button
                    onClick={() => handleToggleStatus(banner)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md transition-all ${
                      banner.isActive
                        ? 'bg-emerald-600/90 text-white border border-emerald-400/30 hover:bg-emerald-700'
                        : 'bg-slate-800/90 text-slate-300 border border-slate-600 hover:bg-slate-700'
                    }`}
                    title="Click to toggle status"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? 'bg-emerald-300 animate-pulse' : 'bg-slate-400'}`}
                    />
                    <span>{banner.isActive ? 'Active' : 'Inactive'}</span>
                  </button>
                </div>

                {/* Bottom title & badge on preview */}
                <div className="absolute bottom-3 left-3 right-3 z-10">
                  {banner.badge && (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-[#F5B418] text-[#012520] text-[10px] font-bold tracking-wider uppercase mb-1 shadow-sm">
                      {banner.badge}
                    </span>
                  )}
                  <h3 className="text-white font-semibold text-sm line-clamp-1 drop-shadow-md">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-slate-200/80 text-xs line-clamp-1 drop-shadow-sm">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Meta & Controls */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3 bg-white">
                {/* Target URL Info */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                      Target Route
                    </span>
                    <span className="flex items-center gap-1 text-slate-600 font-mono">
                      <MousePointerClick className="w-3 h-3 text-indigo-500" />
                      {banner.clickCount || 0} Clicks
                    </span>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700">
                    <span className="truncate flex-1 font-mono">{banner.link}</span>
                    <a
                      href={banner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:text-emerald-700 transition-colors"
                      title="Test destination link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                        banner.isActive
                          ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {banner.isActive ? 'Hide' : 'Activate'}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(banner)}
                      className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                      title="Edit Banner"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setBannerToDelete(banner)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Banner Preview</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Title & Badge</th>
                  <th className="py-3 px-4">Target Destination</th>
                  <th className="py-3 px-4">Clicks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {banners.map((banner) => (
                  <tr key={banner._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Preview Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-28 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shadow-sm flex-shrink-0">
                        <Image
                          src={banner.image}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Order */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                        #{banner.order}
                      </span>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{banner.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {banner.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {banner.badge}
                          </span>
                        )}
                        {banner.subtitle && (
                          <span className="text-xs text-slate-500 truncate max-w-xs">
                            {banner.subtitle}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Link */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/60 max-w-xs">
                        <span className="truncate">{banner.link}</span>
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-emerald-700"
                        >
                          <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        </a>
                      </div>
                    </td>

                    {/* Clicks */}
                    <td className="py-3 px-4 font-mono text-xs text-slate-700">
                      <span className="inline-flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3 text-indigo-500" />
                        {banner.clickCount || 0}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(banner)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          banner.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${banner.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        />
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(banner)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setBannerToDelete(banner)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-playfair text-slate-900">
                    {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configure high-resolution image, target link URL, sequence, and badge
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* 1. Image Uploader */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Banner Artwork Image <span className="text-rose-500">*</span>
                </label>
                <AdminImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  label="Upload Banner Graphic (Recommended: 1920x800 or 1600x600 PNG/WEBP)"
                  folder="attar-depot/banners"
                />

                {/* Quick preset suggestion buttons */}
                <div>
                  <p className="text-[11px] text-slate-500 font-medium mb-1.5">
                    Or select from library presets:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_BANNERS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: preset.url,
                            title: prev.title || preset.title,
                          }))
                        }
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          formData.image === preset.url
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Banner Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Heritage Flacons"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Heritage Collection / 25% OFF"
                    value={formData.badge}
                    onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Subtitle / Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Experience Pure Artisanal Distillations & Rare Florals"
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>

              {/* 3. Destination Link URL & Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Target Destination URL <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="/shop or /shop?category=dehn-al-oudh or https://..."
                      value={formData.link}
                      onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Quick Link Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-medium">Quick link:</span>
                  {LINK_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, link: preset.value }))}
                      className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                        formData.link === preset.value
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Order & Active Switch & Target Window */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                {/* Sequence Order */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 1 }))
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Lower numbers appear first (#1 is slide 1)</p>
                </div>

                {/* Open In New Tab */}
                <div className="flex flex-col justify-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    New Window
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={formData.openInNewTab}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, openInNewTab: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium text-slate-700">Open link in new tab</span>
                  </label>
                </div>

                {/* Active Status Toggle */}
                <div className="flex flex-col justify-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Status
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                      className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-semibold text-emerald-800">
                      {formData.isActive ? 'Active on Storefront' : 'Hidden'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Live Preview Box */}
              {formData.image && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Live Carousel Preview
                  </label>
                  <div className="relative aspect-[21/9] sm:aspect-[16/7] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-md">
                    <Image
                      src={formData.image}
                      alt={formData.title || 'Preview'}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 text-[#F5B418] text-[11px] font-mono font-bold backdrop-blur-md">
                      Slide #{formData.order}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      {formData.badge && (
                        <span className="inline-block px-2 py-0.5 rounded bg-[#F5B418] text-[#012520] text-[10px] font-bold tracking-wider uppercase mb-1">
                          {formData.badge}
                        </span>
                      )}
                      <h4 className="font-bold text-sm drop-shadow">{formData.title || 'Banner Title'}</h4>
                      {formData.subtitle && (
                        <p className="text-xs text-slate-200 drop-shadow">{formData.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#012520] to-[#046A5A] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{editingBanner ? 'Save Changes' : 'Publish Banner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Hero Banner?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove banner <span className="font-semibold text-slate-800">'{bannerToDelete.title}'</span>? This action cannot be undone.
              </p>
            </div>

            <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-200">
              <Image
                src={bannerToDelete.image}
                alt={bannerToDelete.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
