# Headless Next.js + WooCommerce: checkout under the frontend domain

Reference doc for a recurring headless-commerce problem: a Next.js frontend and a WordPress/
WooCommerce backend on separate domains, where WooCommerce's *native* checkout page must render
under the **frontend's** domain and show the **exact same cart** the frontend built via the Store
API. Written from the CleanMax project (`srv1945944.hstgr.cloud` frontend,
`api.srv1945944.hstgr.cloud` WooCommerce backend on Hostinger CloudPanel) — kept generic enough to
reapply directly on the next project with two domains in this shape.

## Problem statement

- Headless storefront: products, cart drawer, add/update/remove — all driven by the WooCommerce
  **Store API** (`/wp-json/wc/store/v1`), called server-side from Next.js (Server Actions).
- Requirement: clicking "checkout" must land on WooCommerce's own checkout page (not a custom
  Next.js-built one — payment gateways, tax, shipping logic all stay in WooCommerce), **under the
  frontend's own domain**, showing the same cart the drawer had.
- The two systems don't share cart identity by default:
  - The Store API identifies a headless caller via a `Cart-Token` (JWT) + `Nonce` header pair —
    **not** a cookie. Confirmed directly against a real install: a plain server-to-server Store API
    call gets zero `Set-Cookie` in the response, only those two headers.
  - WooCommerce's classic/blocks checkout page render only ever reads the ordinary
    `wp_woocommerce_session_*` browser cookie. It has no idea what a `Cart-Token` header is —
    that's REST-API-only machinery.
  - So a plain link to the checkout page — even proxied onto the frontend's domain — renders with
    an empty cart.

## Solution (three parts)

### 1. Reverse-proxy WooCommerce's customer-facing paths onto the frontend domain

`next.config.ts`:

```ts
async rewrites() {
  return [
    // WordPress 301s /checkout -> /checkout/ using its own absolute site URL, which would carry
    // the browser off the frontend domain — proxy straight to the canonical, slash-terminated
    // path so that redirect never fires.
    { source: "/checkout", destination: `${WOOCOMMERCE_URL}/checkout/` },
    { source: "/checkout/:path*", destination: `${WOOCOMMERCE_URL}/checkout/:path*` },
    { source: "/cart", destination: `${WOOCOMMERCE_URL}/cart/` },
    { source: "/my-account", destination: `${WOOCOMMERCE_URL}/my-account/` },
    { source: "/my-account/:path*", destination: `${WOOCOMMERCE_URL}/my-account/:path*` },
    { source: "/wp-json/:path*", destination: `${WOOCOMMERCE_URL}/wp-json/:path*` },
  ];
},
```

This makes the checkout/cart/account pages *and* the Store API itself same-origin to the browser
(the blocks checkout's own JS calls `/wp-json/...` relative to whatever page it's on — proxy that
too, or its in-page cart calls break). Next.js's external rewrite is a true reverse proxy: it
forwards the request and streams the response — including `Set-Cookie` — back to the browser as
its own, so nothing else is needed to make it "same-origin."

**Gotcha:** WordPress issues absolute redirects using its own configured site URL
(`api.srv1945944.hstgr.cloud`), not the proxy's public-facing domain. Two consequences:
- Non-canonical paths (missing trailing slash) get 301'd straight off the frontend domain — proxy
  to the canonical form directly (`/checkout/`, not `/checkout`) to dodge it.
- A genuinely empty cart hitting `/checkout` still gets redirected to `/cart/` **on the backend
  domain** — WooCommerce's own empty-cart guard, unrelated to and not fixed by anything below. The
  clean fix is setting WordPress's **Site Address (URL)** (`WP_HOME`, *not* `WP_SITEURL` — that one
  controls wp-admin/core asset URLs and should stay pointed at the backend) to the frontend domain
  in Settings → General. Every WooCommerce-generated front-end URL (permalinks, checkout/cart
  links, the post-payment order-received redirect) then resolves to the frontend domain instead.
  Worth doing, but it's a separate WordPress-admin-level change with its own blast radius — treat
  it as a deliberate follow-up, not a prerequisite for the flow below.

### 2. Keep cart identity as a Cart-Token, server-side (`lib/woocommerce-cart.ts`)

Don't try to make the Store API set a cookie — it won't, for headless/server-to-server calls
(verified). Keep doing what a headless integration normally does: store the `Cart-Token`/`Nonce`
the Store API returns in your **own** httpOnly cookies, and re-send them as request headers on
every call:

```ts
const CART_TOKEN_COOKIE = "wc_cart_token";
const CART_NONCE_COOKIE = "wc_cart_nonce";

async function doRequest(path: string, init?: RequestInit) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;
  const cartNonce = cookieStore.get(CART_NONCE_COOKIE)?.value;

  const headers = new Headers(init?.headers);
  if (cartToken) headers.set("Cart-Token", cartToken);
  if (cartNonce) headers.set("Nonce", cartNonce);

  const res = await fetch(`${STORE_API_URL}${path}`, { ...init, headers, cache: "no-store" });

  const responseToken = res.headers.get("Cart-Token");
  const responseNonce = res.headers.get("Nonce");
  if (responseToken) cookieStore.set(CART_TOKEN_COOKIE, responseToken, { httpOnly: true, sameSite: "lax", path: "/" });
  if (responseNonce) cookieStore.set(CART_NONCE_COOKIE, responseNonce, { httpOnly: true, sameSite: "lax", path: "/" });

  return res;
}
```

