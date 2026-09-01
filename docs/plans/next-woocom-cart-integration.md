# Cart Drawer + WooCommerce Cart Integration

## Context

CleanMax is migrating from a Shopify theme to a headless Next.js frontend backed by WooCommerce (via the public Store API, already used in `lib/woocommerce.ts` for product listing and PDP data). The old Shopify theme's cart drawer (`cleanmax-reference/sections/header.liquid` → `snippets/cart-drawer.liquid` + `assets/cart.js`) needs a Next.js/WooCommerce equivalent: a slide-in drawer, reachable from the header cart button, where a shopper can see line items, adjust quantities, remove items, and (eventually) proceed to checkout. Today `ProductDetails.tsx`'s "AGREGAR AL CARRITO" button and `ProductPurchaseOptions.tsx`'s equivalent are both no-op placeholders; the header cart button renders a hardcoded `0` badge.

Architecture decisions were made collaboratively before this plan (see conversation) and are locked in:

- **WooCommerce is the source of truth for the cart**, not local Next.js state. Every add/quantity-change/remove syncs immediately to WooCommerce's Store API (`wp-json/wc/store/v1/cart/*`), mirroring the reference theme's `cart.js` behavior (call the platform, re-render from its response) — just replacing "Shopify" with "WooCommerce."
- **Server Actions**, not a `/api/cart/*` Route Handler REST layer, for the three mutations (add item, update quantity, remove item). This is the idiomatic Next.js pattern for in-tree mutations in this Next.js version, gives free CSRF protection, and its per-client sequential dispatch is a genuine correctness win for a quantity stepper (rules out lost-update races from rapid clicking). Reading the initial cart (to seed SSR) uses a plain server-side async function — no HTTP endpoint needed for that either.
- **Cart identity (WooCommerce's Store API `Cart-Token` + `Nonce`) is managed entirely server-side**, persisted in a first-party httpOnly cookie our own Server Actions read/write. This works today regardless of the still-undecided production domain topology, because it's a server-to-server relationship (our Next.js server ↔ WooCommerce) with no browser CORS/cross-origin cookie question involved.
- **Checkout hand-off is explicitly out of scope for this pass.** Redirecting to WooCommerce's *native* checkout page with the *same* cart intact requires resolving how production will route between the Next.js frontend and the WooCommerce backend (same-origin rewrite proxy vs. direct cross-origin CORS+credentials vs. something else) — undecided pending production hosting details. The "Comprar" button will link to `${WOOCOMMERCE_URL}/checkout` as a clearly-flagged placeholder; the cart/mutation layer built here is intentionally decoupled from that decision so nothing here needs rework once it's made.

## Implementation

### 1. `lib/woocommerce.ts` — expose product IDs

`getProductBySlug`'s returned `ProductPageData` currently has no WooCommerce numeric product `id`, but the Store API's add-item endpoint needs one. Add `id: number` to `ProductPageData` (from `WCStoreProduct.id`) and thread it through `toProduct`/`ProductPageData` mapping. `app/products/[handle]/page.tsx` passes it down to `ProductDetails`.

### 2. `lib/woocommerce-cart.ts` (new) — Store API cart client

- `storeApiFetch(path, init)`: low-level helper. Reads the `wc_cart_token`/`wc_cart_nonce` cookies (via `next/headers` `cookies()`), attaches them as `Cart-Token`/`Nonce` request headers when present, calls `${WOOCOMMERCE_URL}/wp-json/wc/store/v1${path}`, and on response persists any updated `Cart-Token`/`Nonce` response headers back into the cookies (httpOnly, `sameSite: 'lax'`, scoped to our own domain — see [Cart Tokens docs](https://developer.woocommerce.com/docs/apis/store-api/cart-tokens/)).
- `getCart()`: `GET /cart`, normalized into a UI-shaped type (`{ items: CartItem[], itemCount, subtotal, subtotalFormatted }`), each `CartItem` carrying `{ key, productId, name, quantity, image, price, lineTotal, url }` — mirrors what `cart-drawer.liquid` renders per item.
- `addItem(productId, quantity)`: `POST /cart/add-item`.
- `updateItemQuantity(itemKey, quantity)`: `POST /cart/update-item`.
- `removeItem(itemKey)`: `POST /cart/remove-item`.
- All three mutation helpers return the normalized cart from the response body (Store API returns the full updated cart on every mutation), so callers never need a second round trip.

### 3. `app/cart/actions.ts` (new) — Server Actions

`'use server'` module wrapping the three mutation helpers from step 2:

```ts
export async function addCartItem(productId: number, quantity: number): Promise<CartActionResult>
export async function updateCartItemQuantity(itemKey: string, quantity: number): Promise<CartActionResult>
export async function removeCartItem(itemKey: string): Promise<CartActionResult>
```

`CartActionResult = { ok: true, cart: Cart } | { ok: false, error: string }` — WooCommerce failures (stock, invalid id, network) are caught and returned as data, not thrown, so the UI can show inline feedback instead of an error boundary.

### 4. `components/CartProvider.tsx` (new, Client Component) — shared cart state

Wraps the app (added in `app/layout.tsx`, around `<Header />`/`{children}`) so cart state is reachable from both the header badge and any PDP/quick-add button. Seeded from a server-fetched initial cart:

- `app/layout.tsx` becomes `async`, calls `getCart()` (step 2) server-side, passes the result as `initialCart` to `<CartProvider>` — avoids an empty-cart flash or client-side fetch waterfall on first load.
- Provider holds `{ items, itemCount, isOpen }`, exposes `addItem`, `updateQuantity`, `removeItem`, `openCart`, `closeCart` via a `useCart()` hook.
- `addItem`/`updateQuantity`/`removeItem` call the Server Actions from step 3 inside `useTransition`, with `useOptimistic` layered on top for the quantity stepper so +/- clicks feel instant while the action reconciles in the background (see sequential-dispatch tradeoff noted above).
- Pending state drives the drawer's loading overlay (matches `#cart-loading-overlay` in the reference).

### 5. `components/CartDrawer.tsx` (new, Client Component)

Structural/visual port of `cleanmax-reference/snippets/cart-drawer.liquid`, adapted to this codebase's existing Tailwind conventions (see `ProductDetails.tsx` for the established style):

- Slide-in panel + overlay, driven by `useCart().isOpen` (translate-x transition, matches the reference's `#cart-drawer.open` behavior).
- Header bar: "CARRITO" title, close button → `closeCart()`.
- Sticky footer (only rendered when cart has items): subtotal, item count, "3 cuotas sin interés de X" line, "COMPRAR" button — for now a plain link to `${WOOCOMMERCE_URL}/checkout` (see Context — checkout hand-off deferred), disabled/hidden when cart is empty.
- Scrollable item list: image, title, quantity ± stepper (calls `updateQuantity`), remove control, line price. Empty state: message + "Explorar Productos" button that just calls `closeCart()`.
- **Intentionally omitted this pass:** the free-shipping progress bar block in the reference — there's no free-shipping-threshold setting anywhere in this Next.js project yet, so there's nothing to compute it from. Easy to add once that setting exists.

### 6. Wire up entry points

- **`components/Header.tsx`**: replace the hardcoded `0` badge with `useCart().itemCount`; cart button's `onClick` calls `openCart()` instead of being inert. Render `<CartDrawer />` once, at the `CartProvider` level in `app/layout.tsx` (not inside `Header`), so it isn't tied to header re-renders.
- **`components/ProductDetails.tsx`**: `handleAddToCart` (currently a no-op at lines 210–215) calls `useCart().addItem(productId, quantity)`, using the already-present `isAdding` state for the pending UI, then `openCart()` on success. Needs a new `productId` prop (from step 1) threaded in from `app/products/[handle]/page.tsx`. Quantity comes from `selectedTier.quantity` when a bundle tier is selected, else `1`.
- **`components/ProductPurchaseOptions.tsx`** (used by `ProductCard`'s hover state and mobile quick-add modal): explicitly **out of scope** for this pass, same as the original request scoped wiring to `ProductDetails.tsx` only. Its add-to-cart button keeps its current placeholder comment. `ProductCard`'s `Product` type has no WooCommerce id yet, so wiring it up is a natural, separable follow-up once needed — the `addItem` Server Action from step 3 will work for it unchanged.

### 7. Persist this plan into the repo

Once implementation starts, save this document's content to `docs/plan/cart-drawer-woocommerce-integration.md` as the first step, per your request to have it live in `docs/plan`.

## Verification

- `npm run dev`; open a PDP (`/products/antihongo`), click "AGREGAR AL CARRITO" → drawer opens with the item, correct quantity (matches selected bundle tier), correct price.
- Header badge count updates immediately and matches the drawer.
- Refresh the page (or open a new tab to the same browser) → cart persists, confirming the cookie-backed WooCommerce session is genuinely authoritative, not just in-memory React state.
- +/- the quantity stepper rapidly → optimistic UI updates instantly, settles on the correct final quantity (no lost/duplicate increments) once the queued Server Actions resolve.
- Remove an item; empty the cart entirely → empty state renders, "COMPRAR" control is disabled/hidden.
- Cross-check against WooCommerce directly (wp-admin cart/session, or `curl {WOOCOMMERCE_URL}/wp-json/wc/store/v1/cart` with the cookie) to confirm items genuinely exist server-side in WooCommerce, not just client state.
