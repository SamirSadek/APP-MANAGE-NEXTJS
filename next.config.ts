import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  api: {
    bodyParser: true,
  },
};

export default nextConfig;
