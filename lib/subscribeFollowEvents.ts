import { createClient, type RealtimeChannel, type SupabaseClient } from '@supabase/supabase-js'

import { apiFetch } from '@/lib/api'
import { usePetSocialStore, type FollowEvent } from '@/store/usePetSocialStore'

let started = false
let channel: RealtimeChannel | null = null
let supabase: SupabaseClient | null = null

function isFollowEvent(payload: unknown): payload is FollowEvent {
  if (!payload || typeof payload !== 'object') return false
  const row = payload as FollowEvent
  return Boolean(row.targetPetId && row.followerPetId)
}

export function startFollowRealtime(): void {
  if (started || typeof window === 'undefined') return
  started = true

  apiFetch<{ supabaseUrl: string; supabaseAnonKey: string }>('/auth/supabase-config')
    .then(async (config) => {
      if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
        started = false
        return
      }
      supabase = createClient(config.supabaseUrl, config.supabaseAnonKey)
      try {
        const session = await apiFetch<{ access_token: string; refresh_token: string }>(
          '/auth/realtime-session',
        )
        if (session?.access_token && session?.refresh_token) {
          await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          })
        }
      } catch {
        // Broadcast still works without a cookie session.
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
