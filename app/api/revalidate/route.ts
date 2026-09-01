import { createHmac, timingSafeEqual } from "crypto";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.WOOCOMMERCE_WEBHOOK_SECRET;

function isValidSignature(rawBody: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;

  const expected = createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("base64");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  return (
    signatureBuffer.length === expectedBuffer.length &&
    timingSafeEqual(signatureBuffer, expectedBuffer)
  );
}

/** WooCommerce webhook (Settings > Advanced > Webhooks) for product created/updated/deleted. */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-wc-webhook-signature");

  if (!isValidSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Called from outside a Server Action (a webhook), so updateTag isn't available —
  // { expire: 0 } is the documented way to expire immediately instead of stale-while-revalidate.
  revalidateTag("products", { expire: 0 });

  return NextResponse.json({ revalidated: true });
}
