'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

const petParentTags = [
  'Active', 'Playful', 'Friendly', 'Lazy', 'Foodie',
  'Adventurous', 'Cuddly', 'Stubborn', 'Gentle', 'Loud',
  'Shy', 'Protective', 'Sassy', 'Calm', 'Social',
]

const petLoverTags = [
  'Pet Advocate', 'Adoption Advocate', 'Dog Lover', 'Cat Lover',
  'Volunteer', 'Foster Parent', 'Dog Walker', 'Rescuer',
  'Photographer', 'Trainer',
]

export default function JoinBioPage() {
  const router = useRouter()
  const { onboardingData, setOnboardingData } = useAuthStore()
  const role = onboardingData?.role || 'parent'

  const [bio, setBio] = useState(onboardingData?.bio || '')
  const [selectedTags, setSelectedTags] = useState<string[]>(onboardingData?.personalityTags || [])
  const [customTags, setCustomTags] = useState<string[]>(onboardingData?.customPersonalityTags || [])
  const [customTagInput, setCustomTagInput] = useState('')
  const [showOtherInput, setShowOtherInput] = useState((onboardingData?.customPersonalityTags || []).length > 0)
  const [progressWidth, setProgressWidth] = useState('50%')

  useEffect(() => {
    const t = setTimeout(() => setProgressWidth('75%'), 200)
    return () => clearTimeout(t)
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const addCustomTag = () => {
    const trimmed = customTagInput.trim()
    if (!trimmed) return
    if (customTags.map((t) => t.toLowerCase()).includes(trimmed.toLowerCase())) {
      setCustomTagInput('')
      return
    }
    const updatedCustom = [...customTags, trimmed]
    setCustomTags(updatedCustom)
    if (!selectedTags.includes(trimmed)) {
      setSelectedTags((prev) => [...prev, trimmed])
    }
    setCustomTagInput('')
  }

  const removeCustomTag = (tagToRemove: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tagToRemove))
    setSelectedTags((prev) => prev.filter((t) => t !== tagToRemove))
  }

  const handleContinue = () => {
    setOnboardingData({
      bio,
      personalityTags: selectedTags,
      customPersonalityTags: customTags,
    })
    router.push('/join/packs')
  }

  const handleSkip = () => {
    router.push('/join/packs')
  }

  const tags = role === 'parent' ? petParentTags : petLoverTags
  const charCount = bio.length
  const charMax = 300

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ background: '#ffb688', filter: 'blur(140px)', opacity: 0.15 }}
        />
        <div
          className="absolute bottom-0 left-0 w-80 h-80 rounded-full"
          style={{ background: '#c9ead9', filter: 'blur(130px)', opacity: 0.2 }}
        />
      </div>

      {/* Top Nav */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 h-14"
        style={{ background: 'rgba(254,249,243,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(219,193,179,0.2)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/join/profile"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:opacity-70 active:scale-95"
            style={{ color: '#974900' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', fontVariationSettings: "'wght' 500" }}>
              arrow_back
            </span>
          </Link>
          <span className="font-bold text-[18px]" style={{ fontFamily: 'Outfit, sans-serif', color: '#974900' }}>
            Furlo
          </span>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#887366' }}>
          Step 3 of 4
        </span>
        <button
          onClick={handleSkip}
          className="text-[13px] font-medium hover:underline"
          style={{ color: '#974900' }}
        >
          Skip
        </button>
      </header>

      {/* Progress bar */}
      <div className="fixed top-14 left-0 right-0 z-40 h-[3px]" style={{ background: '#ece7e2' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: progressWidth, background: 'linear-gradient(90deg, #974900, #E8843A)' }}
        />
      </div>

      {/* Main */}
      <main
        className="flex-1 flex items-start justify-center pt-24 pb-12 px-4"
        style={{ animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="w-full max-w-[520px]">
          {/* Card */}
          <div
            className="rounded-2xl p-6 md:p-8 flex flex-col gap-6"
            style={{
              background: '#fef9f3',
              border: '1px solid #dbc1b3',
              boxShadow: '0 4px 24px rgba(28,35,41,0.05)',
            }}
          >
            {/* Progress Header */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: '#554338' }}
                >
                  Step 3 of 4
                </span>
                <span className="text-[12px] font-semibold" style={{ color: '#476558' }}>75%</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: '#ece7e2' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: '75%', background: '#E8843A' }}
                />
              </div>
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1">
              <h1
                className="font-bold text-[24px] leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif', color: '#2D4A3E' }}
              >
                {role === 'parent' ? "What's their vibe?" : 'What makes you tick?'}
              </h1>
              <p className="text-[14px]" style={{ color: '#554338' }}>
                {role === 'parent'
                  ? "Give the pack a feel for your pet's personality."
                  : 'Help others find you in the pack.'}
              </p>
            </div>

            {/* Bio */}
            <div className="relative">
              <textarea
                id="bio-input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={charMax}
                placeholder={
                  role === 'parent'
                    ? "Tell the Pack about your pet's favorite snacks, funny quirks, or how they spend their Sundays..."
                    : 'Tell the pack what you love about animals, your experience, or your rescue story...'
                }
                className="w-full h-[120px] p-4 rounded-xl border outline-none resize-none text-[15px] transition-all"
                style={{
                  background: '#fef9f3',
                  borderColor: '#dbc1b3',
                  color: '#1d1b18',
                  lineHeight: '1.6',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#974900'
                  e.target.style.boxShadow = '0 0 0 1px #974900'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#dbc1b3'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <div
                className="absolute bottom-3 right-3 text-[11px] px-1 rounded"
                style={{
                  color: charCount >= charMax ? '#ba1a1a' : 'rgba(136,115,102,0.6)',
                  background: 'rgba(254,249,243,0.85)',
                }}
              >
                {charCount}/{charMax}
              </div>
            </div>

            {/* Personality Tags */}
            <div className="flex flex-col gap-3">
              <div>
                <label
                  className="text-[11px] font-bold uppercase tracking-widest block mb-0.5"
                  style={{ color: '#476558' }}
                >
                  {role === 'parent' ? 'Personality Tags' : 'Interests'}
                </label>
                <p className="text-[12px]" style={{ color: 'rgba(85,67,56,0.7)' }}>
                  Pick a few that fit.
                </p>
              </div>

              {/* Tag cloud */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const isActive = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="px-4 py-2 rounded-full border text-[13px] font-medium transition-all duration-150 active:scale-95"
                      style={{
                        background: isActive ? 'rgba(232,132,58,0.1)' : 'transparent',
                        borderColor: isActive ? '#E8843A' : '#dbc1b3',
                        borderWidth: isActive ? '1.5px' : '1px',
                        color: isActive ? '#974900' : '#554338',
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      {tag}
                    </button>
                  )
                })}

                {/* + Other button */}
                <button
                  type="button"
                  onClick={() => setShowOtherInput((prev) => !prev)}
                  className="px-4 py-2 rounded-full border text-[13px] font-medium transition-all duration-150 active:scale-95 flex items-center gap-1"
                  style={{
                    background: showOtherInput || customTags.length > 0 ? 'rgba(232,132,58,0.1)' : 'transparent',
                    borderColor: showOtherInput || customTags.length > 0 ? '#E8843A' : '#dbc1b3',
                    borderWidth: showOtherInput || customTags.length > 0 ? '1.5px' : '1px',
                    color: showOtherInput || customTags.length > 0 ? '#974900' : '#554338',
                    fontWeight: showOtherInput || customTags.length > 0 ? 600 : 400,
                  }}
                >
                  <span>+ Other</span>
                </button>
              </div>

              {/* Custom Tag Input Area */}
              {(showOtherInput || customTags.length > 0) && (
                <div className="mt-2 p-3.5 rounded-xl border flex flex-col gap-2.5" style={{ background: '#fffbf7', borderColor: '#E8843A' }}>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#974900]">
                    Add Custom {role === 'parent' ? 'Personality Tags' : 'Interests'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type custom tag (e.g. Goofy, Barker)..."
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomTag()
                        }
                      }}
                      className="flex-1 px-3.5 py-2 rounded-lg border text-[13px] outline-none transition-all"
                      style={{ background: '#fff', borderColor: '#dbc1b3', color: '#1d1b18' }}
                    />
                    <button
                      type="button"
                      onClick={addCustomTag}
                      className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all active:scale-95"
                      style={{ background: '#974900' }}
                    >
                      Add
                    </button>
                  </div>

                  {/* List of Added Custom Tags */}
                  {customTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {customTags.map((ctag) => (
                        <span
                          key={ctag}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold"
                          style={{ background: 'rgba(232,132,58,0.2)', color: '#974900', border: '1px solid #E8843A' }}
                        >
                          <span>{ctag}</span>
                          <button
                            type="button"
                            onClick={() => removeCustomTag(ctag)}
                            className="hover:opacity-75 flex items-center justify-center ml-0.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-[#887366]">
                    Custom tags will be added to your profile & submitted for admin catalog approval.
                  </span>
                </div>
              )}

              {selectedTags.length > 0 && (
                <p className="text-[12px] font-medium" style={{ color: '#476558' }}>
                  {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Footer actions */}
            <div
              className="pt-4 mt-2 flex flex-col gap-3 border-t"
              style={{ borderColor: 'rgba(219,193,179,0.3)' }}
            >
              <button
                id="btn-bio-continue"
                onClick={handleContinue}
                className="w-full py-4 rounded-full flex items-center justify-center gap-2 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: '#E8843A',
                  color: '#fff',
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '16px',
                  boxShadow: '0 4px 20px rgba(232,132,58,0.25)',
                }}
              >
                Continue
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
              </button>
              <button
                onClick={handleSkip}
                className="w-full py-2 text-[13px] font-medium hover:underline transition-all"
                style={{ color: '#476558' }}
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
