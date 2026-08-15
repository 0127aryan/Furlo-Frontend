import { create } from 'zustand'

export interface User {
  id: string
  email: string
  is_admin: boolean
  status: string
  name?: string
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
  password?: string
  petName?: string
  petUsername?: string
  petType?: string
  species?: string
  customPetType?: string
  breed?: string
  customBreed?: string
  city?: string
  gender?: 'male' | 'female' | 'unknown'
  bio?: string
  personalityTags?: string[]
  customPersonalityTags?: string[]
  avatarData?: string
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

const getInitialOnboardingData = (): OnboardingData | null => {
  if (typeof window === 'undefined') return null
  try {
    const saved = localStorage.getItem('furlo_onboarding_data')
    return saved ? JSON.parse(saved) : null
  } catch (e) {
    return null
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  activePet: null,
  onboardingData: getInitialOnboardingData(),
  setUser: (user) => set({ user }),
  setActivePet: (pet) => set({ activePet: pet }),
  setOnboardingData: (data) =>
    set((state) => {
      const updated = data
        ? { ...(state.onboardingData || { role: null }), ...data }
        : null

      if (typeof window !== 'undefined') {
        if (updated) {
          localStorage.setItem('furlo_onboarding_data', JSON.stringify(updated))
        } else {
          localStorage.removeItem('furlo_onboarding_data')
        }
      }
      return { onboardingData: updated }
    }),
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('furlo_onboarding_data')
    }
    set({ user: null, activePet: null, onboardingData: null })
  },
}))