Also handle the day-one race: the very first mutation for a new visitor has no nonce yet (the
layout's initial `GET /cart` can't persist cookies from a Server Component render — only a Server
Action/Route Handler can). The Store API rejects that with a `401`; refresh the nonce via one
extra `GET /cart` (this call *does* run inside the mutation's own Server Action) and retry once.

### 3. Hand the Cart-Token to WooCommerce via its own built-in `?session=` mechanism

This is the part that isn't obvious and is easy to over-engineer (see "Dead ends" below).
**WooCommerce core already ships the exact bridge needed** —
`WC_Session_Handler::init_session_from_request()` (`includes/class-wc-session-handler.php`). On
*any* page load, if a `?session=<cart-token>` query parameter is present and validates as a real
Cart-Token JWT for a guest cart, WooCommerce clones that cart's session data into a fresh
cookie-backed session and sets the real session cookie — before the page renders. No custom
WordPress code required.

A Route Handler builds that URL, because the Cart-Token cookie is httpOnly (client components
can't read it) and the redirect must be absolute-safe under a reverse proxy in production:

```ts
// app/checkout-redirect/route.ts — the actual link target for the checkout/"Comprar" button
export async function GET() {
  const cartToken = await getCartToken();
  const target = cartToken ? `/checkout?session=${encodeURIComponent(cartToken)}` : "/checkout";

  // A RELATIVE Location header, resolved by the browser against the domain it's actually on.
  // NOT NextResponse.redirect(new URL(target, request.url)) — behind a production reverse proxy,
  // request.url reflects whatever internal host Next.js is bound to (e.g. localhost:3000), not
  // the public domain, and would redirect visitors straight out to localhost. Confirmed live.
  const response = new NextResponse(null, { status: 307, headers: { Location: target } });

  // WooCommerce's ?session= hand-off only clones into a cookie session ONCE per browser — a
  // leftover WooCommerce cookie from an earlier checkout visit makes it skip re-cloning and just
  // reuse that stale cart. The cart's source of truth is the Store API cart-token, not whatever
  // the classic checkout session happened to hold before, so clear those cookies here to force a
  // fresh clone on every visit. Confirmed live: without this, a 3-item cart from an earlier visit
  // kept showing up on checkout even after the drawer cart had changed to 1 item.
  const cookieStore = await cookies();
  for (const c of cookieStore.getAll()) {
    if (c.name.startsWith("wp_woocommerce_session_") || c.name.startsWith("woocommerce_")) {
      response.cookies.delete(c.name);
    }
  }

  return response;
}
```

Point the checkout link/button at `/checkout-redirect` instead of `/checkout` directly.

## Dead ends (so the next attempt skips them)

Both explored and discarded before landing on the above — kept here because they're the "obvious"
first instincts and both fail for non-obvious reasons:

1. **"Just forward WooCommerce's native session cookie through our own server-to-server calls,
   like we do for Cart-Token."** Doesn't work: the Store API never issues one for a headless
   caller in the first place (verified — `curl` a real Store API endpoint and check for
   `Set-Cookie`; there isn't one). Nothing to forward.
2. **A custom WordPress mu-plugin that hand-verifies the Cart-Token and calls WooCommerce's
   internal `rest_do_request()` + `set_customer_session_cookie()` on `template_redirect`.** Looks
   reasonable, silently doesn't work: the Store API's Cart-Token authentication only swaps in
   WooCommerce's *own* token-aware `SessionHandler` when `WC()->is_store_api_request()` is true for
   the *current* top-level request. A normal `/checkout` page load never satisfies that, so the
   nested `rest_do_request()` call runs against the ordinary cookie session and never touches the
   token's data — `set_customer_session_cookie()` then just cookie-ifies whatever empty session was
   already there. Confirmed live: the mu-plugin set a cookie, but the checkout page still saw an
   empty cart. Deleted once WooCommerce's own `init_session_from_request()` (solution step 3
   above) was found and confirmed working instead — it's the real, supported integration point,
   and needs zero WordPress-side code.

## Verifying without a browser

Everything above was verified end-to-end with `curl` against the real backend before touching the
browser — worth doing the same on a new project, since each round trip through an actual browser
+ redeploy is slow to iterate on:

```bash
# 1. Build a cart via the (proxied) Store API, capturing Cart-Token/Nonce from response headers
curl -sD - https://<frontend>/wp-json/wc/store/v1/cart
curl -sD - -X POST https://<frontend>/wp-json/wc/store/v1/cart/add-item \
  -H "Content-Type: application/json" -H "Cart-Token: $CT" -H "Nonce: $NC" \
  -d '{"id":<product_id>,"quantity":1}'

# 2. Follow the hand-off exactly as the browser would
curl -sD - "https://<frontend>/checkout?session=$CT"        # expect 200, Set-Cookie, no redirect

# 3. Confirm the resulting cookie session really holds the cart (not a stale one)
curl -s "https://<frontend>/wp-json/wc/store/v1/cart" -H "Cookie: <cookie from step 2>" \
  | grep -o '"items_count":[0-9]*'
```

To reproduce the stale-cookie bug specifically: repeat step 2 with an *old* session cookie already
attached (simulating a returning visitor) and confirm step 3 still reflects the *current* cart, not
the one from the first pass.
