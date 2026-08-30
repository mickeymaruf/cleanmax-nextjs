"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/clean-max-logo.png";
import { useHeaderScrollHide } from "./useHeaderScrollHide";

interface GrandChildLink {
  title: string;
  href: string;
}

interface ChildLink {
  title: string;
  links?: GrandChildLink[];
}

interface NavLink {
  label: string;
  href: string;
  children?: ChildLink[];
}

interface PromoButton {
  title: string;
  subtitle: string;
  link: string;
  bgColor: string;
  borderColor: string;
  titleColor: string;
  subtitleColor: string;
}

// Static for now — will come from the WooCommerce menu once that's wired up.
const NAV_LINKS: NavLink[] = [
  { label: "Anti Hongos", href: "/products/antihongo" },
  { label: "Anti Grasa", href: "/products/antigrasa" },
  { label: "Quita Sarro", href: "/products/quita-sarro" },
  { label: "Restaura Vidrios", href: "/products/restaura-vidrios" },
  { label: "Quita Manchas", href: "/products/quita-manchas" },
];

const CTA_LINK: NavLink = { label: "Ver Todos", href: "/collections/shop-all" };

// No blocks configured yet — same as the Liquid schema's empty default block list.
const PROMO_BUTTONS: PromoButton[] = [];

// Right-side desktop menu + trailing mobile-drawer menu — empty until a second menu is wired up.
const RIGHT_MENU_LINKS: NavLink[] = [];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const headerRef = useHeaderScrollHide<HTMLElement>();

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        id="MainHeader"
        ref={headerRef}
        className="site-header relative bg-white lg:border-b lg:border-gray-100"
      >
        <div className="relative top-0.5 mx-auto flex w-full max-w-7xl items-center px-4 lg:px-14 py-3 md:py-4">
          <div className="flex w-1/3 lg:w-fit lg:grow lg:basis-auto header-left">
            <button
              className="lg:hidden bg-transparent border-none shadow-none outline-none p-4 transition hover:opacity-50"
              aria-label="Open menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg
                width="18"
                height="12"
                viewBox="0 0 18 12"
                fill="none"
                shapeRendering="crispEdges"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect fill="#001689" height="2" width="18" x="0" y="0" />
                <rect fill="#001689" height="2" width="18" x="0" y="5" />
                <rect fill="#001689" height="2" width="18" x="0" y="10" />
              </svg>
            </button>

            <div className="hidden lg:flex items-center justify-start lg:pl-0 lg:pr-4">
              <a href="/" className="w-20 lg:w-24 flex items-center" aria-label="CleanMax">
                <Image
                  src={Logo}
                  alt="CleanMax"
                  className="h-auto w-20 lg:w-24"
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 1024px) 6rem, 5rem"
                  placeholder="blur"
                />
              </a>
            </div>

            <nav className="header-menu-new hidden lg:flex flex-grow items-center justify-start gap-2 flex-shrink-0">
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="relative group tracking-wider">
                  <a
                    href={link.href}
                    className="inline-flex items-center justify-center uppercase text-sm font-semibold py-3 px-5 text-[#001689] hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </a>

                  {link.children && link.children.length > 0 && (
                    <div className="header-flyout opacity-0 invisible group-hover:opacity-100 group-hover:visible absolute left-[-200%] right-[-200%] top-full z-50 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto">
                      <div className="fixed inset-0 bg-black/20 -z-10" />
                      <div className="bg-white border-t border-gray-100 shadow-xl pb-10">
                        <div className="max-w-screen-xl mx-auto px-6 lg:px-14 flex py-8 gap-8">
                          {link.children.map((child) => (
                            <div key={child.title} className="flex-1">
                              <div className="flex items-center gap-4 mb-5">
                                <h3 className="text-sm font-bold uppercase text-gray-800">
                                  {child.title}
                                </h3>
                                <hr className="flex-1 border-t border-blue-100" />
                              </div>
                              <div className="grid grid-cols-1 gap-3">
                                {child.links?.map((grandchild) => (
                                  <a
                                    key={grandchild.href}
                                    href={grandchild.href}
                                    className="flex items-center gap-3 p-3 rounded border border-transparent hover:border-blue-200 hover:bg-blue-50 transition-all"
                                  >
                                    <span className="text-xs font-bold uppercase text-blue-900">
                                      {grandchild.title}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="relative group tracking-wider">
                <a
                  href={CTA_LINK.href}
                  className="inline-flex items-center justify-center uppercase text-sm font-semibold py-1 px-5 ml-2 bg-[#BAEBFF] text-[#001689] rounded-full hover:bg-blue-200 transition-colors whitespace-nowrap"
                >
                  {CTA_LINK.label}
                </a>
              </div>
            </nav>
          </div>

          <div className="flex-1 flex justify-center lg:hidden">
            <a href="/" aria-label="Home">
              <Image
                src={Logo}
                alt="CleanMax"
                className="h-auto w-20"
                sizes="5rem"
                placeholder="blur"
              />
            </a>
          </div>

          <div className="header-right flex w-1/3 lg:grow lg:basis-auto items-center justify-end gap-4">
            <div className="hidden lg:flex items-center gap-6 mr-4">
              {RIGHT_MENU_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="uppercase text-sm font-semibold text-[#001689] hover:text-blue-600 transition-colors whitespace-nowrap tracking-wider"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Cart drawer + live item count wiring is a separate task; static placeholder for now */}
            <button
              id="cart-btn"
              className="relative p-4 text-[#001689] hover:text-blue-600 transition cursor-pointer"
              aria-label="Open cart"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="cart-count-badge absolute top-1.5 right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-black/50 z-[200] transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 left-0 z-[200] flex flex-col w-[360px] max-w-[85%] h-[100dvh] bg-white shadow-2xl transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex h-16 w-full shrink-0 items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center">
            <a href="/" aria-label="Home">
              <Image src={Logo} alt="CleanMax" className="h-auto w-20" sizes="5rem" />
            </a>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-[#001689] hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5L19 19M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-4 pb-12">
          {PROMO_BUTTONS.length > 0 && (
            <div className="text-[#001689] grid grid-cols-2 gap-4 px-8 pb-4">
              {PROMO_BUTTONS.map((promo) => (
                <a
                  key={promo.title}
                  href={promo.link}
                  className="flex flex-col items-center justify-center text-center px-1 py-3 border border-solid transition-colors"
                  style={{ backgroundColor: promo.bgColor, borderColor: promo.borderColor }}
                >
                  <span
                    className="font-myriad-pro-condensed uppercase text-xl font-semibold leading-4"
                    style={{ color: promo.titleColor }}
                  >
                    {promo.title}
                  </span>
                  <span className="text-xs mt-1 leading-4" style={{ color: promo.subtitleColor }}>
                    {promo.subtitle}
                  </span>
                </a>
              ))}
            </div>
          )}

          <nav className="flex flex-col text-[#001689]">
            {NAV_LINKS.map((link) =>
              link.children && link.children.length > 0 ? (
                <div key={link.href} className="w-full">
                  <button
                    className="flex w-full items-center justify-between px-8 py-4 font-bold uppercase bg-transparent"
                    onClick={() =>
                      setOpenAccordion(openAccordion === link.href ? null : link.href)
                    }
                  >
                    {link.label}
                    <svg
                      className={`transition-transform duration-300 ${
                        openAccordion === link.href ? "rotate-180" : ""
                      }`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {openAccordion === link.href && (
                    <div className="bg-blue-50 overflow-hidden">
                      <div className="flex flex-col py-2">
                        {link.children.flatMap((c) => c.links ?? []).map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            className="px-10 py-3 text-sm font-medium hover:bg-white/50"
                          >
                            {child.title}
                          </a>
                        ))}
                        <a
                          href={link.href}
                          className="px-10 py-4 text-xs font-black text-blue-700 underline uppercase"
                        >
                          View All {link.label}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-8 py-4 font-bold uppercase tracking-wider"
                >
                  {link.label}
                </a>
              )
            )}

            {RIGHT_MENU_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-8 py-4 font-bold uppercase border-t border-gray-50"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
