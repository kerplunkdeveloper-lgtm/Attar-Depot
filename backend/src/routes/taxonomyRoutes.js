import express from 'express';
import {
  getPublicTaxonomy,
  getAllTaxonomyAdmin,
  resetDefaultTaxonomy,
  createCollection,
  updateCollection,
  deleteCollection,
  createNote,
  updateNote,
  deleteNote,
  createOccasion,
  updateOccasion,
  deleteOccasion,
} from '../controllers/taxonomyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for storefront & navbar
router.get('/', getPublicTaxonomy);

// Admin-only management routes
router.use(protect, authorize('admin'));

// Full taxonomy with stats for admin
router.get('/all', getAllTaxonomyAdmin);
router.post('/reset-defaults', resetDefaultTaxonomy);

// Collections
router.post('/collections', createCollection);
router.put('/collections/:id', updateCollection);
router.delete('/collections/:id', deleteCollection);

// Fragrance Notes
router.post('/notes', createNote);
router.put('/notes/:id', updateNote);
router.delete('/notes/:id', deleteNote);

// Occasions
router.post('/occasions', createOccasion);
router.put('/occasions/:id', updateOccasion);
router.delete('/occasions/:id', deleteOccasion);

export default router;
