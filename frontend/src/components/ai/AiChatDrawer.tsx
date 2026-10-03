'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleAiChat } from '@/store/uiSlice';
import { useAiChat } from '@/hooks/useAiChat';
import { useFeaturedProducts } from '@/hooks/useProducts';
import AiProductCard from './AiProductCard';
import AttarDepotLogo from '@/components/common/AttarDepotLogo';
import {
  Sparkles,
  X,
  Send,
  User,
  RotateCcw,
  ShoppingBag,
  ChevronRight,
  Compass,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants, popSpring, luxuryEase } from '@/lib/animations';

const QUICK_INSPIRATIONS = [
  {
    label: 'Woody & Oudh',
    icon: '🪵',
    desc: 'Aged, smoky & resinous notes',
    query: 'Show me woody and long lasting pure oudh attars',
  },
  {
    label: 'Royal Kashmiri Musk',
    icon: '👑',
    desc: 'Velvety, soft & powdery essence',
    query: 'Kashmiri white musk pure attar oil for daily wear',
  },
  {
    label: 'Kannauj Florals',
    icon: '🌸',
    desc: 'Hydro-distilled fresh rose petals',
    query: 'Kannauj gulab rose floral perfume oil',
  },
  {
    label: 'Under ₹2000 Luxury',
    icon: '💎',
    desc: 'Pocket-friendly artisan flacons',
    query: 'Best perfumes under ₹2000 budget',
  },
];

