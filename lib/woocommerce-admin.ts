const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

if (!WOOCOMMERCE_URL) {
  throw new Error("Missing WOOCOMMERCE_URL environment variable");
}

// The authenticated wc/v3 REST API — unlike the public Store API used everywhere else in this
// codebase, this reads store configuration (not catalog/cart data) and needs a read-only
// Consumer Key/Secret pair (WooCommerce > Settings > Advanced > REST API). Server-only: never
// import this from a Client Component.
const ADMIN_API_URL = `${WOOCOMMERCE_URL}/wp-json/wc/v3`;

function authHeader(): string {
  return `Basic ${Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64")}`;
}

interface WCShippingZone {
  id: number;
  name: string;
  order: number;
}

interface WCShippingMethod {
  method_id: string;
  enabled: boolean;
  settings: {
    min_amount?: { value: string };
  };
}

async function getFreeShippingMinAmount(zoneId: number): Promise<number | null> {
  const res = await fetch(`${ADMIN_API_URL}/shipping/zones/${zoneId}/methods`, {
    headers: { Authorization: authHeader() },
    next: { revalidate: 86400, tags: ["shipping-settings"] },
  });
  if (!res.ok) return null;

  const methods: WCShippingMethod[] = await res.json();
  const freeShipping = methods.find((m) => m.method_id === "free_shipping" && m.enabled);
  const amount = freeShipping?.settings?.min_amount?.value;
  return amount ? Number(amount) : null;
}

/**
 * The store's free-shipping minimum order amount, read straight from WooCommerce's own
 * Settings > Shipping > Zones > Free Shipping method — the same place a merchant already
 * manages shipping, so there's no separate app-side number to keep in sync.
 *
 * We don't know the customer's destination pre-checkout (no address yet in the cart drawer),
 * so this checks each configured zone in its matching order and returns the first enabled
 * Free Shipping method's threshold, falling back to the default zone (id 0). Exact for a
 * single-zone store; a best-effort approximation if zones carry different thresholds.
 *
 * Returns null (banner hidden) if no API key pair is configured yet, or nothing is set up.
 */
export async function getFreeShippingThresholdCents(): Promise<number | null> {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) return null;

  try {
    const zonesRes = await fetch(`${ADMIN_API_URL}/shipping/zones`, {
      headers: { Authorization: authHeader() },
      next: { revalidate: 86400, tags: ["shipping-settings"] },
    });
    if (!zonesRes.ok) return null;

    const zones: WCShippingZone[] = await zonesRes.json();
    for (const zone of [...zones].sort((a, b) => a.order - b.order)) {
      const amount = await getFreeShippingMinAmount(zone.id);
      if (amount !== null) return Math.round(amount * 100);
    }

    const fallback = await getFreeShippingMinAmount(0);
    return fallback !== null ? Math.round(fallback * 100) : null;
  } catch {
    return null;
  }
}
