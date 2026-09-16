'use client';

import React, { useState, useMemo } from 'react';
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
  Check,
} from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { usePublicTaxonomy } from '@/hooks/useTaxonomy';
import {
  useAdminCreateProduct,
  useAdminUpdateProduct,
  useAdminDeleteProduct,
} from '@/hooks/useAdmin';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import { toast } from '@/lib/toast';
import AdminImageUpload from '@/components/admin/AdminImageUpload';

// Ecommerce Filter Presets from Reference Architecture
export const PRESET_GENDERS = [
  { label: "Men's Perfumes", value: 'Men' },
  { label: "Women's Perfumes", value: 'Women' },
  { label: 'Unisex Perfumes', value: 'Unisex' },
];

export const PRESET_COLLECTIONS = [
  'Untold Stories',
  'Artisan Series',
  'Wisal Series',
  'Aurum Series',
  'Aristocrat Series',
  'Gold Series',
  'Royal Series',
];

export const PRESET_NOTES = [
  'Fresh & Aquatic',
  'Musk',
  'Oudh/Agarwood',
  'Floral',
  'Fruity',
  'Sweet',
  'Woody',
  'Spicy',
  'Amber',
  'Vanilla',
  'Citrus',
  'Patchouli',
  'Sandalwood',
  'Rose',
];

export const PRESET_OCCASIONS = [
  'Casual Wear',
  'Evening Wear',
  'Gym Wear',
  'Office Wear',
  'Party Wear',
  'Summer Wear',
  'Winter Wear',
];

interface ProductFormData {
  name: string;
  tagline: string;
  description: string;
  category: string;
  fragranceFamily: string;
  gender: string;
  collection: string;
  notes: string[];
  occasions: string[];
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
  gender: 'Unisex',
  collection: 'Untold Stories',
  notes: ['Oudh/Agarwood', 'Amber'],
  occasions: ['Evening Wear', 'Party Wear'],
  topNotes: 'Smoky Amber, Bergamot, Saffron',
  heartNotes: 'Damask Rose, Sandalwood, Frankincense',
  baseNotes: 'Assam Agarwood, Kashmiri Musk, Golden Amber',
  price: 2499,
  originalPrice: 2999,
  image: '',
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
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [selectedGenderFilter, setSelectedGenderFilter] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basics' | 'pricing' | 'olfactory' | 'media'>('basics');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  // Dynamic tags input state
  const [customNoteInput, setCustomNoteInput] = useState('');
  const [customOccasionInput, setCustomOccasionInput] = useState('');
  const [isCustomCollection, setIsCustomCollection] = useState(false);
  const [customCollectionInput, setCustomCollectionInput] = useState('');

  const { data: productsData, isLoading } = useProducts({ search: searchTerm, limit: 100 });
  const products = productsData?.products || [];
  const { data: categories = [] } = useCategories();
  const { data: taxonomy } = usePublicTaxonomy();

  const dynamicCollections = useMemo(() => {
    const list = taxonomy?.collections?.filter((c) => c.isActive !== false).map((c) => c.name) || [];
    return list.length > 0 ? list : PRESET_COLLECTIONS;
  }, [taxonomy?.collections]);

  const dynamicNotes = useMemo(() => {
    const list = taxonomy?.notes?.filter((n) => n.isActive !== false).map((n) => n.name) || [];
    return list.length > 0 ? list : PRESET_NOTES;
  }, [taxonomy?.notes]);

  const dynamicOccasions = useMemo(() => {
    const list = taxonomy?.occasions?.filter((o) => o.isActive !== false).map((o) => o.name) || [];
    return list.length > 0 ? list : PRESET_OCCASIONS;
  }, [taxonomy?.occasions]);

