'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAnalyticsConsent } from '@/lib/useAnalyticsConsent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function isGaId(value: string) {
  return /^G-[A-Z0-9]+$/i.test(value)
}

export function GoogleAnalyticsGate({ gaId }: { gaId: string }) {
  const enabled = useAnalyticsConsent()
  const pathname = usePathname()
  const firstPath = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled || !pathname || !isGaId(gaId)) return
    if (firstPath.current === null) {
      firstPath.current = pathname
      return
    }
    if (typeof window.gtag !== 'function') return
    window.gtag('config', gaId, { page_path: pathname })
  }, [enabled, pathname, gaId])

  if (!enabled || !isGaId(gaId)) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  )
}
