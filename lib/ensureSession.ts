import { apiFetch } from '@/lib/api'
import { persistSession } from '@/lib/persistSession'
import { getSessionTokens } from '@/lib/session'
import { fetchMe } from '@/lib/sessionMe'
import { useAuthStore } from '@/store/useAuthStore'

export async function ensureSession() {
  try {
    const me = await fetchMe()
    if (me?.user) {
      useAuthStore.getState().setUser(me.user)
      useAuthStore.getState().setActivePet(me.activePet)
      return me
    }
  } catch {
    // Fall through to login / refresh.
  }

  const onboarding = useAuthStore.getState().onboardingData
  if (onboarding?.email && onboarding.password) {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      json: { email: onboarding.email, password: onboarding.password },
    })
    await persistSession(res.session)
    useAuthStore.getState().setUser(res.user)
    useAuthStore.getState().setActivePet(res.activePet)
    return res
  }

  const tokens = getSessionTokens()
  if (tokens?.refresh_token) {
    const res = await apiFetch('/auth/refresh', {
      method: 'POST',
      json: { refresh_token: tokens.refresh_token },
    })
    await persistSession(res.session)
    return res
  }

  throw new Error('Please sign in again to finish setup.')
}
