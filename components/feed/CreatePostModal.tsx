'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'

import { compressImage } from '@/lib/imageCompressor'
import { getPetSpecies, getPostVerb } from '@/lib/petVerbMap'

interface Community {
  id: string
  name: string
}

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (newPost: any) => void
  communities?: Community[]
  defaultCommunityId?: string
}

type PostType = 'regular' | 'question' | 'advice' | 'meme'

export function CreatePostModal({
  isOpen,
  onClose,
  onSuccess,
  communities = [],
  defaultCommunityId = '',
}: CreatePostModalProps) {
  const { activePet, user } = useAuthStore()
  const postVerb = getPostVerb(getPetSpecies(activePet))
  const [caption, setCaption] = useState('')
  const [postType, setPostType] = useState<PostType>('regular')
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(defaultCommunityId || '')
  const [mediaFiles, setMediaFiles] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Keep selectedCommunityId in sync whenever modal opens or defaultCommunityId changes
  useEffect(() => {
    if (isOpen) {
      setSelectedCommunityId(defaultCommunityId || '')
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
        console.error('[CreatePost] Image compression error:', err)
      }
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!activePet?.id) return
    setIsSubmitting(true)

    try {
      const data = await apiFetch('/posts/create', {
        method: 'POST',
        json: {
          petId: activePet.id,
          communityId: selectedCommunityId || null,
          caption,
          postType,
          mediaData: mediaFiles,
        },
      })

      if (data && data.post) {
        onSuccess(data.post)
        setCaption('')
        setMediaFiles([])
        onClose()
      }
    } catch (err) {
      console.error('[CreatePost] Error submitting post:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUsername = activePet?.username ? `@${activePet.username}` : user?.email?.split('@')[0] || '@user'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c2329]/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-[560px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#ede8e1]"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {/* Header */}
        <header className="px-6 py-4 border-b border-[#ede8e1] flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Create a Post
            </h2>
            <p className="text-[12px] text-[#554338]">
              Posting as <span className="font-semibold text-[#E8843A]">{handleUsername}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f2ede6] transition-colors text-[#554338]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* Community Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">POST TO</label>
            <select
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#fef9f3] border border-[#dbc1b3] rounded-xl text-[14px] text-[#163328] focus:outline-none focus:ring-2 focus:ring-[#E8843A]/40"
            >
              <option value="">Public Yard (All Followers)</option>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Post Type Pills */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">POST TYPE</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'regular', label: 'Photo Moment', icon: 'photo_camera' },
                { id: 'question', label: 'Question / Advice', icon: 'quiz' },
                { id: 'advice', label: 'Tip', icon: 'lightbulb' },
                { id: 'meme', label: 'Meme', icon: 'mood' },
              ].map((type) => {
                const isSelected = postType === type.id
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPostType(type.id as PostType)}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'border border-[#E8843A] bg-[#E8843A]/10 text-[#974900] font-bold'
                        : 'border border-[#dbc1b3] bg-white text-[#554338] hover:border-[#E8843A]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{type.icon}</span>
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Caption Textarea */}
          <div className="space-y-1.5 relative">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, 500))}
              rows={4}
              placeholder={`What's ${activePet?.name || 'your pet'} up to today?`}
              className="w-full p-4 border border-[#dbc1b3] rounded-xl text-[14px] text-[#163328] focus:outline-none focus:ring-2 focus:ring-[#E8843A]/40 resize-none"
              style={{ background: '#fef9f3' }}
            />
            <div className="absolute bottom-3 right-4 text-[11px] text-[#887366]">
              {caption.length}/500
            </div>
          </div>

          {/* Media Previews */}
          {mediaFiles.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mediaFiles.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#dbc1b3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
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

          {/* Media Upload Dropzone */}
          {mediaFiles.length < 5 && (
            <label className="border-2 border-dashed border-[#dbc1b3] rounded-xl p-5 flex flex-col items-center justify-center bg-[#fef9f3]/50 hover:bg-[#fef9f3] transition-colors cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[#E8843A]">add_photo_alternate</span>
              </div>
              <p className="text-[13px] text-[#554338]">
                Drop your photos here or <span className="text-[#E8843A] font-bold">browse</span>
              </p>
              <p className="text-[11px] text-[#887366] mt-0.5">Up to 5 images</p>
            </label>
          )}
        </div>

        {/* Footer */}
        <footer className="p-4 border-t border-[#ede8e1] bg-white">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (!caption.trim() && mediaFiles.length === 0)}
            className={`w-full py-3 rounded-full font-bold text-[15px] transition-all flex items-center justify-center gap-2 ${
              isSubmitting || (!caption.trim() && mediaFiles.length === 0)
                ? 'bg-[#ece7e2] text-[#887366] cursor-not-allowed'
                : 'bg-[#E8843A] text-white hover:bg-[#974900] shadow-md shadow-[#E8843A]/20'
            }`}
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            {isSubmitting ? (
              <span>Posting {postVerb}...</span>
            ) : (
              <>
                Post {postVerb}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}
