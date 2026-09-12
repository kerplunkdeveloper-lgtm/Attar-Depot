# 👑 Attar Depot — Pure Concentrated Essence of Royalty

A full-stack, enterprise-grade e-commerce application for pure non-alcoholic attars, rare aged Cambodian and Assam agarwoods, Kashmiri musks, and traditional Kannauj hydro-distillates.

---

## 🏛️ Project Architecture

```
Attar-Depot/
├── backend/                       # Node.js + Express + MongoDB REST API
│   ├── src/
│   │   ├── config/                # MongoDB (Mongoose) & Cloudinary SDK
│   │   ├── controllers/           # Auth, Product, Category, Review, Order, Admin
│   │   ├── middleware/            # JWT Auth, Admin RBAC, Multer, Error handler
│   │   ├── models/                # User, Category, Product, Review, Order schemas
│   │   ├── routes/                # Express API router definitions
│   │   ├── seed/                  # Database seeder with sample luxury fragrances
│   │   ├── utils/                 # JWT token generators & cookie handlers
│   │   └── server.js              # Express app entrypoint
│   ├── .env.example
│   └── package.json
│
└── frontend/                      # Next.js 14 App Router + TypeScript
    ├── src/
    │   ├── app/
    │   │   ├── (shop)/            # Customer Storefront (Home, Shop, Product, Cart, Checkout, Orders, About)
    │   │   ├── admin/             # Dedicated Admin Portal (Login, Dashboard, Products, Categories, Orders)
    │   │   ├── login/ & register/ # Customer Authentication
    │   │   ├── layout.tsx         # Global layout with fonts & providers
    │   │   └── globals.css        # Luxury Obsidian & Amber/Gold design system
    │   ├── components/
    │   │   ├── home/              # Testimonials & Hero showcases
    │   │   ├── layout/            # Navbar with Dynamic Category Dropdown, CartDrawer, Footer
    │   │   ├── product/           # ProductCard, FragrancePyramid, ReviewSection
    │   │   └── providers/         # Redux Toolkit + TanStack Query Providers
    │   ├── hooks/                 # TanStack Query custom hooks (caching & optimistic updates)
    │   ├── lib/                   # Axios API client & formatters
    │   ├── store/                 # Redux Toolkit (cartSlice, authSlice, uiSlice)
    │   └── types/                 # TypeScript interfaces
    ├── tailwind.config.ts
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# (Optional) Seed the database with luxury attars, categories, customer reviews, and master admin:
npm run seed

# Start API server (runs on http://localhost:5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start Next.js Development Server (runs on http://localhost:3000)
npm run dev
```

---

## 🔑 Default Credentials

### Store Administrator (Admin Portal: `/admin/login`)
- **Email:** `admin@attardepot.com`
- **Password:** `Admin@123`
- **Privileges:** Full dashboard KPI analytics, add/delete products with image and fragrance notes pyramid, dynamic category creation, and consignment order status tracking.

### Verified Customer
- **Email:** `customer@attardepot.com`
- **Password:** `User@123`
- **Privileges:** Add to cart, choose 3ml/6ml/12ml sizes, checkout, view order status history, submit customer ratings and fragrance reviews.

---

## ✨ Highlights & Features

1. **Frontend**:
   - **Next.js 14 App Router** with TypeScript.
   - **Tailwind CSS & Shadcn UI** styling with a luxury color palette: deep obsidian charcoal (`#0B0A09`), royal gold gradients (`#D4AF37`), and warm ivory typography (`Cinzel` serif + `Plus Jakarta Sans`).
   - **Dynamic Category Navigation**: Shop dropdown dynamically fetched from backend API via TanStack Query.
   - **Redux Toolkit**: Local-storage persisted shopping vault, size selection (3ml, 6ml, 12ml), free shipping progress indicator.
   - **TanStack Query (React Query)**: Caching, background synchronization, and instant cache invalidation on review/category/product creation.
   - **Customer Reviews & Testimonials**: Interactive rating submission (longevity, projection, stars) and home page testimonial carousel.
   - **Separated Admin Portal**: Dedicated login, dashboard KPI metrics, and complete CRUD over inventory and orders.

2. **Backend**:
   - **Node.js & Express.js** with clean MVC pattern.
   - **MongoDB & Mongoose** with relationships between Categories, Products, Reviews, Users, and Orders.
   - **Security**: JWT tokens in secure `httpOnly` cookies + Bearer token support, bcrypt hashed passwords, and Role-Based Access Control (`user` vs `admin`).
   - **Cloudinary & Multer**: Multi-image uploads with automatic fallback.
