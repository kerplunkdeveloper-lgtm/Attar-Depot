'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Send,
  Navigation,
  Share2,
  Crown,
  Droplets,
  ArrowRight,
} from 'lucide-react';
import { SITE_CONTACT, SocialLinkItem } from '@/config/siteContact';
import { toast } from '@/lib/toast';

export default function SocialAndConnectHubPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard!`, { title: 'Copied' });
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const getSocialIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'instagram':
        return <Instagram className={className} />;
      case 'youtube':
        return <Youtube className={className} />;
      case 'facebook':
        return <Facebook className={className} />;
      case 'twitter':
        return <Twitter className={className} />;
      case 'telegram':
        return <Send className={className} />;
      case 'whatsapp':
      default:
        return (
          <svg viewBox="0 0 24 24" className={`${className} fill-current`} xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-10 sm:py-16 px-4 sm:px-6 lg:px-8 selection:bg-[#046A5A] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* ========================================================================= */}
        {/* 1. BRAND HERO HEADER                                                      */}
        {/* ========================================================================= */}
        <div className="relative text-center space-y-4 pt-4">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#C9A227]/40 via-[#046A5A]/30 to-[#C9A227]/40 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/90 backdrop-blur-md p-2 shadow-2xl border-2 border-[#C9A227]/60 flex items-center justify-center">
                <Image
                  src="/images/logonew.png"
                  alt="Attar Depot"
                  width={100}
                  height={100}
                  priority
                  className="w-auto h-16 sm:h-20 object-contain drop-shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#046A5A]/10 border border-[#046A5A]/30 text-xs font-bold text-[#046A5A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#046A5A]" />
              <span>Verified Official Royal Perfumery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight font-serif">
              Social Channels & Contact Hub
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-sans leading-relaxed">
              Connect directly with our Master Perfumers, explore our authentic distillation reels, locate our Kannauj
              distillery on Google Maps, or message our VIP Concierge 24/7.
            </p>
          </div>

          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-neutral-200/90 shadow-xs text-xs font-bold text-neutral-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>{SITE_CONTACT.operatingHours.statusPill}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-500">{SITE_CONTACT.operatingHours.display}</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. ONE-TOUCH DIRECT CONTACT CARDS (Interactive High-Priority Actions)    */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: WhatsApp Concierge */}
          <div className="relative group bg-white/80 backdrop-blur-md border border-emerald-200/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  {getSocialIcon('whatsapp', 'w-6 h-6')}
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Instant Reply
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">WhatsApp Desk</p>
                <h3 className="text-base font-black text-neutral-900 mt-0.5">VIP Fragrance Concierge</h3>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  Personal fragrance recommendations, bottle videos & instant order assistance.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={SITE_CONTACT.whatsapp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1fa951] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Chat Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => handleCopy(SITE_CONTACT.whatsapp.display, 'wa', 'WhatsApp number')}
                title="Copy WhatsApp number"
                className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
              >
                {copiedKey === 'wa' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 2: Voice Hotline */}
          <div className="relative group bg-white/80 backdrop-blur-md border border-amber-200/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-amber-500 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#046A5A] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  Voice Call
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#046A5A] uppercase tracking-wide">Direct Hotline</p>
                <h3 className="text-base font-black text-neutral-900 mt-0.5">{SITE_CONTACT.phone.display}</h3>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  Speak directly with our Kannauj fragrance specialists for custom flacons.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={SITE_CONTACT.phone.telUrl}
                className="flex-1 py-2 px-3 rounded-xl bg-[#046A5A] hover:bg-[#035246] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Call Hotline</span>
                <Phone className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => handleCopy(SITE_CONTACT.phone.display, 'phone', 'Phone number')}
                title="Copy phone number"
                className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
              >
                {copiedKey === 'phone' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 3: VIP Email */}
          <div className="relative group bg-white/80 backdrop-blur-md border border-sky-200/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-sky-500 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-900 border border-sky-200">
                  Inquiries
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-sky-700 uppercase tracking-wide">Concierge Mail</p>
                <h3 className="text-base font-black text-neutral-900 mt-0.5 truncate">{SITE_CONTACT.email.primary}</h3>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  Corporate gifting, wedding hampers, private label distillation & exports.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={SITE_CONTACT.email.mailtoUrl}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Send Email</span>
                <Mail className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => handleCopy(SITE_CONTACT.email.primary, 'mail', 'Email address')}
                title="Copy email address"
                className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
              >
                {copiedKey === 'mail' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Card 4: Google Maps Flagship */}
          <div className="relative group bg-white/80 backdrop-blur-md border border-purple-200/80 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 border border-purple-200">
                  Kannauj & Mumbai
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">Live Location</p>
                <h3 className="text-base font-black text-neutral-900 mt-0.5">Flagship Perfumery</h3>
                <p className="text-xs text-neutral-600 mt-1 leading-snug">
                  Heritage Perfume Lane, Kannauj & Fort Heritage Studio, Mumbai.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-2">
              <a
                href={SITE_CONTACT.maps.queryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Open Map</span>
                <Navigation className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() =>
                  handleCopy(SITE_CONTACT.address.flagship.fullAddress, 'address', 'Kannauj Flagship Address')
                }
                title="Copy full address"
                className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
              >
                {copiedKey === 'address' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. OFFICIAL SOCIAL MEDIA CHANNELS (Complete Grid with Badges & Handles)  */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#C9A227]">
                <Sparkles className="w-4 h-4 text-[#C9A227]" />
                <span>Our Digital Presence</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-serif tracking-tight mt-1">
                Official Social Media Channels
              </h2>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Click any channel to follow, subscribe, or message directly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SITE_CONTACT.socialList.map((item) => {
              return (
                <div
                  key={item.id}
                  className="group relative bg-white/70 backdrop-blur-md border border-neutral-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${
                          item.gradient || 'from-neutral-800 to-neutral-900'
                        } text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}
                      >
                        {getSocialIcon(item.iconName, 'w-6 h-6 text-white stroke-[2]')}
                      </div>

                      <span
                        style={{
                          color: item.brandColor,
                          borderColor: `${item.brandColor}40`,
                          backgroundColor: `${item.brandColor}12`,
                        }}
                        className="text-[11px] font-bold px-3 py-0.5 rounded-full border"
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                        {item.name}
                      </p>
                      <h3 className="font-serif text-xl font-black text-neutral-900 tracking-tight mt-0.5 group-hover:text-[#046A5A] transition-colors">
                        {item.handle}
                      </h3>
                      <p className="text-xs text-neutral-600 leading-relaxed mt-1 font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-5 border-t border-neutral-100 flex items-center justify-between">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#046A5A] hover:text-[#023F36] transition-colors group-hover:underline"
                    >
                      <span>Visit Channel</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.url, item.id, item.name)}
                      title={`Copy ${item.name} link`}
                      className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-500 transition-colors"
                    >
                      {copiedKey === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. GOOGLE MAPS INTERACTIVE LOCATION & HERITAGE DISTILLERY                */}
        {/* ========================================================================= */}
        <div className="bg-white/80 backdrop-blur-md border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A227] uppercase tracking-wider">
                <Crown className="w-4 h-4 text-[#C9A227]" />
                <span>Visit In-Person</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 font-serif tracking-tight mt-1">
                Google Maps Location & Flagship Distillery
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                Experience the authentic aroma of slow copper deg-bhapka distillation and aged sandalwood vats.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={SITE_CONTACT.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#046A5A] hover:bg-[#035246] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>
              <a
                href={SITE_CONTACT.maps.queryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
              >
                <span>View on Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-neutral-200 shadow-inner relative">
            <iframe
              src={SITE_CONTACT.maps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Attar Depot Kannauj Distillery Location"
              className="w-full h-full"
            />
          </div>

          {/* Addresses Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#046A5A] uppercase tracking-wide">
                  1. Master Distillery & Works
                </p>
                <p className="text-sm font-black text-neutral-900">{SITE_CONTACT.address.flagship.name}</p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {SITE_CONTACT.address.flagship.fullAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(SITE_CONTACT.address.flagship.fullAddress, 'kannauj_addr', 'Kannauj Address')
                }
                title="Copy Kannauj Address"
                className="p-2 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 transition-colors shrink-0"
              >
                {copiedKey === 'kannauj_addr' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wide">
                  2. Royal Experience Boutique
                </p>
                <p className="text-sm font-black text-neutral-900">{SITE_CONTACT.address.mumbaiBoutique.name}</p>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {SITE_CONTACT.address.mumbaiBoutique.fullAddress}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(SITE_CONTACT.address.mumbaiBoutique.fullAddress, 'mumbai_addr', 'Mumbai Address')
                }
                title="Copy Mumbai Address"
                className="p-2 rounded-lg border border-neutral-200 hover:bg-white text-neutral-600 transition-colors shrink-0"
              >
                {copiedKey === 'mumbai_addr' ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. BACK TO STORE & EXPLORE LINK                                          */}
        {/* ========================================================================= */}
        <div className="text-center pt-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#046A5A] hover:bg-[#023F36] text-white font-bold text-sm shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <span>Explore Pure Attar Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
