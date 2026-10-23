'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { SITE_CONTACT } from '@/config/siteContact';

const FAQS = [
  {
    question: 'How can I request a private olfactory blending consultation?',
    answer:
      'You can schedule a virtual or in-person consultation with our Master Perfumers directly via our WhatsApp Concierge (+91 98765 43210) or by calling our hotline. We will guide you through fragrance note layering and custom accord selection.',
  },
  {
    question: 'Are all Attar Depot perfumes 100% alcohol-free and pure?',
    answer:
      'Yes, without exception. Every single drop we offer is 100% pure, concentrated perfume oil (Ittar) formulated without ethyl alcohol, phthalates, synthetic binders, or aerosol propellants. Our oils are safe for sensitive skin and adhere to traditional Kannauj Deg-Bhapka distillation standards.',
  },
  {
    question: 'Do you create bespoke personalized wedding favors and gifting sets?',
    answer:
      'Yes! We specialize in royal wedding trousseaus, corporate milestones, and bespoke gifting. We offer custom crystal flacons, brass-inlaid teakwood chests, and wax-sealed certificates of distillation tailored to your desired notes.',
  },
  {
    question: 'How fast are orders processed and delivered across India?',
    answer:
      'Domestic orders are processed within 24–48 hours from our Mumbai & Kannauj vaults. Express air shipping delivers within 2–4 business days to major metros (Delhi, Bangalore, Chennai, Hyderabad, Kolkata) and 4–6 business days to all other pin codes.',
  },
  {
    question: 'Can I visit your flagship atelier in person?',
    answer:
      'Our Kannauj heritage works, Mumbai boutique, and Puducherry store welcome fragrance connoisseurs by appointment. Please call or message our concierge desk in advance so we can prepare an exclusive scent discovery tray for your visit.',
  },
];

export default function ContactFaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-white/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-100 shadow-[0_10px_30px_rgba(1,37,32,0.06)] space-y-6">
      {/* Header */}
      <div className="space-y-1 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-[#C9A227]" />
          <span>Assistance &amp; Guidance</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600">
          Quick answers to consultations, distillation purity, custom orders &amp; shipments.
        </p>
      </div>

      {/* FAQ Accordion List */}
      <div className="divide-y divide-emerald-50">
        {FAQS.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div key={index} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between text-left gap-4 py-2 text-neutral-900 hover:text-emerald-900 transition-colors cursor-pointer group"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-base sm:text-lg font-bold group-hover:text-[#012520] transition-colors">
                  {faq.question}
                </span>
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-emerald-100 text-emerald-900' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              {isOpen && (
                <div className="pt-2 pb-1 pr-6 animate-in fade-in-50 duration-200">
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Assistance Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#012520] to-[#046A5A] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-[#F5B418]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-white">Have a Unique Inquiries?</h4>
            <p className="text-xs text-white/75 leading-tight mt-0.5">
              Our Master Attarwala is available on WhatsApp for immediate bespoke consultation.
            </p>
          </div>
        </div>

        <a
          href={SITE_CONTACT.whatsapp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1fa951] text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-transform active:scale-95 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </section>
  );
}
