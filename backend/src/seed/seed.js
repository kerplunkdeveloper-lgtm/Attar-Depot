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

    // Clear ALL existing data
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Review.deleteMany(),
      Order.deleteMany(),
    ]);
    console.log('[Seeder] Cleared ALL previous data.');

    // ─── 1. Create Admin User ────────────────────────────────────────────────
    const adminUser = await User.create({
      name: 'Haja Moideen (Admin)',
      email: 'admin@attardepot.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 99447 57526',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    });
    console.log('[Seeder] Created Admin account.');

    // ─── 2. Create Categories ────────────────────────────────────────────────
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
    createdCategories.forEach(c => { catMap[c.slug] = c._id; });
    console.log('[Seeder] Created 5 fragrance categories.');

    // ─── 3. Create Products with full Vera-style filter fields ───────────────
    const productsData = [
      // ── Dehn Al Oudh ──────────────────────────────────────────────────────
      {
        name: 'Imperial Dehn Al Oudh Cambodi',
        slug: 'imperial-dehn-al-oudh-cambodi',
        tagline: 'Vintage 25-Year Aged Wild Cambodian Agarwood Oil',
        description: 'A transcendent testament to pure luxury. Distilled from mature wild Aquilaria trees in Koh Kong, Cambodia. Opens with deep honeyed plum and balsamic smoke, cascading into buttery leather, dark chocolate nuances, and eternal medicinal woodiness.',
        category: catMap['dehn-al-oudh'],
        fragranceFamily: 'Oudh',
        fragranceNotes: {
          topNotes: ['Smoky Apricot', 'Caramelized Leather', 'Dry Saffron'],
          heartNotes: ['Aged Cambodian Agarwood', 'Dark Honey', 'Balsamic Tobacco'],
          baseNotes: ['Warm Animalic Earth', 'Ancient Bark', 'Deep Resin'],
        },
        // Vera-style fields
        gender: 'Men',
        notes: ['Oudh/Agarwood', 'Woody', 'Spicy', 'Amber'],
        collection: 'Royal Series',
        occasions: ['Evening Wear', 'Party Wear', 'Office Wear'],
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
        name: 'Assam Black Oud Premium',
        slug: 'assam-black-oud-premium',
        tagline: 'Deep Smoky Assam Agarwood — The King of Indian Oudh',
        description: 'Sourced from century-old Aquilaria malaccensis trees of Assam\'s protected rainforests. A complex, deep, and characteristically smoky-sweet oud with barnyard earthiness and spiced woody trails.',
        category: catMap['dehn-al-oudh'],
        fragranceFamily: 'Oudh',
        fragranceNotes: {
          topNotes: ['Smoky Leather', 'Saffron', 'Black Pepper'],
          heartNotes: ['Assam Agarwood', 'Incense', 'Vetiver'],
          baseNotes: ['Earthy Patchouli', 'Dark Resin', 'Sandalwood'],
        },
        gender: 'Men',
        notes: ['Oudh/Agarwood', 'Woody', 'Spicy', 'Sandalwood'],
        collection: 'Aristocrat Series',
        occasions: ['Evening Wear', 'Office Wear', 'Casual Wear'],
        sizes: [
          { size: '3ml', price: 2199, originalPrice: 2699, stock: 20 },
          { size: '6ml', price: 3999, originalPrice: 4799, stock: 28 },
          { size: '12ml', price: 6999, originalPrice: 8499, stock: 10 },
        ],
        price: 3999,
        originalPrice: 4799,
        images: [
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 58,
        concentration: '100% Pure Attar Oil',
        origin: 'Assam, India',
        longevityHours: '20-24 Hours',
        projection: 'Strong & Regal',
        ratings: { average: 4.8, count: 19 },
        isFeatured: true,
        isBestSeller: false,
      },

      // ── Royal Musk ────────────────────────────────────────────────────────
      {
        name: 'White Tahara Kashmir Musk',
        slug: 'white-tahara-kashmir-musk',
        tagline: 'Velvety Purity, Creamy Lotus & Serene Sensuality',
        description: 'Thick, velvety, and hypnotic. Famous across Arabia as the ultimate personal luxury. Delivers a soft, cloud-like aroma of white musk blended with aquatic lotus flower and gentle powdery iris.',
        category: catMap['royal-musk'],
        fragranceFamily: 'Musk',
        fragranceNotes: {
          topNotes: ['White Lotus', 'Powdery Violet', 'Citrus Blossom'],
          heartNotes: ['Cashmere Wood', 'Jasmine Sambac', 'Lily of the Valley'],
          baseNotes: ['White Musk Pure', 'Sweet Tonka', 'Creamy Vanilla'],
        },
        gender: 'Unisex',
        notes: ['Musk', 'Vanilla', 'Fresh & Aquatic', 'Floral'],
        collection: 'Wisal Series',
        occasions: ['Casual Wear', 'Office Wear', 'Summer Wear'],
        sizes: [
          { size: '3ml', price: 999, originalPrice: 1299, stock: 50 },
          { size: '6ml', price: 1799, originalPrice: 2199, stock: 65 },
          { size: '12ml', price: 3199, originalPrice: 3899, stock: 30 },
        ],
        price: 1799,
        originalPrice: 2199,
        images: [
          'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
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
        name: 'Black Musk Al Arabia',
        slug: 'black-musk-al-arabia',
        tagline: 'Dark Seductive Musk — The Signature of Arabian Nights',
        description: 'A mysteriously dark musk accord with intoxicating depth. Blends black musk absolute with smoky labdanum and warm amber to create an unforgettable sensual trail.',
        category: catMap['royal-musk'],
        fragranceFamily: 'Musk',
        fragranceNotes: {
          topNotes: ['Black Pepper', 'Saffron', 'Dark Rose'],
          heartNotes: ['Black Musk', 'Labdanum', 'Leather'],
          baseNotes: ['Amber Resin', 'Vetiver', 'Patchouli'],
        },
        gender: 'Men',
        notes: ['Musk', 'Amber', 'Spicy', 'Patchouli'],
        collection: 'Untold Stories',
        occasions: ['Evening Wear', 'Party Wear', 'Winter Wear'],
        sizes: [
          { size: '3ml', price: 1199, originalPrice: 1499, stock: 30 },
          { size: '6ml', price: 2199, originalPrice: 2699, stock: 40 },
          { size: '12ml', price: 3999, originalPrice: 4799, stock: 20 },
        ],
        price: 2199,
        originalPrice: 2699,
        images: [
          'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 90,
        concentration: 'Pure Musk Absolute',
        origin: 'Saudi Arabia & India',
        longevityHours: '18-22 Hours',
        projection: 'Dark & Seductive',
        ratings: { average: 4.7, count: 31 },
        isFeatured: false,
        isBestSeller: true,
      },

      // ── Floral & Gulab Attar ───────────────────────────────────────────────
      {
        name: 'Ruh Gulab Imperial (Damask Rose)',
        slug: 'ruh-gulab-imperial',
        tagline: 'Traditional Kannauj Hydro-Distilled Kannauj Rose',
        description: 'Over 40 kilograms of handpicked pink Damask rose petals harvested before sunrise are required to yield a single gram of this ethereal essence. A radiant bouquet of crisp dewy petals, sweet nectar, and warm green botanicals.',
        category: catMap['floral-gulab-attar'],
        fragranceFamily: 'Floral',
        fragranceNotes: {
          topNotes: ['Morning Dew', 'Fresh Crushed Petals', 'Sweet Lychee'],
          heartNotes: ['Kannauj Damask Rose', 'Bulgarian Rose Otto', 'Geranium Leaf'],
          baseNotes: ['Mysore Sandalwood Base', 'Warm Ambrette Seed'],
        },
        gender: 'Women',
        notes: ['Floral', 'Rose', 'Fresh & Aquatic', 'Sandalwood'],
        collection: 'Artisan Series',
        occasions: ['Casual Wear', 'Evening Wear', 'Party Wear', 'Summer Wear'],
        sizes: [
          { size: '3ml', price: 1499, originalPrice: 1899, stock: 35 },
          { size: '6ml', price: 2699, originalPrice: 3299, stock: 40 },
          { size: '12ml', price: 4899, originalPrice: 5999, stock: 20 },
        ],
        price: 2699,
        originalPrice: 3299,
        images: [
          'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800',
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
        name: 'Jasmine Motia Absolute',
        slug: 'jasmine-motia-absolute',
        tagline: 'Enrapturing Night-Blooming Jasmine — Pure Ruh Motia',
        description: 'Captured from millions of moonlit jasmine buds handpicked at midnight in Kannauj\'s ancient flower fields. Heady, intoxicating, and deeply feminine with a sensuous indolic warmth.',
        category: catMap['floral-gulab-attar'],
        fragranceFamily: 'Floral',
        fragranceNotes: {
          topNotes: ['Fresh Jasmine Bloom', 'Green Stem', 'Lemon Blossom'],
          heartNotes: ['Ruh Motia Absolute', 'Tuberose', 'Orange Blossom'],
          baseNotes: ['Sandalwood Base', 'Benzoin', 'Musks'],
        },
        gender: 'Women',
        notes: ['Floral', 'Fresh & Aquatic', 'Vanilla', 'Sandalwood'],
        collection: 'Artisan Series',
        occasions: ['Casual Wear', 'Evening Wear', 'Summer Wear', 'Party Wear'],
        sizes: [
          { size: '3ml', price: 1299, originalPrice: 1599, stock: 40 },
          { size: '6ml', price: 2399, originalPrice: 2899, stock: 50 },
          { size: '12ml', price: 4299, originalPrice: 5299, stock: 22 },
        ],
        price: 2399,
        originalPrice: 2899,
        images: [
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 112,
        concentration: 'Absolute Floral Extract',
        origin: 'Kannauj, India',
        longevityHours: '14-18 Hours',
        projection: 'Warm & Feminine',
        ratings: { average: 4.8, count: 37 },
        isFeatured: true,
        isBestSeller: false,
      },

      // ── Amber & Woods ──────────────────────────────────────────────────────
      {
        name: 'Sultan Golden Amber Royale',
        slug: 'sultan-golden-amber-royale',
        tagline: 'Luminous Baltic Amber steeped in Aged Sandalwood',
        description: 'A sovereign formulation of warm fossils, sticky labdanum, and creamy Mysore sandalwood. Radiates glowing golden warmth with accents of toasted cinnamon and sweet vanilla benzoin.',
        category: catMap['amber-woods'],
        fragranceFamily: 'Amber & Woods',
        fragranceNotes: {
          topNotes: ['Cardamom Pods', 'Blood Orange', 'Ceylon Cinnamon'],
          heartNotes: ['Golden Amber Resin', 'Labdanum Absolute', 'Smoky Frankincense'],
          baseNotes: ['Mysore Sandalwood', 'Madagascar Vanilla', 'Cedarwood'],
        },
        gender: 'Unisex',
        notes: ['Amber', 'Sandalwood', 'Vanilla', 'Woody', 'Spicy'],
        collection: 'Gold Series',
        occasions: ['Office Wear', 'Evening Wear', 'Winter Wear', 'Casual Wear'],
        sizes: [
          { size: '3ml', price: 1299, originalPrice: 1599, stock: 25 },
          { size: '6ml', price: 2399, originalPrice: 2999, stock: 35 },
          { size: '12ml', price: 4299, originalPrice: 5299, stock: 15 },
        ],
        price: 2399,
        originalPrice: 2999,
        images: [
          'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800',
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
        name: 'Sandalwood Mysore Supreme',
        slug: 'sandalwood-mysore-supreme',
        tagline: 'Rare Old-Growth Mysore Sandalwood — Creamy Meditative Warmth',
        description: 'Distilled from 30+ year old Santalum album heartwood from government-licensed Mysore estates. Extraordinarily smooth, creamy, milky sandalwood with a heavenly depth that evolves over hours.',
        category: catMap['amber-woods'],
        fragranceFamily: 'Amber & Woods',
        fragranceNotes: {
          topNotes: ['Creamy Milk', 'Soft Woods', 'Light Spice'],
          heartNotes: ['Old Growth Sandalwood', 'Vetiver', 'Cedar'],
          baseNotes: ['White Musk', 'Vanilla Bean', 'Amber'],
        },
        gender: 'Unisex',
        notes: ['Sandalwood', 'Woody', 'Vanilla', 'Musk'],
        collection: 'Aurum Series',
        occasions: ['Office Wear', 'Casual Wear', 'Gym Wear', 'Summer Wear'],
        sizes: [
          { size: '3ml', price: 1799, originalPrice: 2199, stock: 20 },
          { size: '6ml', price: 3299, originalPrice: 3999, stock: 30 },
          { size: '12ml', price: 5999, originalPrice: 7299, stock: 12 },
        ],
        price: 3299,
        originalPrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 62,
        concentration: '100% Pure Sandalwood Oil',
        origin: 'Mysore, Karnataka, India',
        longevityHours: '20-24 Hours',
        projection: 'Silky & Meditative',
        ratings: { average: 4.9, count: 44 },
        isFeatured: true,
        isBestSeller: true,
      },

      // ── French Oriental Blends ──────────────────────────────────────────────
      {
        name: 'Mukhallat Parisian Oud Fusion',
        slug: 'mukhallat-parisian-oud-fusion',
        tagline: 'A Masterpiece Marriage of Haute French Perfumery & Arabian Oud',
        description: 'Created for connoisseurs who demand European sophistication with oriental strength. Opens with sparkling Italian bergamot and pink pepper before descending into velvety Bulgarian rose, rich agarwood, and smoky leather.',
        category: catMap['french-oriental-blends'],
        fragranceFamily: 'Spicy Oriental',
        fragranceNotes: {
          topNotes: ['Bergamot Calabre', 'Pink Peppercorn', 'Davana'],
          heartNotes: ['French Rose de Mai', 'Indonesian Patchouli', 'Incense'],
          baseNotes: ['Assam Agarwood', 'Guaiacwood', 'Golden Ambergris'],
        },
        gender: 'Men',
        notes: ['Oudh/Agarwood', 'Spicy', 'Floral', 'Patchouli', 'Amber'],
        collection: 'Untold Stories',
        occasions: ['Evening Wear', 'Party Wear', 'Office Wear', 'Winter Wear'],
        sizes: [
          { size: '3ml', price: 1699, originalPrice: 1999, stock: 30 },
          { size: '6ml', price: 2999, originalPrice: 3699, stock: 45 },
          { size: '12ml', price: 5499, originalPrice: 6599, stock: 20 },
        ],
        price: 2999,
        originalPrice: 3699,
        images: [
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800',
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
        name: 'Citrus Arabique Fresh Splash',
        slug: 'citrus-arabique-fresh-splash',
        tagline: 'Vibrant Citrus & Arabian Green — For Active Modern Lifestyle',
        description: 'A refreshing burst of Sicilian lemon, bergamot, and lime over a clean aquatic heart and light musk dry-down. Perfect for gym, office, and daily wear. Crisp, clean, and universally loved.',
        category: catMap['french-oriental-blends'],
        fragranceFamily: 'Fresh Citrus',
        fragranceNotes: {
          topNotes: ['Sicilian Lemon', 'Bergamot', 'Persian Lime'],
          heartNotes: ['Aquatic Marine', 'Mint Leaf', 'Green Tea'],
          baseNotes: ['White Musk', 'Cedarwood', 'Light Amber'],
        },
        gender: 'Unisex',
        notes: ['Citrus', 'Fresh & Aquatic', 'Musk', 'Fruity'],
        collection: 'Wisal Series',
        occasions: ['Casual Wear', 'Gym Wear', 'Office Wear', 'Summer Wear'],
        sizes: [
          { size: '3ml', price: 699, originalPrice: 899, stock: 60 },
          { size: '6ml', price: 1299, originalPrice: 1599, stock: 80 },
          { size: '12ml', price: 2299, originalPrice: 2799, stock: 40 },
        ],
        price: 1299,
        originalPrice: 1599,
        images: [
          'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
        ],
        stock: 180,
        concentration: 'Fresh Oriental Blend',
        origin: 'UAE & France',
        longevityHours: '8-12 Hours',
        projection: 'Fresh & Airy',
        ratings: { average: 4.6, count: 56 },
        isFeatured: false,
        isBestSeller: true,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`[Seeder] Created ${createdProducts.length} luxury perfume products with full Vera-style filter fields.`);

    // ─── 4. Create Reviews ───────────────────────────────────────────────────
    const sampleReviews = [
      {
        product: createdProducts[0]._id,
        user: adminUser._id,
        userName: 'Faizan Merchant',
        rating: 5,
        title: 'Authentic wild Cambodi — breathtaking depth!',
        comment: 'I have been collecting Dehn Al Oudh for 15 years across Dubai and Muscat. Attar Depot\'s Imperial Cambodi is genuinely raw, unadulterated, and stunningly rich. The honeyed dry-down lasts well past 24 hours on my cuffs.',
        longevityRating: 5,
        projectionRating: 5,
        verifiedPurchase: true,
        isTestimonial: true,
      },
      {
        product: createdProducts[4]._id,
        user: adminUser._id,
        userName: 'Ayesha Rahman',
        rating: 5,
        title: 'The pure scent of real fresh roses',
        comment: 'Not artificial or synthetic at all. It feels as though you are holding a fresh dew-covered rose in your hand at dawn. Incredible quality and packaging.',
        longevityRating: 5,
        projectionRating: 4,
        verifiedPurchase: true,
        isTestimonial: true,
      },
      {
        product: createdProducts[2]._id,
        user: adminUser._id,
        userName: 'Tariq Al-Sabah',
        rating: 5,
        title: 'Unrivaled creamy white musk',
        comment: 'The White Tahara musk is thick, smooth, and extraordinarily clean. Compliments galore every time I wear it to meetings and evening prayers.',
        longevityRating: 5,
        projectionRating: 5,
        verifiedPurchase: true,
        isTestimonial: true,
      },
      {
        product: createdProducts[7]._id,
        user: adminUser._id,
        userName: 'Priya Nair',
        rating: 5,
        title: 'Mysore Sandalwood is heaven in a bottle',
        comment: 'Genuine old-growth sandalwood — I have tried many brands but this is the creamiest, most authentic sandalwood attar I have ever experienced. Worth every rupee.',
        longevityRating: 5,
        projectionRating: 4,
        verifiedPurchase: true,
        isTestimonial: true,
      },
    ];

    await Review.insertMany(sampleReviews);
    console.log('[Seeder] Created reviews and testimonials.');

    console.log('\n=============================================');
    console.log(' SEED COMPLETED SUCCESSFULLY!');
    console.log(' Admin: admin@attardepot.com / Admin@123');
    console.log(` Products: ${createdProducts.length} with gender/notes/collection/occasions`);
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
