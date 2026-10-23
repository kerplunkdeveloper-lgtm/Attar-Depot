'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
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
  PackageCheck,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { SITE_CONTACT } from '@/config/siteContact';

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

  const displayCategories =
    dynamicCategories.length > 0
      ? dynamicCategories.slice(0, 7).map((cat) => ({
          name: cat.name,
          href: `/shop?category=${cat.slug || cat._id}`,
        }))
      : curatedCategories;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative text-[#FAF8F2] border-t-2 border-[#F5B418]/30 overflow-hidden font-sans select-none">
      {/* Footer Panoramic Background with greenbgnew.jpeg */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        <Image
          src="/images/greenbgnew.jpeg"
          alt="Footer Background"
          fill
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Subtle glassmorphic depth & ambient tint for high contrast & legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(1, 28, 22, 0.62) 0%, rgba(1, 20, 15, 0.78) 40%, rgba(0, 14, 10, 0.94) 100%)',
          }}
        />
        {/* Top 24k gold hairline border accent */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5B418]/70 to-transparent" />
      </div>

     

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-28 lg:pb-16 relative z-10 select-text">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* --------------------------------------------------------------------- */}
          {/* COL 1: Official Brand Logo & About (Span 4)                           */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            {/* Brand Logo - Responsive, Sharp, Perfectly Scaled with Regal Glow */}
            <div className="space-y-2">
              <Link href="/" className="inline-block focus:outline-none" aria-label="Attar Depot Home">
                <div className="relative inline-flex items-center">
                  <Image
                    src="/images/logonew.png"
                    alt="The Attar Depot - Pure Essence of Royalty"
                    width={360}
                    height={110}
                    priority
                    quality={95}
                    className="h-[90px] min-[380px]:h-[100px] sm:h-[110px] lg:h-[120px] w-auto max-w-[230px] min-[380px]:max-w-[260px] sm:max-w-[290px] lg:max-w-[400px] object-contain drop-shadow-[0_4px_22px_rgba(245,180,24,0.45)]"
                  />
                </div>
              </Link>

              {/* Regal Heritage Tag */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-[#F5B418]/30 backdrop-blur-xs">
                  <Crown className="w-3 h-3 text-[#F5B418]" />
                  <span className="text-[10px] sm:text-[10.5px] font-serif uppercase tracking-[0.18em] text-[#F5B418] font-bold">
                    Kannauj Heritage • Deg-Bhapka Distillations
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-[12.5px] text-[#FAF8F2]/75 leading-relaxed font-sans pr-2">
              Preserving the sacred centuries-old art of Deg &amp; Bhapka hydro-distillation from Kannauj. Every crystal flacon contains the hydro-distilled essence of pure botanicals, 100% free from alcohol and synthetic enhancers.
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.04] border border-[#F5B418]/25 backdrop-blur-sm shadow-inner">
              <p className="font-serif text-xs text-[#F5B418] italic flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F5B418] shrink-0" />
                <span>&ldquo;The scent of paradise distilled into every precious drop.&rdquo;</span>
              </p>
            </div>

            {/* Social Media Section */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-serif text-[11px] font-bold uppercase tracking-widest text-[#F5B418]">
                  Follow Our Journey
                </span>
                <Link
                  href="/social"
                  className="text-[10.5px] font-bold text-[#F5B418] hover:text-white flex items-center gap-1 transition-colors underline underline-offset-2"
                >
                  <span>All Channels</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </Link>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href={SITE_CONTACT.socials.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#012520] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook */}
                <a
                  href={SITE_CONTACT.socials.facebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#012520] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* YouTube */}
                <a
                  href={SITE_CONTACT.socials.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#012520] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Youtube className="w-4 h-4" />
                </a>

                {/* WhatsApp */}
                <a
                  href={SITE_CONTACT.whatsapp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Concierge"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#012520] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>

                {/* Twitter / X */}
                <a
                  href={SITE_CONTACT.socials.twitter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full flex items-center justify-center bg-white/[0.06] border border-[#F5B418]/40 text-[#F5B418] hover:bg-[#F5B418] hover:text-[#012520] hover:scale-110 hover:shadow-[0_0_15px_rgba(245,180,24,0.5)] transition-all duration-300"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* COL 2: Fragrance Vault (Span 2)                                        */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5B418]">
                Fragrance Vault
              </h4>
              <div className="w-8 h-[2px] bg-gradient-to-r from-[#F5B418] to-transparent rounded-full mt-1.5" />
            </div>
            <ul className="space-y-2 text-xs font-sans text-[#FAF8F2]/80">
              {displayCategories.map((cat, idx) => (
                <li key={idx}>
                  <Link
                    href={cat.href}
                    className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418]/50 group-hover:bg-[#F5B418] group-hover:scale-125 transition-all shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F5B418] hover:text-white transition-colors underline underline-offset-2"
                >
                  <span>Explore Entire Vault</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* COL 3: Boutique & Guidance (Span 2)                                   */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5B418]">
                Boutique & Guidance
              </h4>
              <div className="w-8 h-[2px] bg-gradient-to-r from-[#F5B418] to-transparent rounded-full mt-1.5" />
            </div>
            <ul className="space-y-2 text-xs font-sans text-[#FAF8F2]/80">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/60 shrink-0" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/60 shrink-0" />
                  <span>Our Heritage & Craft</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/gifting"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/60 shrink-0" />
                  <span>Artisanal Gift Sets</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate-gifting"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/60 shrink-0" />
                  <span>Corporate Gifting</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/60 shrink-0" />
                  <span>Scent Guidance & FAQs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/60 shrink-0" />
                  <span>Track Consignment</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/60 shrink-0" />
                  <span>VIP Royal Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 text-[#FAF8F2]/60 hover:text-[#F5B418] hover:translate-x-1 transition-all duration-200"
                >
                  <ArrowRight className="w-3 h-3 text-[#F5B418]/40 shrink-0" />
                  <span>Merchant Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* COL 4: Boutique Location & Concierge Desk (Span 4)                    */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h4 className="font-serif text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5B418]">
                Boutique & Concierge
              </h4>
              <div className="w-8 h-[2px] bg-gradient-to-r from-[#F5B418] to-transparent rounded-full mt-1.5" />
            </div>

            <div className="space-y-3 text-xs text-[#FAF8F2]/85">
              {/* Flagship Boutique & Maps */}
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-[#F5B418]/20 hover:border-[#F5B418]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F5B418]/25 to-transparent border border-[#F5B418]/30 flex items-center justify-center text-[#F5B418] shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="space-y-0.5 min-w-0 flex-1">
                  <p className="font-semibold text-xs text-[#F5B418]">{SITE_CONTACT.address.puducherry.name}</p>
                  <p className="text-[11px] text-[#FAF8F2]/70 leading-relaxed truncate sm:text-wrap">
                    {SITE_CONTACT.address.puducherry.fullAddress}
                  </p>
                  <a
                    href={SITE_CONTACT.maps.queryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] text-[#F5B418] hover:text-[#FDE047] font-semibold underline underline-offset-2 pt-0.5"
                  >
                    <span>{SITE_CONTACT.maps.label}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Direct Phone Concierge */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-[#F5B418]/20 hover:border-[#F5B418]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F5B418]/25 to-transparent border border-[#F5B418]/30 flex items-center justify-center text-[#F5B418] shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#FAF8F2]/60 uppercase tracking-wider">Master Perfumer Desk</p>
                    <a
                      href={SITE_CONTACT.phone.telUrl}
                      className="text-xs font-bold text-[#FAF8F2] hover:text-[#F5B418] transition-colors"
                    >
                      {SITE_CONTACT.phone.display}
                    </a>
                  </div>
                  <span className="text-[9.5px] font-bold text-[#F5B418] bg-[#F5B418]/15 px-2 py-0.5 rounded-full border border-[#F5B418]/30">
                    Call Direct
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Concierge */}
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/[0.03] border border-[#F5B418]/20 hover:border-[#F5B418]/40 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] shrink-0">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#FAF8F2]/60 uppercase tracking-wider">WhatsApp Specialist</p>
                    <a
                      href={SITE_CONTACT.whatsapp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#25D366] hover:underline"
                    >
                      Chat With Master Attarwala
                    </a>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#25D366]" />
                </div>
              </div>

              {/* Operating Hours & Dispatch Schedule */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-[#FAF8F2]/70">
                <Clock className="w-3.5 h-3.5 text-[#F5B418] shrink-0" />
                <span>{SITE_CONTACT.operatingHours.display}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 4. COPYRIGHT, KERPLUNK MEDIA & LEGAL BAR                                */}
        {/* ======================================================================= */}
        <div className="mt-12 pt-6 border-t border-[#F5B418]/20 flex flex-col md:flex-row items-center justify-between text-xs text-[#FAF8F2]/70 gap-4">
          <p className="text-center md:text-left">
            © {currentYear} The Attar Depot Inc. Handcrafted in Kannauj &amp; Puducherry, India. All Rights Reserved.
          </p>

          {/* Kerplunk Media Developer Badge */}
          <div className="flex items-center justify-center">
            <a
              href="https://kerplunkmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#021d15] border border-[#F5B418]/40 hover:border-[#F5B418] group overflow-hidden transition-all duration-300 shadow-[0_0_12px_rgba(245,180,24,0.18)] active:scale-95"
            >
              <span className="absolute inset-0 border border-[#F5B418] rounded-full animate-pulse opacity-60 pointer-events-none" />
              <span className="absolute inset-0 bg-[#F5B418]/5 group-hover:bg-[#F5B418]/15 transition-colors duration-300 pointer-events-none" />
              <span className="relative z-10 text-[#FAF8F2]/80 group-hover:text-white transition-colors text-xs font-sans tracking-wide">
                Developed by <strong className="text-[#F5B418] font-bold tracking-wider drop-shadow-sm">Kerplunk Media</strong>
              </span>
            </a>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-[#FAF8F2]/65">
            <Link href="/about" className="hover:text-[#F5B418] transition-colors">
              Our Heritage
            </Link>
            <span>•</span>
            <Link href="/orders" className="hover:text-[#F5B418] transition-colors">
              Track Orders
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-[#F5B418] transition-colors">
              Help &amp; FAQ
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
