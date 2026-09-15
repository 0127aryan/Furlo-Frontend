import { toast } from '@/lib/toast'

const seenKeys = new Map<string, number>()
const DEDUPE_WINDOW_MS = 15_000

export type IncomingAlert = {
  title: string
  body?: string
  isBroadcast?: boolean
  id?: string
}

function pruneSeenKeys(now: number) {
  for (const [key, seenAt] of seenKeys.entries()) {
    if (now - seenAt > DEDUPE_WINDOW_MS) {
      seenKeys.delete(key)
    }
  }
}

function buildDedupeKeys(alert: IncomingAlert): string[] {
  const title = alert.title.trim()
  const body = (alert.body || '').trim()
  const keys = [`content:${title}:${body}`]
  if (alert.id) keys.push(`id:${alert.id}`)
  if (alert.isBroadcast) keys.push(`broadcast:${title}:${body}`)
  return keys
}

/** Returns true when a toast was shown, false when deduped. */
export function showIncomingNotificationToast(alert: IncomingAlert): boolean {
  const title = alert.title.trim() || 'Furlo'
  const body = (alert.body || '').trim()
  const now = Date.now()
  pruneSeenKeys(now)

  const keys = buildDedupeKeys({ ...alert, title, body })
  const alreadySeen = keys.some((key) => {
    const seenAt = seenKeys.get(key)
    return seenAt !== undefined && now - seenAt < DEDUPE_WINDOW_MS
  })
  if (alreadySeen) return false

  keys.forEach((key) => seenKeys.set(key, now))

  const message = body ? `${title}: ${body}` : title
  if (alert.isBroadcast) {
    toast.info(`📣 ${message}`)
  } else {
    toast.success(`🐾 ${message}`)
  }
  return true
}
