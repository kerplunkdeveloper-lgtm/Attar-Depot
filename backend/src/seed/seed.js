import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/attar_depot';
    await mongoose.connect(mongoUri);
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Review.deleteMany(),
      Order.deleteMany(),
    ]);
    console.log('[Seeder] Cleared previous collection data.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Haja Moideen (Admin)',
      email: 'admin@attardepot.com',
      password: 'password@123',
      role: 'admin',
      phone: '+91 99447 57526',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    });

    const customerUser = await User.create({
      name: 'Faizan Merchant',
      email: 'customer@attardepot.com',
      password: 'User@123',
      role: 'user',
      phone: '+91 91234 56789',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    });

    console.log('[Seeder] Created Admin and Customer accounts.');

    // 2. Create Categories
    const categoriesData = [
      {
        name: 'Dehn Al Oudh',
        slug: 'dehn-al-oudh',
        description: 'Rare and precious wild agarwood distilled through generational copper still traditions.',
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        featured: true,
      },
      {
        name: 'Royal Musk',
        slug: 'royal-musk',
        description: 'Intoxicating, powdery, velvety musk crafted for enduring intimacy and royal presence.',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
        featured: true,
      },
      {
        name: 'Floral & Gulab Attar',
        slug: 'floral-gulab-attar',
        description: 'Authentic Kannauj Deg & Bhapka hydro-distilled Damask roses, Ruh Motia, and Shamama.',
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
        featured: true,
      },
      {
        name: 'Amber & Woods',
        slug: 'amber-woods',
        description: 'Warm golden amber resins mingled with creamy aged Mysore sandalwood and cedar.',
        image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
        featured: true,
      },
      {
        name: 'French Oriental Blends',
        slug: 'french-oriental-blends',
        description: 'Masterfully harmonized accords marrying Parisian chic elegance with Arabian sillage.',
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
        featured: false,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach(c => {
      catMap[c.slug] = c._id;
    });

    console.log('[Seeder] Created 5 fragrance categories.');

    // 3. Create Products
    const productsData = [
      {
        name: 'Imperial Dehn Al Oudh Cambodi',
        slug: 'imperial-dehn-al-oudh-cambodi',
        tagline: 'Vintage 25-Year Aged Wild Cambodian Agarwood Oil',
        description:
          'A transcendent testament to pure luxury. Distilled from mature wild Aquilaria trees in Koh Kong, Cambodia. Opens with deep honeyed plum and balsamic smoke, cascading into buttery leather, dark chocolate nuances, and eternal medicinal woodiness.',
        category: catMap['dehn-al-oudh'],
        fragranceFamily: 'Oudh',
        fragranceNotes: {
          topNotes: ['Smoky Apricot', 'Caramelized Leather', 'Dry Saffron'],
          heartNotes: ['Aged Cambodian Agarwood', 'Dark Honey', 'Balsamic Tobacco'],
          baseNotes: ['Warm Animalic Earth', 'Ancient Bark', 'Deep Resin'],
        },
        sizes: [
          { size: '3ml (Tola Quarter)', price: 2899, originalPrice: 3499, stock: 18 },
          { size: '6ml (Half Tola)', price: 4999, originalPrice: 5999, stock: 24 },
          { size: '12ml (Full Tola)', price: 8999, originalPrice: 10999, stock: 12 },
        ],
        price: 4999,
        originalPrice: 5999,
        images: [
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 54,
        concentration: '100% Pure Organic Undiluted Attar Oil',
        origin: 'Koh Kong, Cambodia',
        longevityHours: '24+ Hours on Skin',
        projection: 'Enchanting & Monarchical',
        ratings: { average: 4.9, count: 28 },
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: 'Ruh Gulab Imperial (Damask Rose)',
        slug: 'ruh-gulab-imperial',
        tagline: 'Traditional Kannauj Hydro-Distilled Kannauj Rose',
        description:
          'Over 40 kilograms of handpicked pink Damask rose petals harvested before sunrise are required to yield a single gram of this ethereal essence. A radiant bouquet of crisp dewy petals, sweet nectar, and warm green botanicals.',
        category: catMap['floral-gulab-attar'],
        fragranceFamily: 'Floral',
        fragranceNotes: {
          topNotes: ['Morning Dew', 'Fresh Crushed Petals', 'Sweet Lychee'],
          heartNotes: ['Kannauj Damask Rose', 'Bulgarian Rose Otto', 'Geranium Leaf'],
          baseNotes: ['Mysore Sandalwood Base', 'Warm Ambrette Seed'],
        },
        sizes: [
          { size: '3ml', price: 1499, originalPrice: 1899, stock: 35 },
          { size: '6ml', price: 2699, originalPrice: 3299, stock: 40 },
          { size: '12ml', price: 4899, originalPrice: 5999, stock: 20 },
        ],
        price: 2699,
        originalPrice: 3299,
        images: [
          'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 95,
        concentration: '100% Natural Hydro-Distillate',
        origin: 'Kannauj, Uttar Pradesh, India',
        longevityHours: '16 - 20 Hours',
        projection: 'Seductive & Elegant',
        ratings: { average: 4.8, count: 42 },
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: 'White Tahara Kashmir Musk',
        slug: 'white-tahara-kashmir-musk',
        tagline: 'Velvety Purity, Creamy Lotus & Serene Sensuality',
        description:
          'Thick, velvety, and hypnotic. Famous across Arabia as the ultimate personal luxury. Delivers a soft, cloud-like aroma of white musk blended with aquatic lotus flower and gentle powdery iris.',
        category: catMap['royal-musk'],
        fragranceFamily: 'Musk',
        fragranceNotes: {
          topNotes: ['White Lotus', 'Powdery Violet', 'Citrus Blossom'],
          heartNotes: ['Cashmere Wood', 'Jasmine Sambac', 'Lily of the Valley'],
          baseNotes: ['White Musk Pure', 'Sweet Tonka', 'Creamy Vanilla'],
        },
        sizes: [
          { size: '3ml', price: 999, originalPrice: 1299, stock: 50 },
          { size: '6ml', price: 1799, originalPrice: 2199, stock: 65 },
          { size: '12ml', price: 3199, originalPrice: 3899, stock: 30 },
        ],
        price: 1799,
        originalPrice: 2199,
        images: [
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 145,
        concentration: 'Pure Concentrated Musk Blend',
        origin: 'Kashmir & Arabian Gulf',
        longevityHours: '24 Hours on Apparel',
        projection: 'Intimate, Sophisticated',
        ratings: { average: 4.9, count: 64 },
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: 'Sultan Golden Amber Royale',
        slug: 'sultan-golden-amber-royale',
        tagline: 'Luminous Baltic Amber steeped in Aged Sandalwood',
        description:
          'A sovereign formulation of warm fossils, sticky labdanum, and creamy Mysore sandalwood. Radiates glowing golden warmth with accents of toasted cinnamon and sweet vanilla benzoin.',
        category: catMap['amber-woods'],
        fragranceFamily: 'Amber & Woods',
        fragranceNotes: {
          topNotes: ['Cardamom Pods', 'Blood Orange', 'Ceylon Cinnamon'],
          heartNotes: ['Golden Amber Resin', 'Labdanum Absolute', 'Smoky Frankincense'],
          baseNotes: ['Mysore Sandalwood', 'Madagascar Vanilla', 'Cedarwood'],
        },
        sizes: [
          { size: '3ml', price: 1299, originalPrice: 1599, stock: 25 },
          { size: '6ml', price: 2399, originalPrice: 2999, stock: 35 },
          { size: '12ml', price: 4299, originalPrice: 5299, stock: 15 },
        ],
        price: 2399,
        originalPrice: 2999,
        images: [
          'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 75,
        concentration: '100% Pure Perfume Oil',
        origin: 'Oman & Mysore',
        longevityHours: '18 - 22 Hours',
        projection: 'Warm & Grandiose',
        ratings: { average: 4.7, count: 19 },
        isFeatured: true,
        isBestSeller: false,
      },
      {
        name: 'Mukhallat Parisian Oud Fusion',
        slug: 'mukhallat-parisian-oud-fusion',
        tagline: 'A Masterpiece Marriage of Haute French Perfumery & Arabian Oud',
        description:
          'Created for connoisseurs who demand European sophistication with oriental strength. Opens with sparkling Italian bergamot and pink pepper before descending into velvety Bulgarian rose, rich agarwood, and smoky leather.',
        category: catMap['french-oriental-blends'],
        fragranceFamily: 'Spicy Oriental',
        fragranceNotes: {
          topNotes: ['Bergamot Calabre', 'Pink Peppercorn', 'Davana'],
          heartNotes: ['French Rose de Mai', 'Indonesian Patchouli', 'Incense'],
          baseNotes: ['Assam Agarwood', 'Guaiacwood', 'Golden Ambergris'],
        },
        sizes: [
          { size: '3ml', price: 1699, originalPrice: 1999, stock: 30 },
          { size: '6ml', price: 2999, originalPrice: 3699, stock: 45 },
          { size: '12ml', price: 5499, originalPrice: 6599, stock: 20 },
        ],
        price: 2999,
        originalPrice: 3699,
        images: [
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 95,
        concentration: 'Extrait de Parfum Oil Concentré',
        origin: 'Grasse, France & Assam, India',
        longevityHours: '20+ Hours',
        projection: 'Magnetic, Room-Filling',
        ratings: { average: 4.9, count: 33 },
        isFeatured: true,
        isBestSeller: true,
      },
      {
        name: 'Shamama Al-Hind Vintage Blend',
        slug: 'shamama-al-hind-vintage-blend',
        tagline: 'Complex 40+ Rare Herbal Roots & Spices Distillation',
        description:
          'The crowning jewel of traditional Indian perfumery. Crafted through consecutive co-distillations of dozens of exotic Himalayan herbs, saffron strands, mace, nutmeg, and aromatic barks onto a base of pure sandalwood.',
        category: catMap['floral-gulab-attar'],
        fragranceFamily: 'Spicy Oriental',
        fragranceNotes: {
          topNotes: ['Kashmir Saffron', 'Green Cardamom', 'Star Anise'],
          heartNotes: ['Nagarmotha (Cypriol)', 'Jatamansi', 'Cloves & Cinnamon'],
          baseNotes: ['Pure Mysore Sandalwood', 'Oakmoss', 'Labdanum'],
        },
        sizes: [
          { size: '3ml', price: 1399, originalPrice: 1699, stock: 20 },
          { size: '6ml', price: 2599, originalPrice: 3199, stock: 25 },
          { size: '12ml', price: 4699, originalPrice: 5799, stock: 15 },
        ],
        price: 2599,
        originalPrice: 3199,
        images: [
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 60,
        concentration: 'Traditional Ayurvedic Deg-Distilled Attar',
        origin: 'Kannauj, India',
        longevityHours: '24 Hours',
        projection: 'Warm & Mystical',
        ratings: { average: 4.8, count: 22 },
        isFeatured: false,
        isBestSeller: false,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seeder] Created ${createdProducts.length} luxury perfume products.`);

    // 4. Create Reviews & Testimonials
    const sampleReviews = [
      {
        product: createdProducts[0]._id,
        user: customerUser._id,
        userName: 'Faizan Merchant',
        rating: 5,
        title: 'Authentic wild Cambodi — breathtaking depth!',
        comment:
          'I have been collecting Dehn Al Oudh for 15 years across Dubai and Muscat. Attar Depot’s Imperial Cambodi is genuinely raw, unadulterated, and stunningly rich. The honeyed dry-down lasts well past 24 hours on my cuffs.',
        longevityRating: 5,
        projectionRating: 5,
        verifiedPurchase: true,
        isTestimonial: true,
      },
      {
        product: createdProducts[1]._id,
        user: customerUser._id,
        userName: 'Ayesha Rahman',
        rating: 5,
        title: 'The pure scent of real fresh roses',
        comment:
          'Not artificial or synthetic at all. It feels as though you are holding a fresh dew-covered rose in your hand at dawn. Incredible quality and packaging.',
        longevityRating: 5,
        projectionRating: 4,
        verifiedPurchase: true,
        isTestimonial: true,
      },
      {
        product: createdProducts[2]._id,
        user: customerUser._id,
        userName: 'Tariq Al-Sabah',
        rating: 5,
        title: 'Unrivaled creamy white musk',
        comment:
          'The White Tahara musk is thick, smooth, and extraordinarily clean. Compliments galore every time I wear it to meetings and evening prayers.',
        longevityRating: 5,
        projectionRating: 5,
        verifiedPurchase: true,
        isTestimonial: true,
      },
    ];

    await Review.insertMany(sampleReviews);
    console.log('[Seeder] Created customer reviews and testimonials.');

    console.log('\n=============================================');
    console.log(' SEED COMPLETED SUCCESSFULLY! ');
    console.log(' Admin: admin@attardepot.com / Admin@123');
    console.log(' Customer: customer@attardepot.com / User@123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
