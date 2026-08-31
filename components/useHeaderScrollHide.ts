"use client";

import { useEffect, useRef } from "react";

/**
 * Sticky header that slides up to replace the announcement bar once the user scrolls
 * down past it, and restores both on scroll-up. Based on cleanmax-reference/assets/global.js,
 * extended to run at all widths (the reference only wired this up for mobile).
 * Actual motion/positioning lives in app/globals.css.
 */
export function useHeaderScrollHide<T extends HTMLElement>() {
  const headerRef = useRef<T>(null);

  useEffect(() => {
    const header = headerRef.current;
    const announcement = document.getElementById("AnnouncementBar");
    let lastScrollTop = 0;

    function handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const announceHeight = announcement?.offsetHeight ?? 0;
      document.documentElement.style.setProperty(
        "--announce-height-neg",
        `-${announceHeight}px`
      );

      if (scrollTop > lastScrollTop && scrollTop > 50) {
        announcement?.classList.add("is-scrolled-up");
        header?.classList.add("is-scrolled-up");
      } else if (lastScrollTop - scrollTop > 10) {
        announcement?.classList.remove("is-scrolled-up");
        header?.classList.remove("is-scrolled-up");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return headerRef;
}
