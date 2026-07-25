'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch } from '@/lib/api'

interface Pack {
  id: string
  name: string
  icon: string
  members: string
  badge: string
  category: string
  joined?: boolean
}

export default function JoinPacksPage() {
  const router = useRouter()
  const { onboardingData, setOnboardingData } = useAuthStore()

  const [suggestedPacks, setSuggestedPacks] = useState<Pack[]>([])
  const [joinedPacks, setJoinedPacks] = useState<Set<string>>(new Set())
  const [loadingPacks, setLoadingPacks] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [progressWidth, setProgressWidth] = useState('75%')

  useEffect(() => {
    const t = setTimeout(() => setProgressWidth('100%'), 200)
    return () => clearTimeout(t)
  }, [])

  // Format member counts
  const formatMembers = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
    }
    return count.toString()
  }

  // Fetch communities from database
  useEffect(() => {
    const loadPacks = async () => {
      try {
        const data = await apiFetch('/auth/communities')
        const formatted: Pack[] = data.map((c: any) => {
          // Assign dynamic icons based on name/slug
          let icon = 'diversity_1'
          const slugLower = c.slug.toLowerCase()
          if (slugLower.includes('dog') || slugLower.includes('retriever') || slugLower.includes('beagle') || slugLower.includes('puppy') || slugLower.includes('husky')) {
            icon = 'pets'
          } else if (slugLower.includes('cat') || slugLower.includes('kitten') || slugLower.includes('feline')) {
            icon = 'cruelty_free'
          }

          // Assign dynamic badge
          let badge = 'Popular'
          if (c.slug === 'indiranagar-dogs') badge = 'Active nearby'
          else if (c.slug === 'blr-cats') badge = 'Trending 🔥'
          else if (c.slug === 'mumbai-retrievers') badge = "You'd love this"
          else if (c.slug === 'adoption-advocates') badge = 'Welfare'

          return {
            id: c.slug, // Use slug as the ID for compatibility
            name: c.name,
            icon,
            members: formatMembers(c.member_count || 0),
            badge,
            category: slugLower.includes('cat') ? 'cat' : 'dog',
          }
        })
        setSuggestedPacks(formatted)
      } catch (err) {
        console.error('Failed to load communities:', err)
      } finally {
        setLoadingPacks(false)
      }
    }
    loadPacks()
  }, [])

  const toggleJoin = (packId: string) => {
    setJoinedPacks((prev) => {
      const next = new Set(prev)
      if (next.has(packId)) {
        next.delete(packId)
      } else {
        next.add(packId)
      }
      return next
    })
  }

  const handleComplete = async () => {
    setCompleting(true)

    try {
      // Submit the full onboarding data to backend
      const data = onboardingData
      if (!data?.email || !data?.password) {
        // If no credentials, just redirect
        router.push('/')
        return
      }

      // Register + create pet in one flow
      const res = await apiFetch('/auth/complete-onboarding', {
        method: 'POST',
        json: {
          petName: data.petName,
          petUsername: data.petUsername,
          breed: data.breed,
          city: data.city,
          gender: data.gender,
          bio: data.bio,
          personalityTags: data.personalityTags,
          customPersonalityTags: data.customPersonalityTags,
          avatarData: data.avatarData,
          packs: Array.from(joinedPacks),
        },
      })

      // Update auth store with user & active pet if returned
      const meData = await apiFetch('/auth/me')
      if (meData && meData.user) {
        useAuthStore.getState().setUser(meData.user)
        useAuthStore.getState().setActivePet(meData.activePet)
      }

      // Show success overlay
      setShowSuccess(true)
      await new Promise((r) => setTimeout(r, 2200))
      router.push('/')
    } catch (err: any) {
      console.error('Onboarding complete error:', err)
      // Fallback: show success and redirect anyway (email confirmation flow)
      setShowSuccess(true)
      await new Promise((r) => setTimeout(r, 2200))
      router.push('/')
    }
  }

  const handleSkip = () => {
    router.push('/')
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#fef9f3', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full"
          style={{ background: '#ffb688', filter: 'blur(150px)', opacity: 0.12 }}
        />
        <div
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full"
          style={{ background: '#c9ead9', filter: 'blur(140px)', opacity: 0.18 }}
        />
      </div>

      {/* Top Nav */}
      <header
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-6 h-14"
        style={{ background: 'rgba(254,249,243,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(219,193,179,0.2)' }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/join/bio"
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
          Step 4 of 4
        </span>
        <span className="text-[12px] font-bold" style={{ color: '#476558' }}>
          Finalizing…
        </span>
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
        className="flex-1 pt-24 pb-16 px-4 flex justify-center items-start min-h-screen"
        style={{ animation: 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="w-full max-w-[560px]">
          {/* Card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#fef9f3',
              border: '1px solid #dbc1b3',
              boxShadow: '0 4px 24px rgba(28,35,41,0.04)',
            }}
          >
            {/* Step Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#554338' }}>
                  Step 4 of 4
                </span>
                <span className="text-[12px] font-bold" style={{ color: '#476558' }}>Finalizing...</span>
              </div>
              {/* 100% Progress Bar */}
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: '#ece7e2' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: '100%', background: '#974900' }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <div className="mb-6">
                <h1
                  className="font-bold leading-tight mb-1"
                  style={{ fontFamily: 'Outfit, sans-serif', fontSize: '24px', color: '#2D4A3E' }}
                >
                  Find your pack
                </h1>
                <p className="text-[14px]" style={{ color: '#554338' }}>
                  Join local communities and meet pets near you.
                </p>
              </div>

              {/* Pack list */}
              <div className="flex flex-col gap-3">
                {loadingPacks ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2">
                    <span className="material-symbols-outlined animate-spin text-primary" style={{ fontSize: '32px' }}>
                      progress_activity
                    </span>
                    <p className="text-[14px]" style={{ color: '#887366' }}>Fetching active communities...</p>
                  </div>
                ) : suggestedPacks.length === 0 ? (
                  <p className="text-center py-8 text-[14px]" style={{ color: '#887366' }}>No active communities found.</p>
                ) : (
                  suggestedPacks.map((pack) => {
                    const isJoined = joinedPacks.has(pack.id)
                    return (
                      <div
                        key={pack.id}
                      className="flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: isJoined ? '#e8f5ee' : '#fffbf7',
                        border: isJoined ? '1px solid #c9ead9' : '1px solid #dbc1b3',
                      }}
                      onMouseEnter={(e) => {
                        if (!isJoined) {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: isJoined ? '#c9ead9' : '#ffdbc7' }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{
                              fontSize: '20px',
                              color: isJoined ? '#476558' : '#974900',
                              fontVariationSettings: "'FILL' 1",
                            }}
                          >
                            {pack.icon}
                          </span>
                        </div>
                        <div>
                          <h4
                            className="font-semibold text-[14px]"
                            style={{ color: isJoined ? '#476558' : '#1d1b18' }}
                          >
                            {pack.name}
                          </h4>
                          <p className="text-[12px]" style={{ color: isJoined ? '#4d6b5d' : '#887366' }}>
                            {pack.members} Pack Members · {pack.badge}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleJoin(pack.id)}
                        className="px-5 py-2 rounded-full text-[13px] font-medium transition-all active:scale-95 flex items-center gap-1"
                        style={{
                          background: isJoined ? 'transparent' : 'transparent',
                          border: isJoined ? 'none' : '1px solid #974900',
                          color: isJoined ? '#476558' : '#974900',
                        }}
                        onMouseEnter={(e) => {
                          if (!isJoined) (e.currentTarget as HTMLElement).style.background = '#ffdbc7'
                        }}
                        onMouseLeave={(e) => {
                          if (!isJoined) (e.currentTarget as HTMLElement).style.background = 'transparent'
                        }}
                      >
                        {isJoined ? (
                          <>
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>
                              check
                            </span>
                            Joined
                          </>
                        ) : (
                          'Join'
                        )}
                      </button>
                    </div>
                  )
                })
              )}
            </div>

              {/* Footer actions */}
              <div className="mt-8 pt-6 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(219,193,179,0.4)' }}>
                <button
                  id="btn-complete-setup"
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full py-4 rounded-full flex items-center justify-center gap-3 font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: '#974900',
                    color: '#fff',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '17px',
                    boxShadow: '0 4px 24px rgba(151,73,0,0.25)',
                    opacity: completing ? 0.7 : 1,
                  }}
                >
                  {completing ? (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>
                        progress_activity
                      </span>
                      Setting up your pack…
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full py-2 text-[13px] font-medium hover:underline transition-all"
                  style={{ color: '#887366' }}
                >
                  Maybe later, show me The Yard
                </button>
              </div>
            </div>
          </div>

          {/* Legal note */}
          <p
            className="text-center mt-6 text-[12px] leading-relaxed px-8"
            style={{ color: '#887366' }}
          >
            By completing your setup, you agree to our Pack Guidelines and Privacy Policy. Your Paw Print will be visible to members of the packs you join.
          </p>
        </div>
      </main>

      {/* Success Overlay */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'rgba(254,249,243,0.92)',
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.4s ease-out',
          }}
        >
          <div className="text-center flex flex-col items-center gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: '#c9ead9',
                animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.2s both',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '48px', color: '#2D4A3E', fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
            </div>
            <div>
              <h2
                className="font-bold text-[32px] leading-tight mb-2"
                style={{ fontFamily: 'Outfit, sans-serif', color: '#476558' }}
              >
                Welcome to the Pack!
              </h2>
              <p className="text-[16px]" style={{ color: '#554338' }}>
                Your journey with Furlo begins now. 🐾
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
