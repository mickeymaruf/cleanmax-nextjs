import Hero from "@/components/Hero";
import TrustBenefitsGrid from "@/components/TrustBenefitsGrid";
import FeatureRowBullets from "@/components/FeatureRowBullets";
import ProductList from "@/components/ProductList";
import type { Product } from "@/components/ProductCard";

const FEATURED_PRODUCTS: Product[] = [
  {
    title: "Anti Hongos",
    url: "/products/antihongo",
    image: {
      src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_5_jun_2026_11_31_19_p.m._600x600.png?v=1780713240",
    },
    rating: 4.5,
    ratingCount: 9739,
    shortDescription:
      "Fórmula avanzada que elimina el moho desde la raíz, neutraliza el olor a humedad y ayuda a prevenir su reaparición en múltiples superficies.",
    size: "500ml",
    price: "$29.950",
  },
  {
    title: "Restaura Vidrios",
    url: "/products/restaura-vidrios",
    image: {
      src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPTImage5jun2026_10_47_44p.m._600x600.png?v=1780710477",
    },
    rating: 4.5,
    ratingCount: 1756,
    shortDescription:
      "Restaurá vidrios, mamparas y espejos opacos removiendo manchas de agua, sarro y residuos adheridos. Deja las superficies más transparentes, brillantes y con acabado cristalino.",
    size: "500ml",
    price: "$27.950",
  },
  {
    title: "Anti Grasa",
    url: "/products/antigrasa",
    image: {
      src: "https://cleanmax.com.ar/cdn/shop/files/07_-_01_600x600.png?v=1779978623",
    },
    rating: 4.5,
    ratingCount: 1756,
    shortDescription:
      "Eliminá la grasa difícil de cocina en segundos. Ideal para mesadas, hornallas, campanas, azulejos y superficies lavables, dejando una limpieza profunda y fresca.",
    size: "500ml",
    price: "$9.750",
  },
  {
    title: "Quita Sarro",
    url: "/products/quita-sarro",
    image: {
      src: "https://cleanmax.com.ar/cdn/shop/files/WhatsAppImage2026-05-26at7.49.39PM_600x600.jpg?v=1780710190",
    },
    rating: 4.5,
    ratingCount: 1756,
    shortDescription:
      "Remové sarro, manchas calcáreas y residuos de agua acumulados. Perfecto para baños, griferías, mamparas, cerámicos y lavabos con acción rápida.",
    size: "500ml",
    price: "$9.950",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      <Hero
        bgColor="#ffffff"
        imageDesktop={{
          src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_6_jun_2026_01_08_10_p.m._2000x.png?v=1780762100",
          alt: "",
        }}
        imageMobile={{
          src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_5_jun_2026_11_25_13_p.m._800x.png?v=1780712738",
        }}
        title="Hecho para el Hogar"
        description="Descubrí nuestra línea completa de limpieza."
        btnLabel="VER TODO"
        btnLink="/collections/shop-all"
      />
      <ProductList title="Tu Equipo de Limpieza" products={FEATURED_PRODUCTS} />
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
