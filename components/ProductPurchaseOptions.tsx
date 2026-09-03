"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

interface ProductPurchaseOptionsProps {
  /** WooCommerce numeric product id, used to add this product to the cart */
  productId: number;
  productUrl: string;
  /** Only variant size shown for now — no live switching yet, see PROGRESS.md */
  size: string;
  price: string;
}

export default function ProductPurchaseOptions({
  productId,
  productUrl,
  size,
  price,
}: ProductPurchaseOptionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, openCart } = useCart();

  async function handleAddToCart() {
    if (isAdding) return;
    setIsAdding(true);
    const success = await addItem(productId, 1);
    setIsAdding(false);
    if (success) openCart();
  }

  return (
    <div className="flex flex-col pb-4">
      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          type="button"
          className="group/item relative p-3.5 text-center rounded transition-all border hover:bg-[#001689] border-[#001689] bg-[#f0f4ff] shadow-[inset_0_0_0_1px_#001489]"
        >
          <span className="block text-xs font-bold group-hover/item:text-white text-[#001689]">
            {size}
          </span>
        </button>
      </div>

      <button
        type="button"
        disabled={isAdding}
        onClick={handleAddToCart}
        className={`mt-2 w-full py-4 px-4 rounded-xs flex justify-between items-center font-bold text-xs tracking-wide uppercase transition-all ${
          isAdding ? "cursor-not-allowed bg-[#001689]/75 text-white" : "cursor-pointer bg-[#001689] text-white"
        }`}
      >
        <span>{isAdding ? "AGREGANDO..." : "AGREGAR AL CARRITO"}</span>
        <span>{price}</span>
      </button>

      <a
        href={productUrl}
        className="mt-4 text-[#001689] text-xs font-bold flex items-center justify-center gap-1 uppercase no-underline"
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
        VER DETALLES
      </a>
    </div>
  );
}
