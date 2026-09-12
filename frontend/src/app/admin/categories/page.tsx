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
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
    featured: true,
  });

  const handleOpenCreateModal = () => {
    setEditingCategoryId(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
      featured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategoryId(cat._id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest">
              Taxonomy Studio
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              {categories.length} Active Collections
            </span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Dynamic Fragrance Categories
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Categories configured here dynamically populate the customer shop dropdown, homepage curation, and product creation choices.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white hover:from-emerald-800 hover:to-emerald-950 transition-all shadow-md shadow-emerald-900/10 active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Dynamic Category</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex justify-between items-center shadow-2xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage('')} className="text-emerald-700 hover:text-emerald-950 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter categories by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-neutral-800 font-poppins shadow-2xs"
        />
      </div>

      {/* Categories SaaS Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-xs text-neutral-400 col-span-3 py-8 text-center">
            Synchronizing dynamic categories...
          </p>
        ) : filteredCategories.length === 0 ? (
          <p className="text-xs text-neutral-500 col-span-3 py-8 text-center">
            No categories found matching "{searchTerm}".
          </p>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className="rounded-3xl bg-white overflow-hidden border border-emerald-100 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden">
                <Image
                  src={cat.image || 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800'}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-emerald-900 font-bold shadow-sm">
                  /{cat.slug}
                </span>
                {cat.featured && (
                  <span className="absolute top-3 right-3 text-[10px] bg-amber-400 text-neutral-900 font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Featured
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-poppins text-base font-bold text-neutral-900">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description || 'Dedicated sovereign attar collection.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex justify-between items-center text-xs">
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Storefront
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(cat)}
                      className="p-1.5 text-neutral-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, cat.name)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 bg-neutral-900/50 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-emerald-100 pb-3">
              <h2 className="font-poppins text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>{editingCategoryId ? 'Edit Dynamic Category' : 'Create Dynamic Category'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Mukhallat Blends"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Summary for shop navigation dropdown and category banner..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-neutral-800">
                  Feature in storefront navigation & homepage
                </span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-neutral-500 hover:text-neutral-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
                  className="px-5 py-2 rounded-xl font-bold uppercase tracking-wider bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs"
                >
                  {createCategoryMutation.isPending || updateCategoryMutation.isPending
                    ? 'Saving...'
                    : editingCategoryId
                    ? 'Update Category'
                    : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
