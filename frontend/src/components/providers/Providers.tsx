'use client';

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';
import GlobalAuthTimer from '@/components/auth/GlobalAuthTimer';
import AosLenisProvider from './AosLenisProvider';
import LiveSyncListener from './LiveSyncListener';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 4 * 1000,       // 4 seconds cache freshness (ultra-fast navigation with instant real-time sync)
        gcTime: 30 * 60 * 1000,    // Keep unused cache in memory for 30 minutes
        refetchOnWindowFocus: true, // Auto-refetch when user focuses or returns to tab
        refetchOnReconnect: true,   // Auto-refetch when network reconnects
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <LiveSyncListener />
        <AosLenisProvider>
          <GlobalAuthTimer />
          {children}
        </AosLenisProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

