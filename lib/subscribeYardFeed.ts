import type { RealtimeChannel } from '@supabase/supabase-js'

import { getSupabaseClient } from '@/lib/supabaseClient'
import type { Post } from '@/components/feed/PostCard'

export type FeedCountPayload = {
  postId?: string
  likeCount?: number
  commentCount?: number
  likedByPetId?: string | null
  unlikedByPetId?: string | null
}

type Listener = {
  onPost?: (post: Post) => void
  onCounts?: (payload: FeedCountPayload) => void
  onPostRow?: (row: { id?: string; like_count?: number; comment_count?: number }) => void
}

const listeners = new Set<Listener>()
let started = false
let channel: RealtimeChannel | null = null

function asPost(payload: unknown): Post | null {
  if (!payload || typeof payload !== 'object') return null
  const row = payload as Post & { post?: Post }
  if (row.id) return row
  if (row.post?.id) return row.post
  return null
}

export function applyFeedCounts<T extends { id: string; like_count?: number; comment_count?: number; hasLiked?: boolean }>(
  posts: T[],
  payload: FeedCountPayload,
  myPetId?: string | null
): T[] {
  if (!payload?.postId) return posts
  return posts.map((post) => {
    if (post.id !== payload.postId) return post
    return {
      ...post,
      like_count: payload.likeCount !== undefined ? payload.likeCount : post.like_count,
      comment_count:
        payload.commentCount !== undefined ? payload.commentCount : post.comment_count,
      hasLiked:
        myPetId && payload.likedByPetId === myPetId
          ? true
          : myPetId && payload.unlikedByPetId === myPetId
            ? false
            : post.hasLiked,
    }
  })
}

export function applyPostRowCounts<T extends { id: string; like_count?: number; comment_count?: number }>(
  posts: T[],
  row: { id?: string; like_count?: number; comment_count?: number }
): T[] {
  if (!row?.id) return posts
  return posts.map((post) =>
    post.id === row.id
      ? {
          ...post,
          like_count: typeof row.like_count === 'number' ? row.like_count : post.like_count,
          comment_count:
            typeof row.comment_count === 'number'
              ? Math.max(post.comment_count || 0, row.comment_count)
              : post.comment_count,
        }
      : post
  )
}

function ensureChannel() {
  if (started || typeof window === 'undefined') return
  started = true

  getSupabaseClient()
    .then((supabase) => {
      if (!supabase) {
        started = false
        return
      }

      const existing = supabase.getChannels().find((item) => item.topic === 'realtime:yard-feed')
      if (existing) {
        channel = existing
        return
      }

      channel = supabase
        .channel('yard-feed', { config: { broadcast: { ack: false, self: true } } })
        .on('broadcast', { event: 'post' }, ({ payload }: { payload: unknown }) => {
          const post = asPost(payload)
          if (post) listeners.forEach((listener) => listener.onPost?.(post))
        })
        .on('broadcast', { event: 'counts' }, ({ payload }: { payload: FeedCountPayload }) => {
          if (payload?.postId) listeners.forEach((listener) => listener.onCounts?.(payload))
        })
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'posts' },
          (payload: { new?: { id?: string; like_count?: number; comment_count?: number } }) => {
            const row = payload.new
            if (row?.id) listeners.forEach((listener) => listener.onPostRow?.(row))
          }
        )

      channel.subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          started = false
          channel = null
        }
      })
    })
    .catch(() => {
      started = false
    })
}

export function subscribeYardFeed(listener: Listener): () => void {
  listeners.add(listener)
  ensureChannel()
  return () => {
    listeners.delete(listener)
  }
}
