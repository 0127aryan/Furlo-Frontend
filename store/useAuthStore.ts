import { create } from 'zustand'

export interface User {
  id: string
  email: string
  is_admin: boolean
  status: string
}

export interface Pet {
  id: string
  owner_id: string
  username: string
  name: string
  profile_image_url: string
  breed: string
  city: string
  personality_tags: string[]
}

interface AuthState {
  user: User | null
  activePet: Pet | null
  setUser: (user: User | null) => void
  setActivePet: (pet: Pet | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activePet: null,
  setUser: (user) => set({ user }),
  setActivePet: (pet) => set({ activePet: pet }),
  clearAuth: () => set({ user: null, activePet: null }),
}))
