import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "*.hstgr.io",
      },
      {
        protocol: "https",
        hostname: "komuna.id",
      },
    ],
  },
};

export default nextConfig;