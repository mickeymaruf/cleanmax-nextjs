import Hero from "@/components/Hero";
import TrustBenefitsGrid from "@/components/TrustBenefitsGrid";
import FeatureRowBullets from "@/components/FeatureRowBullets";
import ProductList from "@/components/ProductList";
import { getFeaturedProducts } from "@/lib/woocommerce";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <main className="flex-1">
      <Hero
        bgColor="#ffffff"
        imageDesktop={{
          src: "/hero-desktop.webp",
          alt: "",
        }}
        imageMobile={{
          src: "/hero-mobile.webp",
        }}
        title="Hecho para el Hogar"
        description="Descubrí nuestra línea completa de limpieza."
        btnLabel="VER TODO"
        btnLink="/collections/shop-all"
      />
      <ProductList title="Tu Equipo de Limpieza" products={featuredProducts} />
      <TrustBenefitsGrid
        headline=""
        values={[
          {
            icon: {
              src: "https://cleanmax.com.ar/cdn/shop/files/icon-hp-powerful-cleaning_100px_525x525_51512bbc-c803-4e92-ae52-b77f178c0d81.webp?v=1778593839",
            },
            title: "Tecnología de Limpieza Avanzada",
            text: "CleanMax está desarrollado con fórmulas modernas de alto rendimiento, pensadas para resolver la limpieza diaria del hogar de forma práctica, efectiva y sin complicaciones.",
          },
          {
            icon: {
              src: "https://cleanmax.com.ar/cdn/shop/files/Captura_de_pantalla_2026-05-25_a_la_s_10.47.05_a._m..png?v=1779716867",
            },
            title: "Fórmulas Potentes",
            text: "Cada producto CleanMax está diseñado para actuar sobre distintos tipos de suciedad, manchas y superficies, ayudando a lograr resultados visibles desde la primera aplicación.",
          },
          {
            icon: {
              src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_25_may_2026_10_49_23_a.m..png?v=1779716988",
            },
            title: "Pensado para el Hogar",
            text: "Diseñado para usar en superficies del hogar como baños, paredes, techos, cerámicos y zonas con humedad. Deja los espacios más limpios, frescos y cuidados.",
          },
        ]}
      />
      <FeatureRowBullets
        title="Llevá tu limpieza al siguiente nivel"
        bullets={[
          { text: "Fórmulas Avanzadas" },
          { text: "Ingredientes de alto rendimiento" },
          { text: "Tecnología protectora" },
          { text: "Acción Rápida y Efectiva" },
        ]}
        image={{
          src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_5_jun_2026_11_25_13_p.m..png?v=1780712738",
        }}
      />
    </main>
  );
}
