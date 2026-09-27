'use client'

import { PostHogProvider } from '@/lib/posthog'
import { CookieConsentBanner } from '@/components/CookieConsentBanner'
import { PostHogPageView } from '@/components/PostHogPageView'

export function AnalyticsProviders({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <PostHogPageView />
      {children}
      <CookieConsentBanner />
    </PostHogProvider>
  )
}
