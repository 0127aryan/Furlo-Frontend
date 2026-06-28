'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { useAuthStore } from '@/store/useAuthStore'

type JoinType = 'parent' | 'lover' | null

const options = [
  {
    id: 'parent' as const,
    icon: 'pets',
    iconBg: 'rgba(151,73,0,0.10)',
    iconColor: '#974900',
    title: "I'm a Pet Parent",
    description: 'Create unique Paw Prints for your companions and connect with local breed packs.',
  },
  {
    id: 'lover' as const,
    icon: 'favorite',
    iconBg: 'rgba(71,101,88,0.20)',
    iconColor: '#476558',
    title: 'I Love Pets',
    description: 'Explore The Yard, browse adoption stories, and follow your favorite Pack Members.',
  },
]

export default function JoinSelectPage() {
  const [selected, setSelected] = useState<JoinType>(null)
  const [animating, setAnimating] = useState(false)
  const router = useRouter()
  const { setOnboardingData } = useAuthStore()

  const handleContinue = async () => {
    if (!selected || animating) return
    setAnimating(true)
    setOnboardingData({ role: selected })
    await new Promise((r) => setTimeout(r, 300))
    router.push('/join/profile')
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
            href="/join"
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
            Step 1 of 3
          </span>
          <div className="w-8" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-0.5 bg-[#ece7e2]">
        <div className="h-full bg-[#E8843A] transition-all duration-500" style={{ width: '33.3%' }} />
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
              How would you like to join Furlo?
            </h1>
            <p className="text-[16px] text-[#554338]">You can always change this later.</p>
          </div>

          {/* Option cards */}
          <div className="flex flex-col gap-4">
            {options.map((opt, i) => {
              const isSelected = selected === opt.id
              return (
                <button
                  key={opt.id}
                  id={`card-${opt.id}`}
                  onClick={() => setSelected(opt.id)}
                  className="relative text-left p-6 rounded-xl border flex items-start gap-4 group transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: isSelected ? '#ffdbc7' : '#fef9f3',
                    borderColor: isSelected ? '#974900' : '#dbc1b3',
                    borderWidth: isSelected ? '2px' : '1px',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: opt.iconBg }}
                  >
                    <span
                      className="material-symbols-outlined text-[28px]"
                      style={{ color: opt.iconColor }}
                    >
                      {opt.icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1 pr-6">
                    <h3
                      className="text-[18px] font-semibold text-[#1d1b18]"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {opt.title}
                    </h3>
                    <p className="text-[14px] text-[#554338] leading-relaxed">{opt.description}</p>
                  </div>

                  {/* Check icon */}
                  <div
                    className="absolute top-4 right-4 transition-all duration-200"
                    style={{ opacity: isSelected ? 1 : 0, transform: isSelected ? 'scale(1)' : 'scale(0.7)' }}
                  >
                    <span
                      className="material-symbols-outlined text-[22px]"
                      style={{ color: '#974900', fontVariationSettings: "'FILL' 1, 'wght' 600" }}
                    >
                      check_circle
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* CTA */}
          <div className="mt-2">
            <button
              id="btn-continue"
              onClick={handleContinue}
              disabled={!selected}
              className="w-full h-14 rounded-full flex items-center justify-center gap-2 text-[18px] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: selected ? '#E8843A' : '#f2ede7',
                color: selected ? '#fff' : '#887366',
                cursor: selected ? 'pointer' : 'not-allowed',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              {animating ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  Setting up your profile…
                </>
              ) : (
                <>
                  Continue
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-8 px-4 border-t border-[#dbc1b3]/30"
        style={{ background: '#f8f3ed' }}
      >
        <div className="max-w-[480px] mx-auto text-center">
          <p className="text-[12px] text-[#887366]">© 2026 FURLO. Where Pets Belong.</p>
        </div>
      </footer>
    </div>
  )
}
