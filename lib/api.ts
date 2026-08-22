import { useAuthStore } from '@/store/useAuthStore'
import { toast } from '@/lib/toast'

// All requests go to /api/backend/* which is proxied to the Express backend via next.config.ts
// The backend URL never leaks to the browser - cookies work on same-origin automatically
const API_PREFIX = '/api/backend'

interface FetchOptions extends RequestInit {
  json?: any
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
      useAuthStore.getState().clearAuth()
      // Skip toast for background session checks (like /auth/me) to avoid noisy prompts on landing
      if (!path.includes('/auth/me') && !path.includes('/auth/logout')) {
        toast.error('Session expired. Please log in again 🐾')
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

    if (errorMessage === 'Unauthorized' || response.status === 401) {
      if (!path.includes('/auth/me')) {
        toast.error('Please log in to perform this action 🐾')
      }
    }

    throw new Error(errorMessage)
  }

  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return (await response.text()) as unknown as T
}
