'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Search, MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { accordionVariants, luxuryEase } from '@/lib/animations';

export interface FAQItem {
  id: string;
  number: string;
  question: string;
  answer: string;
  keywords: string[];
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    number: '01',
    question: 'What is The Attar Depot?',
    answer:
      'The Attar Depot is a Fragrance Discovery House in Pondicherry, bringing together Indian attars, Arabian fragrances and selected European fine fragrances. Through sampling and personal guidance, we help you discover a scent that feels like you.',
    keywords: ['pondicherry', 'discovery house', 'indian attar', 'arabian', 'european', 'about', 'sampling'],
  },
  {
    id: 'faq-2',
    number: '02',
    question: 'What fragrances do you offer?',
    answer:
      'Our collection includes traditional attars, pure fragrance oils, oud, Arabian fragrances, selected French and European fine fragrances, bakhoor and fragrance gifts.',
    keywords: ['collection', 'traditional', 'pure oils', 'oud', 'french', 'bakhoor', 'gifts'],
  },
  {
    id: 'faq-3',
    number: '03',
    question: 'What is the difference between attar and spray perfume?',
    answer:
      'Attar is usually an oil-based fragrance applied in small amounts directly to the skin. Spray perfume generally contains fragrance concentrate diluted in alcohol or other carriers. Oils often develop gradually close to the skin, while sprays can have a more noticeable opening.',
    keywords: ['difference', 'oil based', 'alcohol spray', 'opening', 'skin', 'concentrate'],
  },
  {
    id: 'faq-4',
    number: '04',
    question: 'Are attars alcohol-free?',
    answer:
      'Traditional attars are oil-based and do not require alcohol. Contemporary formulations can vary, so our team can help you confirm whether a particular fragrance is alcohol-free.',
    keywords: ['alcohol free', 'halal', 'pure', 'formulations', 'oil'],
  },
  {
    id: 'faq-5',
    number: '05',
    question: 'How do I choose the right fragrance for me?',
    answer:
      'Start with the scents you enjoy, when you plan to wear them and how noticeable you want your fragrance to be. Our team can guide you through suitable options and help you compare them at your own pace.',
    keywords: ['choose', 'guidance', 'selection', 'notes', 'scent profile', 'recommendation'],
  },
  {
    id: 'faq-6',
    number: '06',
    question: 'How should I apply attar?',
    answer:
      'Gently dab a small amount onto your wrists, behind your ears or the sides of your neck. Allow the fragrance to settle and develop before deciding whether to apply more.',
    keywords: ['apply', 'pulse points', 'wrists', 'neck', 'ears', 'how to use', 'technique'],
  },
  {
    id: 'faq-7',
    number: '07',
    question: 'How long does attar last?',
    answer:
      'Longevity depends on the fragrance, its ingredients, your skin, the weather and the amount applied. Some fragrances remain noticeable for many hours, while lighter compositions may be more subtle.',
    keywords: ['longevity', 'duration', 'hours', 'skin chemistry', 'staying power', 'last'],
  },
  {
    id: 'faq-8',
    number: '08',
    question: 'Can I try a smaller size before buying a larger bottle?',
    answer:
      'Smaller sizes are available for selected fragrances, making it easier to explore a scent before choosing a larger bottle. Ask our team about the available sizes.',
    keywords: ['samples', 'smaller size', 'tester', 'bottle', 'trial', 'sizes'],
  },
  {
    id: 'faq-9',
    number: '09',
    question: 'Do you offer fragrance gifts and personalised packaging?',
    answer:
      'Yes. We can help you choose fragrances for birthdays, weddings, anniversaries, festivals and corporate occasions. Personalised packaging may be available depending on the quantity and your requirements.',
    keywords: ['gifting', 'weddings', 'birthdays', 'corporate', 'personalised', 'custom packaging'],
  },
  {
    id: 'faq-10',
    number: '10',
    question: 'Where is The Attar Depot located?',
    answer:
      'Visit us at No. 265, Bharathi Street, Pondicherry – 605001. Explore our collection in-store and speak with our team for personal fragrance guidance.',
    keywords: ['location', 'address', 'pondicherry', 'bharathi street', 'store', 'visit', 'directions'],
  },
];

