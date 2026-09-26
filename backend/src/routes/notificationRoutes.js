import express from 'express';
import {
  getNotificationStream,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearAllNotifications,
  triggerTestNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// Real-time Server-Sent Events (SSE) stream (Accessible by admin frontend)
router.get('/stream', getNotificationStream);

// Notification endpoints
router.get('/', getNotifications);
router.put('/:id/read', markNotificationRead);
router.put('/read-all', markAllNotificationsRead);
router.delete('/clear', clearAllNotifications);

// Test notification trigger
router.post('/test', triggerTestNotification);

export default router;
