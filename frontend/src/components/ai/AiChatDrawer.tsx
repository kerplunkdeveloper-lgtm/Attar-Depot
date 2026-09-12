'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleAiChat } from '@/store/uiSlice';
import { useAiChat, ChatMessage } from '@/hooks/useAiChat';
import AiProductCard from './AiProductCard';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  Minimize2,
} from 'lucide-react';

export default function AiChatDrawer() {
  const dispatch = useAppDispatch();
  const { isAiChatOpen } = useAppSelector((state) => state.ui);
  const { messages, sendMessage, isThinking, retryLast, clearChat } = useAiChat();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [messages, isAiChatOpen, isThinking]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isThinking) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleChipClick = (chipText: string) => {
    // Strip leading emojis if any for cleaner natural search
    const cleanText = chipText.replace(/^[\p{Emoji}\s]+/u, '').trim();
    sendMessage(cleanText || chipText);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-22 z-40 pointer-events-auto">
        <button
          onClick={() => dispatch(toggleAiChat(true))}
          className="flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full bg-gradient-to-r from-[#046A5A] to-[#023F36] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/30 group focus:outline-none focus:ring-2 focus:ring-[#046A5A]/50"
          aria-label="Open Fragrance AI Consultant"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
          </span>

          <Sparkles className="w-4 h-4 text-[#C9A227] animate-pulse" />
          <span className="text-xs sm:text-sm font-bold tracking-wide font-poppins text-[#FAF8F2]">
            ✨ Fragrance AI
          </span>
        </button>
      </div>

      {/* Responsive Chat Drawer / Panel */}
      {isAiChatOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs sm:hidden pointer-events-auto"
            onClick={() => dispatch(toggleAiChat(false))}
          />

          <div className="pointer-events-auto w-full h-full sm:w-[410px] sm:h-[640px] sm:max-h-[88vh] bg-white sm:rounded-3xl shadow-2xl border border-emerald-100/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
            {/* Luxury Chat Header */}
            <div className="p-4 bg-gradient-to-r from-[#046A5A] to-[#023F36] text-white flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md">
                  <Bot className="w-5 h-5 text-[#FAF8F2]" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#023F36]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-poppins text-sm font-bold text-[#FAF8F2] tracking-wide">
                      ✨ Fragrance AI
                    </h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C9A227] text-neutral-950 font-extrabold uppercase tracking-widest">
                      PRO
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/90 font-medium">
                    Your personal fragrance consultant
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Reset conversation"
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => dispatch(toggleAiChat(false))}
                  className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F2]/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-2`}
                >
                  {/* Sender Label & Avatar */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium px-1">
                    {msg.sender === 'ai' ? (
                      <>
                        <Sparkles className="w-3 h-3 text-[#C9A227]" />
                        <span>Fragrance AI Consultant</span>
                      </>
                    ) : (
                      <>
                        <span>You</span>
                        <User className="w-3 h-3 text-neutral-500" />
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#046A5A] text-white rounded-br-2xs shadow-sm font-medium'
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
                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-100 text-red-800 text-[11px] font-bold hover:bg-red-200 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Try Again</span>
                      </button>
                    )}
                  </div>

                  {/* Recommended Products Carousel inside Chat */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="w-full pt-2">
                      <div className="flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-[#C9A227]" /> Curated Allocations
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {msg.products.length} flacons found
                        </span>
                      </div>

                      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-emerald-200">
                        {msg.products.map((product) => (
                          <AiProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Action Suggestion Chips */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                      {msg.quickReplies.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChipClick(chip)}
                          className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:border-emerald-300 shadow-2xs hover:scale-[1.02] active:scale-95 transition-all text-left"
                        >
                          {chip}
                        </button>
                      ))}
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
                      Fragrance AI is consulting the vault...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Fixed Chat Input Bar */}
            <div className="p-3 bg-white border-t border-emerald-100 shadow-lg">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="e.g. Woody perfume under ₹2000 for office..."
                  disabled={isThinking}
                  className="flex-1 px-4 py-2.5 text-xs rounded-full border border-neutral-200 bg-[#FAF8F2] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#046A5A]/30 focus:border-[#046A5A] transition-all disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isThinking}
                  className="w-10 h-10 rounded-full bg-[#046A5A] hover:bg-[#023F36] text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all"
                  aria-label="Send query"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] text-neutral-400 px-2 pt-2">
                <span>100% Real Inventory • No Hallucinations</span>
                <span className="text-emerald-700 font-semibold">Attar Depot AI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
