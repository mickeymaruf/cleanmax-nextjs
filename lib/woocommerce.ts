import type { Product } from "@/components/ProductCard";

const WOOCOMMERCE_URL = process.env.WOOCOMMERCE_URL;

if (!WOOCOMMERCE_URL) {
  throw new Error("Missing WOOCOMMERCE_URL environment variable");
}

const STORE_API_URL = `${WOOCOMMERCE_URL}/wp-json/wc/store/v1`;

interface WCStoreProductImage {
  src: string;
  thumbnail: string;
  alt: string;
}

interface WCStoreProductAttribute {
  name: string;
  terms: { name: string }[];
}

interface WCStoreProductPrices {
  price: string;
  currency_code: string;
  currency_minor_unit: number;
}

interface WCStoreProduct {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  average_rating: string;
  review_count: number;
  images: WCStoreProductImage[];
  attributes: WCStoreProductAttribute[];
  prices: WCStoreProductPrices;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatPrice(prices: WCStoreProductPrices): string {
  const amount = Number(prices.price) / 10 ** prices.currency_minor_unit;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: prices.currency_code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getSize(attributes: WCStoreProductAttribute[]): string {
  return attributes.find((attr) => attr.name === "Size")?.terms[0]?.name ?? "";
}

function toProduct(wc: WCStoreProduct): Product {
  return {
    title: wc.name,
    url: `/products/${wc.slug}`,
    image: {
      src: wc.images[0]?.src ?? "",
      alt: wc.images[0]?.alt || wc.name,
    },
    rating: Number(wc.average_rating),
    ratingCount: wc.review_count,
    shortDescription: stripHtml(wc.short_description),
    size: getSize(wc.attributes),
    price: formatPrice(wc.prices),
  };
}

/** Products marked "Featured" in WooCommerce (merchant-editable, mirrors the Shopify collection picker) */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const res = await fetch(
    `${STORE_API_URL}/products?featured=true&per_page=${limit}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`WooCommerce Store API error: ${res.status} ${res.statusText}`);
  }

  const data: WCStoreProduct[] = await res.json();
  return data.map(toProduct);
}

export interface ProductGalleryImage {
  src: string;
  thumbSrc?: string;
  alt?: string;
}

export interface ProductPageData {
  title: string;
  images: ProductGalleryImage[];
  rating: number;
  ratingCount: number;
  /** Value * 100, matching ProductDetails' `priceCents` convention */
  priceCents: number;
  /** Full HTML product description — feeds the "overview" tab */
  descriptionHtml: string;
}

/** Single product by its WooCommerce slug (the `[handle]` route param). Returns null if not found. */
export async function getProductBySlug(slug: string): Promise<ProductPageData | null> {
  const res = await fetch(
    `${STORE_API_URL}/products?slug=${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error(`WooCommerce Store API error: ${res.status} ${res.statusText}`);
  }

  const data: WCStoreProduct[] = await res.json();
  const wc = data[0];
  if (!wc) return null;

  return {
    title: wc.name,
    images: wc.images.map((img) => ({
      src: img.src,
      thumbSrc: img.thumbnail,
      alt: img.alt || wc.name,
    })),
    rating: Number(wc.average_rating),
    ratingCount: wc.review_count,
    priceCents: Math.round(
      (Number(wc.prices.price) / 10 ** wc.prices.currency_minor_unit) * 100
    ),
    descriptionHtml: wc.description,
  };
}
