'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { createClient } from '@supabase/supabase-js'

interface ActiveBanner {
  id: string
  text: string
  link_url?: string
  cta_text?: string
  style_type: 'orange' | 'emerald' | 'amber'
  is_active: boolean
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export function AnnouncementBanner() {
  const [banner, setBanner] = useState<ActiveBanner | null>(null)
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  const fetchActiveBanner = async () => {
    try {
      const res = await apiFetch<{ banner: ActiveBanner | null }>('/admin/banners/active')
      if (res && res.banner && res.banner.is_active) {
        setBanner(res.banner)
      } else {
        setBanner(null)
      }
    } catch (err) {
      // Silent error fallback
    }
  }

  useEffect(() => {
    fetchActiveBanner()

    // 10s Fallback Polling for instant synchronization
    const pollInterval = setInterval(() => {
      fetchActiveBanner()
    }, 10000)

    // Supabase Realtime Subscription for instant broadcast events
    let channel: any = null
    if (supabaseUrl && supabaseAnonKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey)
        channel = supabase
          .channel('global-banners')
          .on('broadcast', { event: 'banner_update' }, (payload: any) => {
            if (payload.payload?.banner && payload.payload.banner.is_active) {
              setBanner(payload.payload.banner)
            } else {
              setBanner(null)
            }
          })
          .subscribe()
      } catch (err) {
        console.error('[AnnouncementBanner] Realtime error:', err)
      }
    }

    return () => {
      clearInterval(pollInterval)
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [])

  if (!banner || banner.id === dismissedId) return null

  const themeClasses =
    banner.style_type === 'emerald'
      ? 'bg-[#163328] text-white border-b border-[#34D399]/20'
      : banner.style_type === 'amber'
      ? 'bg-[#D97706] text-white border-b border-[#FCD34D]/20'
      : 'bg-[#E8843A] text-white border-b border-[#FFEDD5]/20'

  return (
    <div
      className={`w-full py-2.5 px-4 sm:px-6 relative z-40 transition-all duration-300 ${themeClasses}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="material-symbols-outlined text-[20px] shrink-0">campaign</span>
          <span className="truncate">{banner.text}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {banner.link_url && (
            <Link
              href={banner.link_url}
              className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span>{banner.cta_text || 'View Details'}</span>
              <span>→</span>
            </Link>
          )}

          <button
            onClick={() => setDismissedId(banner.id)}
            className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            title="Dismiss Announcement"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    </div>
  )
}