  const createProductMutation = useAdminCreateProduct();
  const updateProductMutation = useAdminUpdateProduct();
  const deleteProductMutation = useAdminDeleteProduct();

  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setIsCustomCollection(false);
    setCustomCollectionInput('');
    setCustomNoteInput('');
    setCustomOccasionInput('');
    setFormData({
      ...defaultFormData,
      category: categories[0]?._id || '',
      gender: 'Unisex',
      collection: 'Untold Stories',
      notes: ['Oudh/Agarwood', 'Amber'],
      occasions: ['Evening Wear', 'Party Wear'],
      image: '',
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

    const isCustomCol = p.collection && !dynamicCollections.includes(p.collection);
    setIsCustomCollection(!!isCustomCol);
    setCustomCollectionInput(isCustomCol ? p.collection : '');
    setCustomNoteInput('');
    setCustomOccasionInput('');

    setFormData({
      name: p.name || '',
      tagline: p.tagline || '',
      description: p.description || '',
      category: p.category?._id || categories[0]?._id || '',
      fragranceFamily: p.fragranceFamily || (p.notes?.[0] || 'Oudh'),
      gender: p.gender || 'Unisex',
      collection: p.collection || 'Untold Stories',
      notes: p.notes || [],
      occasions: p.occasions || [],
      topNotes: p.fragranceNotes?.topNotes?.join(', ') || '',
      heartNotes: p.fragranceNotes?.heartNotes?.join(', ') || '',
      baseNotes: p.fragranceNotes?.baseNotes?.join(', ') || '',
      price: p.price || 0,
      originalPrice: p.originalPrice || p.price,
      image: p.images?.[0] || '',
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

  const handleToggleNote = (note: string) => {
    setFormData((prev) => {
      const exists = prev.notes.includes(note);
      return {
        ...prev,
        notes: exists ? prev.notes.filter((n) => n !== note) : [...prev.notes, note],
      };
    });
  };

  const handleAddCustomNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customNoteInput.trim();
    if (!trimmed) return;
    if (!formData.notes.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, notes: [...prev.notes, trimmed] }));
    }
    setCustomNoteInput('');
  };

  const handleToggleOccasion = (occasion: string) => {
    setFormData((prev) => {
      const exists = prev.occasions.includes(occasion);
      return {
        ...prev,
        occasions: exists ? prev.occasions.filter((o) => o !== occasion) : [...prev.occasions, occasion],
      };
    });
  };

