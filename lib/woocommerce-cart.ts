import { cookies } from "next/headers";
import { getProductCartDetailsByIds } from "./woocommerce";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;

if (!WOOCOMMERCE_URL) {
  throw new Error("Missing WOOCOMMERCE_URL environment variable");
}

const STORE_API_URL = `${WOOCOMMERCE_URL}/wp-json/wc/store/v1`;

const CART_TOKEN_COOKIE = "wc_cart_token";
const CART_NONCE_COOKIE = "wc_cart_nonce";

// Tested against the real backend: it never sets a browser session cookie for Store API calls,
// only Cart-Token/Nonce headers — so cart identity has to stay Cart-Token-based. Routes through
// /checkout-redirect (a Route Handler that can read the httpOnly token cookie) rather than
// linking straight to /checkout, so it can append `?session=<token>` — WooCommerce's own built-in
// hand-off (WC_Session_Handler::init_session_from_request()) that clones that cart into a real
// cookie-backed session before the (reverse-proxied, see next.config.ts) checkout page renders.
export function getCheckoutUrl(): string {
  return "/checkout-redirect";
}

export async function getCartToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_TOKEN_COOKIE)?.value;
}

export interface CartItem {
  key: string;
  productId: number;
  name: string;
  size: string;
  quantity: number;
  image: { src: string; alt: string };
  price: string;
  lineTotal: string;
  /** Pre-discount line price, only set when it differs from lineTotal */
  originalLineTotal?: string;
  url: string;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  /** Value * 100, matching ProductDetails' `priceCents` convention */
  subtotal: number;
  subtotalFormatted: string;
}

interface WCStoreCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  images: { src: string; thumbnail: string; alt: string }[];
  permalink: string;
  variation?: { attribute: string; value: string }[];
  prices: { price: string; currency_code: string; currency_minor_unit: number };
  totals: {
    line_subtotal: string;
    line_total: string;
    currency_code: string;
    currency_minor_unit: number;
  };
}

interface WCStoreCart {
  items: WCStoreCartItem[];
  items_count: number;
  totals: {
    total_items: string;
    currency_code: string;
    currency_minor_unit: number;
  };
}

function formatMoney(amount: string, minorUnit: number, currencyCode: string): string {
  const value = Number(amount) / 10 ** minorUnit;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

async function normalizeCart(wc: WCStoreCart): Promise<Cart> {
  const uniqueProductIds = [...new Set(wc.items.map((item) => item.id))];
  const detailsByProductId = await getProductCartDetailsByIds(uniqueProductIds);

  return {
    items: wc.items.map((item) => {
      const details = detailsByProductId.get(item.id);
      return {
        key: item.key,
        productId: item.id,
        name: item.name,
        size: item.variation?.find((v) => v.attribute === "Size")?.value || details?.size || "",
        quantity: item.quantity,
        image: {
          src: item.images[0]?.src ?? "",
          alt: item.images[0]?.alt || item.name,
        },
        price: formatMoney(item.prices.price, item.prices.currency_minor_unit, item.prices.currency_code),
        lineTotal: formatMoney(item.totals.line_total, item.totals.currency_minor_unit, item.totals.currency_code),
        originalLineTotal:
          item.totals.line_subtotal !== item.totals.line_total
            ? formatMoney(item.totals.line_subtotal, item.totals.currency_minor_unit, item.totals.currency_code)
            : undefined,
        url: details?.url ?? item.permalink,
      };
    }),
    itemCount: wc.items_count,
    subtotal: Math.round(
      (Number(wc.totals.total_items) / 10 ** wc.totals.currency_minor_unit) * 100
    ),
    subtotalFormatted: formatMoney(wc.totals.total_items, wc.totals.currency_minor_unit, wc.totals.currency_code),
  };
}

async function doRequest(path: string, init?: RequestInit): Promise<Response> {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;
  const cartNonce = cookieStore.get(CART_NONCE_COOKIE)?.value;

  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (cartToken) headers.set("Cart-Token", cartToken);
  if (cartNonce) headers.set("Nonce", cartNonce);

  const res = await fetch(`${STORE_API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const responseToken = res.headers.get("Cart-Token");
  const responseNonce = res.headers.get("Nonce");

  try {
    if (responseToken) {
      cookieStore.set(CART_TOKEN_COOKIE, responseToken, { httpOnly: true, sameSite: "lax", path: "/" });
    }
    if (responseNonce) {
      cookieStore.set(CART_NONCE_COOKIE, responseNonce, { httpOnly: true, sameSite: "lax", path: "/" });
    }
  } catch {
    // Cookies can only be written from a Server Action or Route Handler. The initial SSR
    // read (from a Server Component render, e.g. the root layout) can't persist a rotated
    // token/nonce — the next mutation, which does run inside a Server Action, persists it.
  }

  return res;
}

async function storeApiFetch(path: string, init?: RequestInit): Promise<Response> {
  const res = await doRequest(path, init);

  // A missing/stale nonce — most commonly a visitor's very first mutation, since the
  // layout's initial GET /cart can't persist the cookie it receives (see doRequest above) —
  // gets rejected with 401 (`woocommerce_rest_missing_nonce` / `..._invalid_nonce`) by the
  // Store API. Refresh the nonce via GET /cart (this call runs inside the same Server Action,
  // so its cookies *do* persist) and retry once, so the first click succeeds instead of
  // silently no-op'ing until a second click sends a valid nonce.
  if (res.status === 401 && path !== "/cart") {
    await doRequest("/cart", { method: "GET" });
    return doRequest(path, init);
  }

  return res;
}

async function mutateCart(path: string, body: unknown): Promise<Cart> {
  const res = await storeApiFetch(path, { method: "POST", body: JSON.stringify(body) });
  if (!res.ok) {
    throw new Error(`WooCommerce Store API error: ${res.status} ${res.statusText}`);
  }
  const data: WCStoreCart = await res.json();
  return normalizeCart(data);
}

export async function getCart(): Promise<Cart> {
  const res = await storeApiFetch("/cart", { method: "GET" });
  if (!res.ok) {
    throw new Error(`WooCommerce Store API error: ${res.status} ${res.statusText}`);
  }
  const data: WCStoreCart = await res.json();
  return normalizeCart(data);
}

export async function addItem(productId: number, quantity: number): Promise<Cart> {
  return mutateCart("/cart/add-item", { id: productId, quantity });
}

export async function updateItemQuantity(itemKey: string, quantity: number): Promise<Cart> {
  return mutateCart("/cart/update-item", { key: itemKey, quantity });
}

export async function removeItem(itemKey: string): Promise<Cart> {
  return mutateCart("/cart/remove-item", { key: itemKey });
}
