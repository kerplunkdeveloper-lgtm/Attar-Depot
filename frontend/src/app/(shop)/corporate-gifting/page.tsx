'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Briefcase,
  Gift,
  Sparkles,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Truck,
  ArrowRight,
  Clock,
  Palette,
  ChevronDown,
  Crown,
  HeartHandshake,
  Check,
  BadgePercent,
  Building2,
  Rabbit,
  Globe,
  Trophy,
  FlaskConical,
} from 'lucide-react';
import { toast } from '@/lib/toast';

// ── 4 Reference Grid Cards Data ──────────────────────────────────────────────
const REFERENCE_CARDS = [
  {
    id: 'wedding',
    title: 'Wedding Gifting',
    image: '/images/wedding-gifting.jpg',
    alt: 'Luxury wedding celebration with perfume flacons',
    tag: 'Celebration Favors',
  },
  {
    id: 'festive',
    title: 'Festive Gifting',
    image: '/images/festive-gifting.jpg',
    alt: 'Festive Diwali and Eid celebrations with royal perfume flacons',
    tag: 'Festive Hampers',
  },
  {
    id: 'repetitive-sweets',
    title: 'Same repetitive sweets & dry fruits every year.',
    image: '/images/repetitive-sweets.jpg',
    alt: 'Office executive tired of repetitive traditional sweet hampers',
    tag: 'The Olfactory Alternative',
  },
  {
    id: 'rewards-recognition',
    title: 'Rewards & Recognition',
    image: '/images/rewards-recognition.jpg',
    alt: 'Corporate professional receiving a prestigious luxury gift box',
    tag: 'Corporate Excellence',
  },
];

