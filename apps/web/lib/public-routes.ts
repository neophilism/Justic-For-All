/** Public pages available even when downstream services are offline. */
export const publicRoutes = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/principles", label: "Principles" },
  { href: "/initiatives", label: "Initiatives" },
  { href: "/get-involved", label: "Get involved" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" }
] as const;

export function findPublicRoute(pathname: string) {
  return publicRoutes.find((route) => route.href === pathname);
}
