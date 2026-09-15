'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Plus,
  Minus,
  Sparkles,
  Droplets,
  CheckCircle2,
} from 'lucide-react';

interface FaqItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  category: 'about' | 'longevity' | 'usage' | 'orders';
  tag: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    number: '01',
    question: 'What is the real difference between pure Attar and alcohol perfume sprays?',
    answer:
      'Commercial perfumes contain 80% to 90% denatured alcohol and water, causing top notes to flash off within 1 to 2 hours. Attar Depot creations are 100% concentrated, undiluted botanical and resinous perfume oils hydro-distilled using ancient Kannauj Deg-Bhapka copper stills into pure sandalwood bases. With zero alcohol, every microscopic drop stays on your skin, gradually unfolding its rich bouquet throughout the entire day.',
    category: 'about',
    tag: '100% Pure Oil',
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'How long does an Attar Depot fragrance last once applied?',
    answer:
      'Because our oils are completely free of alcohol and filler solvents, they bond intimately with your skin’s natural lipid layer and body warmth. Most Attar Depot formulations project alluringly for 12 to 24+ hours on skin, and linger on fabrics (like shirts, shawls, and collars) for up to 48 to 72 hours even through cool evening air.',
    category: 'longevity',
    tag: '24h+ Sillage',
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'Are all your attars 100% Halal, prayer-safe, and skin-friendly?',
    answer:
      'Yes, absolutely. Every single formulation at Attar Depot is strictly 100% alcohol-free, vegan, cruelty-free, and contains zero toxic parabens or phthalates. They are 100% Halal-compliant and certified prayer-safe. Since there is no harsh ethanol alcohol to strip or dry your skin, our oils are remarkably gentle on sensitive skin types.',
    category: 'about',
    tag: 'Prayer-Safe Halal',
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'How should I apply pure attar for maximum projection and scent trail?',
    answer:
      'A little goes a remarkably long way! Use the glass applicator rod to place 1 or 2 small dabs onto your pulse points: the inside of your wrists, behind the earlobes, and at the base of your throat. Gently tap your wrists together (do not vigorously rub, as friction breaks delicate top notes). You can also smooth residual oil onto the lapel of your collar for an elevated scent aura.',
    category: 'usage',
    tag: 'Application Guide',
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'Will natural attar oil stain light or white garments?',
    answer:
      'Pure clear floral attars (such as Royal Jasmine, White Rose, and Citrus Musk) are practically transparent and leave no residue. Deep resinous oudhs (like Assamese Dehn al Oudh or Amber Shamama) carry deep amber hues; we advise applying these directly to your pulse points or gently touching the inner lining of your clothing rather than directly onto sheer white silk.',
    category: 'usage',
    tag: 'Fabric Care',
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'How long will a 6ml or 12ml flacon typically last with daily wear?',
    answer:
      'A standard 12ml flacon contains roughly 240 to 280 drops of ultra-concentrated oil. Since you only require 1 or 2 drops per wear, a single bottle typically lasts 4 to 6 months of daily ritualistic application—far outlasting standard 50ml alcohol spray bottles.',
    category: 'longevity',
    tag: 'Long Lasting Value',
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'What are your Pan-India delivery timelines and packaging standards?',
    answer:
      'All orders are carefully hand-packaged in luxury velvet-lined, shock-absorbent gift boxes and dispatched within 24 hours from our Kannauj & Mumbai fulfillment hubs. Pan-India delivery typically takes 2 to 4 business days via express air courier with live SMS and WhatsApp tracking updates.',
    category: 'orders',
    tag: 'Pan-India Express',
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'Can I get personalized advice to discover my signature fragrance?',
    answer:
      'Yes! You can interact directly with our AI Fragrance Sommelier located at the bottom-right of your screen 24/7, or message our scent specialists directly on WhatsApp for tailored recommendations based on your occasion, personality, and preferred notes.',
    category: 'orders',
    tag: 'Scent Consultation',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'about', label: 'Pure Attar' },
  { key: 'longevity', label: 'Longevity' },
  { key: 'usage', label: 'Application' },
  { key: 'orders', label: 'Shipping' },
];

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']); // First FAQ open by default

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      return activeCategory === 'all' || item.category === activeCategory;
    });
  }, [activeCategory]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
        {/* Left Side: Luxury Image Card (Compact & punchy on mobile, sticky full height on desktop) */}
        <div className="lg:col-span-5 relative w-full h-[220px] xs:h-[260px] sm:h-[340px] lg:h-[680px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg lg:shadow-xl border border-emerald-900/20 bg-emerald-950 lg:sticky lg:top-24">
          <Image
            src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200"
            alt="Pure Hydro-distilled Attar Flacon and Natural Oils"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
            className="object-cover object-center brightness-90 hover:scale-105 transition-transform duration-1000"
          />

          {/* Luxury Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/60 via-transparent to-transparent hidden sm:block" />

          {/* Top Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/40 text-emerald-950 text-[10px] sm:text-[11px] font-bold tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#C9A227]" />
              <span>Imperial Kannauj Heritage</span>
            </div>
          </div>

          {/* Bottom Overlay Info & Features */}
          <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-10 space-y-2 sm:space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-emerald-300">
                100% Pure Concentrated Oils
              </span>
              <h3 className="font-serif text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                Distilled Pure. Bottled Sacred.
              </h3>
            </div>

            {/* Mobile Compact Features Badge */}
            <div className="flex sm:hidden items-center gap-1.5 text-[10px] font-medium text-white/90 pt-1 border-t border-white/15">
              <span className="inline-flex items-center gap-1 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>0% Alcohol</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Halal</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-700/50">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>24h+ Sillage</span>
              </span>
            </div>

            {/* Desktop Full Feature List */}
            <div className="hidden sm:block space-y-2 pt-1 border-t border-white/15">
              <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0% Alcohol • 100% Halal Prayer-Safe</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24+ Hour Sillage on Skin & Garments</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Traditional Deg &amp; Bhapka Copper Distillation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Accordion with +/- UI Design */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-7">
          {/* Header */}
          <div className="space-y-2 sm:space-y-2.5 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest font-sans">
              <Droplets className="w-3 h-3 text-emerald-600" />
              <span>Attar Knowledge Base</span>
            </div>

            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight leading-tight">
              Frequently Asked Questions
            </h2>

            <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl">
              Everything you need to know about our hydro-distilled pure concentrated perfume oils, longevity, and royal application rituals.
            </p>
          </div>

          {/* Touch-Friendly Horizontal Swipeable Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shrink-0 transition-all active:scale-95 ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs border border-emerald-900'
                      : 'bg-neutral-100 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-900 border border-transparent hover:border-emerald-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Accordion List with +/- Icons */}
          <div className="space-y-2.5 sm:space-y-3.5">
            {filteredFaqs.map((faq) => {
              const isOpen = openIds.includes(faq.id);

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white ${
                    isOpen
                      ? 'border-emerald-300 shadow-md ring-1 ring-emerald-100'
                      : 'border-neutral-200/80 hover:border-emerald-200 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full text-left p-3.5 xs:p-4 sm:p-5 flex items-start justify-between gap-3 sm:gap-4 cursor-pointer select-none group active:bg-neutral-50/80 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
                      {/* Number Indicator aligned to top */}
                      <span
                        className={`text-xs sm:text-sm font-bold tracking-wider font-serif transition-colors mt-0.5 shrink-0 ${
                          isOpen ? 'text-emerald-800' : 'text-neutral-400 group-hover:text-emerald-700'
                        }`}
                      >
                        {faq.number}
                      </span>

                      {/* Question Text */}
                      <h3
                        className={`font-serif text-xs xs:text-sm sm:text-base md:text-lg font-bold transition-colors leading-snug ${
                          isOpen
                            ? 'text-emerald-950'
                            : 'text-neutral-800 group-hover:text-emerald-900'
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    {/* +/- Button UI - Responsive sizing */}
                    <div
                      className={`w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5 shadow-2xs ${
                        isOpen
                          ? 'bg-emerald-800 text-amber-300 rotate-0'
                          : 'bg-neutral-100 text-neutral-600 group-hover:bg-emerald-50 group-hover:text-emerald-800'
                      }`}
                    >
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:rotate-90" />
                      )}
                    </div>
                  </button>

                  {/* Expandable Answer */}
                  {isOpen && (
                    <div className="px-3.5 pb-4 pt-0 xs:px-4 xs:pb-4.5 sm:px-5 sm:pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans border-t border-emerald-50/80 bg-gradient-to-b from-emerald-50/20 to-transparent">
                      <p className="pl-6 xs:pl-7 sm:pl-8 pt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
