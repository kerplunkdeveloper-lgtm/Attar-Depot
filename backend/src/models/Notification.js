import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'order_placed',
        'payment_received',
        'customer_register',
        'customer_login',
        'stock_low',
        'stock_empty',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    customerName: {
      type: String,
      default: '',
    },
    amount: {
      type: Number,
      default: 0,
    },
    productName: {
      type: String,
      default: '',
    },
    stockRemaining: {
      type: Number,
      default: null,
    },
    orderNumber: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      default: '',
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['normal', 'warning', 'critical', 'success'],
      default: 'normal',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast query by creation date and read status
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ type: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
