import { Fragment } from "react";
import { getImageProps } from "next/image";

export interface HeroProps {
  /** Section background color (merchant-editable) */
  bgColor: string;
  /** Desktop hero image (merchant-editable) */
  imageDesktop?: {
    src: string;
    alt?: string;
  };
  /** Mobile hero image (merchant-editable) */
  imageMobile?: {
    src: string;
  };
  /** Heading text, supports line breaks (merchant-editable) */
  title: string;
  /** Supporting description text (merchant-editable) */
  description: string;
  /** Button label (merchant-editable) */
  btnLabel: string;
  /** Button link (merchant-editable) */
  btnLink: string;
}

export default function Hero({
  bgColor,
  imageDesktop,
  imageMobile,
  title,
  description,
  btnLabel,
  btnLink,
}: HeroProps) {
  const alt = imageDesktop?.alt ?? "";

  // getImageProps + <picture> (Next's documented "Art Direction" pattern):
  // the browser still only downloads the one image matching the media query,
  // while each candidate still gets Next's responsive srcSet + format optimization.
  const desktop = imageDesktop?.src
    ? getImageProps({
        src: imageDesktop.src,
        alt,
        width: 2000,
        height: 650,
        sizes: "100vw",
        priority: true,
        fetchPriority: "high",
      })
    : null;

  const mobile = imageMobile?.src
    ? getImageProps({
        src: imageMobile.src,
        alt,
        width: 800,
        height: 600,
        sizes: "100vw",
        priority: true,
        fetchPriority: "high",
      })
    : null;

  return (
    <section
      className="relative w-full overflow-hidden flex flex-col-reverse md:block"
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative w-full pb-[75%] md:pb-0 md:h-[650px] md:absolute md:top-0 md:left-0 z-10">
        {desktop ? (
          <picture className="absolute inset-0 h-full w-full">
            {mobile && (
              <source
                media="(max-width: 767px)"
                srcSet={mobile.props.srcSet}
              />
            )}
            <img
              {...desktop.props}
              className="h-full w-full object-cover object-center md:object-right"
            />
          </picture>
        ) : mobile ? (
          <picture className="absolute inset-0 h-full w-full">
            <img
              {...mobile.props}
              className="h-full w-full object-cover object-center"
            />
          </picture>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center text-sm italic">
            Image Placeholder
          </div>
        )}
      </div>

      <div className="relative z-20 w-full md:h-[650px] flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-14 w-full">
          <div className="max-w-2xl text-center md:text-left py-8 lg:py-12 md:py-0">
            <h1 className="font-bold leading-tight tracking-tight mb-2 text-4xl md:text-6xl text-[#001a72]">
              {title.split("\n").map((line, i, arr) => (
                <Fragment key={i}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </Fragment>
              ))}
            </h1>

            <p className="text-xl md:text-2xl leading-[1.35] mb-5 mx-auto md:mx-0 text-[#111827]">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href={btnLink}
                className="px-4 md:px-6 py-3 md:py-4.5 rounded-xs text-sm font-black uppercase tracking-widest transition-all hover:opacity-90 active:scale-95 bg-[#001a72] text-[#ffffff]"
              >
                {btnLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
