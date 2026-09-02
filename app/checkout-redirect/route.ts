import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCartToken } from "@/lib/woocommerce-cart";

/**
 * The "Comprar" link's actual target. /checkout itself is reverse-proxied straight to WordPress
 * (see next.config.ts) so it stays on our domain, but WooCommerce's Store API never gives us a
 * browser session cookie for our cart (verified against the real backend) — only a Cart-Token.
 * The classic checkout page render doesn't look at that header at all, so without this hop it
 * would show an empty cart. `?session=<cart-token>` is WooCommerce's own built-in hand-off
 * (WC_Session_Handler::init_session_from_request(), core — no custom WordPress code needed): it
 * clones that guest cart into a real cookie-backed session before the checkout page renders.
 */
export async function GET() {
  const cartToken = await getCartToken();
  const target = cartToken ? `/checkout?session=${encodeURIComponent(cartToken)}` : "/checkout";

  // A relative Location header, resolved by the browser against the domain it's actually on —
  // NOT NextResponse.redirect(new URL(target, request.url)), which behind production's reverse
  // proxy resolves request.url against the internal host Next.js is bound to (localhost:3000),
  // not the public domain, and would redirect visitors straight out to localhost.
  const response = new NextResponse(null, { status: 307, headers: { Location: target } });

  // WooCommerce's ?session= hand-off only clones into a cookie-backed session once per browser —
  // a leftover WooCommerce cookie from an earlier "Comprar" visit makes it skip re-cloning and
  // just reuse that stale cart instead. Our cart's source of truth is the Store API cart-token,
  // not whatever the classic checkout session happened to hold before, so clear those cookies on
  // our own domain here to force a fresh clone on every visit.
  const cookieStore = await cookies();
  for (const c of cookieStore.getAll()) {
    if (c.name.startsWith("wp_woocommerce_session_") || c.name.startsWith("woocommerce_")) {
      response.cookies.delete(c.name);
    }
  }

  return response;
}
