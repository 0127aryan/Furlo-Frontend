export type NotificationCategory = 'all' | 'treats' | 'comments' | 'followers' | 'qa'

export type NotificationType =
  | 'best_answer'
  | 'treat'
  | 'comment'
  | 'follow'
  | 'pack_announcement'
  | 'system'
  | 'like'
  | 'community_announcement'
  | 'comment_reply'

export interface NotificationLike {
  id: string
  type: NotificationType
  metadata?: Record<string, unknown>
}

export function normalizeNotificationType<T extends NotificationLike>(item: T): T {
  const storedType = item.metadata?.notificationType as NotificationType | undefined
  if (storedType) return { ...item, type: storedType as T['type'] }
  if (item.type === 'like') return { ...item, type: 'treat' as T['type'] }
  if (item.type === 'community_announcement') {
    return { ...item, type: 'pack_announcement' as T['type'] }
  }
  if (item.type === 'comment_reply') return { ...item, type: 'comment' as T['type'] }
  return item
}

export function notificationMatchesFilter(
  item: NotificationLike,
  filter: NotificationCategory
): boolean {
  const normalized = normalizeNotificationType(item)
  if (filter === 'all') return true
  if (filter === 'treats') return normalized.type === 'treat'
  if (filter === 'comments') return normalized.type === 'comment'
  if (filter === 'followers') return normalized.type === 'follow'
  if (filter === 'qa') return normalized.type === 'best_answer'
  return true
}
