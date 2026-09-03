"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { addCartItem, removeCartItem, updateCartItemQuantity, type CartActionResult } from "@/app/cart/actions";
import type { Cart } from "@/lib/woocommerce-cart";

interface CartContextValue {
  cart: Cart;
  isOpen: boolean;
  isPending: boolean;
  addItem: (productId: number, quantity: number) => Promise<boolean>;
  updateQuantity: (itemKey: string, quantity: number) => Promise<void>;
  removeItem: (itemKey: string) => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

function withItemCount(cart: Cart): Cart {
  return { ...cart, itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0) };
}

const EMPTY_CART: Cart = { items: [], itemCount: 0, subtotal: 0, subtotalFormatted: "$0" };

export default function CartProvider({
  initialCart = EMPTY_CART,
  children,
}: {
  initialCart?: Cart;
  children: ReactNode;
}) {
  const [cart, setCart] = useState(initialCart);

  // The layout no longer fetches the cart server-side (that would force every page
  // dynamic, defeating static generation) — so the real cart loads client-side here,
  // right after hydration, and briefly shows empty until this resolves.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/cart")
      .then((res) => (res.ok ? (res.json() as Promise<Cart>) : null))
      .then((fetchedCart) => {
        if (!cancelled && fetchedCart) setCart(fetchedCart);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  const [optimisticCart, applyOptimistic] = useOptimistic(
    cart,
    (state: Cart, updater: (current: Cart) => Cart) => updater(state),
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [isPending, startTransition] = useTransition();
  // Chains mutations so rapid stepper clicks dispatch to WooCommerce one at a time, in
  // order — avoids the lost-update races a quantity stepper is prone to under concurrent requests.
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  const enqueue = useCallback(<T,>(action: () => Promise<T>): Promise<T> => {
    const run = queueRef.current.then(action, action);
    queueRef.current = run.catch(() => {});
    return run;
  }, []);

  const addItem = useCallback(
    (productId: number, quantity: number) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const result: CartActionResult = await enqueue(() => addCartItem(productId, quantity));
          if (result.ok) setCart(result.cart);
          resolve(result.ok);
        });
      }),
    [enqueue],
  );

  const updateQuantity = useCallback(
    (itemKey: string, quantity: number) =>
      new Promise<void>((resolve) => {
        startTransition(async () => {
          applyOptimistic((current) =>
            withItemCount({
              ...current,
              items:
                quantity > 0
                  ? current.items.map((item) => (item.key === itemKey ? { ...item, quantity } : item))
                  : current.items.filter((item) => item.key !== itemKey),
            }),
          );
          const result: CartActionResult = await enqueue(() => updateCartItemQuantity(itemKey, quantity));
          if (result.ok) setCart(result.cart);
          resolve();
        });
      }),
    [applyOptimistic, enqueue],
  );

  const removeItem = useCallback(
    (itemKey: string) =>
      new Promise<void>((resolve) => {
        startTransition(async () => {
          applyOptimistic((current) =>
            withItemCount({ ...current, items: current.items.filter((item) => item.key !== itemKey) }),
          );
          const result: CartActionResult = await enqueue(() => removeCartItem(itemKey));
          if (result.ok) setCart(result.cart);
          resolve();
        });
      }),
    [applyOptimistic, enqueue],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        isOpen,
        isPending,
        addItem,
        updateQuantity,
        removeItem,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
