export interface NavLink {
  label: string;
  href: string;
}

// Mirrors Shopify's "main-menu" link list — shared by Header and Footer.
// Static for now — will come from the WooCommerce menu once that's wired up.
export const MAIN_MENU_LINKS: NavLink[] = [
  { label: "Anti Hongos", href: "/productos/antihongo" },
  { label: "Anti Grasa", href: "/productos/antigrasa" },
  { label: "Quita Sarro", href: "/productos/quita-sarro" },
  { label: "Restaura Vidrios", href: "/productos/restaura-vidrios" },
  { label: "Quita Manchas", href: "/productos/quita-manchas" },
];

export const SHOP_ALL_LINK: NavLink = { label: "Ver Todos", href: "/productos" };
