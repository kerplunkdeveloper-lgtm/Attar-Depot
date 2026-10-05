'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  Gift,
  Sparkles,
  CheckCircle2,
  Building2,
  Users,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Truck,
  ArrowRight,
  Clock,
  Star,
  Palette,
  ChevronRight,
  ChevronDown,
  Award,
  Crown,
  HeartHandshake,
  Send,
  Check,
  FileText,
  BadgePercent,
  Layers,
  Flame,
} from 'lucide-react';
import { toast } from '@/lib/toast';

// ── Corporate Gift Hampers Data ──────────────────────────────────────────────
interface GiftPackage {
  id: string;
  name: string;
  tagline: string;
  category: 'executive' | 'bulk' | 'festive';
  image: string;
  fragrances: string[];
  packaging: string;
  minOrder: string;
  idealFor: string;
  priceEstimate: string;
  features: string[];
}

const GIFT_PACKAGES: GiftPackage[] = [
  {
    id: 'executive-duo',
    name: 'The Sovereign Duo',
    tagline: 'Artisanal crystal twin flacons in emerald velvet',
    category: 'executive',
    image: '/images/gifthomenew.png',
    fragrances: ['Vintage Dehn Al Oudh (6ml)', 'Royal Kashmiri White Musk (6ml)'],
    packaging: 'Handcrafted emerald green velvet box with magnetic gold clasp',
    minOrder: '25 Sets',
    idealFor: 'CXOs, Board Directors, VIP Client Appreciation',
    priceEstimate: 'From ₹1,499 / set',
    features: [
      '24K Gold foil custom logo stamping on box exterior',
      'Solid crystal cut flacons with gold dip rods',
      'Custom embossed parchment message card',
      'Certificate of 100% pure alcohol-free attar',
    ],
  },
  {
    id: 'royal-trio',
    name: 'The Imperial Trinity Vault',
    tagline: 'A royal triumvirate of Oudh, Rose & Sacred Sandal',
    category: 'festive',
    image: '/images/giftbanner1.png',
    fragrances: [
      'Cambodian Agarwood Oudh (6ml)',
      'Kannauj Ruh Gulab Damascena (6ml)',
      'Sacred Mysore Sandalwood (6ml)',
    ],
    packaging: 'Royal gold-trimmed satin lined rigid presentation coffret',
    minOrder: '20 Sets',
    idealFor: 'Diwali Hampers, Eid Celebrations, Deal Closings',
    priceEstimate: 'From ₹2,499 / set',
    features: [
      'Full custom outer sleeve with corporate branding',
      'Heavy octagonal crystal flacons with jewel-cut caps',
      'Wax-sealed brand authentication badge',
      'Free individual doorstep dispatch available',
    ],
  },
  {
    id: 'heritage-chest',
    name: 'The Grand Teakwood Atelier Chest',
    tagline: 'Museum-grade brass-inlaid heirloom collector vault',
    category: 'executive',
    image: '/images/about-hero-clean.jpg',
    fragrances: [
      'Vintage Kalakassi Dehn Al Oudh (12ml)',
      'Mukhallat Al Malaki Imperial Blend (12ml)',
      'Wild Taif Rose Attar (12ml)',
      'Pure Ambergris & White Musk (12ml)',
    ],
    packaging: 'Hand-carved Sheesham teakwood chest with brass floral inlays',
    minOrder: '10 Sets',
    idealFor: 'VVIP Delegations, Milestone Anniversaries, Founders Gifts',
    priceEstimate: 'From ₹5,999 / set',
    features: [
      'Engraved metallic brass crest plate with company logo',
      'Velvet-lined removable tray with secret compartment',
      'Hand-blown Bohemian style crystal decanters',
      'Curated personal consultation with Master Perfumer',
    ],
  },
  {
    id: 'welcome-discovery',
    name: 'The Artisan Discovery Quartet',
    tagline: 'Pocket luxury for widespread organizational celebrations',
    category: 'bulk',
    image: '/images/banner1.png',
    fragrances: [
      'Oud Al Arab (3ml)',
      'French Oriental Amber (3ml)',
      'Fresh Aqua Ruh Khus (3ml)',
      'Jasmine Sambac (3ml)',
    ],
    packaging: 'Compact gold-embossed sliding drawer box with magnetic seal',
    minOrder: '50 Sets',
    idealFor: 'All-Hands Summits, Conference Kits, Employee Milestones',
    priceEstimate: 'From ₹699 / set',
    features: [
      'Sleek roll-on application for modern lifestyle',
      'Full corporate color palette custom sleeve printing',
      'Compact & lightweight for effortless travel distribution',
      'Volume slabs up to 35% discount for 200+ units',
    ],
  },
  {
    id: 'grand-festive-hamper',
    name: 'The Sultanate Festive Hamper',
    tagline: 'The pinnacle of festive grandeur & aromatic hospitality',
    category: 'festive',
    image: '/images/banner2.png',
    fragrances: [
      '2 x 12ml Signature Royal Attars',
      'Pure Royal Bakhoor Aromatic Wood Chips (50g)',
      'Antique Brass Charcoal Incense Burner',
    ],
    packaging: 'Opulent dual-tier emerald and gold trunk with brass lock',
    minOrder: '15 Sets',
    idealFor: 'Festive Hampers, Luxury Wedding Favors, Family Offices',
    priceEstimate: 'From ₹3,999 / set',
    features: [
      'Complete home & personal fragrance ritual in one box',
      'Custom laser-cut wooden fretwork branding',
      'Includes gold-tipped tongs and brass incense burner',
      'White-glove priority shipping across 12,000+ pin codes',
    ],
  },
];

