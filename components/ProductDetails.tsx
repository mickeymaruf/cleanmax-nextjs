"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import StarRating from "./StarRating";
import { useCart } from "./CartProvider";

interface GalleryImage {
  src: string;
  /** Pre-cropped square variant used for thumbnails; falls back to `src` */
  thumbSrc?: string;
  alt?: string;
}

interface BundleTierBadge {
  text: string;
  bgColor: string;
  textColor?: string;
}

interface BundleTier {
  label: string;
  quantity: number;
  discountedPriceCents: number;
  priceText: string;
  savingText?: string;
  badge?: BundleTierBadge;
  image: { src: string };
}

interface TrustMarker {
  icon: { src: string };
  /** Rendered as HTML — supports inline tags like <strong> (merchant-editable) */
  text: string;
}

interface PaymentIcon {
  src: string;
  alt: string;
  heightClass?: string;
}

const DEFAULT_PAYMENT_ICONS: PaymentIcon[] = [
  {
    src: "https://cdn.shopify.com/s/files/1/0620/8438/2886/files/icons8-mastercard-logo_1.svg?v=1674839239",
    alt: "Mastercard",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0620/8438/2886/files/icons8-visa_1_1.svg?v=1674839239",
    alt: "Visa",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0620/8438/2886/files/mercadopago4848_1.svg?v=1674839239",
    alt: "Mercado Pago",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0620/8438/2886/files/naranjax4848_1.svg?v=1674839239",
    alt: "Naranja X",
    heightClass: "h-4",
  },
  {
    src: "https://cdn.shopify.com/s/files/1/0620/8438/2886/files/icons8-american-express_1.svg?v=1674839239",
    alt: "American Express",
  },
];

export interface ProductDetailsProps {
  /** WooCommerce numeric product id, used to add this product to the cart */
  productId: number;
  /** Product title (merchant-editable) */
  title: string;
  /** Subtitle metafield (merchant-editable) */
  subtitle?: string;
  /** Gallery images (merchant-editable) */
  images: GalleryImage[];
  /** Reviews rating metafield (merchant-editable) */
  rating: number;
  ratingCount: number;
  /** "Excellent" prefix label (merchant-editable) */
  excellentText?: string;
  /** Highlight bullet blocks (merchant-editable) */
  bulletPoints: string[];
  /** Base variant price, in the Shopify money-as-integer-cents form (merchant-editable) */
  priceCents: number;
  /** Price badge, e.g. "Envío Gratis" (merchant-editable) */
  priceBadgeText?: string;
  priceWithoutTaxLabel?: string;
  taxExclusionFactor?: number;
  installmentsCount?: number;
  paymentIcons?: PaymentIcon[];
  /** Product bundle quantity tiers (merchant-editable, metaobject-backed) */
  bundleTiers?: BundleTier[];
  /** Two trust marker badges shown under the price (merchant-editable) */
  trustMarkers: [TrustMarker, TrustMarker];
  /** Badges shown in the mobile sticky bar — same icons, different copy (merchant-editable) */
  stickyBadges: [TrustMarker, TrustMarker];
  addToCartLabel?: string;
  addingToCartLabel?: string;
  descriptionTitle?: string;
  /** Rich text product description, rendered as HTML (merchant-editable) */
  descriptionHtml: string;
  ingredientsTitle?: string;
  /** Rich text metafield, rendered as HTML (merchant-editable) */
  ingredientsHtml?: string;
  impactTitle?: string;
  /** Rich text metafield, rendered as HTML (merchant-editable) */
  impactHtml?: string;
  stickyButtonLabel?: string;
}

