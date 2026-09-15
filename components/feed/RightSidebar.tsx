'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import { SidebarWidgetSkeleton } from '@/components/skeletons'
import { CommunityDisclaimerFooter } from './CommunityDisclaimerFooter'

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

interface TrendingQuestion {
  id: string
  caption: string
  like_count: number
  comment_count: number
}

interface HelperPet {
  id: string
  name: string
  username: string
  profile_image_url: string
  rank: number
  helpful_count: number
}

export function RightSidebar() {
  const [packs, setPacks] = useState<DbPack[]>([])
  const [hashtags, setHashtags] = useState<Hashtag[]>([])
  const [trending, setTrending] = useState<TrendingQuestion[]>([])
  const [helpers, setHelpers] = useState<HelperPet[]>([])

  const [joined, setJoined] = useState<Record<string, boolean>>({})
  const [loadingPacks, setLoadingPacks] = useState(true)
  const [loadingHashtags, setLoadingHashtags] = useState(true)
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [loadingHelpers, setLoadingHelpers] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      apiFetch<DbPack[]>('/auth/communities'),
      apiFetch<Hashtag[]>('/posts/trending-hashtags'),
      apiFetch<{ trending: TrendingQuestion[] }>('/posts/qa/trending?limit=5'),
      apiFetch<{ helpers: HelperPet[] }>('/posts/qa/top-helpers?limit=5'),
    ]).then(([packsRes, hashRes, trendRes, helpRes]) => {
      if (packsRes.status === 'fulfilled' && Array.isArray(packsRes.value)) {
        setPacks(packsRes.value)
      }
      setLoadingPacks(false)

      if (hashRes.status === 'fulfilled' && Array.isArray(hashRes.value)) {
        setHashtags(hashRes.value)
      }
      setLoadingHashtags(false)

      if (trendRes.status === 'fulfilled' && trendRes.value?.trending) {
        setTrending(trendRes.value.trending)
      }
      setLoadingTrending(false)

      if (helpRes.status === 'fulfilled' && helpRes.value?.helpers) {
        setHelpers(helpRes.value.helpers)
      }
      setLoadingHelpers(false)
    })
  }, [])

  const toggleJoin = (id: string) => {
    setJoined((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="w-[300px] h-screen sticky top-0 py-6 px-4 flex flex-col gap-5 shrink-0 overflow-y-auto hidden lg:flex border-l border-[#EDE8E1] bg-[#FDF8F2]">
      {/* 1. Packs Near You Widget */}
      <section className="bg-white p-4 rounded-3xl border border-[#EDE8E1] shadow-2xs">
        <h3
          className="text-[12px] font-bold text-[#2d4a3e] tracking-wider uppercase mb-3 flex items-center justify-between"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <span>Packs Near You</span>
          <span className="material-symbols-outlined text-[16px] text-[#E8843A]">groups</span>
        </h3>

        {loadingPacks ? (
          <SidebarWidgetSkeleton />
        ) : packs.length === 0 ? (
          <p className="text-[12px] text-[#887366] text-center py-2">No active packs available.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {packs.slice(0, 4).map((pack) => {
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

      {/* 2. Trending Hashtags Widget */}
      <section className="bg-white p-4 rounded-3xl border border-[#EDE8E1] shadow-2xs">
        <h3
          className="text-[12px] font-bold text-[#2d4a3e] tracking-wider uppercase mb-3 flex items-center justify-between"
          style={{ fontFamily: 'Outfit, sans-serif' }}
        >
          <span>Trending Hashtags</span>
          <span className="material-symbols-outlined text-[16px] text-[#E8843A]">tag</span>
        </h3>

        {loadingHashtags ? (
          <SidebarWidgetSkeleton />
        ) : hashtags.length === 0 ? (
          <p className="text-[12px] text-[#887366] text-center py-2">No trending hashtags yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span
                key={tag.name}
                className="text-[12px] font-medium text-[#E8843A] hover:underline cursor-pointer bg-[#fef9f3] px-2.5 py-1 rounded-lg border border-[#ede8e1]"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 3. Trending Questions Widget */}
      <section className="bg-white p-4 rounded-3xl border border-[#EDE8E1] shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-[12px] font-bold text-[#2d4a3e] tracking-wider uppercase"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Trending Questions
          </h3>
          <span className="bg-[#FFDBC7] text-[#974900] text-[10px] font-bold px-2 py-0.5 rounded-full">
            Q&A
          </span>
        </div>

        {loadingTrending ? (
          <SidebarWidgetSkeleton />
        ) : trending.length === 0 ? (
          <p className="text-[12px] text-[#887366] text-center py-2">No trending questions yet.</p>
        ) : (
          <div className="space-y-2.5">
            {trending.slice(0, 4).map((item, idx) => (
              <Link
                key={item.id}
                href={`/qa/${item.id}`}
                className="flex items-start gap-2.5 group cursor-pointer border-b border-[#EDE8E1]/60 pb-2 last:border-0 last:pb-0"
              >
                <span className="text-[11px] font-bold text-[#727974] mt-0.5">0{idx + 1}</span>
                <div className="text-[12px] flex-1">
                  <p className="font-bold text-[#011E14] leading-snug group-hover:text-[#E8843A] transition-colors line-clamp-2">
                    {item.caption || 'Pet advice question'}
                  </p>
                  <span className="text-[#727974] text-[10px] mt-0.5 block">
                    {item.comment_count || 0} answers • {item.like_count || 0} treats
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 4. Top Helpful Pets Widget */}
      <section className="bg-white p-4 rounded-3xl border border-[#EDE8E1] shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-[12px] font-bold text-[#2d4a3e] tracking-wider uppercase"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            Top Helpful Pets 🏆
          </h3>
          <span className="text-[#727974] text-[10px] font-medium">Monthly</span>
        </div>

        {loadingHelpers ? (
          <SidebarWidgetSkeleton />
        ) : helpers.length === 0 ? (
          <p className="text-[12px] text-[#887366] text-center py-2">No Q&A helpful pets yet.</p>
        ) : (
          <div className="space-y-2">
            {helpers.slice(0, 4).map((helper) => (
              <Link
                key={helper.id}
                href={helper.username ? `/pet/${helper.username}` : `/pet/${helper.id}`}
                className="flex items-center justify-between hover:bg-[#F8F3ED] p-1.5 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    {helper.profile_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={helper.profile_image_url}
                        alt={helper.name}
                        className="w-8 h-8 rounded-full object-cover border border-[#EDE8E1]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] text-[#E8843A]">
                        <span className="material-symbols-outlined text-[16px]">pets</span>
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 bg-[#163328] text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px] font-bold">
                      {helper.rank}
                    </span>
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#011E14] leading-tight truncate max-w-[110px]">{helper.name}</div>
                    <div className="text-[10px] text-[#727974]">@{helper.username || 'pet'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#E8843A] font-bold text-[11px]">
                  <span>🐾</span>
                  <span>{helper.helpful_count}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 5. Veterinary / Community Advice Disclaimer & Footer Links */}
      <CommunityDisclaimerFooter className="mt-auto pt-2" />
    </aside>
  )
}
