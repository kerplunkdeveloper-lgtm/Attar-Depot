'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Edit,
  Sparkles,
  X,
  Layers,
  Search,
  Droplets,
  Eye,
  ChevronRight,
  Calendar,
  ExternalLink,
  LayoutGrid,
  List,
  ArrowUpDown,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  XCircle,
  Package,
  Star,
  CheckSquare,
  Square,
  Sparkle,
} from 'lucide-react';
import {
  useAdminCategories,
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
  useAdminToggleCategoryFeatured,
  useAdminBulkDeleteCategories,
  useAdminSeedDefaultCategories,
} from '@/hooks/useAdmin';
import {
  useAdminTaxonomy,
  useAdminCreateCollection,
  useAdminUpdateCollection,
  useAdminDeleteCollection,
  useAdminCreateNote,
  useAdminUpdateNote,
  useAdminDeleteNote,
  useAdminCreateOccasion,
  useAdminUpdateOccasion,
  useAdminDeleteOccasion,
} from '@/hooks/useTaxonomy';
import { Category, Collection, FragranceNote, Occasion } from '@/types';
import { toast } from '@/lib/toast';
import AdminImageUpload from '@/components/admin/AdminImageUpload';
import { useAdminTheme } from '@/context/AdminThemeContext';

type TabType = 'categories' | 'collections' | 'notes' | 'occasions' | 'preview';
type StatusFilter = 'all' | 'featured';
type SortOption = 'name-asc' | 'name-desc' | 'most-products' | 'newest' | 'oldest';
type ViewMode = 'grid' | 'table';

