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
      {/* Ambient background blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[5%] right-[2%] w-80 h-80 rounded-full"
          style={{ background: '#ffb688', filter: 'blur(120px)', opacity: 0.2 }}
        />
        <div
          className="absolute bottom-[10%] left-[5%] w-96 h-96 rounded-full"
          style={{ background: '#adcebe', filter: 'blur(140px)', opacity: 0.18 }}
        />
      </div>

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
              style={{ fontVariationSettings: "'wght' 600", fontSize: '22px' }}
            >
              chevron_left
            </span>
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#887366' }}>
            Step 1 of 4
          </span>
          <div className="w-8" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-[3px]" style={{ background: '#ece7e2' }}>
        <div
          className="h-full transition-all duration-700 ease-out rounded-full"
          style={{ width: '25%', background: 'linear-gradient(90deg, #E8843A, #ffb688)' }}
        />
      </div>

      {/* Main */}
      <main className="flex-grow flex items-start justify-center px-4 pt-10 pb-16">
        <div className="max-w-[480px] w-full flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1
              className="text-[30px] font-bold leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif', color: '#1d1b18' }}
            >
              How would you like to join Furlo?
            </h1>
            <p className="text-[15px]" style={{ color: '#554338' }}>
              You can always change this later.
            </p>
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
                  className="relative text-left rounded-2xl border flex items-start gap-4 group transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: isSelected ? '#fff8f3' : '#fef9f3',
                    borderColor: isSelected ? '#974900' : '#dbc1b3',
                    borderWidth: isSelected ? '2px' : '1px',
                    padding: '20px 24px',
                    boxShadow: isSelected
                      ? '0 4px 24px rgba(151,73,0,0.12)'
                      : '0 1px 4px rgba(28,35,41,0.04)',
                    animationDelay: `${i * 80}ms`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200"
                    style={{
                      background: isSelected
                        ? opt.id === 'parent' ? 'rgba(151,73,0,0.15)' : 'rgba(71,101,88,0.25)'
                        : opt.iconBg,
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: opt.iconColor,
                        fontSize: '26px',
                        fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      {opt.icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1.5 pr-8 flex-1">
                    <h3
                      className="font-semibold"
                      style={{
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '18px',
                        color: isSelected ? '#974900' : '#1d1b18',
                      }}
                    >
                      {opt.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: '#554338' }}>
                      {opt.description}
                    </p>
                  </div>

                  {/* Check icon */}
                  <div
                    className="absolute top-4 right-4 transition-all duration-200"
                    style={{
                      opacity: isSelected ? 1 : 0,
                      transform: isSelected ? 'scale(1)' : 'scale(0.6)',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{
                        color: '#974900',
                        fontSize: '22px',
                        fontVariationSettings: "'FILL' 1, 'wght' 600",
                      }}
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
              disabled={!selected || animating}
              className="w-full h-14 rounded-full flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: selected ? '#974900' : '#f2ede7',
                color: selected ? '#fff' : '#887366',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '16px',
                fontWeight: 600,
                cursor: selected ? 'pointer' : 'not-allowed',
                transform: 'scale(1)',
                boxShadow: selected ? '0 4px 20px rgba(151,73,0,0.25)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (selected) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
              }}
            >
              {animating ? (
                <>
                  <span className="material-symbols-outlined text-[18px]" style={{ animation: 'spin 1s linear infinite' }}>
                    progress_activity
                  </span>
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

          {/* Already a member link */}
          <p className="text-center text-[13px]" style={{ color: '#887366' }}>
            Already in the pack?{' '}
            <Link href="/join" className="font-semibold hover:underline" style={{ color: '#974900' }}>
              Find Your Pack
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t" style={{ borderColor: 'rgba(219,193,179,0.3)', background: '#f8f3ed' }}>
        <div className="max-w-[480px] mx-auto text-center">
          <p className="text-[11px]" style={{ color: '#887366' }}>
            © 2026 FURLO. Where Pets Belong.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
