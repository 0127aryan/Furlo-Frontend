'use client';

import { useCallback, useEffect, useState } from 'react';

import { fetchUnreadNotificationCount } from '@/lib/notificationsApi';
import { subscribeRealtimeNotifications } from '@/lib/subscribeNotifications';
import { useAuthStore } from '@/store/useAuthStore';

export function useUnreadNotificationCount() {
  const userId = useAuthStore((s) => s.user?.id);
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!userId) {
      setCount(0);
      return;
    }
    try {
      setCount(await fetchUnreadNotificationCount());
    } catch {
      setCount(0);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
    if (!userId) return;

    const unsubscribe = subscribeRealtimeNotifications(userId, (item) => {
      if (!item.is_read) setCount((prev) => prev + 1);
    });

    const poll = setInterval(refresh, 30000);
    return () => {
      unsubscribe();
      clearInterval(poll);
    };
  }, [userId, refresh]);

  return { count, refresh };
}
