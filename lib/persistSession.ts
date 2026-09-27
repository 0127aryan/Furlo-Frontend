import { apiFetch } from '@/lib/api'
import { saveSessionTokens } from '@/lib/session'

export async function persistSession(session?: { access_token?: string; refresh_token?: string } | null) {
  saveSessionTokens(session)
  if (!session?.access_token) return
  try {
    await apiFetch('/auth/verify-session', {
      method: 'POST',
      json: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      },
    })
  } catch {
    // Cookies are optional when the Bearer token is already stored.
  }
}
