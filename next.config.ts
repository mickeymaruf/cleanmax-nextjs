import type { NextConfig } from "next";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;

if (!WOOCOMMERCE_URL) {
  throw new Error("Missing WOOCOMMERCE_URL environment variable");
}

const nextConfig: NextConfig = {
  // Reverse-proxies WooCommerce's own checkout/account pages and its Store API under our own
  // domain, so the WordPress backend (api.srv1945944.hstgr.cloud) is same-origin to the browser
  // from srv1945944.hstgr.cloud's point of view. Cart identity itself still travels via the
  // Cart-Token cookie (lib/woocommerce-cart.ts) — see docs/wordpress/checkout-reverse-proxy.md
  // for how /checkout-redirect hands that off into WooCommerce's own checkout session.
  async rewrites() {
    return [
      // WordPress 301s /checkout -> /checkout/ (trailing slash) using its own absolute site
      // URL, which would carry the browser off our domain — so proxy straight to the canonical,
      // slash-terminated path and skip that redirect entirely.
      { source: "/checkout", destination: `${WOOCOMMERCE_URL}/checkout/` },
      { source: "/checkout/:path*", destination: `${WOOCOMMERCE_URL}/checkout/:path*` },
      { source: "/cart", destination: `${WOOCOMMERCE_URL}/cart/` },
      { source: "/my-account", destination: `${WOOCOMMERCE_URL}/my-account/` },
      { source: "/my-account/:path*", destination: `${WOOCOMMERCE_URL}/my-account/:path*` },
      { source: "/wp-json/:path*", destination: `${WOOCOMMERCE_URL}/wp-json/:path*` },
    ];
  },
  images: {
      unoptimized: true,
    // cleanmax.local (LocalWP) resolves to 127.0.0.1 — dev-only, matches WOOCOMMERCE_URL in .env.local
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cleanmax.com.ar",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "api.limpmax.com.ar",
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev', // Legacy R2 dev URL
      },
      {
        protocol: 'https',
        hostname: 'media.limpmax.com.ar', // R2 bucket URL
      },
    ],
  },
};

export default nextConfig;