// Auto-slugify helper
const slugify = (text: string) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function AdminCatalogTaxonomyPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<TabType>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedNoteFamily, setSelectedNoteFamily] = useState('All');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<(Category & { productCount?: number }) | null>(null);
  const [isCustomSlug, setIsCustomSlug] = useState(false);

  // Safe Delete Modal state
  const [categoryToDelete, setCategoryToDelete] = useState<(Category & { productCount?: number }) | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<FragranceNote | null>(null);

  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);

  // Queries
  const {
    data: adminCatResponse,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = useAdminCategories({
    search: searchTerm,
    status: statusFilter === 'featured' ? 'all' : statusFilter,
    sort: sortBy,
  });

  const rawCategories = adminCatResponse?.categories || [];

  const { data: taxonomyData, isLoading: isTaxonomyLoading } = useAdminTaxonomy();

  const collections = taxonomyData?.collections || [];
  const notes = taxonomyData?.notes || [];
  const occasions = taxonomyData?.occasions || [];

  // Note Families extracted dynamically from database notes
  const dynamicNoteFamilies = useMemo(() => {
    const familiesSet = new Set<string>();
    notes.forEach((n) => {
      if (n.family && n.family.trim()) familiesSet.add(n.family.trim());
    });
    return ['All', ...Array.from(familiesSet)];
  }, [notes]);

  // Mutations: Categories
  const createCatMutation = useAdminCreateCategory();
  const updateCatMutation = useAdminUpdateCategory();
  const deleteCatMutation = useAdminDeleteCategory();
  const toggleCatFeaturedMutation = useAdminToggleCategoryFeatured();
  const bulkDeleteCatMutation = useAdminBulkDeleteCategories();
  const seedDefaultsMutation = useAdminSeedDefaultCategories();

  // Mutations: Taxonomy
  const createColMutation = useAdminCreateCollection();
  const updateColMutation = useAdminUpdateCollection();
  const deleteColMutation = useAdminDeleteCollection();

  const createNoteMutation = useAdminCreateNote();
  const updateNoteMutation = useAdminUpdateNote();
  const deleteNoteMutation = useAdminDeleteNote();

  const createOccMutation = useAdminCreateOccasion();
  const updateOccMutation = useAdminUpdateOccasion();
  const deleteOccMutation = useAdminDeleteOccasion();

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: false,
    isActive: true,
  });

  const [collectionForm, setCollectionForm] = useState({
    name: '',
    tagline: '',
    description: '',
    featured: true,
    isActive: true,
  });

  const [noteForm, setNoteForm] = useState({
    name: '',
    family: 'Woody',
    description: '',
    isActive: true,
  });

  const [occasionForm, setOccasionForm] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  // Client-side filtering for Featured categories if chosen
  const filteredCategories = useMemo(() => {
    if (statusFilter === 'featured') {
      return rawCategories.filter((c) => !!c.featured);
    }
    return rawCategories;
  }, [rawCategories, statusFilter]);

  // Telemetry stats
  const totalCategoriesCount = rawCategories.length;
  const totalProductsLinked = rawCategories.reduce((acc, c) => acc + (c.productCount || 0), 0);

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: CATEGORIES CRUD
  // ─────────────────────────────────────────────────────────────
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setIsCustomSlug(false);
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      featured: false,
      isActive: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category & { productCount?: number }) => {
    setEditingCategory(cat);
    setIsCustomSlug(true);
    setCategoryForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      featured: !!cat.featured,
      isActive: cat.isActive !== false,
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategoryNameChange = (val: string) => {
    setCategoryForm((prev) => ({
      ...prev,
      name: val,
      slug: isCustomSlug ? prev.slug : slugify(val),
    }));
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error('Category title is required');
      return;
    }

    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim() ? slugify(categoryForm.slug) : slugify(categoryForm.name),
      description: categoryForm.description.trim(),
      image: categoryForm.image.trim(),
      featured: categoryForm.featured,
      isActive: true,
    };

    try {
      if (editingCategory) {
        await updateCatMutation.mutateAsync({
          id: editingCategory._id,
          data: payload,
        });
        toast.success(`Category "${payload.name}" updated successfully`);
      } else {
        await createCatMutation.mutateAsync(payload);
        toast.success(`Category "${payload.name}" created successfully!`);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  // Trigger safe delete modal
  const handleInitiateDeleteCategory = (cat: Category & { productCount?: number }) => {
    setCategoryToDelete(cat);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDeleteCategory = async (force: boolean = false) => {
    if (!categoryToDelete) return;
    try {
      await deleteCatMutation.mutateAsync({ id: categoryToDelete._id, force });
      toast.info(`Category "${categoryToDelete.name}" deleted successfully`);
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
      // Remove from selection if selected
      setSelectedCategoryIds((prev) => prev.filter((id) => id !== categoryToDelete._id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };


  // Quick 1-click Featured Toggle
  const handleToggleFeatured = async (cat: Category) => {
    try {
      await toggleCatFeaturedMutation.mutateAsync(cat._id);
      toast.success(
        `Category "${cat.name}" is now ${!cat.featured ? 'Featured' : 'Standard'}`
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to toggle featured');
    }
  };

  // Bulk Selection Handlers
  const handleSelectAllCategories = () => {
    if (selectedCategoryIds.length === filteredCategories.length) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds(filteredCategories.map((c) => c._id));
    }
  };

  const handleToggleSelectCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedCategoryIds.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedCategoryIds.length} category(ies)?`)) {
      return;
    }
    try {
      await bulkDeleteCatMutation.mutateAsync({ ids: selectedCategoryIds, force: true });
      toast.success(`Deleted ${selectedCategoryIds.length} categories`);
      setSelectedCategoryIds([]);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Bulk delete failed');
    }
  };

  const handleSeedDefaults = async () => {
    if (confirm('Restore sample categories into your catalog?')) {
      try {
        await seedDefaultsMutation.mutateAsync();
        toast.success('Sample categories restored successfully!');
      } catch (err: any) {
        toast.error('Failed to restore sample categories');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: COLLECTIONS CRUD
  // ─────────────────────────────────────────────────────────────
  const handleOpenCreateCollection = () => {
    setEditingCollection(null);
    setCollectionForm({
      name: '',
      tagline: '',
      description: '',
      featured: true,
      isActive: true,
    });
    setIsCollectionModalOpen(true);
  };

  const handleOpenEditCollection = (col: Collection) => {
    setEditingCollection(col);
    setCollectionForm({
      name: col.name || '',
      tagline: col.tagline || '',
      description: col.description || '',
      featured: !!col.featured,
      isActive: col.isActive !== false,
    });
    setIsCollectionModalOpen(true);
  };

  const handleSaveCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionForm.name.trim()) {
      toast.error('Collection title is required');
      return;
    }

    try {
      if (editingCollection) {
        await updateColMutation.mutateAsync({
          id: editingCollection._id,
          data: collectionForm,
        });
        toast.success(`Collection "${collectionForm.name}" updated!`);
      } else {
        await createColMutation.mutateAsync(collectionForm);
        toast.success(`Collection "${collectionForm.name}" published!`);
      }
      setIsCollectionModalOpen(false);
      setEditingCollection(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save collection');
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (confirm(`Remove collection "${name}" from store catalog?`)) {
      try {
        await deleteColMutation.mutateAsync(id);
        toast.info(`Collection "${name}" removed`);
      } catch (err) {
        toast.error('Failed to remove collection');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: FRAGRANCE NOTES
  // ─────────────────────────────────────────────────────────────
  const handleOpenCreateNote = () => {
    setEditingNote(null);
    setNoteForm({
      name: '',
      family: selectedNoteFamily !== 'All' ? selectedNoteFamily : 'Woody',
      description: '',
      isActive: true,
    });
    setIsNoteModalOpen(true);
  };

  const handleOpenEditNote = (note: FragranceNote) => {
    setEditingNote(note);
    setNoteForm({
      name: note.name || '',
      family: note.family || 'Woody',
      description: note.description || '',
      isActive: note.isActive !== false,
    });
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteForm.name.trim()) {
      toast.error('Note name is required');
      return;
    }

    try {
      if (editingNote) {
        await updateNoteMutation.mutateAsync({
          id: editingNote._id,
          data: noteForm,
        });
        toast.success(`Fragrance note "${noteForm.name}" updated!`);
      } else {
        await createNoteMutation.mutateAsync(noteForm);
        toast.success(`Fragrance note "${noteForm.name}" created!`);
      }
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    }
  };

  const handleDeleteNote = async (id: string, name: string) => {
    if (confirm(`Delete fragrance note "${name}"?`)) {
      try {
        await deleteNoteMutation.mutateAsync(id);
        toast.info(`Note "${name}" deleted`);
      } catch (err) {
        toast.error('Failed to delete note');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: OCCASIONS
  // ─────────────────────────────────────────────────────────────
  const handleOpenCreateOccasion = () => {
    setEditingOccasion(null);
    setOccasionForm({
      name: '',
      description: '',
      isActive: true,
    });
    setIsOccasionModalOpen(true);
  };

  const handleOpenEditOccasion = (occ: Occasion) => {
    setEditingOccasion(occ);
    setOccasionForm({
      name: occ.name || '',
      description: occ.description || '',
      isActive: occ.isActive !== false,
    });
    setIsOccasionModalOpen(true);
  };

  const handleSaveOccasion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!occasionForm.name.trim()) {
      toast.error('Occasion name is required');
      return;
    }

    try {
      if (editingOccasion) {
        await updateOccMutation.mutateAsync({
          id: editingOccasion._id,
          data: occasionForm,
        });
        toast.success(`Occasion "${occasionForm.name}" updated!`);
      } else {
        await createOccMutation.mutateAsync(occasionForm);
        toast.success(`Occasion "${occasionForm.name}" created!`);
      }
      setIsOccasionModalOpen(false);
      setEditingOccasion(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save occasion');
    }
  };

  const handleDeleteOccasion = async (id: string, name: string) => {
    if (confirm(`Delete occasion "${name}"?`)) {
      try {
        await deleteOccMutation.mutateAsync(id);
        toast.info(`Occasion "${name}" removed`);
      } catch (err) {
        toast.error('Failed to remove occasion');
      }
    }
  };

  // Filtered collections, notes, occasions
  const filteredCollections = useMemo(() => {
    return collections.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.tagline || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchesSearch =
        n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (n.family || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFamily =
        selectedNoteFamily === 'All' || n.family === selectedNoteFamily;
      return matchesSearch && matchesFamily;
    });
  }, [notes, searchTerm, selectedNoteFamily]);

  const filteredOccasions = useMemo(() => {
    return occasions.filter(
      (o) =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [occasions, searchTerm]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
     

      {/* ─── 2. TELEMETRY BADGES BAR ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
        {[
          {
            title: 'Categories',
            count: totalCategoriesCount,
            sub: `${totalProductsLinked} Products linked`,
            icon: Layers,
            color: 'text-emerald-400',
            bg: isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]',
            tab: 'categories' as TabType,
          },
          {
            title: 'Collections',
            count: collections.length,
            sub: 'Featured royal series',
            icon: Sparkles,
            color: 'text-amber-400',
            bg: isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]',
            tab: 'collections' as TabType,
          },
          {
            title: 'Fragrance Notes',
            count: notes.length,
            sub: 'Olfactory accords in vault',
            icon: Droplets,
            color: 'text-teal-400',
            bg: isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]',
            tab: 'notes' as TabType,
          },
          {
            title: 'Occasions',
            count: occasions.length,
            sub: 'Scent pairing moments',
            icon: Calendar,
            color: 'text-sky-400',
            bg: isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]',
            tab: 'occasions' as TabType,
          },
        ].map((item) => {
          const Icon = item.icon;
          const isCurrent = activeTab === item.tab;
          return (
            <button
              key={item.title}
              onClick={() => {
                setActiveTab(item.tab);
                setSearchTerm('');
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all ${item.bg} ${
                isCurrent
                  ? 'ring-2 ring-emerald-500 shadow-md scale-[1.01]'
                  : 'hover:border-emerald-500/40 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold truncate ${
                    isLight ? 'text-slate-500' : 'text-neutral-400'
                  }`}
                >
                  {item.title}
                </span>
                <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
              </div>
              <p
                className={`text-xl font-bold font-serif mt-1 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {item.count}
              </p>
              <p
                className={`text-[10px] mt-0.5 truncate ${
                  isLight ? 'text-slate-500' : 'text-neutral-500'
                }`}
              >
                {item.sub}
              </p>
            </button>
          );
        })}
      </div>


 {/* ─── 1. TOP HEADER ─── */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b ${
          isLight ? 'border-slate-200' : 'border-[#1E332B]'
        }`}
      >

        <div></div>
       

        {/* Dynamic Action Button Per Tab */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {activeTab === 'categories' && (
            <button
              onClick={handleOpenCreateCategory}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md shadow-emerald-700/25 border border-emerald-500/40 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>New Category</span>
            </button>
          )}

          {activeTab === 'collections' && (
            <button
              onClick={handleOpenCreateCollection}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md shadow-emerald-700/25 border border-emerald-500/40 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Add Collection</span>
            </button>
          )}

          {activeTab === 'notes' && (
            <button
              onClick={handleOpenCreateNote}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md shadow-emerald-700/25 border border-emerald-500/40 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>New Fragrance Note</span>
            </button>
          )}

          {activeTab === 'occasions' && (
            <button
              onClick={handleOpenCreateOccasion}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md shadow-emerald-700/25 border border-emerald-500/40 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>New Occasion</span>
            </button>
          )}

          {activeTab === 'preview' && (
            <Link
              href="/shop"
              target="_blank"
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-500 hover:to-teal-600 transition-all shadow-md shadow-emerald-700/25 border border-emerald-500/40 active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              <span>Open Storefront Shop</span>
            </Link>
          )}
        </div>
      </div>









      {/* ─── 3. TABS NAVIGATION ─── */}
      <div
        className={`border-b ${
          isLight ? 'border-slate-200' : 'border-[#1E332B]'
        }`}
      >
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar pb-0.5">
          {[
            { id: 'categories', label: 'Categories', count: totalCategoriesCount, icon: Layers },
            { id: 'collections', label: 'Collections', count: collections.length, icon: Sparkles },
            { id: 'notes', label: 'Fragrance Notes', count: notes.length, icon: Droplets },
            { id: 'occasions', label: 'Occasions', count: occasions.length, icon: Calendar },
            { id: 'preview', label: 'Live Navbar Mega-Menu Preview', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 -mb-[2px] whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'border-emerald-600 text-emerald-800 bg-emerald-50/90 rounded-t-xl shadow-xs'
                      : 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-xl'
                    : isLight
                    ? 'border-transparent text-slate-700 hover:text-slate-950 font-bold hover:bg-slate-50'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isActive
                        ? isLight
                          ? 'bg-emerald-200 text-emerald-950 font-black'
                          : 'bg-emerald-500/20 text-emerald-300'
                        : isLight
                        ? 'bg-slate-200 text-slate-800 font-extrabold'
                        : 'bg-[#15231F] text-neutral-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 4. SEARCH & FILTER CONTROLS TOOLBAR ─── */}
      {activeTab !== 'preview' && (
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="max-w-md w-full relative">
              <Search
                className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  isLight ? 'text-slate-400' : 'text-neutral-500'
                }`}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab} by name or description...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 font-poppins shadow-inner ${
                  isLight
                    ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                    : 'bg-[#0A1210] border-[#1E332B] text-white placeholder-neutral-500'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* If on Categories Tab: Status Filters, Sorting & View Toggles */}
            {activeTab === 'categories' && (
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Category Filter Pills */}
                <div
                  className={`flex items-center p-1 rounded-xl border ${
                    isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#0E1715] border-[#1E332B]'
                  }`}
                >
                  {(['all', 'featured'] as StatusFilter[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isLight
                          ? 'text-slate-600 hover:text-slate-900'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st === 'all' ? 'All' : 'Featured'}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown
                    className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className={`text-xs py-1.5 px-2.5 rounded-xl border font-medium focus:outline-none focus:border-emerald-500 cursor-pointer ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-[#0E1715] border-[#1E332B] text-neutral-200'
                    }`}
                  >
                    <option value="name-asc">Name (A → Z)</option>
                    <option value="name-desc">Name (Z → A)</option>
                    <option value="most-products">Most Products</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Grid / Table View Mode Switcher */}
                <div
                  className={`flex items-center p-1 rounded-xl border ${
                    isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]'
                  }`}
                >
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isLight
                        ? 'text-slate-400 hover:text-slate-800'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                    title="Grid Card View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isLight
                        ? 'text-slate-400 hover:text-slate-800'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                    title="Table List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* If on Notes Tab: Dynamic Family Filter Pills */}
            {activeTab === 'notes' && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {dynamicNoteFamilies.map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedNoteFamily(fam)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedNoteFamily === fam
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold shadow-sm shadow-emerald-700/25 ring-1 ring-emerald-500/40'
                        : isLight
                        ? 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 hover:text-slate-950 font-bold shadow-xs'
                        : 'bg-[#0D1815] border border-[#1E332B] text-neutral-300 hover:text-white'
                    }`}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bulk Actions Floating Bar for Categories */}
          {activeTab === 'categories' && filteredCategories.length > 0 && (
            <div
              className={`flex items-center justify-between px-4 py-2 rounded-xl border text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0C1513] border-[#1E332B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSelectAllCategories}
                  className="flex items-center gap-1.5 font-bold cursor-pointer text-emerald-600 hover:text-emerald-700"
                >
                  {selectedCategoryIds.length === filteredCategories.length ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  <span>
                    {selectedCategoryIds.length === filteredCategories.length
                      ? 'Deselect All'
                      : `Select All (${filteredCategories.length})`}
                  </span>
                </button>
                {selectedCategoryIds.length > 0 && (
                  <span
                    className={`font-semibold ${
                      isLight ? 'text-slate-600' : 'text-neutral-400'
                    }`}
                  >
                    {selectedCategoryIds.length} selected
                  </span>
                )}
              </div>

              {selectedCategoryIds.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── 5. TAB CONTENT: CATEGORIES ─── */}
      {activeTab === 'categories' && (
        <div className="space-y-4 animate-in fade-in">
          {isCategoriesLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-neutral-500">Loading live categories from database...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div
              className={`rounded-3xl border p-12 text-center space-y-4 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0A1210] border-[#1E332B]'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Layers className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3
                  className={`font-serif text-lg font-bold ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {searchTerm
                    ? `No categories match "${searchTerm}"`
                    : 'No Categories in Database'}
                </h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  {searchTerm
                    ? 'Try adjusting your search terms or clearing your status filter.'
                    : 'All categories have been removed. Categories will NOT reappear automatically. Click "New Category" to create your first dynamic category.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleOpenCreateCategory}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-emerald-700/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create First Category</span>
                </button>
                {!searchTerm && (
                  <button
                    onClick={handleSeedDefaults}
                    disabled={seedDefaultsMutation.isPending}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer transition-all ${
                      isLight
                        ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                        : 'border-[#1E332B] text-neutral-300 hover:bg-[#13221E]'
                    }`}
                    title="Restore standard sample categories into database"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{seedDefaultsMutation.isPending ? 'Restoring...' : 'Restore Sample Categories'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            /* ── GRID CARD VIEW ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat._id);
                return (
                  <div
                    key={cat._id}
                    className={`rounded-2xl overflow-hidden border relative flex flex-col justify-between min-h-[380px] shadow-2xl transition-all duration-300 group ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 border-emerald-500'
                        : isLight
                        ? 'border-slate-300/80 hover:border-emerald-500/60 shadow-slate-200/60'
                        : 'border-[#1E332B] hover:border-emerald-500/50'
                    }`}
                  >
                    {/* Full Card Background Image */}
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0B1A16] via-[#04332A] to-[#0A1210] text-neutral-400">
                        <Layers className="w-16 h-16 text-emerald-400/30 mb-2" />
                        <span className="text-xs uppercase font-mono tracking-wider text-emerald-300/60">
                          No Image Set
                        </span>
                      </div>
                    )}

                    {/* Gradient Overlay for Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

                    {/* Top Row: Checkbox, Slug & Featured Badge */}
                    <div className="relative z-10 p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleSelectCategory(cat._id)}
                          className="p-1.5 rounded-xl bg-black/80 backdrop-blur-md text-slate-50 hover:bg-black transition-all cursor-pointer border border-white/25 shadow-md"
                          title={isSelected ? 'Deselect' : 'Select'}
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-white" />
                          )}
                        </button>

                        {/* Slug badge */}
                        <span className="text-[11px] font-mono bg-black/80 border border-white/25 px-2.5 py-1 rounded-full text-emerald-300 font-bold backdrop-blur-md shadow-md">
                          /{cat.slug}
                        </span>
                      </div>

                      {/* Quick Featured Toggle Button */}
                      <button
                        onClick={() => handleToggleFeatured(cat)}
                        className={`text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg transition-all cursor-pointer backdrop-blur-md border ${
                          cat.featured
                            ? 'bg-amber-400 text-neutral-950 border-amber-300 ring-2 ring-amber-400/40'
                            : 'bg-black/80 text-neutral-200 border-white/25 hover:text-amber-300 hover:border-amber-300/50'
                        }`}
                        title="Click to toggle featured"
                      >
                        <Star className={`w-3.5 h-3.5 ${cat.featured ? 'fill-neutral-950 text-neutral-950' : 'text-neutral-300'}`} />
                        <span>{cat.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </div>

                    {/* Bottom Content & Controls (Overlaid) */}
                    <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-14">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3
                            className="category-card-title font-serif text-xl sm:text-xl font-black !text-yellow-400 text-yellow-400 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,1)]"
                            style={{ color: '#FACC15' }}
                          >
                            {cat.name}
                          </h3>

                          {/* Dynamic Products Count Badge */}
                          <Link
                            href={`/admin/products?category=${cat.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 shadow-md backdrop-blur-md hover:bg-emerald-900 transition-colors flex-shrink-0"
                            title="View products in this category"
                          >
                            <Package className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{cat.productCount || 0} Products</span>
                          </Link>
                        </div>

                        {/* Description */}
                        {cat.description && (
                          <p className="text-xs text-neutral-200 mt-1.5 line-clamp-2 leading-relaxed drop-shadow-sm font-medium">
                            {cat.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Actions */}
                      <div className="pt-3 border-t border-white/20 flex justify-end items-center text-xs">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditCategory(cat)}
                            className="p-2 rounded-xl bg-white text-slate-900 hover:bg-emerald-500 hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center border border-white"
                            title="Edit category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleInitiateDeleteCategory(cat)}
                            className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 transition-all shadow-md cursor-pointer flex items-center justify-center border border-rose-500"
                            title="Delete category"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── HIGH-DENSITY TABLE VIEW ── */
            <div
              className={`rounded-3xl border overflow-hidden shadow-xl ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0A1210] border-[#1E332B]'
              }`}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead
                    className={`border-b uppercase tracking-wider text-[10px] font-bold ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#0E1715] border-[#1E332B] text-neutral-400'
                    }`}
                  >
                    <tr>
                      <th className="py-3.5 px-4 w-10">
                        <button
                          onClick={handleSelectAllCategories}
                          className="cursor-pointer text-emerald-600"
                        >
                          {selectedCategoryIds.length === filteredCategories.length ? (
                            <CheckSquare className="w-4 h-4" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Slug</th>
                      <th className="py-3.5 px-4">Products</th>
                      <th className="py-3.5 px-4">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${
                      isLight ? 'divide-slate-100' : 'divide-[#1E332B]'
                    }`}
                  >
                    {filteredCategories.map((cat) => {
                      const isSelected = selectedCategoryIds.includes(cat._id);
                      return (
                        <tr
                          key={cat._id}
                          className={`transition-colors ${
                            isSelected
                              ? isLight
                                ? 'bg-emerald-50/60'
                                : 'bg-emerald-950/20'
                              : isLight
                              ? 'hover:bg-slate-50/80'
                              : 'hover:bg-[#0F1916]'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleSelectCategory(cat._id)}
                              className="cursor-pointer text-emerald-600"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4 text-neutral-400" />
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
                                {cat.image ? (
                                  <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-500">
                                    <Layers className="w-5 h-5 text-emerald-500/40" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p
                                  className={`font-serif font-bold text-sm ${
                                    isLight ? 'text-slate-900' : 'text-white'
                                  }`}
                                >
                                  {cat.name}
                                </p>
                                <p
                                  className={`text-[11px] line-clamp-1 max-w-xs ${
                                    cat.description
                                      ? isLight
                                        ? 'text-slate-500'
                                        : 'text-neutral-400'
                                      : 'text-neutral-500 italic'
                                  }`}
                                >
                                  {cat.description || 'No description provided.'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              /{cat.slug}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <Link
                              href={`/admin/products?category=${cat.slug}`}
                              className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-lg border text-[11px] transition-colors ${
                                isLight
                                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                                  : 'bg-[#15231F] border-[#1E332B] text-emerald-400 hover:bg-emerald-950/40'
                              }`}
                            >
                              <Package className="w-3 h-3 text-emerald-500" />
                              <span>{cat.productCount || 0} Products</span>
                            </Link>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleFeatured(cat)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                cat.featured
                                  ? 'bg-amber-400 text-neutral-950'
                                  : isLight
                                  ? 'bg-slate-100 text-slate-500 hover:text-amber-600'
                                  : 'bg-neutral-800 text-neutral-400 hover:text-amber-300'
                              }`}
                            >
                              <Star className={`w-3 h-3 ${cat.featured ? 'fill-neutral-950' : ''}`} />
                              <span>{cat.featured ? 'Featured' : 'Standard'}</span>
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditCategory(cat)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isLight
                                    ? 'border-slate-300 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
                                    : 'border-[#1E332B] text-neutral-300 hover:text-emerald-300 hover:bg-[#13221E]'
                                }`}
                                title="Edit category"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleInitiateDeleteCategory(cat)}
                                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                  isLight
                                    ? 'border-slate-300 text-slate-700 hover:text-rose-700 hover:bg-rose-50'
                                    : 'border-[#1E332B] text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30'
                                }`}
                                title="Delete category"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── 6. TAB CONTENT: COLLECTIONS ─── */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {isTaxonomyLoading ? (
            <p className="text-xs text-neutral-500 col-span-3 py-12 text-center">
              Loading royal fragrance collections...
            </p>
          ) : filteredCollections.length === 0 ? (
            <div
              className={`rounded-3xl border p-12 text-center col-span-3 space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0A1210] border-[#1E332B]'
              }`}
            >
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <p
                className={`text-sm font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                No collections found matching "{searchTerm}"
              </p>
              <button
                onClick={handleOpenCreateCollection}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-neutral-950 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Collection</span>
              </button>
            </div>
          ) : (
            filteredCollections.map((col) => (
              <div
                key={col._id}
                className={`rounded-3xl overflow-hidden border flex flex-col justify-between shadow-xl transition-all group ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-amber-500/50'
                    : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] hover:border-amber-500/40'
                }`}
              >
                {col.image ? (
                  <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute bottom-3 left-3 text-[10px] font-mono bg-[#0A1210]/90 border border-[#1E332B] px-2.5 py-0.5 rounded-full text-amber-400 font-bold backdrop-blur-md">
                      /{col.slug}
                    </span>
                    {col.featured && (
                      <span className="absolute top-3 right-3 text-[10px] bg-amber-400 text-neutral-950 font-bold px-2.5 py-0.5 rounded-full shadow-md">
                        Featured Series
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    className={`px-5 py-3.5 flex items-center justify-between border-b ${
                      isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1E332B] bg-[#0E1A16]/50'
                    }`}
                  >
                    <span className="text-[10px] font-mono bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-amber-400 font-bold">
                      /{col.slug}
                    </span>
                    <div className="flex items-center gap-2">
                      {col.featured && (
                        <span className="text-[10px] bg-amber-400 text-neutral-950 font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`font-serif text-base font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {col.name}
                    </h3>
                    {col.tagline && (
                      <p className="text-[11px] font-medium text-emerald-500 mt-0.5 italic">
                        {col.tagline}
                      </p>
                    )}
                    <p
                      className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                        col.description
                          ? isLight
                            ? 'text-slate-600'
                            : 'text-neutral-400'
                          : 'text-neutral-500 italic'
                      }`}
                    >
                      {col.description || 'No collection description provided.'}
                    </p>
                  </div>

                  <div
                    className={`pt-3 border-t flex justify-between items-center text-xs ${
                      isLight ? 'border-slate-100' : 'border-[#1E332B]'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                        col.isActive !== false ? 'text-emerald-500' : 'text-neutral-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          col.isActive !== false
                            ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                            : 'bg-neutral-500'
                        }`}
                      />
                      {col.isActive !== false ? 'Active in Shop' : 'Hidden'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCollection(col)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isLight
                            ? 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                            : 'text-neutral-400 hover:text-emerald-300 hover:bg-[#13221E]'
                        }`}
                        title="Edit collection"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCollection(col._id, col.name)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                        title="Delete collection"
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
      )}

      {/* ─── 7. TAB CONTENT: FRAGRANCE NOTES ─── */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in">
          {isTaxonomyLoading ? (
            <p className="text-xs text-neutral-500 col-span-4 py-12 text-center">
              Loading olfactory notes...
            </p>
          ) : filteredNotes.length === 0 ? (
            <div
              className={`rounded-3xl border p-12 text-center col-span-4 space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0A1210] border-[#1E332B]'
              }`}
            >
              <Droplets className="w-8 h-8 text-teal-400 mx-auto" />
              <p
                className={`text-sm font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                No fragrance notes found matching "{searchTerm}"
              </p>
              <button
                onClick={handleOpenCreateNote}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-teal-600 hover:bg-teal-500 text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Fragrance Note</span>
              </button>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note._id}
                className={`p-4 rounded-2xl border flex flex-col justify-between shadow-md transition-all group ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-emerald-500/40'
                    : 'bg-[#0A1210] border-[#1E332B] hover:border-emerald-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {note.family || 'Fragrance Note'}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        note.isActive !== false ? 'bg-emerald-400' : 'bg-neutral-600'
                      }`}
                    />
                  </div>
                  <h4
                    className={`font-serif text-base font-bold mt-2.5 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {note.name}
                  </h4>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      note.description
                        ? isLight
                          ? 'text-slate-500'
                          : 'text-neutral-400'
                        : 'text-neutral-500 italic'
                    }`}
                  >
                    {note.description || 'No description provided.'}
                  </p>
                </div>

                <div
                  className={`pt-3 mt-3 border-t flex items-center justify-between ${
                    isLight ? 'border-slate-100' : 'border-[#1E332B]'
                  }`}
                >
                  <span className="text-[10px] font-mono text-neutral-500">
                    /{note.slug}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditNote(note)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLight
                          ? 'text-slate-400 hover:text-emerald-700 hover:bg-emerald-50'
                          : 'text-neutral-400 hover:text-emerald-300 hover:bg-[#13221E]'
                      }`}
                      title="Edit note"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id, note.name)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── 8. TAB CONTENT: OCCASIONS ─── */}
      {activeTab === 'occasions' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in">
          {isTaxonomyLoading ? (
            <p className="text-xs text-neutral-500 col-span-4 py-12 text-center">
              Loading occasions...
            </p>
          ) : filteredOccasions.length === 0 ? (
            <div
              className={`rounded-3xl border p-12 text-center col-span-4 space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#0A1210] border-[#1E332B]'
              }`}
            >
              <Calendar className="w-8 h-8 text-sky-400 mx-auto" />
              <p
                className={`text-sm font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                No occasions found matching "{searchTerm}"
              </p>
              <button
                onClick={handleOpenCreateOccasion}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-sky-600 hover:bg-sky-500 text-white inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>New Occasion</span>
              </button>
            </div>
          ) : (
            filteredOccasions.map((occ) => (
              <div
                key={occ._id}
                className={`p-4 rounded-2xl border flex flex-col justify-between shadow-md transition-all group ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-sky-500/40'
                    : 'bg-[#0A1210] border-[#1E332B] hover:border-sky-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      Scent Occasion
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        occ.isActive !== false ? 'bg-sky-400' : 'bg-neutral-600'
                      }`}
                    />
                  </div>
                  <h4
                    className={`font-serif text-base font-bold mt-2.5 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {occ.name}
                  </h4>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      occ.description
                        ? isLight
                          ? 'text-slate-500'
                          : 'text-neutral-400'
                        : 'text-neutral-500 italic'
                    }`}
                  >
                    {occ.description || 'No description provided.'}
                  </p>
                </div>

                <div
                  className={`pt-3 mt-3 border-t flex items-center justify-between ${
                    isLight ? 'border-slate-100' : 'border-[#1E332B]'
                  }`}
                >
                  <span className="text-[10px] font-mono text-neutral-500">
                    /{occ.slug}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditOccasion(occ)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isLight
                          ? 'text-slate-400 hover:text-sky-700 hover:bg-sky-50'
                          : 'text-neutral-400 hover:text-sky-300 hover:bg-[#13221E]'
                      }`}
                      title="Edit occasion"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteOccasion(occ._id, occ.name)}
                      className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                      title="Delete occasion"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ─── 9. TAB CONTENT: LIVE NAVBAR MEGA-MENU PREVIEW ─── */}
      {activeTab === 'preview' && (
        <div className="space-y-4 animate-in fade-in">
          <div
            className={`p-4 rounded-2xl border flex items-center justify-between ${
              isLight
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-[#0E1A16] border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2 text-xs">
              <Eye className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Live Dynamic Mega-Menu Visualizer:</strong> Displays the exact active categories, collections, and notes rendered under <strong>"Shop"</strong> on the storefront.
              </span>
            </div>
            <Link
              href="/shop"
              target="_blank"
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
            >
              Open Shop <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Render Mega Menu Live Mockup */}
          <div className="rounded-3xl border border-emerald-100 bg-white shadow-2xl overflow-hidden text-neutral-800">
            <div className="flex items-center justify-between px-6 py-3 border-b border-emerald-100 bg-emerald-50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                Live Storefront Mega-Menu
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-emerald-50 px-2 py-5">
              {/* Categories */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Active Categories ({rawCategories.filter((c) => c.isActive !== false).length})
                </p>
                {rawCategories.filter((c) => c.isActive !== false).length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No active categories</p>
                ) : (
                  rawCategories.filter((c) => c.isActive !== false).map((cat) => (
                    <div
                      key={cat._id}
                      className="text-xs text-neutral-600 hover:text-emerald-800 font-medium leading-relaxed flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{cat.name}</span>
                      </span>
                      {cat.featured && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                          Featured
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Collections */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Collections ({collections.filter((c) => c.isActive !== false).length})
                </p>
                {collections.filter((c) => c.isActive !== false).length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No active collections</p>
                ) : (
                  collections.filter((c) => c.isActive !== false).map((col) => (
                    <div
                      key={col._id}
                      className="text-xs text-neutral-600 font-medium leading-relaxed flex items-center justify-between"
                    >
                      <span>{col.name}</span>
                      {col.featured && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                          Series
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Fragrance Notes */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Notes ({notes.filter((n) => n.isActive !== false).length})
                </p>
                {notes.filter((n) => n.isActive !== false).length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No notes</p>
                ) : (
                  notes.filter((n) => n.isActive !== false).slice(0, 10).map((note) => (
                    <div
                      key={note._id}
                      className="text-xs text-neutral-600 font-medium leading-relaxed flex items-center justify-between"
                    >
                      <span>{note.name}</span>
                      <span className="text-[9px] text-neutral-400">{note.family}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Occasions */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Occasions ({occasions.filter((o) => o.isActive !== false).length})
                </p>
                {occasions.filter((o) => o.isActive !== false).length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No occasions</p>
                ) : (
                  occasions.filter((o) => o.isActive !== false).map((occ) => (
                    <div key={occ._id} className="text-xs text-neutral-600 font-medium leading-relaxed">
                      {occ.name}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-emerald-100 px-6 py-4 bg-emerald-50 flex items-center justify-between">
              <p className="text-[11px] text-neutral-500">
                {rawCategories.length} Categories •{' '}
                {collections.filter((c) => c.isActive !== false).length} Series
              </p>
              <Link
                href="/shop"
                target="_blank"
                className="text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-700 px-5 py-2 rounded-xl uppercase tracking-wider transition-colors"
              >
                Browse Storefront Catalog →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 10. MODAL: CREATE / EDIT CATEGORY                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
          <div
            className={`border rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden my-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0A1210] border-[#1E332B] text-white'
            }`}
          >
            {/* Header */}
            <div
              className={`flex justify-between items-center px-5 sm:px-6 py-4 border-b flex-shrink-0 ${
                isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1E332B] bg-[#0E1A16]/70'
              }`}
            >
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>{editingCategory ? 'Edit Category' : 'Create Dynamic Category'}</span>
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCategory} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
                {/* Category Title */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Category Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => handleCategoryNameChange(e.target.value)}
                    placeholder="e.g. Royal Dehn Al Oudh"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                {/* Slug / URL identifier */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold uppercase tracking-wider text-[10px]">
                      URL Slug
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomSlug(!isCustomSlug)}
                      className="text-[10px] text-emerald-500 hover:underline font-semibold cursor-pointer"
                    >
                      {isCustomSlug ? 'Auto-generate from Name' : 'Customize Slug'}
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-neutral-400 text-xs">
                      /
                    </span>
                    <input
                      type="text"
                      required
                      value={categoryForm.slug}
                      readOnly={!isCustomSlug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: slugify(e.target.value) })}
                      placeholder="royal-dehn-al-oudh"
                      className={`w-full pl-7 pr-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-xs ${
                        !isCustomSlug ? 'opacity-80' : ''
                      } ${
                        isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <AdminImageUpload
                  value={categoryForm.image}
                  onChange={(url) => setCategoryForm((prev) => ({ ...prev, image: url }))}
                  label="Category Visual Image"
                  folder="attar-depot/categories"
                />

                {/* Description */}
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Enter category description, scent notes, or heritage story..."
                    className={`w-full border rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-medium leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                {/* Toggle: Featured */}
                <div className="pt-2">
                  <div
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isLight ? 'bg-slate-50 border-slate-200 hover:bg-slate-100' : 'bg-[#070D0B] border-[#1E332B] hover:bg-[#0c1513]'
                    }`}
                    onClick={() => setCategoryForm((prev) => ({ ...prev, featured: !prev.featured }))}
                  >
                    <div>
                      <p className="font-bold text-xs">Featured Category</p>
                      <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                        Highlight on homepage & royal collections spotlight
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={categoryForm.featured}
                      onChange={(e) => setCategoryForm((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCatMutation.isPending || updateCatMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50 cursor-pointer"
                >
                  {createCatMutation.isPending || updateCatMutation.isPending
                    ? 'Saving...'
                    : editingCategory
                    ? 'Update Category'
                    : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SAFE DELETE CONFIRMATION MODAL                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isDeleteModalOpen && categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-200">
          <div
            className={`border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0A1210] border-[#1E332B] text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold">Delete Category</h3>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  Removing category "{categoryToDelete.name}"
                </p>
              </div>
            </div>

            {/* Warning if products are linked */}
            {(categoryToDelete.productCount || 0) > 0 ? (
              <div
                className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                  isLight
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  <span>{categoryToDelete.productCount} product(s) linked to this category!</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Deleting this category will leave these products without a primary category. You can reassign products before deleting, or confirm force delete.
                </p>
              </div>
            ) : (
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>
                Are you sure you want to delete this category? Once deleted, it will stay deleted and will not reappear.
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCategoryToDelete(null);
                }}
                className={`px-4 py-2 text-xs font-semibold rounded-xl cursor-pointer ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteCatMutation.isPending}
                onClick={() => handleConfirmDeleteCategory(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-all shadow-md shadow-rose-700/25 disabled:opacity-50"
              >
                {deleteCatMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE / EDIT COLLECTION                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
          <div
            className={`border rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden my-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0A1210] border-[#1E332B] text-white'
            }`}
          >
            <div
              className={`flex justify-between items-center px-5 sm:px-6 py-4 border-b flex-shrink-0 ${
                isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1E332B] bg-[#0E1A16]/70'
              }`}
            >
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{editingCollection ? 'Edit Collection' : 'Add Collection'}</span>
              </h2>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Collection Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={collectionForm.name}
                    onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                    placeholder="e.g. Royal Series, Kashmir Heritage"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={collectionForm.tagline}
                    onChange={(e) => setCollectionForm({ ...collectionForm, tagline: e.target.value })}
                    placeholder="e.g. Generational copper still distillations"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={collectionForm.description}
                    onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })}
                    placeholder="Historical context, craftsmanship, and notes profile..."
                    className={`w-full border rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-medium leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="colFeatured"
                      checked={collectionForm.featured}
                      onChange={(e) => setCollectionForm({ ...collectionForm, featured: e.target.checked })}
                      className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="colFeatured" className="font-medium cursor-pointer text-xs">
                      Feature Series
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="colActive"
                      checked={collectionForm.isActive}
                      onChange={(e) => setCollectionForm({ ...collectionForm, isActive: e.target.checked })}
                      className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="colActive" className="font-medium cursor-pointer text-xs">
                      Active in Navbar
                    </label>
                  </div>
                </div>
              </div>

              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createColMutation.isPending || updateColMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50 cursor-pointer"
                >
                  {createColMutation.isPending || updateColMutation.isPending
                    ? 'Saving...'
                    : editingCollection
                    ? 'Update Collection'
                    : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE / EDIT FRAGRANCE NOTE                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
          <div
            className={`border rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden my-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0A1210] border-[#1E332B] text-white'
            }`}
          >
            <div
              className={`flex justify-between items-center px-5 sm:px-6 py-4 border-b flex-shrink-0 ${
                isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1E332B] bg-[#0E1A16]/70'
              }`}
            >
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Droplets className="w-4 h-4 text-teal-400" />
                <span>{editingNote ? 'Edit Fragrance Note' : 'New Olfactory Note'}</span>
              </h2>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Note Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={noteForm.name}
                    onChange={(e) => setNoteForm({ ...noteForm, name: e.target.value })}
                    placeholder="e.g. Taif Rose, Mysore Sandalwood, Agarwood"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Olfactory Family
                  </label>
                  <input
                    type="text"
                    value={noteForm.family}
                    onChange={(e) => setNoteForm({ ...noteForm, family: e.target.value })}
                    placeholder="e.g. Woody, Floral, Amber / Oriental"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Description / Profile
                  </label>
                  <textarea
                    rows={2}
                    value={noteForm.description}
                    onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                    placeholder="Sensory facets, distillation origin, or projection impact..."
                    className={`w-full border rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-medium leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="noteActive"
                    checked={noteForm.isActive}
                    onChange={(e) => setNoteForm({ ...noteForm, isActive: e.target.checked })}
                    className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="noteActive" className="font-medium cursor-pointer text-xs">
                    Display in Navbar Mega Menu & Store Filters
                  </label>
                </div>
              </div>

              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50 cursor-pointer"
                >
                  {createNoteMutation.isPending || updateNoteMutation.isPending
                    ? 'Saving...'
                    : editingNote
                    ? 'Update Note'
                    : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: CREATE / EDIT OCCASION                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isOccasionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center animate-in fade-in duration-200 overflow-y-auto">
          <div
            className={`border rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden my-auto ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0A1210] border-[#1E332B] text-white'
            }`}
          >
            <div
              className={`flex justify-between items-center px-5 sm:px-6 py-4 border-b flex-shrink-0 ${
                isLight ? 'border-slate-100 bg-slate-50/70' : 'border-[#1E332B] bg-[#0E1A16]/70'
              }`}
            >
              <h2 className="font-serif text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>{editingOccasion ? 'Edit Occasion' : 'New Occasion'}</span>
              </h2>
              <button
                onClick={() => setIsOccasionModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOccasion} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Occasion Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={occasionForm.name}
                    onChange={(e) => setOccasionForm({ ...occasionForm, name: e.target.value })}
                    placeholder="e.g. Wedding & Gala, Daily Signature"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={occasionForm.description}
                    onChange={(e) => setOccasionForm({ ...occasionForm, description: e.target.value })}
                    placeholder="Occasion character, mood, and projection suggestions..."
                    className={`w-full border rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-medium leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="occActive"
                    checked={occasionForm.isActive}
                    onChange={(e) => setOccasionForm({ ...occasionForm, isActive: e.target.checked })}
                    className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="occActive" className="font-medium cursor-pointer text-xs">
                    Display in Store Filter Options
                  </label>
                </div>
              </div>

              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsOccasionModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors cursor-pointer ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOccMutation.isPending || updateOccMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50 cursor-pointer"
                >
                  {createOccMutation.isPending || updateOccMutation.isPending
                    ? 'Saving...'
                    : editingOccasion
                    ? 'Update Occasion'
                    : 'Create Occasion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
