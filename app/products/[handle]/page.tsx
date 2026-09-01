import { notFound } from "next/navigation";
import ProductDetails, { type ProductDetailsProps } from "@/components/ProductDetails";
import ProductDescription from "@/components/ProductDescription";
import ComparisonChart from "@/components/ComparisonChart";
import ProductReviews from "@/components/ProductReviews";
import Faq from "@/components/Faq";
import { getProductBySlug } from "@/lib/woocommerce";

// Shipping/payment info and trust badges are store-wide policy, not per-product data —
// same content on every PDP, same as the live Shopify site's schema defaults.
const TRUST_MARKERS: ProductDetailsProps["trustMarkers"] = [
  {
    icon: { src: "https://cleanmax.com.ar/cdn/shop/files/svgviewer-png-output_1.png?v=1779734319" },
    text: "<strong>Despacho en 24hs</strong>",
  },
  {
    icon: { src: "https://cleanmax.com.ar/cdn/shop/files/svgviewer-png-output.png?v=1779734285" },
    text: "<strong>Compra Segura</strong>",
  },
];

const STICKY_BADGES: ProductDetailsProps["stickyBadges"] = [
  {
    icon: { src: "https://cleanmax.com.ar/cdn/shop/files/svgviewer-png-output_1.png?v=1779734319" },
    text: "Envío Gratis",
  },
  {
    icon: { src: "https://cleanmax.com.ar/cdn/shop/files/svgviewer-png-output.png?v=1779734285" },
    text: "Compra 100% Segura",
  },
];

