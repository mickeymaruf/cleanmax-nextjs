import Image from "next/image";
import StarRating from "./StarRating";
import ProductPurchaseOptions from "./ProductPurchaseOptions";

export interface Product {
  /** WooCommerce numeric product id, used to add this product to the cart */
  id: number;
  title: string;
  url: string;
  image: { src: string; alt?: string };
  rating: number;
  ratingCount: number;
  shortDescription: string;
  size: string;
  price: string;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="lg:h-[600px] group relative bg-white flex gap-4 lg:gap-0 lg:flex-col border border-transparent lg:hover:border-gray-100 lg:hover:shadow-lg transition-all duration-300 lg:p-3.5">
      <div className="w-[45%] lg:w-full mb-4">
        <a href={product.url}>
          <Image
            src={product.image.src}
            alt={product.image.alt ?? product.title}
            width={600}
            height={600}
            sizes="(min-width: 1024px) 25vw, 45vw"
            unoptimized
            className="aspect-square w-full lg:h-full object-cover"
          />
        </a>
      </div>

      <div className="flex-1">
        {/* Standard View */}
        <a className="flex flex-col flex-grow" href={product.url}>
          <div className="flex items-center lg:mb-1">
            <StarRating rating={product.rating} color="#fb923c" sizeClass="text-xl lg:text-2xl" />
            <span className="text-xs lg:text-lg text-gray-700 ml-1">
              {product.rating} ({product.ratingCount})
            </span>
          </div>
          <h3 className="text-base lg:text-xl font-bold text-[#222] leading-tight mb-2">
            {product.title}
          </h3>
        </a>

        <div className="lg:group-hover:hidden text-[11px] leading-[13.2px] lg:leading-tight text-gray-700 lg:text-base">
          <p className="lg:border-t lg:border-gray-300 lg:pt-2 text-[11px] lg:text-base mb-2 leading-[13.2px] lg:leading-tight text-gray-700">
            {product.shortDescription}
          </p>

          <div className="mt-auto flex justify-between items-center pt-2">
            <span className="text-sm lg:text-base font-light">{product.size}</span>
            <span className="text-sm lg:text-lg lg:font-bold text-[#222]">{product.price}</span>
          </div>

          <div className="mt-3 lg:hidden w-full">
            <div className="bg-[#BAEBFF] p-3 leading-none">
              <a
                href={product.url}
                className="leading-none flex items-center justify-center text-[#001689] text-xs font-bold uppercase w-full h-full tracking-wider"
              >
                <span>VER MÁS</span>
              </a>
            </div>
          </div>
        </div>

        {/* Hover View (Desktop Only) */}
        <div className="hidden lg:group-hover:block">
          <ProductPurchaseOptions
            productId={product.id}
            productUrl={product.url}
            size={product.size}
            price={product.price}
          />
        </div>
      </div>

      {/*
        Mobile Quick Add Modal — kept for structural parity with product-card.liquid.
        The trigger that opens it is commented out in the reference theme too, so this
        stays unreachable (always `hidden`) until that mobile quick-add entry point ships.
      */}
      <div
        className="js-mobile-quick-add-modal fixed inset-0 z-[100] hidden items-start justify-center overflow-y-auto bg-gray-900/60 pt-0 md:pt-4 p-4 lg:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="scent-consolidation-modal relative mx-auto w-full max-w-md bg-white">
          <button
            className="js-mobile-quick-add-close absolute right-0 top-0 z-50 bg-white border-0 pt-1 pr-1.5"
            type="button"
            aria-label="Close"
          >
            <svg className="h-6 w-6 transition hover:opacity-50" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          <div className="space-y-4 p-4">
            <div className="flex grow flex-col gap-4 text-left mt-3">
              <div>
                <p className="subtitle text-xs sm:text-sm">Laundry</p>
                <h3 className="font-bold text-lg">{product.title}</h3>
              </div>
            </div>
            <ProductPurchaseOptions
            productId={product.id}
            productUrl={product.url}
            size={product.size}
            price={product.price}
          />
          </div>
        </div>
      </div>
    </div>
  );
}
