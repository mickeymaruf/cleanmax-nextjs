import Hero from "@/components/Hero";
import TrustBenefitsGrid from "@/components/TrustBenefitsGrid";

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
    </main>
  );
}
