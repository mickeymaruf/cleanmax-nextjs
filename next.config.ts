import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // cleanmax.local (LocalWP) resolves to 127.0.0.1 — dev-only, matches WOOCOMMERCE_URL in .env.local
    dangerouslyAllowLocalIP: true,
    // 75 is Next's default; 85 is used for WooCommerce product imagery (see ProductCard/ProductDetails/CartDrawer);
    // 90 is the larger PDP main preview image (ProductDetails).
    qualities: [75, 85, 90],
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
      {
        protocol: "https",
        hostname: "srv1945944.hstgr.cloud",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
