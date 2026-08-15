'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'
import { getCommentVerb, getCommentVerbPlural } from '@/lib/petVerbMap'

export interface Post {
  id: string
  caption: string
  post_type: 'regular' | 'question' | 'advice' | 'meme'
  location_city?: string
  like_count: number
  comment_count: number
  hasLiked?: boolean
  created_at: string
  pets?: {
    id: string
    name: string
    username: string
    breed: string
    species?: string
    pet_type?: string
    city: string
    profile_image_url: string
  }
  communities?: {
    id: string
    name: string
    slug: string
  }
  media?: {
    id: string
    media_url: string
    display_order: number
  }[]
}

interface CommentItem {
  id: string
  content: string
  created_at: string
  pets?: {
    id: string
    name: string
    username: string
    profile_image_url: string
  }
}

interface PostCardProps {
  post: Post
  onReport: (postId: string) => void
}

export function PostCard({ post, onReport }: PostCardProps) {
  const { activePet } = useAuthStore()

  const petSpecies = post.pets?.species || post.pets?.pet_type || 'dog'
  const verbSingular = getCommentVerb(petSpecies)
  const verbPlural = getCommentVerbPlural(petSpecies, post.comment_count || 0)

  // Optimistic like state
  const [hasLiked, setHasLiked] = useState(!!post.hasLiked)
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [showMenu, setShowMenu] = useState(false)

  // Comments state
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentCount, setCommentCount] = useState(post.comment_count || 0)
  const [commentInput, setCommentInput] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)

  const handleToggleLike = async () => {
    if (!activePet?.id) return
    const prevLiked = hasLiked
    const prevCount = likeCount

    setHasLiked(!prevLiked)
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1)

    try {
      const data = await apiFetch(`/posts/${post.id}/like`, {
        method: 'POST',
        json: { petId: activePet.id },
      })
      if (data) {
        setHasLiked(data.hasLiked)
        setLikeCount(data.likeCount)
      }
    } catch (err) {
      console.error('[PostCard] Error toggling like:', err)
      setHasLiked(prevLiked)
      setLikeCount(prevCount)
    }
  }

  const handleToggleComments = async () => {
    const nextState = !showComments
    setShowComments(nextState)

    if (nextState && comments.length === 0) {
      setLoadingComments(true)
      try {
        const data = await apiFetch(`/posts/${post.id}/comments`)
        if (data && data.comments) {
          setComments(data.comments)
        }
      } catch (err) {
        console.error('[PostCard] Error fetching comments:', err)
      } finally {
        setLoadingComments(false)
      }
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim() || !activePet?.id || submittingComment) return

    setSubmittingComment(true)
    const content = commentInput

    try {
      const data = await apiFetch(`/posts/${post.id}/comments`, {
        method: 'POST',
        json: {
          petId: activePet.id,
          content,
        },
      })

      if (data && data.comment) {
        setComments((prev) => [...prev, data.comment])
        setCommentCount((prev) => prev + 1)
        setCommentInput('')
      }
    } catch (err) {
      console.error('[PostCard] Error posting comment:', err)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)
    setShowMenu(false)
  }

  const authorName = post.pets?.name || 'Pet'
  const authorHandle = post.pets?.username ? `@${post.pets.username}` : ''
  const authorAvatar = post.pets?.profile_image_url || ''
  const communityName = post.communities?.name

  const formatTime = (iso: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
      if (diff < 60) return 'Just now'
      if (diff < 3600) return `${Math.floor(diff / 60)}m`
      if (diff < 86400) return `${Math.floor(diff / 3600)}h`
      return `${Math.floor(diff / 86400)}d`
    } catch {
      return ''
    }
  }

  return (
    <article
      className="bg-white rounded-2xl border border-[#EDE8E1] shadow-sm overflow-hidden transition-all hover:-translate-y-0.5 duration-200"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          {authorAvatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={authorAvatar} alt={authorName} className="w-10 h-10 rounded-full object-cover border border-[#ede8e1]" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#ede8e1] shrink-0">
              <span className="material-symbols-outlined text-[#E8843A] text-[18px]">pets</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-[16px] text-[#163328] leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {authorName}
              </h4>
              <span className="material-symbols-outlined text-[#E8843A] text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              {communityName && (
                <span className="text-[12px] text-[#887366] font-medium ml-1">
                  in <strong className="text-[#2d4a3e]">{communityName}</strong>
                </span>
              )}
            </div>
            <p className="text-[12px] text-[#887366]">
              {authorHandle} • {formatTime(post.created_at)}
            </p>
          </div>
        </div>

        {/* 3-dots Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-[#887366] hover:bg-[#f6f9ff] p-1.5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-[#ede8e1] py-1.5 z-20 text-[13px]">
              <button
                onClick={handleCopyLink}
                className="w-full text-left px-4 py-2 hover:bg-[#f6f9ff] flex items-center gap-2 text-[#554338]"
              >
                <span className="material-symbols-outlined text-[16px]">link</span>
                Copy Link
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  onReport(post.id)
                }}
                className="w-full text-left px-4 py-2 hover:bg-[#fef2f2] flex items-center gap-2 text-[#ba1a1a]"
              >
                <span className="material-symbols-outlined text-[16px]">flag</span>
                Report Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Medical / Advice Disclaimer Banner for Question or Advice post types */}
      {(post.post_type === 'question' || post.post_type === 'advice') && (
        <div className="mx-4 mb-3 px-3.5 py-2.5 rounded-xl bg-[#fff7ed] border border-[#ffedd5] flex items-center gap-2 text-[12px] text-[#9a3412]">
          <span className="material-symbols-outlined text-[18px] text-[#E8843A]">medical_services</span>
          <span><strong>Community Advice:</strong> Not a substitute for professional veterinary guidance.</span>
        </div>
      )}

      {/* Media Carousel */}
      {post.media && post.media.length > 0 && (
        <div className="aspect-[4/3] bg-[#f8f3ed] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.media[0].media_url}
            alt="Post Attachment"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Action Bar */}
      <div className="px-4 py-3 flex items-center gap-6 border-t border-[#ede8e1]/40">
        <button
          onClick={handleToggleLike}
          className={`flex items-center gap-1.5 font-bold text-[13px] transition-all group ${
            hasLiked ? 'text-[#E8843A]' : 'text-[#163328] hover:text-[#E8843A]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px] group-hover:scale-125 transition-transform"
            style={{ fontVariationSettings: hasLiked ? "'FILL' 1" : "'FILL' 0" }}
          >
            pets
          </span>
          <span>{likeCount} Treats</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1.5 font-bold text-[13px] text-[#163328] hover:text-[#E8843A] transition-colors group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-125 transition-transform">
            chat_bubble
          </span>
          <span>{commentCount} {verbPlural}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-1.5 font-bold text-[13px] text-[#163328] hover:text-[#E8843A] transition-colors group ml-auto"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-125 transition-transform">
            share
          </span>
          <span>Share</span>
        </button>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-3">
          <p className="text-[14px] text-[#163328] leading-relaxed">
            {post.caption}
          </p>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 pt-2 border-t border-[#ede8e1] bg-[#FFFBF7]/60 space-y-3">
          {/* Add Comment Input */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            {activePet?.profile_image_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activePet.profile_image_url}
                alt="Me"
                className="w-8 h-8 rounded-full object-cover border border-[#ede8e1]"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#ede8e1] shrink-0">
                <span className="material-symbols-outlined text-[#E8843A] text-[16px]">pets</span>
              </div>
            )}
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={`Add a ${verbSingular.toLowerCase()} as @${activePet?.username || activePet?.name || 'your pet'}...`}
              className="flex-1 bg-[#fef9f3] border border-[#dbc1b3] rounded-full px-4 py-1.5 text-[13px] text-[#163328] focus:outline-none focus:ring-1 focus:ring-[#E8843A]"
            />
            <button
              type="submit"
              disabled={!commentInput.trim() || submittingComment}
              className="px-4 py-1.5 bg-[#2d4a3e] text-white rounded-full text-[12px] font-bold disabled:opacity-50"
            >
              {verbSingular}
            </button>
          </form>

          {/* Comments List */}
          {loadingComments ? (
            <p className="text-[12px] text-[#887366] text-center py-2">Loading {verbPlural.toLowerCase()}...</p>
          ) : comments.length === 0 ? (
            <p className="text-[12px] text-[#887366] text-center py-2">No {verbPlural.toLowerCase()} yet. Be the first to reply!</p>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5 text-[13px]">
                  {c.pets?.profile_image_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={c.pets.profile_image_url}
                      alt={c.pets?.name || 'Pet'}
                      className="w-7 h-7 rounded-full object-cover border border-[#ede8e1] shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#ede8e1] shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[#E8843A] text-[14px]">pets</span>
                    </div>
                  )}
                  <div className="bg-[#fef9f3] p-2.5 rounded-xl flex-1 border border-[#ede8e1]">
                    <p className="font-bold text-[#163328] text-[12px]">{c.pets?.name || 'Pet'}</p>
                    <p className="text-[#554338] mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}
