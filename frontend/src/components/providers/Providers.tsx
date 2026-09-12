'use client';

import React, { useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/store';

import { Suspense } from 'react';
import RouteProgressBar from '@/components/common/RouteProgressBar';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <RouteProgressBar />
        </Suspense>
        {children}
      </QueryClientProvider>
    </ReduxProvider>
  );
}
