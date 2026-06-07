'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Only capture events after explicit user consent (cookie banner)
      // opt_out_capturing_by_default: true means no tracking until grantAnalyticsConsent() is called
      opt_out_capturing_by_default: true,
      // Anonymize IPs
      ip: false,
      person_profiles: 'identified_only',
      capture_pageview: false, // We'll manually track page views
    })
  }, [])

  if (!POSTHOG_KEY) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}

// Utility to give analytics consent (called from cookie banner)
export function grantAnalyticsConsent() {
  posthog.opt_in_capturing()
}

// Utility to revoke analytics consent (called from account settings)
export function revokeAnalyticsConsent() {
  posthog.opt_out_capturing()
}

// Typed event tracker
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (POSTHOG_KEY) {
    posthog.capture(event, properties)
  }
}
