import Link from "next/link";
export default function NotFound() {
  return <div className="wrap"><h1>Page not found</h1><p>That page is unavailable or has moved.</p><Link href="/initiatives">Explore initiatives</Link> or <Link href="/">return home</Link>.</div>;
}
