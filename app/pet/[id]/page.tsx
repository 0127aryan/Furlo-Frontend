'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { PostCard, Post } from '@/components/feed/PostCard'
import { ReportPostModal } from '@/components/feed/ReportPostModal'
import { CreatePostModal } from '@/components/feed/CreatePostModal'
import { EditPetProfileModal } from '@/components/feed/EditPetProfileModal'
import { useAuthStore } from '@/store/useAuthStore'
import { usePetSocialStore } from '@/store/usePetSocialStore'
import { getSupabaseClient } from '@/lib/supabaseClient'
import { startFollowRealtime } from '@/lib/subscribeFollowEvents'
import { applyFeedCounts, applyPostRowCounts, subscribeYardFeed } from '@/lib/subscribeYardFeed'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'
import { getPetSpecies, getPostVerb } from '@/lib/petVerbMap'

interface PetProfile {
  id: string
  name: string
  username: string
  breed: string
  pet_type?: string
  city: string
  gender?: string
  bio?: string
  personality_tags?: string[]
  profile_image_url?: string
  created_at?: string
  users?: {
    id: string
    name: string
    email: string
  }
}

export default function PetProfilePage() {
  const params = useParams()
  const petId = (params?.id || params?.username) as string

  const { activePet, user } = useAuthStore()
  const petIdRef = useRef(activePet?.id)
  petIdRef.current = activePet?.id
  const lastFollowEvent = usePetSocialStore((s) => s.lastEvent)
  const setSocialCounts = usePetSocialStore((s) => s.setCounts)
  const applyFollow = usePetSocialStore((s) => s.applyFollow)
  const [pet, setPet] = useState<PetProfile | null>(null)
  const liveCounts = usePetSocialStore((s) => s.counts[pet?.id || ''] ?? s.counts[petId])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'barks' | 'treats' | 'packs' | 'info'>('barks')
  const [following, setFollowing] = useState(false)
  const [wagSent, setWagSent] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [communities, setCommunities] = useState<{ id: string; name: string }[]>([])
  const [showPackMembers, setShowPackMembers] = useState(false)
  const [packMembersList, setPackMembersList] = useState<any[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [reportingPostId, setReportingPostId] = useState<string | null>(null)
  const [dbStats, setDbStats] = useState({
    barksCount: 0,
    packMembersCount: 0,
    followingCount: 0,
    treatsCount: 0,
  })

  const isOwner = Boolean(
    (activePet?.id && pet?.id && activePet.id === pet.id) ||
    (activePet?.username && pet?.username && activePet.username.toLowerCase() === pet.username.toLowerCase()) ||
    (user?.id && pet?.users?.id && user.id === pet.users.id)
  )

  useEffect(() => {
    if (!isOwner) return
    apiFetch('/auth/communities')
      .then((data) => {
        if (data && Array.isArray(data)) setCommunities(data)
      })
      .catch(() => setCommunities([]))
  }, [isOwner])

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

  const handleToggleFollow = async () => {
    if (!pet?.id) return
    if (!activePet?.id) {
      toast.error('Please log in with a pet profile to follow 🐾')
      return
    }

    const prevFollowing = following
    const prevCount = liveCounts?.packMembersCount ?? dbStats.packMembersCount

    setFollowing(!prevFollowing)
    setDbStats((prev) => ({
      ...prev,
      packMembersCount: prevFollowing
        ? Math.max(0, prevCount - 1)
        : prevCount + 1,
    }))

    try {
      const data = await apiFetch<{
        success: boolean
        following: boolean
        packMembersCount: number
        followingCount: number
        targetPetId: string
        followerPetId: string
      }>('/auth/follow-pet', {
        method: 'POST',
        json: { targetPetId: pet.id, followerPetId: activePet.id },
      })

      if (data) {
        setFollowing(data.following)
        applyFollow({
          targetPetId: data.targetPetId || pet.id,
          followerPetId: data.followerPetId || activePet.id,
          following: data.following,
          packMembersCount: data.packMembersCount,
          followingCount: data.followingCount ?? 0,
        })
        setDbStats((prev) => ({
          ...prev,
          packMembersCount:
            (data.targetPetId || pet.id) === pet.id
              ? data.packMembersCount
              : prev.packMembersCount,
          followingCount:
            (data.followerPetId || activePet.id) === pet.id
              ? data.followingCount ?? prev.followingCount
              : prev.followingCount,
        }))
        if (data.following) {
          toast.success(`You are now following ${pet.name}! 🐾`)
        }
      }
    } catch (err: any) {
      setFollowing(prevFollowing)
      setDbStats((prev) => ({ ...prev, packMembersCount: prevCount }))
      toast.error(err?.message || 'Failed to update follow status')
    }
  }

  const handleOpenPackMembers = async () => {
    if (!pet?.id) return
    setShowPackMembers(true)
    setLoadingMembers(true)
    try {
      const data = await apiFetch<{ members: any[] }>(`/auth/pet/${pet.id}/pack-members`)
      if (data && data.members) {
        setPackMembersList(data.members)
      }
    } catch (err) {
      console.error('[PetProfile] Pack members fetch error:', err)
    } finally {
      setLoadingMembers(false)
    }
  }

  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [followingList, setFollowingList] = useState<any[]>([])
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  const handleOpenFollowing = async () => {
    if (!pet?.id) return
    setShowFollowingModal(true)
    setLoadingFollowing(true)
    try {
      const data = await apiFetch<{ following: any[] }>(`/auth/pet/${pet.id}/following`)
      if (data && data.following) {
        setFollowingList(data.following)
      }
    } catch (err) {
      console.error('[PetProfile] Following list fetch error:', err)
    } finally {
      setLoadingFollowing(false)
    }
  }

  const handleSendWag = async () => {
    if (!pet?.id) return
    if (!activePet?.id) {
      toast.error('Please log in with a pet profile to send a wag 🐾')
      return
    }

    setWagSent(true)
    toast.success(`You sent a tail wag to ${pet.name}! 🐾`)

    try {
      await apiFetch('/auth/send-wag', {
        method: 'POST',
        json: { targetPetId: pet.id, senderPetId: activePet.id },
      })
    } catch (err: any) {
      console.warn('[PetProfile] Send wag error:', err)
    }
  }

  useEffect(() => {
    if (!petId) return
    setLoading(true)
    startFollowRealtime()

    const viewerQuery = activePet?.id ? `?viewerPetId=${encodeURIComponent(activePet.id)}` : ''
    apiFetch<{
      pet: PetProfile
      posts: Post[]
      stats?: {
        barksCount: number
        packMembersCount: number
        followingCount: number
        treatsCount: number
        isFollowing?: boolean
      }
    }>(`/auth/pet/${petId}${viewerQuery}`)
      .then((data) => {
        if (data && data.pet) {
          setPet(data.pet)
          setPosts(data.posts || [])

          const barks = data.posts ? data.posts.length : 0
          const treats = (data.posts || []).reduce(
            (sum, p) => sum + (p.like_count || 0),
            0,
          )

          const nextStats = {
            barksCount: data.stats?.barksCount ?? barks,
            packMembersCount: data.stats?.packMembersCount ?? 0,
            followingCount: data.stats?.followingCount ?? 0,
            treatsCount: data.stats?.treatsCount ?? treats,
          }
          setDbStats(nextStats)
          setSocialCounts(data.pet.id, {
            packMembersCount: nextStats.packMembersCount,
            followingCount: nextStats.followingCount,
          })
          if (data.stats?.isFollowing !== undefined) {
            setFollowing(Boolean(data.stats.isFollowing))
          }
        } else {
          setError('Pet profile not found')
        }
      })
      .catch((err) => {
        console.error('[PetProfile] Fetch error:', err)
        setError('Failed to load pet profile')
      })
      .finally(() => setLoading(false))
  }, [petId, activePet?.id, setSocialCounts])

  useEffect(() => {
    startFollowRealtime()
  }, [])

  useEffect(() => {
    if (!lastFollowEvent || !pet?.id || !activePet?.id) return
    if (lastFollowEvent.targetPetId === pet.id && lastFollowEvent.followerPetId === activePet.id) {
      setFollowing(lastFollowEvent.following)
    }
  }, [lastFollowEvent, pet?.id, activePet?.id])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || !petId) return
      const viewerQuery = activePet?.id ? `?viewerPetId=${encodeURIComponent(activePet.id)}` : ''
      apiFetch<{
        pet: PetProfile
        stats?: {
          packMembersCount: number
          followingCount: number
          isFollowing?: boolean
        }
      }>(`/auth/pet/${petId}${viewerQuery}`)
        .then((data) => {
          if (!data?.pet) return
          setSocialCounts(data.pet.id, {
            packMembersCount: data.stats?.packMembersCount,
            followingCount: data.stats?.followingCount,
          })
          setDbStats((prev) => ({
            ...prev,
            packMembersCount: data.stats?.packMembersCount ?? prev.packMembersCount,
            followingCount: data.stats?.followingCount ?? prev.followingCount,
          }))
          if (data.stats?.isFollowing !== undefined) {
            setFollowing(Boolean(data.stats.isFollowing))
          }
        })
        .catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [petId, activePet?.id, setSocialCounts])

  // Real-time synchronization for pet profile updates across all clients & tabs
  useEffect(() => {
    if (!petId) return
    let channel: any = null

    getSupabaseClient().then((supabase) => {
      if (!supabase) return
      const channelName = `pet-${petId}-${Math.random().toString(36).substring(2, 7)}`
      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'pets' },
          (payload: { new?: Partial<PetProfile> }) => {
            if (payload.new) {
              setPet((prev) => (prev ? { ...prev, ...payload.new } : prev))
            }
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
  }, [petId])

  const totalTreats = dbStats.treatsCount || posts.reduce((sum, p) => sum + (p.like_count || 0), 0)
  const packMembersCount = liveCounts?.packMembersCount ?? dbStats.packMembersCount
  const followingCount = liveCounts?.followingCount ?? dbStats.followingCount

  return (
    <div
      className="min-h-screen flex"
      style={{ background: '#FEF9F3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <AppSidebar />

      <main className="flex-1 max-w-[800px] px-4 md:px-8 pt-4 pb-24 mx-auto w-full flex flex-col gap-6">
        {/* Mobile Header */}
        <header className="flex md:hidden items-center justify-between py-2 border-b border-[#EDE8E1]">
          <Link href="/feed" className="flex items-center gap-1 text-[#011E14] font-bold text-[14px]">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span>Back to Yard</span>
          </Link>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#727974]">
            <span className="material-symbols-outlined text-[36px] text-[#E8843A] animate-spin">
              progress_activity
            </span>
            <p className="text-[14px]">Fetching pet profile...</p>
          </div>
        ) : error || !pet ? (
          <div className="bg-white rounded-3xl p-10 border border-[#EDE8E1] text-center flex flex-col items-center gap-4 shadow-sm my-8">
            <span className="material-symbols-outlined text-[48px] text-[#974900]">pets</span>
            <h3 className="font-bold text-[20px] text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {error || 'Pet not found'}
            </h3>
            <Link
              href="/feed"
              className="bg-[#E8843A] text-white text-[14px] font-bold px-6 py-2.5 rounded-full hover:bg-[#974900] transition-colors shadow-sm"
            >
              Return to The Yard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Cover Banner */}
            <div className="w-full h-52 md:h-72 rounded-3xl relative overflow-hidden bg-gradient-to-r from-[#163328] via-[#2d4a3e] to-[#E8843A] shadow-sm">
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Profile Header & Identity Card */}
            <div className="px-2 -mt-20 md:-mt-24 relative z-10">
              {/* Avatar & Action Row */}
              <div className="flex items-end justify-between mb-4">
                <div className="relative">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#FEF9F3] overflow-hidden shadow-lg bg-white">
                    {pet.profile_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={pet.profile_image_url}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#f8f3ed] flex items-center justify-center text-[#E8843A]">
                        <span className="material-symbols-outlined text-[48px]">pets</span>
                      </div>
                    )}
                  </div>
                  {/* Verified Badge */}
                  <div
                    className="absolute bottom-1 right-1 w-7 h-7 bg-[#C9EAD9] text-[#163328] rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                    title="Verified Paw"
                  >
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pb-1">
                  {isOwner ? (
                    <button
                      onClick={() => setIsEditOpen(true)}
                      className="px-6 py-2 rounded-full border-2 border-[#011E14] text-[#011E14] font-bold text-[13px] hover:bg-[#011E14]/5 transition-all flex items-center gap-2 active:scale-95 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleToggleFollow}
                        className={`px-5 py-2 rounded-full font-bold text-[13px] transition-all shadow-sm flex items-center gap-1.5 active:scale-95 ${
                          following
                            ? 'bg-[#C9EAD9] text-[#163328]'
                            : 'bg-[#163328] text-white hover:bg-[#011e14]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {following ? 'check' : 'person_add'}
                        </span>
                        <span>{following ? 'Following' : 'Follow'}</span>
                      </button>

                      <button
                        onClick={handleSendWag}
                        className={`px-5 py-2 rounded-full border-2 font-bold text-[13px] transition-all flex items-center gap-1.5 active:scale-95 ${
                          wagSent
                            ? 'border-[#E8843A] bg-[#E8843A]/10 text-[#E8843A]'
                            : 'border-[#EDE8E1] bg-white text-[#011E14] hover:bg-[#f8f3ed]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[#974900] text-[18px]">
                          waving_hand
                        </span>
                        <span>{wagSent ? 'Wag Sent! 🐾' : 'Send a Wag'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isOwner ? (
                <div className="flex justify-end -mt-2 mb-4">
                  <button
                    onClick={() => setIsCreateOpen(true)}
                    className="px-6 py-2 rounded-full bg-[#E8843A] text-white font-bold text-[13px] hover:bg-[#974900] transition-all flex items-center gap-2 active:scale-95 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>Post {getPostVerb(getPetSpecies(pet))}</span>
                  </button>
                </div>
              ) : null}

              {/* Name & Handle */}
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h1 className="text-[28px] md:text-[36px] font-bold text-[#011E14] leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {pet.name}
                  </h1>
                  <span className="bg-[#C9EAD9] text-[#163328] px-3.5 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                    {pet.breed || 'Companion'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-[#424844] font-medium">
                  <span>@{pet.username}</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[16px] text-[#E8843A]">location_on</span>
                    {pet.city}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {pet.bio && (
                <p className="text-[15px] text-[#1D1B18] leading-relaxed max-w-2xl mb-4">
                  {pet.bio}
                </p>
              )}

              {/* Personality Tags */}
              {pet.personality_tags && pet.personality_tags.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {pet.personality_tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FFDBC7] text-[#E8843A] px-4 py-1.5 rounded-full text-[13px] font-semibold border border-[#EDE8E1] shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats Bar */}
              <div className="bg-[#F8F3ED] rounded-2xl p-5 border border-[#EDE8E1] shadow-xs flex justify-between items-center text-center gap-2 mb-6">
                <div className="flex-1">
                  <p className="text-[22px] md:text-[26px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {dbStats.barksCount}
                  </p>
                  <p className="text-[11px] text-[#727974] font-bold uppercase tracking-wider">Barks</p>
                </div>
                <div className="h-8 w-px bg-[#EDE8E1]" />
                <div
                  onClick={handleOpenPackMembers}
                  className="flex-1 cursor-pointer hover:bg-[#f2eae0] p-1 rounded-xl transition-colors"
                >
                  <p className="text-[22px] md:text-[26px] font-bold text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {packMembersCount}
                  </p>
                  <p className="text-[11px] text-[#727974] font-bold uppercase tracking-wider">Pack Members</p>
                </div>
                <div className="h-8 w-px bg-[#EDE8E1]" />
                <div
                  onClick={handleOpenFollowing}
                  className="flex-1 cursor-pointer hover:bg-[#f2eae0] p-1 rounded-xl transition-colors"
                >
                  <p className="text-[22px] md:text-[26px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {followingCount}
                  </p>
                  <p className="text-[11px] text-[#727974] font-bold uppercase tracking-wider">Following</p>
                </div>
                <div className="h-8 w-px bg-[#EDE8E1]" />
                <div className="flex-1">
                  <p className="text-[22px] md:text-[26px] font-bold text-[#E8843A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {dbStats.treatsCount}
                  </p>
                  <p className="text-[11px] text-[#727974] font-bold uppercase tracking-wider">Treats</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="border-b border-[#EDE8E1] flex gap-8 mb-6 text-[14px] font-bold">
                <button
                  onClick={() => setActiveTab('barks')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'barks' ? 'text-[#011E14]' : 'text-[#727974] hover:text-[#011E14]'
                  }`}
                >
                  Barks ({posts.length})
                  {activeTab === 'barks' && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8843A] rounded-t-full" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('treats')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'treats' ? 'text-[#011E14]' : 'text-[#727974] hover:text-[#011E14]'
                  }`}
                >
                  Treats Received
                  {activeTab === 'treats' && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8843A] rounded-t-full" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-3 transition-colors relative ${
                    activeTab === 'info' ? 'text-[#011E14]' : 'text-[#727974] hover:text-[#011E14]'
                  }`}
                >
                  Paw Print Info
                  {activeTab === 'info' && (
                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#E8843A] rounded-t-full" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'info' ? (
                <div className="bg-white p-6 rounded-2xl border border-[#EDE8E1] space-y-4">
                  <h3 className="font-bold text-[16px] text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Companion Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-[14px]">
                    <div>
                      <p className="text-[#727974] text-[12px]">Breed</p>
                      <p className="font-bold text-[#011E14]">{pet.breed}</p>
                    </div>
                    <div>
                      <p className="text-[#727974] text-[12px]">City</p>
                      <p className="font-bold text-[#011E14]">{pet.city}</p>
                    </div>
                    <div>
                      <p className="text-[#727974] text-[12px]">Gender</p>
                      <p className="font-bold text-[#011E14] capitalize">{pet.gender || 'Unknown'}</p>
                    </div>
                    {pet.users && (
                      <div>
                        <p className="text-[#727974] text-[12px]">Pet Parent</p>
                        <Link href={`/pet-lover/${pet.users.id}`} className="font-bold text-[#163328] hover:text-[#E8843A]">
                          {pet.users.name || 'Parent Profile'}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ) : activeTab === 'treats' ? (
                <div className="bg-white p-8 rounded-2xl border border-[#EDE8E1] text-center text-[#727974]">
                  <span className="material-symbols-outlined text-[36px] text-[#E8843A] mb-2">pets</span>
                  <p className="font-bold text-[#011E14] text-[16px]">{pet.name} has received {totalTreats} treats!</p>
                  <p className="text-[13px] mt-1">Keep barking to collect more treats from the pack.</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-[#EDE8E1] text-center text-[#727974]">
                  <p className="text-[14px]">{pet.name} has not posted any barks yet 🐾</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      isOwner={isOwner}
                      onReport={(postId) => setReportingPostId(postId)}
                      onDelete={(deletedId) => {
                        setPosts((prev) => prev.filter((p) => p.id !== deletedId));
                        setDbStats((prev) => ({
                          ...prev,
                          barksCount: Math.max(0, prev.barksCount - 1),
                        }));
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <RightSidebar />

      <ReportPostModal
        postId={reportingPostId}
        isOpen={!!reportingPostId}
        onClose={() => setReportingPostId(null)}
      />

      {pet && (
        <EditPetProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          pet={pet}
          onSuccess={(updatedPet) => {
            setPet((prev) => (prev ? { ...prev, ...updatedPet } : prev))
          }}
        />
      )}

      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={(newPost) => {
          setPosts((prev) => [newPost, ...prev])
          setDbStats((prev) => ({ ...prev, barksCount: prev.barksCount + 1 }))
          setIsCreateOpen(false)
        }}
        communities={communities}
      />

      {/* Pack Members Modal Overlay */}
      {showPackMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FEF9F3] w-full max-w-md rounded-3xl shadow-2xl border border-[#EDE8E1] overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E1] bg-white">
              <h3 className="text-[18px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {pet?.name}&apos;s Pack Members 🐾
              </h3>
              <button
                onClick={() => setShowPackMembers(false)}
                className="p-1.5 text-[#727974] hover:text-[#011E14] hover:bg-[#f8f3ed] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {loadingMembers ? (
                <div className="py-8 text-center text-[#727974] text-[14px]">
                  Loading pack members...
                </div>
              ) : packMembersList.length === 0 ? (
                <div className="py-8 text-center text-[#727974] text-[14px]">
                  No pack members yet. Be the first to join the pack! 🐾
                </div>
              ) : (
                packMembersList.map((m) => (
                  <Link
                    key={m.id}
                    href={m.username ? `/profiles/${m.username}` : `/profiles/${m.id}`}
                    onClick={() => setShowPackMembers(false)}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#EDE8E1] hover:bg-[#f6f9ff] transition-all"
                  >
                    {m.profile_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={m.profile_image_url}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EDE8E1]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] shrink-0 text-[#E8843A]">
                        <span className="material-symbols-outlined text-[18px]">pets</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#011E14] text-[14px] truncate">{m.name}</p>
                      <p className="text-[12px] text-[#727974] truncate">@{m.username || 'pet'} • {m.breed}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal Overlay */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FEF9F3] w-full max-w-md rounded-3xl shadow-2xl border border-[#EDE8E1] overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDE8E1] bg-white">
              <h3 className="text-[18px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {pet?.name}&apos;s Following 🐾
              </h3>
              <button
                onClick={() => setShowFollowingModal(false)}
                className="p-1.5 text-[#727974] hover:text-[#011E14] hover:bg-[#f8f3ed] rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              {loadingFollowing ? (
                <div className="py-8 text-center text-[#727974] text-[14px]">
                  Loading following list...
                </div>
              ) : followingList.length === 0 ? (
                <div className="py-8 text-center text-[#727974] text-[14px]">
                  {pet?.name} is not following any pets yet 🐾
                </div>
              ) : (
                followingList.map((m) => (
                  <Link
                    key={m.id}
                    href={m.username ? `/profiles/${m.username}` : `/profiles/${m.id}`}
                    onClick={() => setShowFollowingModal(false)}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-[#EDE8E1] hover:bg-[#f6f9ff] transition-all"
                  >
                    {m.profile_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={m.profile_image_url}
                        alt={m.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EDE8E1]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] shrink-0 text-[#E8843A]">
                        <span className="material-symbols-outlined text-[18px]">pets</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#011E14] text-[14px] truncate">{m.name}</p>
                      <p className="text-[12px] text-[#727974] truncate">@{m.username || 'pet'} • {m.breed}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
