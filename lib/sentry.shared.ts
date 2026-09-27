import type { ErrorEvent, EventHint } from '@sentry/nextjs'

export function scrubSentryEvent(event: ErrorEvent, _hint: EventHint): ErrorEvent | null {
  if (event.user) {
    delete event.user.email
    delete event.user.ip_address
  }
  return event
}

export function getSentryDsn(): string | undefined {
  return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
}

export function getSentryInitOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  const dsn = getSentryDsn()

  return {
    dsn,
    environment: process.env.NODE_ENV,
    enabled: isProd && Boolean(dsn),
    tracesSampleRate: isProd ? 0.1 : 1.0,
    beforeSend: scrubSentryEvent,
  }
}
