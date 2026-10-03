import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'Subtitle cannot exceed 200 characters'],
    },
    badge: {
      type: String,
      default: '',
      trim: true,
      maxlength: [50, 'Badge text cannot exceed 50 characters'],
    },
    image: {
      type: String,
      required: [true, 'Banner image URL is required'],
      trim: true,
    },
    link: {
      type: String,
      default: '/shop',
      trim: true,
      required: [true, 'Destination link/URL is required'],
    },
    openInNewTab: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Performance indexes for blazing fast query on home page
bannerSchema.index({ isActive: 1, order: 1, createdAt: -1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
