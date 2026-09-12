import { type RealtimeChannel } from '@supabase/supabase-js'

import { getSupabaseClient } from '@/lib/supabaseClient'
import { usePetSocialStore, type FollowEvent } from '@/store/usePetSocialStore'

let started = false
let channel: RealtimeChannel | null = null

function isFollowEvent(payload: unknown): payload is FollowEvent {
  if (!payload || typeof payload !== 'object') return false
  const row = payload as FollowEvent
  return Boolean(row.targetPetId && row.followerPetId)
}

export function startFollowRealtime(): void {
  if (started || typeof window === 'undefined') return
  started = true

  getSupabaseClient()
    .then((supabase) => {
      if (!supabase) {
        started = false
        return
      }

      channel = supabase
        .channel('pet-social', { config: { broadcast: { ack: false, self: true } } })
        .on('broadcast', { event: 'follow' }, ({ payload }: { payload: FollowEvent }) => {
          if (isFollowEvent(payload)) {
            usePetSocialStore.getState().applyFollow(payload)
          }
        })

      channel.subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          started = false
          channel = null
        }
      })
    })
    .catch(() => {
      started = false
    })
}
