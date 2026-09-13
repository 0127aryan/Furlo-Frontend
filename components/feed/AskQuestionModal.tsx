'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'
import { compressImage } from '@/lib/imageCompressor'
import { toast } from '@/lib/toast'

interface Community {
  id: string
  name: string
}

interface AskQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newPost: any) => void
  communities?: Community[]
  defaultCommunityId?: string
}

const TOPIC_TAGS = [
  'Diet & Nutrition',
  'Training',
  'Health & Wellness',
  'Behavior',
  'General Care',
]

export function AskQuestionModal({
  isOpen,
  onClose,
  onSuccess,
  communities = [],
  defaultCommunityId = '',
}: AskQuestionModalProps) {
  const { activePet, user } = useAuthStore()

  const [questionTitle, setQuestionTitle] = useState('')
  const [contextDetails, setContextDetails] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('Diet & Nutrition')
  const [customTopic, setCustomTopic] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(defaultCommunityId || '')
  const [mediaFiles, setMediaFiles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSelectedCommunityId(defaultCommunityId || '')
      setQuestionTitle('')
      setContextDetails('')
      setSelectedTopic('Diet & Nutrition')
      setMediaFiles([])
    }
  }, [isOpen, defaultCommunityId])

  if (!isOpen) return null

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      if (mediaFiles.length >= 5) break
      try {
        const compressedBase64 = await compressImage(files[i], 1200, 0.8)
        setMediaFiles((prev) => [...prev, compressedBase64].slice(0, 5))
      } catch (err) {
        console.error('[AskQuestionModal] Image compression error:', err)
      }
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!questionTitle.trim()) {
      toast.error('Please enter a question title')
      return
    }
    if (!activePet?.id) {
      toast.error('Please log in with a pet profile to post a question 🐾')
      return
    }

    setIsSubmitting(true)
    const finalCaption = contextDetails.trim()
      ? `${questionTitle.trim()}\n\n${contextDetails.trim()}`
      : questionTitle.trim()

    const finalTopic = showCustomInput && customTopic.trim() ? customTopic.trim() : selectedTopic

    try {
      const data = await apiFetch<{ post: any }>('/posts/create', {
        method: 'POST',
        json: {
          petId: activePet.id,
          communityId: selectedCommunityId || null,
          caption: finalCaption,
          postType: 'question',
          topicCategory: finalTopic,
          mediaData: mediaFiles,
        },
      })

      if (data && data.post) {
        toast.success('Your question has been published to the community! 🚀')
        onSuccess(data.post)
        onClose()
      }
    } catch (err: any) {
      console.error('[AskQuestionModal] Error publishing question:', err)
      toast.error(err?.message || 'Failed to publish question')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white w-full max-w-[580px] rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-[#EDE8E1]"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {/* Header */}
        <header className="px-7 py-5 border-b border-[#EDE8E1] flex items-center justify-between">
          <h2 className="text-[20px] font-extrabold text-[#011E14] flex items-center gap-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span>Ask the Furlo Community</span>
            <span className="text-[#E8843A]">🐾</span>
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F8F3ED] transition-colors text-[#727974]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* Form Body */}
        <div className="p-7 flex-1 overflow-y-auto space-y-5 text-left">
          {/* Field 1: ASKING FOR PET PROFILE */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">
              ASKING FOR PET PROFILE
            </label>
            <div className="w-full px-4 py-3 bg-[#FEF9F3] border border-[#EDE8E1] rounded-2xl flex items-center justify-between text-[14px] text-[#011E14] font-medium">
              <div className="flex items-center gap-2.5">
                {activePet?.profile_image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activePet.profile_image_url}
                    alt={activePet.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#EDE8E1]"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#E8843A]/10 flex items-center justify-center text-[#E8843A]">
                    <span className="material-symbols-outlined text-[16px]">pets</span>
                  </div>
                )}
                <span>
                  <strong className="font-bold">{activePet?.name || 'My Pet'}</strong>
                  {activePet?.breed ? ` (${activePet.breed})` : ''}
                </span>
              </div>
              <span className="material-symbols-outlined text-[#887366] text-[18px]">keyboard_arrow_down</span>
            </div>
          </div>

          {/* Field 2: QUESTION TITLE * */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">
              QUESTION TITLE *
            </label>
            <input
              type="text"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
              placeholder="e.g. Is it normal for a 6-month-old Golden Retriever to stop eating dry kibble?"
              className="w-full px-4 py-3 bg-white border border-[#974900]/40 focus:border-[#E8843A] rounded-2xl text-[14px] text-[#011E14] focus:outline-none focus:ring-2 focus:ring-[#E8843A]/20 transition-all font-medium"
            />
          </div>

          {/* Field 3: CONTEXT & DETAILS */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">
              CONTEXT & DETAILS
            </label>
            <textarea
              value={contextDetails}
              onChange={(e) => setContextDetails(e.target.value)}
              rows={3}
              placeholder="He was eager for his kibble two days ago, but now refuses dry food. Still energetic and takes wet treats happily."
              className="w-full p-4 bg-white border border-[#EDE8E1] focus:border-[#E8843A] rounded-2xl text-[14px] text-[#011E14] focus:outline-none focus:ring-2 focus:ring-[#E8843A]/20 transition-all resize-none font-medium"
            />
          </div>

          {/* Field 4: TOPIC TAG * */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">
              TOPIC TAG *
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_TAGS.map((tag) => {
                const isSelected = selectedTopic === tag && !showCustomInput
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(tag)
                      setShowCustomInput(false)
                    }}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#163328] text-white font-bold shadow-xs'
                        : 'bg-white border border-[#EDE8E1] text-[#424844] hover:bg-[#F8F3ED]'
                    }`}
                  >
                    <span>{tag}</span>
                    {isSelected && <span className="text-[12px]">✓</span>}
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={`px-4 py-2 rounded-full text-[13px] font-medium border transition-all ${
                  showCustomInput
                    ? 'border-[#E8843A] bg-[#FFDBC7] text-[#974900] font-bold'
                    : 'border-dashed border-[#887366] text-[#887366] hover:border-[#E8843A]'
                }`}
              >
                + Add Topic
              </button>
            </div>

            {showCustomInput && (
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Enter custom topic name..."
                className="mt-2 w-full px-4 py-2.5 bg-[#FEF9F3] border border-[#E8843A] rounded-xl text-[13px] text-[#011E14] focus:outline-none"
              />
            )}
          </div>

          {/* Field 5: ATTACHED PHOTOS OR VIDEO */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">
              ATTACHED PHOTOS OR VIDEO
            </label>

            {mediaFiles.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {mediaFiles.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#EDE8E1]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Attachment ${idx}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-[#163328]/80 text-white rounded-full flex items-center justify-center text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {mediaFiles.length < 5 && (
              <label className="border-2 border-dashed border-[#EDE8E1] rounded-2xl p-6 flex flex-col items-center justify-center bg-[#FEF9F3]/60 hover:bg-[#FEF9F3] transition-colors cursor-pointer group text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-xs border border-[#EDE8E1] text-[#E8843A] group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                </div>
                <p className="text-[13px] text-[#424844] font-medium">
                  Drop photos here or <span className="text-[#E8843A] font-bold underline">tap to upload</span>
                </p>
                <p className="text-[11px] text-[#887366] mt-0.5">Supports JPEG, PNG up to 10MB</p>
              </label>
            )}
          </div>

          {/* Field 6: PACK VISIBILITY (OPTIONAL) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">
              PACK VISIBILITY (OPTIONAL)
            </label>
            <select
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#EDE8E1] rounded-2xl text-[14px] text-[#011E14] focus:outline-none focus:ring-2 focus:ring-[#E8843A]/30 font-medium"
            >
              <option value="">Public Yard (Visible to all pet parents)</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Submit Button */}
        <footer className="p-6 border-t border-[#EDE8E1] bg-white">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !questionTitle.trim()}
            className={`w-full py-3.5 rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2 ${
              isSubmitting || !questionTitle.trim()
                ? 'bg-[#EDE8E1] text-[#727974] cursor-not-allowed'
                : 'bg-[#E8843A] hover:bg-[#974900] text-white shadow-md shadow-[#E8843A]/20 active:scale-95'
            }`}
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {isSubmitting ? (
              <span>Publishing Question...</span>
            ) : (
              <>
                <span>Publish Question</span>
                <span className="text-[18px]">🚀</span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}
