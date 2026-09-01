"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";

function arNumber(n: number) {
  return Math.floor(n).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0-1 14a1 1 0 01-1 1H9a1 1 0 01-1-1L7 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export default function CartDrawer({ checkoutUrl }: { checkoutUrl: string }) {
  const { cart, isOpen, isPending, updateQuantity, removeItem, closeCart } = useCart();
  const hasItems = cart.items.length > 0;
  const installmentPriceCents = cart.subtotal / 3;

  return (
    <>
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={`fixed top-0 right-0 z-[9999] flex h-full w-full flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 md:max-w-[385px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isPending && (
          <div className="absolute inset-0 z-[100] flex cursor-wait items-center justify-center bg-white/60 transition-opacity">
            <span className="sr-only">Cargando…</span>
            <SpinnerIcon />
          </div>
        )}

        <div className="flex h-16 w-full shrink-0 items-center justify-between bg-primary px-4 text-white">
          <span className="w-8" aria-hidden="true" />
          <h2 className="text-sm font-bold uppercase tracking-widest">Carrito</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="cursor-pointer p-2 transition hover:opacity-75"
          >
            <CloseIcon />
          </button>
        </div>

        {hasItems ? (
          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.key} className="flex gap-3 border-b border-gray-100 pb-4 last:border-b-0">
                  <Link href={item.url} className="w-20 shrink-0">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={80}
                      height={80}
                      quality={85}
                      className="h-20 w-20 object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link href={item.url} className="text-sm font-bold text-gray-900 hover:underline">
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Eliminar ${item.name}`}
                        className="shrink-0 cursor-pointer p-1 text-gray-400 transition hover:text-gray-700"
                      >
                        <RemoveIcon />
                      </button>
                    </div>

                    <div className="mt-2 flex items-end justify-between">
                      <div className="flex items-center outline outline-gray-300">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          aria-label="Restar una unidad"
                          className="flex cursor-pointer items-center justify-center p-1.5 text-primary transition hover:bg-primary/10"
                        >
                          <MinusIcon />
                        </button>
                        <span className="flex h-6 w-6 items-center justify-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          aria-label="Sumar una unidad"
                          className="flex cursor-pointer items-center justify-center p-1.5 text-primary transition hover:bg-primary/10"
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      <span className="text-lg font-semibold text-gray-900">{item.lineTotal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-20 text-center">
            <p className="mb-4 text-sm font-medium text-gray-500">Tu Carrito Está Vacío</p>
            <button
              type="button"
              onClick={closeCart}
              className="cursor-pointer bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
            >
              Explorar Productos
            </button>
          </div>
        )}

        {hasItems && (
          <div className="shrink-0 border-t border-gray-200 bg-white px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Subtotal ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
              </span>
              <span className="text-lg font-semibold text-gray-900">{cart.subtotalFormatted}</span>
            </div>
            <p className="mt-0.5 text-sm font-medium text-[#7bc19e] md:text-base">
              3 Cuotas Sin Interés de <span className="font-bold">${arNumber(installmentPriceCents / 100)}</span>
            </p>

            <a
              href={checkoutUrl}
              className="mt-4 flex w-full items-center justify-center rounded-xs bg-[#f4bb52] py-4 text-lg font-bold uppercase tracking-widest text-primary transition-colors hover:bg-[#e99f16]"
            >
              Comprar
            </a>
            <p className="mt-2 text-center text-xs text-gray-700">Compra 100% Segura por Mercado Pago</p>
          </div>
        )}
      </div>
    </>
  );
}
