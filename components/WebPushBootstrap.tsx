'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { registerWebPushToken, startWebPushForegroundListener } from '@/lib/webPushNotifications';

type Props = {
  enabled: boolean;
};

export function WebPushBootstrap({ enabled }: Props) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;

    startWebPushForegroundListener((path) => router.push(path));
    void registerWebPushToken();
  }, [enabled, router]);

  return null;
}
