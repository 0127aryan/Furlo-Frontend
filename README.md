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

Optional: `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_FIREBASE_*` (web push), `NEXT_PUBLIC_GA_ID`.

3. Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Browser requests to `/api/backend/*` are rewritten to `BACKEND_API_URL` (see `next.config.ts`).
