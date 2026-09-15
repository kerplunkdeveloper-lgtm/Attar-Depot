'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit,
  Sparkles,
  X,
  Layers,
  CheckCircle2,
  FolderOpen,
  Search,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import {
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
} from '@/hooks/useAdmin';
import { Category } from '@/types';
import { toast } from '@/lib/toast';
import AdminImageUpload from '@/components/admin/AdminImageUpload';

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories = [], isLoading } = useCategories();
  const createCategoryMutation = useAdminCreateCategory();
  const updateCategoryMutation = useAdminUpdateCategory();
  const deleteCategoryMutation = useAdminDeleteCategory();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    featured: true,
  });

  const handleOpenCreateModal = () => {
    setEditingCategoryId(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategoryId(cat._id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      featured: !!cat.featured,
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage('Please specify the category title.');
      return;
    }
    if (!formData.image.trim()) {
      setStatusMessage('Please upload an image for the category.');
      toast.error('Please upload an image for the category.', { title: 'Image Required' });
      return;
    }

    try {
      if (editingCategoryId) {
        await updateCategoryMutation.mutateAsync({
          id: editingCategoryId,
          data: formData,
        });
        const msg = `Category "${formData.name}" updated successfully.`;
        setStatusMessage(msg);
        toast.success(msg, { title: 'Category Updated' });
      } else {
        await createCategoryMutation.mutateAsync(formData);
        const msg = `Dynamic category "${formData.name}" published!`;
        setStatusMessage(msg);
        toast.success(msg, { title: 'Category Published' });
      }

      setIsModalOpen(false);
      setEditingCategoryId(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save category.';
      setStatusMessage(msg);
      toast.error(msg, { title: 'Operation Failed' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"? Existing flacons in this category will need reassignment.`)) {
      try {
        await deleteCategoryMutation.mutateAsync(id);
        const msg = `Category "${name}" removed.`;
        setStatusMessage(msg);
        toast.info(msg, { title: 'Category Deleted' });
      } catch (err: any) {
        setStatusMessage('Error deleting category.');
        toast.error('Error deleting category.', { title: 'Delete Failed' });
      }
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E332B] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
           
            <span className="text-[11px] text-neutral-400 font-medium">
              {categories.length} Active Collections
            </span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-white">
          All Categories
          </h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white hover:from-emerald-500 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-950/50 border border-emerald-400/30 active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Dynamic Category</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-[#0E1F1A] border border-emerald-500/40 text-emerald-300 text-xs flex justify-between items-center shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage('')} className="text-emerald-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter categories by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-[#0A1210] border border-[#1E332B] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-white placeholder-neutral-500 font-poppins shadow-inner"
        />
      </div>

      {/* Categories SaaS Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-xs text-neutral-500 col-span-3 py-12 text-center">
            Synchronizing dynamic categories...
          </p>
        ) : filteredCategories.length === 0 ? (
          <p className="text-xs text-neutral-500 col-span-3 py-12 text-center">
            No categories found matching "{searchTerm}".
          </p>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="rounded-3xl bg-gradient-to-b from-[#0F1916] to-[#0A1210] overflow-hidden border border-[#1E332B] flex flex-col justify-between shadow-xl hover:border-emerald-500/40 hover:shadow-2xl transition-all group"
            >
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1210] via-black/30 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono bg-[#0A1210]/90 border border-[#1E332B] px-2.5 py-0.5 rounded-full text-emerald-400 font-bold backdrop-blur-md">
                  /{cat.slug}
                </span>
                {cat.featured && (
                  <span className="absolute top-3 right-3 text-[10px] bg-amber-400 text-neutral-950 font-bold px-2.5 py-0.5 rounded-full shadow-md">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description || 'Dedicated sovereign attar collection.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#1E332B] flex justify-between items-center text-xs">
                  <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" /> Active Storefront
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-1.5 text-neutral-400 hover:text-emerald-300 hover:bg-[#13221E] rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#0A1210] border border-[#1E332B] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-white">
            <div className="flex justify-between items-center border-b border-[#1E332B] pb-3">
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{editingCategoryId ? 'Edit Collection' : 'Create Dynamic Category'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-500 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-bold text-neutral-300 uppercase tracking-wider text-[10px]">
                  Category Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Musk"
                  className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <AdminImageUpload
                value={formData.image}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                label="Category Visual Image (Upload to Cloudinary)"
                folder="attar-depot/categories"
              />

              <div className="space-y-1">
                <label className="block font-bold text-neutral-300 uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Olfactory notes, origins, and heritage story..."
                  className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-medium leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4 bg-[#070D0B]"
                />
                <label htmlFor="featured" className="text-neutral-300 font-medium cursor-pointer">
                  Feature in homepage showcase & navigation highlight
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#1E332B]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-400 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="btn-emerald px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-xs text-white"
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending
                    ? 'Saving Collection...'
                    : editingCategoryId
                    ? 'Update Collection'
                    : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
