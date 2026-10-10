import Link from "next/link";

export const metadata = {
  title: "About Justice For All",
  description: "What Justice For All is, who can participate and how it relates to civic institutions."
};

export default function About() {
  return (
    <article className="wrap public-article">
      <p className="eyebrow">About the movement</p>
      <h1>Justice For All</h1>
      <p className="lede">A civic effort to make injustice visible, help people understand their rights, and support voluntary action toward accountability.</p>
      <section aria-labelledby="everyone">
        <h2 id="everyone">Who is this for?</h2>
        <p>Anyone trying to understand or respond to a violation of rights, whether it involves an arrest, a protest, a government encounter, coercion, a misleading assertion about the law, or another form of mistreatment. It is also for witnesses, family members, people asked to participate in wrongful conduct, and anyone who wants to help.</p>
        <p>People do not need to have been arrested, accused of a crime, publicly harmed, or politically active to belong in this conversation.</p>
      </section>
      <section aria-labelledby="mission">
        <h2 id="mission">What are we building?</h2>
        <p>The planned initiatives include a testimony archive with individual publication controls, ways to examine public records, voluntary support teams, public questions to officials, and educational resources.</p>
        <p>Each initiative will have its own status and protections. The public website does not currently accept private testimony, requests for legal representation or sensitive uploads.</p>
        <p><Link href="/initiatives">See the initiative directory</Link>.</p>
      </section>
      <section aria-labelledby="independence">
        <h2 id="independence">Independence and participation</h2>
        <p>Justice For All is presented as a civic movement, not a prerequisite for joining a political party. Reading the site or taking part in an initiative does not require a party membership or endorsement of a candidate.</p>
        <p>Participation is voluntary. Accounts of events should be handled responsibly, and individual allegations should be distinguished from independently corroborated facts.</p>
      </section>
      <section aria-labelledby="limitations">
        <h2 id="limitations">What this site does not do</h2>
        <p>Content is public-interest information, not personalized legal advice. We cannot promise confidentiality, anonymity, investigation, representation or a particular outcome from services that have not been launched.</p>
        <p><Link href="/principles">Read our principles</Link> or <Link href="/privacy">review the current privacy notice</Link>.</p>
      </section>
    </article>
  );
}
