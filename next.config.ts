import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // All frontend calls to /api/backend/* are proxied to the Express backend
        // This keeps the backend URL hidden from the browser and simplifies cookie handling
        source: "/api/backend/:path*",
        destination: `${process.env.BACKEND_API_URL || "http://localhost:4000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
