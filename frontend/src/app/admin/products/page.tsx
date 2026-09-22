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
  PlusCircle,
  MinusCircle,
  Boxes,
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

// Ecommerce Filter Presets
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

// --- Size Variant type ---
interface SizeVariant {
  _id?: string;
  size: string;
  price: number | '';
  originalPrice?: number | '';
  stock: number | '';
}

const emptySize = (): SizeVariant => ({ size: '', price: 0, originalPrice: 0, stock: 0 });

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
  sizes: SizeVariant[];
  concentration: string;
  origin: string;
  longevityHours: string;
  projection: string;
  isFeatured: boolean;
  isBestSeller: boolean;
}

const defaultFormData: ProductFormData = {
  name: '',
  tagline: '',
  description: '',
  category: '',
  fragranceFamily: '',
  gender: 'Unisex',
  collection: '',
  notes: [],
  occasions: [],
  topNotes: '',
  heartNotes: '',
  baseNotes: '',
  price: 0,
  originalPrice: 0,
  image: '',
  stock: 0,
  sizes: [emptySize()],
  concentration: 'Pure Concentrated Perfume Oil (Attar)',
  origin: '',
  longevityHours: '',
  projection: '',
  isFeatured: false,
  isBestSeller: false,
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

  // ---- Size Variant Handlers ----
  const handleSizeChange = (index: number, field: keyof SizeVariant, value: string | number) => {
    setFormData((prev) => {
      const updated = [...prev.sizes];
      let val: any = value;
      if (field === 'size') {
        val = value;
      } else {
        val = value === '' ? '' : Number(value);
      }
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, sizes: updated };
    });
  };

  const handleAddSize = () => {
    setFormData((prev) => ({ ...prev, sizes: [...prev.sizes, emptySize()] }));
  };

  const handleRemoveSize = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

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
      collection: '',
      notes: [],
      occasions: [],
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      origin: '',
      longevityHours: '',
      projection: '',
      image: '',
      sizes: [emptySize()],
    });
    setActiveTab('basics');
    setIsFormModalOpen(true);
  };

  // Open Edit Modal with pre-filled data
  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p._id);

    // Build sizes from product sizes array
    const prefillSizes: SizeVariant[] =
      p.sizes && p.sizes.length > 0
        ? p.sizes.map((s) => ({
            size: s.size || '',
            price: s.price ?? 0,
            originalPrice: s.originalPrice ?? 0,
            stock: s.stock ?? 0,
          }))
        : [emptySize()];

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
      fragranceFamily: p.fragranceFamily || (p.notes?.[0] || ''),
      gender: p.gender || 'Unisex',
      collection: p.collection || '',
      notes: p.notes || [],
      occasions: p.occasions || [],
      topNotes: p.fragranceNotes?.topNotes?.join(', ') || '',
      heartNotes: p.fragranceNotes?.heartNotes?.join(', ') || '',
      baseNotes: p.fragranceNotes?.baseNotes?.join(', ') || '',
      price: p.price || 0,
      originalPrice: p.originalPrice || 0,
      image: p.images?.[0] || '',
      stock: p.stock ?? 0,
      sizes: prefillSizes,
      concentration: p.concentration || 'Pure Concentrated Perfume Oil (Attar)',
      origin: p.origin || '',
      longevityHours: p.longevityHours || '',
      projection: p.projection || '',
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
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

    const selectedCategory = formData.category || (categories && categories.length > 0 ? categories[0]._id : null);
    if (!selectedCategory) {
      setStatusMessage('Please select a category for the flacon.');
      toast.error('Please select a category.', { title: 'Category Required' });
      setActiveTab('basic');
      return;
    }

    // Validate sizes — at least one size must have a name
    const validSizes = formData.sizes
      .filter((s) => s.size.trim() !== '')
      .map((s) => ({
        ...s,
        size: s.size.trim(),
        price: s.price === '' || s.price === undefined || s.price === null ? 0 : Number(s.price),
        originalPrice: s.originalPrice === '' || s.originalPrice === undefined || s.originalPrice === null ? undefined : Number(s.originalPrice),
        stock: s.stock === '' || s.stock === undefined || s.stock === null ? 0 : Number(s.stock),
      }));

    if (validSizes.length === 0) {
      setStatusMessage('Please add at least one size variant.');
      toast.error('Add at least one size variant with a name.', { title: 'Size Required' });
      setActiveTab('pricing');
      return;
    }

    try {
      const finalCollection = isCustomCollection ? customCollectionInput.trim() : formData.collection;

      // Derive product-level price from lowest-priced size (or from field if no sizes)
      const lowestSizePrice = validSizes.length > 0
        ? Math.min(...validSizes.map((s) => s.price))
        : Number(formData.price || 0);
      const totalSizeStock = validSizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0);

      const payload = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        description: formData.description.trim() || 'Pure concentrated royal attar of distinction.',
        category: selectedCategory,
        fragranceFamily: formData.notes?.[0] || formData.fragranceFamily || 'Oudh',
        gender: formData.gender,
        collection: finalCollection,
        notes: formData.notes,
        occasions: formData.occasions,
        price: lowestSizePrice > 0 ? lowestSizePrice : 999,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: totalSizeStock,
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
        sizes: validSizes,
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

  // Filter products by category and gender
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

  // Helper: get lowest price from sizes or fallback to product price
  const getFromPrice = (p: Product) => {
    if (p.sizes && p.sizes.length > 0) {
      return Math.min(...p.sizes.map((s) => s.price));
    }
    return p.price;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[13px] text-slate-500 font-medium">
              No. of Products: {products.length}
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-slate-50 hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md shadow-emerald-700/25 border border-emerald-500/40 active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>Create New Products</span>
        </button>
      </div>

      {/* Feedback Alert */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex justify-between items-center shadow-xs animate-in fade-in">
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, notes, or collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder-slate-400 font-poppins"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            key="All"
            onClick={() => setSelectedCategoryFilter('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategoryFilter === 'All'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm font-extrabold ring-1 ring-emerald-500/40'
                : 'bg-white border border-slate-300 text-slate-800 hover:text-slate-950 hover:bg-slate-100 shadow-xs'
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm font-extrabold ring-1 ring-emerald-500/40'
                    : 'bg-white border border-slate-300 text-slate-800 hover:text-slate-950 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Products Table ─── */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/90 overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="md:hidden px-4 py-1.5 text-[10px] text-emerald-700 bg-emerald-50 flex items-center justify-between border-b border-slate-200">
          <span>Scroll horizontally for full metrics</span>
          <span className="font-mono text-[11px]">&rarr;</span>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200/80 text-[10px]">
              <tr>
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Collection</th>
                <th className="p-4">Sizes & Stock</th>
                <th className="p-4">Price</th>
                <th className="p-4">Flags</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      <span>Loading flacon catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition-colors group">
                    {/* Product name + image */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-11 h-13 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 shadow-xs" style={{ width: 44, height: 52 }}>
                          <Image
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800'}
                            alt={p.name}
                            fill
                            sizes="44px"
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-sm leading-tight truncate max-w-[180px]">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">/{p.slug}</p>
                          {p.notes && p.notes.length > 0 && (
                            <p className="text-[10px] text-emerald-700 mt-0.5 line-clamp-1 font-medium">
                              {p.notes.slice(0, 3).join(' · ')}
                            </p>
                          )}
                          {/* Size count badge */}
                          {p.sizes && p.sizes.length > 0 && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                              <Boxes className="w-2.5 h-2.5" />
                              {p.sizes.length} size{p.sizes.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap">
                        {p.category?.name || 'Unassigned'}
                      </span>
                    </td>

                    {/* Collection */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 text-xs truncate max-w-[140px]">
                          {p.collection || 'Standard Series'}
                        </p>
                        {p.occasions && p.occasions.length > 0 && (
                          <span className="text-[10px] text-slate-400 truncate block">
                            {p.occasions[0]}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Sizes & Stock — per-size chips */}
                    <td className="p-4">
                      {p.sizes && p.sizes.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {p.sizes.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-1.5">
                              <span
                                className="size-badge px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 !text-white whitespace-nowrap shadow-xs"
                                style={{ color: '#FFFFFF', backgroundColor: '#0F172A' }}
                              >
                                {s.size}
                              </span>
                              {s.stock <= 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                                  Out of stock
                                </span> 
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  {s.stock} pcs Available
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock <= 0
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.stock <= 0 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                          {p.stock <= 0 ? 'OUT' : `${p.stock} pcs`}
                        </span>
                      )}
                    </td>

                    {/* Price — "from ₹X" */}
                    <td className="p-4">
                      <div>
                        {p.sizes && p.sizes.length > 0 ? (
                          <>
                            <p className="text-[10px] text-slate-400 font-medium mb-0.5">from</p>
                            <p className="font-poppins font-bold text-emerald-700 text-sm leading-none">
                              {formatPrice(getFromPrice(p))}
                            </p>
                            {p.sizes.length > 1 && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                up to {formatPrice(Math.max(...p.sizes.map((s) => s.price)))}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-poppins font-bold text-emerald-700 text-sm">
                              {formatPrice(p.price)}
                            </p>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <p className="text-[10px] text-slate-400 line-through">
                                {formatPrice(p.originalPrice)}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </td>

                    {/* Flags */}
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 whitespace-nowrap">
                            ★ Featured
                          </span>
                        )}
                        {p.isBestSeller && (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-800 border border-purple-200 whitespace-nowrap">
                            🔥 Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingProduct(p)}
                          className="p-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 shadow-xs transition-colors cursor-pointer"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="p-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-xs transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          className="p-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300 shadow-xs transition-colors cursor-pointer"
                          title="Delete product"
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

      {/* ─── QUICK VIEW MODAL ─── */}
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

              <div className="sm:col-span-2 space-y-4">
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">{viewingProduct.name}</h2>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    {viewingProduct.tagline || 'Concentrated Royal Attar Extract'}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xl font-extrabold text-white font-poppins">
                    from {formatPrice(getFromPrice(viewingProduct))}
                  </span>
                  {viewingProduct.stock <= 0 ? (
                    <span className="text-[10px] bg-rose-950/80 text-rose-300 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/40 uppercase tracking-wider">
                      OUT OF STOCK
                    </span>
                  ) : (
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {viewingProduct.stock} in stock
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {viewingProduct.collection && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#11221C] text-emerald-300 border border-emerald-500/30">
                      Series: {viewingProduct.collection}
                    </span>
                  )}
                </div>

                {viewingProduct.notes && viewingProduct.notes.length > 0 && (
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-400">Storefront Notes</p>
                    <div className="flex flex-wrap gap-1">
                      {viewingProduct.notes.map((n) => (
                        <span key={n} className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-[#0E1815] border border-[#1E332B] space-y-2 text-xs">
                  <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-400">Olfactory Architecture</p>
                  <div className="space-y-1 text-neutral-300">
                    <p><strong className="text-white font-semibold">Top:</strong>{' '}{viewingProduct.fragranceNotes?.topNotes?.join(', ') || 'N/A'}</p>
                    <p><strong className="text-white font-semibold">Heart:</strong>{' '}{viewingProduct.fragranceNotes?.heartNotes?.join(', ') || 'N/A'}</p>
                    <p><strong className="text-white font-semibold">Base:</strong>{' '}{viewingProduct.fragranceNotes?.baseNotes?.join(', ') || 'N/A'}</p>
                  </div>
                </div>

                {/* Size Variants */}
                {viewingProduct.sizes?.length > 0 && (
                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-[11px] uppercase tracking-wider text-neutral-400">Size Variants & Pricing</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {viewingProduct.sizes.map((s, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-[#1E332B] bg-[#070D0B]">
                          <p className="font-bold text-white text-sm">{s.size}</p>
                          <p className="font-poppins font-bold text-emerald-400">{formatPrice(s.price)}</p>
                          {s.originalPrice && s.originalPrice > s.price && (
                            <p className="text-[10px] text-neutral-500 line-through">{formatPrice(s.originalPrice)}</p>
                          )}
                          {s.stock <= 0 ? (
                            <p className="text-[10px] text-rose-400 font-semibold mt-0.5">Out of stock</p>
                          ) : (
                            <p className="text-[10px] text-emerald-500 mt-0.5">{s.stock} in stock</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs text-neutral-300 bg-[#0E1815] p-4 rounded-2xl border border-[#1E332B] leading-relaxed">
              {viewingProduct.description}
            </div>

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

      {/* ─── CREATE & EDIT MODAL ─── */}
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

            {/* Tabs */}
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

                {/* ── TAB 1: BASICS ── */}
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

                    <div className="sm:col-span-2">
                      <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                        Category *
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

                    {/* Collection */}
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
                        Description *
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

                {/* ── TAB 2: PRICING & SIZE VARIANTS ── */}
                {activeTab === 'pricing' && (
                  <div className="space-y-5 animate-in fade-in">
                    {/* Header explanation */}
                    <div className="p-3.5 rounded-2xl bg-emerald-900 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
                      <Boxes className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                      <div>
                        <p className="font-bold">Size Variants with Individual Pricing</p>
                        <p className="text-emerald-400/70 mt-0.5">
                          Add each size (e.g. 3ml, 6ml, 12ml, 50ml EDP) manually. Set the base price, original/compare price, and stock for each variant separately.
                        </p>
                      </div>
                    </div>

                    {/* Column Headers */}
                    <div className="grid grid-cols-12 gap-2 px-1">
                      <div className="col-span-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Size Name</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Base Price (₹)</span>
                      </div>
                      <div className="col-span-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Orig. Price (₹)</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Stock</span>
                      </div>
                      <div className="col-span-1" />
                    </div>

                    {/* Size Rows */}
                    <div className="space-y-2">
                      {formData.sizes.map((sv, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-12 gap-2 items-center p-3 rounded-2xl bg-[#0E1815] border border-[#1E332B] animate-in fade-in"
                        >
                          {/* Size Name */}
                          <div className="col-span-3">
                            <input
                              type="text"
                              placeholder="e.g. 3ml"
                              value={sv.size}
                              onChange={(e) => handleSizeChange(idx, 'size', e.target.value)}
                              className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-bold text-xs"
                            />
                          </div>

                          {/* Base Price */}
                          <div className="col-span-3">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">₹</span>
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={sv.price !== undefined && sv.price !== null ? sv.price : ''}
                                onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                                className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl pl-7 pr-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-poppins font-bold text-xs"
                              />
                            </div>
                          </div>

                          {/* Original Price */}
                          <div className="col-span-3">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs font-bold">₹</span>
                              <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={sv.originalPrice !== undefined && sv.originalPrice !== null ? sv.originalPrice : ''}
                                onChange={(e) => handleSizeChange(idx, 'originalPrice', e.target.value)}
                                className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl pl-7 pr-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500/40 font-poppins text-xs"
                              />
                            </div>
                          </div>

                          {/* Stock */}
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={sv.stock !== undefined && sv.stock !== null ? sv.stock : ''}
                              onChange={(e) => handleSizeChange(idx, 'stock', e.target.value)}
                              className="w-full bg-[#070D0B] border border-[#1E332B] rounded-xl px-3 py-2 text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-bold text-xs"
                            />
                          </div>

                          {/* Remove */}
                          <div className="col-span-1 flex justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveSize(idx)}
                              disabled={formData.sizes.length === 1}
                              className="p-1 text-neutral-600 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              title="Remove size"
                            >
                              <MinusCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Size Button */}
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-emerald-500/40 text-emerald-400 hover:bg-emerald-900 hover:text-black hover:border-emerald-900 transition-all text-xs font-bold"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Another Size Variant
                    </button>

                    {/* Summary */}
                    {formData.sizes.filter((s) => s.size.trim()).length > 0 && (
                      <div className="p-3.5 rounded-2xl bg-[#0E1815] border border-[#1E332B] text-xs">
                        <p className="font-bold text-[10px] uppercase tracking-wider text-neutral-400 mb-2">Variant Summary</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.sizes
                            .filter((s) => s.size.trim())
                            .map((s, i) => (
                              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#070D0B] border border-[#1E332B]">
                                <span className="font-bold text-white">{s.size}</span>
                                <span className="text-emerald-400 font-poppins font-bold">₹{s.price}</span>
                                {s.originalPrice > 0 && (
                                  <span className="text-neutral-500 line-through text-[10px]">₹{s.originalPrice}</span>
                                )}
                                <span className="text-[10px] text-neutral-500">· {s.stock} pcs</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TAB 3: SCENT PYRAMID ── */}
                {activeTab === 'olfactory' && (
                  <div className="space-y-6 animate-in fade-in">
                    {/* Scent Notes Filter Chips */}
                    <div className="p-4 rounded-2xl bg-[#0E1815] border border-[#1E332B] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Fragrance Notes (Storefront Filter)</span>
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            Click to toggle notes matching customer search preferences
                          </p>
                        </div>
                        <span className="text-[10px] font-mono bg-[#070D0B] px-2 py-0.5 rounded text-neutral-400 border border-[#1E332B]">
                          {formData.notes.length} Selected
                        </span>
                      </div>

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

                      <div className="flex gap-2 pt-2 border-t border-[#1E332B]">
                        <input
                          type="text"
                          placeholder="Add custom note (e.g. Smoky Cardamom, White Amber)..."
                          value={customNoteInput}
                          onChange={(e) => setCustomNoteInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); handleAddCustomNote(); }
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

                      {formData.notes.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {formData.notes.map((note) => (
                            <span
                              key={note}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                            >
                              {note}
                              <button type="button" onClick={() => handleToggleNote(note)} className="hover:text-rose-400 p-0.5">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Occasions */}
                    <div className="p-4 rounded-2xl bg-[#0E1815] border border-[#1E332B] space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-rose-400" />
                            <span>Recommended Occasions</span>
                          </p>
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            Categorize which lifestyle occasions this fragrance is recommended for
                          </p>
                        </div>
                        <span className="text-[10px] font-mono bg-[#070D0B] px-2 py-0.5 rounded text-neutral-400 border border-[#1E332B]">
                          {formData.occasions.length} Selected
                        </span>
                      </div>

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

                      <div className="flex gap-2 pt-2 border-t border-[#1E332B]">
                        <input
                          type="text"
                          placeholder="Add custom occasion..."
                          value={customOccasionInput}
                          onChange={(e) => setCustomOccasionInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') { e.preventDefault(); handleAddCustomOccasion(); }
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

                      {formData.occasions.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {formData.occasions.map((occ) => (
                            <span
                              key={occ}
                              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/30"
                            >
                              {occ}
                              <button type="button" onClick={() => handleToggleOccasion(occ)} className="hover:text-rose-400 p-0.5">
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Scent Pyramid */}
                    <div className="space-y-4 pt-2 border-t border-[#1E332B]">
                      <div>
                        <label className="block text-neutral-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                          Top Notes (First 15–30 Mins)
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
                          Heart Notes (2–6 Hours)
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

                {/* ── TAB 4: MEDIA & BADGES ── */}
                {activeTab === 'media' && (
                  <div className="space-y-5 animate-in fade-in">
                    <AdminImageUpload
                      value={formData.image}
                      onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                      label="Product Flacon Image (Upload directly to Cloudinary)"
                      folder="attar-depot/products"
                    />

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

              {/* Sticky Footer Buttons */}
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
                      ← Previous
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
                        ? 'Saving...'
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
