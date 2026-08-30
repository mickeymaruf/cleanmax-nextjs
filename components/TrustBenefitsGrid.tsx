import Image from "next/image";

interface GridImage {
  src: string;
  alt?: string;
}

interface BrandValue {
  icon?: GridImage;
  title: string;
  text: string;
}

export interface TrustBenefitsGridProps {
  /** Top grid — left tile (merchant-editable) */
  leftImage?: GridImage;
  leftImageMobile?: GridImage;
  leftLink?: string;
  /** Top grid — right tile (merchant-editable) */
  rightImage?: GridImage;
  rightImageMobile?: GridImage;
  rightLink?: string;
  /** Headline (merchant-editable) */
  headline: string;
  /** Up to 3 brand value blocks (merchant-editable) */
  values: BrandValue[];
  /** Button (merchant-editable) */
  btnLabel?: string;
  btnLink?: string;
}

function GridTile({
  image,
  imageMobile,
  link,
}: {
  image?: GridImage;
  imageMobile?: GridImage;
  link?: string;
}) {
  if (!image && !imageMobile) return null;

  return (
    <a href={link ?? "#"} className="relative overflow-hidden">
      {image && (
        <Image
          src={image.src}
          alt={image.alt ?? ""}
          width={1200}
          height={800}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={`w-full h-auto object-cover ${
            imageMobile ? "hidden lg:block" : ""
          }`}
        />
      )}
      {imageMobile && (
        <Image
          src={imageMobile.src}
          alt={image?.alt ?? ""}
          width={800}
          height={533}
          sizes="100vw"
          className={`w-full h-auto object-cover ${image ? "block lg:hidden" : ""}`}
        />
      )}
    </a>
  );
}

export default function TrustBenefitsGrid({
  leftImage,
  leftImageMobile,
  leftLink,
  rightImage,
  rightImageMobile,
  rightLink,
  headline,
  values,
  btnLabel,
  btnLink,
}: TrustBenefitsGridProps) {
  const hasTopGrid = Boolean(leftImage || leftImageMobile || rightImage || rightImageMobile);

  return (
    <div className="py-8 lg:py-14 bg-linear-to-b from-[#def6fc] via-[#EEFAFD] to-white">
      <div className="max-w-[1240px] mx-auto px-4 lg:px-8">
        {hasTopGrid && (
          <div className="grid grid-cols-2 gap-4 lg:gap-8 mb-10 lg:mb-18">
            <GridTile image={leftImage} imageMobile={leftImageMobile} link={leftLink} />
            <GridTile image={rightImage} imageMobile={rightImageMobile} link={rightLink} />
          </div>
        )}

        <div className="text-center">
          <h2 className="lg:w-3/5 mx-auto text-2xl lg:text-[38px] font-bold text-[#001689] leading-tight mb-10">
            {headline}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-5 mb-10 lg:mb-3">
            {values.map((value, i) => (
              <div key={i} className="flex lg:flex-col gap-6 lg:gap-0 items-center px-4">
                <div className="w-28 lg:h-28 mb-6">
                  {value.icon && (
                    <Image
                      src={value.icon.src}
                      alt={value.icon.alt ?? ""}
                      width={112}
                      height={112}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  )}
                </div>
                <div className="flex flex-col items-start text-left lg:items-center lg:text-center">
                  <h3 className="font-myriad-pro-condensed text-xl lg:text-[28px] font-bold uppercase text-slate-600 mb-2 lg:mb-3">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-xs lg:text-base">{value.text}</p>
                </div>
              </div>
            ))}
          </div>

          {btnLabel && (
            <a
              href={btnLink ?? "#"}
              className="inline-block bg-[#000d8c] text-white font-bold px-4 lg:px-6 py-3 lg:py-4.5 uppercase tracking-widest rounded-xs text-sm hover:bg-blue-800 transition-colors"
            >
              {btnLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
