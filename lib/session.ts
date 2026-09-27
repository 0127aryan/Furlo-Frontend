const STORAGE_KEY = 'furlo_session_tokens'

export type SessionTokens = {
  access_token: string
  refresh_token?: string
}

export function saveSessionTokens(session?: { access_token?: string; refresh_token?: string } | null) {
  if (typeof window === 'undefined' || !session?.access_token) return
  const tokens: SessionTokens = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export function getSessionTokens(): SessionTokens | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SessionTokens
    return parsed?.access_token ? parsed : null
  } catch {
    return null
  }
}

export function clearSessionTokens() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(STORAGE_KEY)
}
