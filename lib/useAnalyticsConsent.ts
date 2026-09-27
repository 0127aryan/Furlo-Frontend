'use client'

import { useEffect, useState } from 'react'
import { ANALYTICS_CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/analyticsConsent'

export function useAnalyticsConsent() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(hasAnalyticsConsent())
    sync()
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sync)
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, sync)
  }, [])

  return enabled
}
