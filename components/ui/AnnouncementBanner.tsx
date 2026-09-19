'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { subscribeBanners, type ActiveBanner } from '@/lib/subscribeBanners'

export function AnnouncementBanner() {
  const [banner, setBanner] = useState<ActiveBanner | null>(null)
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  const fetchActiveBanner = async () => {
    try {
      const res = await apiFetch<{ banner: ActiveBanner | null }>('/admin/banners/active', {
        skipAuth: true,
      })
      if (res && res.banner && res.banner.is_active !== false) {
        setBanner(res.banner)
      } else {
        setBanner(null)
      }
    } catch {
      // Keep the last known banner if the public fetch fails.
    }
  }

  useEffect(() => {
    void fetchActiveBanner()
    const unsub = subscribeBanners((next) => {
      if (next) {
        setBanner(next)
        return
      }
      void fetchActiveBanner()
    })
    const poll = setInterval(() => {
      void fetchActiveBanner()
    }, 30000)
    return () => {
      unsub()
      clearInterval(poll)
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
