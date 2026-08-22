import { create } from 'zustand'

export type FollowEvent = {
  targetPetId: string
  followerPetId: string
  following: boolean
  packMembersCount: number
  followingCount: number
}

type PetCounts = {
  packMembersCount?: number
  followingCount?: number
}

interface PetSocialState {
  counts: Record<string, PetCounts>
  lastEvent: FollowEvent | null
  setCounts: (petId: string, counts: PetCounts) => void
  applyFollow: (event: FollowEvent) => void
}

export const usePetSocialStore = create<PetSocialState>((set) => ({
  counts: {},
  lastEvent: null,
  setCounts: (petId, counts) =>
    set((state) => ({
      counts: {
        ...state.counts,
        [petId]: { ...state.counts[petId], ...counts },
      },
    })),
  applyFollow: (event) =>
    set((state) => ({
      lastEvent: event,
      counts: {
        ...state.counts,
        [event.targetPetId]: {
          ...state.counts[event.targetPetId],
          packMembersCount: event.packMembersCount,
        },
        [event.followerPetId]: {
          ...state.counts[event.followerPetId],
          followingCount: event.followingCount,
        },
      },
    })),
}))
