import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  trailingSlash: true,
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://backend.ravokstudios.com";
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
