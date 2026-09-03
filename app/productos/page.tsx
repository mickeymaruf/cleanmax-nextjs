import type { Metadata } from "next";
import ProductList from "@/components/ProductList";
import { getAllProducts } from "@/lib/woocommerce";

export const metadata: Metadata = { title: "Productos" };

export default async function ProductoPage() {
  const products = await getAllProducts();

  return (
    <main className="flex-1">
      <ProductList
        title="Todos los Productos"
        products={products}
        containerClassName="max-w-[1460px] mx-auto px-5 pt-8 pb-16 lg:py-20"
        headingClassName="pl-3 font-myriad-pro-condensed text-2xl md:text-5xl font-bold text-primary uppercase mb-7 lg:mb-14"
      />
    </main>
  );
}