export default function FAQsection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return FAQ_DATA;
    return FAQ_DATA.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.keywords.some((k) => k.includes(q))
    );
  }, [searchQuery]);

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: luxuryEase }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3E8] border border-[#EADBCA] text-[#012520] text-[11px] font-bold tracking-widest uppercase mb-3"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>Fragrance Knowledge Base</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05, ease: luxuryEase }}
            className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.18em] text-neutral-900 uppercase font-sans"
          >
            FREQUENTLY ASKED QUESTIONS
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: luxuryEase }}
            className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed"
          >
            Essential guidance on our pure oil attars, spray comparisons, application rituals, and discovery in Pondicherry.
          </motion.p>

          {/* Quick Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: luxuryEase }}
            className="mt-6 relative max-w-md mx-auto"
          >
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. alcohol, apply, location)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-[#EAE3D6] rounded-xl text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </motion.div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white/60 border border-[#EAE3D6] rounded-2xl">
              <p className="text-sm text-neutral-600 font-medium">No matching questions found.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-semibold text-[#012520] hover:text-[#C9A227] underline cursor-pointer"
              >
                View all 10 questions
              </button>
            </div>
          ) : (
            filteredFaqs.map((item, index) => {
              const isOpen = openId === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.03, ease: luxuryEase }}
                  className={`rounded-xl sm:rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white border-[#C9A227]/50 shadow-[0_4px_20px_rgba(201,162,39,0.08)]'
                      : 'bg-white/70 hover:bg-white border-[#EAE3D6] hover:border-[#D4C3A3] shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                      <span
                        className={`font-mono text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded transition-colors shrink-0 ${
                          isOpen
                            ? 'bg-[#012520] text-[#F5B418]'
                            : 'bg-[#FAF3E8] text-[#8C7A5B] group-hover:bg-[#F3ECE0]'
                        }`}
                      >
                        {item.number}
                      </span>
                      <span
                        className={`text-[13px] sm:text-[15px] font-semibold tracking-wide transition-colors leading-snug ${
                          isOpen
                            ? 'text-[#012520]'
                            : 'text-neutral-900 group-hover:text-[#012520]'
                        }`}
                      >
                        {item.question}
                      </span>
                    </div>

                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#012520] text-white rotate-45'
                          : 'bg-[#FAF3E8] text-neutral-600 group-hover:bg-[#F3ECE0] group-hover:text-neutral-900 rotate-0'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        variants={accordionVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-[#F5EFE6]">
                          <p className="font-sans text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
                            {item.answer}
                          </p>

                          {/* Interactive location helper for Question 10 */}
                          {item.id === 'faq-10' && (
                            <div className="mt-3 pt-3 border-t border-dashed border-[#EAE3D6] flex flex-wrap items-center gap-3">
                              <Link
                                href="/contact"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#012520] hover:text-[#C9A227] transition-colors group"
                              >
                                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                                <span>Get Directions & Visit Boutique</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Concierge & Assistance Footnote */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: luxuryEase }}
          className="mt-10 sm:mt-12 p-5 sm:p-6 rounded-2xl bg-linear-to-r from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] border border-[#EADBCA] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs"
        >
          <div>
            <h4 className="text-xs sm:text-sm font-bold tracking-wider text-neutral-900 uppercase">
              Looking for Personal Fragrance Guidance?
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-600 mt-0.5">
              Visit our boutique at Bharathi Street, Pondicherry or speak with our fragrance specialists.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#012520] text-amber-300 hover:bg-[#062E28] text-xs font-semibold tracking-wider transition-all duration-200 shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contact Boutique</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Re-export as FAQSection for flexible importing
export { FAQsection as FAQSection };
