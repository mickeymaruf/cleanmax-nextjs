import Image from "next/image";

interface ComparisonFeature {
  text: string;
}

export interface ComparisonProduct {
  name: string;
  image?: { src: string; alt?: string };
  bgColor: string;
  checkColor: string;
  /** Whether this product has each feature, aligned by index with `features` (merchant-editable per block) */
  hasFeature: boolean[];
}

export interface ComparisonChartProps {
  /** Feature rows compared across both products (merchant-editable blocks) */
  features: ComparisonFeature[];
  /** The two products being compared (merchant-editable) */
  products: [ComparisonProduct, ComparisonProduct];
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function FeatureCell({ has, color }: { has: boolean; color: string }) {
  return (
    <div className="feature-cell">
      {has && (
        <svg width="40" height="40" viewBox="0 0 40 41" fill="none">
          <path
            d="M36.0086 0.318359L11.1989 27.5976L3.99139 22.1418H0L11.1989 40.3184L40 0.318359H36.0086Z"
            fill={color}
          />
        </svg>
      )}
    </div>
  );
}

export default function ComparisonChart({ features, products }: ComparisonChartProps) {
  return (
    <section className="sm:py-14 sm:px-10 lg:px-14 xl:px-0 max-w-7xl mx-auto">
      <div className="bg-[#F0FFFD] px-4 md:px-16 py-12 sm:rounded-[10px] sm:border sm:border-[#C0FCF6] relative overflow-hidden">
        <div className="hidden md:flex mb-4">
          <div className="w-[280px] shrink-0" />
          {features.map((feature, i) => (
            <div key={i} className="flex-1 px-2 text-center">
              <p className="font-myriad-pro-condensed italic font-normal! leading-tight text-gray-700 flex items-end justify-center">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-row md:block gap-3 justify-center">
          <div className="flex-1 md:hidden mt-[90px] flex flex-col lg:justify-end pb-[10px] w-[40%]">
            {features.map((feature, i) => (
              <div
                key={i}
                className="h-[70px] lg:h-[60px] flex items-center justify-end pr-2.5 text-right text-base lg:text-xs font-myriad-pro-condensed font-normal! italic"
              >
                {feature.text}
              </div>
            ))}
          </div>

          <div className="flex-1 flex flex-row lg:flex-col gap-3 lg:gap-0">
            {products.map((product, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center w-full md:mb-4">
                <div
                  className="relative h-[80px] md:h-[72px] w-full md:w-[280px] shrink-0 flex items-end md:items-center justify-center md:justify-start md:pl-14 rounded-t-[10px] md:rounded-tr-none md:rounded-l-[10px] z-2 py-3 md:py-0"
                  style={{ backgroundColor: product.bgColor }}
                >
                  {product.image && (
                    <Image
                      src={product.image.src}
                      alt={product.image.alt ?? ""}
                      width={170}
                      height={170}
                      className="absolute top-0 md:top-1/2 left-1/2 md:left-[-30px] -translate-x-1/2 md:translate-x-0 -translate-y-1/2 md:-translate-y-1/2 drop-shadow-md w-[95px] md:w-[85px] h-auto"
                    />
                  )}
                  <p className="font-myriad-pro-condensed text-lg md:text-3xl tracking-tighter text-[#004d40]">
                    {product.name}
                  </p>
                </div>

                <div
                  className="flex flex-col md:flex-row items-center flex-grow w-full md:h-[72px] rounded-bl-[10px] rounded-br-[10px] md:rounded-bl-none md:rounded-r-[10px]"
                  style={{ backgroundColor: hexToRgba(product.bgColor, 0.6) }}
                >
                  {features.map((_, j) => (
                    <div key={j} className="flex-1 w-full h-[60px] md:h-auto flex justify-center items-center">
                      <FeatureCell has={product.hasFeature[j] ?? false} color={product.checkColor} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
