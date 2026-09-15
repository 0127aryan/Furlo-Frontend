import { apiFetch } from '@/lib/api';

export type NotificationSettingsPayload = {
  master_push_enabled: boolean;
  qa_answers_enabled: boolean;
  qa_best_answer_enabled: boolean;
  treats_enabled: boolean;
  comments_enabled: boolean;
  followers_enabled: boolean;
  pack_announcements_enabled: boolean;
  email_digest_enabled: boolean;
  quiet_hours_enabled?: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone?: string;
};

export async function registerWebDeviceToken(token: string) {
  return apiFetch<{ success: boolean }>('/notifications/register-device', {
    method: 'POST',
    json: { token, platform: 'web' },
  });
}

export async function unregisterWebDeviceToken(token: string) {
  return apiFetch<{ success: boolean }>('/notifications/register-device', {
    method: 'DELETE',
    json: { token },
  });
}

export async function fetchUnreadNotificationCount() {
  const res = await apiFetch<{ unreadCount: number }>('/notifications?category=all&limit=1');
  return res.unreadCount || 0;
}
