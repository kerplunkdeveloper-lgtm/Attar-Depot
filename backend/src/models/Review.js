import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required between 1 and 5'],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please write your review thoughts'],
      trim: true,
      maxlength: 1000,
    },
    longevityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    projectionRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    verifiedPurchase: {
      type: Boolean,
      default: true,
    },
    isTestimonial: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews on the same product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
