import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "top-right",
  },
  async rewrites() {
    // Cookie-aware proxy lives in app/api/backend/[...path]/route.ts.
    // Keep this rewrite as a fallback for unmatched methods.
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.BACKEND_API_URL || "http://localhost:4000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
