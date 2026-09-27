import * as Sentry from '@sentry/nextjs'
import { getSentryInitOptions } from './lib/sentry.shared'

Sentry.init(getSentryInitOptions())
