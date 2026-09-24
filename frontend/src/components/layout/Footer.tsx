'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Droplet,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  ExternalLink,
  ArrowRight,
  Send,
  Check,
  Crown,
  Compass,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { data: dynamicCategories = [] } = useCategories();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Curated category collections fallback
  const curatedCategories = [
    { name: 'Vintage Dehn Al Oudh', href: '/shop?category=dehn-al-oudh' },
    { name: 'Kashmiri White Musk & Tahara', href: '/shop?category=royal-musk' },
    { name: 'Ruh Gulab (Damask Rose)', href: '/shop?category=floral-gulab-attar' },
    { name: 'Golden Baltic Amber & Woods', href: '/shop?category=amber-woods' },
    { name: 'French Oriental Fusion Attars', href: '/shop?category=french-oriental-blends' },
    { name: 'Sacred Mysore Sandalwood', href: '/shop?category=sandalwood' },
    { name: 'Artisanal Mukhallat & Bakhoor', href: '/shop?category=mukhallat' },
  ];

  // If dynamic categories exist from database, use them or merge
  const displayCategories =
    dynamicCategories.length > 0
      ? dynamicCategories.slice(0, 7).map((cat) => ({
          name: cat.name,
          href: `/shop?category=${cat.slug || cat._id}`,
        }))
      : curatedCategories;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-[#063323] via-[#042419] to-[#021810] text-[#FAF8F2] border-t-2 border-[#F5B418]/30 overflow-hidden font-sans">
      {/* Ambient Luxury Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F5B418]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />




      {/* ========================================================================= */}
      {/* 2. MAIN FOOTER CONTENT GRID                                               */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* --------------------------------------------------------------------- */}
          {/* COL 1: Official Brand Logo & About (Span 4)                           */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand Logo */}
            <Link href="/" className="inline-block group" aria-label="Attar Depot Home">
              <div className="relative">
                <Image
                  src="/images/logonew.png"
                  alt="Attar Depot - Pure Essence of Royalty"
                  width={280}
                  height={80}
                  priority
                  className="h-14 sm:h-40 w-auto object-contain drop-shadow-[0_4px_20px_rgba(245,180,24,0.45)] group-hover:scale-105 group-hover:brightness-110 transition-all duration-300"
                />
              </div>
            </Link>



            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-[#F5B418]/25 backdrop-blur-sm">
              <p className="font-serif text-xs text-[#F5B418] italic flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F5B418] shrink-0" />
                <span>&ldquo;The scent of paradise distilled into every precious drop.&rdquo;</span>
              </p>
            </div>

            {/* Social Media Section */}
            <div className="space-y-3 pt-2">
              <span className="font-serif text-xs font-bold uppercase tracking-widest text-[#F5B418] block">
                Follow Our Olfactory Journey
              </span>
              <div className="flex items-center space-x-3">
                {/* Instagram */}
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#042419] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#042419] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#042419] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/919876543210?text=Hello%20Attar%20Depot%20Team,%20I%20would%20like%20assistance%20with%20fragrances."
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Concierge"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#042419] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#042419] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* COL 2: Menu Shortcuts (Span 2 or 3)                                   */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block border-b-2 border-[#F5B418] pb-1.5">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F5B418]">
                Menu Shortcuts
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF8F2]/80">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Explore All Perfumes</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?filter=bestsellers"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Best Sellers</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?filter=new"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Rare New Arrivals</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/gifting"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Artisanal Gift Sets</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Our Heritage & Craft</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Track Consignment</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>Contact Royal Concierge</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/70" />
                  <span>VIP Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 text-[#FAF8F2]/60 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/40" />
                  <span>Merchant Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* COL 3: Shop Category Collections (Span 3)                             */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-block border-b-2 border-[#F5B418] pb-1.5">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F5B418]">
                Category Collections
              </h4>
            </div>
            <ul className="space-y-2.5 text-xs font-sans text-[#FAF8F2]/80">
              {displayCategories.map((cat, idx) => (
                <li key={idx}>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418]/60 group-hover:bg-[#F5B418] group-hover:scale-125 transition-all shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 pt-1 text-[11px] font-semibold text-[#F5B418] hover:underline"
                >
                  <span>View Full Fragrance Vault</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* COL 4: Boutique Address, Location & Concierge (Span 3)                */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-block border-b-2 border-[#F5B418] pb-1.5">
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#F5B418]">
                Boutique & Location
              </h4>
            </div>

            <div className="space-y-3.5 text-xs text-[#FAF8F2]/85">
              {/* Address / Google Maps Link */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-[#F5B418]/30 flex items-center justify-center text-[#F5B418] shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-[#F5B418]">Flagship Perfumery & Works</p>
                  <p className="text-[11px] text-[#FAF8F2]/75 leading-relaxed">
                    Heritage Perfume Lane, Near Jama Masjid, Kannauj & Fort, Mumbai, India - 209725
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Kannauj+Perfume+Market+India"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#F5B418] hover:text-[#FDE047] font-medium underline underline-offset-2"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Direct Phone Call Link */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-[#F5B418]/30 flex items-center justify-center text-[#F5B418] shrink-0 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#FAF8F2]/60">Concierge Desk</p>
                  <a
                    href="tel:+919876543210"
                    className="text-xs font-semibold text-[#F5B418] hover:text-[#FDE047] transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Direct WhatsApp Chat Link */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-[#F5B418]/30 flex items-center justify-center text-[#F5B418] shrink-0 mt-0.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#FAF8F2]/60">WhatsApp Orders</p>
                  <a
                    href="https://wa.me/919876543210?text=Hello%20Attar%20Depot,%20I%20would%20like%20to%20place%20an%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-[#FAF8F2]/90 hover:text-[#F5B418] transition-colors flex items-center gap-1"
                  >
                    <span>Chat With Master Attarwala</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#F5B418]" />
                  </a>
                </div>
              </div>

              {/* Direct Email Link */}
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-[#F5B418]/30 flex items-center justify-center text-[#F5B418] shrink-0 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] text-[#FAF8F2]/60">VIP Enquiries & Exports</p>
                  <a
                    href="mailto:concierge@attardepot.com"
                    className="text-xs font-semibold text-[#F5B418] hover:text-[#FDE047] transition-colors"
                  >
                    concierge@attardepot.com
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="pt-2 border-t border-[#F5B418]/15 text-[11px] text-[#FAF8F2]/70 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#F5B418] shrink-0" />
                <span>Mon - Sat: 10:00 AM - 9:00 PM IST</span>
              </div>
            </div>
          </div>
        </div>

       

        {/* ======================================================================= */}
        {/* 4. COPYRIGHT & ROYAL ASSURANCE BAR                                      */}
        {/* ======================================================================= */}
        <div className="mt-12 pt-6 border-t border-[#F5B418]/20 text-center flex flex-col md:flex-row items-center justify-between text-xs text-[#FAF8F2]/65 gap-4">
          <p>© {currentYear} Attar Depot Inc. Handcrafted in India. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <a 
              href="https://kerplunkmedia.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#031e14] border border-[#F5B418]/40 hover:border-[#F5B418] group overflow-hidden transition-all duration-300 shadow-[0_0_10px_rgba(245,180,24,0.1)]"
            >
              {/* Blinking border glow effect */}
              <span className="absolute inset-0 border border-[#F5B418] rounded-full animate-pulse opacity-60 pointer-events-none"></span>
              <span className="absolute inset-0 bg-[#F5B418]/5 group-hover:bg-[#F5B418]/15 transition-colors duration-300 pointer-events-none"></span>
              
              <span className="relative z-10 text-[#FAF8F2]/80 group-hover:text-white transition-colors font-sans tracking-wide">
                Developed by <strong className="text-[#F5B418] font-bold tracking-wider drop-shadow-sm">Kerplunk Media</strong>
              </span>
            </a>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-[#FAF8F2]/60">
            <Link href="/about" className="hover:text-[#F5B418] transition-colors">
              Purity Guarantee
            </Link>
            <span>•</span>
            <Link href="/orders" className="hover:text-[#F5B418] transition-colors">
              Dispatch Concierge
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-[#F5B418] transition-colors">
              Merchant Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

