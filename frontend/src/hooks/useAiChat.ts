'use client';

import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Product } from '@/types';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  products?: Product[];
  quickReplies?: string[];
  timestamp: string;
  isError?: boolean;
}

const INITIAL_WELCOME: ChatMessage = {
  id: 'welcome_msg',
  sender: 'ai',
  text: "Hi! 👋 I'm your Fragrance AI. I can help you find the perfect perfume based on your style, budget and fragrance preferences.",
  quickReplies: [
    '🔍 Find a perfume for me',
    '💰 Best perfumes under ₹2000',
    '🌿 Woody fragrances',
    '🌸 Floral fragrances',
    '🖤 Long-lasting perfumes',
    '🎁 Help me choose a gift',
    '📦 Track my order',
  ],
  timestamp: new Date().toISOString(),
};

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME]);
  const [conversationId, setConversationId] = useState<string>('');
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  // Initialize unique conversation ID
  useEffect(() => {
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const { data } = await api.post('/ai/chat', {
        message: messageText,
        conversationId,
      });
      return data;
    },
    onSuccess: (data) => {
      const aiReply: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.message || 'Here are our master fragrance recommendations:',
        products: data.products || [],
        quickReplies: data.quickReplies || [],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiReply]);
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    },
    onError: (error: any) => {
      const errorReply: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: "I'm having trouble connecting to our fragrance vault right now. Please try again or ask another question.",
        isError: true,
        quickReplies: ['🔄 Try again', '💰 Best perfumes under ₹2000', '🌿 Woody fragrances'],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorReply]);
    },
  });

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || chatMutation.isPending) return;

      setLastUserMessage(trimmed);

      const userMsg: ChatMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      chatMutation.mutate(trimmed);
    },
    [chatMutation]
  );

  const retryLast = useCallback(() => {
    if (lastUserMessage) {
      sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([INITIAL_WELCOME]);
    setConversationId(`conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  }, []);

  return {
    messages,
    sendMessage,
    isThinking: chatMutation.isPending,
    retryLast,
    clearChat,
  };
}
