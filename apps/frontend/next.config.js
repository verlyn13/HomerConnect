/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  // Add CORS headers for static assets to fix OpaqueResponseBlocking errors
  async headers() {
    return [
      {
        source: "/_next/static/media/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        source: "/next.svg",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        source: "/vercel.svg",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        source: "/:path*.svg",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },

  // Suppress image optimization warnings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },

  // Silence unhandledRejection warnings
  onDemandEntries: {
    // Silent mode
    quiet: true,
  },
};

module.exports = nextConfig;
