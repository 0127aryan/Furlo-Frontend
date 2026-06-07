'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/SplashScreen'

/**
 * AppShell — wraps all page content and manages the splash screen lifecycle.
 *
 * Responsibilities:
 * 1. Shows the SplashScreen on initial load for a minimum branded duration
 * 2. Dismisses the splash once the min duration has elapsed
 * 3. Prevents a flash of layout content before the splash completes
 *
 * Placed in RootLayout as the direct wrapper of {children}.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only run on client — avoids SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // While not mounted (SSR), render nothing to avoid hydration issues
  if (!mounted) {
    return null
  }

  return (
    <>
      {!splashDone && (
        <SplashScreen
          minDuration={2000}
          onComplete={() => setSplashDone(true)}
        />
      )}
      {/* Children are always in the DOM but hidden until splash finishes */}
      {/* This ensures fonts, scripts, and initial state begin loading immediately */}
      <div
        style={{
          opacity: splashDone ? 1 : 0,
          transition: splashDone ? 'opacity 0.3s ease' : 'none',
          visibility: splashDone ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </>
  )
}
