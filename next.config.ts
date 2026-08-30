import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cleanmax.com.ar",
        pathname: "/cdn/shop/**",
      },
    ],
  },
};

export default nextConfig;
