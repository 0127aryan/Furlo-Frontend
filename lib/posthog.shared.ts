/** PostHog project API key (wizard/docs name: project token). */
export function getPostHogProjectToken(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    process.env.NEXT_PUBLIC_POSTHOG_KEY ||
    undefined
  )
}

/** Direct ingestion host for server-side SDK (not the Next.js `/ingest` proxy). */
export function getPostHogIngestHost(): string {
  return process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'
}

function ingestAssetsHost(ingestHost: string): string {
  if (ingestHost.includes('eu.i.posthog.com')) {
    return 'https://eu-assets.i.posthog.com'
  }
  return 'https://us-assets.i.posthog.com'
}

export function getPostHogUiHost(ingestHost: string): string {
  if (ingestHost.includes('eu')) {
    return 'https://eu.posthog.com'
  }
  return 'https://us.posthog.com'
}

export function getPostHogClientInitOptions() {
  const token = getPostHogProjectToken()
  if (!token) return null

  const ingestHost = getPostHogIngestHost()

  return {
    token,
    initOptions: {
      api_host: '/ingest',
      ui_host: getPostHogUiHost(ingestHost),
      defaults: '2026-05-30' as const,
      opt_out_capturing_by_default: true,
      ip: false,
      person_profiles: 'identified_only' as const,
      capture_pageview: false,
      tracing_headers: getTracingHeaderHosts(),
    },
    rewrites: [
      {
        source: '/ingest/static/:path*',
        destination: `${ingestAssetsHost(ingestHost)}/static/:path*`,
      },
      {
        source: '/ingest/:path*',
        destination: `${ingestHost}/:path*`,
      },
    ],
  }
}

function getTracingHeaderHosts(): string[] {
  const hosts = new Set<string>()
  const backend = process.env.BACKEND_API_URL || 'http://localhost:4000'
  try {
    hosts.add(new URL(backend).hostname)
  } catch {
    // ignore invalid URL
  }
  hosts.add('localhost')
  return [...hosts]
}

export function isPostHogConfigured(): boolean {
  return Boolean(getPostHogProjectToken())
}
