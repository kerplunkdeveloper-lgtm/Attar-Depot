import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js';

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      fragranceFamily,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Filter by Category slug or ID
    if (category) {
      const cat = await Category.findOne({
        $or: [{ slug: category }, { _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }],
      });
      if (cat) {
        query.category = cat._id;
      }
    }

    // Filter by Fragrance Family
    if (fragranceFamily) {
      query.fragranceFamily = fragranceFamily;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Keyword search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { 'fragranceNotes.topNotes': { $regex: search, $options: 'i' } },
        { 'fragranceNotes.heartNotes': { $regex: search, $options: 'i' } },
        { 'fragranceNotes.baseNotes': { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'popular') sortOption = { isBestSeller: -1, 'ratings.count': -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured & best selling products for homepage
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const featured = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    const bestSellers = await Product.find({ isActive: true, isBestSeller: true })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      featured,
      bestSellers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by Slug or ObjectId
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

    const product = await Product.findOne(
      isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }
    ).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Related products in same category
    let relatedProducts = [];
    if (product.category && product.category._id) {
      relatedProducts = await Product.find({
        category: product.category._id,
        _id: { $ne: product._id },
        isActive: true,
      })
        .limit(4)
        .select('name slug price originalPrice images ratings category fragranceFamily');
    }

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      tagline,
      description,
      category,
      fragranceFamily,
      topNotes,
      heartNotes,
      baseNotes,
      price,
      originalPrice,
      sizes,
      stock,
      concentration,
      origin,
      longevityHours,
      projection,
      isFeatured,
      isBestSeller,
    } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ success: false, message: 'Product with this name already exists' });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'attar-depot/products');
        images.push(url);
      }
    } else if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    } else {
      images = [
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
      ];
    }

    // Parse fragrance notes
    const parsedNotes = {
      topNotes: typeof topNotes === 'string' ? topNotes.split(',').map(s => s.trim()) : topNotes || [],
      heartNotes: typeof heartNotes === 'string' ? heartNotes.split(',').map(s => s.trim()) : heartNotes || [],
      baseNotes: typeof baseNotes === 'string' ? baseNotes.split(',').map(s => s.trim()) : baseNotes || [],
    };

    // Parse sizes
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    } else {
      parsedSizes = [
        { size: '3ml', price: Number(price) * 0.55, stock: 20 },
        { size: '6ml', price: Number(price), stock: 30 },
        { size: '12ml', price: Number(price) * 1.8, stock: 15 },
      ];
    }

    const product = await Product.create({
      name,
      slug,
      tagline,
      description,
      category,
      fragranceFamily: fragranceFamily || 'Oudh',
      fragranceNotes: parsedNotes,
      sizes: parsedSizes,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      images,
      stock: stock ? Number(stock) : 25,
      concentration,
      origin,
      longevityHours,
      projection,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updates = { ...req.body };

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'attar-depot/products');
        newImages.push(url);
      }
      updates.images = newImages;
    }

    if (updates.topNotes || updates.heartNotes || updates.baseNotes) {
      updates.fragranceNotes = {
        topNotes: typeof updates.topNotes === 'string' ? updates.topNotes.split(',').map(s => s.trim()) : product.fragranceNotes.topNotes,
        heartNotes: typeof updates.heartNotes === 'string' ? updates.heartNotes.split(',').map(s => s.trim()) : product.fragranceNotes.heartNotes,
        baseNotes: typeof updates.baseNotes === 'string' ? updates.baseNotes.split(',').map(s => s.trim()) : product.fragranceNotes.baseNotes,
      };
    }

    if (updates.sizes && typeof updates.sizes === 'string') {
      updates.sizes = JSON.parse(updates.sizes);
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};
