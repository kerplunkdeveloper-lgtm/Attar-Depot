import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Droplet, Sparkles, Award, Shield, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-10 sm:space-y-16 md:space-y-20 pb-24 font-sans">
      {/* ── Hero Banner Section ─────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#012520]">
        <div className="relative w-full">
          <Image
            src="/images/aboutbanners1.png"
            alt="About Attar Depot - Sacred Heritage & Artisanal Distillation"
            width={1920}
            height={800}
            priority
            sizes="100vw"
            className="w-full h-auto object-cover block"
          />
          {/* Subtle royal emerald tint overlay */}
          <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />
          {/* Elegant bottom gradient fade to page background */}
          <div className="absolute bottom-0 left-0 right-0 h-6 sm:h-14 md:h-20 bg-gradient-to-t from-white via-white/30 to-transparent pointer-events-none" />
        </div>
      </section>

      {/* Hero Intro */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 sm:space-y-6 pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100/80 border border-emerald-200 text-xs font-bold text-emerald-800 uppercase tracking-widest font-sans">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Generational Olfactory Alchemy
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-neutral-900">
          The Sacred Heritage of Attar Depot
        </h1>
        <p className="font-sans text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-2xl mx-auto">
          We preserve the ancient art of Indian and Arabian perfumery, rejecting industrial synthetic chemicals in favor of pure steam-distilled floral petals, aged heartwoods, and authentic vintage agarwood.
        </p>
      </section>

      {/* Craftsmanship Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card border border-emerald-100 shadow-emerald-md bg-white">
            <Image
              src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1000"
              alt="Artisanal copper stills of Kannauj"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="space-y-6 text-left">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-neutral-900">
              The 400-Year-Old Deg & Bhapka Technique
            </h2>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
              In Kannauj — known as the perfume capital of India — artisans have utilized identical copper stills (*Degs*) fired by wood fires for four centuries. Vapors from simmering Damask rose petals or vetiver roots travel through bamboo pipes (*Chonga*) into submerged receiving flasks (*Bhapka*) containing pure aged sandalwood oil.
            </p>
            <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed">
              This painstaking process takes over 15 to 20 days per batch. The sandalwood acts as an organic natural sponge, binding the delicate ethereal notes and granting them an eternal life on skin.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 font-sans">
              <div className="p-5 rounded-2xl glass-card border border-emerald-100 bg-white shadow-emerald-sm">
                <span className="font-serif text-3xl font-bold text-emerald-800 block">40+ kg</span>
                <span className="font-sans text-[11px] text-neutral-500 font-medium">Rose petals per single tola</span>
              </div>
              <div className="p-5 rounded-2xl glass-card border border-emerald-100 bg-white shadow-emerald-sm">
                <span className="font-serif text-3xl font-bold text-emerald-800 block">0% Alcohol</span>
                <span className="font-sans text-[11px] text-neutral-500 font-medium">Prayer-friendly and pure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Sovereign Pillars */}
      <section className="bg-gradient-to-r from-[#ECFDF5] via-[#D1FAE5]/60 to-[#ECFDF5] border-y border-emerald-100/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-neutral-900">
              Our Sovereign Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl glass-card border border-emerald-100 space-y-3 bg-white shadow-emerald-sm text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Droplet className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Unadulterated Purity</h3>
              <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                Zero Dipropylene Glycol (DPG), white mineral oils, or synthetic fixatives. What touches your skin is 100% genuine concentrated perfume oil.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-emerald-100 space-y-3 bg-white shadow-emerald-sm text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Aged Agarwood Curation</h3>
              <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                Our Dehn Al Oudh is sourced directly from ethical private plantations in Koh Kong, Trat, and Assam, aged in dark glass carboys for decades.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-emerald-100 space-y-3 bg-white shadow-emerald-sm text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Ethical Botanical Harvest</h3>
              <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                Flowers are handpicked at pre-dawn when essential oil concentrations peak, preserving rural farming heritage and livelihoods.
              </p>
            </div>

            <div className="p-6 rounded-3xl glass-card border border-emerald-100 space-y-3 bg-white shadow-emerald-sm text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-neutral-900">Regal Crystal Flacons</h3>
              <p className="font-sans text-xs text-neutral-600 leading-relaxed">
                Bottled in thick cut-glass tolas with crystal glass dipsticks to avoid metal or plastic reaction with sensitive natural compounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-3xl mx-auto px-4 text-center space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold uppercase text-neutral-900">
          Begin Your Olfactory Odyssey
        </h2>
        <p className="font-sans text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
          Explore our collection of vintage distillations or consult our fragrance curators for bespoke selections.
        </p>
        <Link
          href="/shop"
          className="btn-emerald inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-emerald-sm text-white font-sans"
        >
          <span>Explore Sovereign Attars</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
