import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import taxonomyRoutes from './routes/taxonomyRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import { seedDefaultTaxonomyIfNeeded } from './controllers/taxonomyController.js';
import { seedDefaultCouponsIfNeeded } from './controllers/couponController.js';

dotenv.config();

// Safety listeners for process resilience
process.on('uncaughtException', (err) => {
  console.error('[Process Uncaught Exception]:', err.message);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Process Unhandled Rejection]:', reason);
});

// Connect to MongoDB
connectDB()
  .then(() => {
    seedDefaultTaxonomyIfNeeded().catch((err) => {
      console.error('[Taxonomy Init Error]:', err.message);
    });
    seedDefaultCouponsIfNeeded().catch((err) => {
      console.error('[Coupon Init Error]:', err.message);
    });
  })
  .catch((err) => {
    console.error('[Database Connect Error]:', err.message);
  });

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration supporting credentials (cookies)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev convenience
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'Attar Depot API',
    time: new Date().toISOString(),
  });
});







// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/taxonomy', taxonomyRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin/notifications', notificationRoutes);
app.use('/api/banners', bannerRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[Attar Depot API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[Server Port Error] Port ${PORT} is already in use. Please terminate existing process on port ${PORT} or restart.`);
  } else {
    console.error('[Server Error]:', err.message);
  }
});

export default app;
