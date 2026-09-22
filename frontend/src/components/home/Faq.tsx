'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'WHAT IS THE DIFFERENCE BETWEEN PURE ATTAR AND ALCOHOL SPRAYS?',
    answer:
      'Commercial perfumes contain 80% to 90% denatured alcohol and water, causing top notes to evaporate rapidly within 1 to 2 hours. Attar Depot creations are 100% concentrated, undiluted botanical and resinous perfume oils hydro-distilled using ancient Kannauj Deg-Bhapka copper stills into pure sandalwood bases. With zero alcohol, every microscopic drop stays on your skin, gradually unfolding its rich bouquet throughout the entire day.',
  },
  {
    id: 'faq-2',
    question: 'HOW LONG DOES AN ATTAR DEPOT FRAGRANCE LAST ONCE APPLIED?',
    answer:
      'Because our oils are completely free of alcohol and filler solvents, they bond intimately with your skin’s natural warmth. Most Attar Depot formulations project alluringly for 12 to 24+ hours on skin, and linger on fabrics (like shirts, shawls, and collars) for up to 48 to 72 hours.',
  },
  {
    id: 'faq-3',
    question: 'ARE ALL YOUR ATTARS 100% HALAL, PRAYER-SAFE, AND VEGAN?',
    answer:
      'Yes, absolutely. Every single formulation at Attar Depot is strictly 100% alcohol-free, vegan, cruelty-free, and contains zero toxic parabens or phthalates. They are 100% Halal-compliant and certified prayer-safe. Since there is no harsh ethanol alcohol to strip or dry your skin, our oils are remarkably gentle on sensitive skin types.',
  },
  {
    id: 'faq-4',
    question: 'HOW SHOULD I APPLY PURE ATTAR FOR MAXIMUM PROJECTION?',
    answer:
      'A little goes a remarkably long way! Use the glass applicator rod to place 1 or 2 small dabs onto your pulse points: the inside of your wrists, behind the earlobes, and at the base of your throat. Gently tap your wrists together (avoid vigorous rubbing). You can also touch residual oil onto your collar or cuffs for an elevated scent trail.',
  },
  {
    id: 'faq-5',
    question: 'WILL NATURAL ATTAR OILS STAIN LIGHT OR WHITE GARMENTS?',
    answer:
      'Pure clear floral attars (such as Royal Jasmine, White Rose, and Citrus Musk) are practically transparent and leave no residue. Deep resinous oudhs carry rich amber hues; we advise applying these directly to your pulse points or gently touching the inner lining of your clothing rather than directly onto sheer white silk.',
  },
  {
    id: 'faq-6',
    question: 'HOW LONG WILL A 6ML OR 12ML FLACON TYPICALLY LAST?',
    answer:
      'A standard 12ml flacon contains roughly 240 to 280 drops of ultra-concentrated oil. Since you only require 1 or 2 drops per wear, a single bottle typically lasts 4 to 6 months of daily application—far outlasting standard 50ml alcohol spray bottles.',
  },
  {
    id: 'faq-7',
    question: 'WHAT ARE YOUR PAN-INDIA DELIVERY TIMELINES AND PACKAGING?',
    answer:
      'All orders are carefully hand-packaged in luxury velvet-lined, shock-absorbent gift boxes and dispatched within 24 hours. Pan-India delivery typically takes 2 to 4 business days via express air courier with live SMS and WhatsApp tracking updates.',
  },
  {
    id: 'faq-8',
    question: 'CAN I GET PERSONALIZED ADVICE TO DISCOVER MY SIGNATURE FRAGRANCE?',
    answer:
      'Yes! You can interact directly with our AI Fragrance Sommelier located at the bottom-right of your screen 24/7, or message our scent specialists directly on WhatsApp for tailored recommendations based on your occasion, personality, and preferred notes.',
  },
];

export default function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full bg-white py-14 sm:py-20 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-center font-sans text-xl sm:text-2xl font-bold tracking-wider text-neutral-900 mb-8 sm:mb-12 uppercase">
          FAQ
        </h2>

        {/* Minimalist Accordion */}
        <div className="border-t border-[#EAE3D6] divide-y divide-[#EAE3D6]">
          {FAQ_DATA.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div key={item.id} className="transition-colors duration-200">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 sm:py-6 flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                >
                  <span className="font-sans text-[12px] sm:text-[13px] md:text-sm font-semibold tracking-wider text-neutral-900 group-hover:text-emerald-950 transition-colors uppercase leading-relaxed pr-2">
                    {item.question}
                  </span>

                  <span className="text-neutral-900 shrink-0 p-1 flex items-center justify-center transition-transform duration-300">
                    {isOpen ? (
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5]" />
                    ) : (
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5] group-hover:rotate-90 transition-transform duration-200" />
                    )}
                  </span>
                </button>

                {/* Collapsible Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0 pb-0'
                  }`}
                >
                  <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl pr-6 sm:pr-10">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
