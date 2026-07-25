'use client'

import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onComplete?: () => void
  /** Minimum ms to show the splash before dismissing */
  minDuration?: number
}

/**
 * SplashScreen — full-page branded loading screen.
 * Shown while the app is bootstrapping (auth check, initial data fetch, etc.)
 * Matches the Furlo UI/UX brief: warm cream bg, Fraunces wordmark, amber dots, progress bar.
 *
 * Usage:
 *   - Render conditionally in layout until isReady === true
 *   - Pass `onComplete` to be notified when the min duration has elapsed
 */
export function SplashScreen({ onComplete, minDuration = 1800 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  // Simulate a natural-feeling progress bar that accelerates then slows near 100
  useEffect(() => {
    let width = 0
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval)
        return
      }
      // Faster at start, slower as it approaches 100
      const remaining = 100 - width
      const increment = Math.random() * Math.min(remaining * 0.35, 14) + 1
      width = Math.min(width + increment, 100)
      setProgress(Math.floor(width))
    }, 400)

    return () => clearInterval(interval)
  }, [])

  // After minDuration, begin fade-out and call onComplete
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      // Give the fade-out animation time to finish before notifying parent
      setTimeout(() => onComplete?.(), 400)
    }, minDuration)
    return () => clearTimeout(timer)
  }, [minDuration, onComplete])

  return (
    <div
      suppressHydrationWarning
      aria-label="Loading Furlo"
      role="status"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#FDF8F2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'opacity 0.4s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {/* Center group — logotype + tagline + dots */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        {/* FURLO wordmark */}
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            color: '#E8843A',
            fontSize: 'clamp(56px, 10vw, 96px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            userSelect: 'none',
          }}
        >
          FURLO
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            color: '#5C6370',
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            opacity: 0.75,
            marginBottom: '40px',
            userSelect: 'none',
          }}
        >
          Where Pets Belong
        </p>

        {/* Bouncing dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#E8843A',
                animation: 'furlo-dot-bounce 1.4s infinite ease-in-out both',
                animationDelay: `${[-0.32, -0.16, 0][i]}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar — bottom, subtle */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          width: '100%',
          maxWidth: '280px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: '#5C6370',
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              opacity: 0.55,
            }}
          >
            Preparing experience
          </span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              color: '#5C6370',
              fontSize: '9px',
              letterSpacing: '0.05em',
              opacity: 0.55,
            }}
          >
            {progress}%
          </span>
        </div>
        <div style={{ height: '1px', width: '100%', backgroundColor: '#EDE8E1', borderRadius: '999px' }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#E8843A',
              borderRadius: '999px',
              width: `${progress}%`,
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      </div>

      {/* Keyframe styles injected inline — avoids needing a global CSS dependency */}
      <style>{`
        @keyframes furlo-dot-bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          40% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
