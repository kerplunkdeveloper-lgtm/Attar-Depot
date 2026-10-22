'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/api';

const SYNC_CHANNEL_NAME = 'attar_data_sync_channel';
const STORAGE_SYNC_KEY = 'attar_data_sync_timestamp';

/**
 * Broadcast an update event across all browser tabs & windows.
 * Any open tab will immediately invalidate and refetch the specified queries.
 */
export function broadcastDataChange(keys: string | string[]) {
  if (typeof window === 'undefined') return;

  const keyList = Array.isArray(keys) ? keys : [keys];
  const payload = {
    keys: keyList,
    timestamp: Date.now(),
  };

  // 1. Try BroadcastChannel API (Modern & Ultra-fast sub-millisecond)
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage(payload);
      channel.close();
    } catch {
      // ignore
    }
  }

  // 2. Storage fallback for cross-tab notification
  try {
    localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(payload));
  } catch {
    // ignore
  }

  // 3. Custom event for local in-memory listeners
  try {
    window.dispatchEvent(
      new CustomEvent('attar:data-changed', {
        detail: payload,
      })
    );
  } catch {
    // ignore
  }
}

/**
 * React hook that connects the component to global real-time synchronization.
 * Handles cross-tab updates, instant refetches, window focus revalidation, and in-memory server heartbeat.
 */
export function useGlobalDataSync() {
  const queryClient = useQueryClient();
  const lastSyncTimeRef = useRef<number>(Date.now());
  const lastGlobalVersionRef = useRef<number>(0);
  const knownScopesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Trigger immediate invalidation AND active refetch so UI updates with zero delay
    const handleInvalidation = (keys: string[]) => {
      if (!keys || keys.length === 0) {
        queryClient.invalidateQueries();
        queryClient.refetchQueries({ type: 'active' });
        return;
      }

      keys.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
        });
        queryClient.refetchQueries(
          {
            queryKey: [key],
            type: 'active',
          },
          { cancelRefetch: false }
        );
      });
    };

    // 1. BroadcastChannel Listener (Instant same-browser cross-tab sync)
    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.keys) {
            handleInvalidation(event.data.keys);
          }
        };
      } catch {
        // BroadcastChannel unavailable
      }
    }

    // 2. Cross-tab storage event listener
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_SYNC_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.keys && parsed.timestamp > lastSyncTimeRef.current) {
            lastSyncTimeRef.current = parsed.timestamp;
            handleInvalidation(parsed.keys);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Local custom event listener
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.keys) {
        handleInvalidation(customEvent.detail.keys);
      }
    };
    window.addEventListener('attar:data-changed', handleCustom);

    // 4. Ultra-lightweight Server Sync Heartbeat (<0.1ms memory check, zero DB load)
    const checkServerSync = async () => {
      if (document.visibilityState !== 'visible') return;

      try {
        const response = await fetch(`${API_BASE_URL}/sync/version`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache, no-store' },
        });

        if (!response.ok) return;
        const data = await response.json();
        if (!data || !data.globalVersion) return;

        if (lastGlobalVersionRef.current === 0) {
          // Initial baseline
          lastGlobalVersionRef.current = data.globalVersion;
          knownScopesRef.current = data.scopes || {};
          return;
        }

        if (data.globalVersion > lastGlobalVersionRef.current) {
          const keysToInvalidate = new Set<string>();
          const currentScopes: Record<string, number> = data.scopes || {};
          const prevScopes = knownScopesRef.current;

          if ((currentScopes.products || 0) > (prevScopes.products || 0)) {
            keysToInvalidate.add('products');
            keysToInvalidate.add('featured-products');
            keysToInvalidate.add('product-filter-options');
            keysToInvalidate.add('product');
            keysToInvalidate.add('admin-stats');
            keysToInvalidate.add('categories');
          }

          if ((currentScopes.categories || 0) > (prevScopes.categories || 0)) {
            keysToInvalidate.add('categories');
            keysToInvalidate.add('admin-categories');
            keysToInvalidate.add('product-filter-options');
            keysToInvalidate.add('public-taxonomy');
            keysToInvalidate.add('products');
            keysToInvalidate.add('featured-products');
          }

          if ((currentScopes.taxonomy || 0) > (prevScopes.taxonomy || 0)) {
            keysToInvalidate.add('public-taxonomy');
            keysToInvalidate.add('admin-taxonomy');
            keysToInvalidate.add('product-filter-options');
            keysToInvalidate.add('categories');
          }

          if ((currentScopes.banners || 0) > (prevScopes.banners || 0)) {
            keysToInvalidate.add('public-banners');
            keysToInvalidate.add('admin-banners');
          }

          if ((currentScopes.coupons || 0) > (prevScopes.coupons || 0)) {
            keysToInvalidate.add('public-coupons');
            keysToInvalidate.add('banner-coupons');
            keysToInvalidate.add('admin-coupons');
          }

          if ((currentScopes.orders || 0) > (prevScopes.orders || 0)) {
            keysToInvalidate.add('admin-orders');
            keysToInvalidate.add('admin-stats');
            keysToInvalidate.add('orders');
            keysToInvalidate.add('my-orders');
          }

          if (keysToInvalidate.size === 0) {
            keysToInvalidate.add('products');
            keysToInvalidate.add('categories');
          }

          lastGlobalVersionRef.current = data.globalVersion;
          knownScopesRef.current = currentScopes;

          handleInvalidation(Array.from(keysToInvalidate));
        }
      } catch {
        // Silently ignore network hiccup during heartbeat
      }
    };

    // Initial check
    checkServerSync();

    // Check every 4.5 seconds when active
    const syncInterval = setInterval(checkServerSync, 4500);

    // 5. Tab Visibility & Focus Revalidation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastSync = Date.now() - lastSyncTimeRef.current;
        if (timeSinceLastSync > 2500) {
          lastSyncTimeRef.current = Date.now();
          checkServerSync();
          queryClient.invalidateQueries({
            refetchType: 'active',
          });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 6. Online event (network reconnection)
    const handleOnline = () => {
      checkServerSync();
      queryClient.invalidateQueries({
        refetchType: 'active',
      });
      queryClient.refetchQueries({
        type: 'active',
      });
    };
    window.addEventListener('online', handleOnline);

    return () => {
      if (channel) {
        channel.close();
      }
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('attar:data-changed', handleCustom);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [queryClient]);
}
