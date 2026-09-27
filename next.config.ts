import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

import { getPostHogClientInitOptions } from "./lib/posthog.shared";

const posthogRewrites = getPostHogClientInitOptions()?.rewrites ?? [];

const nextConfig: NextConfig = {
  devIndicators: {
    position: "top-right",
  },
  async rewrites() {
    // Cookie-aware proxy lives in app/api/backend/[...path]/route.ts.
    // Keep this rewrite as a fallback for unmatched methods.
    return [
      ...posthogRewrites,
      {
        source: "/api/backend/:path*",
        destination: `${process.env.BACKEND_API_URL || "http://localhost:4000"}/:path*`,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
