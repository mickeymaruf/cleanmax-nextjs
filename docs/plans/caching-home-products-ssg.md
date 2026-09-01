# Cache the home page & product pages (static generation + on-demand revalidation)

## Context

The home page (`app/page.tsx`) and product detail pages (`app/products/[handle]/page.tsx`) already fetch WooCommerce product data with `next: { revalidate: 60 }` (`lib/woocommerce.ts`), which *should* make them cacheable. But every page in the app is currently forced into fully dynamic (uncached) rendering, because the root layout (`app/layout.tsx:18`) calls `await getCart()` on every request — and `getCart()` reads the visitor's cart cookies (`lib/woocommerce-cart.ts`, `cookies()` + `cache: "no-store"`). In Next.js's App Router, any dynamic/per-request API used in a layout drags every page beneath it into dynamic rendering too, even if that page's own data is cacheable.

Decisions made with the user:
- **Approach: classic ISR**, not Cache Components/PPR (the newer Next 16 flag). Simpler and lower-risk while learning caching; avoids an app-wide behavior-changing config flag.
- **Freshness: cache long, revalidate on demand.** Product data barely changes, so pages should be cached for a long time (24h) as a safety net, but a WooCommerce webhook should tell Next.js to refresh immediately when a product is actually edited/published.

The fix has three independent parts: (1) get the cart out of the static render path, (2) make the product data cache long + tag it for on-demand invalidation, (3) prebuild product pages at build time instead of on first visit.

## Part 1 — Decouple the cart from the static render path

The cart is legitimately per-visitor and must stay dynamic — the fix is to stop fetching it inside the server-rendered page tree, and fetch it from the browser instead, after the static HTML has already loaded.

- **`app/api/cart/route.ts`** (new): a Route Handler with a `GET` that calls the existing `getCart()` from `lib/woocommerce-cart.ts` and returns it as JSON. Route Handlers are never part of static page generation, so this can freely read cookies.
- **`app/layout.tsx`**: remove `const initialCart = await getCart();` and the `await`. `RootLayout` no longer needs to be `async` for this reason (check `getCheckoutUrl()` usage — that one stays, it's a plain sync string builder, no fetch/cookies involved). Pass no `initialCart` (or an empty cart) into `<CartProvider>`.
- **`components/CartProvider.tsx`**: make `initialCart` optional, default to an empty `Cart` (0 items). Add a `useEffect` on mount that calls `fetch("/api/cart")` and `setCart(...)` with the result, so the real cart populates client-side right after hydration.
- Net effect: the cart badge/drawer will briefly show empty state on first paint, then pop in with real contents a moment later — standard pattern for this kind of caching (same tradeoff Shopify Hydrogen storefronts make). Existing add/remove/update-quantity flows are Server Actions (`app/cart/actions.ts`) and are unaffected — they always run per-request regardless of the page's caching.

## Part 2 — Long cache + tag-based on-demand revalidation for product data

In **`lib/woocommerce.ts`**:
- `getFeaturedProducts` and `getProductBySlug`: change `next: { revalidate: 60 }` to `next: { revalidate: 86400, tags: ["products"] }` (24h safety-net revalidation, plus a `products` tag for instant on-demand invalidation).

New **`app/api/revalidate/route.ts`** (Route Handler, `POST`):
- Receives WooCommerce webhook payloads (product created/updated/deleted).
- Verifies the request using WooCommerce's webhook signing: WooCommerce sends an `X-WC-Webhook-Signature` header (HMAC-SHA256 of the raw body, base64-encoded, using a secret you set when creating the webhook). Compute the same HMAC over the raw request body using a new `WOOCOMMERCE_WEBHOOK_SECRET` env var and compare — reject (401) on mismatch so this endpoint can't be triggered by anyone else.
- On success, call `revalidateTag("products")` from `next/cache`. This is the standard classic-model on-demand revalidation API (works without any Cache Components flag) — it purges the cached fetches and the next visitor request regenerates the static page in the background.

Manual step (outside code, documented for the user): in WooCommerce admin → Settings → Advanced → Webhooks, add webhooks for "Product updated" (and created/deleted) pointing at `https://<your-domain>/api/revalidate`, with a secret — set that same secret as `WOOCOMMERCE_WEBHOOK_SECRET` in `.env.local` / Vercel env vars.

## Part 3 — Prebuild product pages at build time

Currently `app/products/[handle]/page.tsx` has no `generateStaticParams`, so each product page is only generated (and cached) after its first visitor. Add:

- A `getAllProductSlugs()` helper in `lib/woocommerce.ts` that pages through the WooCommerce Store API (`/products?per_page=100&page=N`, using the `X-WP-TotalPages` response header) to collect every product slug.
- `export async function generateStaticParams()` in `app/products/[handle]/page.tsx` returning `{ handle: slug }` for each. `dynamicParams` stays at its default (`true`), so a product added after the last build still renders on-demand and then gets cached — it just isn't prebuilt.

## Not in scope

- No `app/products/page.tsx` / `/collections/shop-all` listing page exists yet (the Hero CTA links there but it 404s today) — out of scope for this caching change; only the home page's featured grid and individual product detail pages are being addressed.
- Not enabling Cache Components/PPR (`cacheComponents` in `next.config.ts`) — deferred per the user's choice above.

## Verification

1. `npm run build` — confirm `app/page.tsx` and the known product handles under `app/products/[handle]` show as `●` (SSG) or `○`/static in the Next build output, not `λ`/dynamic.
2. `npm run dev` (or `next start` after build): load the home page and a product page, confirm they render correctly and the cart drawer still populates (briefly empty, then fills in) and add/remove/quantity-update still work.
3. Hit `/api/revalidate` with a mock WooCommerce-style payload/signature (or trigger a real webhook by editing a test product in WooCommerce) and confirm the next request reflects the change without a full redeploy.
4. Confirm an unauthorized POST to `/api/revalidate` (bad/missing signature) is rejected with 401.
