import ProductCard, { type Product } from "./ProductCard";

export interface ProductListProps {
  /** Heading (merchant-editable) */
  title: string;
  /** First 4 products from the configured collection (merchant-editable) */
  products: Product[];
  /** Outer section container classes — defaults to the featured-collection (home) styling */
  containerClassName?: string;
  /** Heading classes — defaults to the featured-collection (home) styling */
  headingClassName?: string;
}

export default function ProductList({
  title,
  products,
  containerClassName = "max-w-[1440px] mx-auto px-5 pt-8 pb-16 lg:py-12",
  headingClassName = "text-xl md:text-2xl font-bold text-center text-[#001689] uppercase tracking-wider mb-7 lg:mb-10",
}: ProductListProps) {
  return (
    <div className={containerClassName}>
      <h2 className={headingClassName}>{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 lg:gap-x-3">
        {products.map((product) => (
          <ProductCard key={product.url} product={product} />
        ))}
      </div>
    </div>
  );
}
