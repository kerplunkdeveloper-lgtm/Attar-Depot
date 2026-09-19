import mongoose from 'mongoose';
import Collection from '../models/Collection.js';
import FragranceNote from '../models/FragranceNote.js';
import Occasion from '../models/Occasion.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

// Auto-slugify helper
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Default Presets to ensure storefront and admin are never empty
export const DEFAULT_COLLECTIONS = [
  { name: 'Untold Stories', tagline: 'Rare artisanal blends with historic lineage', featured: true },
  { name: 'Artisan Series', tagline: 'Small-batch copper still hydro-distillations', featured: true },
  { name: 'Wisal Series', tagline: 'Celebration of magnetic love and connection', featured: false },
  { name: 'Aurum Series', tagline: 'Opulent golden amber and pure liquid sunshine', featured: true },
  { name: 'Aristocrat Series', tagline: 'Regal fragrances formulated for distinguished presence', featured: true },
  { name: 'Gold Series', tagline: 'Precious saffron, taif rose, and aged dehn al oudh', featured: false },
  { name: 'Royal Series', tagline: 'The pinnacle of Kannauj and Assam perfumery', featured: true },
];

export const DEFAULT_NOTES = [
  { name: 'Amber', family: 'Amber / Oriental', description: 'Warm, golden, sweet resinous note' },
  { name: 'Citrus', family: 'Citrus & Fresh', description: 'Sparkling Calabrian bergamot, lime and zest' },
  { name: 'Floral', family: 'Floral', description: 'Damask rose, jasmine sambac, and white tuberose' },
  { name: 'Fresh & Aquatic', family: 'Fresh & Marine', description: 'Breezy coastal mist and crystalline rain' },
  { name: 'Fruity', family: 'Fruity', description: 'Honeyed apricot, crisp apple, and dark berries' },
  { name: 'Musk', family: 'Musk', description: 'Soft, velvety animalic white and black musk' },
  { name: 'Oudh/Agarwood', family: 'Woody / Oriental', description: 'Precious resinous Aquilaria heartwood' },
  { name: 'Patchouli', family: 'Woody & Earthy', description: 'Rich, dark, damp earth and Indonesian leaf' },
  { name: 'Rose', family: 'Floral', description: 'Centifolia and Rosa Damascena hydro-distillate' },
  { name: 'Sandalwood', family: 'Woody', description: 'Creamy vintage Mysore Santalum Album wood' },
  { name: 'Spicy', family: 'Warm & Spicy', description: 'Cardamom pods, black pepper, and dry clove' },
  { name: 'Sweet', family: 'Gourmand', description: 'Pure caramel, honeycomb, and spun vanilla' },
  { name: 'Vanilla', family: 'Gourmand', description: 'Madagascar bourbon vanilla beans' },
  { name: 'Woody', family: 'Woody', description: 'Cedarwood, vetiver roots, and ancient bark' },
];

export const DEFAULT_OCCASIONS = [
  { name: 'Casual Wear', description: 'Effortless daily elegance for relaxing days' },
  { name: 'Evening Wear', description: 'Enchanting depth for twilight dinners and soirees' },
  { name: 'Gym Wear', description: 'Energizing and refreshing non-overpowering sillage' },
  { name: 'Office Wear', description: 'Sophisticated, clean presence for boardrooms' },
  { name: 'Party Wear', description: 'Head-turning, magnetic projection that leaves a trail' },
  { name: 'Summer Wear', description: 'Airy, cooling notes that blossom under warm sunshine' },
  { name: 'Winter Wear', description: 'Cozy, enveloping amber and oudh for crisp cold air' },
];

