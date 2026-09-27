'use client'

import { useEffect, useRef } from 'react'
import { isAdSenseClientId } from '@/components/ads/AdSenseGate'
import { useAnalyticsConsent } from '@/lib/useAnalyticsConsent'

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[]
  }
}

function isAdSlot(value: string) {
  return /^\d+$/.test(value)
}

export function AdSenseUnit({
  slot,
  format = 'auto',
  className,
}: {
  slot: string | undefined
  format?: 'auto' | 'horizontal'
  className?: string
}) {
  const enabled = useAnalyticsConsent()
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''
  const pushed = useRef(false)
  const ready = Boolean(enabled && slot && isAdSlot(slot) && isAdSenseClientId(clientId))

  useEffect(() => {
    if (!ready || pushed.current) return
    let attempts = 0
    let timer: ReturnType<typeof setTimeout> | undefined

    const push = () => {
      if (pushed.current) return
      if (typeof window.adsbygoogle === 'undefined') {
        attempts += 1
        if (attempts < 20) timer = setTimeout(push, 250)
        return
      }
      try {
        window.adsbygoogle.push({})
        pushed.current = true
      } catch {
        // The unit stays empty if AdSense rejects the slot.
      }
    }

    push()
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [ready])

  if (!ready || !slot) return null

  return (
    <ins
      className={`adsbygoogle ${className ?? ''}`.trim()}
      style={{ display: 'block', minHeight: format === 'horizontal' ? 90 : 250 }}
      data-ad-client={clientId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  )
}