export default function AiChatDrawer() {
  const dispatch = useAppDispatch();
  const { isAiChatOpen } = useAppSelector((state) => state.ui);
  const { messages, sendMessage, isThinking, retryLast, clearChat } = useAiChat();
  const { data: featuredData, isLoading: isFeaturedLoading } = useFeaturedProducts();

  const [inputMessage, setInputMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Real suggestion products fetched from inventory
  const suggestionProducts =
    featuredData?.bestSellers?.length
      ? featuredData.bestSellers
      : featuredData?.featured || [];

  // Auto-scroll to bottom of messages
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Lock body scroll on mobile when chat drawer is open
  useEffect(() => {
    if (isAiChatOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';

      scrollToBottom('auto');
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom('smooth');
      }, 300);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;
        clearTimeout(timer);
      };
    }
  }, [isAiChatOpen]);

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, isThinking, isAiChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isThinking) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleChipClick = (chipText: string) => {
    const cleanText = chipText.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendMessage(cleanText || chipText);
  };

  const pathname = usePathname();

  if (!mounted) return null;
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Floating Launcher Button */}
      <AnimatePresence>
        {!isAiChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={popSpring}
            className="fixed bottom-20 left-4 sm:bottom-6 sm:right-24 z-40 pointer-events-auto"
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => dispatch(toggleAiChat(true))}
              className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#012520] via-[#023830] to-[#012520] shadow-[0_8px_32px_rgba(0,0,0,0.45)] hover:shadow-[0_12px_40px_rgba(245,180,24,0.35)] transition-all border-2 border-[#F5B418]/60 group focus:outline-none cursor-pointer"
              aria-label="Open Royal Fragrance AI Concierge"
            >
              {/* Golden Ambient Glow */}
              <span className="absolute -inset-1 rounded-full bg-[#F5B418]/25 blur-md group-hover:opacity-100 opacity-60 transition-opacity" />

              {/* Logo inside */}
              <div className="text-[#F5B418] drop-shadow-[0_0_8px_rgba(245,180,24,0.6)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                <AttarDepotLogo variant="icon" className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              {/* Online indicator dot on bottom right */}
              <span className="absolute bottom-0 right-0 flex h-4 w-4 sm:h-4 sm:w-4 z-20">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F5B418] opacity-75" />
                <span className="relative inline-flex rounded-full h-full w-full bg-[#F5B418] border-2 border-[#012520]" />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Luxury Chat Drawer / Concierge Modal */}
      <AnimatePresence>
        {isAiChatOpen && (
          <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-[130] flex flex-col justify-end sm:justify-start items-end pointer-events-auto">
            {/* Mobile backdrop with smooth touch dismiss */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-neutral-950/75 backdrop-blur-xs sm:hidden z-0"
              onClick={() => dispatch(toggleAiChat(false))}
            />

            {/* Chat Container: Full viewport height on mobile, luxury floating card on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative z-10 w-full h-[100dvh] sm:h-[680px] sm:max-h-[88vh] sm:w-[440px] bg-[#FAF8F2] sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] border-0 sm:border sm:border-[#F5B418]/40 flex flex-col overflow-hidden"
            >
              {/* ========================================================= */}
              {/* 1. ROYAL CONCIERGE HEADER                                */}
              {/* ========================================================= */}
              <div className="pt-[max(0.65rem,env(safe-area-inset-top,0px))] pb-3 px-4 bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-white flex flex-col shadow-lg border-b border-[#F5B418]/30 relative z-10 shrink-0">
                {/* Mobile grab handle to hint dismissal */}
                <div
                  onClick={() => dispatch(toggleAiChat(false))}
                  className="w-12 h-1 rounded-full bg-[#F5B418]/40 hover:bg-[#F5B418]/70 mx-auto mb-2 sm:hidden cursor-pointer active:scale-95 transition-all"
                  aria-label="Swipe down to close"
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Glowing Logo Icon Badge */}
                    <div className="relative w-10 h-10 rounded-2xl bg-[#011C16] border border-[#F5B418]/50 flex items-center justify-center backdrop-blur-md shrink-0 shadow-[0_0_12px_rgba(245,180,24,0.25)] p-1.5">
                      <AttarDepotLogo variant="icon" className="w-full h-full text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)]" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#012520] shadow-[0_0_6px_#34D399]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-[#FAF8F2] tracking-wide">
                          The Attar Depot AI
                        </h3>
                        <span className="text-[8.5px] px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F5B418] to-[#D4AF37] text-[#012520] font-black uppercase tracking-widest shadow-xs">
                          CONCIERGE
                        </span>
                      </div>
                      <p className="text-[10px] text-[#F5B418]/80 font-sans tracking-wider uppercase">
                        Royal Fragrance Consultant
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={clearChat}
                      title="Reset conversation"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-neutral-300 hover:text-[#F5B418] hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                      aria-label="Reset conversation"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => dispatch(toggleAiChat(false))}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-neutral-300 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                      aria-label="Close Chat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ========================================================= */}
              {/* 2. CHAT MESSAGES SCROLL AREA                             */}
              {/* ========================================================= */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 bg-[#FAF8F2] overscroll-contain">
                {/* Discovery Welcome Card on First Load */}
                {messages.length <= 1 && (
                  <div className="bg-white rounded-2xl p-4 border border-[#F5B418]/30 shadow-[0_4px_20px_rgba(1,37,32,0.06)] space-y-4">
                    {/* Brand Banner */}
                    <div className="flex flex-col items-center text-center pb-3 border-b border-[#F5B418]/20">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#012520] to-[#023830] border border-[#F5B418]/40 flex items-center justify-center shadow-md mb-2">
                        <AttarDepotLogo variant="icon" className="w-6 h-6 text-[#F5B418] drop-shadow-[0_0_6px_rgba(245,180,24,0.6)]" />
                      </div>
                      <h4 className="font-serif text-base font-bold text-neutral-900 tracking-wider">
                        THE ATTAR DEPOT
                      </h4>
                      <p className="text-[10.5px] text-[#046A5A] font-semibold tracking-wide mt-0.5">
                        Royal Fragrance Concierge • 100% Pure & Alcohol-Free
                      </p>
                    </div>

                    {/* Popular Fragrance Journeys */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-neutral-900 font-serif font-bold text-xs tracking-wide">
                        <Compass className="w-3.5 h-3.5 text-[#C9A227]" />
                        <span>Popular Fragrance Journeys</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {QUICK_INSPIRATIONS.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleChipClick(item.query)}
                            className="text-left p-2.5 rounded-xl bg-gradient-to-br from-white to-[#FAF8F2] hover:to-emerald-50/60 text-[#012520] border border-[#F5B418]/25 hover:border-[#F5B418] text-[11px] font-medium transition-all active:scale-95 flex flex-col justify-between group shadow-2xs cursor-pointer"
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className="text-base select-none">{item.icon}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-[#C9A227] group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <span className="font-bold text-[11.5px] leading-tight text-neutral-900 group-hover:text-[#046A5A]">
                              {item.label}
                            </span>
                            <span className="text-[9.5px] text-neutral-500 line-clamp-1 mt-0.5">
                              {item.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ======================================================= */}
                    {/* LIVE SUGGESTION PRODUCTS CAROUSEL (REQUESTED FEATURE)   */}
                    {/* ======================================================= */}
                    {suggestionProducts.length > 0 && (
                      <div className="pt-2 border-t border-[#F5B418]/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-serif font-bold text-neutral-900 tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-[#F5B418]" />
                            <span>Curated Suggestions for You</span>
                          </div>
                          <span className="text-[10px] font-semibold text-[#046A5A] uppercase tracking-wider">
                            Handpicked
                          </span>
                        </div>

                        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 -mx-2 px-2 snap-x snap-mandatory scrollbar-none">
                          {suggestionProducts.slice(0, 6).map((product) => (
                            <AiProductCard key={product._id} product={product} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Feed */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    } space-y-1.5`}
                  >
                    {/* Sender Tag */}
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium px-1">
                      {msg.sender === 'ai' ? (
                        <>
                          <div className="w-4 h-4 rounded-full bg-[#012520] border border-[#F5B418]/50 flex items-center justify-center p-0.5">
                            <AttarDepotLogo variant="icon" className="w-full h-full text-[#F5B418]" />
                          </div>
                          <span className="font-bold text-[#012520]">Attar Depot AI</span>
                        </>
                      ) : (
                        <>
                          <span>You</span>
                          <User className="w-3 h-3 text-neutral-400" />
                        </>
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[92%] sm:max-w-[85%] p-3.5 sm:p-4 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#012520] via-[#023830] to-[#012520] text-white border border-[#F5B418]/30 rounded-br-2xs shadow-md font-normal'
                          : msg.isError
                          ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-2xs'
                          : 'bg-white text-neutral-900 border-l-3 border-l-[#F5B418] border-y border-r border-emerald-100/90 rounded-bl-2xs shadow-[0_2px_12px_rgba(1,37,32,0.06)]'
                      }`}
                    >
                      <div className="whitespace-pre-line prose-xs">
                        {msg.text}
                      </div>

                      {/* Retry button if error */}
                      {msg.isError && (
                        <button
                          onClick={retryLast}
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-100 text-rose-900 text-[11px] font-bold hover:bg-rose-200 active:scale-95 transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Try Again</span>
                        </button>
                      )}
                    </div>

                    {/* Recommended Products Carousel inside Chat Response */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="w-full pt-1.5">
                        <div className="flex items-center justify-between mb-1.5 px-1">
                          <span className="text-[11px] font-bold text-[#012520] uppercase tracking-wider flex items-center gap-1 font-serif">
                            <Sparkles className="w-3 h-3 text-[#F5B418]" /> Recommended Flacons
                          </span>
                          <span className="text-[10px] text-[#046A5A] font-bold">
                            {msg.products.length} perfume{msg.products.length > 1 ? 's' : ''}
                          </span>
                        </div>

                        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 -mx-2 px-2 snap-x snap-mandatory scrollbar-none">
                          {msg.products.map((product) => (
                            <AiProductCard key={product._id} product={product} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick Action Suggestion Chips */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="w-full pt-1">
                        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                          {msg.quickReplies.map((chip, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleChipClick(chip)}
                              className="shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-[#012520] border border-[#F5B418]/40 hover:border-[#F5B418] shadow-2xs active:scale-95 transition-all text-left whitespace-nowrap cursor-pointer"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Animated Thinking Indicator */}
                {isThinking && (
                  <div className="flex items-start gap-2 animate-in fade-in">
                    <div className="p-3 bg-white rounded-2xl rounded-bl-2xs border border-[#F5B418]/30 text-xs text-neutral-700 shadow-sm flex items-center gap-2.5">
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#046A5A] animate-bounce [animation-delay:0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F5B418] animate-bounce [animation-delay:0.3s]" />
                      </span>
                      <span className="text-[11px] font-semibold text-[#012520]">
                        Consulting royal fragrance archives...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ========================================================= */}
              {/* 3. BOTTOM CHAT INPUT BAR WITH MOBILE SAFE AREA             */}
              {/* ========================================================= */}
              <div className="p-3 bg-white border-t border-[#F5B418]/30 shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <div className="relative flex-1 flex items-center">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="e.g. Woody attar under ₹2000 for office..."
                      disabled={isThinking}
                      className="w-full pl-3.5 pr-8 py-2.5 text-xs rounded-full border border-neutral-300 bg-[#FAF8F2] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#F5B418]/30 focus:border-[#F5B418] transition-all disabled:opacity-60 font-sans"
                    />
                    {inputMessage.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setInputMessage('')}
                        className="absolute right-2.5 p-1 rounded-full text-neutral-400 hover:text-neutral-600 active:scale-90 transition-all cursor-pointer"
                        aria-label="Clear input"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isThinking}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F5B418] via-[#FFDF78] to-[#E5A412] text-[#012520] hover:brightness-105 flex items-center justify-center shadow-[0_2px_12px_rgba(245,180,24,0.4)] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shrink-0 cursor-pointer"
                    aria-label="Send query"
                  >
                    <Send className="w-4 h-4 fill-[#012520] text-[#012520]" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-neutral-400 px-2 pt-1.5">
                  <span className="truncate">100% Pure & Real Inventory • No Hallucinations</span>
                  <span className="text-[#046A5A] font-bold shrink-0 ml-1">Attar Depot AI</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
