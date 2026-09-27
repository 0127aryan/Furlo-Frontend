import * as Sentry from '@sentry/nextjs'
import posthog from 'posthog-js'

import { getPostHogClientInitOptions } from './lib/posthog.shared'
import { getSentryInitOptions } from './lib/sentry.shared'

Sentry.init(getSentryInitOptions())

const posthogConfig = getPostHogClientInitOptions()
if (posthogConfig) {
  posthog.init(posthogConfig.token, posthogConfig.initOptions)
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
