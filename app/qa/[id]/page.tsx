'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { QuestionDetailSkeleton } from '@/components/skeletons'
import { AppSidebar } from '@/components/feed/AppSidebar'
import { RightSidebar } from '@/components/feed/RightSidebar'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { applyFeedCounts, applyPostRowCounts, subscribeYardFeed } from '@/lib/subscribeYardFeed'
import { toast } from '@/lib/toast'

interface PetAuthor {
  id: string
  name: string
  username: string
  breed?: string
  city?: string
  profile_image_url: string
}

interface CommentItem {
  id: string
  content: string
  created_at: string
  is_accepted_answer?: boolean
  like_count?: number
  pets?: PetAuthor
}

interface QuestionDetail {
  id: string
  caption: string
  post_type: 'question' | 'regular' | 'advice' | 'meme'
  topic_category?: string
  is_solved?: boolean
  accepted_answer_id?: string
  accepted_answer?: CommentItem
  location_city?: string
  like_count: number
  comment_count: number
  hasLiked?: boolean
  created_at: string
  pets?: PetAuthor
  media?: { id: string; media_url: string; display_order: number }[]
}

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = (params?.id as string) || ''
  const { activePet } = useAuthStore()

  const [question, setQuestion] = useState<QuestionDetail | null>(null)
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [answerInput, setAnswerInput] = useState('')
  const [submittingAnswer, setSubmittingAnswer] = useState(false)
  const [togglingSolved, setTogglingSolved] = useState(false)
  const [sortBy, setSortBy] = useState<'upvoted' | 'newest' | 'oldest'>('upvoted')

  const petIdRef = useRef(activePet?.id)
  petIdRef.current = activePet?.id

  const fetchQuestionDetails = useCallback(async () => {
    if (!questionId) return
    setLoading(true)
    setError(null)
    try {
      const petQuery = activePet?.id ? `?petId=${activePet.id}` : ''
      const [postRes, commentRes] = await Promise.all([
        apiFetch<{ post: QuestionDetail }>(`/posts/single/${questionId}${petQuery}`),
        apiFetch<{ comments: CommentItem[] }>(`/posts/${questionId}/comments`),
      ])

      if (postRes && postRes.post) {
        setQuestion(postRes.post)
      } else {
        setError('Question not found')
      }

      if (commentRes && commentRes.comments) {
        setComments(commentRes.comments)
      }
    } catch (err: any) {
      console.error('[QuestionDetail] Fetch error:', err)
      setError(err?.message || 'Failed to load question')
    } finally {
      setLoading(false)
    }
  }, [questionId, activePet?.id])

  useEffect(() => {
    fetchQuestionDetails()
  }, [fetchQuestionDetails])

  useEffect(() => {
    if (!questionId) return
    return subscribeYardFeed({
      onCounts: (payload) => {
        if (payload.postId !== questionId) return
        setQuestion((prev) => {
          if (!prev) return prev
          return applyFeedCounts([prev], payload, petIdRef.current)[0]
        })
      },
      onPostRow: (row) => {
        if (row.id !== questionId) return
        setQuestion((prev) => {
          if (!prev) return prev
          return applyPostRowCounts([prev], row)[0]
        })
      },
    })
  }, [questionId])

  const handleToggleLike = async () => {
    if (!activePet?.id || !question) {
      toast.error('Please log in with a pet profile to give treats 🐾')
      return
    }
    const prevLiked = !!question.hasLiked
    const prevCount = question.like_count || 0
    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            hasLiked: !prevLiked,
            like_count: prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1,
          }
        : prev
    )
    try {
      const data = await apiFetch<{ hasLiked: boolean; likeCount: number }>(
        `/posts/${question.id}/like`,
        { method: 'POST', json: { petId: activePet.id } }
      )
      setQuestion((prev) =>
        prev ? { ...prev, hasLiked: data.hasLiked, like_count: data.likeCount } : prev
      )
    } catch (err: any) {
      setQuestion((prev) =>
        prev ? { ...prev, hasLiked: prevLiked, like_count: prevCount } : prev
      )
      toast.error(err?.message || 'Failed to update treat')
    }
  }

  const handlePostAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!answerInput.trim() || submittingAnswer) return
    if (!activePet?.id) {
      toast.error('Please log in with a pet profile to post an answer 🐾')
      return
    }

    setSubmittingAnswer(true)
    try {
      const res = await apiFetch<{ comment: CommentItem; commentCount: number }>(
        `/posts/${questionId}/comments`,
        {
          method: 'POST',
          json: {
            petId: activePet.id,
            content: answerInput.trim(),
          },
        }
      )

      if (res && res.comment) {
        setComments((prev) => [...prev, res.comment])
        setQuestion((prev) =>
          prev ? { ...prev, comment_count: res.commentCount || prev.comment_count + 1 } : prev
        )
        setAnswerInput('')
        toast.success('Your answer has been published! 🐾')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to post answer')
    } finally {
      setSubmittingAnswer(false)
    }
  }

  const handleUnacceptAnswer = async () => {
    if (!activePet?.id || !question) return
    if (!window.confirm('Remove the accepted best answer from this question?')) return
    try {
      const res = await apiFetch<{ success: boolean }>(`/posts/${question.id}/unaccept-answer`, {
        method: 'POST',
        json: {
          petId: activePet.id,
        },
      })

      if (res && res.success) {
        toast.success('Removed Best Answer status 🐾')
        fetchQuestionDetails()
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove best answer')
    }
  }

  const handleMarkSolved = async () => {
    if (!activePet?.id || !question) return
    if (
      !window.confirm(
        'Mark this question as solved? This is independent of the best answer.'
      )
    ) {
      return
    }

    setTogglingSolved(true)
    try {
      const res = await apiFetch<{ success: boolean }>(`/posts/${question.id}/mark-solved`, {
        method: 'POST',
        json: { petId: activePet.id },
      })

      if (res && res.success) {
        toast.success('Question marked as solved ✓')
        fetchQuestionDetails()
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark as solved')
    } finally {
      setTogglingSolved(false)
    }
  }

  const handleMarkUnsolved = async () => {
    if (!activePet?.id || !question) return
    if (
      !window.confirm(
        'Reopen this question as unsolved? The best answer will be kept.'
      )
    ) {
      return
    }

    setTogglingSolved(true)
    try {
      const res = await apiFetch<{ success: boolean }>(`/posts/${question.id}/mark-unsolved`, {
        method: 'POST',
        json: { petId: activePet.id },
      })

      if (res && res.success) {
        toast.success('Question marked as unsolved — reopened 🐾')
        fetchQuestionDetails()
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark as unsolved')
    } finally {
      setTogglingSolved(false)
    }
  }

  const handleAcceptAnswer = async (commentId: string) => {
    if (!activePet?.id || !question) return
    const message = question.accepted_answer_id
      ? 'Replace the current best answer with this one?'
      : 'Mark this answer as the accepted best answer?'
    if (!window.confirm(message)) return

    try {
      const res = await apiFetch<{ success: boolean }>(`/posts/${question.id}/accept-answer`, {
        method: 'POST',
        json: {
          commentId,
          petId: activePet.id,
        },
      })

      if (res && res.success) {
        toast.success('Marked as Accepted Best Answer! ⭐')
        fetchQuestionDetails()
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to accept answer')
    }
  }

  const isQuestionOwner = Boolean(
    activePet?.id && question?.pets?.id && activePet.id === question.pets.id
  )

  const sortedComments = [...comments].sort((a, b) => {
    if (a.id === question?.accepted_answer_id) return -1
    if (b.id === question?.accepted_answer_id) return 1
    if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    return (b.like_count || 0) - (a.like_count || 0)
  })

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF7F2', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <div className="flex-1 flex justify-center">
        <AppSidebar />

        <main className="flex-1 max-w-[880px] px-4 pt-6 pb-32 space-y-6 mx-auto">
          {/* Main Top Navigation Row */}
          <div className="flex items-center justify-between text-xs font-bold text-[#727974]">
            <Link href="/qa" className="flex items-center gap-1.5 hover:text-[#011E14] transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Back to Q&A Hub</span>
            </Link>

            {question?.topic_category && (
              <div className="flex items-center gap-2">
                <span className="text-[#887366] font-normal">Topic:</span>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white border border-[#E7E2D9] rounded-full text-xs font-bold text-[#163328]">
                  <span>🐾</span>
                  <span>{question.topic_category}</span>
                </div>
              </div>
            )}
          </div>
          {loading ? (
            <QuestionDetailSkeleton />
          ) : error || !question ? (
            <div className="bg-white rounded-3xl p-10 border border-[#EDE8E1] text-center flex flex-col items-center gap-4 shadow-sm my-8">
              <span className="material-symbols-outlined text-[48px] text-[#974900]">help</span>
              <h3 className="font-bold text-[20px] text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {error || 'Question not found'}
              </h3>
              <Link
                href="/qa"
                className="bg-[#E8843A] text-white text-[14px] font-bold px-6 py-2.5 rounded-full hover:bg-[#974900] transition-colors shadow-sm"
              >
                Back to Q&A Hub
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Question Card */}
              <article className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ECE6DE] shadow-xs">
                {/* Author Info & Solved Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {question.pets?.profile_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={question.pets.profile_image_url}
                        alt={question.pets.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#EDE8E1]"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] text-[#E8843A]">
                        <span className="material-symbols-outlined text-[20px]">pets</span>
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-[15px] text-[#011E14]">{question.pets?.name || 'Pet Parent'}</span>
                        <span className="text-xs text-[#727974]">(@{question.pets?.username || 'user'})</span>
                      </div>
                      <p className="text-xs text-[#727974] mt-0.5">
                        Asked {new Date(question.created_at).toLocaleDateString()} • {question.location_city || 'Bangalore'}
                      </p>
                    </div>
                  </div>

                  {question.is_solved ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E4F5EB] border border-[#BBF7D0] text-[#166534] text-xs font-bold rounded-full">
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      <span>Solved</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFDBC7] text-[#974900] text-xs font-bold rounded-full">
                      <span>Question</span>
                      <span className="font-bold">?</span>
                    </span>
                  )}
                </div>

                {/* Question Body */}
                <h1 className="text-[20px] sm:text-[22px] font-bold text-[#011E14] leading-snug tracking-tight mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {question.caption}
                </h1>

                {/* Question Images Grid */}
                {question.media && question.media.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 mb-4">
                    {question.media.map((img) => (
                      <div key={img.id} className="relative overflow-hidden rounded-2xl border border-[#EDE7DF] bg-[#F5F2ED] h-[240px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.media_url} alt="Question attachment" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Stats */}
                <div className="mt-6 pt-4 border-t border-[#EDE8E1] flex items-center justify-between text-xs font-bold text-[#727974]">
                  <div className="flex items-center gap-5">
                    <button
                      type="button"
                      onClick={handleToggleLike}
                      className={`inline-flex items-center gap-1.5 transition-colors ${
                        question.hasLiked ? 'text-[#E8843A]' : 'text-[#011E14] hover:text-[#E8843A]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: question.hasLiked ? "'FILL' 1" : "'FILL' 0" }}>
                        pets
                      </span>
                      <span>{question.like_count || 0} Treats</span>
                    </button>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                      <span>{comments.length} Answers</span>
                    </span>
                  </div>
                </div>

                {/* Owner: Mark Solved / Unsolved */}
                {isQuestionOwner && (
                  <div className="mt-4 pt-4 border-t border-[#EDE8E1]">
                    {question.is_solved ? (
                      <button
                        type="button"
                        onClick={handleMarkUnsolved}
                        disabled={togglingSolved}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFDBC7] hover:bg-[#F5C4A8] border border-[#F5C4A8] text-[#974900] font-bold text-[13px] rounded-full transition-colors disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-[18px]">help</span>
                        <span>{togglingSolved ? 'Updating...' : 'Mark as Unsolved'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleMarkSolved}
                        disabled={togglingSolved}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E4F5EB] hover:bg-[#D4EDDF] border border-[#BBF7D0] text-[#166534] font-bold text-[13px] rounded-full transition-colors disabled:opacity-60"
                      >
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        <span>{togglingSolved ? 'Updating...' : 'Mark as Solved'}</span>
                      </button>
                    )}
                  </div>
                )}
              </article>

              {/* Accepted Best Answer Card */}
              {question.accepted_answer && (
                <section className="rounded-3xl border-[1.5px] border-[#84CC16] bg-[#F7FDF4] p-6 sm:p-7 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E3F2D4]">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#DCFCE7] text-[#15803D] font-bold text-xs rounded-full">
                        <span>★</span> Accepted Best Answer
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#15803D] bg-[#E8F8DE] px-3 py-1 rounded-full">
                        ⭐ Marked by Question Author
                      </span>
                      {isQuestionOwner && (
                        <button
                          onClick={handleUnacceptAnswer}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] font-bold text-xs rounded-full transition-colors shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">cancel</span>
                          <span>Remove Best Answer</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {question.accepted_answer.pets?.profile_image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={question.accepted_answer.pets.profile_image_url}
                        alt={question.accepted_answer.pets.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#D2E7BE]"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border border-[#D2E7BE] text-[#15803D]">
                        <span className="material-symbols-outlined text-[20px]">pets</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] text-[#1E293B]">
                          {question.accepted_answer.pets?.name || 'Helpful Pet Parent'}
                        </span>
                        <span className="bg-[#0F172A] text-white text-[10px] tracking-wide font-bold px-1.5 py-0.5 rounded">
                          BEST ANSWER
                        </span>
                      </div>
                      <p className="text-xs text-[#5D6F59] mt-0.5">
                        @{question.accepted_answer.pets?.username || 'user'} • {new Date(question.accepted_answer.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-[14px] text-[#334155] leading-relaxed italic font-medium">
                    "{question.accepted_answer.content}"
                  </p>
                </section>
              )}

              {/* Other Answers List */}
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#EDE8E1]">
                  <h2 className="text-[17px] font-bold text-[#011E14]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {comments.length} {comments.length === 1 ? 'Answer' : 'Answers'}
                  </h2>

                  <div className="flex items-center gap-3 text-xs font-bold">
                    <button
                      onClick={() => setSortBy('upvoted')}
                      className={`pb-1 ${sortBy === 'upvoted' ? 'text-[#011E14] border-b-2 border-[#011E14]' : 'text-[#727974]'}`}
                    >
                      Most Upvoted
                    </button>
                    <button
                      onClick={() => setSortBy('newest')}
                      className={`pb-1 ${sortBy === 'newest' ? 'text-[#011E14] border-b-2 border-[#011E14]' : 'text-[#727974]'}`}
                    >
                      Newest
                    </button>
                  </div>
                </div>

                {sortedComments.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 text-center border border-[#EDE8E1] text-[#727974]">
                    No answers written yet. Be the first pet to help out! 🐾
                  </div>
                ) : (
                  sortedComments.map((c) => {
                    const isAccepted = c.id === question.accepted_answer_id
                    return (
                      <div
                        key={c.id}
                        className={`bg-white rounded-3xl p-6 border ${
                          isAccepted ? 'border-[#84CC16] bg-[#F7FDF4]' : 'border-[#EDE8E1]'
                        } shadow-2xs space-y-3`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {c.pets?.profile_image_url ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={c.pets.profile_image_url}
                                alt={c.pets.name}
                                className="w-10 h-10 rounded-full object-cover border border-[#EDE8E1]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] text-[#E8843A]">
                                <span className="material-symbols-outlined text-[18px]">pets</span>
                              </div>
                            )}
                            <div>
                              <span className="font-bold text-[14px] text-[#011E14]">{c.pets?.name || 'Pet Parent'}</span>
                              <p className="text-xs text-[#727974] mt-0.5">
                                @{c.pets?.username || 'user'} • {new Date(c.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {isQuestionOwner && !isAccepted && (
                            <button
                              onClick={() => handleAcceptAnswer(c.id)}
                              className="px-3 py-1 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-full transition-all shadow-2xs"
                            >
                              {question.accepted_answer_id ? 'Change to Best Answer' : '✓ Accept as Best Answer'}
                            </button>
                          )}
                        </div>

                        <p className="text-[14px] text-[#424844] leading-relaxed">{c.content}</p>
                      </div>
                    )
                  })
                )}
              </section>
            </div>
          )}
        </main>

        <RightSidebar />
      </div>

      {/* Sticky Bottom Answer Composer Bar */}
      {question && (
        <aside className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EDE8E1] py-3 shadow-lg">
          <div className="max-w-[880px] mx-auto px-4">
            <form onSubmit={handlePostAnswer} className="flex items-center gap-3">
              {activePet?.profile_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activePet.profile_image_url}
                  alt={activePet.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#EDE8E1] shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#f8f3ed] flex items-center justify-center border border-[#EDE8E1] text-[#E8843A] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">pets</span>
                </div>
              )}

              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder={`Write your answer or advice for ${question.pets?.name || 'this question'}...`}
                className="flex-1 h-11 pl-4 pr-11 bg-[#F9F7F4] hover:bg-[#F5F2ED] focus:bg-white border border-[#EDE8E1] focus:border-[#E8843A] rounded-full text-[13px] text-[#011E14] placeholder-[#727974] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8843A]/20"
              />

              <button
                type="submit"
                disabled={submittingAnswer || !answerInput.trim()}
                className={`h-11 px-6 bg-[#E8843A] hover:bg-[#974900] text-white font-bold text-[13px] rounded-full shrink-0 transition-colors shadow-xs ${
                  submittingAnswer || !answerInput.trim() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {submittingAnswer ? 'Posting...' : 'Post Answer 🐾'}
              </button>
            </form>
          </div>
        </aside>
      )}
    </div>
  )
}
