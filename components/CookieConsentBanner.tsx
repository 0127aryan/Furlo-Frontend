'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  grantAnalyticsConsent,
  revokeAnalyticsConsent,
} from '@/lib/posthog'
import {
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from '@/lib/analyticsConsent'

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<AnalyticsConsent>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = readAnalyticsConsent()
    setConsent(stored)
    if (stored === 'granted') {
      grantAnalyticsConsent()
    }
  }, [])

  if (!mounted || consent !== null) {
    return null
  }

  const accept = () => {
    writeAnalyticsConsent('granted')
    grantAnalyticsConsent()
    setConsent('granted')
  }

  const decline = () => {
    writeAnalyticsConsent('denied')
    revokeAnalyticsConsent()
    setConsent('denied')
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-[#ede8e1] bg-[#fef9f3] px-4 py-4 shadow-[0_-8px_24px_rgba(29,27,24,0.08)] md:px-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-relaxed text-[#554338]">
          We use anonymised analytics (PostHog) to improve Furlo. Error reports go to Sentry without
          selling your data. See our{' '}
          <Link href="/privacy" className="font-medium text-[#974900] underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-[#ede8e1] bg-white px-4 py-2 text-[13px] font-medium text-[#554338]"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-[#974900] px-4 py-2 text-[13px] font-medium text-white"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  )
}
