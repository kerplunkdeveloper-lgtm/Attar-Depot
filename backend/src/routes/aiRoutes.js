import express from 'express';
import { handleChat, getRecommendations } from '../controllers/aiController.js';

const router = express.Router();

router.post('/chat', handleChat);
router.get('/recommendations', getRecommendations);

export default router;
