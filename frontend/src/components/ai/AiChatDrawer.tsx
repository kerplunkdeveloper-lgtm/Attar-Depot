'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleAiChat } from '@/store/uiSlice';
import { useAiChat, ChatMessage } from '@/hooks/useAiChat';
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
} from 'lucide-react';

const QUICK_INSPIRATIONS = [
  { label: 'Woody & Oudh', query: 'Woody long-lasting attar for daily wear' },
  { label: 'Under ₹2000', query: 'Best budget perfumes under 2000' },
  { label: 'Royal Musk', query: 'Kashmiri white musk pure attar' },
  { label: 'Kannauj Floral', query: 'Kannauj gulab rose floral perfume oil' },
];

export default function AiChatDrawer() {
  const dispatch = useAppDispatch();
  const { isAiChatOpen } = useAppSelector((state) => state.ui);
  const { messages, sendMessage, isThinking, retryLast, clearChat } = useAiChat();

  const [inputMessage, setInputMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    // Strip leading emojis if any for clean natural search
    const cleanText = chipText.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendMessage(cleanText || chipText);
  };

  const pathname = usePathname();

  if (!mounted) return null;
  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      {/* Floating Launcher Button (Hidden when drawer is open to prevent mobile overlap) */}
      {!isAiChatOpen && (
        <div className="fixed bottom-20 left-4 sm:bottom-6 sm:right-24 z-40 pointer-events-auto">
          <button
            onClick={() => dispatch(toggleAiChat(true))}
            className="flex items-center gap-2 px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-[#046A5A] via-[#035346] to-[#023F36] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/40 group focus:outline-none focus:ring-2 focus:ring-[#046A5A]/50 backdrop-blur-md"
            aria-label="Open Fragrance AI Consultant"
          >
            <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-400" />
            </span>

            <Sparkles className="w-3.5 h-3.5 text-[#C9A227] animate-pulse" />

          </button>
        </div>
      )}

      {/* Responsive Chat Drawer / Modal */}
      {isAiChatOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col justify-end sm:justify-start items-end pointer-events-auto">
          {/* Mobile backdrop with smooth touch dismiss */}
          <div
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs sm:hidden z-0 transition-opacity"
            onClick={() => dispatch(toggleAiChat(false))}
          />

          {/* Chat Container: Full dynamic viewport height on mobile, luxury card on desktop */}
          <div className="relative z-10 w-full h-[100dvh] sm:h-[650px] sm:max-h-[88vh] sm:w-[420px] bg-white sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-emerald-100/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Luxury Chat Header */}
            <div className="pt-[max(0.6rem,env(safe-area-inset-top,0px))] pb-3 px-4 bg-gradient-to-r from-[#046A5A] via-[#035346] to-[#023F36] text-white flex flex-col shadow-md relative z-10 shrink-0">
              {/* Mobile grab handle to hint dismissal */}
              <div
                onClick={() => dispatch(toggleAiChat(false))}
                className="w-10 h-1 rounded-full bg-white/30 hover:bg-white/50 mx-auto mb-2 sm:hidden cursor-pointer active:scale-95 transition-all"
                aria-label="Swipe down to close"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shrink-0 shadow-inner p-1.5">
                    <AttarDepotLogo variant="icon" className="w-full h-full text-[#FAF8F2]" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#023F36]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-sans text-sm font-bold text-[#FAF8F2] tracking-wide">
                        The Attar Depot AI
                      </h3>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#C9A227] text-neutral-950 font-black uppercase tracking-widest">
                        LIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-200/90 font-medium">
                      Bespoke Royal Fragrance Concierge
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={clearChat}
                    title="Reset conversation"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-90 transition-all"
                    aria-label="Reset conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch(toggleAiChat(false))}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 active:scale-90 transition-all"
                    aria-label="Close Chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-[#FAF8F2]/75 overscroll-contain">
              {/* Discovery Welcome Card on First Load */}
              {messages.length <= 1 && (
                <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-3.5 border border-emerald-100 shadow-2xs mb-2">
                  <div className="flex flex-col items-center text-center pb-2.5 mb-2.5 border-b border-emerald-100/70">
                    <AttarDepotLogo variant="icon" className="w-7 h-7 text-[#046A5A] mb-1 drop-shadow-xs" />
                    <AttarDepotLogo variant="text" className="text-emerald-950 scale-85" />
                    <p className="text-[10px] text-neutral-500 mt-1 font-medium">
                      Royal Fragrance Concierge • 100% Pure & Alcohol-Free
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-2 text-emerald-950 font-bold text-xs">
                    <Compass className="w-3.5 h-3.5 text-[#C9A227]" />
                    <span>Popular Fragrance Journeys</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_INSPIRATIONS.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChipClick(item.query)}
                        className="text-left p-2 rounded-xl bg-[#FAF8F2] hover:bg-emerald-50 text-emerald-900 border border-emerald-100/80 text-[11px] font-medium transition-all active:scale-95 flex items-center justify-between group"
                      >
                        <span className="truncate">{item.label}</span>
                        <ChevronRight className="w-3 h-3 text-emerald-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </button>
                    ))}
                  </div>
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
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium px-1">
                    {msg.sender === 'ai' ? (
                      <>
                        <AttarDepotLogo variant="icon" className="w-3.5 h-3.5 text-[#046A5A]" />
                        <span className="font-semibold text-emerald-950">Attar Depot AI</span>
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
                    className={`max-w-[90%] sm:max-w-[85%] p-3 sm:p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-[#046A5A] to-[#023F36] text-white rounded-br-2xs shadow-sm font-normal'
                        : msg.isError
                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-2xs'
                        : 'bg-white text-neutral-800 border border-emerald-100/90 rounded-bl-2xs shadow-2xs'
                    }`}
                  >
                    <div className="whitespace-pre-line prose-xs">
                      {msg.text}
                    </div>

                    {/* Retry button if error */}
                    {msg.isError && (
                      <button
                        onClick={retryLast}
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-100 text-red-800 text-[11px] font-bold hover:bg-red-200 active:scale-95 transition-all"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Try Again</span>
                      </button>
                    )}
                  </div>

                  {/* Recommended Products Carousel inside Chat */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="w-full pt-1.5">
                      <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C9A227]" /> Curated Selections
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
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
                            className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-2xs hover:border-emerald-300 active:scale-95 transition-all text-left whitespace-nowrap"
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
                  <div className="p-3 bg-white rounded-2xl rounded-bl-2xs border border-emerald-100 text-xs text-neutral-600 shadow-2xs flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#046A5A] animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#046A5A] animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#046A5A] animate-bounce [animation-delay:0.3s]" />
                    </span>
                    <span className="text-[11px] font-medium text-emerald-900">
                      Consulting royal fragrance archives...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Fixed Chat Input Bar with Mobile Safe Area */}
            <div className="p-2.5 sm:p-3 bg-white border-t border-emerald-100 shadow-lg pb-[max(0.65rem,env(safe-area-inset-bottom,0px))] shrink-0">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="e.g. Woody attar under ₹2000 for office..."
                    disabled={isThinking}
                    className="w-full pl-3.5 pr-8 py-2.5 text-xs rounded-full border border-neutral-200 bg-[#FAF8F2] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#046A5A]/30 focus:border-[#046A5A] transition-all disabled:opacity-60"
                  />
                  {inputMessage.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setInputMessage('')}
                      className="absolute right-2.5 p-1 rounded-full text-neutral-400 hover:text-neutral-600 active:scale-90 transition-all"
                      aria-label="Clear input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isThinking}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#046A5A] to-[#023F36] hover:brightness-110 text-white flex items-center justify-center shadow-md active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shrink-0"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 px-2 pt-1.5">
                <span className="truncate">100% Real Inventory • No Hallucinations</span>
                <span className="text-emerald-800 font-semibold shrink-0 ml-1">Attar Depot AI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
