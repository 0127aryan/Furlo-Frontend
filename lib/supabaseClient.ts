import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { apiFetch } from './api'

let clientPromise: Promise<SupabaseClient | null> | null = null

export async function getSupabaseClient(): Promise<SupabaseClient | null> {
  if (clientPromise) return clientPromise

  clientPromise = (async () => {
    try {
      const config = await apiFetch<{
        supabaseUrl: string
        supabaseAnonKey: string
      }>('/auth/supabase-config', { skipAuth: true })

      if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
        return null
      }

      const client = createClient(config.supabaseUrl, config.supabaseAnonKey)

      try {
        const session = await apiFetch<{
          access_token: string
          refresh_token: string
        }>('/auth/realtime-session')
        if (session?.access_token && session?.refresh_token) {
          await client.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          })
        }
      } catch {
        // Not signed in — broadcast channels still work without auth
      }

      return client
    } catch (e) {
      console.warn('[SupabaseClient] Error initializing realtime client:', e)
      return null
    }
  })()

  return clientPromise
}