function arNumber(n: number) {
  return Math.floor(n).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function CheckmarkIcon() {
  return (
    <svg width="26" height="26" viewBox="5 5 54 54">
      <circle cx="32" cy="32" r="25" fill="#4285F4" />
      <path
        d="M22 33L30 41L43 25"
        fill="none"
        stroke="white"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProductDetails({
  productId,
  title,
  subtitle,
  images,
  rating,
  ratingCount,
  excellentText = "EXCELENTE",
  bulletPoints,
  priceCents,
  priceBadgeText,
  priceWithoutTaxLabel = "Precio sin impuestos nacionales: ",
  taxExclusionFactor = 0.8266,
  installmentsCount = 3,
  paymentIcons = DEFAULT_PAYMENT_ICONS,
  bundleTiers = [],
  trustMarkers,
  stickyBadges,
  addToCartLabel = "AGREGAR AL CARRITO",
  addingToCartLabel = "AGREGANDO...",
  descriptionTitle = "Descripción",
  descriptionHtml,
  ingredientsTitle = "Ingredients",
  ingredientsHtml,
  impactTitle = "Impact",
  impactHtml,
  stickyButtonLabel = "PROBÁ CLEAN MAX",
}: ProductDetailsProps) {
  const [mainImage, setMainImage] = useState(images[0]?.src ?? "");
  const [activeTab, setActiveTab] = useState<"overview" | "ingredients" | "impact">("overview");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState(() =>
    bundleTiers.length > 0 ? Math.floor(bundleTiers.length / 2) : -1,
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [stickyBarHidden, setStickyBarHidden] = useState(true);
  const { addItem, openCart } = useCart();

  const selectedTier = selectedTierIndex >= 0 ? bundleTiers[selectedTierIndex] : undefined;
  const selectedDiscountedPriceCents = selectedTier?.discountedPriceCents ?? priceCents;

  const displayPrice = useMemo(
    () => arNumber(selectedDiscountedPriceCents / 100),
    [selectedDiscountedPriceCents],
  );
  const installmentPrice = useMemo(
    () => arNumber(selectedDiscountedPriceCents / 100 / installmentsCount),
    [selectedDiscountedPriceCents, installmentsCount],
  );
  const priceWithoutNationalTax = useMemo(
    () => arNumber((selectedDiscountedPriceCents / 100) * taxExclusionFactor),
    [selectedDiscountedPriceCents, taxExclusionFactor],
  );

  // Hides the mobile sticky CTA while the main product block or the footer is on screen.
  useEffect(() => {
    const productSection = sectionRef.current;
    const footerSection = document.querySelector("footer");
    if (!productSection) return;

    let isProductVisible = false;
    let isFooterVisible = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === productSection) isProductVisible = entry.isIntersecting;
          if (entry.target === footerSection) isFooterVisible = entry.isIntersecting;
        }
        setStickyBarHidden(isProductVisible || isFooterVisible);
      },
      { threshold: 0.05 },
    );

    observer.observe(productSection);
    if (footerSection) observer.observe(footerSection);

    return () => observer.disconnect();
  }, []);

  async function handleAddToCart() {
    if (isAdding) return;
    setIsAdding(true);
    const success = await addItem(productId, selectedTier?.quantity ?? 1);
    setIsAdding(false);
    if (success) openCart();
  }

  function scrollToBundleOrCart() {
    const target = document.getElementById("bundleSection") ?? document.getElementById("mainAddToCart");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section
      id="ProductBlockSection"
      ref={sectionRef}
      className="relative max-w-7xl mx-auto lg:px-4 pb-12 lg:py-12 flex flex-col lg:flex-row items-start gap-12"
    >
      {/* LEFT SIDE: Product Gallery */}
      <div className="w-full lg:w-[65%] lg:sticky lg:top-0 h-fit">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="order-2 flex w-full gap-3 overflow-x-auto pb-1 md:order-1 md:w-16 md:flex-col md:overflow-visible md:pb-0 shrink-0">
            {images.map((image, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMainImage(image.src)}
                className={`aspect-square h-16 w-16 shrink-0 cursor-pointer overflow-hidden outline transition-all hover:outline-primary ${
                  mainImage === image.src ? "outline-3 outline-primary" : "outline-1 outline-gray-200"
                }`}
              >
                <Image
                  src={image.thumbSrc ?? image.src}
                  alt={image.alt ?? title}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="order-1 flex-1 md:order-2">
            <Image
              src={mainImage || images[0]?.src || ""}
              alt={title}
              width={800}
              height={800}
              sizes="(min-width: 1024px) 65vw, 100vw"
              className="w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Product Info */}
      <div className="flex w-full flex-col px-4 lg:w-[35%] lg:px-0">
        {/* Reviews & Title */}
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold uppercase tracking-wider text-gray-700">{excellentText}</span>
          <StarRating rating={rating} color="#fb923c" sizeClass="text-xl lg:text-2xl" />
          <span className="ml-1 text-sm text-gray-700">
            {rating} ({ratingCount})
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tighter text-gray-900">{title}</h1>

        {subtitle && <p className="mt-2 text-base font-medium text-gray-500">{subtitle}</p>}

        <div className="mb-5 mt-4 flex flex-col gap-2 text-gray-800">
          {bulletPoints.map((text, i) => (
            <div key={i} className="flex items-start gap-3 text-sm font-semibold md:text-base">
              <span className="shrink-0 text-[#4a77fa]">
                <CheckmarkIcon />
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-3xl font-bold text-[#003366]">${displayPrice}</span>

            {priceBadgeText && (
              <span className="inline-flex select-none items-center rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white md:text-sm">
                {priceBadgeText}
              </span>
            )}
          </div>

          {priceWithoutTaxLabel && (
            <p className="mt-1 text-base font-semibold text-gray-500">
              {priceWithoutTaxLabel}
              <span>${priceWithoutNationalTax}</span>
            </p>
          )}

          <div className="mb-4 mt-2 text-[#7bc19e]">
            <div className="flex items-center gap-1 text-lg font-medium md:text-xl">
              <span>
                <strong className="text-xl md:text-2xl">{installmentsCount}</strong>
              </span>
              <span>cuotas sin interés de</span>
              <span className="font-bold">${installmentPrice}</span>
            </div>

            <div className="mt-2 flex items-center gap-3 opacity-90">
              {paymentIcons.map((icon, i) => (
                // Small decorative payment logos — plain <img> avoids next/image's SVG optimization requirements.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={icon.src}
                  className={`${icon.heightClass ?? "h-6"} w-auto`}
                  width={24}
                  height={24}
                  alt={icon.alt}
                />
              ))}
            </div>
          </div>
        </div>

        {bundleTiers.length > 0 && (
          <div id="bundleSection" style={{ scrollMarginTop: 300 }} className="mb-6 grid select-none grid-cols-3 gap-2.5">
            {bundleTiers.map((tier, i) => {
              const selected = i === selectedTierIndex;
              return (
                <button
                  key={i}
                  type="button"
                  data-bundle-tier=""
                  onClick={() => setSelectedTierIndex(i)}
                  className={`relative flex min-h-[190px] flex-col items-center rounded p-3 pt-6 text-center outline-3 transition-all ${
                    selected
                      ? "bg-[#f1f7f1] outline-[#3b663b]"
                      : "border border-gray-300 bg-white outline-transparent hover:outline-[#3b663b]"
                  }`}
                >
                  {tier.badge && (
                    <div
                      className="absolute -top-3 left-0 right-0 mx-auto w-fit whitespace-nowrap rounded-md px-4 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white md:text-xs"
                      style={{ backgroundColor: tier.badge.bgColor, color: tier.badge.textColor ?? "#ffffff" }}
                    >
                      {tier.badge.text}
                    </div>
                  )}

                  <div className="mb-3 h-32 w-full">
                    <Image
                      src={tier.image.src}
                      alt={tier.label}
                      width={360}
                      height={360}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold leading-tight text-gray-900">{tier.label}</h3>
                    <p className="mt-1 text-sm font-medium text-gray-700">{tier.priceText}</p>
                    {tier.savingText && (
                      <p className="mt-1 text-xs font-bold text-gray-900">{tier.savingText}</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Trust Markers */}
        <div className="mb-8 flex gap-4 text-gray-600">
          {trustMarkers.map((marker, i) => (
            <div key={i} className="flex items-center gap-3 text-sm font-medium">
              <Image src={marker.icon.src} alt="" width={40} height={40} className="h-6 w-6 object-contain" />
              <span dangerouslySetInnerHTML={{ __html: marker.text }} />
            </div>
          ))}
        </div>

        {/* Add to Cart */}
        <button
          id="mainAddToCart"
          type="button"
          disabled={isAdding}
          onClick={handleAddToCart}
          className={`group mb-4 flex w-full cursor-pointer items-center justify-center rounded-xs px-5 py-4 text-lg font-bold uppercase tracking-wider transition-all ${
            isAdding
              ? "cursor-not-allowed bg-[#2E4D00] text-white opacity-75"
              : "bg-[#9edc18] text-primary hover:bg-[#2E4D00] hover:text-white"
          }`}
        >
          <span>{isAdding ? addingToCartLabel : addToCartLabel}</span>
        </button>

        {/* Tabs */}
        <div className="mt-5">
          <div className="mb-4 flex gap-8 border-b border-primary-100">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`font-myriad-pro-condensed pb-2 text-xl uppercase transition-all ${
                activeTab === "overview" ? "border-b-2 border-primary font-bold text-primary" : "text-gray-500"
              }`}
            >
              {descriptionTitle}
            </button>

            {ingredientsHtml && (
              <button
                type="button"
                onClick={() => setActiveTab("ingredients")}
                className={`font-myriad-pro-condensed pb-2 text-xl uppercase transition-all ${
                  activeTab === "ingredients" ? "border-b-2 border-primary font-bold text-primary" : "text-gray-500"
                }`}
              >
                {ingredientsTitle}
              </button>
            )}

            {impactHtml && (
              <button
                type="button"
                onClick={() => setActiveTab("impact")}
                className={`font-myriad-pro-condensed pb-2 text-xl uppercase transition-all ${
                  activeTab === "impact" ? "border-b-2 border-primary font-bold text-primary" : "text-gray-500"
                }`}
              >
                {impactTitle}
              </button>
            )}
          </div>

          {activeTab === "overview" && (
            <div
              className="prose max-w-none leading-snug prose-strong:font-bold prose-strong:text-gray-700 prose-li:mb-3!"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          )}

          {activeTab === "ingredients" && ingredientsHtml && (
            <div
              className="prose max-w-none leading-snug prose-strong:font-bold prose-strong:text-gray-700 prose-li:mb-3!"
              dangerouslySetInnerHTML={{ __html: ingredientsHtml }}
            />
          )}

          {activeTab === "impact" && impactHtml && (
            <div
              className="prose max-w-none leading-snug prose-strong:font-bold prose-strong:text-gray-700 prose-li:mb-3!"
              dangerouslySetInnerHTML={{ __html: impactHtml }}
            />
          )}
        </div>
      </div>

      {/* Mobile sticky CTA bar */}
      <div
        className={`fixed bottom-0 left-0 z-40 block w-full bg-white px-2 py-2 transition-all duration-300 sm:hidden ${
          stickyBarHidden ? "invisible opacity-0" : "visible opacity-100"
        }`}
      >
        <button
          type="button"
          onClick={scrollToBundleOrCart}
          className="group mb-4 flex w-full cursor-pointer items-center justify-center rounded-xs bg-[#9edc18] px-5 py-4 text-lg font-bold uppercase tracking-wider text-primary transition-all hover:bg-[#2E4D00] hover:text-white"
        >
          <span>{stickyButtonLabel}</span>
        </button>

        <div className="flex items-center justify-between gap-2 px-8">
          {stickyBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5">
                <Image src={badge.icon.src} alt="" width={32} height={32} className="object-contain" />
              </div>
              <span
                className="text-[11px] font-semibold"
                dangerouslySetInnerHTML={{ __html: `<strong>${badge.text}</strong>` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
