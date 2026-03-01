import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost", "127.0.0.1", "rhexa.com", "lh3.googleusercontent.com", "avatars.githubusercontent.com"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
