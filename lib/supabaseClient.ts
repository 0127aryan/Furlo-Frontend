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
        accessToken?: string
        refreshToken?: string
      }>('/auth/supabase-config')

      if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
        return null
      }

      const client = createClient(config.supabaseUrl, config.supabaseAnonKey)

      if (config.accessToken && config.refreshToken) {
        await client.auth.setSession({
          access_token: config.accessToken,
          refresh_token: config.refreshToken,
        })
      }

      return client
    } catch (e) {
      console.warn('[SupabaseClient] Error initializing realtime client:', e)
      return null
    }
  })()

  return clientPromise
}
