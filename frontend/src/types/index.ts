export interface UserAddress {
  _id?: string;
  fullName?: string;
  phone?: string;
  addressType?: 'Home' | 'Work' | 'Other';
  street?: string;
  landmark?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email?: string;
  role: 'user' | 'admin';
  phone?: string;
  title?: string;
  country?: string;
  isProfileComplete?: boolean;
  avatar?: string;
  addresses?: UserAddress[];
  createdAt?: string;
}

export interface Customer extends User {
  status?: 'Active' | 'Inactive' | 'Blocked';
  ordersCount: number;
  totalSpent: number;
  completedOrders?: number;
  pendingOrders?: number;
  lastOrderDate?: string | null;
  lastOrderNumber?: string | null;
  latestShippingAddress?: ShippingAddress | null;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  featured?: boolean;
  isActive?: boolean;
  productCount?: number;
  createdAt?: string;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  image?: string;
  banner?: string;
  featured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface FragranceNote {
  _id: string;
  name: string;
  slug: string;
  family?: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface Occasion {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface TaxonomySummary {
  stats: {
    totalCategories: number;
    totalCollections: number;
    totalNotes: number;
    totalOccasions: number;
  };
  categories: Category[];
  collections: Collection[];
  notes: FragranceNote[];
  occasions: Occasion[];
}

export interface FragranceNotes {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

export interface ProductSizeOption {
  _id?: string;
  size: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  category: Category;
  fragranceFamily?: string;
  fragranceNotes: FragranceNotes;
  gender?: 'Men' | 'Women' | 'Unisex' | string;
  notes?: string[];
  collection?: string;
  occasions?: string[];
  sizes: ProductSizeOption[];
  price: number;
  originalPrice?: number;
  images: string[];
  stock: number;
  concentration?: string;
  origin?: string;
  longevityHours?: string;
  projection?: string;
  ratings: {
    average: number;
    count: number;
  };
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export interface Review {
  _id: string;
  user: string;
  product: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  longevityRating?: number;
  projectionRating?: number;
  verifiedPurchase?: boolean;
  isTestimonial?: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  stock: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'Online' | 'Card' | 'UPI';
  paymentStatus: 'Pending' | 'Completed' | 'Failed';
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  notes?: string;
  deliveredAt?: string;
  createdAt: string;
}
