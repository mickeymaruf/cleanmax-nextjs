import { NextResponse } from "next/server";
import { getCart } from "@/lib/woocommerce-cart";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json(cart);
}
