import mongoose from 'mongoose';

const sizeOptionSchema = new mongoose.Schema({
  size: {
    type: String, // e.g., '3ml', '6ml', '12ml', '50ml EDP'
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  stock: {
    type: Number,
    default: 20,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    tagline: {
      type: String,
      default: 'Pure concentrated attar of royal distinction',
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    fragranceFamily: {
      type: String,
      enum: ['Oudh', 'Floral', 'Musk', 'Amber & Woods', 'Spicy Oriental', 'Fresh Citrus'],
      default: 'Oudh',
    },
    fragranceNotes: {
      topNotes: [{ type: String, trim: true }],
      heartNotes: [{ type: String, trim: true }],
      baseNotes: [{ type: String, trim: true }],
    },
    sizes: [sizeOptionSchema],
    price: {
      type: Number,
      required: [true, 'Base price is required'],
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    images: {
      type: [String],
      validate: [array => array.length > 0, 'At least one product image is required'],
    },
    stock: {
      type: Number,
      required: true,
      default: 25,
      min: 0,
    },
    concentration: {
      type: String,
      default: '100% Pure Perfume Oil (Non-Alcoholic Attar)',
    },
    origin: {
      type: String,
      default: 'Kannauj & Assam, India',
    },
    longevityHours: {
      type: String,
      default: '18 - 24 Hours',
    },
    projection: {
      type: String,
      default: 'Strong & Intoxicating',
    },
    ratings: {
      average: { type: Number, default: 4.8, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
