const RASTER_EXTENSION = /\.(png|jpe?g)$/i;

/**
 * EWWW Image Optimizer (running on the WooCommerce host) writes `{file}.webp` siblings
 * on disk without rewriting the original URL, so the WooCommerce Store API keeps returning
 * the un-optimized `.png`/`.jpg` path. Point <Image> at the `.webp` sibling instead.
 *
 * Only touches URLs on `wordpressHostname` — every other image host (e.g. the Shopify CDN
 * URLs still hardcoded in product pages) is returned unchanged.
 */
export function toWordPressWebp(src: string, wordpressHostname: string): string {
  if (!src) return src;

  let hostname: string;
  try {
    hostname = new URL(src).hostname;
  } catch {
    return src;
  }
  if (hostname !== wordpressHostname) return src;

  if (/\.webp$/i.test(src)) return src;
  if (RASTER_EXTENSION.test(src)) return `${src}.webp`;
  return src;
}
