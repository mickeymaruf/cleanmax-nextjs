"use server";

import { addItem, removeItem, updateItemQuantity, type Cart } from "@/lib/woocommerce-cart";

export type CartActionResult = { ok: true; cart: Cart } | { ok: false; error: string };

async function toActionResult(promise: Promise<Cart>): Promise<CartActionResult> {
  try {
    const cart = await promise;
    return { ok: true, cart };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo actualizar el carrito.",
    };
  }
}

export async function addCartItem(productId: number, quantity: number): Promise<CartActionResult> {
  return toActionResult(addItem(productId, quantity));
}

export async function updateCartItemQuantity(itemKey: string, quantity: number): Promise<CartActionResult> {
  return toActionResult(updateItemQuantity(itemKey, quantity));
}

export async function removeCartItem(itemKey: string): Promise<CartActionResult> {
  return toActionResult(removeItem(itemKey));
}