const SHIPPING_HTML = `<p><strong>¿Cuáles son los costos de envío?</strong></p><p>Ofrecemos envíos gratis a todo el país<strong><br><br>¿Cuáles son los tiempos de entrega?</strong></p><ul><li>CABA de 3 a 5 días hábiles.</li><li>GBA y Buenos Aires (int.) de 3 a 5 días hábiles.</li><li>Resto del país de 3 a 6 días hábiles.</li></ul>`;
const PAYMENT_HTML = `<p><strong>3 Cuotas Sin Interés</strong>&nbsp;todos los dias</p><p>Compra <strong>100% segura</strong> con tarjeta de débito o crédito. </p>`;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductBySlug(handle);

  if (!product) {
    notFound();
  }

  // Only "antihongo" has its bullet points/bundle tiers/marketing sections authored so far —
  // the other 4 products get the dynamic ProductDetails fields with no mismatched mold-specific copy below.
  const isAntihongo = handle === "antihongo";

  return (
    <main className="flex-1">
      <ProductDetails
        productId={product.id}
        title={product.title}
        subtitle={isAntihongo ? "Eliminá moho sin esfuerzo!" : undefined}
        images={product.images}
        rating={product.rating}
        ratingCount={product.ratingCount}
        bulletPoints={
          isAntihongo
            ? [
                "Fórmula avanzada que ataca la raíz",
                "Resultados visibles y duraderos",
                "Sin formaldehído, seguro para tu familia",
                "Apto para baños, cocinas, placares y empapelados",
              ]
            : []
        }
        priceCents={product.priceCents}
        priceBadgeText="ENVÍO GRATIS"
        bundleTiers={
          isAntihongo
            ? [
                {
                  label: "Una Botella",
                  quantity: 1,
                  discountedPriceCents: 2995000,
                  priceText: "$29.950/Unidad",
                  image: {
                    src: "https://cleanmax.com.ar/cdn/shop/files/Captura_de_pantalla_2026-06-06_a_la_s_3.40.18_p._m._360x.png?v=1780771266",
                  },
                },
                {
                  label: "Dos Botellas",
                  quantity: 2,
                  discountedPriceCents: 2995000,
                  priceText: "$23.600/Unidad",
                  savingText: "Ahorrá 20%",
                  badge: { text: "MÁS POPULAR", bgColor: "#079D22" },
                  image: {
                    src: "https://cleanmax.com.ar/cdn/shop/files/Captura_de_pantalla_2026-06-06_a_la_s_3.40.13_p._m._360x.png?v=1780771263",
                  },
                },
                {
                  label: "Tres Botellas",
                  quantity: 3,
                  discountedPriceCents: 2995000,
                  priceText: "$19,175/Unidad",
                  savingText: "Ahorrá 35%",
                  badge: { text: "35% OFF", bgColor: "#C20A0A" },
                  image: {
                    src: "https://cleanmax.com.ar/cdn/shop/files/Captura_de_pantalla_2026-06-06_a_la_s_3.39.03_p._m._360x.png?v=1780771177",
                  },
                },
              ]
            : undefined
        }
        trustMarkers={TRUST_MARKERS}
        stickyBadges={STICKY_BADGES}
        descriptionHtml={product.descriptionHtml}
        ingredientsTitle="ENVÍOS"
        ingredientsHtml={SHIPPING_HTML}
        impactTitle="FORMAS DE PAGO"
        impactHtml={PAYMENT_HTML}
      />
      {isAntihongo && (
        <>
        <ProductDescription
          heading="La única fórmula que penetra la raíz del moho y lo elimina en minutos"
          features={[
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_25_may_2026_10_24_48_a.m..png?v=1779715576",
              },
              title: "Fórmula triple acción avanzada",
              text: "<p>Descompone el moho automáticamente, neutraliza completamente el olor a humedad y crea una barrera invisible que evita que vuelva.</p>",
            },
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_25_may_2026_10_27_55_a.m..png?v=1779715696",
              },
              title: "Apto Para múltiples superficies",
              text: "<p>Actúa en paredes, techos, baños, cerámicos, madera y empapelado.</p>",
            },
          ]}
          heroImageMobile={{
            src: "https://cleanmax.com.ar/cdn/shop/files/IMG_7138.jpg?v=1779719444",
          }}
          heroImageDesktop={{
            src: "https://cleanmax.com.ar/cdn/shop/files/IMG_7138.jpg?v=1779719444",
          }}
        />
        <ProductDescription
          layoutAlignment="right"
          backgroundGradient="linear-gradient(180deg, rgba(255, 255, 255, 1) 62%, rgba(255, 255, 255, 1) 84.892%, rgba(255, 255, 255, 1) 100%)"
          heading="Resultados Comprobados"
          subheading="<p>Nuestra tecnología <strong>EnzyMax</strong> penetra la mancha antes de que se fije.<br> Lo que antes quedaba impregnado, ahora desaparece en el primer lavado.</p>"
          features={[
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_25_may_2026_10_52_13_a.m..png?v=1779717155",
              },
              title: "Elimina Desde la Raíz",
              text: "<p>En pruebas internas, CleanMax eliminó el <strong>99% de las colonias de moho</strong> desde la primera aplicación.</p>",
            },
          ]}
          heroImageMobile={{
            src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_25_may_2026_11_07_43_a.m..png?v=1779718088",
          }}
          heroImageDesktop={{
            src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_25_may_2026_11_03_56_a.m..png?v=1779718063",
          }}
        />
        <ComparisonChart
          features={[
            { text: "Ataca el moho desde la raíz" },
            { text: "Neutraliza el olor a humedad" },
            { text: "Ayuda a prevenir que vuelva" },
            { text: "Resultados Efectivos" },
          ]}
          products={[
            {
              name: "CLEANMAX",
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/PACK_1.png?v=1780770448",
              },
              bgColor: "#53d34b",
              checkColor: "#006760",
              hasFeature: [true, true, true, true],
            },
            {
              name: "LAVANDINA",
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/lavandina-removebg-preview.png?v=1780773611",
              },
              bgColor: "#f0ec61",
              checkColor: "#910036",
              hasFeature: [false, false, false, false],
            },
          ]}
        />
        <ProductReviews
          badgeText="4.8/5 · Más de 12,000 hogares felices"
          heading="Lo Que Dicen Nuestros Clientes"
          subheading="Resultados reales en hogares reales."
          reviews={[
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_6_jun_2026_05_10_24_p.m..png?v=1780776651",
                alt: "No lo podiamos creer",
              },
              title: "No lo podiamos creer",
              text: "<p>Tenía el techo del baño negro hace meses. Lo usé casi sin esperanza y al rato estaba limpio. Con mi marido estamos muy felices. </p>",
              author: "Alejandra G.",
              date: "2026-05-04",
            },
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/IMG_6031.heic?v=1780750740",
                alt: "Increíble desde el primer uso",
              },
              title: "Increíble desde el primer uso",
              text: "<p>Literalmente lo rocias, esperás un poco y listo. Yo pensé que era exagerado pero no. El moho que tenía en la ducha se fue</p>",
              author: "Mariela G.",
              date: "2024-03-11",
            },
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_6_jun_2026_05_02_10_p.m..png?v=1780776146",
                alt: "Adiós humedad negra",
              },
              title: "Adiós humedad negra",
              text: "<p>Estaba harta de refregar y que a la semana volviera todo. Esto funciona. Ya van dos meses y se mantuvo limpio</p>",
              author: "Carolina M.",
              date: "2026-04-14",
            },
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_6_jun_2026_04_53_39_p.m..png?v=1780775666",
                alt: "Recupere mis paredes",
              },
              title: "Recupere mis paredes",
              text: "<p>Probé de todo. Vinagre, lavandina, bicarbonato. Nada. Con esto la primera vez ya se notó la diferencia.</p>",
              author: "Sonia D.",
              date: "2026-05-29",
            },
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/Captura_de_pantalla_2026-06-06_a_la_s_10.01.29_a._m..png?v=1780750911",
                alt: "Lo eliminó desde la raíz",
              },
              title: "Lo eliminó desde la raíz",
              text: "<p>Lo que más me sorprendió es que no volvió. Con la lavandina a los 15 días estaba igual. Esto fue hace tres meses y el baño sigue igual de limpio.</p>",
              author: "Lucía R.",
              date: "2026-02-03",
            },
            {
              image: {
                src: "https://cleanmax.com.ar/cdn/shop/files/ChatGPT_Image_6_jun_2026_05_04_59_p.m..png?v=1780776567",
                alt: "Resultados rápidos y duraderos",
              },
              title: "Resultados rápidos y duraderos",
              text: "<p>Lo usé el domingo y el martes cuando fui al baño me di cuenta que los hongos no volvieron. A mi me súper funcionó! </p>",
              author: "Andrea V.",
              date: "2026-06-05",
            },
          ]}
        />
        <Faq
          heading="Preguntas Frecuentes"
          items={[
            {
              question: "¿Cómo se usa?",
              answer:
                "<p><strong>1) Ventilá</strong> el ambiente abriendo puertas y ventanas. <strong><br>2) Rociá</strong> a 10-15 cm de distancia sobre la zona afectada. <strong><br>3) Esperá 5 minutos</strong> y pasá un paño limpio.</p>",
            },
            {
              question: "¿En qué superficies se puede usar?",
              answer:
                "<p>Es apto para <strong>azulejos, juntas de cerámicos, paredes pintadas al <br>látex, placares, zapateros, puertas de madera maciza, cielorraso de <br>durlock e incluso empapelado vintage</strong>.</p>",
            },
            {
              question: "¿Es seguro para mi familia?",
              answer:
                "<p>Cleanmax es <strong>libre de formaldehído</strong> y químicos agresivos. Es apto para usar en hogares con niños pequeños y adultos mayores con sensibilidad respiratoria. </p>",
            },
            {
              question: "¿Qué medida trae el envase?",
              answer:
                "<p>Cada unidad trae <strong>500ml</strong> en formato spray con gatillo profesional.</p><p>Rinde aproximadamente <strong>30-40 aplicaciones</strong> dependiendo del tamaño de la zona afectada.</p>",
            },
            {
              question: "¿Cuánto tarda el envío?",
              answer:
                "<p>El envío demora entre <strong>3 a 7 días hábiles</strong> a todo el país. Vas a recibir un correo con el código de seguimiento cuando tu pedido sea despachado.</p>",
            },
          ]}
        />
        </>
      )}
    </main>
  );
}
