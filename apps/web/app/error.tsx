"use client";
import Link from "next/link";
export default function ErrorPage({reset}:{reset:()=>void}) {
 return <div className="wrap" role="alert"><h1>Something went wrong</h1><p>The page could not be displayed. No information was submitted.</p><button type="button" onClick={reset}>Try again</button><p><Link href="/">Return home</Link></p></div>;
}
