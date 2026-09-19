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
  CheckCircle2,
  FolderOpen,
  Search,
  Droplets,
  Tag,
  Compass,
  Eye,
  Check,
  ChevronRight,
  ShieldCheck,
  Sliders,
  Flame,
  Calendar,
  Sparkle,
  ExternalLink,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import {
  useAdminCreateCategory,
  useAdminUpdateCategory,
  useAdminDeleteCategory,
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

const NOTE_FAMILIES = [
  'All',
  'Woody',
  'Floral',
  'Amber / Oriental',
  'Fresh & Aquatic',
  'Citrus & Fresh',
  'Fruity',
  'Warm & Spicy',
  'Gourmand',
  'Musk',
  'Woody & Earthy',
];

export default function AdminCatalogTaxonomyPage() {
  const { theme } = useAdminTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<TabType>('categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNoteFamily, setSelectedNoteFamily] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<FragranceNote | null>(null);

  const [isOccasionModalOpen, setIsOccasionModalOpen] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<Occasion | null>(null);

  // Queries
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: taxonomyData, isLoading: isTaxonomyLoading } = useAdminTaxonomy();

  const collections = taxonomyData?.collections || [];
  const notes = taxonomyData?.notes || [];
  const occasions = taxonomyData?.occasions || [];

  // Mutations
  const createCatMutation = useAdminCreateCategory();
  const updateCatMutation = useAdminUpdateCategory();
  const deleteCatMutation = useAdminDeleteCategory();

  const createColMutation = useAdminCreateCollection();
  const updateColMutation = useAdminUpdateCollection();
  const deleteColMutation = useAdminDeleteCollection();

  const createNoteMutation = useAdminCreateNote();
  const updateNoteMutation = useAdminUpdateNote();
  const deleteNoteMutation = useAdminDeleteNote();

  const createOccMutation = useAdminCreateOccasion();
  const updateOccMutation = useAdminUpdateOccasion();
  const deleteOccMutation = useAdminDeleteOccasion();

  // Form States
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
    featured: true,
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

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: CATEGORIES
  // ─────────────────────────────────────────────────────────────
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      description: '',
      image: '',
      featured: true,
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
      featured: !!cat.featured,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    const payload = {
      ...categoryForm,
      image:
        categoryForm.image.trim() ||
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
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
        toast.success(`Category "${payload.name}" published!`);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        await deleteCatMutation.mutateAsync(id);
        toast.info(`Category "${name}" removed`);
      } catch (err: any) {
        toast.error('Failed to delete category');
      }
    }
  };

  // ─────────────────────────────────────────────────────────────
  // HANDLERS: COLLECTIONS
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

    const payload = {
      ...collectionForm,
    };

    try {
      if (editingCollection) {
        await updateColMutation.mutateAsync({
          id: editingCollection._id,
          data: payload,
        });
        toast.success(`Collection "${payload.name}" updated!`);
      } else {
        await createColMutation.mutateAsync(payload);
        toast.success(`Collection "${payload.name}" published!`);
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
        toast.success(`Fragrance note "${noteForm.name}" added to vault!`);
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

  // Filtered lists
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

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
      {/* ─── 1. TOP HEADER WITH REAL-TIME TELEMETRY ─── */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b ${
          isLight ? 'border-slate-200' : 'border-[#1E332B]'
        }`}
      >
        <div>
          <h1 className={`font-poppins text-2xl sm:text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'
            }`}>All Categories</h1>
        </div>

        {/* Dynamic Action Button (Changes per Tab) */}
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

      {/* ─── 2. TELEMETRY BADGES BAR ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-3.5">
        {[
          {
            title: 'Categories',
            count: categories.length,
            icon: Layers,
            color: 'text-emerald-400',
            bg: isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]',
            tab: 'categories' as TabType,
          },
          {
            title: 'Collections',
            count: collections.length,
            icon: Sparkles,
            color: 'text-amber-400',
            bg: isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]',
            tab: 'collections' as TabType,
          },
          {
            title: 'Fragrance Notes',
            count: notes.length,
            icon: Droplets,
            color: 'text-teal-400',
            bg: isLight ? 'bg-white border-slate-200' : 'bg-[#0E1715] border-[#1E332B]',
            tab: 'notes' as TabType,
          },
          {
            title: 'Occasions',
            count: occasions.length,
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
              className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all ${item.bg} ${
                isCurrent
                  ? 'ring-2 ring-emerald-500 shadow-md scale-[1.01]'
                  : 'hover:border-emerald-500/40 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold truncate ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                  {item.title}
                </span>
                <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
              </div>
              <p
                className={`text-lg sm:text-xl font-bold font-serif mt-1.5 ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                {item.count}
              </p>
            </button>
          );
        })}
      </div>

      {/* ─── 3. LUXURY UNIFIED TAB NAVIGATION ─── */}
      <div
        className={`border-b ${
          isLight ? 'border-slate-200' : 'border-[#1E332B]'
        }`}
      >
        <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar scroll-smooth pb-0.5">
          {[
            { id: 'categories', label: 'Categories', count: categories.length, icon: Layers },
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
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 -mb-[2px] whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'border-emerald-600 text-emerald-800 bg-emerald-50/90 rounded-t-xl shadow-xs'
                      : 'border-emerald-500 text-emerald-300 bg-emerald-500/10 rounded-t-xl'
                    : isLight
                    ? 'border-transparent text-slate-700 hover:text-slate-950 font-bold hover:bg-slate-50'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

      {/* ─── 4. SEARCH & FILTER TOOLBAR (Hidden in Preview) ─── */}
      {activeTab !== 'preview' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="max-w-md w-full relative">
            <Search
              className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                isLight ? 'text-slate-400' : 'text-neutral-500'
              }`}
            />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 font-poppins shadow-inner ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'
                  : 'bg-[#0A1210] border-[#1E332B] text-white placeholder-neutral-500'
              }`}
            />
          </div>

          {/* If on Notes Tab: Family Filter Pills */}
          {activeTab === 'notes' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {NOTE_FAMILIES.map((fam) => (
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
      )}

      {/* ─── 5. TAB CONTENT: CATEGORIES ─── */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {isCategoriesLoading ? (
            <p className="text-xs text-neutral-500 col-span-3 py-12 text-center">
              Synchronizing dynamic categories from vault...
            </p>
          ) : filteredCategories.length === 0 ? (
            <p className="text-xs text-neutral-500 col-span-3 py-12 text-center">
              No categories found matching "{searchTerm}".
            </p>
          ) : (
            filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className={`rounded-3xl overflow-hidden border flex flex-col justify-between shadow-xl transition-all group ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-emerald-500/50'
                    : 'bg-gradient-to-b from-[#0F1916] to-[#0A1210] border-[#1E332B] hover:border-emerald-500/40'
                }`}
              >
                <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                  <Image
                    src={
                      cat.image ||
                      'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800'
                    }
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
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
                    <h3
                      className={`font-serif text-base font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-neutral-400'
                      }`}
                    >
                      {cat.description || 'Dedicated sovereign attar collection.'}
                    </p>
                  </div>

                  <div
                    className={`pt-3 border-t flex justify-between items-center text-xs ${
                      isLight ? 'border-slate-100' : 'border-[#1E332B]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" /> Active Storefront
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className={`p-1.5 rounded-xl border transition-all shadow-xs cursor-pointer ${
                          isLight
                            ? 'border-slate-300 bg-white text-slate-800 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300'
                            : 'border-[#1E332B] bg-[#0E1715] text-neutral-300 hover:text-emerald-300 hover:bg-[#13221E]'
                        }`}
                        title="Edit category"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id, cat.name)}
                        className={`p-1.5 rounded-xl border transition-all shadow-xs cursor-pointer ${
                          isLight
                            ? 'border-slate-300 bg-white text-slate-700 hover:text-rose-700 hover:bg-rose-50 hover:border-rose-300'
                            : 'border-[#1E332B] bg-[#0E1715] text-neutral-400 hover:text-rose-400 hover:bg-rose-950/30'
                        }`}
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
      )}

      {/* ─── 6. TAB CONTENT: COLLECTIONS ─── */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
          {isTaxonomyLoading ? (
            <p className="text-xs text-neutral-500 col-span-3 py-12 text-center">
              Loading royal fragrance collections...
            </p>
          ) : filteredCollections.length === 0 ? (
            <p className="text-xs text-neutral-500 col-span-3 py-12 text-center">
              No collections found matching "{searchTerm}".
            </p>
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
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Series
                      </span>
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
                        isLight ? 'text-slate-600' : 'text-neutral-400'
                      }`}
                    >
                      {col.description || 'Artisanal perfume flacons & royal oil blends.'}
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
            <p className="text-xs text-neutral-500 col-span-4 py-12 text-center">
              No fragrance notes found matching "{searchTerm}".
            </p>
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
                      isLight ? 'text-slate-500' : 'text-neutral-400'
                    }`}
                  >
                    {note.description || 'Natural distillation olfactory facet.'}
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
            <p className="text-xs text-neutral-500 col-span-4 py-12 text-center">
              No occasions found matching "{searchTerm}".
            </p>
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
                      isLight ? 'text-slate-500' : 'text-neutral-400'
                    }`}
                  >
                    {occ.description || 'Occasion pairing for tailored sillage and presence.'}
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
                <strong>Live Mega-Menu Visualizer:</strong> This shows the exact real-time dropdown customers experience under <strong>"Shop"</strong> on the storefront navigation bar.
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 underline flex items-center gap-1"
            >
              Open Home <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Render Mega Menu Mockup */}
          <div className="rounded-3xl border border-emerald-100 bg-white shadow-2xl overflow-hidden text-neutral-800">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-emerald-100 bg-emerald-50">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">
                Browse Fragrances (Live Real-Time DB Preview)
              </span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            {/* 5-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-emerald-50 px-2 py-5">
              {/* Column 1: Notes */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Notes ({notes.filter((n) => n.isActive !== false).length})
                </p>
                {notes.filter((n) => n.isActive !== false).slice(0, 14).map((note) => (
                  <div
                    key={note._id}
                    className="text-xs text-neutral-600 hover:text-emerald-800 font-medium leading-relaxed flex items-center justify-between"
                  >
                    <span>{note.name}</span>
                    <span className="text-[9px] text-neutral-400">{note.family}</span>
                  </div>
                ))}
              </div>

              {/* Column 2: Gender & Categories */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Gender
                </p>
                {["Men's Perfumes", "Women's Perfumes", 'Unisex Perfumes'].map((g) => (
                  <div key={g} className="text-xs text-neutral-600 font-medium leading-relaxed">
                    {g}
                  </div>
                ))}

                <div className="pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                    Categories ({categories.length})
                  </p>
                  {categories.slice(0, 6).map((cat) => (
                    <div
                      key={cat._id}
                      className="text-xs text-neutral-600 font-medium leading-relaxed mb-2 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Price */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Price
                </p>
                {['Under ₹1999', '₹2000 – ₹2999', '₹3000 – ₹3999', '₹4000 – ₹4999', '₹5000 – ₹5999'].map((p) => (
                  <div key={p} className="text-xs text-neutral-600 font-medium leading-relaxed">
                    {p}
                  </div>
                ))}
              </div>

              {/* Column 4: Collections */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Collections ({collections.filter((c) => c.isActive !== false).length})
                </p>
                {collections.filter((c) => c.isActive !== false).map((col) => (
                  <div
                    key={col._id}
                    className="text-xs text-neutral-600 font-medium leading-relaxed flex items-center justify-between"
                  >
                    <span>{col.name}</span>
                    {col.featured && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                        Series
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Column 5: Occasions */}
              <div className="px-4 py-2 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 pb-1.5 border-b border-emerald-100 mb-2">
                  Occasions ({occasions.filter((o) => o.isActive !== false).length})
                </p>
                {occasions.filter((o) => o.isActive !== false).map((occ) => (
                  <div key={occ._id} className="text-xs text-neutral-600 font-medium leading-relaxed">
                    {occ.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="border-t border-emerald-100 px-6 py-4 bg-emerald-50 flex items-center justify-between">
              <p className="text-[11px] text-neutral-500">
                {categories.length} Curated Fragrance Families • {collections.length} Royal Collections
              </p>
              <span className="text-xs font-bold text-white bg-emerald-800 px-5 py-2 rounded-xl uppercase tracking-wider">
                Explore All Attars & Flacons →
              </span>
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
                <span>{editingCategory ? 'Edit Category' : 'New Dynamic Category'}</span>
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCategory} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Category Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="e.g. Dehn Al Oudh"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <AdminImageUpload
                  value={categoryForm.image}
                  onChange={(url) => setCategoryForm((prev) => ({ ...prev, image: url }))}
                  label="Category Visual Image"
                  folder="attar-depot/categories"
                />

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="Olfactory notes, origins, and heritage story..."
                    className={`w-full border rounded-xl p-3 focus:outline-none focus:border-emerald-500 font-medium leading-relaxed ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="catFeatured"
                    checked={categoryForm.featured}
                    onChange={(e) => setCategoryForm({ ...categoryForm, featured: e.target.checked })}
                    className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="catFeatured" className="font-medium cursor-pointer text-xs">
                    Feature in homepage showcase & navigation highlight
                  </label>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCatMutation.isPending || updateCatMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50"
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
      {/* 11. MODAL: CREATE / EDIT COLLECTION                           */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isCollectionModalOpen && (
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
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{editingCollection ? 'Edit Collection' : 'Add Collection'}</span>
              </h2>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
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
                      className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4"
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
                      className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <label htmlFor="colActive" className="font-medium cursor-pointer text-xs">
                      Active in Navbar
                    </label>
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createColMutation.isPending || updateColMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50"
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
      {/* 12. MODAL: CREATE / EDIT FRAGRANCE NOTE                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isNoteModalOpen && (
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
                <Droplets className="w-4 h-4 text-teal-400" />
                <span>{editingNote ? 'Edit Fragrance Note' : 'New Olfactory Note'}</span>
              </h2>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
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
                  <select
                    value={noteForm.family}
                    onChange={(e) => setNoteForm({ ...noteForm, family: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  >
                    {NOTE_FAMILIES.filter((f) => f !== 'All').map((fam) => (
                      <option key={fam} value={fam}>
                        {fam}
                      </option>
                    ))}
                  </select>
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
                    className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="noteActive" className="font-medium cursor-pointer text-xs">
                    Display in Navbar Mega Menu & Store Filters
                  </label>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50"
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
      {/* 13. MODAL: CREATE / EDIT OCCASION                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {isOccasionModalOpen && (
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
                <Calendar className="w-4 h-4 text-sky-400" />
                <span>{editingOccasion ? 'Edit Occasion' : 'New Fragrance Occasion'}</span>
              </h2>
              <button
                onClick={() => setIsOccasionModalOpen(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? 'text-slate-400 hover:text-slate-900 hover:bg-slate-200' : 'text-neutral-500 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
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
                    placeholder="e.g. Royal Weddings, Evening Wear, Casual Wear"
                    className={`w-full border rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-medium ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#070D0B] border-[#1E332B] text-white'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold uppercase tracking-wider text-[10px]">
                    Description / Recommendation
                  </label>
                  <textarea
                    rows={2}
                    value={occasionForm.description}
                    onChange={(e) => setOccasionForm({ ...occasionForm, description: e.target.value })}
                    placeholder="Best suited settings, projection style, and mood..."
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
                    className="rounded border-[#1E332B] text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="occActive" className="font-medium cursor-pointer text-xs">
                    Display in Navbar Mega Menu & Filter Column
                  </label>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div
                className={`px-5 sm:px-6 py-3.5 border-t flex justify-end items-center gap-3 flex-shrink-0 ${
                  isLight ? 'border-slate-100 bg-slate-50/80' : 'border-[#1E332B] bg-[#070D0B]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsOccasionModalOpen(false)}
                  className={`px-4 py-2 font-medium transition-colors ${
                    isLight ? 'text-slate-600 hover:text-slate-900' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createOccMutation.isPending || updateOccMutation.isPending}
                  className="btn-emerald px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs text-white disabled:opacity-50"
                >
                  {createOccMutation.isPending || updateOccMutation.isPending
                    ? 'Saving...'
                    : editingOccasion
                    ? 'Update Occasion'
                    : 'Add Occasion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
