import Link from "next/link";

export const metadata = {
  title: "Sharing Experiences — Justice For All",
  description: "How the planned testimony initiative will handle consent, private submissions, and evidence."
};

export default function StoriesInformation() {
  return (
    <article className="wrap public-article">
      <p className="eyebrow">The Injustice Project — information</p>
      <h1>Your experience matters.</h1>
      <p className="lede">Not every rights concern begins with an arrest or an accusation. Some people are witnesses, some are pressured to cooperate with wrongdoing, and others need help understanding what happened to them.</p>
      <section aria-labelledby="choices">
        <h2 id="choices">A future service must offer clear choices</h2>
        <p>Before accepting an account, the dedicated Injustice Project must explain what stays private, what could become public, whether identity-obscuring options are available, how publication consent works, and the practical limits of confidentiality.</p>
        <p>Publishing an allegation does not establish that it has been independently verified. The platform must preserve that distinction and offer correction or review pathways.</p>
      </section>
      <section aria-labelledby="not-live">
        <h2 id="not-live">Story submission is not available yet</h2>
        <p><strong>Do not send testimony, identity documents, recordings or personal evidence to this informational website.</strong> We have not enabled a protected submission channel here.</p>
        <p><Link href="/initiatives">Explore other initiatives</Link> or <Link href="/privacy">read the privacy notice</Link>.</p>
      </section>
    </article>
  );
}
