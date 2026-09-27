'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

import { isPostHogConfigured } from '@/lib/posthog.shared'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!isPostHogConfigured()) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}

export function grantAnalyticsConsent() {
  posthog.opt_in_capturing()
}

export function revokeAnalyticsConsent() {
  posthog.opt_out_capturing()
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (!isPostHogConfigured()) return
  posthog.capture(event, properties)
}

export function identifyAnalyticsUser(
  userId: string,
  properties?: Record<string, unknown>,
) {
  if (!isPostHogConfigured()) return
  posthog.identify(userId, properties)
}

export function resetAnalyticsUser() {
  if (!isPostHogConfigured()) return
  posthog.reset()
}
