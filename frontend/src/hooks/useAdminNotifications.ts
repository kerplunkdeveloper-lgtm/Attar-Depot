'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { API_BASE_URL } from '@/lib/api';
import {
  AdminNotification,
  NotificationType,
  playNotificationSound,
} from '@/lib/adminNotifications';

interface NotificationsApiResponse {
  success: boolean;
  unreadCount: number;
  notifications: AdminNotification[];
}

export const useAdminNotifications = (enabled: boolean = true) => {
  const queryClient = useQueryClient();
  const [liveToast, setLiveToast] = useState<AdminNotification | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const knownNotificationIds = useRef<Set<string>>(new Set());

  // 1. Fetch initial notification list and unread count
  const {
    data,
    isLoading,
    refetch,
  } = useQuery<NotificationsApiResponse>({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const res = await api.get('/admin/notifications');
      return res.data;
    },
    enabled,
    staleTime: 5000,
    refetchInterval: isConnected ? 30000 : 8000, // Fallback polling if SSE is disconnected
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Track known IDs to prevent duplicate sound chimes
  useEffect(() => {
    if (data?.notifications) {
      data.notifications.forEach((n) => {
        const id = n._id || n.id;
        if (id) knownNotificationIds.current.add(id);
      });
    }
  }, [data?.notifications]);

  // 2. Real-Time Server-Sent Events (SSE) stream listener
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    let isSubscribed = true;
    let reconnectTimeout: any = null;

    const connectSse = () => {
      try {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }

        const sseUrl = `${API_BASE_URL}/admin/notifications/stream`;
        const es = new EventSource(sseUrl, { withCredentials: true });
        eventSourceRef.current = es;

        es.onopen = () => {
          if (!isSubscribed) return;
          setIsConnected(true);
        };

        es.onmessage = (event) => {
          if (!isSubscribed || !event.data) return;

          try {
            const parsed = JSON.parse(event.data);

            // Ignore initial connection handshake event
            if (parsed.type === 'connected') {
              setIsConnected(true);
              return;
            }

            const newNotif: AdminNotification = parsed;
            const notifId = newNotif._id || newNotif.id;

            // Only trigger chime & toast if we haven't seen this notification yet
            if (notifId && !knownNotificationIds.current.has(notifId)) {
              knownNotificationIds.current.add(notifId);

              // 🔔 Play distinctive synthesized SaaS audio chime based on event type
              playNotificationSound(newNotif.type);

              // 🍞 Display real-time floating toast in Admin Dashboard
              setLiveToast(newNotif);

              // Optimistically update React Query cache so the UI updates immediately
              queryClient.setQueryData<NotificationsApiResponse>(
                ['admin-notifications'],
                (old) => {
                  if (!old) {
                    return {
                      success: true,
                      unreadCount: 1,
                      notifications: [newNotif],
                    };
                  }
                  return {
                    ...old,
                    unreadCount: old.unreadCount + 1,
                    notifications: [newNotif, ...old.notifications.filter((x) => (x._id || x.id) !== notifId)],
                  };
                }
              );
            }
          } catch (err) {
            console.error('[SSE Message Parse Error]:', err);
          }
        };

        es.onerror = () => {
          setIsConnected(false);
          es.close();

          // Auto-reconnect after 3.5 seconds
          if (isSubscribed) {
            clearTimeout(reconnectTimeout);
            reconnectTimeout = setTimeout(connectSse, 3500);
          }
        };
      } catch (err) {
        console.error('[SSE Setup Error]:', err);
      }
    };

    connectSse();

    return () => {
      isSubscribed = false;
      clearTimeout(reconnectTimeout);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [enabled, queryClient]);

  // Dismiss live toast after 6 seconds
  useEffect(() => {
    if (liveToast) {
      const timer = setTimeout(() => {
        setLiveToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [liveToast]);

  const dismissToast = useCallback(() => {
    setLiveToast(null);
  }, []);

  // 3. Mark single notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put(`/admin/notifications/${id}/read`);
      return res.data;
    },
    onSuccess: (res, id) => {
      queryClient.setQueryData<NotificationsApiResponse>(['admin-notifications'], (old) => {
        if (!old) return old;
        return {
          ...old,
          unreadCount: Math.max(0, old.unreadCount - 1),
          notifications: old.notifications.map((n) =>
            (n._id || n.id) === id ? { ...n, read: true, isRead: true } : n
          ),
        };
      });
    },
  });

  // 4. Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put('/admin/notifications/read-all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationsApiResponse>(['admin-notifications'], (old) => {
        if (!old) return old;
        return {
          ...old,
          unreadCount: 0,
          notifications: old.notifications.map((n) => ({ ...n, read: true, isRead: true })),
        };
      });
    },
  });

  // 5. Clear all notifications mutation
  const clearAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/admin/notifications/clear');
      return res.data;
    },
    onSuccess: () => {
      queryClient.setQueryData<NotificationsApiResponse>(['admin-notifications'], {
        success: true,
        unreadCount: 0,
        notifications: [],
      });
    },
  });

  // 6. Trigger Test notification mutation (useful for live demo & audio testing)
  const triggerTestMutation = useMutation({
    mutationFn: async (type: NotificationType = 'payment_received') => {
      const res = await api.post('/admin/notifications/test', { type });
      return res.data;
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    isConnected,
    liveToast,
    dismissToast,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    clearAll: () => clearAllMutation.mutate(),
    triggerTest: (type: NotificationType) => triggerTestMutation.mutate(type),
    refetch,
  };
};
