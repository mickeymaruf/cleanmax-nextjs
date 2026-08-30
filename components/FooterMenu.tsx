"use client";

import { useRef, useState } from "react";
import type { NavLink } from "./navigation";

interface FooterMenuProps {
  title: string;
  links: NavLink[];
  accentColor: string;
}

export default function FooterMenu({ title, links, accentColor }: FooterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div className="accordion-wrapper border-0 border-b border-solid border-white md:hidden">
        <button
          className="accordion w-full py-4 flex justify-between items-center font-bold uppercase tracking-widest text-xs"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          {title}
          <span className={`icon-plus text-lg transition-transform ${isOpen ? "" : "rotate-180"}`}>
            ^
          </span>
        </button>
        <div
          ref={panelRef}
          className="panel overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: isOpen ? `${panelRef.current?.scrollHeight ?? 500}px` : "0px" }}
        >
          <ul className="text-left pb-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className="inline-block py-3 px-3 text-white transition hover:opacity-50 underline"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="hidden md:block">
        <h2
          className="subtitle mb-4 font-bold uppercase tracking-widest text-sm"
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <ul className="text-left">
          {links.map((link) => (
            <li key={link.href}>
              <a
                className="inline-block py-2 text-white transition hover:opacity-50 no-underline hover:underline"
                href={link.href}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
