'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, onMessage, type Messaging } from 'firebase/messaging';

import { firebasePublicConfig, firebaseVapidKey, isFirebaseConfigured } from '@/lib/firebase/publicConfig';
import { registerWebDeviceToken, unregisterWebDeviceToken } from '@/lib/notificationsApi';
import { parseNotificationData } from '@/lib/notificationNavigation';
import { showIncomingNotificationToast } from '@/lib/notificationToast';

const TOKEN_STORAGE_KEY = 'furlo_web_push_token';

let firebaseApp: FirebaseApp | null = null;
let messaging: Messaging | null = null;
let foregroundStarted = false;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (firebaseApp) return firebaseApp;
  firebaseApp = getApps().length > 0 ? getApps()[0]! : initializeApp(firebasePublicConfig);
  return firebaseApp;
}

export function isWebPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function getStoredWebPushToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

function storeWebPushToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else localStorage.removeItem(TOKEN_STORAGE_KEY);
}

async function getServiceWorkerRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isWebPushSupported()) return null;
  const existing = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
  if (existing) return existing;
  return navigator.serviceWorker.register('/firebase-messaging-sw.js');
}

async function getMessagingInstance(): Promise<Messaging | null> {
  if (!(await isSupported())) return null;
  const app = getFirebaseApp();
  if (!app) return null;
  if (!messaging) messaging = getMessaging(app);
  return messaging;
}

export async function getWebPushPermissionStatus(): Promise<NotificationPermission | 'unsupported'> {
  if (!isWebPushSupported() || !(await isSupported()) || !isFirebaseConfigured()) return 'unsupported';
  return Notification.permission;
}

export async function registerWebPushToken(): Promise<string | null> {
  if (!isWebPushSupported() || !(await isSupported()) || !isFirebaseConfigured()) return null;
  if (Notification.permission !== 'granted') return null;

  try {
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) return null;

    const registration = await getServiceWorkerRegistration();
    if (!registration) return null;

    const token = await getToken(messagingInstance, {
      vapidKey: firebaseVapidKey,
      serviceWorkerRegistration: registration,
    });

    if (!token) return null;

    await registerWebDeviceToken(token);
    storeWebPushToken(token);
    return token;
  } catch (err) {
    console.warn('[webPush] registerWebPushToken failed:', err);
    return null;
  }
}

export async function unregisterWebPushToken(): Promise<void> {
  const token = getStoredWebPushToken();
  if (!token) return;
  try {
    await unregisterWebDeviceToken(token);
  } catch (err) {
    console.warn('[webPush] unregisterWebPushToken failed:', err);
  } finally {
    storeWebPushToken(null);
  }
}

export async function requestWebPushPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isWebPushSupported() || !(await isSupported()) || !isFirebaseConfigured()) return 'unsupported';

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    await registerWebPushToken();
  }
  return permission;
}

export function startWebPushForegroundListener(onNavigate?: (path: string) => void): void {
  if (foregroundStarted || typeof window === 'undefined') return;
  foregroundStarted = true;

  void (async () => {
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) return;

    onMessage(messagingInstance, (payload: any) => {
      const title = payload.notification?.title || payload.data?.title || 'Furlo';
      const body = payload.notification?.body || payload.data?.body || '';
      const type = typeof payload.data?.type === 'string' ? payload.data.type : '';
      const notificationId =
        typeof payload.data?.notificationId === 'string' ? payload.data.notificationId : undefined;

      showIncomingNotificationToast({
        title,
        body,
        id: notificationId,
        isBroadcast: type === 'system' || type === 'pack_announcement',
      });

      if (onNavigate && payload.data) {
        void parseNotificationData(payload.data as Record<string, unknown>);
      }
    });
  })();
}

export async function syncWebPushWithMasterToggle(enabled: boolean): Promise<void> {
  if (!enabled) {
    await unregisterWebPushToken();
    return;
  }

  const status = await getWebPushPermissionStatus();
  if (status === 'granted') {
    await registerWebPushToken();
    return;
  }

  if (status === 'default') {
    await requestWebPushPermission();
  }
}
