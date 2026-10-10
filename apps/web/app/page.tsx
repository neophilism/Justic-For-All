import Link from "next/link";

export default function Home() {
  return (
    <div className="wrap">
      <p className="eyebrow">Civic information and accountability</p>
      <h1>Justice For All</h1>
      <p className="lede">A place to learn about peaceful civic initiatives, public records, and opportunities to contribute.</p>
      <div className="actions">
        <Link className="primary" href="/initiatives">Explore initiatives</Link>
        <Link className="secondary" href="/get-involved">Ways to help</Link>
      </div>
      <section aria-labelledby="status">
        <h2 id="status">Platform status</h2>
        <p>This website is under development. The secure story-submission, public-records action, and case-matching tools are not available through this portal yet. Please do not send sensitive testimony or personal evidence here.</p>
      </section>
    </div>
  );
}