// ── Value Pillars ────────────────────────────────────────────────────────────
const VALUE_PILLARS = [
  {
    icon: ShieldCheck,
    title: '100% Alcohol-Free & Pure',
    desc: 'Halal-certified pure concentrated perfume oils (Ittar). Safe for sensitive skin and universally appreciated across all backgrounds, religions, and corporate cultures.',
  },
  {
    icon: Clock,
    title: '24+ Hours Olfactory Longevity',
    desc: 'Unlike generic alcohol sprays that dissipate in minutes, our concentrated attar stays on skin all day. Your brand impression lingers for hours.',
  },
  {
    icon: Palette,
    title: 'Bespoke Corporate Branding',
    desc: 'Custom hot-foil gold logo stamping, laser-engraved crystal flacons, velvet presentation boxes, and personalized greeting cards tailored to your company identity.',
  },
  {
    icon: BadgePercent,
    title: 'Direct Wholesale Volume Slabs',
    desc: 'Transparent tiered corporate discounts (25+, 50+, 100+, 500+ units) directly from our Kannauj distillation works with full GST invoice input tax credits.',
  },
  {
    icon: HeartHandshake,
    title: 'Dedicated Corporate Concierge',
    desc: 'A single dedicated fragrance advisor from note selection, 3D box mockups, and pre-production sample approval to scheduled doorstep delivery.',
  },
  {
    icon: Truck,
    title: 'Pan-India Individual Drop-Shipping',
    desc: 'We can ship your bulk consignment to a single corporate office, or individually deliver customized gift hampers directly to employees and clients across India.',
  },
];

// ── Step Timeline ────────────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Consultation & Note Selection',
    desc: 'Share your event details, recipient profile, and budget. Our fragrance specialists will curate signature accords from Royal Oud, Damask Rose, White Musk, or Amber.',
  },
  {
    step: '02',
    title: '3D Mockup & Packaging Design',
    desc: 'Our design team prepares high-resolution digital mockups with your corporate logo in gold or silver foil on velvet, leatherette, or wooden boxes.',
  },
  {
    step: '03',
    title: 'Sample Approval & Handcrafting',
    desc: 'For orders of 50+ sets, we rush a physical sample box to your headquarters within 48–72 hours for executive board review before batch bottling.',
  },
  {
    step: '04',
    title: 'White-Glove Doorstep Delivery',
    desc: 'Carefully packaged in heavy tamper-proof outer boxes and delivered on schedule to your event venue, office, or individual recipient doorsteps.',
  },
];

