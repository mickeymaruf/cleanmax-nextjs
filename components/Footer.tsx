import Image from "next/image";
import FooterMenu from "./FooterMenu";
import type { NavLink } from "./navigation";

interface FooterMenuBlock {
  title: string;
  links: NavLink[];
}

interface FooterContact {
  title: string;
  text: string;
  /** Optional 3-column links grid (merchant-editable) */
  contactLinks?: NavLink[];
  newsletterHeading: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
}

interface FooterSocial {
  facebook?: string;
  instagram?: string;
}

export interface FooterProps {
  bgColor: string;
  accentColor: string;
  menus: FooterMenuBlock[];
  contact: FooterContact;
  social?: FooterSocial;
  safetyIcon?: { src: string; alt?: string };
  safetyText: string;
  bottomMenu?: NavLink[];
  copyrightSuffix: string;
}

export default function Footer({
  bgColor,
  accentColor,
  menus,
  contact,
  social,
  safetyIcon,
  safetyText,
  bottomMenu,
  copyrightSuffix,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      className="site-footer m-0 text-white text-center md:text-left"
      style={{ backgroundColor: bgColor }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto py-6 md:py-14 px-6 md:px-14">
        <div className="grid gap-x-4 md:gap-y-8 md:grid-cols-3 lg:grid-cols-6">
          {menus.map((menu) => (
            <FooterMenu key={menu.title} title={menu.title} links={menu.links} accentColor={accentColor} />
          ))}

          <div className="md:col-span-2 row-span-2 mt-8 md:mt-0">
            <h2
              className="subtitle mb-4 font-bold uppercase tracking-widest text-sm"
              style={{ color: accentColor }}
            >
              {contact.title}
            </h2>
            <p className="text-xs md:text-base text-white mb-7 whitespace-pre-line">{contact.text}</p>

            {contact.contactLinks && contact.contactLinks.length > 0 && (
              <div className="grid gap-4 grid-cols-3 mx-auto mb-8 max-w-sm md:mx-0">
                {contact.contactLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="w-fit text-white font-bold text-xs md:text-sm hover:underline uppercase tracking-widest"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            <ul className="flex w-full gap-5 max-w-xs mx-auto md:mx-0 mb-8">
              {social?.facebook && (
                <li>
                  <a
                    href={social.facebook}
                    className="text-white hover:opacity-50 transition-opacity block p-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" aria-hidden="true" focusable="false" viewBox="0 0 20 20">
                      <path
                        fill="currentColor"
                        d="M18.05.811q.439 0 .744.305t.305.744v16.637q0 .439-.305.744t-.744.305h-4.732v-7.221h2.415l.342-2.854h-2.757v-1.83q0-.659.293-1t1.073-.342h1.488V3.762q-.976-.098-2.171-.098-1.634 0-2.635.964t-1 2.72V9.47H7.951v2.854h2.415v7.221H1.413q-.439 0-.744-.305t-.305-.744V1.859q0-.439.305-.744T1.413.81H18.05z"
                      />
                    </svg>
                    <span className="sr-only">facebook</span>
                  </a>
                </li>
              )}
              {social?.instagram && (
                <li>
                  <a
                    href={social.instagram}
                    className="text-white hover:opacity-50 transition-opacity block p-1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" aria-hidden="true" focusable="false" viewBox="0 0 512 512">
                      <path
                        fill="currentColor"
                        d="M256 49.5c67.3 0 75.2.3 101.8 1.5 24.6 1.1 37.9 5.2 46.8 8.7 11.8 4.6 20.2 10 29 18.8s14.3 17.2 18.8 29c3.4 8.9 7.6 22.2 8.7 46.8 1.2 26.6 1.5 34.5 1.5 101.8s-.3 75.2-1.5 101.8c-1.1 24.6-5.2 37.9-8.7 46.8-4.6 11.8-10 20.2-18.8 29s-17.2 14.3-29 18.8c-8.9 3.4-22.2 7.6-46.8 8.7-26.6 1.2-34.5 1.5-101.8 1.5s-75.2-.3-101.8-1.5c-24.6-1.1-37.9-5.2-46.8-8.7-11.8-4.6-20.2-10-29-18.8s-14.3-17.2-18.8-29c-3.4-8.9-7.6-22.2-8.7-46.8-1.2-26.6-1.5-34.5-1.5-101.8s.3-75.2 1.5-101.8c1.1-24.6 5.2-37.9 8.7-46.8 4.6-11.8 10-20.2 18.8-29s17.2-14.3 29-18.8c8.9-3.4 22.2-7.6 46.8-8.7 26.6-1.3 34.5-1.5 101.8-1.5m0-45.4c-68.4 0-77 .3-103.9 1.5C125.3 6.8 107 11.1 91 17.3c-16.6 6.4-30.6 15.1-44.6 29.1-14 14-22.6 28.1-29.1 44.6-6.2 16-10.5 34.3-11.7 61.2C4.4 179 4.1 187.6 4.1 256s.3 77 1.5 103.9c1.2 26.8 5.5 45.1 11.7 61.2 6.4 16.6 15.1 30.6 29.1 44.6 14 14 28.1 22.6 44.6 29.1 16 6.2 34.3 10.5 61.2 11.7 26.9 1.2 35.4 1.5 103.9 1.5s77-.3 103.9-1.5c26.8-1.2 45.1-5.5 61.2-11.7 16.6-6.4 30.6-15.1 44.6-29.1 14-14 22.6-28.1 29.1-44.6 6.2-16 10.5-34.3 11.7-61.2 1.2-26.9 1.5-35.4 1.5-103.9s-.3-77-1.5-103.9c-1.2-26.8-5.5-45.1-11.7-61.2-6.4-16.6-15.1-30.6-29.1-44.6-14-14-28.1-22.6-44.6-29.1-16-6.2-34.3-10.5-61.2-11.7-27-1.1-35.6-1.4-104-1.4z"
                      />
                      <path
                        fill="currentColor"
                        d="M256 126.6c-71.4 0-129.4 57.9-129.4 129.4s58 129.4 129.4 129.4 129.4-58 129.4-129.4-58-129.4-129.4-129.4zm0 213.4c-46.4 0-84-37.6-84-84s37.6-84 84-84 84 37.6 84 84-37.6 84-84 84z"
                      />
                      <circle cx="390.5" cy="121.5" r="30.2" />
                    </svg>
                    <span className="sr-only">instagram</span>
                  </a>
                </li>
              )}
            </ul>

            {/* Newsletter submission isn't wired up yet — separate follow-up task, like the cart. */}
            <div className="site-footer__newsletter max-w-sm mx-auto md:mx-0">
              <form action="#" className="contact-form">
                <label
                  htmlFor="Email-footer"
                  className="subtitle mb-4 block font-bold uppercase tracking-widest text-sm"
                  style={{ color: accentColor }}
                >
                  {contact.newsletterHeading}
                </label>
                <div className="flex">
                  <input
                    type="email"
                    name="contact[email]"
                    id="Email-footer"
                    className="w-full bg-white pl-4 p-3 text-gray-700 placeholder:text-gray-400 placeholder:italic border-0 focus:ring-0"
                    placeholder={contact.newsletterPlaceholder}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#00857c] hover:bg-blue-900 text-white whitespace-nowrap px-6 font-bold uppercase tracking-widest text-sm transition hover:bg-opacity-90 cursor-pointer"
                  >
                    {contact.newsletterButtonText}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="md:col-span-3 lg:col-span-4 flex items-center space-x-4 mt-12">
            {safetyIcon && (
              <Image
                src={safetyIcon.src}
                alt={safetyIcon.alt ?? ""}
                width={48}
                height={48}
                className="w-12 h-12"
              />
            )}
            <p className="text-xs md:text-sm text-white max-w-md text-left">{safetyText}</p>
          </div>
        </div>

        <hr className="mt-14 mb-4 border-white hidden md:block" />

        <div className="mt-6 lg:mt-0 flex flex-col md:flex-row justify-between text-xs items-center">
          <div className="order-2 md:order-0 mt-6 md:mt-0">
            ©{year} CleanMax{copyrightSuffix}
          </div>
          <div className="flex order-1 md:order-0 gap-6 flex-wrap justify-center">
            {bottomMenu?.map((link) => (
              <a key={link.href} href={link.href} className="text-white underline">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
