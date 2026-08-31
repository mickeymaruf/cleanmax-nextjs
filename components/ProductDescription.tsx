import Image from "next/image";

interface DescriptionImage {
  src: string;
  alt?: string;
}

interface DescriptionFeature {
  image?: DescriptionImage;
  title: string;
  text: string;
}

export interface ProductDescriptionProps {
  /** Desktop layout: content left/image right, or reversed (merchant-editable) */
  layoutAlignment?: "left" | "right";
  /** Section background gradient (merchant-editable) */
  backgroundGradient?: string;
  /** Heading (merchant-editable) */
  heading: string;
  /** Rich text subheading, rendered as HTML (merchant-editable) */
  subheading?: string;
  /** Feature rows (merchant-editable blocks) */
  features: DescriptionFeature[];
  /** Rich text fine print, rendered as HTML (merchant-editable) */
  footerText?: string;
  /** Hero image, desktop (merchant-editable) */
  heroImageDesktop?: DescriptionImage;
  /** Hero image, mobile (merchant-editable) */
  heroImageMobile?: DescriptionImage;
}

export default function ProductDescription({
  layoutAlignment = "left",
  backgroundGradient = "linear-gradient(180deg, #FFFFFF 0%, #DEF6FC 100%)",
  heading,
  subheading,
  features,
  footerText,
  heroImageDesktop,
  heroImageMobile,
}: ProductDescriptionProps) {
  const contentOrder = layoutAlignment === "left" ? "lg:order-1" : "lg:order-2";
  const imageOrder = layoutAlignment === "left" ? "lg:order-2" : "lg:order-1";

  return (
    <section
      className="overflow-hidden"
      style={{ background: backgroundGradient }}
      aria-labelledby="product-description-heading"
    >
      <div className="mx-auto max-w-[1240px] px-6 py-8">
        <div className="flex flex-col items-center gap-14 lg:flex-row">
          <div className={`order-2 lg:w-[62%] ${contentOrder}`}>
            <div className="mb-10 text-center lg:text-left">
              <h2
                id="product-description-heading"
                className="mb-4 text-[32px] font-semibold tracking-[-1px] text-[#001a72] md:text-[40px] lg:leading-[50px]"
              >
                {heading}
              </h2>
              {subheading && (
                <div
                  className="mx-auto max-w-[500px] text-base leading-relaxed text-gray-800 md:text-xl lg:max-w-none"
                  dangerouslySetInnerHTML={{ __html: subheading }}
                />
              )}
            </div>

            <div className="space-y-12 text-gray-700">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left"
                >
                  <div className="h-[120px] w-[120px] flex-shrink-0">
                    {feature.image && (
                      <Image
                        src={feature.image.src}
                        alt={feature.image.alt ?? ""}
                        width={240}
                        height={240}
                        className="h-full w-full rounded-full object-contain"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-myriad-pro-condensed mb-1 font-sans text-[32px] font-black uppercase tracking-tight text-[#333] lg:text-[40px]">
                      {feature.title}
                    </h3>
                    <div
                      className="text-[15px] leading-tight lg:text-[20px]"
                      dangerouslySetInnerHTML={{ __html: feature.text }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {footerText && (
              <div
                className="mt-12 border-t pt-4 text-center text-sm text-gray-500 lg:text-left"
                dangerouslySetInnerHTML={{ __html: footerText }}
              />
            )}
          </div>

          <div className={`order-1 w-full lg:flex-1 ${imageOrder}`}>
            <div className="relative mx-auto max-w-[500px] overflow-hidden rounded-xs shadow-sm lg:max-w-none">
              {heroImageMobile && (
                <Image
                  src={heroImageMobile.src}
                  alt={heroImageMobile.alt ?? ""}
                  width={800}
                  height={1000}
                  sizes="100vw"
                  className="block h-auto w-full lg:hidden"
                />
              )}
              {heroImageDesktop && (
                <Image
                  src={heroImageDesktop.src}
                  alt={heroImageDesktop.alt ?? ""}
                  width={1000}
                  height={1250}
                  sizes="(min-width: 1024px) 62vw, 100vw"
                  className="hidden h-auto w-full lg:block"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