// ── Corporate FAQs ───────────────────────────────────────────────────────────
const CORPORATE_FAQS = [
  {
    q: 'What is the Minimum Order Quantity (MOQ) for corporate gifting?',
    a: 'Our standard corporate gifting MOQ starts at just 15 to 25 sets depending on the chosen collection. For custom bespoke fragrance formulation and custom mold flacons, MOQ is 50 sets.',
  },
  {
    q: 'Can we get our company logo embossed on the gift boxes?',
    a: 'Yes, absolutely. We offer 24K gold foil stamping, silver foil hot-embossing, laser wood engraving, and custom printed outer sleeves with your brand guidelines and logo.',
  },
  {
    q: 'Do you provide GST tax invoices for business expense claiming?',
    a: 'Yes, all corporate orders are issued with official GST-compliant tax invoices enabling your finance team to claim 100% input tax credit (ITC).',
  },
  {
    q: 'Can you dispatch individual gifts directly to our clients across different cities?',
    a: 'Yes! Simply share an Excel sheet with your client/employee delivery addresses and phone numbers. We individually pack, personalize greeting cards, and deliver via express air courier with live tracking.',
  },
  {
    q: 'What is the turnaround lead time for corporate orders?',
    a: 'Ready catalog sets with logo foil stamping typically dispatch within 4 to 7 business days. Fully bespoke sets or 500+ unit orders take 10 to 14 business days. Expedited rush deliveries can be accommodated upon request.',
  },
  {
    q: 'Can we receive physical samples before placing a bulk order?',
    a: 'Yes. For qualified corporate inquiries, we provide an Olfactory Discovery Kit and sample box for your committee to evaluate fragrance projection and box quality before committing.',
  },
];

