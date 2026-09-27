import { useAuthStore } from '@/store/useAuthStore'
import { clearSessionTokens, getSessionTokens, saveSessionTokens } from '@/lib/session'
import { toast } from '@/lib/toast'

// All requests go to /api/backend/* which is proxied to the Express backend via next.config.ts
// The backend URL never leaks to the browser - cookies work on same-origin automatically
const API_PREFIX = '/api/backend'

interface FetchOptions extends RequestInit {
  json?: any
  skipAuth?: boolean
}

export async function apiFetch<T = any>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  // path should be like /api/auth/me, /api/waitlist, etc.
  const url = `${API_PREFIX}${path}`

  const headers = new Headers(options.headers)
  if (options.json && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const tokens = getSessionTokens()
  if (tokens?.access_token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${tokens.access_token}`)
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  }

  if (options.json) {
    fetchOptions.body = JSON.stringify(options.json)
  }

  const response = await fetch(url, fetchOptions)

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      const hadUser = Boolean(useAuthStore.getState().user)
      const pathname = window.location.pathname
      const isSessionProbe = path.includes('/auth/me') || path.includes('/auth/logout')
      const onboarding = pathname.startsWith('/join')
      if (isSessionProbe || onboarding) {
        useAuthStore.getState().setUser(null)
        useAuthStore.getState().setActivePet(null)
      } else {
        useAuthStore.getState().clearAuth()
        clearSessionTokens()
      }

      // Skip toast for background session checks (like /auth/me) or if user was already logged out
      if (hadUser && !path.includes('/auth/me') && !path.includes('/auth/logout')) {
        toast.error('Session expired. Please sign in again... 🐾')
        const pathname = window.location.pathname
        if (
          !pathname.startsWith('/join') &&
          pathname !== '/'
        ) {
          setTimeout(() => {
            window.location.href = '/join?mode=signin'
          }, 600)
        }
      }
    }
    if (path.includes('/auth/logout')) {
      return { success: true } as unknown as T
    }
  }

  if (!response.ok) {
    if (path.includes('/auth/logout')) {
      return { success: true } as unknown as T
    }

    let errorMessage = 'An error occurred while fetching data.'
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }

    if (errorMessage === 'Unauthorized' && response.status !== 401) {
      if (!path.includes('/auth/me') && !path.includes('/auth/logout')) {
        if (typeof window !== 'undefined') {
          const hadUser = Boolean(useAuthStore.getState().user)
          useAuthStore.getState().clearAuth()
          if (hadUser) {
            toast.error('Session expired. Please sign in again... 🐾')
            const pathname = window.location.pathname
            if (
              !pathname.startsWith('/join') &&
              pathname !== '/'
            ) {
              setTimeout(() => {
                window.location.href = '/join?mode=signin'
              }, 600)
            }
          }
        }
      }
    }

    throw new Error(errorMessage)
  }

  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.includes('application/json')) {
    const data = (await response.json()) as T & { session?: { access_token?: string; refresh_token?: string } }
    if (data && typeof data === 'object' && data.session?.access_token) {
      saveSessionTokens(data.session)
    }
    return data
  }

  return (await response.text()) as unknown as T
}
