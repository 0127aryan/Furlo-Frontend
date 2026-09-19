import type { RealtimeChannel } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'

export interface PackStatusPayload {
  communityId: string
  slug?: string
  status: string
  is_approved: boolean
  is_verified: boolean
  is_active: boolean
  deleted?: boolean
}

type PackStatusListener = (payload: PackStatusPayload) => void

const listeners = new Set<PackStatusListener>()
let packChannel: RealtimeChannel | null = null
let channelPromise: Promise<void> | null = null

export function applyPackStatusToItem<
  T extends {
    id: string
    slug?: string
    status?: string | null
    is_approved?: boolean
    is_verified?: boolean
    is_active?: boolean
  },
>(item: T, payload: PackStatusPayload): T | null {
  if (item.id !== payload.communityId && item.slug !== payload.slug) return item
  if (payload.deleted) return null
  return {
    ...item,
    status: payload.status as T['status'],
    is_approved: payload.is_approved,
    is_verified: payload.is_verified,
    is_active: payload.is_active,
  }
}

export function applyPackStatusToList<
  T extends {
    id: string
    slug?: string
    status?: string | null
    is_approved?: boolean
    is_verified?: boolean
    is_active?: boolean
  },
>(list: T[], payload: PackStatusPayload, options?: { hideInactive?: boolean }): T[] {
  return list
    .map((item) => applyPackStatusToItem(item, payload))
    .filter((item): item is T => Boolean(item))
    .filter((item) => (options?.hideInactive ? item.is_active !== false : true))
}

export function subscribePackStatus(listener: PackStatusListener): () => void {
  listeners.add(listener)
  if (!packChannel && !channelPromise) {
    initPackStatusSubscription().catch((err) => {
      console.error('[subscribePackStatus] Failed to init real-time channel:', err)
    })
  }
  return () => {
    listeners.delete(listener)
  }
}

function rowToPayload(row: Record<string, unknown> | null | undefined, deleted = false): PackStatusPayload | null {
  if (!row?.id) return null
  const status = String(row.status || (row.is_approved ? 'approved' : 'pending'))
  const approved = row.is_approved === true || status === 'approved' || row.is_verified === true
  return {
    communityId: String(row.id),
    slug: row.slug ? String(row.slug) : undefined,
    status,
    is_approved: deleted ? false : approved,
    is_verified: deleted ? false : approved,
    is_active: deleted ? false : row.is_active !== false,
    deleted,
  }
}

async function initPackStatusSubscription() {
  channelPromise = (async () => {
    const supabase = await getSupabaseClient()
    if (!supabase) return

    packChannel = supabase
      .channel('pack-status', {
        config: { broadcast: { ack: false, self: true } },
      })
      .on('broadcast', { event: 'pack_status_updated' }, ({ payload }: { payload: any }) => {
        if (payload?.communityId) {
          handlePackStatus({
            communityId: String(payload.communityId),
            slug: payload.slug ? String(payload.slug) : undefined,
            status: String(payload.status || 'pending'),
            is_approved: Boolean(payload.is_approved),
            is_verified: Boolean(payload.is_verified),
            is_active: payload.is_active !== false,
            deleted: Boolean(payload.deleted),
          })
        }
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'communities' },
        (payload: any) => {
          const eventType = String(payload.eventType || '')
          const row = eventType === 'DELETE' ? payload.old : payload.new
          const next = rowToPayload(row, eventType === 'DELETE')
          if (next) handlePackStatus(next)
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

function handlePackStatus(payload: PackStatusPayload) {
  listeners.forEach((fn) => fn(payload))
}
