import type { Metadata } from "next";
import { silka, myriadProCondensed } from "./fonts";
import Announcement from "@/components/Announcement";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";
import { MAIN_MENU_LINKS, SHOP_ALL_LINK } from "@/components/navigation";
import { getCheckoutUrl } from "@/lib/woocommerce-cart";
import { getFreeShippingThresholdCents } from "@/lib/woocommerce-admin";
import "./globals.css";

const SITE_TITLE = "Clean Max - Limpieza Definitiva";
const SITE_DESCRIPTION =
  "CleanMax ofrece productos de limpieza efectivos para el hogar, diseñados para eliminar grasa, sarro, moho, manchas y suciedad difícil. Descubrí fórmulas prácticas, potentes y fáciles de usar para mantener cada espacio limpio, fresco y renovado.";
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s – CleanMax",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_TITLE,
    images: [{ url: "/og-image.png", width: 1672, height: 941 }],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const freeShippingThresholdCents = await getFreeShippingThresholdCents();

  return (
    <html
      lang="es"
      className={`${silka.variable} ${myriadProCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <div className="lg:sticky lg:top-0 lg:z-[110]">
            <Announcement
              text="Free Shipping on all orders over $50"
              bgColor="#000d8c"
              textColor="#ffffff"
            />
            <Header />
          </div>
          <CartDrawer
            checkoutUrl={getCheckoutUrl()}
            freeShippingThresholdCents={freeShippingThresholdCents}
          />
          {children}
          <Footer
            bgColor="#000e8a"
            accentColor="#60d3ff"
            menus={[
              { title: "Productos", links: [...MAIN_MENU_LINKS, SHOP_ALL_LINK] },
            ]}
            contact={{
              title: "NECESITÁS AYUDA?",
              text: "Horarios de Atención: Lunes a Viernes \nde 9 a 18hs.",
              newsletterHeading: "SUSCRIBITE Y RECIBÍ 10% OFF",
              newsletterPlaceholder: "Dirección de email",
              newsletterButtonText: "RECIBIR",
            }}
            social={{
              facebook:
                "https://www.facebook.com/people/Cleanmax/61590397002099/",
              instagram: "https://instagram.com/cleanmax.com.ar",
            }}
            safetyIcon={{
              src: "https://cleanmax.com.ar/cdn/shop/files/out-of-reach_70x70_f70a8083-f7ef-4e31-8c5c-d3be9d18da91_100x.png?v=1778520768",
            }}
            safetyText="Como todo producto de limpieza y detergentes para el hogar, mantener fuera del alcance de niños y mascotas."
            copyrightSuffix=". Todos los derechos reservados."
          />
        </CartProvider>
      </body>
    </html>
  );
}
