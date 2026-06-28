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

export interface OnboardingData {
  role: 'parent' | 'lover' | null
  email?: string
  password?: string // Keep temp to auto-login or trigger final setup
  petName?: string
  petUsername?: string
  breed?: string
  city?: string
  gender?: 'male' | 'female' | 'unknown'
  bio?: string
  personalityTags?: string[]
}

interface AuthState {
  user: User | null
  activePet: Pet | null
  onboardingData: OnboardingData | null
  setUser: (user: User | null) => void
  setActivePet: (pet: Pet | null) => void
  setOnboardingData: (data: Partial<OnboardingData> | null) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activePet: null,
  onboardingData: null,
  setUser: (user) => set({ user }),
  setActivePet: (pet) => set({ activePet: pet }),
  setOnboardingData: (data) =>
    set((state) => ({
      onboardingData: data
        ? { ...(state.onboardingData || { role: null }), ...data }
        : null,
    })),
  clearAuth: () => set({ user: null, activePet: null }),
}))