export const DEFAULT_CATEGORIES = [
  {
    name: 'Dehn Al Oudh',
    description: 'Rare and precious wild agarwood distilled through generational copper still traditions.',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Royal Musk',
    description: 'Intoxicating, powdery, velvety musk crafted for enduring intimacy and royal presence.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Floral & Gulab Attar',
    description: 'Authentic Kannauj Deg & Bhapka hydro-distilled Damask roses, Ruh Motia, and Shamama.',
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Amber & Woods',
    description: 'Warm golden amber resins mingled with creamy aged Mysore sandalwood and cedar.',
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'French Oriental Blends',
    description: 'Masterfully harmonized accords marrying Parisian chic elegance with Arabian sillage.',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
];

// Helper: Seed defaults ONLY on initial system setup, NEVER resurrect deleted items
export const seedDefaultTaxonomyIfNeeded = async () => {
  try {
    const db = mongoose.connection.db;
    if (!db) return;

    // Check persistent system flag
    const flag = await db.collection('system_flags').findOne({ key: 'taxonomy_seeded' });
    if (flag) {
      return; // Already seeded in the past; respect user deletions and do not recreate!
    }

    const colCount = await Collection.countDocuments();
    if (colCount === 0) {
      await Collection.insertMany(
        DEFAULT_COLLECTIONS.map((c, i) => ({
          ...c,
          slug: slugify(c.name),
          sortOrder: i,
          isActive: true,
        }))
      );
      console.log('[Taxonomy] Initial default collections seeded.');
    }

    const noteCount = await FragranceNote.countDocuments();
    if (noteCount === 0) {
      await FragranceNote.insertMany(
        DEFAULT_NOTES.map((n, i) => ({
          ...n,
          slug: slugify(n.name),
          sortOrder: i,
          isActive: true,
        }))
      );
      console.log('[Taxonomy] Initial default fragrance notes seeded.');
    }

    const occCount = await Occasion.countDocuments();
    if (occCount === 0) {
      await Occasion.insertMany(
        DEFAULT_OCCASIONS.map((o, i) => ({
          ...o,
          slug: slugify(o.name),
          sortOrder: i,
          isActive: true,
        }))
      );
      console.log('[Taxonomy] Initial default occasions seeded.');
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany(
        DEFAULT_CATEGORIES.map((c) => ({
          ...c,
          slug: slugify(c.name),
          isActive: true,
        }))
      );
      console.log('[Taxonomy] Initial default categories seeded.');
    }

    // Persist system flag so it never auto-reseeds deleted items
    await db.collection('system_flags').updateOne(
      { key: 'taxonomy_seeded' },
      { $set: { key: 'taxonomy_seeded', seededAt: new Date() } },
      { upsert: true }
    );
  } catch (err) {
    console.error('[Taxonomy] Error in auto-seeding:', err.message);
  }
};

// @desc    Get public active taxonomy (Categories, Collections, Notes, Occasions)
// @route   GET /api/taxonomy
// @access  Public
export const getPublicTaxonomy = async (req, res, next) => {
  try {
    const [categories, collections, notes, occasions] = await Promise.all([
      Category.find({ isActive: true }).sort({ name: 1 }),
      Collection.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
      FragranceNote.find({ isActive: true }).sort({ name: 1 }),
      Occasion.find({ isActive: true }).sort({ name: 1 }),
    ]);

    res.status(200).json({
      success: true,
      categories,
      collections,
      notes,
      occasions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full taxonomy for admin console with statistics
// @route   GET /api/taxonomy/all
// @access  Private/Admin
export const getAllTaxonomyAdmin = async (req, res, next) => {
  try {
    const [categories, collections, notes, occasions] = await Promise.all([
      Category.find().sort({ createdAt: -1 }),
      Collection.find().sort({ sortOrder: 1, createdAt: -1 }),
      FragranceNote.find().sort({ name: 1 }),
      Occasion.find().sort({ name: 1 }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCategories: categories.length,
        totalCollections: collections.length,
        totalNotes: notes.length,
        totalOccasions: occasions.length,
      },
      categories,
      collections,
      notes,
      occasions,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ─── COLLECTIONS CRUD ─────────────────────
// ==========================================

// @desc    Create new Collection
// @route   POST /api/taxonomy/collections
// @access  Private/Admin
export const createCollection = async (req, res, next) => {
  try {
    const { name, tagline, description, image, banner, featured, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }

    const slug = slugify(name);
    const existing = await Collection.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Collection "${name}" already exists` });
    }

    const collection = await Collection.create({
      name: name.trim(),
      slug,
      tagline: tagline || '',
      description: description || '',
      image: image || '',
      banner: banner || '',
      featured: Boolean(featured),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Collection
// @route   PUT /api/taxonomy/collections/:id
// @access  Private/Admin
export const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    if (req.body.name && req.body.name.trim()) {
      const trimmedName = req.body.name.trim();
      const newSlug = slugify(trimmedName);
      const duplicate = await Collection.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ success: false, message: `A collection named "${trimmedName}" already exists` });
      }
      collection.name = trimmedName;
      collection.slug = newSlug;
    }
    if (req.body.tagline !== undefined) collection.tagline = req.body.tagline;
    if (req.body.description !== undefined) collection.description = req.body.description;
    if (req.body.image !== undefined) collection.image = req.body.image;
    if (req.body.banner !== undefined) collection.banner = req.body.banner;
    if (req.body.featured !== undefined) collection.featured = Boolean(req.body.featured);
    if (req.body.isActive !== undefined) collection.isActive = Boolean(req.body.isActive);
    if (req.body.sortOrder !== undefined) collection.sortOrder = Number(req.body.sortOrder);

    await collection.save();
    res.status(200).json({ success: true, collection });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Collection
// @route   DELETE /api/taxonomy/collections/:id
// @access  Private/Admin
export const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    await collection.deleteOne();
    res.status(200).json({ success: true, message: `Collection "${collection.name}" removed successfully` });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ─── FRAGRANCE NOTES CRUD ─────────────────
// ==========================================

// @desc    Create new Fragrance Note
// @route   POST /api/taxonomy/notes
// @access  Private/Admin
export const createNote = async (req, res, next) => {
  try {
    const { name, family, description, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Note name is required' });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);
    const existing = await FragranceNote.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Fragrance note "${trimmedName}" already exists` });
    }

    const note = await FragranceNote.create({
      name: trimmedName,
      slug,
      family: family || 'Woody',
      description: description || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Fragrance Note
// @route   PUT /api/taxonomy/notes/:id
// @access  Private/Admin
export const updateNote = async (req, res, next) => {
  try {
    const note = await FragranceNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Fragrance note not found' });
    }

    if (req.body.name && req.body.name.trim()) {
      const trimmedName = req.body.name.trim();
      const newSlug = slugify(trimmedName);
      const duplicate = await FragranceNote.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ success: false, message: `A fragrance note named "${trimmedName}" already exists` });
      }
      note.name = trimmedName;
      note.slug = newSlug;
    }
    if (req.body.family !== undefined) note.family = req.body.family;
    if (req.body.description !== undefined) note.description = req.body.description;
    if (req.body.isActive !== undefined) note.isActive = Boolean(req.body.isActive);

    await note.save();
    res.status(200).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Fragrance Note
// @route   DELETE /api/taxonomy/notes/:id
// @access  Private/Admin
export const deleteNote = async (req, res, next) => {
  try {
    const note = await FragranceNote.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Fragrance note not found' });
    }
    await note.deleteOne();
    res.status(200).json({ success: true, message: `Fragrance note "${note.name}" removed successfully` });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ─── OCCASIONS CRUD ───────────────────────
// ==========================================

// @desc    Create new Occasion
// @route   POST /api/taxonomy/occasions
// @access  Private/Admin
export const createOccasion = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Occasion name is required' });
    }

    const trimmedName = name.trim();
    const slug = slugify(trimmedName);
    const existing = await Occasion.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: `Occasion "${trimmedName}" already exists` });
    }

    const occasion = await Occasion.create({
      name: trimmedName,
      slug,
      description: description || '',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({ success: true, occasion });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Occasion
// @route   PUT /api/taxonomy/occasions/:id
// @access  Private/Admin
export const updateOccasion = async (req, res, next) => {
  try {
    const occasion = await Occasion.findById(req.params.id);
    if (!occasion) {
      return res.status(404).json({ success: false, message: 'Occasion not found' });
    }

    if (req.body.name && req.body.name.trim()) {
      const trimmedName = req.body.name.trim();
      const newSlug = slugify(trimmedName);
      const duplicate = await Occasion.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (duplicate) {
        return res.status(400).json({ success: false, message: `An occasion named "${trimmedName}" already exists` });
      }
      occasion.name = trimmedName;
      occasion.slug = newSlug;
    }
    if (req.body.description !== undefined) occasion.description = req.body.description;
    if (req.body.isActive !== undefined) occasion.isActive = Boolean(req.body.isActive);

    await occasion.save();
    res.status(200).json({ success: true, occasion });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Occasion
// @route   DELETE /api/taxonomy/occasions/:id
// @access  Private/Admin
export const deleteOccasion = async (req, res, next) => {
  try {
    const occasion = await Occasion.findById(req.params.id);
    if (!occasion) {
      return res.status(404).json({ success: false, message: 'Occasion not found' });
    }
    await occasion.deleteOne();
    res.status(200).json({ success: true, message: `Occasion "${occasion.name}" removed successfully` });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin manual trigger to restore default taxonomy (categories, collections, notes, occasions)
// @route   POST /api/taxonomy/reset-defaults
// @access  Private/Admin
export const resetDefaultTaxonomy = async (req, res, next) => {
  try {
    const { target } = req.body || {}; // 'categories', 'collections', 'notes', 'occasions', or all

    if (!target || target === 'all' || target === 'categories') {
      for (const c of DEFAULT_CATEGORIES) {
        const slug = slugify(c.name);
        await Category.findOneAndUpdate(
          { slug },
          { ...c, slug, isActive: true },
          { upsert: true, new: true }
        );
      }
    }

    if (!target || target === 'all' || target === 'collections') {
      for (let i = 0; i < DEFAULT_COLLECTIONS.length; i++) {
        const col = DEFAULT_COLLECTIONS[i];
        const slug = slugify(col.name);
        await Collection.findOneAndUpdate(
          { slug },
          { ...col, slug, sortOrder: i, isActive: true },
          { upsert: true, new: true }
        );
      }
    }

    if (!target || target === 'all' || target === 'notes') {
      for (let i = 0; i < DEFAULT_NOTES.length; i++) {
        const n = DEFAULT_NOTES[i];
        const slug = slugify(n.name);
        await FragranceNote.findOneAndUpdate(
          { slug },
          { ...n, slug, sortOrder: i, isActive: true },
          { upsert: true, new: true }
        );
      }
    }

    if (!target || target === 'all' || target === 'occasions') {
      for (let i = 0; i < DEFAULT_OCCASIONS.length; i++) {
        const o = DEFAULT_OCCASIONS[i];
        const slug = slugify(o.name);
        await Occasion.findOneAndUpdate(
          { slug },
          { ...o, slug, sortOrder: i, isActive: true },
          { upsert: true, new: true }
        );
      }
    }

    res.status(200).json({ success: true, message: 'Default taxonomy reset successfully' });
  } catch (error) {
    next(error);
  }
};

