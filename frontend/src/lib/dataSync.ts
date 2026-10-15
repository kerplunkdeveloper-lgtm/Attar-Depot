'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

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

  // 1. Try BroadcastChannel API (Modern & Ultra-fast)
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
 * Handles cross-tab updates, window focus revalidation, and visibility restoration.
 */
export function useGlobalDataSync() {
  const queryClient = useQueryClient();
  const lastSyncTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleInvalidation = (keys: string[]) => {
      if (!keys || keys.length === 0) {
        queryClient.invalidateQueries();
        return;
      }

      keys.forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key],
          refetchType: 'active',
        });
      });
    };

    // 1. BroadcastChannel Listener
    let channel: BroadcastChannel | null = null;
    if ('BroadcastChannel' in window) {
      try {
        channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.keys) {
            handleInvalidation(event.data.keys);
          }
        };
      } catch (e) {
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

    // 4. Tab Visibility & Focus Revalidation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timeSinceLastSync = Date.now() - lastSyncTimeRef.current;
        // If tab was idle for more than 4 seconds, revalidate active queries immediately
        if (timeSinceLastSync > 4000) {
          lastSyncTimeRef.current = Date.now();
          queryClient.invalidateQueries({
            refetchType: 'active',
          });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 5. Online event (network reconnection)
    const handleOnline = () => {
      queryClient.invalidateQueries({
        refetchType: 'active',
      });
    };
    window.addEventListener('online', handleOnline);

    return () => {
      if (channel) {
        channel.close();
      }
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('attar:data-changed', handleCustom);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [queryClient]);
}
