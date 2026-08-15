'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

interface ReportPostModalProps {
  postId: string | null
  isOpen: boolean
  onClose: () => void
}

const reportReasons = [
  { id: 'abuse', label: '🚨 Animal abuse or neglect' },
  { id: 'medical', label: '🩺 Medical misinformation' },
  { id: 'harassment', label: '🚫 Harassment or bullying' },
  { id: 'spam', label: '📢 Spam or scam' },
  { id: 'inappropriate', label: '⚠️ Inappropriate content' },
  { id: 'other', label: '💬 Something else' },
]

export function ReportPostModal({ postId, isOpen, onClose }: ReportPostModalProps) {
  const { activePet } = useAuthStore()
  const [selectedReason, setSelectedReason] = useState('abuse')
  const [details, setDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  if (!isOpen || !postId) return null

  const handleSubmit = async () => {
    if (!activePet?.id) return
    setIsSubmitting(true)

    try {
      await apiFetch(`/posts/${postId}/report`, {
        method: 'POST',
        json: {
          reporterPetId: activePet.id,
          reason: selectedReason,
          details,
        },
      })
      setIsSubmitted(true)
      setTimeout(() => {
        setIsSubmitted(false)
        onClose()
      }, 1500)
    } catch (err) {
      console.error('[ReportPost] Error reporting post:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c2329]/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-[440px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#ede8e1]"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#ede8e1] flex items-start justify-between">
          <div>
            <h2 className="text-[20px] font-bold text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Report this Post
            </h2>
            <p className="text-[12px] text-[#554338] mt-1">
              Help us keep the Furlo community safe and cozy for everyone.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f2ede6] transition-colors text-[#554338]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-[#e8f5ee] rounded-full flex items-center justify-center mx-auto text-[#166534]">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
            <h3 className="font-bold text-[18px] text-[#163328]" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Report Submitted
            </h3>
            <p className="text-[13px] text-[#554338]">Thank you. Our moderation team will review this shortly.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#887366]">
              Why are you reporting this?
            </p>
            <div className="space-y-2">
              {reportReasons.map((r) => {
                const isChecked = selectedReason === r.id
                return (
                  <label
                    key={r.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[#E8843A]/10 border-[#E8843A]'
                        : 'border-[#ede8e1] hover:bg-[#fef9f3]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={isChecked}
                      onChange={() => setSelectedReason(r.id)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        isChecked ? 'border-[#E8843A] bg-[#E8843A]' : 'border-[#dbc1b3]'
                      }`}
                    >
                      {isChecked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <span className="text-[14px] text-[#163328] font-medium">{r.label}</span>
                  </label>
                )
              })}
            </div>

            {/* Additional Details */}
            <div className="pt-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#887366] block mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Provide more context..."
                className="w-full p-3 bg-[#fef9f3] border border-[#dbc1b3] rounded-xl text-[13px] text-[#163328] focus:outline-none focus:ring-2 focus:ring-[#E8843A]/40 resize-none"
              />
            </div>
          </div>
        )}

        {/* Footer */}
        {!isSubmitted && (
          <div className="p-4 border-t border-[#ede8e1] flex items-center justify-end gap-3 bg-white">
            <button
              onClick={onClose}
              className="px-5 py-2 text-[14px] font-bold text-[#554338] hover:bg-[#f2ede6] rounded-full transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#C0392B] text-white text-[14px] font-bold rounded-full shadow-sm hover:brightness-110 active:scale-95 transition-all"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
