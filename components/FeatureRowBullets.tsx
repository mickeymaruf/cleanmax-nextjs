import Image from "next/image";

interface Bullet {
  text: string;
}

export interface FeatureRowBulletsProps {
  /** Heading (merchant-editable) */
  title: string;
  /** Rich text subtext, rendered as HTML (merchant-editable) */
  subtext?: string;
  /** Bullet points (merchant-editable blocks) */
  bullets: Bullet[];
  /** Button (merchant-editable) */
  btnLabel?: string;
  btnLink?: string;
  /** Featured image (merchant-editable) */
  image?: { src: string; alt?: string };
}

export default function FeatureRowBullets({
  title,
  subtext,
  bullets,
  btnLabel,
  btnLink,
  image,
}: FeatureRowBulletsProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto bg-[#def6fc] p-4 lg:mt-[55px]">
        <div className="flex flex-col lg:flex-row items-stretch gap-12">
          <div className="flex-1 px-6 lg:p-20 pr-0 order-2 lg:order-1 max-w-xl mx-auto lg:mx-0">
            <h2 className="w-3/4 text-2xl lg:text-[32px] font-bold text-black/70 leading-[1.1] mb-3 lg:mb-6">
              {title}
            </h2>

            <div
              className="lg:text-lg text-slate-600 leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: subtext ?? "" }}
            />

            <div className="space-y-2.5 mb-10">
              {bullets.map((bullet, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="w-5 h-4 flex items-center justify-center">
                    <Image
                      src="https://cleanmax.com.ar/cdn/shop/t/7/assets/dropp-shape-bg--darkblue.webp?v=29473586236997477781781091228"
                      alt=""
                      width={20}
                      height={16}
                    />
                  </div>
                  <span className="font-myriad-pro-condensed text-2xl font-bold uppercase text-slate-700 mt-2">
                    {bullet.text}
                  </span>
                </div>
              ))}
            </div>

            {btnLabel && (
              <a
                href={btnLink ?? "#"}
                className="inline-block bg-[#000d8c] text-white font-bold px-4 lg:px-6 py-3 lg:py-4.5 uppercase tracking-wider text-sm hover:bg-blue-800 transition-all duration-300 rounded-xs"
              >
                {btnLabel}
              </a>
            )}
          </div>

          <div className="flex-1 order-1 lg:order-2">
            <div className="relative w-full h-full aspect-square bg-white overflow-hidden">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt ?? ""}
                  width={1200}
                  height={1200}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full h-full object-cover block"
                />
              ) : (
                <p className="text-center w-full h-full flex items-center justify-center text-xl text-blue-900">
                  Image Not Found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
