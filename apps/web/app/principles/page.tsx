export const metadata = {
  title: "Principles — Justice For All",
  description: "The civic principles guiding the Justice For All platform."
};

const principles = [
  {
    title: "Rights apply to everyone",
    explanation: "People deserve to understand their rights and exercise them without needing a particular background, political affiliation, or public profile."
  },
  {
    title: "The record must be reliable",
    explanation: "First-person accounts, allegations, official documents, independent corroboration, and editorial conclusions must be identified accurately rather than blended together."
  },
  {
    title: "Consent precedes publication",
    explanation: "Sensitive identity or evidence information must not be published merely because someone privately provided it. Private review and public release are separate decisions."
  },
  {
    title: "Participation is voluntary and nonviolent",
    explanation: "People can learn, ask questions, document events, offer assistance, or participate in peaceful civic initiatives without being pressured to do more."
  },
  {
    title: "Institutions should answer questions",
    explanation: "The public benefits when official decisions, applicable rules, and original records can be questioned, examined, and corrected."
  }
] as const;

export default function PrinciplesPage() {
  return (
    <article className="wrap public-article">
      <p className="eyebrow">Our commitments</p>
      <h1>Rights belong to everyone.</h1>
      <p className="lede">Accountability should not depend on who someone is, what they have been accused of, or whether a powerful institution agrees with them.</p>
      <ol className="public-principles">
        {principles.map(item => <li key={item.title}><h2>{item.title}</h2><p>{item.explanation}</p></li>)}
      </ol>
      <section aria-labelledby="limits">
        <h2 id="limits">Practical limitations</h2>
        <p>This website is not a legal service or a confidential intake channel. Its present materials are general civic information. The protections, access controls, and review systems for future services must be implemented and verified before accepting private material.</p>
      </section>
    </article>
  );
}
