'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'

interface DbPack {
  id: string
  name: string
  slug: string
  description?: string
  member_count?: number
}

interface Hashtag {
  name: string
  usage_count: number
}

export function RightSidebar() {
  const [packs, setPacks] = useState<DbPack[]>([])
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [joined, setJoined] = useState<Record<string, boolean>>({})
  const [loadingPacks, setLoadingPacks] = useState(true)
  const [loadingHashtags, setLoadingHashtags] = useState(true)

  useEffect(() => {
    // Fetch actual database communities created by admin
    apiFetch('/auth/communities')
      .then((data) => {
        if (Array.isArray(data)) {
          setPacks(data)
        }
      })
      .catch((err) => console.error('[RightSidebar] Error fetching communities:', err))
      .finally(() => setLoadingPacks(false))

    // Fetch dynamic trending hashtags from database
    apiFetch('/posts/trending-hashtags')
      .then((data) => {
        if (Array.isArray(data)) {
          setHashtags(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingHashtags(false))
  }, [])

  const toggleJoin = (id: string) => {
    setJoined((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="w-[280px] h-screen sticky top-0 py-6 px-4 flex-col gap-6 shrink-0 overflow-y-auto hidden lg:flex border-l border-[#EDE8E1] bg-[#FDF8F2]">
      {/* Packs Near You Widget */}
      <section className="bg-white p-4 rounded-2xl border border-[#EDE8E1] shadow-sm">
        <h3
          className="text-[12px] font-bold text-[#2d4a3e] tracking-wider uppercase mb-3"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Packs Near You
        </h3>

        {loadingPacks ? (
          <p className="text-[12px] text-[#887366] text-center py-2">Loading database packs...</p>
        ) : packs.length === 0 ? (
          <p className="text-[12px] text-[#887366] text-center py-2">No active packs available.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {packs.slice(0, 5).map((pack) => {
              const isJoined = joined[pack.id]
              const memberText = `${pack.member_count || 1} members`
              return (
                <div key={pack.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#f8f3ed] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#E8843A] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      pets
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#163328] truncate leading-tight">{pack.name}</p>
                    <p className="text-[11px] text-[#887366]">{memberText}</p>
                  </div>
                  <button
                    onClick={() => toggleJoin(pack.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      isJoined
                        ? 'bg-[#e8f5ee] text-[#166534] border border-[#bbf7d0]'
                        : 'bg-[#c9ead9] text-[#163328] hover:bg-[#2d4a3e] hover:text-white'
                    }`}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Trending Hashtags Widget */}
      <section className="bg-white p-4 rounded-2xl border border-[#EDE8E1] shadow-sm">
        <h3
          className="text-[12px] font-bold text-[#2d4a3e] tracking-wider uppercase mb-3"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          Trending Hashtags
        </h3>
        {loadingHashtags ? (
          <p className="text-[12px] text-[#887366] text-center py-2">Loading trends...</p>
        ) : hashtags.length === 0 ? (
          <p className="text-[12px] text-[#887366] text-center py-2">No trending hashtags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span
                key={tag.name}
                className="text-[13px] font-medium text-[#E8843A] hover:underline cursor-pointer bg-[#fef9f3] px-2.5 py-1 rounded-lg border border-[#ede8e1]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Footer Links */}
      <footer className="mt-auto text-[11px] text-[#887366] flex flex-wrap gap-3">
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <Link href="/terms" className="hover:underline">Terms</Link>
        <span>© 2026 Furlo Inc.</span>
      </footer>
    </aside>
  )
}
