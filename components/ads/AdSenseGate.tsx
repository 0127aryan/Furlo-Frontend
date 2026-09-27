'use client'

import Script from 'next/script'
import { useAnalyticsConsent } from '@/lib/useAnalyticsConsent'

export function isAdSenseClientId(value: string) {
  return /^ca-pub-\d+$/.test(value)
}

export function AdSenseGate({ clientId }: { clientId: string }) {
  const enabled = useAnalyticsConsent()

  if (!enabled || !isAdSenseClientId(clientId)) return null

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
