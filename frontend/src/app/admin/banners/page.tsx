'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit,
  Sparkles,
  X,
  ImageIcon,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
  LayoutGrid,
} from 'lucide-react';
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  Banner,
} from '@/hooks/useBanners';
import { toast } from '@/lib/toast';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import { useAdminTheme } from '@/context/AdminThemeContext';

export default function AdminBannersPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === 'light';

  const { data, isLoading } = useBanners();
  const banners = data?.banners || [];

  const createBannerMutation = useCreateBanner();
  const updateBannerMutation = useUpdateBanner();
  const deleteBannerMutation = useDeleteBanner();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle('');
    setLink('');
    setImage('');
    setIsActive(true);
    setOrder(0);
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setLink(banner.link || '');
    setImage(banner.image);
    setIsActive(banner.isActive);
    setOrder(banner.order || 0);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !image) {
      toast.error('Please provide a title and an image.');
      return;
    }

    const payload = {
      title,
      link,
      image,
      isActive,
      order: Number(order),
    };

    try {
      if (editingBanner) {
        await updateBannerMutation.mutateAsync({ id: editingBanner._id, bannerData: payload });
        toast.success('Banner updated successfully');
      } else {
        await createBannerMutation.mutateAsync(payload);
        toast.success('Banner created successfully');
      }
      closeModal();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBannerMutation.mutateAsync(id);
        toast.success('Banner deleted');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await updateBannerMutation.mutateAsync({
        id: banner._id,
        bannerData: { isActive: !banner.isActive },
      });
      toast.success(`Banner ${!banner.isActive ? 'activated' : 'deactivated'}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Toggle failed');
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 space-y-6 ${isLight ? 'bg-slate-50/50' : ''}`}>
      {/* Header Section */}
      <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${isLight ? 'bg-white border-slate-200/60 shadow-xs' : 'bg-[#030e0c]/40 border-emerald-900/30 backdrop-blur-xl'}`}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${isLight ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/50'}`}>
              <ImageIcon className="w-5 h-5" />
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isLight ? 'text-slate-900' : 'text-emerald-50'}`}>
              Store Banners
            </h1>
          </div>
          <p className={`text-sm ${isLight ? 'text-slate-500' : 'text-emerald-200/60'}`}>
            Manage homepage sliders and promotional banners.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className={`group flex items-center gap-2.5 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-all ${
            isLight
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg'
              : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(52,211,153,0.4)]'
          }`}
        >
          <Plus className="w-4 h-4 group-hover:scale-125 transition-transform" />
          Add Banner
        </button>
      </div>

      {/* Banners Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-64 rounded-3xl border animate-pulse ${isLight ? 'bg-white border-slate-100' : 'bg-[#051311] border-emerald-900/20'}`} />
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className={`text-center py-20 rounded-3xl border border-dashed ${isLight ? 'bg-white border-slate-300' : 'bg-[#051311] border-emerald-800/30'}`}>
          <ImageIcon className={`w-12 h-12 mx-auto mb-4 opacity-50 ${isLight ? 'text-slate-400' : 'text-emerald-500'}`} />
          <h3 className={`text-xl font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-emerald-50'}`}>No Banners Found</h3>
          <p className={`text-sm max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-emerald-200/60'}`}>
            You haven't created any promotional banners yet. Add one to display on the storefront.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className={`group relative flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 ${
                isLight
                  ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  : 'bg-[#051311] border-emerald-900/30 hover:border-emerald-700/50 shadow-lg'
              }`}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[21/9] bg-slate-100 overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-3 rounded-full bg-white/20 text-white hover:bg-emerald-500 hover:text-emerald-950 transition-colors backdrop-blur-md"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-3 rounded-full bg-white/20 text-white hover:bg-rose-500 hover:text-white transition-colors backdrop-blur-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Banner Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className={`font-bold text-lg leading-tight line-clamp-1 ${isLight ? 'text-slate-900' : 'text-emerald-50'}`}>
                      {banner.title}
                    </h3>
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`shrink-0 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                        banner.isActive
                          ? isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/50'
                          : isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-800/40 text-slate-400 border border-slate-700/50'
                      }`}
                    >
                      {banner.isActive ? (
                        <><CheckCircle className="w-3 h-3" /> Active</>
                      ) : (
                        <><XCircle className="w-3 h-3" /> Hidden</>
                      )}
                    </button>
                  </div>

                  {banner.link && (
                    <div className="flex items-center gap-1.5 text-xs text-sky-600 mb-3 font-medium">
                      <LinkIcon className="w-3 h-3" />
                      <span className="truncate">{banner.link}</span>
                    </div>
                  )}
                </div>

                <div className={`pt-4 mt-4 border-t flex items-center justify-between text-xs ${isLight ? 'border-slate-100 text-slate-500' : 'border-emerald-900/20 text-emerald-200/60'}`}>
                  <span className="flex items-center gap-1.5">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Order: {banner.order}
                  </span>
                  <span>Updated {new Date(banner.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${isLight ? 'bg-white' : 'bg-[#051311] border border-emerald-800/50'}`}>
            {/* Modal Header */}
            <div className={`sticky top-0 z-10 px-6 py-5 border-b flex items-center justify-between ${isLight ? 'bg-white border-slate-100' : 'bg-[#051311] border-emerald-900/30'}`}>
              <h3 className={`text-xl font-serif font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-emerald-50'}`}>
                <Sparkles className="w-5 h-5 text-emerald-500" />
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              <button
                onClick={closeModal}
                className={`p-2 rounded-full transition-colors ${isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-emerald-900/30 text-emerald-400'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              {/* Image Upload */}
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isLight ? 'text-slate-600' : 'text-emerald-400/80'}`}>
                  Banner Image <span className="text-rose-500">*</span>
                </label>
                <AdminImageUpload
                  value={image}
                  onChange={setImage}
                  label="Upload Banner (Recommend 21:9 ratio)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-emerald-400/80'}`}>
                    Banner Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                      isLight 
                        ? 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900' 
                        : 'bg-[#020b0a] border-emerald-900/40 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-50'
                    }`}
                    placeholder="e.g. Summer Oud Collection"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-emerald-400/80'}`}>
                    Target Link URL
                  </label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                      isLight 
                        ? 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900' 
                        : 'bg-[#020b0a] border-emerald-900/40 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-50'
                    }`}
                    placeholder="e.g. /shop?category=oud"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-600' : 'text-emerald-400/80'}`}>
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 transition-all ${
                      isLight 
                        ? 'bg-white border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 text-slate-900' 
                        : 'bg-[#020b0a] border-emerald-900/40 focus:border-emerald-500 focus:ring-emerald-500/20 text-emerald-50'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className={`text-sm font-semibold ${isLight ? 'text-slate-700' : 'text-emerald-50'}`}>
                    Active (Visible on frontend)
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className={`mt-8 pt-6 border-t flex justify-end gap-3 ${isLight ? 'border-slate-100' : 'border-emerald-900/30'}`}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-emerald-900/30 hover:bg-emerald-900/50 text-emerald-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBannerMutation.isPending || updateBannerMutation.isPending}
                  className={`px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${
                    isLight 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                      : 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {(createBannerMutation.isPending || updateBannerMutation.isPending) ? 'Saving...' : 'Save Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
