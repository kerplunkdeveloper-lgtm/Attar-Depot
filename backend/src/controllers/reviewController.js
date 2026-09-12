import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for a product
// @route   POST /api/reviews/product/:productId
// @access  Private (User)
export const createProductReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, longevityRating, projectionRating } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this fragrance.',
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar || '',
      rating: Number(rating),
      title: title || 'Exceptional Fragrance',
      comment,
      longevityRating: Number(longevityRating) || 5,
      projectionRating: Number(projectionRating) || 5,
      verifiedPurchase: true,
    });

    // Recalculate average rating & count for the product
    const allReviews = await Review.find({ product: productId });
    const avgRating =
      allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

    product.ratings.average = Number(avgRating.toFixed(1));
    product.ratings.count = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      review,
      message: 'Review added successfully! Thank you for sharing your olfactory journey.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top testimonial reviews for the home page
// @route   GET /api/reviews/testimonials
// @access  Public
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Review.find({ rating: { $gte: 4 } })
      .populate('product', 'name slug images')
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin moderation)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await review.deleteOne();

    // Recalculate product rating
    const remainingReviews = await Review.find({ product: productId });
    const avgRating = remainingReviews.length
      ? remainingReviews.reduce((acc, item) => item.rating + acc, 0) / remainingReviews.length
      : 5;

    await Product.findByIdAndUpdate(productId, {
      'ratings.average': Number(avgRating.toFixed(1)),
      'ratings.count': remainingReviews.length,
    });

    res.status(200).json({ success: true, message: 'Review moderated and removed.' });
  } catch (error) {
    next(error);
  }
};
