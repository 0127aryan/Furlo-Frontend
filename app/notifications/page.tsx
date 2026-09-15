'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { NotificationListSkeleton } from '@/components/skeletons'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { toast } from '@/lib/toast'
import { notificationMatchesFilter } from '@/lib/notificationFilters'
import { subscribeRealtimeNotifications, subscribeRevokeNotifications } from '@/lib/subscribeNotifications'

interface PetActor {
  id: string
  name: string
  username: string
  profile_image_url: string
  breed?: string
}

interface NotificationItem {
  id: string
  user_id: string
  actor_pet_id?: string
  type: 'best_answer' | 'treat' | 'comment' | 'follow' | 'pack_announcement' | 'system'
  title: string
  body: string
  entity_type?: 'post' | 'comment' | 'community' | 'pet'
  entity_id?: string
  is_read: boolean
  metadata?: Record<string, any>
  created_at: string
  pets?: PetActor
}

export default function NotificationsCenterPage() {
  const { user } = useAuthStore()

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'treats' | 'comments' | 'followers' | 'qa'>('all')
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({})

  const fetchNotifications = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true)
    try {
      const res = await apiFetch<{
        notifications: NotificationItem[]
        unreadCount: number
      }>(`/notifications?category=${filter}`)

      if (res && Array.isArray(res.notifications)) {
        setNotifications(res.notifications)
        setUnreadCount(res.unreadCount || 0)
      } else {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch {
      setNotifications([])
      setUnreadCount(0)
    } finally {
      if (isInitial) setLoading(false)
    }
  }, [filter])

  // 1. Initial fetch & 3s Background Polling for instant updates without manual refresh
  useEffect(() => {
    fetchNotifications(true)
    const pollInterval = setInterval(() => {
      fetchNotifications(false)
    }, 3000)
    return () => clearInterval(pollInterval)
  }, [fetchNotifications])

  // 2. Realtime Broadcast & Revoke Subscriptions
  useEffect(() => {
    if (!user?.id) return

    const unsubscribeNew = subscribeRealtimeNotifications(user.id, (newNotif) => {
      if (!notificationMatchesFilter(newNotif, filter)) return
      setNotifications((prev) => {
        if (prev.some((item) => item.id === newNotif.id)) return prev
        return [newNotif as NotificationItem, ...prev]
      })
      setUnreadCount((count) => count + 1)
      fetchNotifications()
    })

    const unsubscribeRevoke = subscribeRevokeNotifications((payload) => {
      setNotifications((prev) =>
        prev.filter(
          (item) =>
            item.id !== payload.id &&
            !(item.title === payload.title && item.body === payload.body)
        )
      )
      fetchNotifications()
    })

    return () => {
      unsubscribeNew()
      unsubscribeRevoke()
    }
  }, [user?.id, filter, fetchNotifications])

  const handleMarkAllRead = async () => {
    // Optimistic Motion Update: 200ms pulse & sequential fade out
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    setUnreadCount(0)
    toast.success('All notifications marked as read! 🐾')

    try {
      await apiFetch('/notifications/mark-read', {
        method: 'POST',
        json: { markAll: true },
      })
    } catch {
      // Ignored
    }
  }

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success('Notification dismissed')
  }

  const toggleFollow = (petId: string) => {
    setFollowingMap((prev) => ({ ...prev, [petId]: !prev[petId] }))
  }

  // Filtered notifications
  const filteredList = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'treats') return n.type === 'treat'
    if (filter === 'comments') return n.type === 'comment'
    if (filter === 'followers') return n.type === 'follow'
    if (filter === 'qa') return n.type === 'best_answer' || n.type === 'system'
    return true
  })

  // Group into Today vs Earlier
  const todayItems = filteredList.filter((n) => {
    const age = Date.now() - new Date(n.created_at).getTime()
    return age < 1000 * 60 * 60 * 20
  })

  const earlierItems = filteredList.filter((n) => {
    const age = Date.now() - new Date(n.created_at).getTime()
    return age >= 1000 * 60 * 60 * 20
  })

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#FAF7F2', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      <div className="flex-1 flex justify-center">
        <AppSidebar />

        <main className="flex-1 max-w-[880px] px-4 pt-6 pb-32 space-y-6 mx-auto">
          {/* Breadcrumb & Preferences Bar */}
          <div className="flex items-center justify-between gap-4 text-xs font-bold text-[#727974]">
            <div className="flex items-center gap-1.5">
              <Link href="/feed" className="flex items-center gap-1 hover:text-[#011E14] transition-colors">
                <span className="material-symbols-outlined text-[16px]">home</span>
                <span>Home</span>
              </Link>
              <span className="text-[#C1C8C3]">/</span>
              <span className="text-[#011E14]">Activity Feed</span>
            </div>

            <Link
              href="/notifications/settings"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#F5F2ED] border border-[#EDE8E1] text-[#011E14] text-xs font-bold transition-all shadow-2xs group"
            >
              <span className="material-symbols-outlined text-[16px] text-[#727974] group-hover:text-[#011E14] transition-colors">
                tune
              </span>
              <span>Preferences</span>
            </Link>
          </div>

          {/* Page Title & Global Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1
                className="text-[28px] sm:text-[32px] font-bold text-[#011E14] tracking-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Notifications
              </h1>
              {unreadCount > 0 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EDE8E1] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#E8843A] animate-pulse"></span>
                  <span className="text-xs font-bold text-[#E8843A]">{unreadCount} New</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#EDE8E1] text-xs font-bold text-[#727974]">
                  <span>0 New</span>
                </div>
              )}
            </div>

            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F5F2ED] text-[#011E14] text-xs font-bold transition-all shadow-2xs active:scale-95 ${
                unreadCount === 0 ? 'opacity-60 cursor-default' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[18px] text-[#476457]">done_all</span>
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Category Filter Bar (Pill Carousel) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All', icon: '' },
              { id: 'treats', label: 'Treats & Likes', icon: '🐾' },
              { id: 'comments', label: 'Comments & Answers', icon: '💬' },
              { id: 'followers', label: 'Followers & Wags', icon: '🐕' },
              { id: 'qa', label: 'Q&A', icon: '⭐' },
            ].map((tab) => {
              const isActive = filter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-[0.96] flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#E8843A] text-white shadow-[0_4px_14px_-2px_rgba(232,132,58,0.4)]'
                      : 'bg-white hover:bg-[#F5F2ED] text-[#011E14] border border-[#EDE8E1] shadow-2xs'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.icon && <span className="text-[13px]">{tab.icon}</span>}
                </button>
              )
            })}
          </div>

          {/* Notifications Main List */}
          {loading ? (
            <NotificationListSkeleton />
          ) : filteredList.length === 0 ? (
            /* Empty State */
            <div className="my-8 p-10 rounded-[28px] bg-white border border-[#EDE8E1] text-center shadow-2xs flex flex-col items-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center relative">
                <span className="material-symbols-outlined text-[36px] text-[#E8843A]">pets</span>
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#15803D] text-xs font-bold shadow-2xs">
                  ✓
                </span>
              </div>
              <h3
                className="text-[20px] font-bold text-[#011E14]"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                All caught up!
              </h3>
              <p className="text-xs text-[#727974] leading-relaxed">
                No new sniff-worthy updates in this category right now. Your pack is happily snoozing.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href="/feed"
                  className="px-5 py-2.5 rounded-full bg-[#E8843A] hover:bg-[#974900] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  Explore Pack Feed
                </Link>
                <Link
                  href="/qa"
                  className="px-5 py-2.5 rounded-full bg-[#F5F2ED] hover:bg-[#EDE8E1] text-[#011E14] text-xs font-bold transition-colors"
                >
                  Browse Community Q&A
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group: TODAY */}
              {todayItems.length > 0 && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between px-1 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="uppercase tracking-widest text-[#727974]">Today</span>
                      <span className="w-1 h-1 rounded-full bg-[#C1C8C3]"></span>
                      <span className="text-[#887366] font-normal">Recent sniffs & wags</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {todayItems.map((item, idx) => (
                      <NotificationCardItem
                        key={item.id}
                        item={item}
                        staggerIndex={idx}
                        onDismiss={handleDismiss}
                        isFollowing={Boolean(followingMap[item.actor_pet_id || ''])}
                        onToggleFollow={toggleFollow}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Group: EARLIER */}
              {earlierItems.length > 0 && (
                <section className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-1 text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <span className="uppercase tracking-widest text-[#727974]">Earlier This Week</span>
                      <span className="w-1 h-1 rounded-full bg-[#C1C8C3]"></span>
                      <span className="text-[#887366] font-normal">Pack announcements & events</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {earlierItems.map((item, idx) => (
                      <NotificationCardItem
                        key={item.id}
                        item={item}
                        staggerIndex={todayItems.length + idx}
                        onDismiss={handleDismiss}
                        isFollowing={Boolean(followingMap[item.actor_pet_id || ''])}
                        onToggleFollow={toggleFollow}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </main>

        <RightSidebar />
      </div>
    </div>
  )
}

function NotificationCardItem({
  item,
  staggerIndex,
  onDismiss,
  isFollowing,
  onToggleFollow,
}: {
  item: NotificationItem
  staggerIndex: number
  onDismiss: (id: string) => void
  isFollowing: boolean
  onToggleFollow: (petId: string) => void
}) {
  const isUnread = !item.is_read
  const staggerDelay = `${Math.min(staggerIndex * 40, 320)}ms`

  return (
    <article
      style={{ animationDelay: staggerDelay }}
      className={`group relative p-5 sm:p-6 rounded-[24px] border transition-all duration-300 ${
        isUnread
          ? 'bg-[#FFF9F2] border-[#FDE8D3] shadow-[0_2px_12px_rgba(1,30,20,0.04)]'
          : 'bg-white border-[#EDE8E1] shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Unread Static Orange Dot */}
        <div className="pt-3 hidden sm:block shrink-0">
          {isUnread ? (
            <span className="block w-2.5 h-2.5 rounded-full bg-[#E8843A] shadow-[0_0_8px_rgba(232,132,58,0.7)]" />
          ) : (
            <span className="block w-2.5 h-2.5" />
          )}
        </div>

        {/* Avatar with Icon Overlay */}
        <div className="relative shrink-0">
          {item.pets?.profile_image_url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.pets.profile_image_url}
              alt={item.pets.name}
              className="w-12 h-12 rounded-full object-cover shadow-2xs border border-[#EDE8E1]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#163328] text-white flex items-center justify-center font-bold text-lg">
              {item.type === 'pack_announcement' ? (
                <span className="material-symbols-outlined text-[24px] text-[#AECEBE]">campaign</span>
              ) : (
                <span className="material-symbols-outlined text-[20px]">pets</span>
              )}
            </div>
          )}

          {/* Overlay Icon Badges */}
          {item.type === 'best_answer' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                stars
              </span>
            </div>
          )}
          {item.type === 'treat' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E8843A] text-white flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[14px]">pets</span>
            </div>
          )}
          {item.type === 'comment' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#476457] text-white flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[14px]">question_answer</span>
            </div>
          )}
          {item.type === 'follow' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFDBC7] text-[#974900] flex items-center justify-center shadow-2xs">
              <span className="material-symbols-outlined text-[14px]">person_add</span>
            </div>
          )}
        </div>

        {/* Card Content Container */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
            {item.type === 'best_answer' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span>Best Answer</span>
              </span>
            )}
            {item.type === 'treat' && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#E8843A]/10 text-[#E8843A] font-bold">
                Treats
              </span>
            )}
            {item.type === 'comment' && (
              <span className="px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#727974] font-medium">
                {item.metadata?.role || 'Community Advice'}
              </span>
            )}
            {item.type === 'follow' && (
              <span className="px-2 py-0.5 rounded-full bg-[#F5F2ED] text-[#727974]">New Wag</span>
            )}
            {item.type === 'pack_announcement' && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#163328]/10 text-[#163328] font-bold">
                Pack Alert
              </span>
            )}

            <span className="text-[#727974]">
              • {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="text-[14px] text-[#011E14] leading-snug">
            {item.body}
          </p>

          {/* Subtext / Excerpt Quote Card */}
          {item.metadata?.excerpt && (
            <div className="mt-2.5 p-3 rounded-xl bg-white border border-[#EDE8E1] shadow-2xs flex items-start gap-2 max-w-xl text-xs text-[#727974] leading-relaxed">
              <span className="material-symbols-outlined text-[16px] text-[#476457] shrink-0 mt-0.5">
                format_quote
              </span>
              <p className="line-clamp-2 italic">"{item.metadata.excerpt}"</p>
            </div>
          )}

          {/* Follow Back Button for Follow item */}
          {item.type === 'follow' && item.actor_pet_id && (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-[#727974]">
                {item.metadata?.subtext || 'Shared interest in agility & outdoor play'}
              </span>

              <button
                onClick={() => onToggleFollow(item.actor_pet_id!)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95 ${
                  isFollowing
                    ? 'bg-[#F5F2ED] text-[#727974]'
                    : 'bg-[#E8843A] hover:bg-[#974900] text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] text-[#15803D]">done</span>
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Follow Back</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Card Footer Actions */}
          <div className="mt-3 flex items-center justify-between pt-1 text-xs font-bold">
            {item.entity_type === 'post' && item.entity_id && (
              <Link
                href={`/qa/${item.entity_id}`}
                className="inline-flex items-center gap-1 text-[#E8843A] hover:underline"
              >
                <span>View Discussion Thread</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            )}

            <button
              onClick={() => onDismiss(item.id)}
              className="text-[#727974] hover:text-[#011E14] transition-colors opacity-0 group-hover:opacity-100 ml-auto"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
