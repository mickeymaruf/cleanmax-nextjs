import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // cleanmax.local (LocalWP) resolves to 127.0.0.1 — dev-only, matches WOOCOMMERCE_URL in .env.local
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cleanmax.com.ar",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "http",
        hostname: "cleanmax.local",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
