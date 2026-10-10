import Link from "next/link";
import {homeCopy, journeyCopy} from "../content/editorial";

export const metadata = {
  title: "Justice For All — Your rights. Your voice.",
  description: "Accessible civic information about rights, public accountability, experiences of injustice and voluntary ways to help."
};

export default function Home() {
  return (
    <div className="wrap">
      <header className="public-hero">
        <p className="eyebrow">{homeCopy.eyebrow}</p>
        <h1>{homeCopy.heading}</h1>
        <p className="lede">{homeCopy.summary}</p>
        <div className="actions">
          <Link className="primary" href="/stories">Learn about telling your story</Link>
          <Link className="secondary" href="/initiatives">Explore initiatives</Link>
        </div>
      </header>
      <section aria-labelledby="paths-heading" className="public-section">
        <p className="eyebrow">Start where you are</p>
        <h2 id="paths-heading">There is no single way to seek justice.</h2>
        <p>You may have experienced a violation, witnessed one, been pressured to participate, or simply come away from an encounter unsure what the law permits. You do not need a case history or a political affiliation to explore this site.</p>
        <ul className="public-journeys">
          {journeyCopy.map(item => (
            <li className="public-journey" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href}>{item.action}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="principles-heading" className="public-section">
        <h2 id="principles-heading">Rights are not conditional on popularity or power.</h2>
        <p>Our starting point is that every person deserves dignity, accurate information, fair treatment, and the freedom to ask questions of public institutions.</p>
        <p><Link href="/principles">Read our principles</Link> and <Link href="/about">learn about the movement</Link>.</p>
      </section>
      <section aria-labelledby="status" className="public-section public-status">
        <h2 id="status">{homeCopy.statusHeading}</h2>
        <p>{homeCopy.statusText}</p>
        <p><strong>Please do not send sensitive testimony or personal evidence through this website.</strong> Future sensitive submissions will use a separately assessed service with explicit consent and publication choices.</p>
      </section>
    </div>
  );
}
