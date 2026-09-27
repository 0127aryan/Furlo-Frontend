export const ANALYTICS_CONSENT_KEY = 'furlo_analytics_consent'
export const ANALYTICS_CONSENT_EVENT = 'furlo-analytics-consent'

export type AnalyticsConsent = 'granted' | 'denied' | null

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return null
  const value = localStorage.getItem(ANALYTICS_CONSENT_KEY)
  if (value === 'granted' || value === 'denied') return value
  return null
}

export function writeAnalyticsConsent(value: AnalyticsConsent) {
  if (typeof window === 'undefined') return
  if (value) {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, value)
  } else {
    localStorage.removeItem(ANALYTICS_CONSENT_KEY)
  }
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT))
}

export function hasAnalyticsConsent(): boolean {
  return readAnalyticsConsent() === 'granted'
}
