# Furlo Frontend

Next.js 16 web app for Furlo. Proxies API calls to the Express backend.

## Commands

```bash
npm install       # install dependencies
npm run dev       # generate Firebase SW + start Next.js (http://localhost:3000)
npm run build     # production build
npm start         # serve the production build
npm run lint      # ESLint
```

`npm run dev` and `npm run build` both run `scripts/generate-firebase-sw.mjs` first.

## Setup

1. Start the backend first (`cd ../Furlo-Backend && npm run dev`).
2. Copy env and fill in values:

```bash
cp .env.example .env.local
```

```env
BACKEND_API_URL=http://localhost:4000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Furlo
NEXT_PUBLIC_APP_TAGLINE=Where Pets Belong
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Observability (optional)

```env
# Same DSN in both vars for server + client error capture (production only by default)
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

PostHog initializes in `instrumentation-client.ts` (same pattern as `npx @posthog/wizard`) with a first-party `/ingest` proxy in `next.config.ts`. Events stay opted out until the user accepts the cookie banner. GA4 (`NEXT_PUBLIC_GA_ID`) loads only after the same consent.

Optional: run the interactive wizard locally to link your PostHog account or add MCP tooling:

```bash
npx -y @posthog/wizard@latest
```

For readable stack traces on Vercel, set `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` in the Vercel project (not in git).

Also optional: `NEXT_PUBLIC_FIREBASE_*` (web push), `NEXT_PUBLIC_GA_ID`.

3. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Browser requests to `/api/backend/*` are rewritten to `BACKEND_API_URL` (see `next.config.ts`).
