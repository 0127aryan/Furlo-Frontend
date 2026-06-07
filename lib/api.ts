import { useAuthStore } from '@/store/useAuthStore'

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
    // credentials: 'include' is no longer needed for same-origin proxied requests
    // but kept here for safety in case of direct cross-origin calls in the future
    credentials: 'include',
  }

  if (options.json) {
    fetchOptions.body = JSON.stringify(options.json)
  }

  const response = await fetch(url, fetchOptions)

  if (response.status === 401) {
    // Session expired or invalid — clear the UI display state from Zustand
    if (typeof window !== 'undefined') {
      useAuthStore.getState().clearAuth()
    }
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred while fetching data.'
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get('Content-Type')
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return (await response.text()) as unknown as T
}
