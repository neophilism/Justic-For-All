import Link from "next/link";
export const metadata = {title:"Get Involved — Justice For All"};

const ways = [
 {name:"Learn and share reliable information",detail:"Read publicly available materials, check original sources, and help others find clear resources."},
 {name:"Offer professional skills",detail:"Future programs may need legal, research, translation, accessibility, journalism, arts, technical, and logistical experience."},
 {name:"Observe and document responsibly",detail:"Learn how the planned Witness Corps will organize voluntary, peaceful observation and secure review."},
 {name:"Help people find the right initiative",detail:"Understand the differences between public information, confidential assistance and records requests."}
] as const;
export default function GetInvolved() {
  return <article className="wrap public-article">
    <p className="eyebrow">Voluntary civic participation</p><h1>There are many ways to help.</h1>
    <p className="lede">You do not need a special credential, a prior encounter with the government, or membership in a political party to learn about this effort.</p>
    <ul className="public-journeys">{ways.map(item=><li key={item.name} className="public-journey"><h2>{item.name}</h2><p>{item.detail}</p></li>)}</ul>
    <section aria-labelledby="participation-status"><h2 id="participation-status">Registration is not open</h2><p>We are not currently collecting volunteer identities, contact details, confidential stories, or evidence through this site. Future participation forms will disclose their purpose, privacy choices, and availability before asking for personal data.</p><p><Link href="/initiatives">See the planned programs</Link>.</p></section>
  </article>;
}
