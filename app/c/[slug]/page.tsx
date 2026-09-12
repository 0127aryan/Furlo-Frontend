'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { PostCard } from '@/components/feed/PostCard'
import { CreatePostModal } from '@/components/feed/CreatePostModal'
import { ReportPostModal } from '@/components/feed/ReportPostModal'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'
import { applyFeedCounts, applyPostRowCounts, subscribeYardFeed } from '@/lib/subscribeYardFeed'
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
  created_at: string
}

interface Post {
  id: string
  caption: string
  post_type: 'regular' | 'question' | 'advice' | 'meme'
  location_city?: string
  like_count: number
  comment_count: number
  created_at: string
  pets: {
    id: string
    name: string
    username: string
    breed: string
    city: string
    profile_image_url: string
  }
  media: { id: string; media_url: string; display_order: number }[]
}

interface MemberPet {
  id: string
  name: string
  username: string
  breed: string
  city: string
  profile_image_url: string
}

export default function SingleCommunityPage() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const { activePet } = useAuthStore()
  const petIdRef = useRef(activePet?.id)
  petIdRef.current = activePet?.id

  const [community, setCommunity] = useState<Community | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [members, setMembers] = useState<MemberPet[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [announcement, setAnnouncement] = useState<{ title: string; content: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<'feed' | 'members' | 'about'>('feed')
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [reportingPostId, setReportingPostId] = useState<string | null>(null)

  const fetchCommunityDetails = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const petQuery = activePet?.id ? `?petId=${activePet.id}` : ''
      const data = await apiFetch<{
        community: Community
        joined?: boolean
        isJoined?: boolean
        members: MemberPet[]
        posts: Post[]
        announcement?: { title: string; content: string }
      }>(`/communities/${slug}${petQuery}`)

      if (data && data.community) {
        setCommunity(data.community)
        setIsJoined(data.joined ?? data.isJoined ?? data.community.is_joined ?? false)
        setMembers(data.members || [])
        setPosts(data.posts || [])
        if (data.announcement) setAnnouncement(data.announcement)
      } else {
        setError('Community not found')
      }
    } catch (err: any) {
      console.error('[Community] Fetch error:', err)
      setError(err?.message || 'Failed to fetch community')
    } finally {
      setLoading(false)
    }
  }, [slug, activePet?.id])

  useEffect(() => {
    fetchCommunityDetails()
  }, [fetchCommunityDetails])

  useEffect(() => {
    return subscribeYardFeed({
      onCounts: (payload) => {
        setPosts((prev) => applyFeedCounts(prev, payload, petIdRef.current))
      },
      onPostRow: (row) => {
        setPosts((prev) => applyPostRowCounts(prev, row))
      },
    })
  }, [])

  // Real-time synchronization for community members in single pack view
  useEffect(() => {
    if (!community?.id) return
    let channel: any = null

    getSupabaseClient().then((supabase) => {
      if (!supabase) return
      const channelName = `community-members-${community.id}-${Math.random().toString(36).substring(2, 7)}`
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'community_members', filter: `community_id=eq.${community.id}` },
          () => {
            fetchCommunityDetails()
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
  }, [community?.id, fetchCommunityDetails])

  const handleToggleJoin = async () => {
    if (!community?.id) return
    if (!activePet?.id) {
      toast.error('Please log in with a pet profile to join this pack 🐾')
      return
    }

    const prevJoined = isJoined
    const prevCount = community.member_count

    setIsJoined(!prevJoined)
    setCommunity((prev) =>
      prev
        ? {
            ...prev,
            member_count: prevJoined ? Math.max(0, prevCount - 1) : prevCount + 1,
          }
        : prev
    )

    try {
      const res = await apiFetch<{ success: boolean; joined?: boolean; isJoined?: boolean; memberCount: number }>(
        `/communities/${community.id}/join`,
        {
          method: 'POST',
          json: { petId: activePet.id },
        }
      )

      if (res) {
        const nextJoined = res.joined ?? res.isJoined ?? false
        setIsJoined(nextJoined)
        setCommunity((prev) => (prev ? { ...prev, member_count: res.memberCount, is_joined: nextJoined } : prev))
        if (nextJoined) {
          toast.success(`Welcome to ${community.name}! 🐾`)
        } else {
          toast.info(`Left ${community.name}`)
        }
      }
    } catch (err: any) {
      setIsJoined(prevJoined)
      setCommunity((prev) => (prev ? { ...prev, member_count: prevCount } : prev))
      toast.error(err?.message || 'Failed to update pack membership')
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FEF9F3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AppSidebar />

      <main className="flex-1 max-w-[850px] px-4 md:px-8 pt-4 pb-24 mx-auto w-full flex flex-col gap-6">
        {/* Mobile Navigation Header */}
        <header className="flex md:hidden items-center justify-between py-2 border-b border-[#EDE8E1]">
          <Link href="/packs" className="flex items-center gap-1 text-[#011E14] font-bold text-[14px]">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>All Packs</span>
          </Link>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#727974]">
            <span className="material-symbols-outlined text-[36px] text-[#E8843A] animate-spin">
              progress_activity
            </span>
            <p className="text-[14px]">Fetching pack details...</p>
          </div>
        ) : error || !community ? (
          <div className="bg-white rounded-3xl p-10 border border-[#EDE8E1] text-center flex flex-col items-center gap-4 shadow-sm my-8">
            <span className="material-symbols-outlined text-[48px] text-[#974900]">groups</span>
            <h3 className="font-bold text-[20px] text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {error || 'Pack not found'}
            </h3>
            <Link
              href="/packs"
              className="bg-[#E8843A] text-white text-[14px] font-bold px-6 py-2.5 rounded-full hover:bg-[#974900] transition-colors shadow-sm"
            >
              Explore Other Packs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Hero Cover Photo Banner */}
            <div className="w-full h-52 md:h-72 rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#163328] via-[#2d4a3e] to-[#E8843A] shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={community.cover_image_url} alt={community.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Profile Identity Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#EDE8E1] shadow-xs -mt-16 md:-mt-20 relative z-10 mx-2">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
                <div className="flex items-end gap-4">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden shadow-md bg-[#F8F3ED] shrink-0 -mt-12 md:-mt-14">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={community.cover_image_url} alt={community.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h1 className="text-[24px] md:text-[32px] font-bold text-[#011E14] leading-tight flex items-center gap-1.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      <span>{community.name}</span>
                      {(community.is_verified || community.is_approved || community.status === 'approved') && (
                        <span className="material-symbols-outlined text-[#163328] text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }} title="Verified Pack">
                          verified
                        </span>
                      )}
                    </h1>
                    <p className="text-[13px] text-[#727974] font-medium mt-0.5">
                      @{community.slug} • {community.member_count} Members
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
                  {isJoined && (
                    <button
                      onClick={() => setIsComposerOpen(true)}
                      className="px-5 py-2.5 rounded-full font-bold text-[14px] bg-[#E8843A] hover:bg-[#974900] text-white transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      <span>+ New Bark 🐾</span>
                    </button>
                  )}

                  <button
                    onClick={handleToggleJoin}
                    className={`px-6 py-2.5 rounded-full font-bold text-[14px] transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 ${
                      isJoined
                        ? 'bg-[#C9EAD9] text-[#163328] border border-[#163328]/20 hover:bg-[#b8e4cd]'
                        : 'bg-[#163328] text-white hover:bg-[#011E14]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isJoined ? 'check' : 'group_add'}
                    </span>
                    <span>{isJoined ? 'Joined ✓' : 'Join Pack 🐾'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[15px] text-[#1D1B18] leading-relaxed max-w-3xl mb-4">
                {community.description}
              </p>

              {/* Tag Cloud */}
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#F8F3ED] text-[#163328] px-3 py-1 rounded-full text-[12px] font-bold">
                  🏷️ {community.category || 'General'}
                </span>
                {community.is_verified || community.is_approved || community.status === 'approved' ? (
                  <span className="bg-[#C9EAD9] text-[#163328] px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    <span>Super Admin Verified</span>
                  </span>
                ) : (
                  <span className="bg-[#FFDBC7] text-[#974900] px-3 py-1 rounded-full text-[12px] font-bold">
                    ⏳ Pending Super Admin Approval
                  </span>
                )}
              </div>
            </div>

            {/* Pinned Announcement Banner */}
            {announcement && (
              <div className="bg-[#FFDBC7]/60 border border-[#E8843A]/30 p-5 rounded-2xl flex items-start gap-3 shadow-2xs">
                <span className="material-symbols-outlined text-[#E8843A] text-[24px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  push_pin
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#974900]">
                    Pinned Announcement
                  </span>
                  <h4 className="font-bold text-[#011E14] text-[15px] mt-0.5">{announcement.title}</h4>
                  <p className="text-[13px] text-[#424844] mt-1 leading-relaxed">{announcement.content}</p>
                </div>
              </div>
            )}

            {/* Navigation Tabs Bar */}
            <div className="border-b border-[#EDE8E1] flex gap-8 mb-2 text-[14px] font-bold">
              <button
                onClick={() => setActiveTab('feed')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'feed' ? 'text-[#011E14]' : 'text-[#727974] hover:text-[#011E14]'
                }`}
              >
                Feed ({posts.length})
                {activeTab === 'feed' && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8843A] rounded-t-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('members')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'members' ? 'text-[#011E14]' : 'text-[#727974] hover:text-[#011E14]'
                }`}
              >
                Pack Members ({members.length})
                {activeTab === 'members' && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8843A] rounded-t-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('about')}
                className={`pb-3 transition-colors relative ${
                  activeTab === 'about' ? 'text-[#011E14]' : 'text-[#727974] hover:text-[#011E14]'
                }`}
              >
                About & Rules
                {activeTab === 'about' && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8843A] rounded-t-full" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'feed' ? (
              <div className="space-y-6">
                {/* Post Composer Trigger (Gated to Joined Members Only) */}
                {isJoined ? (
                  <div
                    onClick={() => setIsComposerOpen(true)}
                    className="bg-white p-4 rounded-2xl border border-[#EDE8E1] shadow-xs flex items-center gap-3 cursor-pointer hover:bg-[#F8F3ED] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] shrink-0 text-[#E8843A]">
                      <span className="material-symbols-outlined text-[20px]">pets</span>
                    </div>
                    <span className="text-[#727974] text-[14px] flex-1">
                      Bark in {community.name}...
                    </span>
                    <span className="material-symbols-outlined text-[#E8843A] text-[22px]">
                      add_photo_alternate
                    </span>
                  </div>
                ) : (
                  <div className="bg-[#FFDBC7]/40 border border-[#E8843A]/30 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFDBC7] flex items-center justify-center text-[#974900] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">lock</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#011E14] text-[14px]">Only pack members can post barks here</h4>
                        <p className="text-[12px] text-[#424844] mt-0.5">
                          Join {community.name} to share your photo moments, questions & tips with the pack! 🐾
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleJoin}
                      className="px-5 py-2 bg-[#163328] hover:bg-[#011E14] text-white rounded-full font-bold text-[13px] transition-all shadow-xs shrink-0 self-start sm:self-auto active:scale-95 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">group_add</span>
                      <span>Join Pack 🐾</span>
                    </button>
                  </div>
                )}

                {/* Posts Feed List */}
                {posts.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-[#EDE8E1] text-[#727974] my-4 space-y-3">
                    <span className="material-symbols-outlined text-[48px] text-[#E8843A]">campaign</span>
                    <h3 className="text-[18px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      No barks in this pack yet
                    </h3>
                    <p className="text-[13px]">Be the first pet to publish a bark in {community.name}!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isOwner={Boolean(activePet?.id && post.pets?.id && activePet.id === post.pets.id)}
                      onReport={(postId) => setReportingPostId(postId)}
                      onDelete={(deletedId) => setPosts((prev) => prev.filter((p) => p.id !== deletedId))}
                    />
                  ))
                )}
              </div>
            ) : activeTab === 'members' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {members.length === 0 ? (
                  <div className="col-span-2 bg-white rounded-3xl p-10 text-center border border-[#EDE8E1] text-[#727974]">
                    No members listed yet. Join the pack to become the first member! 🐾
                  </div>
                ) : (
                  members.map((m) => (
                    <Link
                      key={m.id}
                      href={m.username ? `/profiles/${m.username}` : `/profiles/${m.id}`}
                      className="bg-white p-4 rounded-2xl border border-[#EDE8E1] hover:border-[#E8843A]/40 flex items-center justify-between transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {m.profile_image_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={m.profile_image_url}
                            alt={m.name}
                            className="w-12 h-12 rounded-full object-cover border border-[#EDE8E1] shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] shrink-0 text-[#E8843A]">
                            <span className="material-symbols-outlined text-[22px]">pets</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#011E14] text-[15px] truncate">{m.name}</h4>
                          <p className="text-[12px] text-[#727974] truncate">
                            @{m.username || 'pet'} • {m.breed}
                          </p>
                        </div>
                      </div>

                      <span className="material-symbols-outlined text-[#E8843A] text-[20px]">
                        chevron_right
                      </span>
                    </Link>
                  ))
                )}
              </div>
            ) : (
              /* About & Rules Tab */
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-[#EDE8E1] space-y-6">
                <div>
                  <h3 className="text-[18px] font-bold text-[#011E14] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    About {community.name}
                  </h3>
                  <p className="text-[14px] text-[#424844] leading-relaxed">{community.description}</p>
                </div>

                <div className="pt-4 border-t border-[#EDE8E1]">
                  <h4 className="font-bold text-[#011E14] text-[15px] mb-3">Pack Rules & Guidelines</h4>
                  <ol className="space-y-2 text-[14px] text-[#424844] list-decimal list-inside">
                    <li>Be kind and respectful to all pet parents and pets in the pack.</li>
                    <li>Keep posts relevant to pack topics, meetups, and pet care.</li>
                    <li>No commercial spam or unauthorized product sales without mod approval.</li>
                    <li>Always practice safe, supervised play during offline meetups! 🐾</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <RightSidebar />

      {community && (
        <CreatePostModal
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          onSuccess={() => fetchCommunityDetails()}
          communities={[{ id: community.id, name: community.name }]}
          defaultCommunityId={community.id}
        />
      )}

      <ReportPostModal
        postId={reportingPostId}
        isOpen={!!reportingPostId}
        onClose={() => setReportingPostId(null)}
      />
    </div>
  )
}
