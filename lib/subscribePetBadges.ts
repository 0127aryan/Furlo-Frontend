import type { RealtimeChannel } from '@supabase/supabase-js'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { useAuthStore } from '@/store/useAuthStore'

export interface PetBadgeUpdatePayload {
  petId: string
  is_verified: boolean
  is_founding_pet: boolean
}

type BadgeListener = (payload: PetBadgeUpdatePayload) => void

const badgeListeners = new Set<BadgeListener>()
let badgeChannel: RealtimeChannel | null = null
let channelPromise: Promise<void> | null = null

export function subscribePetBadges(listener: BadgeListener): () => void {
  badgeListeners.add(listener)

  // Ensure subscription is active
  if (!badgeChannel && !channelPromise) {
    initBadgeSubscription().catch((err) => {
      console.error('[subscribePetBadges] Failed to init real-time channel:', err)
    })
  }

  return () => {
    badgeListeners.delete(listener)
  }
}

async function initBadgeSubscription() {
  channelPromise = (async () => {
    const supabase = await getSupabaseClient()
    if (!supabase) return

    badgeChannel = supabase
      .channel('pet-social-badges', {
        config: { broadcast: { ack: false, self: true } },
      })
      .on('broadcast', { event: 'pet_badge_updated' }, ({ payload }: { payload: any }) => {
        if (payload?.petId) {
          handleBadgeUpdate({
            petId: String(payload.petId),
            is_verified: Boolean(payload.is_verified),
            is_founding_pet: Boolean(payload.is_founding_pet),
          })
        }
      })
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'pets' },
        (payload: any) => {
          const newRow = payload.new as any
          if (newRow?.id) {
            handleBadgeUpdate({
              petId: String(newRow.id),
              is_verified: Boolean(newRow.is_verified),
              is_founding_pet: Boolean(newRow.is_founding_pet),
            })
          }
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('[subscribePetBadges] Real-time pet badge subscription active')
        }
      })
  })()

  try {
    await channelPromise
  } finally {
    channelPromise = null
  }
}

function handleBadgeUpdate(payload: PetBadgeUpdatePayload) {
  // 1. Sync active pet state in auth store if matching
  const activePet = useAuthStore.getState().activePet
  if (activePet && activePet.id === payload.petId) {
    useAuthStore.getState().setActivePet({
      ...activePet,
      is_verified: payload.is_verified,
      is_founding_pet: payload.is_founding_pet,
    })
  }

  // 2. Notify all active page listeners
  badgeListeners.forEach((fn) => fn(payload))
}