export default function CorporateGiftingPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'executive' | 'bulk' | 'festive'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackageForQuote, setSelectedPackageForQuote] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    workEmail: '',
    phone: '',
    quantity: '50-100',
    budgetPerGift: '₹1,000 - ₹2,500',
    occasion: 'Corporate Festive Gifting (Diwali / Eid)',
    preferredPackage: '',
    customLogo: true,
    individualShipping: false,
    message: '',
  });

  const filteredPackages =
    selectedCategory === 'all'
      ? GIFT_PACKAGES
      : GIFT_PACKAGES.filter((p) => p.category === selectedCategory);

  const handleSelectPackage = (pkg: GiftPackage) => {
    setSelectedPackageForQuote(pkg.name);
    setFormData((prev) => ({ ...prev, preferredPackage: pkg.name }));
    const formElement = document.getElementById('inquiry-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    toast.info(`Selected "${pkg.name}". Please fill in your company details below.`, {
      title: 'Package Selected',
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.companyName || !formData.workEmail || !formData.phone) {
      toast.error('Please complete all required fields (Name, Company, Email, Phone).', {
        title: 'Missing Details',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        `Thank you ${formData.fullName}! Your corporate inquiry for ${formData.companyName} has been received. Our Corporate Concierge Director will contact you within 2 business hours.`,
        { title: 'Inquiry Submitted' }
      );
      // Reset form
      setFormData({
        fullName: '',
        companyName: '',
        workEmail: '',
        phone: '',
        quantity: '50-100',
        budgetPerGift: '₹1,000 - ₹2,500',
        occasion: 'Corporate Festive Gifting (Diwali / Eid)',
        preferredPackage: '',
        customLogo: true,
        individualShipping: false,
        message: '',
      });
      setSelectedPackageForQuote('');
    }, 1200);
  };

  const handleQuickWhatsApp = () => {
    const pkgText = formData.preferredPackage || selectedPackageForQuote || 'Custom Attar Sets';
    const msg = `Salam & Greetings! I am reaching out from *${
      formData.companyName || 'my company'
    }* regarding Corporate Gifting with Attar Depot.%0A%0A*Name:* ${
      formData.fullName || 'Corporate Procurement'
    }%0A*Package of Interest:* ${pkgText}%0A*Approx Units:* ${formData.quantity}%0A*Budget Slab:* ${
      formData.budgetPerGift
    }%0A%0APlease share your corporate catalog and volume pricing.`;

    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] text-neutral-900 font-sans selection:bg-[#046A5A] selection:text-white pb-24">
      {/* ===================================================================== */}
      {/* 1. REGAL HERO BANNER WITH LUXURY BADGES                                */}
      {/* ===================================================================== */}
      <section className="relative w-full overflow-hidden bg-[#011C16] text-[#FAF8F2]">
        {/* Ambient background glow & royal watermark */}
        <div className="absolute inset-0 pointer-events-none select-none opacity-20">
          <Image
            src="/images/bannerf1.png"
            alt="Royal Attar Corporate Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#011C16] via-[#011C16]/90 to-[#011C16]/75" />
        </div>

        {/* Top Gold Border Hairline */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418] to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-20 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-[#F5B418] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/gifting" className="hover:text-[#F5B418] transition-colors">
              Gifting
            </Link>
            <span>/</span>
            <span className="text-[#F5B418] font-bold">Corporate Gifting</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content (Span 7) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Gold Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#F5B418]/20 via-[#F5B418]/10 to-[#F5B418]/20 border border-[#F5B418]/60 text-[#F5B418] text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(245,180,24,0.15)]">
                <Crown className="w-3.5 h-3.5 text-[#F5B418]" />
                <span>Bespoke Corporate & Bulk Fragrance Gifting</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.12]">
                Leave an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5B418] via-[#FFE28A] to-[#F5B418]">Everlasting Memory</span> with Pure Royal Attars
              </h1>

              {/* Subtitle */}
              <p className="font-sans text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
                Elevate your executive relationships, festive employee rewards, and milestone celebrations with
                100% pure alcohol-free artisanal attars. Handcrafted crystal flacons, 24K gold foil bespoke corporate
                branding, luxury velvet coffrets, and white-glove pan-India doorstep delivery.
              </p>

              {/* Quick Key Highlights Chips */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                {[
                  '100% Alcohol-Free Pure Oils',
                  '24K Gold Foil Logo Stamping',
                  'Direct Factory Wholesale Slabs',
                  'Full GST Invoice Tax Credit',
                  'Pan-India Individual Drop-Shipping',
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.07] border border-white/10 text-neutral-200"
                  >
                    <Check className="w-3 h-3 text-[#F5B418]" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <a
                  href="#inquiry-form-section"
                  className="px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-[#011C16] bg-gradient-to-r from-[#F5B418] via-[#FFDF78] to-[#E5A412] hover:brightness-110 active:scale-95 shadow-[0_4px_25px_rgba(245,180,24,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#011C16]" />
                  <span>Request Custom Quotation</span>
                </a>

                <button
                  type="button"
                  onClick={handleQuickWhatsApp}
                  className="px-6 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-[#FAF8F2] bg-white/[0.08] hover:bg-white/[0.15] border border-[#F5B418]/50 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Right Visual Card (Span 5) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-5 sm:p-7 bg-gradient-to-br from-[#02332A] via-[#012520] to-[#011C16] border border-[#F5B418]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Visual Image */}
                <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-[#F5B418]/25 shadow-md mb-5 group">
                  <Image
                    src="/images/gifthomenew.png"
                    alt="Attar Depot Corporate Gifting Collection"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F5B418] block">
                      Featured Corporate Coffret
                    </span>
                    <p className="font-serif text-base font-bold text-white">
                      The Sovereign Executive Collection
                    </p>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-[#F5B418]/25">
                  <div className="p-2 rounded-xl bg-white/[0.04]">
                    <span className="font-serif text-lg sm:text-xl font-bold text-[#F5B418] block">
                      50K+
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans uppercase tracking-wider">
                      Gifts Delivered
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04]">
                    <span className="font-serif text-lg sm:text-xl font-bold text-[#F5B418] block">
                      500+
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans uppercase tracking-wider">
                      Enterprises
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.04]">
                    <span className="font-serif text-lg sm:text-xl font-bold text-[#F5B418] block">
                      4.9★
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans uppercase tracking-wider">
                      Client Rating
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gold Hairline */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F5B418]/60 to-transparent" />
      </section>

      {/* ===================================================================== */}
      {/* 2. WHY ATTAR DEPOT FOR CORPORATE GIFTING (6 VALUE PILLARS)             */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center space-y-3 max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#02332A]/10 text-[#02332A] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>The Attar Depot Distinction</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Why Discerning Companies Choose Pure Attar
          </h2>
          <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Move beyond cliché tech gadgets, pens, and sweet boxes. A bottle of royal attar is an exquisite,
            sensory heirloom that honors traditions and makes your corporate gift genuinely memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUE_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 sm:p-7 bg-white border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(1,37,32,0.08)] hover:border-[#F5B418]/50 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#012520] text-[#F5B418] flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#012520] group-hover:to-[#046A5A] transition-all">
                    <Icon className="w-5 h-5 text-[#F5B418]" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-[#012520] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. CURATED CORPORATE GIFT HAMPERS (INTERACTIVE SHOWCASE)               */}
      {/* ===================================================================== */}
      <section className="bg-white border-y border-neutral-200/80 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#046A5A]">
                Catalog of Prestige
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                Curated Corporate Gift Collections
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-500">
                Explore our signature corporate packaging lines. Every hamper can be custom-branded with your
                company emblem and filled with your chosen fragrance accords.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-neutral-100 border border-neutral-200/70 overflow-x-auto">
              {[
                { id: 'all', label: 'All Sets' },
                { id: 'executive', label: 'Executive & CXO' },
                { id: 'bulk', label: 'Employee & Bulk' },
                { id: 'festive', label: 'Festive & Hampers' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-[#012520] text-[#F5B418] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hampers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-[#FAF8F2] border border-neutral-200/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(1,37,32,0.12)] hover:border-[#F5B418]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image container */}
                  <div className="relative w-full h-52 overflow-hidden bg-neutral-900">
                    <Image
                      src={pkg.image}
                      alt={pkg.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#011C16]/90 text-[#F5B418] border border-[#F5B418]/40 backdrop-blur-sm">
                      MOQ: {pkg.minOrder}
                    </div>
                    <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-neutral-900 backdrop-blur-xs shadow-xs">
                      {pkg.priceEstimate}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-neutral-900 group-hover:text-[#046A5A] transition-colors">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 italic font-serif">
                        {pkg.tagline}
                      </p>
                    </div>

                    {/* Included Fragrances */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Included Fragrance Oils:
                      </span>
                      <ul className="space-y-1">
                        {pkg.fragrances.map((f, i) => (
                          <li key={i} className="text-xs text-neutral-700 flex items-center gap-1.5 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Packaging */}
                    <div className="p-2.5 rounded-xl bg-white border border-neutral-200/70 text-xs text-neutral-600">
                      <span className="font-bold text-neutral-800">Box Style: </span>
                      {pkg.packaging}
                    </div>

                    {/* Ideal For */}
                    <div className="text-[11px] text-[#046A5A] font-semibold flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Best For: {pkg.idealFor}</span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-1 pt-1 text-[11px] text-neutral-600">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 sm:p-6 pt-0">
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(pkg)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#012520] hover:bg-[#02332A] text-[#F5B418] border border-[#F5B418]/40 hover:border-[#F5B418] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Inquire About This Set</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. BESPOKE BRANDING & CUSTOMIZATION (HOW WE PERSONALIZE)               */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Visual Illustration */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-300">
              <Image
                src="/images/about-hero-banner.jpg"
                alt="Bespoke Perfume Box Customization"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#F5B418] text-[#012520] font-bold text-[10px] uppercase tracking-wider inline-block">
                  Master Artisan Craftsmanship
                </span>
                <h4 className="font-serif text-xl font-bold text-white">
                  Gold Hot-Foil & Hand-Carved Personalization
                </h4>
                <p className="text-xs text-neutral-300 font-sans">
                  Every flacon and casket is inspected, sealed, and packaged with aristocratic precision.
                </p>
              </div>
            </div>
          </div>

          {/* Right Customization Services */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#046A5A]">
                End-To-End Tailoring
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                How We Customize Your Corporate Gifts
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Transform a gift into an unforgettable representation of your enterprise identity. We offer
                exhaustive bespoke options for your brand:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: '24K Gold & Silver Foil Stamping',
                  desc: 'High-definition hot-foil stamping of your enterprise logo, anniversary year, or motto across velvet, leatherette, or wooden coffrets.',
                },
                {
                  title: 'Custom Laser Bottle Engraving',
                  desc: 'Precision laser etching directly onto crystal flacons with recipient names or custom initials for bespoke VIP recognition.',
                },
                {
                  title: 'Signature Accord Blending',
                  desc: 'Our master perfumers can formulate a signature house perfume accord exclusively matching your brand aura.',
                },
                {
                  title: 'Wax-Sealed Executive Cards',
                  desc: 'Heavy textured cotton parchment letterpress greeting cards with authentic royal wax seals bearing your company monogram.',
                },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
                  <h4 className="font-serif text-sm font-bold text-[#012520] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F5B418]" />
                    <span>{item.title}</span>
                  </h4>
                  <p className="font-sans text-xs text-neutral-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. 4-STEP TIMELINE WORKFLOW (HOW IT WORKS)                             */}
      {/* ===================================================================== */}
      <section className="bg-[#012520] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5B418]">
              Seamless Procurement
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Four Steps to Your Custom Gift Collection
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300">
              We make corporate gifting effortless. From first scent consultation to nationwide doorstep delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl p-6 bg-white/[0.05] border border-white/10 hover:border-[#F5B418]/60 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-black text-[#F5B418]/40 group-hover:text-[#F5B418] transition-colors">
                    {step.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F5B418]/20 flex items-center justify-center text-[#F5B418]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-serif text-base font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. INTERACTIVE CORPORATE INQUIRY & QUOTATION FORM                      */}
      {/* ===================================================================== */}
      <section id="inquiry-form-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Context & Direct Contact Box (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#046A5A]">
                Fast Response Guarantee
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                Request a Custom Corporate Quotation
              </h2>
              <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Fill out the procurement questionnaire and our Corporate Gifting Concierge will prepare a tailored
                commercial proposal with tiered slab pricing, sample dispatch, and digital mockups within 2 business hours.
              </p>
            </div>

            {/* Direct Concierge Box */}
            <div className="p-6 rounded-3xl bg-white border border-[#F5B418]/40 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#012520] text-[#F5B418] flex items-center justify-center shrink-0">
                  <Briefcase className="w-6 h-6 text-[#F5B418]" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-neutral-900">
                    Corporate Concierge Desk
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Direct Corporate Services & Institutional Procurement
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-neutral-100 text-xs">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-neutral-700 hover:text-[#046A5A] font-semibold transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#F5B418]" />
                  <span>Direct Hotline: +91 98765 43210</span>
                </a>
                <a
                  href="mailto:corporate@attardepot.com"
                  className="flex items-center gap-2 text-neutral-700 hover:text-[#046A5A] font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#F5B418]" />
                  <span>Institutional Email: corporate@attardepot.com</span>
                </a>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Clock className="w-4 h-4 text-[#F5B418]" />
                  <span>Hours: Mon – Sat | 10:00 AM – 7:30 PM IST</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickWhatsApp}
                className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba59] text-white transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Quick WhatsApp Inquiry</span>
              </button>
            </div>

            {/* Corporate Assurances */}
            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Tax Deductible Corporate Gift (GST Input Tax Credit)</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NDA & Confidentiality agreement supported for high-profile events</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complimentary physical sample kit for orders exceeding 50 units</span>
              </div>
            </div>
          </div>

          {/* Right Inquiry Form (Span 7) */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-neutral-200 shadow-xl space-y-5"
            >
              {selectedPackageForQuote && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                  <span>Selected Package: <strong>{selectedPackageForQuote}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPackageForQuote('');
                      setFormData((p) => ({ ...p, preferredPackage: '' }));
                    }}
                    className="text-emerald-700 hover:text-emerald-950 font-bold underline text-[11px]"
                  >
                    Clear
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Company / Organization <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="e.g. Apex Global Advisors"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Work Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="workEmail"
                    required
                    value={formData.workEmail}
                    onChange={handleInputChange}
                    placeholder="rahul@apexadvisors.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Quantity Tier & Budget Slabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Estimated Quantity
                  </label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors bg-white"
                  >
                    <option value="15-25">15 – 25 Sets (Small Executive Group)</option>
                    <option value="26-50">26 – 50 Sets</option>
                    <option value="51-100">51 – 100 Sets (Popular Tier)</option>
                    <option value="101-250">101 – 250 Sets (Volume Discount)</option>
                    <option value="251-500">251 – 500 Sets (Institutional Slab)</option>
                    <option value="500+">500+ Sets (Bespoke Production)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                    Target Budget Per Gift
                  </label>
                  <select
                    name="budgetPerGift"
                    value={formData.budgetPerGift}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors bg-white"
                  >
                    <option value="Under ₹999">Under ₹999 per hamper</option>
                    <option value="₹1,000 - ₹2,500">₹1,000 – ₹2,500 per hamper</option>
                    <option value="₹2,500 - ₹5,000">₹2,500 – ₹5,000 per hamper</option>
                    <option value="₹5,000+">₹5,000+ (Ultra Luxury / Heirloom Chests)</option>
                  </select>
                </div>
              </div>

              {/* Occasion / Event */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Occasion or Purpose
                </label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors bg-white"
                >
                  <option value="Corporate Festive Gifting (Diwali / Eid)">Corporate Festive Gifting (Diwali / Eid)</option>
                  <option value="CXO & Key Client Appreciation">CXO & Key Client Appreciation</option>
                  <option value="Annual Day / Employee Milestone Awards">Annual Day / Employee Milestone Awards</option>
                  <option value="Global Conference / Summit Welcome Kits">Global Conference / Summit Welcome Kits</option>
                  <option value="High-End Wedding / Destination Event Favors">High-End Wedding / Destination Event Favors</option>
                  <option value="Other Bespoke Requirement">Other Bespoke Requirement</option>
                </select>
              </div>

              {/* Customization Checkboxes */}
              <div className="space-y-2 pt-1 border-t border-neutral-100">
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Desired Customization Services:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="customLogo"
                      checked={formData.customLogo}
                      onChange={handleInputChange}
                      className="rounded text-[#046A5A] focus:ring-[#046A5A] w-4 h-4"
                    />
                    <span className="text-neutral-700">Custom Logo Gold Foil Stamping</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="individualShipping"
                      checked={formData.individualShipping}
                      onChange={handleInputChange}
                      className="rounded text-[#046A5A] focus:ring-[#046A5A] w-4 h-4"
                    />
                    <span className="text-neutral-700">Individual Direct Doorstep Dispatch</span>
                  </label>
                </div>
              </div>

              {/* Message / Custom Requirements */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  Additional Notes or Deadline Dates
                </label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about required delivery dates, preferred fragrance profiles (e.g. Woody Oud, Floral Rose, Kashmiri Musk), or packaging preferences..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-[#046A5A] focus:ring-1 focus:ring-[#046A5A] text-xs font-sans outline-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] hover:brightness-110 active:scale-95 border border-[#F5B418]/50 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Your Request...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#F5B418]" />
                    <span>Submit Corporate Inquiry (Fast Response)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

   
      {/* ===================================================================== */}
      {/* 8. CLOSING REGAL CALLOUT BANNER                                        */}
      {/* ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#011C16] via-[#02332A] to-[#011C16] border border-[#F5B418]/50 text-white text-center space-y-5 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F5B418]/15 border border-[#F5B418]/40 text-[#F5B418] text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#F5B418]" />
            <span>Excellence Guaranteed</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white max-w-2xl mx-auto leading-tight">
            Ready to Design an Exceptional Gifting Experience for Your Organization?
          </h2>

          <p className="font-sans text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
            Contact our dedicated Corporate Gifting Director today to receive samples, physical brochures,
            and tailored slab pricing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#inquiry-form-section"
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-[#011C16] bg-[#F5B418] hover:bg-[#FFE28A] active:scale-95 transition-all shadow-md"
            >
              Get Custom Quotation
            </a>
            <button
              type="button"
              onClick={handleQuickWhatsApp}
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-white/[0.1] hover:bg-white/[0.2] border border-white/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>WhatsApp Concierge</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
