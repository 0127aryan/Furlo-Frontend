'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { CreatePackModal } from '@/components/feed/CreatePackModal'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'

import { getSupabaseClient } from '@/lib/supabaseClient'

interface Community {
  id: string
  name: string
  slug: string
  description: string
  cover_image_url: string
  member_count: number
  category?: string
  status?: string
  is_approved?: boolean
  is_verified?: boolean
  is_joined?: boolean
  joined?: boolean
  sample_members?: { id: string; name: string; username: string; profile_image_url: string }[]
}

const CATEGORIES = [
  'All Packs',
  'Dog Breeds',
  'Bangalore Local',
  'Nutrition & Diet',
  'Puppy Training',
  'Senior Dogs',
]

export default function PacksDiscoveryPage() {
  const { activePet } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Packs')
  const [communities, setCommunities] = useState<Community[]>([])
  const [myPacks, setMyPacks] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [categories, setCategories] = useState<string[]>(['All Packs'])

  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiFetch<string[]>('/communities/categories')
      if (data && data.length > 0) {
        setCategories(data)
      }
    } catch (err) {
      console.warn('[Packs] Categories fetch error:', err)
      setCategories(['All Packs'])
    }
  }, [])

  const fetchCommunities = useCallback(async () => {
    setLoading(true)
    try {
      const petQuery = activePet?.id ? `&petId=${activePet.id}` : ''
      const catQuery = activeCategory !== 'All Packs' ? `&category=${encodeURIComponent(activeCategory)}` : ''
      const searchParam = searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''

      const data = await apiFetch<Community[]>(`/communities?${catQuery}${searchParam}${petQuery}`)
      if (data) {
        setCommunities(data)
      }
    } catch (err) {
      console.error('[Packs] Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, searchQuery, activePet?.id])

  const fetchMyPacks = useCallback(async () => {
    if (!activePet?.id) return
    try {
      const data = await apiFetch<Community[]>(`/communities/mine?petId=${activePet.id}`)
      if (data) {
        setMyPacks(data)
      }
    } catch (err) {
      console.error('[Packs] My packs fetch error:', err)
    }
  }, [activePet?.id])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchCommunities()
    fetchMyPacks()
  }, [fetchCommunities, fetchMyPacks])

  // Real-time synchronization for community_members changes across all clients & tabs
  useEffect(() => {
    let channel: any = null

    getSupabaseClient().then((supabase) => {
      if (!supabase) return
      const channelName = `community-members-realtime-${Math.random().toString(36).substring(2, 7)}`
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'community_members' },
          () => {
            fetchCommunities()
            fetchMyPacks()
          }
        )

      channel.subscribe()
    })

    return () => {
      if (channel) {
        getSupabaseClient().then((supabase) => {
          if (supabase) supabase.removeChannel(channel)
        })
      }
    }
  }, [fetchCommunities, fetchMyPacks])

  const handleToggleJoin = async (c: Community, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!activePet?.id) {
      toast.error('Please log in with a pet profile to join a pack 🐾')
      return
    }

    const prevJoined = Boolean(c.is_joined ?? c.joined)
    const prevCount = c.member_count

    // Optimistic UI update
    setCommunities((prev) =>
      prev.map((item) =>
        item.id === c.id
          ? {
              ...item,
              is_joined: !prevJoined,
              joined: !prevJoined,
              member_count: prevJoined ? Math.max(0, prevCount - 1) : prevCount + 1,
            }
          : item
      )
    )

    try {
      const res = await apiFetch<{ success: boolean; joined?: boolean; isJoined?: boolean; memberCount: number }>(
        `/communities/${c.id}/join`,
        {
          method: 'POST',
          json: { petId: activePet.id },
        }
      )

      if (res) {
        const nextJoined = res.joined ?? res.isJoined ?? false
        setCommunities((prev) =>
          prev.map((item) =>
            item.id === c.id
              ? {
                  ...item,
                  is_joined: nextJoined,
                  joined: nextJoined,
                  member_count: res.memberCount,
                }
              : item
          )
        )

        if (nextJoined) {
          toast.success(`Welcome to ${c.name}! 🐾`)
        } else {
          toast.info(`Left ${c.name}`)
        }
        fetchMyPacks()
      }
    } catch (err: any) {
      // Revert optimism
      setCommunities((prev) =>
        prev.map((item) =>
          item.id === c.id ? { ...item, is_joined: prevJoined, joined: prevJoined, member_count: prevCount } : item
        )
      )
      toast.error(err?.message || 'Failed to update membership')
    }
  }

  const featuredPack = communities.find((c) => c.slug === 'golden-retriever-club') || communities[0]
  const remainingPacks = communities.filter((c) => c.id !== featuredPack?.id)

  return (
    <div className="min-h-screen flex" style={{ background: '#FEF9F3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AppSidebar />

      <main className="flex-1 max-w-[900px] px-4 md:px-8 pt-4 pb-24 mx-auto w-full flex flex-col gap-8">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between py-2 border-b border-[#EDE8E1]">
          <Link href="/feed" className="flex items-center gap-1 text-[#011E14] font-bold text-[14px]">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Back to Yard</span>
          </Link>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#E8843A] text-white px-3.5 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create Pack</span>
          </button>
        </header>

        {/* Hero Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <h1 className="text-[32px] md:text-[44px] font-bold text-[#011E14] leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Find Your Pack 🐾
              </h1>
              <p className="text-[15px] text-[#424844] mt-1">
                Connect with pet parents who share your breed, city, and pet passions.
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-[#E8843A] hover:bg-[#974900] text-white px-6 py-3 rounded-full font-bold text-[14px] shadow-sm transition-all active:scale-95 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>Create a Pack</span>
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full mt-4">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#727974] text-[22px]">
              search
            </span>
            <input
              type="text"
              placeholder="Sniff around for a pack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full border border-[#EDE8E1] bg-white text-[15px] text-[#011E14] focus:outline-none focus:border-[#E8843A] shadow-2xs transition-colors"
            />
          </div>
        </section>

        {/* Category Filter Chips */}
        <section className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-semibold text-[13px] whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FFDBC7] text-[#974900] border border-[#E8843A]/30 shadow-2xs'
                    : 'bg-white text-[#424844] border border-[#EDE8E1] hover:bg-[#F8F3ED]'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </section>

        {/* My Joined Packs Strip */}
        {myPacks.length > 0 && (
          <section className="bg-white p-5 rounded-3xl border border-[#EDE8E1] shadow-xs">
            <h2 className="text-[18px] font-bold text-[#011E14] mb-3 flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span>My Joined Packs</span>
              <span className="material-symbols-outlined text-[#E8843A] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-1 items-center">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-14 h-14 rounded-full border-2 border-dashed border-[#EDE8E1] flex items-center justify-center text-[#727974] hover:text-[#E8843A] hover:border-[#E8843A] transition-colors shrink-0"
                title="Create a new pack"
              >
                <span className="material-symbols-outlined text-[24px]">add</span>
              </button>

              {myPacks.map((pack) => (
                <Link
                  key={pack.id}
                  href={`/community/${pack.slug}`}
                  className="relative group shrink-0"
                  title={pack.name}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#C9EAD9] group-hover:border-[#E8843A] transition-all bg-white shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={pack.cover_image_url} alt={pack.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Trending & Popular Packs Grid */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-[22px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Trending & Popular Packs
            </h2>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#727974] flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[36px] text-[#E8843A] animate-spin">
                progress_activity
              </span>
              <p className="text-[14px]">Fetching packs...</p>
            </div>
          ) : communities.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#EDE8E1] my-4 space-y-3">
              <span className="material-symbols-outlined text-[48px] text-[#974900]">groups</span>
              <h3 className="text-[18px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                No packs found
              </h3>
              <p className="text-[14px] text-[#727974]">Try searching for another keyword or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Featured Large Card */}
              {featuredPack && (
                <Link
                  href={`/community/${featuredPack.slug}`}
                  className="md:col-span-2 bg-white rounded-3xl border border-[#EDE8E1] hover:border-[#E8843A]/40 overflow-hidden flex flex-col md:flex-row group transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  <div className="md:w-1/2 h-52 md:h-auto relative overflow-hidden bg-gradient-to-r from-[#163328] to-[#E8843A]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featuredPack.cover_image_url}
                      alt={featuredPack.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#C9EAD9] text-[#163328] px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1 shadow-xs">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        local_fire_department
                      </span>
                      <span>Featured Pack</span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="bg-[#F8F3ED] text-[#424844] px-3 py-1 rounded-lg text-[12px] font-semibold">
                          {featuredPack.category || 'General'}
                        </span>
                        {featuredPack.is_verified || featuredPack.is_approved || featuredPack.status === 'approved' ? (
                          <span className="bg-[#C9EAD9] text-[#163328] px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                              verified
                            </span>
                            <span>Verified Pack</span>
                          </span>
                        ) : (
                          <span className="bg-[#FFDBC7] text-[#974900] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                            ⏳ Pending Admin Approval
                          </span>
                        )}
                      </div>
                      <h3 className="text-[22px] md:text-[26px] font-bold text-[#011E14] group-hover:text-[#E8843A] transition-colors mb-2 flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        <span>{featuredPack.name}</span>
                        {(featuredPack.is_verified || featuredPack.is_approved || featuredPack.status === 'approved') && (
                          <span className="material-symbols-outlined text-[#163328] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified Community">
                            verified
                          </span>
                        )}
                      </h3>
                      <p className="text-[14px] text-[#424844] leading-relaxed line-clamp-2 mb-6">
                        {featuredPack.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#EDE8E1]">
                      <div className="flex items-center gap-2">
                        {featuredPack.sample_members && featuredPack.sample_members.length > 0 && (
                          <div className="flex -space-x-2">
                            {featuredPack.sample_members.map((m, idx) => (
                              <div key={idx} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-white">
                                {m.profile_image_url ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img src={m.profile_image_url} alt={m.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-[#f8f3ed] flex items-center justify-center text-[#E8843A]">
                                    <span className="material-symbols-outlined text-[14px]">pets</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        <span className="text-[13px] font-bold text-[#727974]">
                          {featuredPack.member_count} Pack Members
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleToggleJoin(featuredPack, e)}
                        className={`px-5 py-2 rounded-full font-bold text-[13px] transition-all shadow-xs active:scale-95 ${
                          (featuredPack.is_joined ?? featuredPack.joined)
                            ? 'bg-[#C9EAD9] text-[#163328] border border-[#163328]/20'
                            : 'bg-[#163328] text-white hover:bg-[#011E14]'
                        }`}
                      >
                        {(featuredPack.is_joined ?? featuredPack.joined) ? 'Joined ✓' : 'Join Pack 🐾'}
                      </button>
                    </div>
                  </div>
                </Link>
              )}

              {/* Standard Cards Grid */}
              {remainingPacks.map((c) => {
                const isCardJoined = Boolean(c.is_joined ?? c.joined)
                return (
                  <Link
                    key={c.id}
                    href={`/community/${c.slug}`}
                    className="bg-white rounded-3xl border border-[#EDE8E1] hover:border-[#E8843A]/40 overflow-hidden flex flex-col group transition-all shadow-xs hover:shadow-md cursor-pointer"
                  >
                    <div className="h-40 relative overflow-hidden bg-gradient-to-r from-[#163328] to-[#E8843A]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={c.cover_image_url}
                        alt={c.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="bg-[#F8F3ED] text-[#424844] px-2.5 py-0.5 rounded-lg text-[11px] font-semibold">
                            {c.category || 'General'}
                          </span>
                          {(c.is_verified || c.is_approved || c.status === 'approved') && (
                            <span className="bg-[#C9EAD9] text-[#163328] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                verified
                              </span>
                              <span>Verified</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-[18px] font-bold text-[#011E14] group-hover:text-[#E8843A] transition-colors mb-1.5 flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                          <span>{c.name}</span>
                          {(c.is_verified || c.is_approved || c.status === 'approved') && (
                            <span className="material-symbols-outlined text-[#163328] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified Community">
                              verified
                            </span>
                          )}
                        </h3>
                        <p className="text-[13px] text-[#424844] line-clamp-2 leading-relaxed mb-4">
                          {c.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#EDE8E1]">
                        <span className="text-[12px] font-bold text-[#727974]">
                          {c.member_count} Members
                        </span>

                        <button
                          onClick={(e) => handleToggleJoin(c, e)}
                          className={`px-4 py-1.5 rounded-full font-bold text-[12px] transition-all active:scale-95 ${
                            isCardJoined
                              ? 'bg-[#C9EAD9] text-[#163328] border border-[#163328]/20'
                              : 'bg-[#163328] text-white hover:bg-[#011E14]'
                          }`}
                        >
                          {isCardJoined ? 'Joined ✓' : 'Join'}
                        </button>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <RightSidebar />

      <CreatePackModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchCommunities()
          fetchMyPacks()
        }}
      />
    </div>
  )
}
