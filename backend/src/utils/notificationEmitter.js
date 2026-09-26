import Notification from '../models/Notification.js';

// Set of active SSE client connections (admin dashboards)
const sseClients = new Set();

/**
 * Register a client response stream for SSE
 */
export const registerSseClient = (res) => {
  sseClients.add(res);

  // Send initial handshake event
  res.write(`data: ${JSON.stringify({ event: 'connected', time: new Date().toISOString() })}\n\n`);

  // Remove on close
  res.on('close', () => {
    sseClients.delete(res);
  });
};

/**
 * Broadcast notification to all active SSE admin connections
 */
export const broadcastSseNotification = (notificationData) => {
  const payload = JSON.stringify(notificationData);
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (err) {
      console.error('[SSE Send Error]:', err.message);
      sseClients.delete(client);
    }
  }
};

/**
 * Primary helper to persist notification in DB and broadcast in real time
 */
export const sendAdminNotification = async ({
  type,
  title,
  message,
  customerName = '',
  amount = 0,
  productName = '',
  stockRemaining = null,
  orderNumber = '',
  paymentMethod = '',
  paymentStatus = '',
  orderId = null,
  productId = null,
  userId = null,
  priority = 'normal',
}) => {
  try {
    const notification = await Notification.create({
      type,
      title,
      message,
      customerName,
      amount,
      productName,
      stockRemaining,
      orderNumber,
      paymentMethod,
      paymentStatus,
      orderId,
      productId,
      userId,
      priority,
      read: false,
    });

    // Broadcast in real-time to active admin browser tabs
    broadcastSseNotification(notification.toObject());

    console.log(`[Admin Real-Time Alert] (${type}): ${title} - ${message}`);
    return notification;
  } catch (error) {
    console.error('[Failed to send admin notification]:', error.message);
    return null;
  }
};

/**
 * Heartbeat keeper to prevent proxy / browser timeout on idle SSE
 */
setInterval(() => {
  if (sseClients.size > 0) {
    for (const client of sseClients) {
      try {
        client.write(': heartbeat\n\n');
      } catch (e) {
        sseClients.delete(client);
      }
    }
  }
}, 25000);
