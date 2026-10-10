import type { Metadata } from "next";
import type { ReactNode } from "react";
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
          <a href="/" className="brand">Justice For All</a>
          <nav aria-label="Main navigation">
            <a href="/about">About</a>
            <a href="/initiatives">Initiatives</a>
            <a href="/get-involved">Get involved</a>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer>
          <span>Justice For All</span>
          <span>Information only. Sensitive submissions are not accepted on this site.</span>
        </footer>
      </body>
    </html>
  );
}
