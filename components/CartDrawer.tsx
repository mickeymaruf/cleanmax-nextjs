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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
      <path d="M19 13H5v-2h14v2z" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 20 20" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M9 15.1094C9 15.6617 9.44772 16.1094 10 16.1094C10.5523 16.1094 11 15.6617 11 15.1094V11.1094H15C15.5523 11.1094 16 10.6617 16 10.1094C16 9.55709 15.5523 9.10938 15 9.10938H11V5.10938C11 4.55709 10.5523 4.10938 10 4.10938C9.44772 4.10938 9 4.55709 9 5.10937V9.10938H5C4.44772 9.10938 4 9.55709 4 10.1094C4 10.6617 4.44772 11.1094 5 11.1094H9V15.1094Z"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="size-5 shrink-0 text-[#1f9d57]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
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
    <div
      className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary"
      aria-hidden="true"
    />
  );
}

export default function CartDrawer({
  checkoutUrl,
  freeShippingThresholdCents,
}: {
  checkoutUrl: string;
  /** From WooCommerce's own Free Shipping method minimum order amount — null hides the banner */
  freeShippingThresholdCents: number | null;
}) {
  const { cart, isOpen, isPending, updateQuantity, removeItem, closeCart } = useCart();
  const hasItems = cart.items.length > 0;
  const installmentPriceCents = cart.subtotal / 3;
  const freeShippingRemainingCents = freeShippingThresholdCents
    ? freeShippingThresholdCents - cart.subtotal
    : 0;
  const freeShippingPercent = freeShippingThresholdCents
    ? Math.min(100, (cart.subtotal / freeShippingThresholdCents) * 100)
    : 0;

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
          <div className="flex basis-2/12 items-center justify-start" />
          <div className="pointer-events-none flex basis-8/12 items-center justify-center">
            <h2 className="uppercase text-base font-semibold text-inherit tracking-widest">Carrito</h2>
          </div>
          <div className="flex basis-2/12 items-center justify-end">
            <button
              type="button"
              onClick={closeCart}
              aria-label="Cerrar carrito"
              className="cursor-pointer p-2 text-white transition-colors hover:text-white/60"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {hasItems && (
          <div className="bg-white">
            {freeShippingThresholdCents != null &&
              (freeShippingRemainingCents > 0 ? (
                <div className="border-0 border-b border-solid border-[#cfe6d8] bg-[#e8f4ed] px-5 py-3.5">
                  <p className="m-0 mb-2 text-center text-sm font-medium text-gray-900">
                    Agregá ${arNumber(freeShippingRemainingCents / 100)} más para envío gratis
                  </p>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#d4e5da]">
                    <div
                      className="h-full rounded-full bg-[#3cbf6f] transition-all duration-500"
                      style={{ width: `${freeShippingPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="border-0 border-b border-solid border-[#cfe6d8] bg-[#e8f4ed] px-5 py-3.5">
                  <div className="flex items-center justify-center gap-2">
                    <CheckIcon />
                    <span className="text-sm font-medium text-gray-900">Felicitaciones, tu envío es gratis!</span>
                  </div>
                </div>
              ))}

            <div className="border-0 border-b border-solid border-gray-200 px-5 py-4">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3 space-y-1">
                  <span className="body block text-lg font-semibold">
                    Subtotal ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
                  </span>
                </div>
                <span className="body text-right text-lg font-semibold">{cart.subtotalFormatted}</span>

                <div className="col-span-full mt-0.5 text-[#7bc19e] text-sm md:text-base font-medium">
                  3 Cuotas Sin Interés de{" "}
                  <span className="font-bold">${arNumber(installmentPriceCents / 100)}</span>
                </div>
              </div>
              <div className="mt-3 grid gap-2">
                <a
                  href={checkoutUrl}
                  className="flex w-full items-center justify-center rounded-xs bg-[#f4bb52] py-4 text-lg font-bold uppercase tracking-widest text-primary-800 transition-colors hover:bg-[#e99f16] hover:text-primary-900"
                >
                  Comprar
                </a>
                <p className="body text-center text-xs text-gray-700">Compra 100% Segura por Mercadopago</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {hasItems ? (
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.key} className="flex flex-col border-b last:border-b-0 border-primary-200 mb-4">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex w-full">
                      <Link href={item.url} className="w-20 shrink-0">
                        <Image
                          src={item.image.src}
                          alt={item.image.alt}
                          width={80}
                          height={80}
                          unoptimized
                          className="h-20 w-20 object-cover"
                        />
                      </Link>

                      <div className="flex grow flex-col space-y-3 text-left pl-4">
                        <div className="space-y-2">
                          <Link href={item.url} className="hover:underline">
                            <h3 className="text-sm text-gray-900 font-bold">{item.name}</h3>
                          </Link>
                        </div>

                        {item.size && (
                          <p className="text-sm text-gray-800 font-medium">{item.size}</p>
                        )}
                      </div>
                    </div>

                    {/*
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Eliminar ${item.name}`}
                      className="shrink-0 cursor-pointer p-1 text-gray-400 transition hover:text-gray-700"
                    >
                      <RemoveIcon />
                    </button>
                    */}
                  </div>

                  <div className="flex flex-col pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center outline outline-gray-300">
                          <button
                            type="button"
                            onClick={() =>
                              item.quantity <= 1
                                ? removeItem(item.key)
                                : updateQuantity(item.key, item.quantity - 1)
                            }
                            aria-label="Restar una unidad"
                            className="flex cursor-pointer items-center justify-center p-1.5 text-primary transition hover:bg-primary/10"
                          >
                            <MinusIcon />
                          </button>
                          <div className="flex h-6 w-6 items-center justify-center text-center text-sm font-medium">
                            <span className="sr-only">Cantidad:</span>
                            {item.quantity}
                          </div>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                            aria-label="Sumar una unidad"
                            className="flex cursor-pointer items-center justify-center p-1.5 text-primary transition hover:bg-primary/10"
                          >
                            <PlusIcon />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="flex items-center whitespace-nowrap">
                          {item.originalLineTotal && (
                            <span className="line-through text-sm text-gray-400">
                              <span className="sr-only">Precio regular</span>
                              {item.originalLineTotal}
                            </span>
                          )}
                          <span className="font-semibold ml-2 text-lg text-gray-900">
                            <span className="sr-only">Precio actual</span>
                            {item.lineTotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm font-medium text-gray-500 mb-4">Tu Carrito Está Vacío</p>
              <button
                type="button"
                onClick={closeCart}
                className="cursor-pointer bg-primary px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
              >
                Explorar Productos
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
