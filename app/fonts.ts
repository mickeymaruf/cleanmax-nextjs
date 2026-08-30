import localFont from "next/font/local";

// Default site-wide font (matches theme's `* { font-family: "Silka" }`)
export const silka = localFont({
  src: [
    {
      path: "./fonts/silka/silka-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/silka/silka-medium.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/silka/silka-semibold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-silka",
  display: "swap",
});

// Accent font for specific elements (matches theme's `.font-myriad-pro-condensed`)
export const myriadProCondensed = localFont({
  src: [
    {
      path: "./fonts/myriad-pro-condensed/myriad-pro-condensed-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/myriad-pro-condensed/myriad-pro-condensed-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/myriad-pro-condensed/myriad-pro-condensed-semibold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-myriad-pro-condensed",
  display: "swap",
  // Used in only a few places, not site-wide — skip the automatic
  // preload link so pages that don't render it avoid the extra request.
  preload: false,
});
