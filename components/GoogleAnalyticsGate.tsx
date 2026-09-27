'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import {
  ANALYTICS_CONSENT_EVENT,
  hasAnalyticsConsent,
} from '@/lib/analyticsConsent'

export function GoogleAnalyticsGate({ gaId }: { gaId: string }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => setEnabled(hasAnalyticsConsent())
    sync()
    window.addEventListener(ANALYTICS_CONSENT_EVENT, sync)
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, sync)
  }, [])

  if (!enabled) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
