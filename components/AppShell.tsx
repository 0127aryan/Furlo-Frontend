'use client'

import { useState, useEffect } from 'react'
import { SplashScreen } from '@/components/SplashScreen'
import { apiFetch } from '@/lib/api'
import { useAuthStore } from '@/store/useAuthStore'

import { ToastContainer } from '@/components/ui/ToastContainer'
import { AnnouncementBanner } from '@/components/ui/AnnouncementBanner'
import { WebPushBootstrap } from '@/components/WebPushBootstrap'
import { subscribePetBadges } from '@/lib/subscribePetBadges'
import { subscribePackStatus } from '@/lib/subscribePackStatus'
import { startNotificationRealtime } from '@/lib/subscribeNotifications'

/**
 * AppShell — wraps all page content and manages the splash screen lifecycle.
 *
 * Responsibilities:
 * 1. Shows the SplashScreen on initial load for a minimum branded duration
 * 2. Dismisses the splash once the min duration has elapsed
 * 3. Prevents a flash of layout content before the splash completes
 * 4. Checks session state on mount to restore user/pet context
 *
 * Placed in RootLayout as the direct wrapper of {children}.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, setUser, setActivePet, onboardingData, setOnboardingData } = useAuthStore()

  // Run on client — avoids SSR mismatch
  useEffect(() => {
    setMounted(true)

    // Recover session
    const recoverSession = async () => {
      try {
        const data = await apiFetch('/auth/me')
        if (data && data.user) {
          setUser(data.user)
          setActivePet(data.activePet)

          // Auto-create pet profile if authenticated and petName was already configured in store
          const currentStore = useAuthStore.getState()
          if (!data.activePet && currentStore.onboardingData?.petName) {
            const ob = currentStore.onboardingData
            try {
              const obRes = await apiFetch('/auth/complete-onboarding', {
                method: 'POST',
                json: {
                  petName: ob.petName,
                  petUsername: ob.petUsername,
                  breed: ob.breed,
                  city: ob.city,
                  gender: ob.gender,
                  bio: ob.bio,
                  personalityTags: ob.personalityTags,
                },
              })
              if (obRes && obRes.pet) {
                setActivePet(obRes.pet)
                currentStore.setOnboardingData(null) // Reset onboarding data
              }
            } catch (err) {
              console.error('[AppShell] Failed to auto-create profile:', err)
            }
          }
        }
      } catch (err) {
        // Not authenticated, ignore
      }
    };
    recoverSession();
  }, [setUser, setActivePet])

  useEffect(() => {
    if (!user?.id) return
    startNotificationRealtime(user.id)
  }, [user?.id])

  useEffect(() => {
    const unsubBadges = subscribePetBadges(() => {})
    const unsubPacks = subscribePackStatus(() => {})
    return () => {
      unsubBadges()
      unsubPacks()
    }
  }, [])

  return (
    <div suppressHydrationWarning>
      <WebPushBootstrap enabled={splashDone && Boolean(user?.id)} />
      {!splashDone && (
        <SplashScreen
          minDuration={2000}
          onComplete={() => setSplashDone(true)}
        />
      )}
      {/* Children are always in the DOM but hidden until splash finishes */}
      {/* This ensures fonts, scripts, and initial state begin loading immediately */}
      <div
        suppressHydrationWarning
        style={{
          opacity: splashDone ? 1 : 0,
          transition: splashDone ? 'opacity 0.3s ease' : 'none',
          visibility: splashDone ? 'visible' : 'hidden',
        }}
      >
        <AnnouncementBanner />
        {children}
      </div>
      <ToastContainer />
    </div>
  )
}
