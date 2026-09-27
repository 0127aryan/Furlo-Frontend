import { PostHog } from 'posthog-node'

import { getPostHogIngestHost, getPostHogProjectToken } from './posthog.shared'

export function createPostHogServerClient(): PostHog | null {
  const token = getPostHogProjectToken()
  if (!token) return null

  return new PostHog(token, {
    host: getPostHogIngestHost(),
    flushAt: 1,
    flushInterval: 0,
  })
}
