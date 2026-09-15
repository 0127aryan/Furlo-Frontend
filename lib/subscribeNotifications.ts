import type { RealtimeChannel } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { normalizeNotificationType } from '@/lib/notificationFilters'
import { showIncomingNotificationToast } from '@/lib/notificationToast'
import { toast } from '@/lib/toast'

export interface RealtimeNotificationItem {
  id: string
  user_id: string
  actor_pet_id?: string
  type: 'best_answer' | 'treat' | 'comment' | 'follow' | 'pack_announcement' | 'system'
  title: string
  body: string
  entity_type?: 'post' | 'comment' | 'community' | 'pet'
  entity_id?: string
  is_read: boolean
  metadata?: Record<string, any>
  created_at: string
  pets?: {
    id: string
    name: string
    username: string
    profile_image_url: string
  }
}

type NotificationListener = (notification: RealtimeNotificationItem) => void

type RevokeListener = (payload: { title: string; body: string; id?: string }) => void
const listeners = new Set<NotificationListener>()
const revokeListeners = new Set<RevokeListener>()

const dispatchedIds = new Map<string, number>()
const DISPATCH_WINDOW_MS = 15_000

export function subscribeRevokeNotifications(onRevoke: RevokeListener): () => void {
  revokeListeners.add(onRevoke)
  return () => {
    revokeListeners.delete(onRevoke)
  }
}

let userChannel: RealtimeChannel | null = null
let currentUserId: string | null = null
let channelPromise: Promise<void> | null = null

function isBroadcast(row: Partial<RealtimeNotificationItem>): boolean {
  return Boolean(row.metadata?.isBroadcast)
}

function shouldDispatch(row: Partial<RealtimeNotificationItem>): boolean {
  const now = Date.now()
  for (const [key, seenAt] of dispatchedIds.entries()) {
    if (now - seenAt > DISPATCH_WINDOW_MS) dispatchedIds.delete(key)
  }

  const id = row.id
  if (!id) return true
  if (dispatchedIds.has(id)) return false
  dispatchedIds.set(id, now)
  return true
}

function ingestNotification(row: Partial<RealtimeNotificationItem>) {
  if (!row) return

  const title = row.title || 'Furlo'
  const body = row.body || ''
  const broadcast = isBroadcast(row)

  showIncomingNotificationToast({
    title,
    body,
    isBroadcast: broadcast,
    id: row.id,
  })

  if (!shouldDispatch(row)) return

  const fullNotif: RealtimeNotificationItem = {
    id: row.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user_id: row.user_id || currentUserId || '',
    actor_pet_id: row.actor_pet_id,
    type: (row.type as RealtimeNotificationItem['type']) || 'system',
    title,
    body,
    entity_type: row.entity_type,
    entity_id: row.entity_id,
    is_read: row.is_read ?? false,
    metadata: row.metadata || {},
    created_at: row.created_at || new Date().toISOString(),
    pets: row.pets,
  }
  const normalized = normalizeNotificationType(fullNotif) as RealtimeNotificationItem
  listeners.forEach((fn) => fn(normalized))
}

async function ensureChannel(userId: string): Promise<void> {
  if (currentUserId === userId && userChannel) return
  if (currentUserId === userId && channelPromise) return channelPromise

  if (userChannel) {
    await userChannel.unsubscribe()
    userChannel = null
  }

  currentUserId = userId

  channelPromise = (async () => {
    const supabase = await getSupabaseClient()
    if (!supabase) return

    // Single channel: DB inserts are the source of truth for inbox + toast.
    // Targeted broadcast is a fallback when postgres realtime is delayed.
    userChannel = supabase
      .channel(`user-notifications-${userId}`, {
        config: { broadcast: { ack: false, self: false } },
      })
      .on('broadcast', { event: 'notification' }, ({ payload }) => {
        ingestNotification(payload as Partial<RealtimeNotificationItem>)
      })
      .on('broadcast', { event: 'revoke_broadcast' }, ({ payload }) => {
        toast.error(`Broadcast revoked: "${payload?.title}"`)
        revokeListeners.forEach((fn) => fn(payload))
      })
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          const row = payload.new as RealtimeNotificationItem
          if (row) ingestNotification(row)
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          const oldRow = payload.old as RealtimeNotificationItem
          if (oldRow?.id) {
            revokeListeners.forEach((fn) => fn({ title: oldRow.title || '', body: oldRow.body || '', id: oldRow.id }))
          }
        }
      )
      .subscribe()
  })()

  try {
    await channelPromise
  } finally {
    channelPromise = null
  }
}

export function startNotificationRealtime(userId: string): void {
  if (!userId) return
  void ensureChannel(userId)
}

export function subscribeRealtimeNotifications(
  userId: string,
  onNewNotification?: NotificationListener
): () => void {
  if (onNewNotification) {
    listeners.add(onNewNotification)
  }

  if (typeof window === 'undefined' || !userId) {
    return () => {
      if (onNewNotification) listeners.delete(onNewNotification)
    }
  }

  startNotificationRealtime(userId)

  return () => {
    if (onNewNotification) {
      listeners.delete(onNewNotification)
    }
  }
}
