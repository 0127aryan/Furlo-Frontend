import type { RealtimeChannel } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'

export interface ModerationEventPayload {
  type: 'report_created' | 'report_action'
  reportId?: string
  action?: string
  targetType?: string
  targetId?: string
  report?: any
}

type ModerationListener = (payload: ModerationEventPayload) => void

const moderationListeners = new Set<ModerationListener>()
let moderationChannel: RealtimeChannel | null = null
let channelPromise: Promise<void> | null = null

export function subscribeModerationQueue(listener: ModerationListener): () => void {
  moderationListeners.add(listener)

  if (!moderationChannel && !channelPromise) {
    initModerationSubscription().catch((err) => {
      console.error('[subscribeModerationQueue] Failed to init realtime channel:', err)
    })
  }

  return () => {
    moderationListeners.delete(listener)
  }
}

async function initModerationSubscription() {
  channelPromise = (async () => {
    const supabase = await getSupabaseClient()
    if (!supabase) return

    moderationChannel = supabase
      .channel('moderation-queue', {
        config: { broadcast: { ack: false, self: true } },
      })
      .on('broadcast', { event: 'report_created' }, ({ payload }: { payload: any }) => {
        handleModerationEvent({
          type: 'report_created',
          report: payload?.report,
          reportId: payload?.report?.id,
        })
      })
      .on('broadcast', { event: 'report_action' }, ({ payload }: { payload: any }) => {
        handleModerationEvent({
          type: 'report_action',
          reportId: payload?.reportId,
          action: payload?.action,
          targetType: payload?.targetType,
          targetId: payload?.targetId,
        })
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reports' },
        (payload: any) => {
          const newRow = payload.new as any
          const eventType = payload.eventType as string
          handleModerationEvent({
            type: eventType === 'INSERT' ? 'report_created' : 'report_action',
            reportId: newRow?.id,
            action: newRow?.action_taken,
            report: newRow,
          })
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('[subscribeModerationQueue] Moderation realtime subscription active')
        }
      })
  })()

  try {
    await channelPromise
  } finally {
    channelPromise = null
  }
}

function handleModerationEvent(payload: ModerationEventPayload) {
  moderationListeners.forEach((fn) => fn(payload))
}
