'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export default function FloatingActionHub() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!mounted) return null;

  const whatsappMessage = encodeURIComponent(
    'Salam & Greetings! I am inquiring about Attar Depot pure perfume oils and bespoke royal fragrances.'
  );
  const whatsappUrl = `https://wa.me/919876543210?text=${whatsappMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* WhatsApp Button */}
      <div className="relative group pointer-events-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#25D366]/40"
          aria-label="Chat with fragrance concierge on WhatsApp"
        >
          {/* Subtle pulse ring */}
          <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none opacity-60" />
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 sm:w-7 sm:h-7 fill-white relative z-10 drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.276-.1-.476-.15-.677.15-.2.3-.777.98-.953 1.18-.175.2-.351.225-.652.075s-1.271-.468-2.42-1.493c-.894-.798-1.498-1.784-1.674-2.085-.175-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.15-.175.201-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.028-1.053 2.508 0 1.479 1.078 2.909 1.228 3.11.15.2 2.121 3.24 5.14 4.542.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.578-.087 1.782-.728 2.033-1.43.25-.702.25-1.304.175-1.43-.075-.126-.276-.201-.577-.351zm-5.452 7.618h-.008a9.923 9.923 0 01-5.06-1.385l-.363-.215-3.76.986 1.003-3.665-.236-.375a9.912 9.912 0 01-1.522-5.267c.005-5.485 4.468-9.947 9.957-9.947a9.897 9.897 0 017.039 2.915 9.899 9.899 0 012.914 7.042c-.006 5.487-4.468 9.906-9.964 9.906zm8.487-18.452A11.916 11.916 0 0012.02.001C5.395.001.004 5.393.001 12.02c0 2.113.551 4.175 1.6 5.993L0 24l6.155-1.614a11.954 11.954 0 005.865 1.534h.005c6.623 0 12.016-5.392 12.019-12.019a11.92 11.92 0 00-3.518-8.481z" />
          </svg>
        </a>

        {/* Hover Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/90 text-white text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md backdrop-blur-xs hidden sm:block">
          WhatsApp Concierge
        </div>
      </div>

      {/* Back To Top Button */}
      {showBackToTop && (
        <div className="relative group pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-emerald-800 border border-emerald-200/80 shadow-md hover:shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 backdrop-blur-xs"
            aria-label="Scroll back to top"
          >
            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Hover Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-neutral-900/90 text-white text-[11px] font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md backdrop-blur-xs hidden sm:block">
            Back to Top
          </div>
        </div>
      )}
    </div>
  );
}