  const handleAddCustomOccasion = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customOccasionInput.trim();
    if (!trimmed) return;
    if (!formData.occasions.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, occasions: [...prev.occasions, trimmed] }));
    }
    setCustomOccasionInput('');
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
    if (!formData.image.trim()) {
      setStatusMessage('Please upload an image for the fragrance flacon.');
      toast.error('Please upload an image for the product flacon.', { title: 'Image Required' });
      setActiveTab('media');
      return;
    }

    try {
      const finalCollection = isCustomCollection ? customCollectionInput.trim() : formData.collection;
      const payload = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim(),
        category: formData.category || categories[0]?._id,
        fragranceFamily: formData.notes?.[0] || formData.fragranceFamily || 'Oudh',
        gender: formData.gender,
        collection: finalCollection,
        notes: formData.notes,
        occasions: formData.occasions,
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

  // Filter products by dynamic category and gender
  const filteredProducts = products.filter((p) => {
    if (selectedCategoryFilter !== 'All') {
      const catId = typeof p.category === 'object' ? p.category?._id : p.category;
      const catName = typeof p.category === 'object' ? p.category?.name : '';
      if (catId !== selectedCategoryFilter && catName !== selectedCategoryFilter) {
        return false;
      }
    }
    if (selectedGenderFilter !== 'All' && p.gender !== selectedGenderFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* SaaS Catalog Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E332B] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[13px] text-neutral-400 font-medium">
              No. of Products: {products.length}
            </span>
          </div>
          <h1 className="font-poppins text-2xl sm:text-3xl font-bold tracking-tight text-white">
            All Products
          </h1>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Manage flacons, edit pricing and scent pyramids, view live patron cards, and update inventory.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white hover:from-emerald-500 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-950/50 border border-emerald-400/30 active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Create New Products</span>
        </button>
      </div>

      {/* Feedback Alert */}
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0A1210] p-3 rounded-2xl border border-[#1E332B] shadow-inner">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search flacons by name, slug, notes, or collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#070D0B] border border-[#1E332B] rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-white placeholder-neutral-500 font-poppins"
          />
        </div>

        {/* Dynamic Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            key="All"
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
              selectedCategoryFilter === 'All'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold'
                : 'bg-[#0E1815] text-neutral-400 hover:text-white hover:bg-[#152621]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => setSelectedCategoryFilter(cat._id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)] font-bold'
                    : 'bg-[#0E1815] text-neutral-400 hover:text-white hover:bg-[#152621]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products SaaS Table */}
      <div className="rounded-3xl bg-gradient-to-b from-[#0F1916] to-[#0A1210] border border-[#1E332B] overflow-hidden shadow-2xl shadow-black/60">
        <div className="md:hidden px-4 py-1.5 text-[10px] text-emerald-400 bg-[#0A1512] flex items-center justify-between border-b border-[#1E332B]">
          <span>Scroll horizontally for full flacon metrics</span>
          <span className="font-mono text-[11px]">&rarr;</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-[#09110F] text-neutral-400 uppercase tracking-wider font-semibold border-b border-[#1E332B]">
              <tr>
                <th className="p-4 pl-6">Images and Titles</th>
                <th className="p-4">Category</th>
                <th className="p-4">Collection & Gender</th>
                <th className="p-4">Price (6ml)</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Flags</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162520] text-neutral-300">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading concentrated flacon catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-neutral-500">
                    No perfume flacons found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-[#12211C]/80 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-14 rounded-xl bg-[#0E1815] overflow-hidden flex-shrink-0 border border-[#1E332B] shadow-md">
                          <Image
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'}
                            alt={p.name}
                            fill
                            sizes="48px"
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{p.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">/{p.slug}</p>
                          {p.notes && p.notes.length > 0 ? (
                            <p className="text-[10px] text-emerald-400 mt-0.5 line-clamp-1 font-medium">
                              Notes: {p.notes.slice(0, 3).join(' • ')}
                            </p>
                          ) : p.fragranceNotes?.topNotes?.length > 0 ? (
                            <p className="text-[10px] text-emerald-400 mt-0.5 line-clamp-1">
                              Notes: {p.fragranceNotes.topNotes.slice(0, 2).join(', ')}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-[11px]">
                        {p.category?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-white text-xs">
                          {p.collection || 'Standard Series'}
                        </p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-amber-300 font-medium bg-[#070D0B] border border-[#1E332B] px-1.5 py-0.5 rounded-md">
                            {p.gender ? (p.gender === 'Men' ? "Men's" : p.gender === 'Women' ? "Women's" : p.gender) : 'Unisex'}
                          </span>
                          {p.occasions && p.occasions.length > 0 && (
                            <span className="text-[10px] text-neutral-400">
                              • {p.occasions[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-poppins font-bold text-emerald-400 text-sm">
                        {formatPrice(p.price)}
                      </p>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <p className="text-[10px] text-neutral-500 line-through">
                          {formatPrice(p.originalPrice)}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      {p.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/40 whitespace-nowrap shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                          OUT OF STOCK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 whitespace-nowrap shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Available : {p.stock}
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40">
                            Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Product Modal Trigger */}
                        <button
                          onClick={() => setViewingProduct(p)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-300 hover:bg-[#13221E] transition-colors"
                          title="View flacon details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Product Modal Trigger */}
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-blue-400 hover:bg-blue-950/30 transition-colors"
                          title="Edit flacon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Product */}
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs p-3 sm:p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#0A1210] border border-[#1E332B] rounded-3xl max-w-2xl w-full p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative text-white max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-[#1E332B] pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 uppercase">
                  Flacon Intelligence
                </span>
                <span className="text-xs text-neutral-400 font-mono">/{viewingProduct.slug}</span>
              </div>
              <button
                onClick={() => setViewingProduct(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-[#121E1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Product Photo */}
              <div className="relative aspect-[3/4] w-full min-h-[220px] rounded-2xl overflow-hidden bg-neutral-900 border border-[#1E332B] shadow-inner">
                <Image
                  src={viewingProduct.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'}
                  alt={viewingProduct.name}
                  fill
                  sizes="300px"
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Product Scent Details */}
              <div className="sm:col-span-2 space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">
                    {viewingProduct.name}
                  </h2>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    {viewingProduct.tagline || 'Concentrated Royal Attar Extract'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xl font-extrabold text-white font-poppins">
                    {formatPrice(viewingProduct.price)}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    (Standard 6ml Flacon)
                  </span>
                  {viewingProduct.stock <= 0 ? (
                    <span className="text-[10px] bg-rose-950/80 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/40 uppercase tracking-wider">
                      OUT OF STOCK
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Available : {viewingProduct.stock}
                    </span>
                  )}
                </div>

                {/* Ecommerce Attributes Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {viewingProduct.collection && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#11221C] text-emerald-300 border border-emerald-500/30">
                      Series: {viewingProduct.collection}
                    </span>
                  )}
                  {viewingProduct.gender && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#1F1C10] text-amber-300 border border-amber-500/30">
                      Gender: {viewingProduct.gender}
                    </span>
                  )}
                </div>

                {viewingProduct.notes && viewingProduct.notes.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-400">
                      Storefront Filter Notes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {viewingProduct.notes.map((n) => (
                        <span key={n} className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scent Pyramid Breakdown */}
                <div className="p-3.5 rounded-2xl bg-[#0E1815] border border-[#1E332B] space-y-2 text-xs">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                    Olfactory Architecture
                  </p>
                  <div className="space-y-1 text-neutral-300">
                    <p>
                      <strong className="text-white font-semibold">Top Notes:</strong>{' '}
                      {viewingProduct.fragranceNotes?.topNotes?.join(', ') || 'N/A'}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Heart Notes:</strong>{' '}
                      {viewingProduct.fragranceNotes?.heartNotes?.join(', ') || 'N/A'}
                    </p>
                    <p>
                      <strong className="text-white font-semibold">Base Notes:</strong>{' '}
                      {viewingProduct.fragranceNotes?.baseNotes?.join(', ') || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Sizes Matrix */}
                {viewingProduct.sizes?.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-neutral-400">
                      Available Sizes & Pricing Matrix
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {viewingProduct.sizes.map((s, idx) => (
                        <div key={idx} className="p-2 rounded-xl border border-[#1E332B] bg-[#070D0B] text-center">
                          <p className="font-bold text-white">{s.size}</p>
                          <p className="font-poppins font-bold text-emerald-400">{formatPrice(s.price)}</p>
                          <p className="text-[10px] text-neutral-400">{s.stock} in stock</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="text-xs text-neutral-300 bg-[#0E1815] p-4 rounded-2xl border border-[#1E332B] leading-relaxed">
              {viewingProduct.description}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-[#1E332B]">
              <Link
                href={`/product/${viewingProduct.slug}`}
                target="_blank"
                className="text-xs text-neutral-400 hover:text-emerald-300 font-bold flex items-center gap-1"
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
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-700 text-white rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-[#0A1210] border border-[#1E332B] rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl relative my-auto text-white overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-[#1E332B] px-5 sm:px-6 py-4 flex-shrink-0">
              <div>
                <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>{editingProductId ? 'Edit Product' : 'Add Product'}</span>
                </h2>
              </div>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-[#121E1B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs for Better Visibility & UX */}
            <div className="flex border-b border-[#1E332B] text-xs font-semibold overflow-x-auto gap-1 sm:gap-2 px-4 sm:px-6 pt-2 no-scrollbar flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('basics')}
                className={`pb-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'basics'
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
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
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
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
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
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
                    ? 'border-emerald-500 text-emerald-400 font-bold'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>4. Media & Badges</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* TAB 1: BASICS */}
              {activeTab === 'basics' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Fragrance Flacon Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Royal Mukhallat Al-Sultan"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Tagline / Royal Descriptor
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      placeholder="e.g. Vintage 20-Year Aged Cambodian Agarwood & Mysore Sandalwood"
                      value={formData.tagline}
                      onChange={handleInputChange}
                      className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Dynamic Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id} className="bg-[#0A1210] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Gender Selector */}
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Target Gender *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      {PRESET_GENDERS.map((g) => {
                        const isSelected = formData.gender === g.value;
                        return (
                          <button
                            type="button"
                            key={g.value}
                            onClick={() => setFormData((prev) => ({ ...prev, gender: g.value }))}
                            className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all text-center truncate ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-950/70 text-emerald-300 shadow-sm'
                                : 'border-[#1E332B] bg-[#070D0B] text-neutral-400 hover:text-white hover:border-neutral-600'
                            }`}
                          >
                            {g.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Collection / Product Series Selector */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                        Collection / Product Line *
                      </label>
                      <span className="text-[10px] text-neutral-500">
                        {isCustomCollection ? 'Custom Series' : 'Preset Series'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={isCustomCollection ? '__custom__' : formData.collection}
                        onChange={(e) => {
                          if (e.target.value === '__custom__') {
                            setIsCustomCollection(true);
                          } else {
                            setIsCustomCollection(false);
                            setFormData((prev) => ({ ...prev, collection: e.target.value }));
                          }
                        }}
                        className="flex-1 bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                      >
                        {dynamicCollections.map((col) => (
                          <option key={col} value={col} className="bg-[#0A1210] text-white">
                            {col}
                          </option>
                        ))}
                        <option value="__custom__" className="bg-[#0A1210] text-amber-300 font-semibold">
                          + Add Custom Series Name...
                        </option>
                      </select>

                      {isCustomCollection && (
                        <input
                          type="text"
                          required
                          placeholder="Type custom collection name..."
                          value={customCollectionInput}
                          onChange={(e) => setCustomCollectionInput(e.target.value)}
                          className="flex-1 bg-[#070D0B] border border-emerald-500/60 rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 font-medium animate-in fade-in"
                        />
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      Full Olfactory Story & Formulation *
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe distillation origin, scent progression, wear time, and artisanal flacon packaging..."
                      className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-medium"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & VARIANTS */}
              {activeTab === 'pricing' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Base Price 6ml (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        required
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-poppins font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Original / Compare Price (₹)
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-poppins"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Total Inventory Stock *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        required
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0E1815] border border-[#1E332B] space-y-3">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-400">
                      Multi-Tier Bottle Sizes Pricing Matrix
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1 text-[10px]">
                          3ml Flacon (₹)
                        </label>
                        <input
                          type="number"
                          name="size3mlPrice"
                          value={formData.size3mlPrice}
                          onChange={handleInputChange}
                          className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3 py-2 text-white font-poppins font-bold focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1 text-[10px]">
                          6ml Flacon (₹)
                        </label>
                        <input
                          type="number"
                          name="size6mlPrice"
                          value={formData.size6mlPrice}
                          onChange={handleInputChange}
                          className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3 py-2 text-white font-poppins font-bold focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-semibold mb-1 text-[10px]">
                          12ml Royal Flacon (₹)
                        </label>
                        <input
                          type="number"
                          name="size12mlPrice"
                          value={formData.size12mlPrice}
                          onChange={handleInputChange}
                          className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3 py-2 text-white font-poppins font-bold focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SCENT PYRAMID & ECOMMERCE ATTRIBUTES */}
              {activeTab === 'olfactory' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Scent Notes Facet Filter Chips */}
                  <div className="p-4 rounded-2xl bg-[#0E1815] border border-[#1E332B] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Fragrance Notes (For Storefront Filter & Customer Search)</span>
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          Click to toggle notes matching customer search preferences from reference image
                        </p>
                      </div>
                      <span className="text-[10px] font-mono bg-[#070D0B] px-2 py-0.5 rounded text-neutral-400 border border-[#1E332B]">
                        {formData.notes.length} Selected
                      </span>
                    </div>

                    {/* Dynamic Note Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {dynamicNotes.map((note) => {
                        const isSelected = formData.notes.includes(note);
                        return (
                          <button
                            type="button"
                            key={note}
                            onClick={() => handleToggleNote(note)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] border border-emerald-400'
                                : 'bg-[#070D0B] text-neutral-400 hover:text-white hover:bg-[#142621] border border-[#1E332B]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                            <span>{note}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Dynamic Note Input */}
                    <div className="flex gap-2 pt-2 border-t border-[#1E332B]">
                      <input
                        type="text"
                        placeholder="Add custom note (e.g. Smoky Cardamom, White Amber)..."
                        value={customNoteInput}
                        onChange={(e) => setCustomNoteInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomNote();
                          }
                        }}
                        className="flex-1 bg-[#070D0B] border border-[#1E332B] rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomNote()}
                        className="px-3.5 py-2 bg-[#12241F] hover:bg-emerald-700 text-neutral-200 hover:text-white rounded-xl font-bold text-xs transition-colors border border-[#1E332B]"
                      >
                        + Add Note
                      </button>
                    </div>

                    {/* Selected Notes Summary Pills */}
                    {formData.notes.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {formData.notes.map((note) => (
                          <span
                            key={note}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                          >
                            {note}
                            <button
                              type="button"
                              onClick={() => handleToggleNote(note)}
                              className="hover:text-rose-400 p-0.5"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Occasions Facet Filter Chips */}
                  <div className="p-4 rounded-2xl bg-[#0E1815] border border-[#1E332B] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-rose-400" />
                          <span>Recommended Occasions (Lifestyle & Wear Recommendations)</span>
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          Categorize which lifestyle occasions this fragrance is recommended for
                        </p>
                      </div>
                      <span className="text-[10px] font-mono bg-[#070D0B] px-2 py-0.5 rounded text-neutral-400 border border-[#1E332B]">
                        {formData.occasions.length} Selected
                      </span>
                    </div>

                    {/* Dynamic Occasion Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {dynamicOccasions.map((occ) => {
                        const isSelected = formData.occasions.includes(occ);
                        return (
                          <button
                            type="button"
                            key={occ}
                            onClick={() => handleToggleOccasion(occ)}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? 'bg-amber-600 text-white font-bold shadow-[0_0_10px_rgba(217,119,6,0.3)] border border-amber-400'
                                : 'bg-[#070D0B] text-neutral-400 hover:text-white hover:bg-[#142621] border border-[#1E332B]'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                            <span>{occ}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Dynamic Occasion Input */}
                    <div className="flex gap-2 pt-2 border-t border-[#1E332B]">
                      <input
                        type="text"
                        placeholder="Add custom occasion (e.g. Royal Wedding, Friday Prayers)..."
                        value={customOccasionInput}
                        onChange={(e) => setCustomOccasionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomOccasion();
                          }
                        }}
                        className="flex-1 bg-[#070D0B] border border-[#1E332B] rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomOccasion()}
                        className="px-3.5 py-2 bg-[#12241F] hover:bg-amber-700 text-neutral-200 hover:text-white rounded-xl font-bold text-xs transition-colors border border-[#1E332B]"
                      >
                        + Add Occasion
                      </button>
                    </div>

                    {/* Selected Occasions Summary Pills */}
                    {formData.occasions.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {formData.occasions.map((occ) => (
                          <span
                            key={occ}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30"
                          >
                            {occ}
                            <button
                              type="button"
                              onClick={() => handleToggleOccasion(occ)}
                              className="hover:text-rose-400 p-0.5"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Scent Pyramid Breakdown */}
                  <div className="space-y-4 pt-2 border-t border-[#1E332B]">
                    <div>
                      <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Top Notes (First 15-30 Mins)
                      </label>
                      <input
                        type="text"
                        name="topNotes"
                        value={formData.topNotes}
                        onChange={handleInputChange}
                        placeholder="e.g. Italian Bergamot, Saffron, Cardamom"
                        className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Heart Notes (2 - 6 Hours)
                      </label>
                      <input
                        type="text"
                        name="heartNotes"
                        value={formData.heartNotes}
                        onChange={handleInputChange}
                        placeholder="e.g. Taif Rose, Mysore Sandalwood, Frankincense"
                        className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Base Notes (Dry Down & Sillage 12+ Hours)
                      </label>
                      <input
                        type="text"
                        name="baseNotes"
                        value={formData.baseNotes}
                        onChange={handleInputChange}
                        placeholder="e.g. Aged Assam Oudh, Royal Kashmiri Musk, Amber Resin"
                        className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Distillation Origin
                        </label>
                        <input
                          type="text"
                          name="origin"
                          value={formData.origin}
                          onChange={handleInputChange}
                          placeholder="e.g. Assam, India"
                          className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Longevity & Sillage
                        </label>
                        <input
                          type="text"
                          name="longevityHours"
                          value={formData.longevityHours}
                          onChange={handleInputChange}
                          placeholder="e.g. 14+ Hours on Skin"
                          className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: MEDIA & BADGES */}
              {activeTab === 'media' && (
                <div className="space-y-5 animate-in fade-in">
                  <AdminImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                    label="Product Flacon Image (Upload directly to Cloudinary)"
                    folder="attar-depot/products"
                  />

                  {/* Storefront Feature Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1E332B] bg-[#070D0B] cursor-pointer hover:border-emerald-500/40 transition-colors">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 bg-[#070D0B]"
                      />
                      <div>
                        <p className="font-bold text-white text-xs flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-400" /> Featured Collection
                        </p>
                        <p className="text-[10px] text-neutral-500">Highlight on store home page carousel</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#1E332B] bg-[#070D0B] cursor-pointer hover:border-emerald-500/40 transition-colors">
                      <input
                        type="checkbox"
                        name="isBestSeller"
                        checked={formData.isBestSeller}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 bg-[#070D0B]"
                      />
                      <div>
                        <p className="font-bold text-white text-xs flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-rose-400" /> Best Seller Badge
                        </p>
                        <p className="text-[10px] text-neutral-500">Display trending badge on catalog</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              </div>

              {/* Modal Action Buttons (Sticky at bottom) */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-t border-[#1E332B] flex-shrink-0 bg-[#070D0B]">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-3 sm:px-4 py-2 text-neutral-400 hover:text-white font-semibold text-xs"
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
                      className="px-3.5 sm:px-4 py-2 rounded-xl border border-[#1E332B] text-neutral-300 font-bold hover:bg-[#121E1B] text-xs"
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
                      className="px-4 sm:px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-600 transition-colors shadow-md text-xs"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={createProductMutation.isPending || updateProductMutation.isPending}
                      className="px-4 sm:px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-bold uppercase tracking-wider hover:from-emerald-500 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-950/50 active:scale-98 text-xs"
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
