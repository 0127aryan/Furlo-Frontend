'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { PostCard } from '@/components/feed/PostCard'
import { AskQuestionModal } from '@/components/feed/AskQuestionModal'
import { ReportPostModal } from '@/components/feed/ReportPostModal'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { applyFeedCounts, applyPostRowCounts, subscribeYardFeed } from '@/lib/subscribeYardFeed'

interface QuestionPost {
  id: string
  caption: string
  post_type: 'question' | 'regular' | 'advice' | 'meme'
  topic_category?: string
  is_solved?: boolean
  accepted_answer_id?: string
  accepted_answer?: {
    id: string
    content: string
    created_at: string
    pets?: {
      name: string
      username: string
      profile_image_url: string
    }
  }
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
    city: string
    profile_image_url: string
  }
  media?: { id: string; media_url: string; display_order: number }[]
}

interface TrendingItem {
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

const CATEGORY_PILLS = [
  { id: 'All Questions', label: 'All Questions', icon: '' },
  { id: 'Diet & Nutrition', label: 'Diet & Nutrition', icon: '🐾' },
  { id: 'Puppy Training', label: 'Puppy Training', icon: '🎓' },
  { id: 'Health & Wellness', label: 'Health & Wellness', icon: '🩺' },
  { id: 'Behavior & Play', label: 'Behavior & Play', icon: '🎾' },
  { id: 'Cat Care', label: 'Cat Care', icon: '🐱' },
  { id: 'Unanswered', label: 'Unanswered', icon: '' },
]

export default function QAHubPage() {
  const router = useRouter()
  const { activePet } = useAuthStore()
  const petIdRef = useRef(activePet?.id)
  petIdRef.current = activePet?.id

  const [questions, setQuestions] = useState<QuestionPost[]>([])
  const [trending, setTrending] = useState<TrendingItem[]>([])
  const [helpers, setHelpers] = useState<HelperPet[]>([])
  const [activeCategory, setActiveCategory] = useState('All Questions')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [reportingPostId, setReportingPostId] = useState<string | null>(null)

  const fetchQAData = useCallback(async () => {
    setLoading(true)
    try {
      const petQuery = activePet?.id ? `&petId=${activePet.id}` : ''
      const isUnanswered = activeCategory === 'Unanswered'
      const catParam = activeCategory !== 'Unanswered' && activeCategory !== 'All Questions' ? `&category=${encodeURIComponent(activeCategory)}` : ''
      const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''
      const unansweredParam = isUnanswered ? '&unanswered=true' : ''

      const data = await apiFetch<{ questions: QuestionPost[] }>(
        `/posts/qa/questions?v=1${catParam}${searchParam}${unansweredParam}${petQuery}`
      )

      if (data && data.questions) {
        setQuestions(data.questions)
      }
    } catch (err) {
      console.error('[QAHub] Error fetching Q&A questions:', err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, searchQuery, activePet?.id])

  const fetchSidebars = useCallback(async () => {
    try {
      const [trendData, helperData] = await Promise.all([
        apiFetch<{ trending: TrendingItem[] }>('/posts/qa/trending'),
        apiFetch<{ helpers: HelperPet[] }>('/posts/qa/top-helpers'),
      ])
      if (trendData?.trending) setTrending(trendData.trending)
      if (helperData?.helpers) setHelpers(helperData.helpers)
    } catch (err) {
      console.error('[QAHub] Error fetching sidebars:', err)
    }
  }, [])

  useEffect(() => {
    fetchQAData()
  }, [fetchQAData])

  useEffect(() => {
    fetchSidebars()
  }, [fetchSidebars])

  useEffect(() => {
    return subscribeYardFeed({
      onCounts: (payload) => {
        setQuestions((prev) => applyFeedCounts(prev, payload, petIdRef.current))
      },
      onPostRow: (row) => {
        setQuestions((prev) => applyPostRowCounts(prev, row))
      },
    })
  }, [])

  return (
    <div className="min-h-screen flex" style={{ background: '#FEF9F3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <AppSidebar />

      <main className="flex-1 max-w-[840px] px-4 md:px-8 py-6 mx-auto w-full flex flex-col gap-5">
        {/* Top Title & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[26px] sm:text-[32px] font-extrabold text-[#011E14] tracking-tight flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              <span>Pet Q&A & Advice Hub</span>
              <span className="text-[24px]">🐾</span>
            </h1>
            <p className="text-[#727974] text-[14px] mt-0.5 font-medium">
              Ask questions, get advice from experienced pet parents & experts
            </p>
          </div>

          <button
            onClick={() => setIsComposerOpen(true)}
            className="bg-[#E8843A] hover:bg-[#974900] text-white px-5 py-2.5 rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 shrink-0 self-start sm:self-auto"
          >
            <span className="text-[18px]">❓</span>
            <span>Ask a Question</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#727974]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions about diet, health, training, breeds..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-[#EDE8E1] rounded-full text-[#011E14] text-[14px] placeholder-[#727974] focus:outline-none focus:ring-2 focus:ring-[#E8843A]/30 transition-shadow shadow-2xs"
          />
        </div>

        {/* Filter Pill Row (Horizontal Scrollable) */}
        <div className="relative overflow-hidden py-1">
          <div className="overflow-x-auto flex items-center gap-2 pb-2 no-scrollbar scroll-smooth">
            {CATEGORY_PILLS.map((pill) => {
              const isActive = activeCategory === pill.id
              return (
                <button
                  key={pill.id}
                  onClick={() => setActiveCategory(pill.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold transition-all shadow-2xs flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#163328] text-white'
                      : 'bg-white border border-[#EDE8E1] text-[#424844] hover:bg-[#F8F3ED]'
                  }`}
                >
                  {pill.icon && <span>{pill.icon}</span>}
                  <span>{pill.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Feed Cards Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#727974]">
            <span className="material-symbols-outlined text-[36px] text-[#E8843A] animate-spin">
              progress_activity
            </span>
            <p className="text-[14px]">Fetching pet questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#EDE8E1] text-[#727974] my-4 space-y-3">
            <span className="material-symbols-outlined text-[48px] text-[#E8843A]">help</span>
            <h3 className="text-[18px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              No questions found in this category
            </h3>
            <p className="text-[13px]">Be the first pet parent to ask a question!</p>
            <button
              onClick={() => setIsComposerOpen(true)}
              className="mt-2 px-6 py-2.5 bg-[#163328] hover:bg-[#011E14] text-white rounded-full font-bold text-[14px] transition-all shadow-xs"
            >
              Ask a Question 🐾
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {questions.map((post) => (
              <div key={post.id} onClick={() => router.push(`/qa/${post.id}`)} className="cursor-pointer">
                <PostCard
                  post={post}
                  isOwner={Boolean(activePet?.id && post.pets?.id && activePet.id === post.pets.id)}
                  onReport={(postId) => setReportingPostId(postId)}
                  onDelete={(deletedId) => setQuestions((prev) => prev.filter((p) => p.id !== deletedId))}
                  onPatch={(postId, patch) => {
                    setQuestions((prev) =>
                      prev.map((item) => (item.id === postId ? { ...item, ...patch } : item))
                    )
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Right Sidebar Widgets */}
      <RightSidebar />

      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSuccess={() => fetchQAData()}
      />

      <ReportPostModal
        postId={reportingPostId}
        isOpen={!!reportingPostId}
        onClose={() => setReportingPostId(null)}
      />
    </div>
  )
}
