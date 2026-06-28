'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

const personalityTagsList = [
  'Playful', 'Energetic', 'Friendly', 'Calm', 'Cuddly', 
  'Adventurous', 'Quiet', 'Shy', 'Protective', 'Sassy'
]

const loverTagsList = [
  'Pet Advocate', 'Adoption Advocate', 'Dog Lover', 'Cat Lover', 
  'Volunteer', 'Foster Parent', 'Dog Walker', 'Rescuer'
]

export default function JoinProfilePage() {
  const router = useRouter()
  const { onboardingData, setOnboardingData } = useAuthStore()

  // Onboarding details
  const [petName, setPetName] = useState('')
  const [petUsername, setPetUsername] = useState('')
  const [breed, setBreed] = useState('')
  const [city, setCity] = useState('Bangalore')
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>('unknown')
  const [bio, setBio] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Lover details
  const [loverName, setLoverName] = useState('')
  const [loverUsername, setLoverUsername] = useState('')

  // Flow control
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  // Default fallback if someone lands here directly
  const role = onboardingData?.role || 'parent'

  // Sync if onboarding data somehow exists already
  useEffect(() => {
    if (onboardingData) {
      if (onboardingData.petName) setPetName(onboardingData.petName)
      if (onboardingData.petUsername) setPetUsername(onboardingData.petUsername)
      if (onboardingData.breed) setBreed(onboardingData.breed)
      if (onboardingData.city) setCity(onboardingData.city)
      if (onboardingData.gender) setGender(onboardingData.gender)
      if (onboardingData.bio) setBio(onboardingData.bio)
      if (onboardingData.personalityTags) setSelectedTags(onboardingData.personalityTags)
    }
  }, [onboardingData])

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Save all collected data to Zustand onboardingData
    const finalData = role === 'parent' 
      ? {
          petName,
          petUsername,
          breed,
          city,
          gender,
          bio,
          personalityTags: selectedTags,
        }
      : {
          petName: loverName, // Mirror display name as petName for simple compatibility
          petUsername: loverUsername,
          city,
          bio,
          personalityTags: selectedTags,
        }

    setOnboardingData(finalData)
    
    // Simulate minor delay
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    
    // Open verification prompt modal (Step 3)
    setShowModal(true)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Step header */}
      <header
        className="w-full flex items-center h-[52px] px-4 md:px-6 sticky top-0 z-50"
        style={{ background: 'rgba(254,249,243,0.85)', backdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-[480px] w-full mx-auto flex items-center justify-between">
          <Link
            href="/join/select"
            className="flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#974900' }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'wght' 600", fontSize: '20px' }}
            >
              chevron_left
            </span>
          </Link>
          <span className="text-[12px] font-bold uppercase tracking-widest text-[#887366]">
            Step 2 of 3
          </span>
          <div className="w-8" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-[#ece7e2]">
        <div className="h-full bg-[#E8843A] transition-all duration-500" style={{ width: '66.6%' }} />
      </div>

      {/* Main */}
      <main className="flex-grow flex items-start justify-center px-4 pt-8 pb-16">
        <div className="max-w-[480px] w-full flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1
              className="text-[28px] font-bold text-[#1d1b18]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {role === 'parent' ? "Create your pet's profile" : 'Tell us about yourself'}
            </h1>
            <p className="text-[16px] text-[#554338]">
              {role === 'parent' ? 'Let the neighborhood know your companion.' : 'Build your personal explorer profile.'}
            </p>
          </div>

          <form onSubmit={handleComplete} className="flex flex-col gap-5">
            {role === 'parent' ? (
              <>
                {/* Pet Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Pet Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Buddy"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full h-12 px-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3]"
                    style={{ background: '#fff' }}
                  />
                </div>

                {/* Pet Username */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Pet Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#887366] text-[15px] font-medium">@</span>
                    <input
                      type="text"
                      required
                      placeholder="buddy_the_golden"
                      value={petUsername}
                      onChange={(e) => setPetUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full h-12 pl-8 pr-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3]"
                      style={{ background: '#fff' }}
                    />
                  </div>
                </div>

                {/* Breed */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Breed</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Golden Retriever, Mixed Breed"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full h-12 px-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3]"
                    style={{ background: '#fff' }}
                  />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Gender</label>
                  <div className="flex gap-2">
                    {['male', 'female', 'unknown'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g as any)}
                        className="flex-1 h-11 rounded-lg border font-medium text-[14px] transition-all capitalize"
                        style={{
                          background: gender === g ? '#ffdbc7' : '#fff',
                          borderColor: gender === g ? '#974900' : '#dbc1b3',
                          color: gender === g ? '#974900' : '#554338',
                        }}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Lover Name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Display Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Smith"
                    value={loverName}
                    onChange={(e) => setLoverName(e.target.value)}
                    className="w-full h-12 px-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3]"
                    style={{ background: '#fff' }}
                  />
                </div>

                {/* Lover Username */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-medium text-[#476558] ml-1">Username</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#887366] text-[15px] font-medium">@</span>
                    <input
                      type="text"
                      required
                      placeholder="alex_loves_dogs"
                      value={loverUsername}
                      onChange={(e) => setLoverUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full h-12 pl-8 pr-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3]"
                      style={{ background: '#fff' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* City */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#476558] ml-1">City</label>
              <input
                type="text"
                required
                placeholder="Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 px-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3]"
                style={{ background: '#fff' }}
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-[#476558] ml-1">Bio</label>
              <textarea
                placeholder={role === 'parent' ? "Buddy loves playing fetch and sniffing flowers..." : "A massive animal lover looking to connect with packs..."}
                maxLength={300}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full h-24 p-4 border border-[#dbc1b3] rounded-lg text-[16px] text-[#1d1b18] outline-none transition-all placeholder:text-[#dbc1b3] resize-none"
                style={{ background: '#fff' }}
              />
              <span className="text-[11px] text-[#887366] text-right mt-0.5">{bio.length}/300</span>
            </div>

            {/* Tags Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-medium text-[#476558] ml-1">
                {role === 'parent' ? 'Personality Tags' : 'Interests'}
              </label>
              <div className="flex flex-wrap gap-2">
                {(role === 'parent' ? personalityTagsList : loverTagsList).map((tag) => {
                  const active = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="px-4 py-2 rounded-full border text-[13px] font-medium transition-all"
                      style={{
                        background: active ? '#E8843A' : '#fff',
                        borderColor: active ? '#E8843A' : '#dbc1b3',
                        color: active ? '#fff' : '#554338',
                      }}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Complete button */}
            <button
              id="btn-profile-complete"
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-[52px] rounded-full flex items-center justify-center gap-2 text-[18px] font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#E8843A', fontFamily: 'Outfit, sans-serif' }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  Creating profile…
                </>
              ) : (
                'Create Profile'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* ─── Verification Overlay Modal (Step 3) ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1c2329]/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div
            className="w-full max-w-[420px] rounded-[24px] border border-[#dbc1b3] p-6 md:p-8 flex flex-col items-center gap-6 relative"
            style={{
              background: '#fef9f3',
              boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
              animation: 'modalSlideIn 0.3s ease-out',
            }}
          >
            <div className="rounded-full p-4" style={{ background: '#c9ead9' }}>
              <span className="material-symbols-outlined text-[48px]" style={{ color: '#2D4A3E', fontVariationSettings: "'FILL' 1" }}>
                mail
              </span>
            </div>

            <div className="text-center">
              <h2 className="text-[22px] font-bold text-[#1d1b18] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Confirm your email 🐾
              </h2>
              <p className="text-[14px] text-[#554338] leading-relaxed">
                We sent a validation link to <span className="font-semibold text-[#974900]">{onboardingData?.email}</span>.
                Once confirmed, your profile will be active!
              </p>
            </div>

            <div className="w-full flex flex-col gap-4 mt-2">
              <Link
                href="/join"
                onClick={() => {
                  setShowModal(false)
                  // Clear temp onboarding credentials on reset
                  useAuthStore.getState().setOnboardingData(null)
                }}
                className="w-full h-12 rounded-full border border-[#dbc1b3] flex items-center justify-center text-[14px] font-semibold text-[#554338] hover:bg-[#f8f3ed] transition-all"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal animation helper style */}
      <style>{`
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
