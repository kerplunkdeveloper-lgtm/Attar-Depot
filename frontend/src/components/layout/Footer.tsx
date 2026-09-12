'use client';

import React from 'react';
import Link from 'next/link';
import { Droplet, Sparkles, Shield, Clock, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white text-neutral-600 text-xs">
      {/* Value Badges Banner */}
      <div className="border-b border-emerald-100/80 py-10 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2.5 p-4 rounded-2xl bg-[#FAF8F2] border border-emerald-100/70 shadow-emerald-sm transition-transform hover:-translate-y-0.5 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Droplet className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              100% Pure & Alcohol-Free
            </h4>
            <p className="font-sans text-[11px] text-neutral-500 max-w-xs leading-relaxed">
              Hand-distilled concentrated perfume oils with zero synthetic alcohol fillers.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2.5 p-4 rounded-2xl bg-[#FAF8F2] border border-emerald-100/70 shadow-emerald-sm transition-transform hover:-translate-y-0.5 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              24h Eternal Sillage
            </h4>
            <p className="font-sans text-[11px] text-neutral-500 max-w-xs leading-relaxed">
              Aged resinous woods and rich botanicals that mature exquisitely throughout your day.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2.5 p-4 rounded-2xl bg-[#FAF8F2] border border-emerald-100/70 shadow-emerald-sm transition-transform hover:-translate-y-0.5 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              Artisanal Distillation
            </h4>
            <p className="font-sans text-[11px] text-neutral-500 max-w-xs leading-relaxed">
              Traditional Deg & Bhapka hydro-distillation from Kannauj and Assam forests.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2.5 p-4 rounded-2xl bg-[#FAF8F2] border border-emerald-100/70 shadow-emerald-sm transition-transform hover:-translate-y-0.5 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">
              Royal Velvet Presentation
            </h4>
            <p className="font-sans text-[11px] text-neutral-500 max-w-xs leading-relaxed">
              Each flacon is encased in custom crystal and heirloom velvet packaging.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-[0.20em] text-emerald-gradient uppercase">
                Attar Depot
              </span>
            </Link>
            <p className="font-sans text-xs text-neutral-600 leading-relaxed">
              Curators of royal heritage, timeless agarwoods, and pure non-alcoholic attars.
              Crafted for discerning collectors who appreciate true olfactory mastery.
            </p>
            <p className="font-serif text-xs text-emerald-700 font-medium italic">
              "The scent of paradise distilled into every drop."
            </p>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 border-b border-emerald-200 pb-1.5 inline-block">
              Noble Fragrance Families
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/shop?category=dehn-al-oudh" className="hover:text-emerald-700 transition-colors">
                  Vintage Dehn Al Oudh
                </Link>
              </li>
              <li>
                <Link href="/shop?category=royal-musk" className="hover:text-emerald-700 transition-colors">
                  Kashmiri White Musk & Tahara
                </Link>
              </li>
              <li>
                <Link href="/shop?category=floral-gulab-attar" className="hover:text-emerald-700 transition-colors">
                  Ruh Gulab & Kannauj Damask Rose
                </Link>
              </li>
              <li>
                <Link href="/shop?category=amber-woods" className="hover:text-emerald-700 transition-colors">
                  Golden Baltic Amber & Sandalwood
                </Link>
              </li>
              <li>
                <Link href="/shop?category=french-oriental-blends" className="hover:text-emerald-700 transition-colors">
                  French Oriental Fusion Attars
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 border-b border-emerald-200 pb-1.5 inline-block">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <Link href="/orders" className="hover:text-emerald-700 transition-colors">
                  Track Your Consignment
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-700 transition-colors">
                  The Deg & Bhapka Heritage
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-emerald-700 transition-colors">
                  Sample Discovery & Tola Flacons
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-neutral-500 hover:text-emerald-700 transition-colors font-medium">
                  Merchant / Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 border-b border-emerald-200 pb-1.5 inline-block">
              Privileged Access
            </h4>
            <p className="font-sans text-xs text-neutral-600 mb-3 leading-relaxed">
              Subscribe to receive private invitations to rare seasonal vintage barrel tappings.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-2 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-emerald-600 shadow-xs"
              />
              <button
                type="submit"
                className="w-full btn-emerald py-2 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm text-white"
              >
                Join Private Guild
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} Attar Depot Inc. Handcrafted in India. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" /> 100% Halal & Non-Alcoholic Formulations
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
