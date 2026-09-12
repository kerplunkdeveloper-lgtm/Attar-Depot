'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  X,
  Sparkles,
  ExternalLink,
  Tag,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Sliders,
  DollarSign,
  Image as ImageIcon,
  Flame,
  Award,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import {
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminDeleteProduct,
} from '@/hooks/useAdmin';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { toast } from '@/lib/toast';

interface ProductFormData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  fragranceFamily: 'Oudh' | 'Floral' | 'Musk' | 'Amber & Woods' | 'Spicy Oriental' | 'Fresh Citrus';
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  price: number;
  originalPrice: number;
  image: string;
  stock: number;
  concentration: string;
  origin: string;
  longevityHours: string;
  projection: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  size3mlPrice: number;
  size6mlPrice: number;
  size12mlPrice: number;
}

const defaultFormData: ProductFormData = {
  name: '',
  tagline: '',
  description: '',
  category: '',
  fragranceFamily: 'Oudh',
  topNotes: 'Smoky Amber, Bergamot, Saffron',
  heartNotes: 'Damask Rose, Sandalwood, Frankincense',
  baseNotes: 'Assam Agarwood, Kashmiri Musk, Golden Amber',
  price: 2499,
  originalPrice: 2999,
  image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
  stock: 30,
  concentration: 'Pure Concentrated Perfume Oil (Attar)',
  origin: 'Kannauj & Assam, India',
  longevityHours: '14+ Hours',
  projection: 'Strong Royal Sillage',
  isFeatured: true,
  isBestSeller: false,
  size3mlPrice: 1399,
  size6mlPrice: 2499,
  size12mlPrice: 4499,
};

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basics' | 'pricing' | 'olfactory' | 'media'>('basics');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const { data: productsData, isLoading } = useProducts({ search: searchTerm, limit: 100 });
  const products = productsData?.products || [];
  const { data: categories = [] } = useCategories();

  const createProductMutation = useAdminCreateProduct();
  const updateProductMutation = useAdminUpdateProduct();
  const deleteProductMutation = useAdminDeleteProduct();

  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormData({
      ...defaultFormData,
      category: categories[0]?._id || '',
    });
    setActiveTab('basics');
    setIsFormModalOpen(true);
  };

  // Open Edit Modal with pre-filled data
  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p._id);
    const size3 = p.sizes?.find((s) => s.size === '3ml')?.price || Math.round(p.price * 0.55);
    const size6 = p.sizes?.find((s) => s.size === '6ml')?.price || p.price;
    const size12 = p.sizes?.find((s) => s.size === '12ml')?.price || Math.round(p.price * 1.8);

    setFormData({
      name: p.name || '',
      tagline: p.tagline || '',
      description: p.description || '',
      category: p.category?._id || categories[0]?._id || '',
      fragranceFamily: p.fragranceFamily || 'Oudh',
      topNotes: p.fragranceNotes?.topNotes?.join(', ') || '',
      heartNotes: p.fragranceNotes?.heartNotes?.join(', ') || '',
      baseNotes: p.fragranceNotes?.baseNotes?.join(', ') || '',
      price: p.price || 0,
      originalPrice: p.originalPrice || p.price,
      image: p.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
      stock: p.stock ?? 25,
      concentration: p.concentration || 'Pure Concentrated Perfume Oil (Attar)',
      origin: p.origin || 'Kannauj, India',
      longevityHours: p.longevityHours || '12+ Hours',
      projection: p.projection || 'Royal Sillage',
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      size3mlPrice: size3,
      size6mlPrice: size6,
      size12mlPrice: size12,
    });
    setActiveTab('basics');
    setIsFormModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setStatusMessage('Please enter the fragrance flacon name.');
      return;
    }
    if (!formData.description.trim()) {
      setStatusMessage('Please enter a description for the flacon.');
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        category: formData.category || categories[0]?._id,
        fragranceFamily: formData.fragranceFamily,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock),
        images: [formData.image.trim()],
        concentration: formData.concentration,
        origin: formData.origin,
        longevityHours: formData.longevityHours,
        projection: formData.projection,
        isFeatured: formData.isFeatured,
        isBestSeller: formData.isBestSeller,
        topNotes: formData.topNotes,
        heartNotes: formData.heartNotes,
        baseNotes: formData.baseNotes,
        sizes: [
          { size: '3ml', price: Number(formData.size3mlPrice), stock: Math.max(5, Math.round(Number(formData.stock) * 0.4)) },
          { size: '6ml', price: Number(formData.size6mlPrice), stock: Number(formData.stock) },
          { size: '12ml', price: Number(formData.size12mlPrice), stock: Math.max(5, Math.round(Number(formData.stock) * 0.3)) },
        ],
      };

      if (editingProductId) {
        await updateProductMutation.mutateAsync({ id: editingProductId, data: payload });
        const msg = `Flacon "${formData.name}" successfully updated!`;
        setStatusMessage(msg);
        toast.success(msg, { title: 'Product Updated' });
      } else {
        await createProductMutation.mutateAsync(payload);
        const msg = `New flacon "${formData.name}" published to the store!`;
        setStatusMessage(msg);
        toast.success(msg, { title: 'Product Created' });
      }

      setIsFormModalOpen(false);
      setEditingProductId(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Error processing product.';
      setStatusMessage(msg);
      toast.error(msg, { title: 'Operation Failed' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you wish to delete "${name}" from inventory?`)) {
      try {
        await deleteProductMutation.mutateAsync(id);
        const msg = `Flacon "${name}" deleted.`;
        setStatusMessage(msg);
        toast.info(msg, { title: 'Product Removed' });
      } catch (err: any) {
        setStatusMessage('Failed to remove flacon.');
        toast.error('Failed to remove flacon.', { title: 'Delete Failed' });
      }
    }
  };

  // Filter products by family
  const filteredProducts = products.filter((p) => {
    if (selectedFamily !== 'All' && p.fragranceFamily !== selectedFamily) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* SaaS Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-widest">
              Flacon Inventory
            </span>
            <span className="text-[11px] text-neutral-400 font-medium">
              {products.length} Sovereign Scents
            </span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            Attar Flacon Catalog & Matrix
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage flacons, edit pricing and scent pyramids, view live patron cards, and update inventory.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white hover:from-emerald-800 hover:to-emerald-950 transition-all shadow-md shadow-emerald-900/10 active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Add New Flacon</span>
        </button>
      </div>

      {/* Feedback Alert */}
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-emerald-100 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flacons by name, slug, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50/70 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 text-neutral-800 font-poppins"
          />
        </div>

        {/* Family Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Oudh', 'Floral', 'Musk', 'Amber & Woods'].map((fam) => (
            <button
              key={fam}
              onClick={() => setSelectedFamily(fam)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                selectedFamily === fam
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-neutral-50 text-neutral-600 hover:text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {fam}
            </button>
          ))}
        </div>
      </div>

      {/* Products SaaS Table */}
      <div className="rounded-3xl bg-white border border-emerald-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F4FAF6] text-neutral-600 uppercase tracking-wider font-semibold border-b border-emerald-100">
              <tr>
                <th className="p-4">Flacon & Notes</th>
                <th className="p-4">Category</th>
                <th className="p-4">Olfactory Family</th>
                <th className="p-4">Price (6ml)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Flags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-neutral-400">
                    Loading concentrated flacon catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-neutral-400">
                    No perfume flacons found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-11 h-13 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-emerald-100 shadow-2xs">
                          <Image
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'}
                            alt={p.name}
                            fill
                            sizes="44px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 text-sm">{p.name}</p>
                          <p className="text-[10px] text-neutral-400 font-mono">/{p.slug}</p>
                          {p.fragranceNotes?.topNotes?.length > 0 && (
                            <p className="text-[10px] text-emerald-700 mt-0.5 line-clamp-1">
                              Notes: {p.fragranceNotes.topNotes.slice(0, 2).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px]">
                        {p.category?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-neutral-600 font-medium">{p.fragranceFamily}</span>
                    </td>

                    <td className="p-4">
                      <p className="font-poppins font-bold text-neutral-900 text-sm">
                        {formatPrice(p.price)}
                      </p>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <p className="text-[10px] text-neutral-400 line-through">
                          {formatPrice(p.originalPrice)}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock > 10
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.stock > 10 ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
                          }`}
                        />
                        {p.stock} units
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Product Modal Trigger */}
                        <button
                          onClick={() => setViewingProduct(p)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="View flacon details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Product Modal Trigger */}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Edit flacon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Trigger */}
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete flacon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK VIEW PRODUCT MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/50 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                  Flacon Intelligence
                </span>
                <span className="text-xs text-neutral-400 font-mono">/{viewingProduct.slug}</span>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Product Photo */}
              <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-neutral-50 border border-emerald-100 shadow-sm">
                <Image
                  src={viewingProduct.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'}
                  alt={viewingProduct.name}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>

              {/* Product Scent Details */}
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <h2 className="font-poppins text-xl font-bold text-neutral-900">
                    {viewingProduct.name}
                  </h2>
                  <p className="text-xs text-emerald-800 font-medium mt-0.5">
                    {viewingProduct.tagline || 'Concentrated Royal Attar Extract'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-neutral-900 font-poppins">
                    {formatPrice(viewingProduct.price)}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    (Standard 6ml Flacon)
                  </span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Stock: {viewingProduct.stock} bottles
                  </span>
                </div>

                {/* Scent Pyramid Breakdown */}
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-emerald-100 space-y-2 text-xs">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-900">
                    Olfactory Architecture
                  </p>
                  <div className="space-y-1 text-neutral-700">
                    <p>
                      <strong className="text-neutral-900 font-semibold">Top Notes:</strong>{' '}
                      {viewingProduct.fragranceNotes?.topNotes?.join(', ') || 'N/A'}
                    </p>
                    <p>
                      <strong className="text-neutral-900 font-semibold">Heart Notes:</strong>{' '}
                      {viewingProduct.fragranceNotes?.heartNotes?.join(', ') || 'N/A'}
                    </p>
                    <p>
                      <strong className="text-neutral-900 font-semibold">Base Notes:</strong>{' '}
                      {viewingProduct.fragranceNotes?.baseNotes?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Sizes Matrix */}
                {viewingProduct.sizes?.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-neutral-500">
                      Available Sizes & Pricing Matrix
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {viewingProduct.sizes.map((s, idx) => (
                        <div key={idx} className="p-2 rounded-xl border border-neutral-200 bg-white text-center">
                          <p className="font-bold text-neutral-900">{s.size}</p>
                          <p className="font-poppins font-bold text-emerald-800">{formatPrice(s.price)}</p>
                          <p className="text-[10px] text-neutral-400">{s.stock} in stock</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-xs text-neutral-600 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 leading-relaxed">
              {viewingProduct.description}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-emerald-100">
              <Link
                href={`/product/${viewingProduct.slug}`}
                target="_blank"
                className="text-xs text-neutral-600 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <span>Preview on Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const prodToEdit = viewingProduct;
                    setViewingProduct(null);
                    handleOpenEditModal(prodToEdit);
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-800 text-white rounded-xl hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Flacon</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT PRODUCT MODAL (Sectioned / Tabbed UX) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/50 backdrop-blur-xs p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white border border-emerald-100 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-emerald-100 pb-4">
              <div>
                <h2 className="font-poppins text-lg font-bold text-neutral-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>{editingProductId ? 'Edit Fragrance Flacon' : 'Publish New Luxury Attar Flacon'}</span>
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Configure formulation attributes, olfactory pyramid, and multi-tier pricing.
                </p>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs for Better Visibility & UX */}
            <div className="flex border-b border-neutral-200 text-xs font-semibold overflow-x-auto gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('basics')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'basics'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>1. Essentials</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pricing')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'pricing'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>2. Pricing & Variants</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('olfactory')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'olfactory'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>3. Scent Pyramid</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'media'
                    ? 'border-emerald-700 text-emerald-900 font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>4. Media & Badges</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* TAB 1: BASICS */}
              {activeTab === 'basics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Fragrance Flacon Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Royal Mukhallat Al-Sultan"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Tagline / Royal Descriptor
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      placeholder="e.g. Vintage 20-Year Aged Cambodian Agarwood & Mysore Sandalwood"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Dynamic Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Fragrance Family *
                    </label>
                    <select
                      name="fragranceFamily"
                      value={formData.fragranceFamily}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                    >
                      <option value="Oudh">Oudh</option>
                      <option value="Floral">Floral</option>
                      <option value="Musk">Musk</option>
                      <option value="Amber & Woods">Amber & Woods</option>
                      <option value="Spicy Oriental">Spicy Oriental</option>
                      <option value="Fresh Citrus">Fresh Citrus</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Full Olfactory Story & Formulation *
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe distillation origin, scent progression, wear time, and artisanal flacon packaging..."
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & VARIANTS */}
              {activeTab === 'pricing' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Base Price 6ml (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        required
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 font-poppins font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Original / Compare Price (₹)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 font-poppins"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Total Inventory Stock *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        required
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4FAF6] border border-emerald-100 space-y-3">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-900">
                      Multi-Tier Bottle Sizes Pricing Matrix
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1 text-[10px]">
                          3ml Flacon (₹)
                        </label>
                        <input
                          type="number"
                          name="size3mlPrice"
                          value={formData.size3mlPrice}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-neutral-800 font-poppins font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1 text-[10px]">
                          6ml Flacon (₹)
                        </label>
                        <input
                          type="number"
                          name="size6mlPrice"
                          value={formData.size6mlPrice}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-neutral-800 font-poppins font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-600 font-semibold mb-1 text-[10px]">
                          12ml Royal Flacon (₹)
                        </label>
                        <input
                          type="number"
                          name="size12mlPrice"
                          value={formData.size12mlPrice}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-neutral-800 font-poppins font-bold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SCENT PYRAMID */}
              {activeTab === 'olfactory' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Top Notes (First 15-30 Mins)
                    </label>
                    <input
                      type="text"
                      name="topNotes"
                      value={formData.topNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Italian Bergamot, Saffron, Cardamom"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Heart Notes (2 - 6 Hours)
                    </label>
                    <input
                      type="text"
                      name="heartNotes"
                      value={formData.heartNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Taif Rose, Mysore Sandalwood, Frankincense"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Base Notes (Dry Down & Sillage 12+ Hours)
                    </label>
                    <input
                      type="text"
                      name="baseNotes"
                      value={formData.baseNotes}
                      onChange={handleInputChange}
                      placeholder="e.g. Aged Assam Oudh, Royal Kashmiri Musk, Amber Resin"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Distillation Origin
                      </label>
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        placeholder="e.g. Assam, India"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                        Longevity & Sillage
                      </label>
                      <input
                        type="text"
                        name="longevityHours"
                        value={formData.longevityHours}
                        onChange={handleInputChange}
                        placeholder="e.g. 14+ Hours on Skin"
                        className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & BADGES */}
              {activeTab === 'media' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-neutral-800 font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Flacon Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-neutral-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Live Image Preview */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div className="relative w-16 h-20 rounded-xl bg-white border border-emerald-100 overflow-hidden flex-shrink-0 shadow-xs">
                      {formData.image ? (
                        <Image
                          src={formData.image}
                          alt="Flacon Preview"
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-neutral-400">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 text-xs">Live Flacon Card Preview</p>
                      <p className="text-[11px] text-neutral-500">
                        This image appears in the storefront catalog, search results, and checkout cart.
                      </p>
                    </div>
                  </div>

                  {/* Storefront Feature Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" /> Featured Collection
                        </p>
                        <p className="text-[10px] text-neutral-400">Highlight on store home page carousel</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition-colors">
                      <input
                        type="checkbox"
                        name="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <div>
                        <p className="font-bold text-neutral-900 text-xs flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-600" /> Best Seller Badge
                        </p>
                        <p className="text-[10px] text-neutral-400">Display trending badge on catalog</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2.5 text-neutral-500 hover:text-neutral-900 font-semibold"
                >
                  Cancel
                </button>

                <div className="flex gap-2">
                  {activeTab !== 'basics' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'media') setActiveTab('olfactory');
                        else if (activeTab === 'olfactory') setActiveTab('pricing');
                        else if (activeTab === 'pricing') setActiveTab('basics');
                      }}
                      className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 font-bold hover:bg-neutral-50"
                    >
                      Previous
                    </button>
                  )}

                  {activeTab !== 'media' ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (activeTab === 'basics') setActiveTab('pricing');
                        else if (activeTab === 'pricing') setActiveTab('olfactory');
                        else if (activeTab === 'olfactory') setActiveTab('media');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition-colors shadow-2xs"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={createProductMutation.isPending || updateProductMutation.isPending}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-950 text-white font-bold uppercase tracking-wider hover:from-emerald-800 hover:to-emerald-900 transition-all shadow-md active:scale-98"
                    >
                      {createProductMutation.isPending || updateProductMutation.isPending
                        ? 'Saving Flacon...'
                        : editingProductId
                        ? 'Save Changes'
                        : 'Publish Flacon'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