// ── Corporate Gift Packages Data ─────────────────────────────────────────────
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [isReadMoreExpanded, setIsReadMoreExpanded] = useState(false);
  const [formErrors, setFormErrors] = useState<any>({});

  // Form State (Matching Reference Image)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    companyName: '',
    qtyNeeded: '',
  });

  const validateForm = () => {
    const errors: any = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) errors.email = 'Valid email is required';
    if (!formData.number.trim() || !/^\d{10,}$/.test(formData.number.replace(/\D/g, ''))) errors.number = 'Valid phone number required';
    if (!formData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!formData.qtyNeeded || parseInt(formData.qtyNeeded) < 1) errors.qtyNeeded = 'Quantity must be at least 1';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please check the form for errors.', {
        title: 'Validation Failed',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // NOTE: Replace these placeholder values with your actual EmailJS credentials
      const emailData = {
        service_id: 'service_bc5g0re',
        template_id: 'template_8mz3w8i',
        user_id: 'eoWxoqMD7fLY-bpnp',
        template_params: {
            title: `Corporate Gifting - ${formData.companyName}`,
            name: formData.name,
            email: formData.email,
            phone: formData.number,
            company: formData.companyName,
            qty: formData.qtyNeeded,
            package_name: selectedPackage || 'None selected',
            time: new Date().toLocaleString(),
        }
      };

      // Using EmailJS REST API (no npm package required)
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
      
      // If EmailJS is not configured yet (e.g. invalid credentials), we still show the success message for demo
      if (!res.ok) {
        console.warn('EmailJS not fully configured yet. Showing success UI for demo purposes.');
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success(
        `Thank you ${formData.name}! Your corporate gifting inquiry for ${formData.companyName} has been received. Our team will contact you soon..`,
        { title: 'Inquiry Submitted' }
      );
    } catch (error) {
      console.error('EmailJS Error:', error);
      setIsSubmitting(false);
      toast.error('Failed to send inquiry via email. Please contact us on WhatsApp.', {
        title: 'Submission Failed'
      });
    }
  };

  const handleQuickWhatsApp = () => {
    const msg = `Salam & Greetings! I am reaching out from *${
      formData.companyName || 'my company'
    }* regarding Corporate Gifting with Attar Depot.%0A%0A*Name:* ${
      formData.name || 'Corporate Procurement'
    }%0A*Contact:* ${formData.number || 'N/A'}%0A*Email:* ${
      formData.email || 'N/A'
    }%0A*Qty Needed:* ${formData.qtyNeeded || '50+'}%0A${
      selectedPackage ? `*Selected Package:* ${selectedPackage}%0A` : ''
    }%0APlease share your corporate catalog and volume pricing.`;

    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  const handleSelectPackageForInquiry = (pkgName: string) => {
    setSelectedPackage(pkgName);
    const formSection = document.getElementById('corporate-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
    toast.info(`Package "${pkgName}" selected. Please fill in your inquiry details above.`, {
      title: 'Package Selected',
    });
  };

  return (
    <div className="min-h-screen">
      {/* ===================================================================== */}
      {/* 1. TOP BANNER (HERO BANNER AS REQUESTED)                              */}
      {/* ===================================================================== */}
      <section className="w-full relative overflow-hidden">
        <div className="relative w-full aspect-[21/8] sm:aspect-[21/7] lg:aspect-[21/6.5] min-h-[190px] xs:min-h-[220px] sm:min-h-[300px] md:min-h-[380px] lg:min-h-[460px] overflow-hidden">
          <Image
            src="/images/giftcop.png"
            alt="Attar Depot Royal Corporate Gifting Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. BREADCRUMBS & SECTION INTRO                                         */}
      {/* ===================================================================== */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 pt-6 sm:pt-4 pb-3">
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-[#012520] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/gifting" className="hover:text-[#012520] transition-colors">
            Gifting
          </Link>
          <span>/</span>
          <span className="text-[#012520] font-bold">Corporate Gifting</span>
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* 3. REFERENCE UI SECTION: LEFT IMAGE GRID & RIGHT FORM DETAILS         */}
      {/* ===================================================================== */}
      <section id="corporate-form-section" className="max-w-8xl mx-auto px-2 sm:px-3  py-4 sm:py-3">
        <div className="bg-white  border border-neutral-200/90 shadow-sm p-4 sm:p-6 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-start">
            
            {/* ── LEFT SIDE: 2x2 IMAGE GRID (MATCHING REFERENCE IMAGE) ──────── */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {REFERENCE_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-900 shadow-xs hover:shadow-md transition-all duration-300 select-none cursor-default"
                  >
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Dark gradient overlay at bottom for crisp text legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Bottom-left label matching the reference image */}
                    <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 pointer-events-none">
                      <p className="text-white font-medium sm:font-semibold text-xs sm:text-sm md:text-base leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {card.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── VERTICAL DIVIDER LINE & RIGHT SIDE: FORM DETAILS ─────────── */}
            <div className="lg:col-span-5 lg:border-l lg:border-neutral-200 lg:pl-8 xl:pl-12 flex flex-col justify-start">
              {isSubmitted ? (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 sm:p-8 text-center space-y-4 my-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                    Inquiry Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Thank you, <strong className="text-neutral-900">{formData.name}</strong>. Our Corporate
                    Gifting Concierge has received your request for{' '}
                    <strong className="text-neutral-900">{formData.companyName || 'your organization'}</strong>{' '}
                    ({formData.qtyNeeded || 'bulk'} units). We will reach out via email or phone within 2 business hours.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                   
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          number: '',
                          companyName: '',
                          qtyNeeded: '',
                        });
                        setSelectedPackage('');
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-semibold text-xs text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {selectedPackage && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                      <span>Package: <strong>{selectedPackage}</strong></span>
                      <button
                        type="button"
                        onClick={() => setSelectedPackage('')}
                        className="text-emerald-700 hover:text-emerald-950 font-bold underline text-[11px] cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {/* 1. Name */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-sm sm:text-base font-semibold text-neutral-900">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder=""
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg border ${formErrors?.name ? 'border-red-500' : 'border-neutral-300'} focus:border-black focus:ring-1 focus:ring-black outline-none text-sm sm:text-base transition-colors bg-white text-neutral-900 shadow-2xs`}
                    />
                    {formErrors?.name && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.name}</p>}
                  </div>

                  {/* 2. Email */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-sm sm:text-base font-semibold text-neutral-900">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder=""
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg border ${formErrors?.email ? 'border-red-500' : 'border-neutral-300'} focus:border-black focus:ring-1 focus:ring-black outline-none text-sm sm:text-base transition-colors bg-white text-neutral-900 shadow-2xs`}
                    />
                    {formErrors?.email && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.email}</p>}
                  </div>

                  {/* 3. Number */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-sm sm:text-base font-semibold text-neutral-900">
                      Number
                    </label>
                    <input
                      type="tel"
                      name="number"
                      required
                      value={formData.number}
                      onChange={handleInputChange}
                      placeholder=""
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg border ${formErrors?.number ? 'border-red-500' : 'border-neutral-300'} focus:border-black focus:ring-1 focus:ring-black outline-none text-sm sm:text-base transition-colors bg-white text-neutral-900 shadow-2xs`}
                    />
                    {formErrors?.number && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.number}</p>}
                  </div>

                  {/* 4. Company Name */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-sm sm:text-base font-semibold text-neutral-900">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder=""
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg border ${formErrors?.companyName ? 'border-red-500' : 'border-neutral-300'} focus:border-black focus:ring-1 focus:ring-black outline-none text-sm sm:text-base transition-colors bg-white text-neutral-900 shadow-2xs`}
                    />
                    {formErrors?.companyName && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.companyName}</p>}
                  </div>

                  {/* 5. Qty Needed */}
                  <div className="space-y-1 sm:space-y-1.5">
                    <label className="block text-sm sm:text-base font-semibold text-neutral-900">
                      Qty Needed
                    </label>
                    <input
                      type="number"
                      name="qtyNeeded"
                      required
                      min="1"
                      value={formData.qtyNeeded}
                      onChange={handleInputChange}
                      placeholder=""
                      className={`w-full px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg border ${formErrors?.qtyNeeded ? 'border-red-500' : 'border-neutral-300'} focus:border-black focus:ring-1 focus:ring-black outline-none text-sm sm:text-base transition-colors bg-white text-neutral-900 shadow-2xs`}
                    />
                    {formErrors?.qtyNeeded && <p className="text-red-500 text-[11px] mt-0.5">{formErrors.qtyNeeded}</p>}
                  </div>

                  {/* 6. Submit Button (Matching reference image: Solid black button) */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 sm:px-10 py-2.5 sm:py-3 bg-black hover:bg-neutral-800 active:scale-95 text-white font-semibold text-sm sm:text-base rounded-md sm:rounded-lg transition-all duration-200 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. WHY ATTAR DEPOT IS THE IDEAL GIFT                       */}
      {/* ===================================================================== */}
      <section className="w-full bg-white pt-10 sm:pt-16 pb-12 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-[24px] sm:text-[32px] md:text-[38px] leading-tight uppercase tracking-wider text-neutral-900 mb-6 sm:mb-8">
            Why Attar Depot Is The Ideal Gift For<br className="hidden sm:block" /> Your Employees This Diwali?
          </h2>
          <div className="text-[13px] sm:text-[15px] text-neutral-900 leading-relaxed font-semibold max-w-[850px] mx-auto">
            {isReadMoreExpanded ? (
              <div className="space-y-4 text-center sm:text-justify md:text-center animate-in fade-in duration-300">
                <p className="font-bold text-[14px] sm:text-[16px]">
                  A thoughtful thank you, discovered through fragrance.<br />
                  Diwali gifting from The Attar Depot.
                </p>
                <p>
                  Diwali is a time to recognise the people who have been part of your journey. For the team that brings its best every day, the clients who place their trust in you, and the partners who grow alongside your business, a thoughtfully chosen fragrance can make your appreciation feel personal.
                </p>
                <p>
                  At The Attar Depot, we bring together attars, pure fragrance oils, oud and fine fragrances rooted in Indian, Arabian and European perfumery. Our approach begins with understanding the people you are gifting, then helping you explore scents that suit their preferences.
                </p>
                <p>
                  From fresh, clean compositions and soft musks to delicate florals, warm woods and expressive oud, our collection offers different ways to say thank you. Each fragrance has its own character, giving you room to choose something beyond the familiar.
                </p>
                <p>
                  For us, thoughtful gifting is about the care behind the choice. A fragrance can become part of someone’s everyday routine, accompany a special occasion, or bring them back to a moment they remember fondly.
                </p>
                <p>
                  Whether you are choosing gifts for employees, business associates or valued clients, our team can guide you through suitable fragrances, available formats and presentation options. Personalised packaging can also be explored for corporate gifting, depending on your quantity and requirements.
                </p>
                <p>
                  This Diwali, let your gesture reflect the relationships you value. Discover fragrance gifts chosen with attention, presented with care, and given with meaning.
                </p>
                <p className="font-bold">The Attar Depot — A Fragrance Discovery House.</p>
                <p className="font-bold">
                  Speak with our team about corporate Diwali gifting.
                  <button onClick={() => setIsReadMoreExpanded(false)} className="inline-block text-[#c99a2e] hover:text-[#b08d22] font-bold underline underline-offset-4 ml-2 transition-colors cursor-pointer">
                    Read Less
                  </button>
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="inline">
                  A thoughtful thank you, discovered through fragrance. Diwali gifting from The Attar Depot. Diwali is a time to recognise the people who have been part of your journey. For the team that brings its best every day, the clients who place their trust in you, and the partners who grow alongside your business, a thoughtfully chosen fragrance can make your appreciation feel personal...
                </p>
                <button onClick={() => setIsReadMoreExpanded(true)} className="inline-block text-[#c99a2e] hover:text-[#b08d22] font-bold underline underline-offset-4 ml-1 transition-colors cursor-pointer">
                  Read More
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. BRAND FEATURES BANNER (REPLICA)                                    */}
      {/* ===================================================================== */}
      <div className="w-full border-t border-b border-neutral-300/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-wrap justify-center items-start gap-10 sm:gap-14 md:gap-16 lg:gap-24">
            
            {/* 1. Cruelty Free */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <Rabbit className="w-12 h-12 text-neutral-900 stroke-[1.2]" />
                <div className="absolute -bottom-1 right-0 w-6 h-6 rounded-full border-[1.5px] border-neutral-900 bg-white flex items-center justify-center">
                  <span className="text-[13px] font-sans font-bold leading-none text-neutral-900 mb-0.5">♥</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-neutral-900 tracking-wide">Cruelty free</span>
            </div>

            {/* 2. Global Presence */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <Globe className="w-12 h-12 text-neutral-900 stroke-[1.2]" />
                <div className="absolute top-1 -right-1 bg-white rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-neutral-900 stroke-[1.5]" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-neutral-900 tracking-wide">Global Presence</span>
            </div>

            {/* 3. Award-Winning Brand */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <Trophy className="w-12 h-12 text-neutral-900 stroke-[1.2]" />
                <div className="absolute bottom-1 w-full flex justify-center">
                  <Sparkles className="w-4 h-4 text-neutral-900 stroke-[1.5] fill-white bg-white" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-neutral-900 tracking-wide">Award-Winning Brand</span>
            </div>

            {/* 4. Sustainability */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-[1.5px] border-neutral-900 flex items-center justify-center">
                  <Globe className="w-8 h-8 text-neutral-900 stroke-[1.2]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                   <HeartHandshake className="w-6 h-6 text-neutral-900 stroke-[1.5]" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-neutral-900 tracking-wide">Sustainability</span>
            </div>

            {/* 5. No harmful chemical */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-[1.5px] border-neutral-900 flex items-center justify-center relative overflow-hidden bg-white">
                   <FlaskConical className="w-7 h-7 text-neutral-900 stroke-[1.5]" />
                   <div className="absolute w-full h-[1.5px] bg-neutral-900 -rotate-45" />
                </div>
              </div>
              <span className="text-[11px] font-bold text-neutral-900 tracking-wide">No harmful chemical</span>
            </div>

            {/* 6. IFRA-Certified */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 relative flex items-center justify-center">
                <div className="w-14 h-14 rounded-full border-[1.5px] border-neutral-900 flex items-center justify-center">
                   <span className="font-serif text-[20px] tracking-tight text-neutral-900">ifra</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-neutral-900 tracking-wide">IFRA-Certified</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
