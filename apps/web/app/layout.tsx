import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { publicRoutes } from "../lib/public-routes";
import "./styles.css";

export const metadata: Metadata = {
  title: "Justice For All",
  description: "Public information and peaceful civic participation."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className="site-header">
          <Link href="/" className="brand">Justice For All</Link>
          <nav aria-label="Main navigation">
            {publicRoutes.filter((route) => ["/about","/principles","/initiatives","/get-involved"].includes(route.href)).map((route) => <Link key={route.href} href={route.href}>{route.label}</Link>)}
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer>
          <span>Justice For All</span>
          <nav aria-label="Legal information">
            <Link href="/privacy">Privacy</Link>{" · "}
            <Link href="/terms">Site information</Link>
          </nav>
          <span>Information only. Sensitive submissions are not accepted on this site.</span>
        </footer>
      </body>
    </html>
  );
}
